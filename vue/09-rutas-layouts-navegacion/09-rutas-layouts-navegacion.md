# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 9: Vue Router — Rutas, Layouts y Navegación

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Vue Router es la librería oficial de enrutamiento para Vue. Permite crear **Single Page Applications (SPA)** donde la URL cambia sin recargar la página, manteniendo el estado de la aplicación.

Sin router, toda la aplicación vive en un único componente raíz. Con router, cada URL mapea a un componente (vista), lo que permite una navegación fluida y URLs compartibles.

### ¿Cómo funciona una SPA con Vue Router?

```
Usuario visita /productos
  → Vue Router intercepta la URL
  → Renderiza el componente ProductosView
  → No recarga la página

Usuario navega a /carrito
  → Vue Router intercepta el click
  → Renderiza CarritoView
  → El estado del carrito (Pinia/composable) se mantiene
```

---

## 2. Conceptos Clave

### Instalación

```bash
pnpm add vue-router@4
```

### Configuración del router (`src/router/index.ts`)

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('@/views/ProductosView.vue')  // lazy loading
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

export default router
```

### Registrar el router en `main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

### `<RouterView>` y `<RouterLink>`

```vue
<!-- App.vue: punto de montaje de las vistas -->
<template>
  <NavBar />
  <RouterView />   <!-- Aquí se renderiza el componente de la ruta activa -->
</template>
```

```vue
<!-- Navegación sin recargar la página -->
<RouterLink to="/">Inicio</RouterLink>
<RouterLink to="/productos">Productos</RouterLink>

<!-- Con nombre de ruta -->
<RouterLink :to="{ name: 'productos' }">Productos</RouterLink>
```

### Rutas dinámicas (parámetros)

```typescript
// Router
{ path: '/productos/:id', name: 'producto-detalle', component: ProductoDetalleView }
```

```vue
<!-- En el componente -->
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const id = route.params.id  // string
</script>
```

### Query params

```
/productos?categoria=laptops&orden=precio
```

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const categoria = route.query.categoria  // 'laptops'
</script>
```

---

## 3. Explicación Técnica Detallada

### History modes

| Modo | URL | Requiere configuración servidor |
|---|---|---|
| `createWebHistory()` | `/productos` | Sí (en producción) |
| `createWebHashHistory()` | `/#/productos` | No |
| `createMemoryHistory()` | Sin URL visible | Para SSR o testing |

Se usa `createWebHistory` en desarrollo y producción con soporte del servidor.

### Navegación programática

```typescript
import { useRouter } from 'vue-router'
const router = useRouter()

// Navegar a una ruta
router.push('/productos')
router.push({ name: 'producto-detalle', params: { id: '1' } })

// Reemplazar (sin agregar al historial)
router.replace('/inicio')

// Volver atrás
router.back()
```

### Layouts con `RouterView` anidado

Para tener diferentes layouts (layout con sidebar, layout de autenticación), Vue Router soporta rutas anidadas:

```typescript
const routes = [
  {
    path: '/',
    component: MainLayout,        // Layout con NavBar + sidebar
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'productos', name: 'productos', component: ProductosView },
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,        // Layout simple sin NavBar
    children: [
      { path: 'login', name: 'login', component: LoginView },
    ]
  }
]
```

El layout padre tiene su propio `<RouterView>`:

```vue
<!-- MainLayout.vue -->
<template>
  <NavBar />
  <main>
    <RouterView />   <!-- Aquí se monta HomeView o ProductosView -->
  </main>
</template>
```

### `RouterLink` activo

Vue Router agrega automáticamente la clase `router-link-active` (parcial) y `router-link-exact-active` (exacta) al enlace activo:

```css
.router-link-exact-active {
  color: #42B883;
  font-weight: bold;
}
```

O se puede personalizar con la prop `active-class`:

```html
<RouterLink to="/productos" active-class="nav-activo">Productos</RouterLink>
```

---

## 4. Ejemplos de Código

### Router completo del proyecto

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'productos',
          name: 'productos',
          component: () => import('@/views/ProductosView.vue')
        },
        {
          path: 'productos/:id',
          name: 'producto-detalle',
          component: () => import('@/views/ProductoDetalleView.vue')
        },
        {
          path: 'carrito',
          name: 'carrito',
          component: () => import('@/views/CarritoView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

export default router
```

### Componente de navegación

```vue
<script setup lang="ts">
import { useCarrito } from '@/composables/useCarrito'
const { cantidadItems } = useCarrito()
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="logo">PPW Vue App</RouterLink>
    <div class="nav-links">
      <RouterLink to="/productos">Productos</RouterLink>
      <RouterLink to="/carrito" class="link-carrito">
        🛒 <span v-if="cantidadItems > 0" class="badge">{{ cantidadItems }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
```

---

## 5. Buenas Prácticas

- **Usa lazy loading para todas las vistas**: `() => import('@/views/MiVista.vue')` — el bundle se divide automáticamente.
- **Nombra todas las rutas**: usar `{ name: 'productos' }` en lugar de `{ path: '/productos' }` hace refactoring más seguro.
- **Organiza vistas en `src/views/`** y componentes reutilizables en `src/components/`.
- **Un layout por caso de uso**: layout principal, layout de autenticación, layout de admin.
- **Usa `<RouterLink>` en lugar de `<a href>`**: respeta el modo de history y añade las clases activas automáticamente.
- **Verifica el tipo de `route.params.id`**: es siempre un `string` o `string[]`, conviértelo con `Number(id)` si necesitas un número.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Página en blanco al navegar | `<RouterView>` no está en el componente padre | Agregar `<RouterView>` en el layout raíz |
| 404 al refrescar en producción | Servidor no redirige a `index.html` | Configurar el servidor para servir `index.html` en todas las rutas |
| Parámetro de ruta como array | Ruta con parámetros opcionales o catch-all | Verificar `typeof route.params.id === 'string'` |
| Estado no persiste al navegar | Usar datos locales del componente en lugar de store | Usar Pinia (módulo 10) o composables para estado compartido |
| Redirección infinita en guards | Condición de guard siempre es falsa | Verificar la lógica del guard y agregar condición de salida |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `App.vue` deja de ser el único componente visual. La UI se divide en vistas (`HomeView`, `ProductosView`, `CarritoView`) con un layout principal que contiene la barra de navegación.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── composables/
├── components/
├── layouts/
│   └── MainLayout.vue    ← Nuevo
├── views/
│   ├── HomeView.vue       ← Nuevo
│   ├── ProductosView.vue  ← Nuevo (contiene el catálogo de módulos anteriores)
│   ├── CarritoView.vue    ← Nuevo
│   └── NotFoundView.vue   ← Nuevo
├── router/
│   └── index.ts           ← Nuevo
└── App.vue                ← Simplificado (solo <RouterView>)
```

---

## 8. Referencias

- [Vue Router 4 - Inicio](https://router.vuejs.org/guide/)
- [Vue Router 4 - Rutas dinámicas](https://router.vuejs.org/guide/essentials/dynamic-matching)
- [Vue Router 4 - Rutas anidadas](https://router.vuejs.org/guide/essentials/nested-routes)
- [Vue Router 4 - Navegación programática](https://router.vuejs.org/guide/essentials/navigation)
- [Vue Router 4 - Lazy loading](https://router.vuejs.org/guide/advanced/lazy-loading)
