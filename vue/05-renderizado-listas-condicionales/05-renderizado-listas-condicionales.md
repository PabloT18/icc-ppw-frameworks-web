# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 5: Renderizado de Listas y Condicionales

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

La mayoría de interfaces de usuario necesitan mostrar colecciones de datos (listas de productos, usuarios, mensajes) y mostrar u ocultar bloques según condiciones. Vue provee directivas declarativas para ambas necesidades.

A diferencia de JSX (React), donde usas `.map()` y operadores lógicos directamente en JavaScript, Vue usa **directivas en el template** que hacen el código más legible y menos propenso a errores.

### Comparación de enfoques

```jsx
// React: JavaScript en JSX
{productos.map(p => (
  p.disponible && <ProductCard key={p.id} producto={p} />
))}
```

```vue
<!-- Vue: directivas declarativas -->
<ProductCard
  v-for="p in productos"
  :key="p.id"
  v-if="p.disponible"
  :producto="p"
/>
```

---

## 2. Conceptos Clave

### `v-for`: iterar sobre arrays y objetos

```html
<!-- Array de primitivos -->
<li v-for="item in items" :key="item">{{ item }}</li>

<!-- Array de objetos (forma más común) -->
<ProductCard
  v-for="producto in productos"
  :key="producto.id"
  :producto="producto"
/>

<!-- Con índice -->
<li v-for="(item, index) in items" :key="index">
  {{ index + 1 }}. {{ item }}
</li>

<!-- Objeto (clave-valor) -->
<p v-for="(valor, clave) in objeto" :key="clave">
  {{ clave }}: {{ valor }}
</p>
```

### `:key` — por qué es obligatorio

Vue usa `key` para identificar cada nodo del DOM en el algoritmo de reconciliación. Sin `key`, Vue puede reusar elementos incorrectamente al ordenar o filtrar la lista.

```html
<!-- MAL: key no único o faltante -->
<li v-for="item in items">{{ item.nombre }}</li>
<li v-for="(item, i) in items" :key="i">{{ item.nombre }}</li>  <!-- Evitar si la lista puede reordenarse -->

<!-- BIEN: key único y estable -->
<li v-for="item in items" :key="item.id">{{ item.nombre }}</li>
```

### `v-if`, `v-else-if`, `v-else`

Renderiza condicionalmente un elemento (lo agrega o lo elimina del DOM):

```html
<div v-if="estado === 'cargando'">Cargando...</div>
<div v-else-if="estado === 'error'">Error al cargar.</div>
<div v-else-if="items.length === 0">No hay resultados.</div>
<div v-else>
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.nombre }}</li>
  </ul>
</div>
```

`v-if` en elementos consecutivos usa `<template>` como contenedor sin renderizar:

```html
<template v-if="usuarioLogueado">
  <h2>Bienvenido, {{ usuario.nombre }}</h2>
  <p>Último acceso: {{ usuario.ultimoAcceso }}</p>
</template>
```

### `v-show`

A diferencia de `v-if`, `v-show` **siempre renderiza el elemento** pero controla su visibilidad con `display: none`:

```html
<div v-show="menuAbierto">Contenido del menú</div>
```

| | `v-if` | `v-show` |
|---|---|---|
| **DOM** | Agrega/elimina el elemento | Siempre en el DOM |
| **Coste inicial** | Mayor (no renderiza si es falso) | Menor (siempre renderiza) |
| **Coste en toggle** | Mayor (recrea el elemento) | Menor (solo cambia `display`) |
| **Usar cuando** | La condición cambia poco | La condición cambia frecuentemente |

---

## 3. Explicación Técnica Detallada

### Patrón de estado de carga: loading / error / empty / data

Es el patrón más común para cualquier componente que consume datos asíncronos (aplicable desde este módulo con datos locales, y en el módulo 11 con fetch real):

```vue
<template>
  <!-- Estado de carga -->
  <div v-if="cargando" class="estado-carga">Cargando...</div>

  <!-- Estado de error -->
  <div v-else-if="error" class="estado-error">{{ error }}</div>

  <!-- Estado vacío -->
  <div v-else-if="items.length === 0" class="estado-vacio">
    No hay elementos para mostrar.
  </div>

  <!-- Datos disponibles -->
  <ul v-else>
    <li v-for="item in items" :key="item.id">{{ item.nombre }}</li>
  </ul>
</template>
```

### Evitar `v-if` con `v-for` en el mismo elemento

Vue procesa `v-if` antes que `v-for` (Vue 3). Si pones ambos en el mismo elemento, `v-if` no tiene acceso a la variable de `v-for`:

```html
<!-- MAL: v-if no puede acceder a "producto" -->
<li v-for="producto in productos" v-if="producto.disponible" :key="producto.id">

<!-- BIEN: usar computed para filtrar -->
<li v-for="producto in productosDisponibles" :key="producto.id">
```

```typescript
// Filtrar con computed (ver módulo 06)
const productosDisponibles = computed(() =>
  productos.value.filter(p => p.disponible)
)
```

### `<template>` como contenedor invisible

Cuando necesitas aplicar `v-for` o `v-if` a varios elementos sin agregar un nodo extra al DOM:

```html
<template v-for="seccion in secciones" :key="seccion.id">
  <h2>{{ seccion.titulo }}</h2>
  <p>{{ seccion.contenido }}</p>
  <hr>
</template>
```

---

## 4. Ejemplos de Código

### Catálogo con filtro de disponibilidad

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types/product'

const mostrarSoloDisponibles = ref<boolean>(false)

const productos: Product[] = [
  { id: 1, titulo: 'Laptop', descripcion: '...', precio: 1299, disponible: true },
  { id: 2, titulo: 'Tablet', descripcion: '...', precio: 499, disponible: false },
  { id: 3, titulo: 'Monitor', descripcion: '...', precio: 549, disponible: true },
]

const productosFiltrados = () =>
  mostrarSoloDisponibles.value
    ? productos.filter(p => p.disponible)
    : productos
</script>

<template>
  <div>
    <label>
      <input type="checkbox" v-model="mostrarSoloDisponibles">
      Solo disponibles
    </label>

    <div v-if="productosFiltrados().length === 0" class="vacio">
      No hay productos disponibles.
    </div>

    <div v-else class="grid">
      <div
        v-for="producto in productosFiltrados()"
        :key="producto.id"
        class="card"
        :class="{ agotado: !producto.disponible }"
      >
        <h3>{{ producto.titulo }}</h3>
        <p>${{ producto.precio }}</p>
        <span v-if="!producto.disponible">Agotado</span>
      </div>
    </div>
  </div>
</template>
```

### Lista con estado de carga simulado

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const cargando = ref<boolean>(true)
const items = ref<string[]>([])
const error = ref<string>('')

onMounted(() => {
  // Simula una carga asíncrona
  setTimeout(() => {
    items.value = ['Item A', 'Item B', 'Item C']
    cargando.value = false
  }, 1500)
})
</script>

<template>
  <div v-if="cargando">Cargando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="items.length === 0">Sin resultados</div>
  <ul v-else>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>
```

---

## 5. Buenas Prácticas

- **Siempre usa `:key` único y estable**: preferiblemente el `id` de la entidad, nunca el índice del array si la lista puede cambiar de orden.
- **Filtra con `computed`, no con `v-if` + `v-for` en el mismo elemento**.
- **Muestra siempre el estado vacío**: el usuario necesita saber por qué no ve nada.
- **Usa `v-show` para toggles frecuentes** (menús, dropdowns); usa `v-if` para bloques que raramente cambian.
- **No abuses de `v-if` anidado**: si tienes más de 3 niveles de condición, considera refactorizar el componente.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| `[Vue warn] Missing required prop "key"` | Falta `:key` en `v-for` | Agregar `:key="item.id"` |
| Lista no se actualiza al filtrar | Mutar el array directamente (`arr[0] = x`) | Usar métodos reactivos: `push`, `splice`, `filter` con reasignación |
| `v-if` no accede a variable de `v-for` | Ambas directivas en el mismo elemento | Mover el filtro a una función o `computed` |
| `v-show` no oculta correctamente | CSS conflicto con `display` | Verificar que no haya `!important` sobreescribiendo |
| Items duplicados en lista | `key` duplicada | Verificar que los IDs sean únicos |

---

## 7. Relación con el Proyecto Incremental

En este módulo el catálogo de productos pasa de estar codificado en duro a ser una lista real iterada con `v-for`. El carrito también usa `v-for` para mostrar los items. Se agrega el patrón de estado vacío.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── components/
│   ├── ProductCard.vue    ← usa :key internamente
│   └── BaseCard.vue
├── App.vue                ← v-for en catálogo, v-if en carrito
└── types/
    └── product.ts
```

---

## 8. Referencias

- [Vue 3 - Renderizado de listas](https://vuejs.org/guide/essentials/list)
- [Vue 3 - Renderizado condicional](https://vuejs.org/guide/essentials/conditional)
- [Vue 3 - `v-for` con `:key`](https://vuejs.org/guide/essentials/list#maintaining-state-with-key)
- [Vue 3 - `v-show` vs `v-if`](https://vuejs.org/guide/essentials/conditional#v-show)
