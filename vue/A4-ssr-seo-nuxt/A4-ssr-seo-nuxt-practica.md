# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg" width="80" alt="Nuxt Logo">
</div>

## Práctica A4: SSR, SEO y Rutas de Servidor con Nuxt 3

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Práctico

Mejorar el proyecto `ppw-nuxt-intro` de A1 con meta tags completos (Open Graph + Twitter Cards + JSON-LD), y crear server routes con Nitro para no exponer la URL de la API externa directamente al cliente.

---

## Contexto

Continuamos sobre `ppw-nuxt-intro`. El backend (Nitro) actúa como proxy de la FakeStore API: el cliente no conoce la URL del servicio externo.

---

## Paso 1: Mejorar el SEO de la página de inicio

Actualiza `pages/index.vue` con Open Graph completo:

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'NuxtStore - Tienda en línea',
  description: 'Explora nuestra colección de productos con precios increíbles',
  ogTitle: 'NuxtStore - Tienda en línea',
  ogDescription: 'Explora nuestra colección de productos con precios increíbles',
  ogImage: 'https://nuxtjs.org/img/logo.png',
  ogType: 'website',
  ogUrl: 'https://nuxtstore-demo.netlify.app/',
  twitterCard: 'summary_large_image',
  twitterTitle: 'NuxtStore - Tienda en línea',
  twitterDescription: 'Explora nuestra colección de productos'
})
</script>
```

---

## Paso 2: Crear server route proxy para la API

Crea `server/api/productos/index.get.ts`:

```typescript
// El cliente llama a /api/productos (nuestro servidor)
// Nuestro servidor llama a la API externa
// El cliente nunca ve la URL real de la API

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limite = parseInt(query.limite as string) || 20

  // $fetch en el servidor es una petición directa, no pasa por la red del cliente
  const productos = await $fetch(
    `https://fakestoreapi.com/products?limit=${limite}`
  )

  return productos
})
```

Crea `server/api/productos/[id].get.ts`:

```typescript
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: 'ID de producto inválido' })
  }

  const producto = await $fetch(`https://fakestoreapi.com/products/${id}`)

  return producto
})
```

Crea `server/api/categorias.get.ts`:

```typescript
export default defineEventHandler(async () => {
  const categorias = await $fetch<string[]>(
    'https://fakestoreapi.com/products/categories'
  )
  return categorias
})
```

---

## Paso 3: Actualizar las páginas para usar el proxy local

Actualiza `pages/productos/index.vue` para consumir el server route:

```vue
<script setup lang="ts">
interface Product {
  id: number; title: string; price: number; image: string
  category: string; rating: { rate: number; count: number }
}

useSeoMeta({
  title: 'Catálogo de Productos - NuxtStore',
  description: 'Explora todos nuestros productos disponibles',
  ogTitle: 'Catálogo de Productos',
  ogDescription: 'Más de 20 productos en diferentes categorías',
})

// Ahora apunta al server route, no a fakestoreapi directamente
const { data: productos, pending } = await useFetch<Product[]>('/api/productos')

const categorias = await useAsyncData('categorias', () =>
  $fetch<string[]>('/api/categorias')
)
const filtroCategoria = ref('')

const productosFiltrados = computed(() => {
  if (!filtroCategoria.value || !productos.value) return productos.value ?? []
  return productos.value.filter(p => p.category === filtroCategoria.value)
})
</script>

<template>
  <div>
    <h2 class="page-titulo">Catálogo de Productos</h2>

    <div class="filtros">
      <button
        class="filtro-btn"
        :class="{ activo: !filtroCategoria }"
        @click="filtroCategoria = ''"
      >Todos</button>
      <button
        v-for="cat in categorias.data.value"
        :key="cat"
        class="filtro-btn"
        :class="{ activo: filtroCategoria === cat }"
        @click="filtroCategoria = cat"
      >{{ cat }}</button>
    </div>

    <div v-if="pending" class="estado-carga">Cargando productos...</div>

    <div v-else class="grid-productos">
      <NuxtLink
        v-for="p in productosFiltrados"
        :key="p.id"
        :to="`/productos/${p.id}`"
        class="producto-card"
      >
        <img :src="p.image" :alt="p.title" loading="lazy" class="producto-img" />
        <div class="producto-info">
          <p class="producto-titulo">{{ p.title.slice(0, 50) }}{{ p.title.length > 50 ? '...' : '' }}</p>
          <div class="producto-footer">
            <span class="precio">${{ p.price.toFixed(2) }}</span>
            <span class="rating">⭐ {{ p.rating.rate }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page-titulo { font-size: 1.75rem; color: #35495E; margin-bottom: 1rem; }
.filtros { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.filtro-btn { padding: 0.35rem 0.85rem; border: 1px solid #ddd; background: white; border-radius: 20px; cursor: pointer; font-size: 0.82rem; transition: all 0.15s; text-transform: capitalize; }
.filtro-btn:hover, .filtro-btn.activo { background: #42B883; color: white; border-color: #42B883; }
.estado-carga { text-align: center; padding: 3rem; color: #666; }
.grid-productos { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; }
.producto-card { background: white; border-radius: 10px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 2px 8px rgba(0,0,0,0.07); transition: transform 0.15s; }
.producto-card:hover { transform: translateY(-3px); }
.producto-img { width: 100%; height: 160px; object-fit: contain; padding: 0.75rem; background: #f9f9f9; }
.producto-info { padding: 0.75rem; }
.producto-titulo { font-size: 0.82rem; color: #35495E; line-height: 1.4; margin-bottom: 0.5rem; }
.producto-footer { display: flex; justify-content: space-between; }
.precio { font-weight: 700; color: #42B883; font-size: 0.9rem; }
.rating { font-size: 0.8rem; color: #888; }
</style>
```

---

## Paso 4: Actualizar la página de detalle con JSON-LD

Actualiza `pages/productos/[id].vue`:

```vue
<script setup lang="ts">
interface Product {
  id: number; title: string; price: number; description: string
  image: string; category: string; rating: { rate: number; count: number }
}

const route = useRoute()

const { data: producto, error } = await useFetch<Product>(
  `/api/productos/${route.params.id}`
)

useSeoMeta({
  title: () => producto.value ? `${producto.value.title} - NuxtStore` : 'Producto',
  description: () => producto.value?.description ?? '',
  ogTitle: () => producto.value?.title ?? '',
  ogDescription: () => producto.value?.description ?? '',
  ogImage: () => producto.value?.image ?? '',
  ogType: 'product',
  twitterCard: 'summary_large_image'
})

// Datos estructurados para Google
useHead({
  script: computed(() => [{
    type: 'application/ld+json',
    innerHTML: producto.value ? JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: producto.value.title,
      description: producto.value.description,
      image: producto.value.image,
      offers: {
        '@type': 'Offer',
        price: producto.value.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: producto.value.rating.rate,
        reviewCount: producto.value.rating.count
      }
    }) : ''
  }])
})
</script>

<template>
  <div>
    <NuxtLink to="/productos" class="volver">← Volver al catálogo</NuxtLink>
    <div v-if="error" class="estado-error">Producto no encontrado</div>
    <div v-else-if="producto" class="detalle">
      <img :src="producto.image" :alt="producto.title" class="detalle-img" />
      <div class="detalle-info">
        <p class="detalle-categoria">{{ producto.category }}</p>
        <h1 class="detalle-titulo">{{ producto.title }}</h1>
        <p class="detalle-desc">{{ producto.description }}</p>
        <div class="detalle-footer">
          <span class="precio">${{ producto.price.toFixed(2) }}</span>
          <span class="rating">⭐ {{ producto.rating.rate }} ({{ producto.rating.count }} reseñas)</span>
        </div>
        <button class="btn-agregar">Agregar al carrito</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.volver { display: inline-block; color: #42B883; text-decoration: none; margin-bottom: 1.5rem; font-size: 0.9rem; }
.estado-error { color: #e74c3c; text-align: center; padding: 3rem; }
.detalle { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
@media (max-width: 640px) { .detalle { grid-template-columns: 1fr; } }
.detalle-img { width: 100%; max-height: 350px; object-fit: contain; background: #f9f9f9; border-radius: 8px; padding: 1rem; }
.detalle-categoria { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; color: #42B883; font-weight: 600; margin-bottom: 0.5rem; }
.detalle-titulo { font-size: 1.3rem; color: #35495E; margin-bottom: 1rem; line-height: 1.4; }
.detalle-desc { color: #666; font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; }
.detalle-footer { display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem; }
.precio { font-size: 1.5rem; font-weight: 700; color: #42B883; }
.rating { color: #888; font-size: 0.9rem; }
.btn-agregar { width: 100%; padding: 0.85rem; background: #42B883; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
.btn-agregar:hover { background: #35495E; }
</style>
```

---

## Validaciones Esperadas

- [ ] Ver código fuente (`Ctrl+U`) muestra el título, descripción y productos en el HTML
- [ ] En DevTools → Network, la primera carga muestra los productos en la respuesta HTML (no en petición AJAX separada)
- [ ] En DevTools → Elements → `<head>`, aparecen las meta tags `og:title`, `og:image`, etc.
- [ ] En DevTools → Elements → `<head>`, aparece el `<script type="application/ld+json">` en la página de detalle
- [ ] Las peticiones del cliente apuntan a `/api/productos` (no a `fakestoreapi.com`)
- [ ] El filtro de categorías funciona en la página de listado
- [ ] Cambiar de producto cambia los meta tags dinámicamente

---

## Commits Sugeridos

```bash
git add server/api/
git commit -m "feat: server routes Nitro como proxy de FakeStore API (A4)"
git add pages/
git commit -m "feat: SEO completo con Open Graph, Twitter Cards y JSON-LD"
```
