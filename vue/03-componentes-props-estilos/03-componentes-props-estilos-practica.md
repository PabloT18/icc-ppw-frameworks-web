# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 3: Componentes, Props y Estilos

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Práctico

Descomponer la UI del proyecto en componentes reutilizables. Al finalizar, el proyecto tendrá una tarjeta de producto (`ProductCard`) y una tarjeta contenedora genérica (`BaseCard`), ambas funcionando con props tipadas y estilos scoped.

---

## Contexto

Continuamos con el mismo proyecto `ppw-vue-app`. El componente raíz `App.vue` ya tiene estado reactivo básico. En esta práctica, la UI se divide en componentes reutilizables que empiezan a construir la estructura visual del proyecto.

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/src/
├── components/
│   ├── ProductCard.vue    ← Crear
│   └── BaseCard.vue       ← Crear
└── App.vue                ← Modificar: usar los nuevos componentes
```

---

## Archivos base desde `files/`

### `src/components/ProductCard.vue` — punto de partida

```vue
<script setup lang="ts">
// PASO 1: Define las props aquí
</script>

<template>
  <div class="product-card">
    <!-- PASO 2: Muestra los datos del producto aquí -->
  </div>
</template>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem;
}
</style>
```

### `src/components/BaseCard.vue` — punto de partida

```vue
<script setup lang="ts">
// PASO 4: Define prop opcional titulo
</script>

<template>
  <div class="base-card">
    <!-- PASO 4: agrega el header con slot nombrado y el slot por defecto -->
  </div>
</template>

<style scoped>
.base-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}
</style>
```

---

## Paso 1: Crear y definir las props de `ProductCard`

En `src/components/ProductCard.vue`, dentro del bloque `<script setup lang="ts">`, agrega:

```typescript
const props = withDefaults(defineProps<{
  titulo: string
  descripcion: string
  precio: number
  disponible?: boolean
}>(), {
  disponible: true
})
```

**¿Qué hace este código?**
- `defineProps<{...}>()`: declara las props del componente con tipos TypeScript
- `withDefaults(...)`: permite especificar valores por defecto para props opcionales
- `disponible?: boolean`: el `?` indica que esta prop es opcional
- `withDefaults` establece `disponible: true` como valor por defecto cuando no se pasa la prop

---

## Paso 2: Agregar el template de `ProductCard`

Dentro del `<template>` de `ProductCard.vue`, reemplaza el comentario por:

```html
<div class="product-card" :class="{ 'sin-stock': !props.disponible }">
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
```

**¿Qué hace este código?**
- `:class="{ 'sin-stock': !props.disponible }"`: binding dinámico de clase CSS; agrega `sin-stock` si el producto no está disponible
- `props.precio.toFixed(2)`: muestra el precio con dos decimales
- El ternario `props.disponible ? '...' : '...'` selecciona el texto y la clase según el estado

Completa el bloque `<style scoped>` con:

```css
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

.badge.disponible { background: #d4f4e7; color: #2d7a57; }
.badge.agotado { background: #fde8e8; color: #c0392b; }
```

---

## Paso 3: Usar `ProductCard` en `App.vue`

En `src/App.vue`, agrega la importación y usa el componente:

```typescript
// Dentro de <script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
```

En el `<template>`, agrega una sección con varios productos:

```html
<section class="productos">
  <h2>Catálogo de Productos</h2>
  <div class="grid">
    <ProductCard
      titulo="Laptop Pro"
      descripcion="Procesador i7, 16GB RAM, SSD 512GB"
      :precio="1299.99"
      :disponible="true"
    />
    <ProductCard
      titulo="Monitor 4K"
      descripcion="27 pulgadas, panel IPS, 144Hz"
      :precio="549.00"
      :disponible="true"
    />
    <ProductCard
      titulo="Teclado Mecánico"
      descripcion="Switch Cherry MX Red, retroiluminación RGB"
      :precio="189.99"
      :disponible="false"
    />
  </div>
</section>
```

Agrega los estilos de la sección en `<style scoped>` de `App.vue`:

```css
.productos {
  margin-top: 2rem;
}

.productos h2 {
  color: #35495E;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}
```

> Captura pendiente: tres tarjetas de productos en la grilla, con la tercera mostrando el badge "Agotado".

---

## Paso 4: Crear `BaseCard` con slot

En `src/components/BaseCard.vue`, agrega la prop opcional y el template con slots:

```typescript
// <script setup lang="ts">
defineProps<{
  titulo?: string
}>()
```

```html
<!-- <template> -->
<div class="base-card">
  <div class="base-card__header" v-if="titulo">
    <slot name="header">
      <h3>{{ titulo }}</h3>
    </slot>
  </div>
  <div class="base-card__body">
    <slot />
  </div>
</div>
```

```css
/* <style scoped> */
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

.base-card__header h3 {
  margin: 0;
  color: #35495E;
}

.base-card__body {
  padding: 1.25rem;
}
```

**¿Qué hace `<slot />`?**
- Es un punto de inyección de contenido: el padre puede poner cualquier HTML dentro de `<BaseCard>` y aparecerá en este lugar
- `v-if="titulo"` muestra el header solo si se pasa la prop `titulo` (o si se usa el slot nombrado `header`)

Usa `BaseCard` en `App.vue` para envolver una sección de información:

```html
<BaseCard titulo="Información del módulo">
  <p>Este módulo cubre componentes, props y estilos scoped.</p>
  <p>Componentes creados: <strong>ProductCard</strong>, <strong>BaseCard</strong>.</p>
</BaseCard>
```

No olvides importar `BaseCard` en el `<script setup>` de `App.vue`:

```typescript
import BaseCard from '@/components/BaseCard.vue'
```

---

## Validaciones Esperadas

- [ ] `ProductCard` recibe y muestra `titulo`, `descripcion` y `precio`
- [ ] La tarjeta con `disponible: false` muestra el badge "Agotado" y tiene opacidad reducida
- [ ] `BaseCard` renderiza el slot correctamente con el contenido del padre
- [ ] Los estilos están en `scoped` y no se mezclan entre componentes
- [ ] El alias `@/` funciona en los imports
- [ ] Sin warnings ni errores en consola

---

## Entregables

- `src/components/ProductCard.vue` con props tipadas y estilos scoped
- `src/components/BaseCard.vue` con slot y prop opcional
- `src/App.vue` actualizado usando ambos componentes

---

## Commits Sugeridos

```bash
git add src/components/
git commit -m "feat: componentes ProductCard y BaseCard con props y slots (módulo 03)"
git add src/App.vue
git commit -m "feat: integrar ProductCard y BaseCard en App.vue"
```
