# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 2: Fundamentos de Vue

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Vue 3 cambia la forma de escribir componentes respecto a Vue 2 y respecto a frameworks como React o Angular. El corazón de Vue es la **reactividad declarativa**: describes el estado de tu UI y Vue se encarga de mantenerla sincronizada automáticamente.

En este módulo entenderás la estructura de un Single File Component (SFC), el modelo mental de Vue, la Composition API con `<script setup>` y cómo funciona `ref` para manejar estado reactivo básico.

### Vue vs otros enfoques

| Aspecto | Vanilla JS | Vue 3 |
|---|---|---|
| Actualización del DOM | Manual (`innerHTML`, `textContent`) | Automática (reactividad declarativa) |
| Estructura del código | Libre, sin convención | SFC: template + script + style |
| Estado | Variables normales | `ref`, `reactive` |
| Reactividad | `addEventListener` + lógica manual | Automática al cambiar el estado |
| TypeScript | Requiere configuración | Nativo en `<script setup lang="ts">` |

---

## 2. Conceptos Clave

### Single File Component (SFC)

Un archivo `.vue` encapsula tres bloques en un solo archivo:

```vue
<script setup lang="ts">
// Lógica del componente (Composition API)
</script>

<template>
  <!-- HTML del componente -->
</template>

<style scoped>
/* CSS del componente (aislado por defecto) */
</style>
```

| Bloque | Obligatorio | Propósito |
|---|---|---|
| `<template>` | Sí | Estructura visual (HTML extendido con directivas Vue) |
| `<script setup>` | No | Lógica reactiva, estado, funciones |
| `<style scoped>` | No | Estilos aislados al componente |

### `<script setup>`

Es el modo moderno de escribir lógica en Vue 3. Equivale a la función `setup()` de la Composition API pero sin la verbosidad de `return`:

```vue
<!-- Equivalente antiguo (Options API) -->
<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  }
}
</script>

<!-- Forma moderna (<script setup>) -->
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
const increment = () => count.value++
</script>
```

Todo lo declarado en `<script setup>` es automáticamente disponible en `<template>`.

### Interpolación de texto

Para mostrar datos en el template se usa la sintaxis de dobles llaves:

```vue
<template>
  <p>{{ mensaje }}</p>
  <p>{{ 2 + 2 }}</p>
  <p>{{ usuario.nombre.toUpperCase() }}</p>
</template>
```

Las expresiones dentro de `{{ }}` son JavaScript puro. Se puede usar cualquier expresión válida, pero no sentencias (`if`, `for`, declaraciones de variables).

---

## 3. Explicación Técnica Detallada

### `ref`: reactividad para valores primitivos

`ref` convierte un valor en una referencia reactiva. Cuando el valor cambia, Vue actualiza el DOM automáticamente.

```typescript
import { ref } from 'vue'

const nombre = ref<string>('Ana')
const edad = ref<number>(25)
const activo = ref<boolean>(true)
```

**Regla importante**: dentro de `<script setup>`, para leer o modificar un ref se accede a través de `.value`:

```typescript
console.log(nombre.value)   // 'Ana'
nombre.value = 'María'      // actualización reactiva
```

Pero en `<template>` Vue desenvuelve el ref automáticamente:

```vue
<template>
  <!-- Aquí NO se usa .value -->
  <p>{{ nombre }}</p>
</template>
```

### Anotaciones de tipo con TypeScript

Con `lang="ts"` en `<script setup>` puedes tipar los refs:

```typescript
const nombre = ref<string>('')
const usuarios = ref<string[]>([])
const producto = ref<{ id: number; nombre: string } | null>(null)
```

Si el tipo inicial es claro, TypeScript puede inferirlo sin anotación explícita:

```typescript
const count = ref(0)          // TypeScript infiere: Ref<number>
const activo = ref(false)     // TypeScript infiere: Ref<boolean>
```

### Expresiones en template

Vue compila el template a funciones de render de JavaScript. Las expresiones dentro del template deben ser:

- Expresiones de valor: `{{ precio * cantidad }}`
- Acceso a propiedades: `{{ usuario.nombre }}`
- Llamadas a funciones: `{{ formatearFecha(fecha) }}`
- Ternarios: `{{ edad >= 18 ? 'Mayor' : 'Menor' }}`

No son válidas como expresiones independientes dentro de `{{ }}`:
- Declaraciones: `{{ let x = 1 }}`
- Sentencias de control: `{{ if (x) ... }}`

---

## 4. Ejemplos de Código

### Componente básico con `ref`

```vue
<script setup lang="ts">
import { ref } from 'vue'

const titulo = ref<string>('Fundamentos de Vue')
const contador = ref<number>(0)

function incrementar(): void {
  contador.value++
}

function decrementar(): void {
  if (contador.value > 0) contador.value--
}
</script>

<template>
  <div>
    <h1>{{ titulo }}</h1>
    <p>Contador: {{ contador }}</p>
    <button @click="incrementar">+</button>
    <button @click="decrementar">-</button>
  </div>
</template>

<style scoped>
button {
  margin: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
```

### Interpolación avanzada

```vue
<script setup lang="ts">
import { ref } from 'vue'

const precio = ref<number>(29.99)
const cantidad = ref<number>(3)
const descuento = ref<number>(0.1) // 10%
</script>

<template>
  <div>
    <p>Precio unitario: ${{ precio.toFixed(2) }}</p>
    <p>Cantidad: {{ cantidad }}</p>
    <p>Subtotal: ${{ (precio * cantidad).toFixed(2) }}</p>
    <p>Con descuento: ${{ (precio * cantidad * (1 - descuento)).toFixed(2) }}</p>
  </div>
</template>
```

---

## 5. Buenas Prácticas

- **Usa siempre `<script setup lang="ts">`**: es el estándar moderno; evita la verbosidad de `setup()` y `return`.
- **Tipado explícito en refs**: `ref<string>('')` en lugar de `ref('')` cuando el tipo no es obvio.
- **Nombres descriptivos**: `const nombreUsuario = ref('')` en lugar de `const n = ref('')`.
- **Una responsabilidad por componente**: si el script crece más de ~60 líneas, considera dividirlo.
- **No llames a funciones costosas directamente en `{{ }}`**: mejor usa `computed` (módulo 06).
- **Evita lógica de negocio en el template**: el template es solo para presentar datos, no para calcular.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| `Cannot read properties of undefined (reading 'value')` | Acceder a `.value` de un ref que es `null` o `undefined` | Inicializar con valor o verificar antes |
| El DOM no se actualiza | Modificar la variable directamente sin `ref` | Envolver el valor en `ref()` |
| `nombre` no definido en template | Falta importar o declarar la variable en `<script setup>` | Declarar en el bloque `<script setup>` |
| Usar `.value` en el template | Vue lo desenvuelve automáticamente en template | Remover `.value` en la expresión del template |
| Estilos que afectan a otros componentes | Olvidar `scoped` en `<style>` | Agregar atributo `scoped` al tag `<style>` |

---

## 7. Relación con el Proyecto Incremental

En este módulo agregas la primera lógica reactiva al `App.vue` del proyecto. No se crean componentes todavía; solo se trabaja dentro del componente raíz para entender el ciclo reactivo de Vue.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── assets/
│   └── main.css
├── App.vue          ← Contiene ref básico y template con interpolación
└── main.ts
```

A partir del módulo 03, empezarás a dividir la UI en componentes reutilizables. Todo el estado que pongas ahora en `App.vue` puede migrarse a componentes o stores más adelante.

---

## 8. Referencias

- [Vue 3 - Conceptos básicos](https://vuejs.org/guide/essentials/reactivity-fundamentals)
- [Vue 3 - Template Syntax](https://vuejs.org/guide/essentials/template-syntax)
- [Vue 3 - `<script setup>`](https://vuejs.org/api/sfc-script-setup)
- [Vue 3 - `ref`](https://vuejs.org/api/reactivity-core#ref)
- [Single File Components](https://vuejs.org/guide/scaling-up/sfc)
