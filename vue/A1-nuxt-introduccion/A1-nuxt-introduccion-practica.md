# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg" width="80" alt="Nuxt Logo">
</div>

## Práctica A1: Introducción a Nuxt 3

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Crear un proyecto Nuxt 3 desde cero que consuma la FakeStore API usando `useFetch`, con enrutamiento automático por archivos, meta tags con `useSeoMeta`, y un layout compartido entre páginas.

---

## Contexto

Este es un proyecto **separado** del `ppw-vue-app`. Se crea un nuevo proyecto `ppw-nuxt-intro` para explorar cómo Nuxt simplifica las tareas que en Vue SPA requieren más configuración manual.

---

## Paso 1: Crear el proyecto Nuxt

```bash
pnpm dlx nuxi@latest init ppw-nuxt-intro
cd ppw-nuxt-intro
pnpm install
```

---

## Paso 2: Explorar la estructura generada

```
ppw-nuxt-intro/
├── app.vue           ← Punto de entrada (reemplazará con layouts)
├── nuxt.config.ts    ← Configuración
├── package.json
└── public/
    └── favicon.ico
```

Ejecuta el servidor de desarrollo:

```bash
pnpm dev
```

Visita `http://localhost:3000`.

---

## Paso 3: Crear el layout predeterminado

Crea `layouts/default.vue`:

```vue
<template>
  <div class="app-wrapper">
    <header class="header">
      <nav class="nav">
        <NuxtLink to="/" class="nav-logo">
          <span class="verde">Nuxt</span>Store
        </NuxtLink>
        <div class="nav-links">
          <NuxtLink to="/" :exact-active-class="'activo'">Inicio</NuxtLink>
          <NuxtLink to="/productos" active-class="activo">Productos</NuxtLink>
          <NuxtLink to="/about" active-class="activo">Acerca de</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <p>PPW - Nuxt 3 Demo &copy; 2024</p>
    </footer>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #f5f5f5; }

.app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }

.header { background: #35495E; color: white; padding: 0 2rem; }
.nav { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; height: 60px; gap: 2rem; }
.nav-logo { color: white; text-decoration: none; font-size: 1.25rem; font-weight: 700; }
.verde { color: #42B883; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
.nav-links a:hover, .nav-links .activo { color: #42B883; }

.main-content { flex: 1; max-width: 1100px; margin: 2rem auto; padding: 0 1rem; width: 100%; }

.footer { background: #35495E; color: rgba(255,255,255,0.6); text-align: center; padding: 1rem; font-size: 0.85rem; }
</style>
```

Actualiza `app.vue` para usar el layout:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

---

## Paso 4: Crear la página de inicio

Crea `pages/index.vue`:

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'NuxtStore - Tienda en línea',
  description: 'Explora nuestra colección de productos con Nuxt 3'
})
</script>

<template>
  <div class="hero">
    <h1>Bienvenido a <span class="verde">NuxtStore</span></h1>
    <p class="subtitulo">
      Una demo de Nuxt 3 con SSR, enrutamiento por archivos y useFetch
    </p>
    <NuxtLink to="/productos" class="btn-cta">
      Ver Productos →
    </NuxtLink>

    <div class="features">
      <div class="feature-card">
        <span class="icon">⚡</span>
        <h3>SSR</h3>
        <p>HTML generado en el servidor para mejor SEO y tiempo de carga</p>
      </div>
      <div class="feature-card">
        <span class="icon">📁</span>
        <h3>File-based Routing</h3>
        <p>Las rutas se crean automáticamente desde la carpeta pages/</p>
      </div>
      <div class="feature-card">
        <span class="icon">🔄</span>
        <h3>Auto-imports</h3>
        <p>Composables y componentes sin necesidad de imports manuales</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero { text-align: center; padding: 3rem 1rem; }
.hero h1 { font-size: 2.5rem; color: #35495E; margin-bottom: 1rem; }
.verde { color: #42B883; }
.subtitulo { font-size: 1.1rem; color: #666; margin-bottom: 2rem; }
.btn-cta {
  display: inline-block;
  background: #42B883;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;
}
.btn-cta:hover { background: #35495E; }
.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
.feature-card { background: white; border-radius: 10px; padding: 1.5rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
.icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
.feature-card h3 { color: #35495E; margin-bottom: 0.5rem; }
.feature-card p { color: #777; font-size: 0.9rem; }
</style>
```

---

## Paso 5: Crear la página de productos con `useFetch`

Crea `pages/productos/index.vue`:

```vue
<script setup lang="ts">
interface Product {
  id: number
  title: string
  price: number
  image: string
  category: string
  rating: { rate: number; count: number }
}

useSeoMeta({
  title: 'Catálogo de Productos - NuxtStore',
  description: 'Explora todos nuestros productos disponibles'
})

// useFetch hace la petición en el servidor (SSR)
// Los datos ya están disponibles cuando el HTML llega al cliente
const { data: productos, pending, error } = await useFetch<Product[]>(
  'https://fakestoreapi.com/products'
)
</script>

<template>
  <div>
    <h2 class="page-titulo">Catálogo de Productos</h2>

    <div v-if="pending" class="estado-carga">
      Cargando productos...
    </div>

    <div v-else-if="error" class="estado-error">
      Error al cargar: {{ error.message }}
    </div>

    <div v-else class="grid-productos">
      <NuxtLink
        v-for="p in productos"
        :key="p.id"
        :to="`/productos/${p.id}`"
        class="producto-card"
      >
        <img :src="p.image" :alt="p.title" class="producto-img" />
        <div class="producto-info">
          <p class="producto-titulo">{{ p.title.slice(0, 50) }}...</p>
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
.page-titulo { font-size: 1.75rem; color: #35495E; margin-bottom: 1.5rem; }
.estado-carga, .estado-error { text-align: center; padding: 3rem; color: #666; }
.estado-error { color: #e74c3c; }
.grid-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}
.producto-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: transform 0.15s, box-shadow 0.15s;
}
.producto-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
.producto-img { width: 100%; height: 160px; object-fit: contain; padding: 0.75rem; background: #f9f9f9; }
.producto-info { padding: 0.75rem; }
.producto-titulo { font-size: 0.82rem; color: #35495E; line-height: 1.4; margin-bottom: 0.5rem; }
.producto-footer { display: flex; justify-content: space-between; align-items: center; }
.precio { font-weight: 700; color: #42B883; font-size: 0.9rem; }
.rating { font-size: 0.8rem; color: #888; }
</style>
```

---

## Paso 6: Crear la página de detalle del producto

Crea `pages/productos/[id].vue`:

```vue
<script setup lang="ts">
interface Product {
  id: number; title: string; price: number; description: string
  image: string; category: string; rating: { rate: number; count: number }
}

const route = useRoute()

const { data: producto, error } = await useFetch<Product>(
  `https://fakestoreapi.com/products/${route.params.id}`
)

// Meta tags dinámicos basados en los datos del producto
useSeoMeta({
  title: () => producto.value ? `${producto.value.title} - NuxtStore` : 'Producto',
  description: () => producto.value?.description ?? '',
  ogImage: () => producto.value?.image ?? ''
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
.btn-agregar { width: 100%; padding: 0.85rem; background: #42B883; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-agregar:hover { background: #35495E; }
</style>
```

---

## Validaciones Esperadas

- [ ] Crear el proyecto con `pnpm dlx nuxi@latest init` funciona
- [ ] Las rutas `/`, `/productos` y `/productos/1` existen sin configurar el router
- [ ] Ver el código fuente en el navegador (Ctrl+U) muestra los productos en el HTML (SSR funcionando)
- [ ] La pestaña Network en DevTools muestra que los datos ya vienen en el HTML inicial (no en una petición AJAX separada)
- [ ] Los meta tags cambian según la página (verificar en DevTools → Elements → head)
- [ ] Navegar entre páginas es instantáneo (client-side navigation después del primer load)

---

## Entregables

- Proyecto `ppw-nuxt-intro` con estructura Nuxt 3
- `layouts/default.vue`
- `pages/index.vue`
- `pages/productos/index.vue`
- `pages/productos/[id].vue`

---

## Commits Sugeridos

```bash
git init && git add .
git commit -m "feat: proyecto Nuxt 3 inicial con layout y rutas automáticas"
git add pages/
git commit -m "feat: páginas de inicio, listado y detalle de producto con useFetch (A1)"
```
