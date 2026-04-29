# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 13: Optimización y Estructura de Proyecto

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Práctico

Refactorizar el proyecto `ppw-vue-app` para aplicar las mejores prácticas de estructura y optimización. Sin agregar nuevas funcionalidades, se mejora la organización del código, el rendimiento de carga y la accesibilidad básica.

---

## Contexto

Esta práctica es de **refactorización**: no se añaden features nuevas. Se trabaja con el código ya existente para:
1. Mover toda la carga de rutas a lazy loading
2. Crear utilidades de formato reutilizables
3. Agregar `scrollBehavior` al router
4. Mejorar la accesibilidad de botones e imágenes

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/src/
├── utils/
│   └── formatters.ts           ← Crear
├── router/
│   └── index.ts                ← Modificar: lazy loading + scrollBehavior
└── components/
    └── ProductCard.vue         ← Modificar: usar formatPrecio + aria
```

---

## Paso 1: Crear utilidades de formato

Crea `src/utils/formatters.ts`:

```typescript
/**
 * Formatea un precio numérico en formato de moneda
 * @param precio - Número a formatear
 * @param moneda - Código ISO de moneda (default: 'USD')
 */
export function formatPrecio(precio: number, moneda = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: moneda
  }).format(precio)
}

/**
 * Trunca un texto a un máximo de caracteres, agregando '...'
 */
export function truncarTexto(texto: string, max: number): string {
  if (texto.length <= max) return texto
  return texto.slice(0, max).trimEnd() + '...'
}

/**
 * Formatea una fecha en formato legible en español
 */
export function formatFecha(fecha: Date | string): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d)
}
```

---

## Paso 2: Verificar lazy loading en el router

Abre `src/router/index.ts` y asegúrate de que **todos** los componentes de ruta usan `() => import(...)`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')     // ← lazy
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'), // ← lazy
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'productos', name: 'productos', component: () => import('@/views/ProductosView.vue') },
        {
          path: 'carrito',
          name: 'carrito',
          component: () => import('@/views/CarritoView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')  // ← lazy
    }
  ],

  // ✅ Scroll al tope al navegar entre páginas
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach(to => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  if (requiresAuth && !auth.estaAutenticado) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.estaAutenticado) {
    return { name: 'home' }
  }
})

export default router
```

---

## Paso 3: Actualizar `ProductCard.vue` con formatters y accesibilidad

```vue
<script setup lang="ts">
import type { Product } from '@/types/product'
import { formatPrecio, truncarTexto } from '@/utils/formatters'

const props = defineProps<{ producto: Product }>()
const emit = defineEmits<{ agregar: [producto: Product] }>()
</script>

<template>
  <article class="card" :aria-label="`Producto: ${producto.title}`">
    <img
      :src="producto.image"
      :alt="`Imagen de ${producto.title}`"
      class="card-img"
      loading="lazy"
    />
    <div class="card-body">
      <h3 class="card-titulo">{{ producto.title }}</h3>
      <p class="card-desc">{{ truncarTexto(producto.description, 90) }}</p>
      <div class="card-footer">
        <span class="precio">{{ formatPrecio(producto.price) }}</span>
        <span class="rating" :aria-label="`Calificación: ${producto.rating.rate} de 5`">
          ⭐ {{ producto.rating.rate }}
        </span>
        <button
          class="btn-agregar"
          @click="emit('agregar', producto)"
          :aria-label="`Agregar ${producto.title} al carrito`"
        >
          + Carrito
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.15s, box-shadow 0.15s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}
.card-img { width: 100%; height: 180px; object-fit: contain; padding: 1rem; background: #f9f9f9; }
.card-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.card-titulo { font-size: 0.875rem; font-weight: 600; color: #35495E; line-height: 1.4; }
.card-desc { font-size: 0.8rem; color: #777; }
.card-footer { display: flex; align-items: center; gap: 0.5rem; margin-top: auto; }
.precio { font-weight: 700; color: #42B883; flex: 1; }
.rating { font-size: 0.8rem; color: #888; }
.btn-agregar {
  padding: 0.35rem 0.75rem;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-agregar:hover { background: #35495E; }
.btn-agregar:focus-visible { outline: 2px solid #42B883; outline-offset: 2px; }
</style>
```

---

## Paso 4: Verificar el análisis del bundle

Ejecuta el build y observa el output:

```bash
pnpm build
```

Observa los archivos generados en `dist/assets/`. Deberías ver varios chunks separados (uno por vista lazy). Compare el tamaño del chunk principal vs un build sin lazy loading para entender el beneficio.

---

## Paso 5: Verificar el comportamiento del scroll

1. Navega a `/productos`
2. Haz scroll hacia abajo
3. Navega a `/` (inicio)
4. Verifica que la página vuelve al tope automáticamente
5. Usa el botón Atrás del navegador → verifica que regresa a la posición anterior

---

## Validaciones Esperadas

- [ ] `pnpm build` completa sin errores
- [ ] El output de build muestra múltiples chunks (lazy loading funcionando)
- [ ] `formatPrecio(109.95)` devuelve `"$109.95"` (verificar en DevTools)
- [ ] `truncarTexto("texto largo...", 30)` trunca correctamente
- [ ] Al navegar entre rutas, el scroll regresa al tope
- [ ] El botón "Agregar al carrito" tiene `aria-label` descriptivo (verificar con DevTools → Accessibility)
- [ ] Las imágenes tienen `loading="lazy"` (verificar en Elements)

---

## Entregables

- `src/utils/formatters.ts`
- `src/router/index.ts` con lazy loading y `scrollBehavior`
- `src/components/ProductCard.vue` con formatters y accesibilidad

---

## Commits Sugeridos

```bash
git add src/utils/formatters.ts
git commit -m "feat: utilidades de formato (formatPrecio, truncarTexto, formatFecha)"
git add src/router/index.ts
git commit -m "perf: lazy loading completo en rutas + scrollBehavior"
git add src/components/ProductCard.vue
git commit -m "refactor: ProductCard usa formatters y mejora accesibilidad (módulo 13)"
```
