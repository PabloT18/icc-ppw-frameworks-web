# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg" width="80" alt="Nuxt Logo">
</div>

## Módulo A1: Introducción a Nuxt 3

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

**Nuxt** es el framework de nivel superior construido sobre Vue que añade Server-Side Rendering (SSR), Static Site Generation (SSG), enrutamiento basado en archivos, y convenciones de estructura que eliminan configuración boilerplate.

Si Vue es el motor, Nuxt es el auto completo: incluye Vue Router, manejo de head, gestión de datos, middleware, plugins y optimizaciones de rendimiento out of the box.

---

## 2. Conceptos Clave

### Modos de renderizado

| Modo | Cómo funciona | Caso de uso |
|---|---|---|
| **SPA** (Client-Side Rendering) | HTML vacío + JS renderiza en el cliente | Apps con auth, dashboards privados |
| **SSR** (Server-Side Rendering) | HTML generado en el servidor en cada request | E-commerce, noticias, contenido dinámico |
| **SSG** (Static Site Generation) | HTML pre-generado en build time | Blogs, documentación, landing pages |
| **ISR** (Incremental Static Regeneration) | SSG con revalidación periódica | Catálogos con datos que cambian poco |

### Vue SPA vs Nuxt

| Característica | Vue + Vite SPA | Nuxt 3 |
|---|---|---|
| Enrutamiento | Manual con Vue Router | Automático por archivos en `pages/` |
| SEO | Limitado (HTML vacío inicial) | Excelente (SSR/SSG) |
| Head management | Manual (`@vueuse/head`) | Integrado (`useHead`, `useSeoMeta`) |
| Data fetching | `onMounted` + `fetch`/Axios | `useFetch`, `useAsyncData` |
| API routes | No | Sí (Nitro server routes) |
| Estructura | Flexible | Convencional |

---

## 3. Explicación

### Instalación

```bash
pnpm dlx nuxi@latest init mi-nuxt-app
cd mi-nuxt-app
pnpm install
pnpm dev
```

### Estructura de un proyecto Nuxt

```
mi-nuxt-app/
├── pages/              # Rutas (automáticas por nombre de archivo)
│   ├── index.vue       # → /
│   ├── productos/
│   │   ├── index.vue   # → /productos
│   │   └── [id].vue    # → /productos/123
│   └── about.vue       # → /about
├── components/         # Auto-importados (no necesitan import manual)
├── composables/        # Auto-importados
├── layouts/            # Layouts de página
│   └── default.vue     # Layout por defecto
├── server/             # API routes (Nitro)
│   └── api/
│       └── productos.get.ts
├── public/             # Archivos estáticos
├── assets/             # Archivos procesados por Vite
├── nuxt.config.ts      # Configuración de Nuxt
└── app.vue             # Punto de entrada
```

### Enrutamiento automático por archivos

```
pages/
├── index.vue           → /
├── blog/
│   ├── index.vue       → /blog
│   └── [slug].vue      → /blog/:slug
└── usuario/
    └── [id]/
        └── perfil.vue  → /usuario/:id/perfil
```

No se necesita configurar un `router/index.ts`. Nuxt lo genera automáticamente.

### `useHead` y `useSeoMeta`

```vue
<script setup lang="ts">
// Configura el <head> de la página actual
useHead({
  title: 'Catálogo de Productos',
  meta: [
    { name: 'description', content: 'Explora nuestra colección de productos' }
  ]
})

// Alternativa más semántica para SEO
useSeoMeta({
  title: 'Catálogo de Productos',
  description: 'Explora nuestra colección de productos',
  ogTitle: 'Catálogo de Productos',
  ogDescription: 'Explora nuestra colección de productos',
  ogImage: 'https://mi-sitio.com/og-image.jpg'
})
</script>
```

### Data fetching con `useFetch`

```vue
<script setup lang="ts">
interface Product { id: number; title: string; price: number }

// useFetch es SSR-aware: en el servidor hace la petición, en el cliente no
const { data: productos, pending, error } = await useFetch<Product[]>(
  'https://fakestoreapi.com/products'
)
</script>

<template>
  <div v-if="pending">Cargando...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <div v-for="p in productos" :key="p.id">{{ p.title }}</div>
  </div>
</template>
```

### `useAsyncData` para datos con key

```typescript
// Útil para datos que dependen de parámetros de ruta
const route = useRoute()

const { data: producto } = await useAsyncData(
  `producto-${route.params.id}`,  // Key para deduplicación y cache
  () => $fetch(`/api/productos/${route.params.id}`)
)
```

### Layouts

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <header>Mi Sitio</header>
    <main>
      <slot />  <!-- Aquí se inserta la página -->
    </main>
    <footer>Footer</footer>
  </div>
</template>
```

```vue
<!-- pages/admin.vue — usar layout diferente -->
<script setup lang="ts">
definePageMeta({ layout: 'admin' })
</script>
```

### Auto-importes

Nuxt auto-importa:
- Todos los composables de `composables/`
- Todos los componentes de `components/`
- Los composables de Vue (`ref`, `computed`, `watch`, etc.)
- Los composables de Vue Router (`useRoute`, `useRouter`)

```vue
<script setup lang="ts">
// ✅ No necesitas estos imports en Nuxt:
// import { ref, computed } from 'vue'
// import { useRoute } from 'vue-router'
// import MiComponente from '@/components/MiComponente.vue'

const count = ref(0)  // Disponible sin import
const route = useRoute()
</script>

<template>
  <MiComponente />  <!-- Auto-importado -->
</template>
```

---

## 4. Nuxt Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Modo de renderizado (por defecto: SSR)
  ssr: true,

  // Módulos de Nuxt
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],

  // Variables de runtime (disponibles en servidor y cliente)
  runtimeConfig: {
    // Solo en servidor
    apiSecret: process.env.API_SECRET,
    public: {
      // En servidor y cliente
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  }
})
```

---

## 5. Buenas Prácticas

- **Usa `useFetch` en lugar de `axios` para datos de página**: es SSR-aware y maneja deduplicación.
- **`useAsyncData` para datos con parámetros dinámicos**: el key evita peticiones duplicadas.
- **`useSeoMeta` en cada página**: mejora el SEO significativamente vs una SPA.
- **No mezcles `onMounted` con `useFetch`**: `useFetch` ya es isomórfico; `onMounted` solo corre en el cliente.
- **Auto-importes son una ventaja, no una trampa**: confía en ellos para componentes y composables propios.

---

## 6. Diferencias clave con Vue + Vite SPA

| Aspecto | Vue SPA | Nuxt 3 |
|---|---|---|
| `import { ref } from 'vue'` | Necesario | Auto-importado |
| Rutas | `router/index.ts` manual | Archivos en `pages/` |
| Data fetching inicial | `onMounted` (solo cliente) | `useFetch` (servidor + cliente) |
| Meta tags | Configuración manual | `useHead` / `useSeoMeta` |
| API routes | Backend separado | `server/api/` en el mismo proyecto |

---

## 7. Referencias

- [Nuxt 3 - Documentación oficial](https://nuxt.com/docs)
- [Nuxt 3 - Routing](https://nuxt.com/docs/getting-started/routing)
- [Nuxt 3 - Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)
- [Nuxt 3 - SEO & Meta](https://nuxt.com/docs/getting-started/seo-meta)
- [Pinia con Nuxt](https://pinia.vuejs.org/ssr/nuxt)
