# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 6: Computed Properties y Watchers

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Cuando el estado de un componente crece, empiezan a aparecer cálculos que dependen de ese estado: totales, filtros, textos formateados. Llamar funciones directamente en el template es ineficiente y hace el código más difícil de leer.

Vue ofrece dos herramientas para reaccionar al cambio de estado de manera declarativa: **`computed`** para valores derivados cacheados, y **`watch`** / **`watchEffect`** para ejecutar efectos secundarios cuando el estado cambia.

---

## 2. Conceptos Clave

### `computed`: valores derivados cacheados

`computed` crea una propiedad reactiva que se recalcula **solo cuando sus dependencias cambian**. El resultado queda cacheado hasta la próxima actualización.

```typescript
import { ref, computed } from 'vue'

const precio = ref(100)
const cantidad = ref(3)
const iva = ref(0.12)

// Se recalcula solo cuando precio, cantidad o iva cambian
const total = computed(() =>
  precio.value * cantidad.value * (1 + iva.value)
)

// Acceso en script
console.log(total.value)  // 336

// Acceso en template (sin .value)
// {{ total }}
```

### Método vs `computed`

| | Método | `computed` |
|---|---|---|
| **Cache** | No (ejecuta siempre) | Sí (solo cuando cambian dependencias) |
| **Cuándo usar** | Acciones, efectos secundarios | Valores derivados del estado |
| **En template** | `{{ formatear() }}` | `{{ formateado }}` |

```vue
<!-- Método: se ejecuta en cada re-render aunque no cambie nada -->
<p>{{ calcularTotal() }}</p>

<!-- Computed: usa cache, solo recalcula si cambian sus deps -->
<p>{{ total }}</p>
```

### `watch`: observar cambios específicos

`watch` ejecuta una función cuando un ref o reactive cambia:

```typescript
import { ref, watch } from 'vue'

const busqueda = ref('')

// Vigila cambios en "busqueda"
watch(busqueda, (nuevoValor, valorAnterior) => {
  console.log(`Cambió de "${valorAnterior}" a "${nuevoValor}"`)
  // Aquí harías una llamada a la API, por ejemplo
})
```

### `watchEffect`: vigila automáticamente sus dependencias

`watchEffect` ejecuta la función inmediatamente y la vuelve a ejecutar cuando cualquier dependencia reactiva usada dentro cambia:

```typescript
import { ref, watchEffect } from 'vue'

const pagina = ref(1)
const filtro = ref('todos')

watchEffect(() => {
  // Se ejecuta de inmediato y cada vez que pagina o filtro cambien
  console.log(`Cargando página ${pagina.value} con filtro ${filtro.value}`)
})
```

| | `watch` | `watchEffect` |
|---|---|---|
| **Dependencias** | Declaradas explícitamente | Detectadas automáticamente |
| **Ejecución inicial** | No (por defecto) | Sí (inmediata) |
| **Acceso a valor anterior** | Sí | No |
| **Cuándo usar** | Cuando necesitas el valor previo | Cuando no necesitas el valor previo |

---

## 3. Explicación Técnica Detallada

### `computed` con getter y setter

Por defecto, `computed` es de solo lectura (getter). Se puede agregar un setter para computed bidireccional:

```typescript
const nombre = ref('Ana')
const apellido = ref('García')

const nombreCompleto = computed({
  get: () => `${nombre.value} ${apellido.value}`,
  set: (valor: string) => {
    const [n, ...resto] = valor.split(' ')
    nombre.value = n
    apellido.value = resto.join(' ')
  }
})

nombreCompleto.value = 'María López'
// nombre.value === 'María', apellido.value === 'López'
```

### Opciones de `watch`

```typescript
// immediate: ejecutar de inmediato al montar el componente
watch(busqueda, handler, { immediate: true })

// deep: observar cambios profundos en objetos/arrays
watch(usuario, handler, { deep: true })

// flush: 'post' para ejecutar después de que el DOM se actualice
watch(datos, handler, { flush: 'post' })
```

### Detener un watcher

`watch` y `watchEffect` retornan una función de stop:

```typescript
const stopWatcher = watch(busqueda, handler)

// Detener cuando ya no se necesita
stopWatcher()
```

### Filtro de búsqueda con `computed`

```typescript
const busqueda = ref('')
const productos = ref<Product[]>([...])

const productosFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase().trim()
  if (!termino) return productos.value
  return productos.value.filter(p =>
    p.titulo.toLowerCase().includes(termino) ||
    p.descripcion.toLowerCase().includes(termino)
  )
})
```

---

## 4. Ejemplos de Código

### Resumen del carrito con `computed`

```vue
<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { Product } from '@/types/product'

const carrito = reactive<{ items: Product[] }>({ items: [] })

const subtotal = computed(() =>
  carrito.items.reduce((acc, p) => acc + p.precio, 0)
)

const iva = computed(() => subtotal.value * 0.12)

const total = computed(() => subtotal.value + iva.value)

const cantidadItems = computed(() => carrito.items.length)
</script>

<template>
  <div class="resumen">
    <p>Items: {{ cantidadItems }}</p>
    <p>Subtotal: ${{ subtotal.toFixed(2) }}</p>
    <p>IVA (12%): ${{ iva.toFixed(2) }}</p>
    <p><strong>Total: ${{ total.toFixed(2) }}</strong></p>
  </div>
</template>
```

### Búsqueda en tiempo real con `watch`

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const busqueda = ref('')
const resultados = ref<string[]>([])
const cargandoBusqueda = ref(false)

watch(busqueda, async (termino) => {
  if (!termino.trim()) {
    resultados.value = []
    return
  }
  cargandoBusqueda.value = true
  // Simula búsqueda asíncrona
  await new Promise(r => setTimeout(r, 300))
  resultados.value = ['Resultado 1', 'Resultado 2'].filter(r =>
    r.toLowerCase().includes(termino.toLowerCase())
  )
  cargandoBusqueda.value = false
})
</script>

<template>
  <input v-model="busqueda" placeholder="Buscar...">
  <p v-if="cargandoBusqueda">Buscando...</p>
  <ul v-else>
    <li v-for="r in resultados" :key="r">{{ r }}</li>
  </ul>
</template>
```

---

## 5. Buenas Prácticas

- **Usa `computed` para cualquier valor derivado del estado**: evita duplicar lógica y garantiza consistencia.
- **Nunca hagas efectos secundarios en `computed`**: no llames APIs, no modifiques otros refs. Solo computa y retorna.
- **Prefiere `computed` sobre funciones en el template** para valores que se muestran frecuentemente.
- **Usa `watch` para efectos secundarios**: llamadas a APIs, logs, timers que reaccionan a cambios de estado.
- **Usa `watchEffect` para efectos que se necesitan correr inmediatamente** y cuando no necesitas el valor anterior.
- **Detén watchers en `onUnmounted`** si el componente puede desmontarse con el watcher activo.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| `computed` no se actualiza | No acceder a los refs reactivos dentro del getter | Asegurarse de usar `.value` dentro del computed |
| Efecto secundario en `computed` | Llamar API o modificar estado dentro del getter | Mover la lógica a `watch` o a una función |
| `watch` no detecta cambios en objetos | Sin opción `deep: true` | Agregar `{ deep: true }` o vigilar una propiedad específica |
| `watchEffect` ejecuta demasiado | Demasiadas dependencias reactivas | Usar `watch` con dependencias explícitas |
| Ciclo reactivo infinito | Un `watch` modifica la misma ref que observa | Verificar la lógica y agregar condición de salida |

---

## 7. Relación con el Proyecto Incremental

En este módulo se agrega la funcionalidad de búsqueda y el resumen de precios calculado con `computed`. El catálogo pasa de un filtro simple a un sistema de búsqueda por texto.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── components/
│   ├── ProductCard.vue
│   ├── BaseCard.vue
│   └── EmptyState.vue
└── App.vue    ← computed para totales y filtros, watch para búsqueda
```

---

## 8. Referencias

- [Vue 3 - Computed Properties](https://vuejs.org/guide/essentials/computed)
- [Vue 3 - Watchers](https://vuejs.org/guide/essentials/watchers)
- [Vue 3 - `computed`](https://vuejs.org/api/reactivity-core#computed)
- [Vue 3 - `watch`](https://vuejs.org/api/reactivity-core#watch)
- [Vue 3 - `watchEffect`](https://vuejs.org/api/reactivity-core#watcheffect)
