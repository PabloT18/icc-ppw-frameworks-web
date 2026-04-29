# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 13: Optimización y Estructura de Proyecto

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Una aplicación Vue puede funcionar correctamente desde el módulo 01, pero a medida que crece, aparecen problemas de rendimiento y mantenibilidad. Este módulo aborda las técnicas de optimización más importantes: code splitting, carga diferida de rutas, memoización, y las convenciones de estructura de proyecto que facilitan el trabajo en equipo.

---

## 2. Conceptos Clave

### Code Splitting

Vite (con Rollup) divide automáticamente el bundle en chunks. Cada `import()` dinámico crea un chunk separado:

```typescript
// Sin lazy loading — todo en el bundle principal
import ProductosView from '@/views/ProductosView.vue'

// Con lazy loading — chunk separado, se descarga cuando se navega
const ProductosView = () => import('@/views/ProductosView.vue')
```

El router de Vue ya usa este patrón si usamos `component: () => import(...)`.

### `computed` vs `methods` (recordatorio de rendimiento)

- `computed`: resultado cacheado; solo se recalcula si sus dependencias reactivas cambian
- `methods`: se ejecuta **siempre** que el componente re-renderiza

Para listas filtradas o cálculos derivados de estado reactivo, usar siempre `computed`.

### `v-memo`

Directiva de Vue 3.2 para memoizar sub-árboles del DOM:

```vue
<!-- Solo re-renderiza si producto.id o estaSeleccionado cambia -->
<div v-for="producto in productos" :key="producto.id" v-memo="[producto.id, estaSeleccionado(producto.id)]">
  <ProductCard :producto="producto" />
</div>
```

### `defineAsyncComponent`

Para componentes pesados que no se necesitan en el primer render:

```typescript
import { defineAsyncComponent } from 'vue'

const GraficoVentas = defineAsyncComponent({
  loader: () => import('@/components/GraficoVentas.vue'),
  loadingComponent: SpinnerComponent,
  delay: 200,
  errorComponent: ErrorComponent,
  timeout: 5000
})
```

---

## 3. Explicación Técnica Detallada

### Estructura de carpetas recomendada

```
src/
├── assets/           # Imágenes, fuentes, íconos estáticos
├── components/       # Componentes reutilizables (sin lógica de negocio)
│   ├── base/         # Componentes base: BaseButton, BaseInput, BaseCard
│   └── ui/           # Componentes compuestos: ProductCard, NavBar
├── composables/      # Lógica reutilizable (useXxx)
├── layouts/          # Layouts de páginas completas
├── router/           # Configuración de Vue Router
├── services/         # Funciones de acceso a API
├── stores/           # Stores de Pinia
├── types/            # Interfaces y tipos TypeScript
├── utils/            # Funciones puras de utilidad
└── views/            # Componentes de página (uno por ruta)
```

**Reglas:**
- `views/` → componentes que corresponden a una ruta; reciben datos de stores/servicios
- `components/` → reutilizables; reciben datos como props, emiten eventos
- `composables/` → lógica con estado reactivo reutilizable
- `utils/` → funciones puras sin estado (formatear fechas, validar, etc.)

### Convenciones de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `ProductCard.vue`, `NavBar.vue` |
| Composables | camelCase con `use` | `useCarrito.ts` |
| Stores | camelCase con `use` + `Store` | `useCarritoStore.ts` |
| Tipos | PascalCase | `Product`, `Usuario` |
| Vistas | PascalCase + `View` | `ProductosView.vue` |
| Layouts | PascalCase + `Layout` | `MainLayout.vue` |
| Utils | camelCase | `formatPrice.ts` |

### Props y Emits bien tipados

```typescript
// ✅ Bien: props con tipos explícitos y defaults
const props = withDefaults(defineProps<{
  producto: Product
  compact?: boolean
  mostrarRating?: boolean
}>(), {
  compact: false,
  mostrarRating: true
})

// ✅ Bien: emits tipados con payload
const emit = defineEmits<{
  agregar: [producto: Product]
  eliminar: [id: number]
  actualizar: [id: number, cantidad: number]
}>()
```

### Optimización de listas

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@/types/product'

const props = defineProps<{ productos: Product[] }>()
const busqueda = ref('')

// ✅ computed: solo recalcula cuando `busqueda` o `productos` cambian
const productosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return props.productos
  const q = busqueda.value.toLowerCase()
  return props.productos.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  )
})
</script>

<template>
  <input v-model="busqueda" placeholder="Buscar..." />

  <!-- ✅ :key siempre con id único, nunca con índice para listas mutables -->
  <ProductCard
    v-for="p in productosFiltrados"
    :key="p.id"
    :producto="p"
  />
</template>
```

### Funciones de utilidad puras

```typescript
// src/utils/formatters.ts
export function formatPrecio(precio: number, moneda = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: moneda
  }).format(precio)
}

export function formatFecha(fecha: Date): string {
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(fecha)
}

export function truncarTexto(texto: string, max: number): string {
  if (texto.length <= max) return texto
  return texto.slice(0, max).trimEnd() + '...'
}
```

### Accesibilidad básica

```vue
<!-- ✅ Botones con aria-label cuando no tienen texto visible -->
<button aria-label="Agregar al carrito" @click="agregar">🛒</button>

<!-- ✅ Imágenes con alt descriptivo -->
<img :src="producto.image" :alt="`Imagen de ${producto.title}`" />

<!-- ✅ Formularios con label asociado -->
<label for="busqueda">Buscar productos</label>
<input id="busqueda" v-model="busqueda" type="search" />

<!-- ✅ Estado de carga comunicado a lectores de pantalla -->
<div aria-live="polite" aria-atomic="true">
  <span v-if="cargando">Cargando productos...</span>
</div>
```

---

## 4. Ejemplos de Código

### Lazy loading completo en el router

```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),  // lazy
      children: [
        { path: '', component: () => import('@/views/HomeView.vue') },
        { path: 'productos', component: () => import('@/views/ProductosView.vue') },
        {
          path: 'carrito',
          component: () => import('@/views/CarritoView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFoundView.vue') }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})
```

### `scrollBehavior`

Al navegar entre páginas, Vue Router no resetea automáticamente el scroll. `scrollBehavior` lo controla:

```typescript
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition        // botón atrás del navegador
  if (to.hash) return { el: to.hash }           // ancla en la URL
  return { top: 0, behavior: 'smooth' }          // siempre al tope
}
```

---

## 5. Buenas Prácticas

- **Lazy load todas las rutas**: reduce el tiempo de carga inicial (TTI).
- **No uses índice como `:key`** en listas que se reordenan o filtran: causa bugs de reconciliación de DOM.
- **Extrae utilidades puras a `utils/`**: son fáciles de testear con Vitest.
- **Un componente = una responsabilidad**: si un componente tiene más de 200 líneas, probablemente hace demasiado.
- **No pongas lógica de negocio en los templates**: muévela a `computed` o composables.
- **Usa `aria-live` para notificaciones dinámicas**: el estado de carga y los mensajes de éxito/error deben ser accesibles.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Bundle muy grande | Importaciones sin lazy loading | Revisar el output de `pnpm build --analyze` |
| Lista parpadea al filtrar | `:key` usando índice | Cambiar a `:key="item.id"` |
| `computed` no se actualiza | Se accede a datos no reactivos dentro del `computed` | Asegurar que todos los datos accedidos son `ref` o `reactive` |
| Componente no accesible | Solo colores para indicar estado, sin texto | Agregar `aria-label`, `aria-live` y texto alternativo |

---

## 7. Relación con el Proyecto Incremental

En este módulo no se agregan funcionalidades nuevas, sino que se refactoriza el proyecto:
- Todas las rutas usan lazy loading
- `ProductCard` usa `formatPrecio` de `utils/formatters.ts`
- Se agrega `scrollBehavior` al router
- Se revisan los `aria-label` en botones del navbar y el carrito

---

## 8. Referencias

- [Vue 3 - Performance Tips](https://vuejs.org/guide/best-practices/performance)
- [Vue 3 - v-memo](https://vuejs.org/api/built-in-directives.html#v-memo)
- [Vue 3 - defineAsyncComponent](https://vuejs.org/guide/components/async)
- [Vue Router - scrollBehavior](https://router.vuejs.org/guide/advanced/scroll-behavior)
- [ARIA Live Regions - MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [Vite - Build optimizations](https://vitejs.dev/guide/build)
