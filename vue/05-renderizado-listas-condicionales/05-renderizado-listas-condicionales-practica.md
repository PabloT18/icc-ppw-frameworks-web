# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 5: Renderizado de Listas y Condicionales

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Reemplazar el código repetido de tarjetas de productos en `App.vue` por iteración con `v-for`, agregar filtros con `v-if`/`v-show`, y manejar correctamente los estados vacío y de carga simulada.

---

## Contexto

El proyecto ya tiene `ProductCard`, `BaseCard` y la interfaz `Product`. El catálogo actualmente tiene tres `<ProductCard>` escritas manualmente. En esta práctica, se itera sobre un array y se agregan filtros visuales.

---

## Archivos que se van a modificar

```
ppw-vue-app/src/
├── components/
│   └── EmptyState.vue     ← Crear: componente reutilizable para estado vacío
└── App.vue                ← Modificar: v-for, v-if, filtros
```

---

## Paso 1: Crear el componente `EmptyState`

El estado vacío aparece en muchos lugares del proyecto (catálogo, carrito, historial). Conviene tenerlo como componente reutilizable.

Crea `src/components/EmptyState.vue`:

```vue
<script setup lang="ts">
defineProps<{
  mensaje?: string
  icono?: string
}>()
</script>

<template>
  <div class="empty-state">
    <span class="empty-icono">{{ icono ?? '📭' }}</span>
    <p class="empty-mensaje">{{ mensaje ?? 'No hay elementos para mostrar.' }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.empty-icono {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.75rem;
}

.empty-mensaje {
  font-size: 1rem;
}
</style>
```

**¿Por qué un componente separado?** Centraliza el look del estado vacío. Si en el futuro quieres cambiar el diseño, lo cambias en un solo lugar.

---

## Paso 2: Refactorizar el catálogo con `v-for`

En `src/App.vue`, mueve los datos de productos a un array en el `<script setup>` (si no lo hiciste en el módulo 04):

```typescript
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import BaseCard from '@/components/BaseCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { Product } from '@/types/product'

const productos: Product[] = [
  { id: 1, titulo: 'Laptop Pro', descripcion: 'i7, 16GB RAM, SSD 512GB', precio: 1299.99, disponible: true },
  { id: 2, titulo: 'Monitor 4K', descripcion: '27", panel IPS, 144Hz', precio: 549.00, disponible: true },
  { id: 3, titulo: 'Teclado Mecánico', descripcion: 'Cherry MX Red, RGB', precio: 189.99, disponible: false },
  { id: 4, titulo: 'Mouse Inalámbrico', descripcion: 'DPI ajustable, batería 6 meses', precio: 45.99, disponible: true },
]
```

En el template, reemplaza las tarjetas individuales por `v-for`:

```html
<section class="seccion">
  <h2>Catálogo ({{ productos.length }} productos)</h2>

  <div v-if="productos.length === 0">
    <EmptyState mensaje="No hay productos disponibles." icono="📦" />
  </div>

  <div v-else class="grid">
    <ProductCard
      v-for="producto in productos"
      :key="producto.id"
      :producto="producto"
      @agregar="agregarAlCarrito"
    />
  </div>
</section>
```

**¿Qué hace `:key="producto.id"`?**  
Le dice a Vue cuál es el identificador único de cada elemento. Vue usa esto para actualizar el DOM eficientemente cuando la lista cambia.

> Captura pendiente: cuatro tarjetas de producto renderizadas desde el array con `v-for`.

---

## Paso 3: Agregar filtro de disponibilidad con `v-show`

Agrega un checkbox que filtra visualmente los productos agotados:

En el `<script setup>`:

```typescript
const mostrarSoloDisponibles = ref<boolean>(false)

const productosFiltrados = (): Product[] =>
  mostrarSoloDisponibles.value
    ? productos.filter(p => p.disponible)
    : productos
```

En el template, agrega el checkbox antes del grid y actualiza el `v-for`:

```html
<div class="filtros">
  <label class="filtro-label">
    <input type="checkbox" v-model="mostrarSoloDisponibles" />
    Mostrar solo disponibles
  </label>
  <span class="filtro-contador">{{ productosFiltrados().length }} resultado(s)</span>
</div>

<div v-if="productosFiltrados().length === 0">
  <EmptyState mensaje="No hay productos con ese filtro." icono="🔍" />
</div>

<div v-else class="grid">
  <ProductCard
    v-for="producto in productosFiltrados()"
    :key="producto.id"
    :producto="producto"
    @agregar="agregarAlCarrito"
  />
</div>
```

Agrega los estilos:

```css
.filtros {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filtro-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}

.filtro-contador {
  color: #666;
  font-size: 0.875rem;
}
```

> Captura pendiente: checkbox activado mostrando solo los productos disponibles (debe ocultar "Teclado Mecánico").

---

## Paso 4: Actualizar el carrito con `v-for` y `v-if`

El carrito ya debería usar `v-for` desde el módulo 04. Asegúrate de que tenga el estado vacío:

```html
<BaseCard titulo="Carrito de compras">
  <EmptyState
    v-if="carrito.items.length === 0"
    mensaje="Agrega productos al carrito."
    icono="🛒"
  />

  <template v-else>
    <ul class="lista-carrito">
      <li
        v-for="item in carrito.items"
        :key="item.id"
        class="item-carrito"
      >
        <div class="item-info">
          <span class="item-nombre">{{ item.titulo }}</span>
          <span class="item-precio">${{ item.precio.toFixed(2) }}</span>
        </div>
        <button class="btn-quitar" @click="quitarDelCarrito(item.id)">✕</button>
      </li>
    </ul>

    <div class="carrito-total">
      <strong>Total: ${{ totalCarrito().toFixed(2) }}</strong>
    </div>
  </template>
</BaseCard>
```

**¿Por qué `<template v-else>`?** Permite agrupar múltiples elementos bajo la misma condición sin agregar un `<div>` extra al DOM.

---

## Paso 5: Agregar carga simulada

Para practicar el patrón de carga, simula que los productos vienen de una API. Actualiza el script:

```typescript
import { ref, onMounted } from 'vue'

const cargando = ref<boolean>(true)
const productos = ref<Product[]>([])

onMounted(() => {
  // Simula latencia de red
  setTimeout(() => {
    productos.value = [
      { id: 1, titulo: 'Laptop Pro', descripcion: 'i7, 16GB RAM', precio: 1299.99, disponible: true },
      { id: 2, titulo: 'Monitor 4K', descripcion: '27", IPS', precio: 549.00, disponible: true },
      { id: 3, titulo: 'Teclado Mecánico', descripcion: 'MX Red', precio: 189.99, disponible: false },
      { id: 4, titulo: 'Mouse Inalámbrico', descripcion: 'DPI ajustable', precio: 45.99, disponible: true },
    ]
    cargando.value = false
  }, 1200)
})
```

Actualiza el template del catálogo para incluir el estado de carga:

```html
<div v-if="cargando" class="estado-carga">Cargando productos...</div>

<template v-else>
  <!-- filtros y grid van aquí -->
</template>
```

Agrega el estilo:

```css
.estado-carga {
  text-align: center;
  padding: 3rem;
  color: #42B883;
  font-size: 1.1rem;
}
```

> Captura pendiente: pantalla mostrando "Cargando productos..." durante 1.2 segundos antes de mostrar el catálogo.

---

## Validaciones Esperadas

- [ ] Los cuatro productos se renderizan desde el array con `v-for` y `:key`
- [ ] El checkbox de filtro muestra/oculta los productos agotados correctamente
- [ ] Al activar el filtro y no haber resultados, aparece `EmptyState`
- [ ] El carrito muestra `EmptyState` cuando está vacío
- [ ] Durante la carga simulada (1.2s), se muestra el indicador de carga
- [ ] Al quitar todos los items del carrito, aparece `EmptyState`
- [ ] Sin warnings de `:key` en la consola

---

## Entregables

- `src/components/EmptyState.vue` creado
- `src/App.vue` con `v-for` en catálogo y carrito, `v-if` para estados, carga simulada con `onMounted`

---

## Commits Sugeridos

```bash
git add src/components/EmptyState.vue
git commit -m "feat: componente EmptyState reutilizable (módulo 05)"
git add src/App.vue
git commit -m "feat: v-for, v-if y carga simulada en App.vue"
```
