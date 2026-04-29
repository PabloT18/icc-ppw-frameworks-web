# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 3: Componentes, Props y Estilos

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

En Vue, los **componentes** son la unidad fundamental de composición de la UI. Un componente es un bloque de interfaz reutilizable que encapsula template, lógica y estilos.

Cuando una aplicación crece, mantener toda la lógica en `App.vue` no escala. La solución es descomponer la UI en componentes más pequeños y reutilizables, y comunicarlos mediante **props** (datos que fluyen del padre al hijo).

Este módulo establece el patrón de organización visual del proyecto que se usará en los módulos siguientes.

### ¿Por qué componentes?

| Sin componentes | Con componentes |
|---|---|
| Todo en `App.vue` | UI dividida en archivos pequeños |
| HTML repetido | Reutilización con props diferentes |
| Difícil de mantener | Cada componente tiene una responsabilidad |
| Sin aislamiento de estilos | `scoped` evita conflictos de CSS |

---

## 2. Conceptos Clave

### Props

Las props son la forma de pasar datos de un componente padre a un componente hijo. Son **unidireccionales**: el hijo no puede modificar una prop directamente.

```vue
<!-- Hijo recibe props -->
<script setup lang="ts">
const props = defineProps<{
  titulo: string
  precio: number
  disponible?: boolean   // opcional
}>()
</script>
```

```vue
<!-- Padre pasa props -->
<template>
  <ProductCard titulo="Laptop" :precio="1299" :disponible="true" />
</template>
```

### `defineProps` con TypeScript

En `<script setup lang="ts">` se usa la forma genérica de `defineProps`:

```typescript
// Forma básica (inferida de TypeScript)
const props = defineProps<{
  nombre: string
  edad: number
  activo?: boolean
}>()

// Con valores por defecto (requiere withDefaults)
const props = withDefaults(defineProps<{
  nombre: string
  color?: string
}>(), {
  color: '#42B883'
})
```

### Slots

Los slots permiten que un componente padre inyecte contenido dentro del hijo:

```vue
<!-- Componente hijo con slot -->
<template>
  <div class="card">
    <slot />   <!-- Aquí irá el contenido del padre -->
  </div>
</template>
```

```vue
<!-- Padre usando el slot -->
<template>
  <Card>
    <p>Este contenido viene del padre</p>
  </Card>
</template>
```

### Estilos `scoped`

Con `<style scoped>`, los estilos solo aplican al componente donde están declarados. Vue agrega un atributo de datos único para aislar el CSS:

```vue
<style scoped>
/* Solo afecta a los elementos de ESTE componente */
.card {
  background: white;
  border-radius: 8px;
}
</style>
```

### Estilos globales

Para estilos que aplican a toda la aplicación, se usa `src/assets/main.css` (ya importado en `main.ts`):

```typescript
// main.ts
import './assets/main.css'   // estilos globales
```

---

## 3. Explicación

### Registrar y usar un componente

En Vue 3 con `<script setup>`, los componentes importados se registran automáticamente; no hace falta declararlos en un `components`:

```vue
<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
// ProductCard ya está disponible en el template
</script>

<template>
  <ProductCard titulo="Laptop" :precio="1299" />
</template>
```

### Binding dinámico de props con `:`

Las props de texto fijo se pasan como strings normales:

```html
<ProductCard titulo="Laptop" />
```

Las props con valores dinámicos (variables, números, booleanos, objetos) se pasan con `:` (abreviatura de `v-bind:`):

```html
<ProductCard :titulo="nombreProducto" :precio="costo" :disponible="enStock" />
```

Sin `:`, todo se pasa como string literal, incluso los números:

```html
<!-- precio recibe el string "1299", no el número 1299 -->
<ProductCard titulo="Laptop" precio="1299" />

<!-- precio recibe el número 1299 -->
<ProductCard titulo="Laptop" :precio="1299" />
```

### Organización de carpetas de componentes

```
src/
├── components/
│   ├── ui/              ← Componentes genéricos reutilizables (Button, Card, Badge)
│   └── domain/          ← Componentes específicos del dominio (ProductCard, UserProfile)
├── views/               ← Páginas completas (se agregan en módulo 09 con Router)
├── composables/         ← Lógica reutilizable (módulo 08)
├── services/            ← Consumo de APIs (módulo 11)
└── stores/              ← Estado global (módulo 10)
```

Para este módulo solo se trabaja con `src/components/`.

### Flujo de datos unidireccional

Vue impone un flujo unidireccional de datos: el padre pasa datos al hijo a través de props, y el hijo le notifica eventos al padre a través de `emits`. El hijo nunca debe modificar directamente una prop.

```
App.vue (padre)
  │
  │  props (datos hacia abajo)
  ▼
ProductCard.vue (hijo)
  │
  │  emits (eventos hacia arriba)
  ▼
App.vue (padre) escucha el evento y actualiza su estado
```

Los `emits` se ven en profundidad en el módulo 04.

---

## 4. Ejemplos de Código

### Componente `ProductCard.vue`

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  titulo: string
  descripcion: string
  precio: number
  disponible?: boolean
  imagen?: string
}>(), {
  disponible: true,
  imagen: ''
})
</script>

<template>
  <div class="product-card" :class="{ 'sin-stock': !props.disponible }">
    <div class="card-imagen" v-if="props.imagen">
      <img :src="props.imagen" :alt="props.titulo" />
    </div>
    <div class="card-body">
      <h3 class="card-titulo">{{ props.titulo }}</h3>
      <p class="card-descripcion">{{ props.descripcion }}</p>
      <div class="card-footer">
        <span class="precio">${{ props.precio.toFixed(2) }}</span>
        <span class="badge" :class="props.disponible ? 'disponible' : 'agotado'">
          {{ props.disponible ? 'En stock' : 'Agotado' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-card.sin-stock {
  opacity: 0.6;
}

.card-imagen img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.card-titulo {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #35495E;
}

.card-descripcion {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.precio {
  font-size: 1.1rem;
  font-weight: bold;
  color: #42B883;
}

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.disponible {
  background: #d4f4e7;
  color: #2d7a57;
}

.badge.agotado {
  background: #fde8e8;
  color: #c0392b;
}
</style>
```

### Componente `BaseCard.vue` con slot

```vue
<script setup lang="ts">
defineProps<{
  titulo?: string
}>()
</script>

<template>
  <div class="base-card">
    <div v-if="$slots.header || titulo" class="base-card__header">
      <slot name="header">
        <h3>{{ titulo }}</h3>
      </slot>
    </div>
    <div class="base-card__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.base-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.base-card__header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eee;
}

.base-card__body {
  padding: 1.25rem;
}
</style>
```

---

## 5. Buenas Prácticas

- **Nombres de componentes en PascalCase**: `ProductCard`, `BaseButton`, `UserProfile`.
- **Prefijo `Base` para componentes UI genéricos**: `BaseCard`, `BaseButton`, `BaseInput`.
- **Props siempre tipadas**: usa la forma genérica de `defineProps<{}>()` con TypeScript.
- **No modificar props directamente**: si necesitas mutar el valor, crea un ref local con el valor inicial de la prop.
- **`scoped` por defecto**: solo usar estilos globales para reset, variables y tipografía.
- **Un componente, un archivo**: cada `.vue` exporta un solo componente.
- **Props opcionales con `?`**: marcar como opcionales las props que tienen valor por defecto.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Prop no recibida en hijo | Olvidar `:` para binding dinámico | Usar `:prop="valor"` en lugar de `prop="valor"` |
| `[Vue warn] Extraneous non-props attributes` | Atributos no declarados como props | Agregar la prop a `defineProps` o usar `inheritAttrs: false` |
| CSS del padre afecta al hijo | Usar `<style>` sin `scoped` | Agregar atributo `scoped` al tag `<style>` |
| Componente no encontrado | Ruta de importación incorrecta | Verificar ruta y usar alias `@/` |
| Mutar prop directamente en hijo | Evitado por Vue (warning) | Usar `emit` para notificar al padre o crear ref local |

---

## 7. Relación con el Proyecto Incremental

En este módulo el proyecto empieza a tomar forma visual. Se crea la carpeta `src/components/` y se construyen los primeros componentes reutilizables que se usarán en módulos posteriores.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── assets/
│   └── main.css
├── components/
│   ├── ProductCard.vue     ← Nuevo
│   └── BaseCard.vue        ← Nuevo
├── App.vue                 ← Actualizado: usa los nuevos componentes
└── main.ts
```

En módulos posteriores la carpeta `components/` crecerá con componentes de formularios (módulo 07), layout (módulo 09) y UI de autenticación (módulo 12).

---

## 8. Referencias

- [Vue 3 - Componentes básicos](https://vuejs.org/guide/essentials/component-basics)
- [Vue 3 - Props](https://vuejs.org/guide/components/props)
- [Vue 3 - Slots](https://vuejs.org/guide/components/slots)
- [Vue 3 - `defineProps` con TypeScript](https://vuejs.org/guide/typescript/composition-api#typing-component-props)
- [Estilos con `scoped`](https://vuejs.org/api/sfc-css-features#scoped-css)
