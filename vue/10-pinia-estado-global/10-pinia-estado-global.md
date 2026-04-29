# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 10: Pinia — Estado Global

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Hasta ahora, el estado del carrito vive en un composable. Eso funciona bien para un componente, pero cuando varios componentes en ramas diferentes del árbol necesitan el mismo estado, los composables con refs compartidas comienzan a ser difíciles de gestionar.

**Pinia** es el gestor de estado oficial de Vue 3. Reemplaza a Vuex con una API más sencilla, completamente compatible con TypeScript y con soporte nativo para las Vue DevTools.

### ¿Cuándo usar Pinia en lugar de composables?

| Situación | Solución |
|---|---|
| Estado local de un componente | `ref` / `reactive` |
| Lógica compartida entre componentes cercanos | Composable |
| Estado global (autenticación, carrito, preferencias) | Pinia store |

---

## 2. Conceptos Clave

### Instalación

```bash
pnpm add pinia
pnpm add pinia-plugin-persistedstate  # persistencia en localStorage
```

### Registro en `main.ts`

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
```

### `defineStore`: la forma de definir un store

Pinia ofrece dos syntaxis: **Options API style** y **Setup API style** (la que usamos, más parecida a `<script setup>`):

```typescript
// src/stores/useContadorStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// defineStore('nombre-unico', función-de-setup)
export const useContadorStore = defineStore('contador', () => {
  // Estado (equivale a data en Options API)
  const count = ref(0)

  // Getters (equivale a computed)
  const doble = computed(() => count.value * 2)

  // Actions (equivale a methods)
  function incrementar() { count.value++ }
  function reiniciar() { count.value = 0 }

  return { count, doble, incrementar, reiniciar }
})
```

### Usar un store en un componente

```vue
<script setup lang="ts">
import { useContadorStore } from '@/stores/useContadorStore'
import { storeToRefs } from 'pinia'

const store = useContadorStore()

// Para reactividad al desestructurar propiedades de estado/getters:
const { count, doble } = storeToRefs(store)

// Las acciones se desestructuran directamente (no necesitan storeToRefs)
const { incrementar, reiniciar } = store
</script>

<template>
  <p>Count: {{ count }} | Doble: {{ doble }}</p>
  <button @click="incrementar">+</button>
  <button @click="reiniciar">Reset</button>
</template>
```

> **Importante**: desestructurar propiedades de un store directamente (`const { count } = store`) pierde la reactividad. Usar `storeToRefs` para propiedades reactivas.

---

## 3. Explicación Técnica Detallada

### `storeToRefs` vs desestructuración directa

```typescript
const store = useContadorStore()

// ❌ Pierde reactividad
const { count } = store          // count es un número, no un ref

// ✅ Mantiene reactividad
const { count } = storeToRefs(store)   // count es un Ref<number>

// ✅ Acciones se desestructuran directamente (son funciones)
const { incrementar } = store
```

### Persistencia con `pinia-plugin-persistedstate`

```typescript
export const useCarritoStore = defineStore('carrito', () => {
  // ... estado y acciones
  return { items, agregar, quitar }
}, {
  persist: true   // ← persiste todo el store en localStorage
})
```

Configuración avanzada:

```typescript
}, {
  persist: {
    key: 'ppw-carrito',         // clave en localStorage
    pick: ['items'],            // solo persistir "items", no los totales computados
  }
})
```

### Compartir estado entre stores

Un store puede usar otro store:

```typescript
// useProductosStore.ts
export const useProductosStore = defineStore('productos', () => {
  const productos = ref<Product[]>([])
  // ...
  return { productos }
})

// useCarritoStore.ts
import { useProductosStore } from './useProductosStore'

export const useCarritoStore = defineStore('carrito', () => {
  const productosStore = useProductosStore()

  const itemsConDetalle = computed(() =>
    items.value.map(id => productosStore.productos.find(p => p.id === id))
  )
  // ...
})
```

### Acceso directo al estado (sin `storeToRefs`)

Si solo necesitas leer el valor una vez (sin reactividad), puedes acceder directamente:

```typescript
const store = useCarritoStore()
console.log(store.items)   // valor actual, no reactivo
```

Para mutar el estado desde fuera del store (en casos de debugging):

```typescript
store.$patch({ campo: nuevoValor })
store.$patch(state => { state.items.push(nuevoItem) })
```

---

## 4. Ejemplos de Código

### Store de carrito completo

```typescript
// src/stores/useCarritoStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref<Product[]>([])

  const cantidadItems = computed(() => items.value.length)
  const subtotal = computed(() => items.value.reduce((acc, p) => acc + p.precio, 0))
  const iva = computed(() => subtotal.value * 0.12)
  const total = computed(() => subtotal.value + iva.value)

  function agregar(producto: Product): void {
    if (!items.value.find(p => p.id === producto.id)) {
      items.value.push(producto)
    }
  }

  function quitar(id: number): void {
    items.value = items.value.filter(p => p.id !== id)
  }

  function limpiar(): void {
    items.value = []
  }

  return { items, cantidadItems, subtotal, iva, total, agregar, quitar, limpiar }
}, {
  persist: {
    key: 'ppw-carrito',
    pick: ['items']
  }
})
```

### Store de autenticación

```typescript
// src/stores/useAuthStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Usuario {
  id: number
  nombre: string
  email: string
  rol: 'admin' | 'usuario'
}

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  const token = ref<string | null>(null)

  const estaAutenticado = computed(() => !!token.value)
  const esAdmin = computed(() => usuario.value?.rol === 'admin')

  function iniciarSesion(user: Usuario, tkn: string): void {
    usuario.value = user
    token.value = tkn
  }

  function cerrarSesion(): void {
    usuario.value = null
    token.value = null
  }

  return { usuario, token, estaAutenticado, esAdmin, iniciarSesion, cerrarSesion }
}, {
  persist: { pick: ['usuario', 'token'] }
})
```

---

## 5. Buenas Prácticas

- **Un store por dominio**: `useCarritoStore`, `useAuthStore`, `useProductosStore` — no un store global gigante.
- **Nombre del store en el fichero**: `useCarritoStore.ts` exporta `useCarritoStore`; coherencia facilita imports.
- **Usa `storeToRefs` siempre que desestructures** propiedades de estado o getters.
- **Las acciones van en el store**: no mutes el estado desde los componentes con `store.items.push(...)` directamente; usa las acciones definidas.
- **Persiste solo lo necesario**: usar `pick` para evitar persistir datos calculados o sensibles.
- **Inicializa el store en un componente**, no a nivel de módulo fuera de `<script setup>`: `useCarritoStore()` requiere que Pinia esté activa.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| `getActivePinia was called with no active Pinia` | Store instanciado fuera del contexto de Vue | Mover la llamada a `useXxxStore()` dentro de `<script setup>` |
| La UI no actualiza al cambiar el store | Desestructuración sin `storeToRefs` | Usar `storeToRefs(store)` |
| Estado no persiste | Plugin no registrado o clave incorrecta | Verificar `.use(piniaPluginPersistedstate)` en `main.ts` |
| Mutations directas al array | `store.items.push()` sin acción definida | Crear acción `agregar()` y llamarla desde el componente |

---

## 7. Relación con el Proyecto Incremental

El composable `useCarrito` se reemplaza por `useCarritoStore`. Los componentes `NavBar`, `CarritoView` y `ProductosView` usan el store directamente. La persistencia se delega al plugin `pinia-plugin-persistedstate`.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── stores/
│   ├── useCarritoStore.ts     ← Nuevo
│   └── useProductosStore.ts   ← Nuevo
├── composables/
│   ├── useFiltroProductos.ts  ← Se mantiene (no es estado global)
│   └── useLocalStorage.ts     ← Se mantiene (utilidad)
├── views/ (sin cambios en estructura)
└── main.ts                    ← Agregar createPinia + plugin
```

---

## 8. Referencias

- [Pinia - Documentación oficial](https://pinia.vuejs.org/)
- [Pinia - Setup Stores](https://pinia.vuejs.org/core-concepts/#setup-stores)
- [Pinia - storeToRefs](https://pinia.vuejs.org/api/modules/pinia.html#storetorefs)
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- [Pinia vs Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)
