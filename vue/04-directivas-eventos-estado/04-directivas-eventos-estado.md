# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 4: Directivas, Eventos y Estado

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Las **directivas** son atributos especiales del template de Vue que agregan comportamiento reactivo al HTML. Son la forma idiomática de conectar el estado de JavaScript con el DOM sin manipularlo manualmente.

En este módulo profundizas en las directivas de binding y eventos, y aprendes a manejar el estado local de un componente con `ref` y `reactive`.

### Antes vs. después de Vue

```javascript
// Vanilla JS: manipulación manual del DOM
const btn = document.querySelector('#btn')
const count = document.querySelector('#count')
let contador = 0

btn.addEventListener('click', () => {
  contador++
  count.textContent = contador
})
```

```vue
<!-- Vue: estado declarativo, DOM actualizado automáticamente -->
<script setup lang="ts">
import { ref } from 'vue'
const contador = ref(0)
</script>
<template>
  <button @click="contador++">{{ contador }}</button>
</template>
```

---

## 2. Conceptos Clave

### Directivas principales

| Directiva | Abreviatura | Propósito |
|---|---|---|
| `v-bind:attr` | `:attr` | Binding de atributos y props |
| `v-on:evento` | `@evento` | Escuchar eventos del DOM |
| `v-model` | — | Binding bidireccional (formularios) |
| `v-if` / `v-else` | — | Renderizado condicional (módulo 05) |
| `v-for` | — | Iteración sobre listas (módulo 05) |
| `v-show` | — | Visibilidad (módulo 05) |

### `v-bind` (`:`)

Conecta un atributo HTML con una expresión de JavaScript:

```html
<!-- Sin binding: valor fijo (string literal) -->
<img src="logo.png" alt="Logo">

<!-- Con binding: valor dinámico desde JavaScript -->
<img :src="urlLogo" :alt="textoAlternativo">
<button :disabled="cargando">Enviar</button>
<div :class="{ activo: estaActivo, error: tieneError }">...</div>
<div :style="{ color: colorTexto, fontSize: tamanoFuente + 'px' }">...</div>
```

### `v-on` (`@`)

Escucha eventos del DOM y ejecuta código o funciones:

```html
<!-- Inline handler -->
<button @click="contador++">Incrementar</button>

<!-- Referencia a función -->
<button @click="manejarClick">Click</button>

<!-- Con objeto de evento -->
<input @input="manejarInput">
<form @submit.prevent="enviarFormulario">
```

### Modificadores de eventos

```html
<!-- .prevent: previene el comportamiento por defecto -->
<form @submit.prevent="enviar">

<!-- .stop: detiene la propagación del evento -->
<button @click.stop="accion">

<!-- .enter: solo dispara al presionar Enter -->
<input @keyup.enter="buscar">

<!-- .once: se ejecuta una sola vez -->
<button @click.once="inicializar">
```

### `ref` vs `reactive`

| | `ref` | `reactive` |
|---|---|---|
| **Uso** | Valores primitivos y cualquier tipo | Objetos y arrays |
| **Acceso en script** | `nombre.value` | `objeto.propiedad` |
| **Acceso en template** | `nombre` (sin `.value`) | `objeto.propiedad` |
| **Desestructuración** | Se pierde reactividad | Se pierde reactividad |

```typescript
import { ref, reactive } from 'vue'

// ref: para primitivos o cuando necesitas reasignar
const activo = ref<boolean>(false)
const nombre = ref<string>('')

// reactive: para objetos de estado agrupados
const form = reactive({
  usuario: '',
  contrasena: '',
  recordar: false
})

// Acceso
activo.value = true          // en script
form.usuario = 'ana@mail.com' // en script (sin .value)
```

---

## 3. Explicación Técnica Detallada

### Binding de clase dinámico

```html
<!-- Objeto: { 'clase-css': expresion-booleana } -->
<div :class="{ activo: estaActivo, deshabilitado: !habilitado }">

<!-- Array: combina clases fijas y dinámicas -->
<div :class="['clase-base', { extra: condicion }]">

<!-- Expresión directa -->
<div :class="estaActivo ? 'activo' : 'inactivo'">
```

### Binding de estilo dinámico

```html
<!-- Objeto de estilos inline -->
<div :style="{ backgroundColor: color, fontSize: tamano + 'px' }">

<!-- Referencia a objeto reactivo -->
<div :style="estilosCard">
```

```typescript
const estilosCard = reactive({
  backgroundColor: '#fff',
  borderLeft: '4px solid #42B883'
})
```

### Eventos del componente hijo con `emit`

El hijo notifica al padre mediante eventos emitidos:

```vue
<!-- Hijo: ProductCard.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  agregar: [producto: { id: number; titulo: string }]
  eliminar: [id: number]
}>()

function handleAgregar() {
  emit('agregar', { id: 1, titulo: 'Laptop' })
}
</script>
<template>
  <button @click="handleAgregar">Agregar al carrito</button>
</template>
```

```vue
<!-- Padre: App.vue -->
<template>
  <ProductCard @agregar="manejarAgregar" />
</template>
<script setup lang="ts">
function manejarAgregar(producto: { id: number; titulo: string }) {
  console.log('Agregado:', producto)
}
</script>
```

---

## 4. Ejemplos de Código

### Toggle de clase con `v-bind`

```vue
<script setup lang="ts">
import { ref } from 'vue'
const menuAbierto = ref<boolean>(false)
const modoOscuro = ref<boolean>(false)
</script>

<template>
  <button @click="menuAbierto = !menuAbierto">
    {{ menuAbierto ? 'Cerrar' : 'Abrir' }} Menú
  </button>

  <nav :class="{ 'menu-abierto': menuAbierto }">
    <a href="#">Inicio</a>
    <a href="#">Productos</a>
  </nav>

  <button @click="modoOscuro = !modoOscuro">Modo Oscuro</button>
  <main :class="{ 'dark': modoOscuro }">
    <p>Contenido</p>
  </main>
</template>
```

### Estado con `reactive` para un objeto complejo

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const carrito = reactive<{
  items: { id: number; nombre: string; precio: number }[]
  descuento: number
}>({
  items: [],
  descuento: 0
})

function agregar(item: { id: number; nombre: string; precio: number }) {
  carrito.items.push(item)
}

function limpiar() {
  carrito.items = []
}

const total = () => carrito.items.reduce((acc, i) => acc + i.precio, 0)
</script>

<template>
  <p>Items: {{ carrito.items.length }}</p>
  <p>Total: ${{ total().toFixed(2) }}</p>
  <button @click="limpiar">Limpiar carrito</button>
</template>
```

---

## 5. Buenas Prácticas

- **Usa siempre `@` y `:`** en lugar de `v-on:` y `v-bind:`; la abreviatura es el estándar del ecosistema.
- **`.prevent` en formularios**: siempre agrega `@submit.prevent` para evitar el reload de página.
- **`defineEmits` tipados**: siempre tipifica los emits para que el padre sepa qué recibir.
- **`reactive` para objetos relacionados**: agrupa estado relacionado (como un formulario) en un solo objeto `reactive`.
- **`ref` para primitivos**: booleanos, strings, números que cambian independientemente.
- **Evita lógica compleja en el template**: mueve expresiones largas a `computed` (módulo 06).

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Atributo no se actualiza | Olvidar `:` en binding | Cambiar `src="url"` a `:src="url"` |
| Formulario hace reload | Sin `.prevent` en `@submit` | Usar `@submit.prevent="funcion"` |
| `reactive` pierde reactividad | Desestructurar el objeto | Usar `toRefs(objeto)` o acceder directamente |
| Evento no llega al padre | `emit` no definido | Declarar en `defineEmits` |
| `v-bind` con booleano como string | Sin `:`, el valor es el string `"false"` | Usar binding dinámico `:disabled="false"` |

---

## 7. Relación con el Proyecto Incremental

En este módulo agregas interactividad real a los componentes. El `ProductCard` recibe un emit para agregar al carrito, y `App.vue` lleva el estado del carrito con `reactive`.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── components/
│   ├── ProductCard.vue    ← Agrega emit "agregar"
│   └── BaseCard.vue
└── App.vue                ← Maneja el evento "agregar" y lleva el carrito
```

---

## 8. Referencias

- [Vue 3 - Directivas integradas](https://vuejs.org/api/built-in-directives)
- [Vue 3 - Manejo de eventos](https://vuejs.org/guide/essentials/event-handling)
- [Vue 3 - `reactive`](https://vuejs.org/api/reactivity-core#reactive)
- [Vue 3 - `defineEmits`](https://vuejs.org/api/sfc-script-setup#defineemits)
- [Vue 3 - Binding de clase y estilo](https://vuejs.org/guide/essentials/class-and-style)
