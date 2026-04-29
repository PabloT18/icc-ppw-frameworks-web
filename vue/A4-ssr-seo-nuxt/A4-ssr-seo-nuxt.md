# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg" width="80" alt="Nuxt Logo">
</div>

## Módulo A4: SSR, SEO y Rutas de Servidor con Nuxt 3

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Uno de los valores más importantes de Nuxt sobre una SPA de Vue es la capacidad de generar HTML en el servidor. Esto mejora el SEO, reduce el tiempo de First Contentful Paint (FCP) y permite implementar lógica de backend directamente en el mismo proyecto mediante **server routes de Nitro**.

---

## 2. Conceptos Clave

### ¿Por qué SSR mejora el SEO?

Con una SPA, los motores de búsqueda reciben inicialmente:
```html
<div id="app"></div>  <!-- HTML vacío -->
```

Con SSR, el mismo request recibe:
```html
<div id="app">
  <h1>Catálogo de Productos</h1>
  <div class="producto">Fjallraven Backpack - $109.95</div>
  <!-- ... contenido real indexable -->
</div>
```

### Head management profundo

```typescript
// Forma básica
useHead({ title: 'Mi página' })

// Forma semántica (recomendada para SEO)
useSeoMeta({
  title: 'Mi tienda',              // <title>
  description: 'Texto SEO',        // <meta name="description">
  ogTitle: 'Mi tienda',            // Open Graph
  ogDescription: 'Texto para redes',
  ogImage: 'https://...',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Mi tienda'
})

// Con datos reactivos (se actualizan cuando cambia el dato)
useSeoMeta({
  title: () => `${producto.value?.title} - Mi tienda`,
  ogImage: () => producto.value?.image
})
```

### Open Graph y Twitter Cards

Los metadatos Open Graph controlan cómo se ve el enlace al compartirse en redes sociales:

```html
<!-- Open Graph -->
<meta property="og:title" content="Fjallraven Backpack" />
<meta property="og:description" content="Your perfect pack..." />
<meta property="og:image" content="https://fakestoreapi.com/img/81.jpg" />
<meta property="og:type" content="product" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Fjallraven Backpack" />
```

---

## 3. Nitro: Server Routes

Nuxt incluye **Nitro**, un servidor de alto rendimiento que permite crear API routes directamente dentro del proyecto Nuxt.

### Convención de nombres

```
server/api/
├── productos.get.ts           → GET  /api/productos
├── productos.post.ts          → POST /api/productos
├── productos/
│   └── [id].get.ts            → GET  /api/productos/123
└── auth/
    └── login.post.ts          → POST /api/auth/login
```

El sufijo (`.get.ts`, `.post.ts`) define el método HTTP. Si no hay sufijo, acepta todos.

### Escribir un server route

```typescript
// server/api/productos.get.ts
export default defineEventHandler(async (event) => {
  // Lee parámetros de query
  const query = getQuery(event)
  const limite = parseInt(query.limite as string) || 10

  // Puede llamar a servicios externos, bases de datos, etc.
  const productos = await $fetch(
    `https://fakestoreapi.com/products?limit=${limite}`
  )

  return productos
})
```

### Leer el body (POST)

```typescript
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Datos incompletos' })
  }

  // Lógica de autenticación...
  return { token: 'jwt-simulado-123', usuario: { email } }
})
```

### Headers y cookies del servidor

```typescript
// Leer headers de la request
const authorization = getHeader(event, 'authorization')

// Enviar cookies de respuesta
setCookie(event, 'session', tokenValue, {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 7  // 7 días
})
```

---

## 4. `useAsyncData` vs `useFetch`

| | `useFetch` | `useAsyncData` |
|---|---|---|
| Simplicidad | ✅ Más simple | Requiere key y handler |
| Key de caché | Automática (URL) | Manual (string único) |
| Datos dinámicos | Menos control | Más control |
| Caso de uso | Peticiones simples | Peticiones con parámetros, lógica compleja |

```typescript
// useFetch — directo y simple
const { data } = await useFetch('/api/productos')

// useAsyncData — más control
const { data, refresh } = await useAsyncData(
  'productos-categoria-ropa',           // Key: debe ser única
  () => $fetch('/api/productos?cat=ropa')
)

// Refrescar los datos manualmente
await refresh()
```

### `$fetch` — cliente HTTP de Nitro

`$fetch` es la función de Nuxt para hacer peticiones HTTP. En el servidor usa peticiones directas (sin red), en el cliente usa `fetch` normal:

```typescript
// Funciona en servidor y cliente
const datos = await $fetch('/api/productos', {
  method: 'POST',
  body: { nombre: 'Producto nuevo' }
})
```

---

## 5. Datos estructurados (JSON-LD)

JSON-LD es el formato preferido de Google para datos estructurados:

```vue
<script setup lang="ts">
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: producto.value?.title,
      description: producto.value?.description,
      image: producto.value?.image,
      offers: {
        '@type': 'Offer',
        price: producto.value?.price,
        priceCurrency: 'USD'
      }
    })
  }]
})
</script>
```

---

## 6. Middleware de Nuxt

```typescript
// middleware/auth.ts  — se ejecuta antes de cada ruta
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useAuthState()

  if (!loggedIn.value && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})
```

```vue
<!-- En la página protegida -->
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
```

---

## 7. Buenas Prácticas

- **`useSeoMeta` en cada página** con title y description únicos.
- **Open Graph para páginas de producto**: título, descripción e imagen específicos.
- **JSON-LD para productos y artículos**: mejora la aparición en Google Shopping.
- **Server routes para lógica sensible**: API keys, lógica de negocio, llamadas a DB.
- **`useAsyncData` con key descriptiva**: facilita el debugging y el control de caché.

---

## 8. Referencias

- [Nuxt - SEO & Meta](https://nuxt.com/docs/getting-started/seo-meta)
- [Nuxt - Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nitro - Event Handlers](https://nitro.unjs.io/guide/routing)
- [Google - Structured Data](https://developers.google.com/search/docs/appearance/structured-data)
- [Open Graph Protocol](https://ogp.me/)
