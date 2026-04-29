# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 4: Directivas, Eventos y Estado

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Práctico

Agregar interactividad real al proyecto con directivas Vue, binding dinámico y comunicación entre componentes mediante emits. Al finalizar, el usuario podrá agregar productos al carrito desde `ProductCard` y `App.vue` mostrará el resumen del carrito.

---

## Contexto

El proyecto ya tiene `ProductCard` y `BaseCard`. En esta práctica se agrega:
- Un emit `agregar` en `ProductCard`
- Estado del carrito en `App.vue` usando `reactive`
- Binding dinámico de clases y estilos

---

## Archivos que se van a modificar

```
ppw-vue-app/src/
├── components/
│   └── ProductCard.vue    ← Agregar emit y botón
└── App.vue                ← Manejar evento y mostrar carrito
```

---

## Paso 1: Definir el tipo de Producto

Antes de agregar lógica, crea el archivo de tipos en `src/types/product.ts`:

```typescript
export interface Product {
  id: number
  titulo: string
  descripcion: string
  precio: number
  disponible: boolean
}
```

**¿Por qué un archivo de tipos separado?** Permite reutilizar la interfaz en múltiples componentes sin duplicarla. A partir del módulo 11 también la usará el servicio de API.

---

## Paso 2: Agregar emit a `ProductCard`

En `src/components/ProductCard.vue`, actualiza el `<script setup lang="ts">`:

```typescript
import type { Product } from '@/types/product'

const props = withDefaults(defineProps<{
  producto: Product
}>(), {})

const emit = defineEmits<{
  agregar: [producto: Product]
}>()

function handleAgregar(): void {
  if (!props.producto.disponible) return
  emit('agregar', props.producto)
}
```

**Cambio de props**: ahora `ProductCard` recibe un objeto `producto` tipado con la interfaz `Product`, en lugar de props individuales. Esto hace el componente más limpio y fácil de escalar.

**¿Qué hace `defineEmits`?**
- Declara los eventos que el componente puede emitir
- `agregar: [producto: Product]` indica que el evento `agregar` lleva un argumento de tipo `Product`
- El padre puede escuchar este evento con `@agregar="funcion"`

Actualiza el template de `ProductCard`:

```html
<template>
  <div class="product-card" :class="{ 'sin-stock': !props.producto.disponible }">
    <div class="card-body">
      <h3 class="card-titulo">{{ props.producto.titulo }}</h3>
      <p class="card-descripcion">{{ props.producto.descripcion }}</p>
      <div class="card-footer">
        <span class="precio">${{ props.producto.precio.toFixed(2) }}</span>
        <button
          class="btn-agregar"
          :disabled="!props.producto.disponible"
          @click="handleAgregar"
        >
          {{ props.producto.disponible ? 'Agregar' : 'Agotado' }}
        </button>
      </div>
    </div>
  </div>
</template>
```

Agrega los estilos del botón en `<style scoped>`:

```css
.btn-agregar {
  padding: 0.4rem 0.8rem;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.btn-agregar:hover:not(:disabled) {
  background: #35495E;
}

.btn-agregar:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

---

## Paso 3: Actualizar `App.vue` con el carrito

En `src/App.vue`, actualiza el `<script setup lang="ts">` completo:

```typescript
import { reactive } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import BaseCard from '@/components/BaseCard.vue'
import type { Product } from '@/types/product'

// Datos del catálogo
const productos: Product[] = [
  { id: 1, titulo: 'Laptop Pro', descripcion: 'i7, 16GB RAM, SSD 512GB', precio: 1299.99, disponible: true },
  { id: 2, titulo: 'Monitor 4K', descripcion: '27", panel IPS, 144Hz', precio: 549.00, disponible: true },
  { id: 3, titulo: 'Teclado Mecánico', descripcion: 'Cherry MX Red, RGB', precio: 189.99, disponible: false },
]

// Estado del carrito
const carrito = reactive<{
  items: Product[]
}>({
  items: []
})

function agregarAlCarrito(producto: Product): void {
  const existe = carrito.items.find(p => p.id === producto.id)
  if (!existe) {
    carrito.items.push(producto)
  }
}

function quitarDelCarrito(id: number): void {
  const idx = carrito.items.findIndex(p => p.id === id)
  if (idx !== -1) carrito.items.splice(idx, 1)
}

const totalCarrito = (): number =>
  carrito.items.reduce((acc, p) => acc + p.precio, 0)
```

Actualiza el template de `App.vue`:

```html
<template>
  <div class="app">
    <header class="app-header">
      <h1>PPW Vue App</h1>
      <div class="carrito-badge">
        🛒 {{ carrito.items.length }} items — ${{ totalCarrito().toFixed(2) }}
      </div>
    </header>

    <main class="app-main">
      <!-- Catálogo -->
      <section class="seccion">
        <h2>Catálogo</h2>
        <div class="grid">
          <ProductCard
            v-for="producto in productos"
            :key="producto.id"
            :producto="producto"
            @agregar="agregarAlCarrito"
          />
        </div>
      </section>

      <!-- Carrito -->
      <BaseCard titulo="Carrito">
        <div v-if="carrito.items.length === 0">
          <p>El carrito está vacío.</p>
        </div>
        <ul v-else class="lista-carrito">
          <li v-for="item in carrito.items" :key="item.id" class="item-carrito">
            <span>{{ item.titulo }}</span>
            <span>${{ item.precio.toFixed(2) }}</span>
            <button @click="quitarDelCarrito(item.id)">✕</button>
          </li>
        </ul>
        <p class="total" v-if="carrito.items.length > 0">
          <strong>Total: ${{ totalCarrito().toFixed(2) }}</strong>
        </p>
      </BaseCard>
    </main>
  </div>
</template>
```

Nota: en el template se usa `v-for` y `v-if`; esas directivas se explican en profundidad en el módulo 05. Por ahora es suficiente entender que `v-for` itera sobre los arrays y `v-if` muestra o esconde bloques.

Agrega los estilos en `<style scoped>`:

```css
.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: sans-serif;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #42B883;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.app-header h1 { color: #35495E; margin: 0; }

.carrito-badge {
  background: #42B883;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.seccion { margin-bottom: 2rem; }
.seccion h2 { color: #35495E; margin-bottom: 1rem; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.lista-carrito {
  list-style: none;
  padding: 0;
}

.item-carrito {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.item-carrito button {
  background: none;
  border: none;
  color: #c0392b;
  cursor: pointer;
  font-size: 1rem;
}

.total {
  margin-top: 1rem;
  text-align: right;
  color: #42B883;
}
```

> Captura pendiente: catálogo con tres productos, botón "Agregar" en los disponibles, badge de carrito actualizado y lista de items en el panel lateral.

---

## Validaciones Esperadas

- [ ] El botón "Agregar" en `ProductCard` está deshabilitado si `disponible` es `false`
- [ ] Al hacer clic en "Agregar", el producto aparece en el carrito de `App.vue`
- [ ] No se puede agregar el mismo producto dos veces
- [ ] El total del carrito se actualiza al agregar o quitar items
- [ ] El botón `✕` quita el item del carrito
- [ ] Sin errores TypeScript ni en consola

---

## Entregables

- `src/types/product.ts` con la interfaz `Product`
- `src/components/ProductCard.vue` actualizado con `emit` y botón
- `src/App.vue` con carrito reactivo y comunicación de eventos

---

## Commits Sugeridos

```bash
git add src/types/
git commit -m "feat: interface Product en src/types"
git add src/components/ProductCard.vue
git commit -m "feat: emit agregar en ProductCard (módulo 04)"
git add src/App.vue
git commit -m "feat: carrito reactivo y manejo de eventos en App.vue"
```
