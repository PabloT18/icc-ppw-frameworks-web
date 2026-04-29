# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 8: Composables

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

A medida que el proyecto crece, la lógica de los componentes empieza a duplicarse: el mismo código de filtrado aparece en varias vistas, la misma lógica de localStorage se repite. Los **composables** son la respuesta de Vue a este problema.

Un composable es una función de JavaScript que usa la Composition API de Vue para encapsular y reutilizar lógica con estado. Es el equivalente de los Custom Hooks de React, pero con la ergonomía de Vue.

---

## 2. Conceptos Clave

### ¿Qué es un composable?

Por convención, los composables:
- Se llaman con el prefijo `use`: `useCarrito`, `useLocalStorage`, `useProductos`
- Son funciones JavaScript normales que retornan refs, computeds y funciones
- Pueden usarse en cualquier componente con `<script setup>`
- Se guardan en `src/composables/`

```typescript
// src/composables/useContador.ts
import { ref } from 'vue'

export function useContador(inicial: number = 0) {
  const count = ref(inicial)

  function incrementar() { count.value++ }
  function decrementar() { if (count.value > 0) count.value-- }
  function reiniciar() { count.value = inicial }

  return { count, incrementar, decrementar, reiniciar }
}
```

```vue
<!-- En un componente -->
<script setup lang="ts">
import { useContador } from '@/composables/useContador'

const { count, incrementar, decrementar } = useContador(10)
</script>
```

### Composables vs mixins vs utilidades

| | Composables | Mixins (Vue 2) | Funciones puras |
|---|---|---|---|
| **Estado reactivo** | Sí | Sí | No |
| **Lifecycle hooks** | Sí | Sí | No |
| **Colisiones de nombre** | No (desestructuración) | Sí | No |
| **Claridad de origen** | Claro | Confuso | Claro |
| **TypeScript** | Excelente | Difícil | Excelente |

---

## 3. Explicación Técnica Detallada

### Encapsular estado y lógica

El poder de los composables está en que **el estado es local a cada uso**:

```typescript
// Cada componente que llame useContador tiene su PROPIO contador
const { count: countA } = useContador(0)
const { count: countB } = useContador(100)
// countA y countB son independientes
```

Si quieres estado **compartido** entre componentes, debes retornar refs definidos **fuera** de la función:

```typescript
// Estado compartido (singleton)
const carritoItems = ref([])

export function useCarritoCompartido() {
  // Todos los componentes comparten el mismo "carritoItems"
  function agregar(item) { carritoItems.value.push(item) }
  return { carritoItems, agregar }
}
```

Para estado global complejo, Pinia (módulo 10) es la solución recomendada.

### Composable con `onMounted` y `onUnmounted`

Los composables pueden usar lifecycle hooks:

```typescript
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  function actualizarTamano() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => window.addEventListener('resize', actualizarTamano))
  onUnmounted(() => window.removeEventListener('resize', actualizarTamano))

  return { width, height }
}
```

### `useLocalStorage`: persistencia automática

```typescript
import { ref, watch } from 'vue'

export function useLocalStorage<T>(clave: string, valorInicial: T) {
  const dato = ref<T>(valorInicial)

  // Cargar desde localStorage al iniciar
  const guardado = localStorage.getItem(clave)
  if (guardado) {
    try {
      dato.value = JSON.parse(guardado)
    } catch {
      dato.value = valorInicial
    }
  }

  // Guardar en localStorage cada vez que cambie
  watch(dato, (nuevoValor) => {
    localStorage.setItem(clave, JSON.stringify(nuevoValor))
  }, { deep: true })

  function limpiar() {
    dato.value = valorInicial
    localStorage.removeItem(clave)
  }

  return { dato, limpiar }
}
```

---

## 4. Ejemplos de Código

### `useFiltroProductos`: extrae la lógica de filtrado

```typescript
// src/composables/useFiltroProductos.ts
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'

export function useFiltroProductos(fuente: () => Product[]) {
  const busqueda = ref('')
  const soloDisponibles = ref(false)

  const productosFiltrados = computed(() => {
    let resultado = fuente()

    if (soloDisponibles.value) {
      resultado = resultado.filter(p => p.disponible)
    }

    const termino = busqueda.value.toLowerCase().trim()
    if (termino) {
      resultado = resultado.filter(p =>
        p.titulo.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino)
      )
    }

    return resultado
  })

  return { busqueda, soloDisponibles, productosFiltrados }
}
```

```vue
<!-- En App.vue -->
<script setup lang="ts">
import { useFiltroProductos } from '@/composables/useFiltroProductos'

const { busqueda, soloDisponibles, productosFiltrados } =
  useFiltroProductos(() => productos.value)
</script>
```

### `useCarrito`: extrae la lógica del carrito

```typescript
// src/composables/useCarrito.ts
import { reactive, computed } from 'vue'
import type { Product } from '@/types/product'

export function useCarrito() {
  const items = reactive<Product[]>([])

  const cantidadItems = computed(() => items.length)
  const subtotal = computed(() => items.reduce((acc, p) => acc + p.precio, 0))
  const iva = computed(() => subtotal.value * 0.12)
  const total = computed(() => subtotal.value + iva.value)

  function agregar(producto: Product): void {
    if (!items.find(p => p.id === producto.id)) {
      items.push(producto)
    }
  }

  function quitar(id: number): void {
    const idx = items.findIndex(p => p.id === id)
    if (idx !== -1) items.splice(idx, 1)
  }

  function limpiar(): void {
    items.splice(0, items.length)
  }

  return { items, cantidadItems, subtotal, iva, total, agregar, quitar, limpiar }
}
```

---

## 5. Buenas Prácticas

- **Prefijo `use`**: es una convención obligatoria para que Vue pueda detectar usos incorrectos fuera de `<script setup>`.
- **Retorna un objeto plano**: evita retornar un objeto `reactive` completo; retorna refs individuales y funciones para permitir renombrar al desestructurar.
- **Tipo los parámetros y el retorno**: usa TypeScript para que el IDE infiera los tipos al importar.
- **Un composable = una responsabilidad**: `useCarrito` solo maneja el carrito, no los filtros del catálogo.
- **Documenta el contrato**: especifica qué espera recibir y qué retorna cada composable.
- **Evita efectos secundarios en el nivel raíz**: los efectos (fetch, timers) van dentro de funciones o lifecycle hooks.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Composable usado fuera de `<script setup>` | Los lifecycle hooks solo funcionan dentro del contexto de setup | Usar composables solo en `<script setup>` o `setup()` |
| Estado compartido no esperado | Refs definidos fuera de la función | Mover los refs adentro de la función si quieres estado independiente por componente |
| Pérdida de reactividad al desestructurar | `const { valor } = reactive({...})` pierde reactividad | Usar `toRefs()` si se desestructura un reactive, o retornar refs desde el composable |
| Error de tipo en retorno | Inferencia incorrecta de TypeScript | Tipar el retorno del composable explícitamente |

---

## 7. Relación con el Proyecto Incremental

En este módulo, la lógica de filtrado del catálogo y el manejo del carrito se extraen de `App.vue` a composables. `App.vue` queda mucho más limpio, delegando la lógica a composables especializados.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── composables/
│   ├── useCarrito.ts          ← Nuevo
│   ├── useFiltroProductos.ts  ← Nuevo
│   └── useLocalStorage.ts     ← Nuevo
├── components/ (sin cambios)
└── App.vue    ← Simplificado: usa composables
```

---

## 8. Referencias

- [Vue 3 - Composables](https://vuejs.org/guide/reusability/composables)
- [Vue 3 - Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq)
- [VueUse - Librería de composables](https://vueuse.org/)
- [Vue 3 - Composables con TypeScript](https://vuejs.org/guide/typescript/composition-api)
