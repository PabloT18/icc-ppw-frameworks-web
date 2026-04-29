# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 11: Consumo de Datos HTTP

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Reemplazar los datos simulados por una conexión real a la FakeStore API usando Axios. Al finalizar, el catálogo de productos se cargará desde una API pública con manejo correcto de estados de carga y error.

---

## Contexto

El store `useProductosStore` actualmente usa un `setTimeout` para simular una carga. En esta práctica se instala Axios, se crea una capa de servicios y se actualiza el store para hacer peticiones HTTP reales.

**API que se usará**: [FakeStore API](https://fakestoreapi.com/products)  
`GET https://fakestoreapi.com/products` → devuelve un array de productos

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/
├── .env                          ← Crear
├── src/
│   ├── services/
│   │   ├── api.ts                ← Crear
│   │   └── productos.service.ts  ← Crear
│   ├── types/
│   │   └── product.ts            ← Modificar: adaptar al formato de la API
│   └── stores/
│       └── useProductosStore.ts  ← Modificar: usar el servicio HTTP
```

---

## Paso 1: Instalar Axios

```bash
pnpm add axios
```

---

## Paso 2: Crear `.env`

Crea el archivo `.env` en la raíz del proyecto (`ppw-vue-app/.env`):

```bash
VITE_API_BASE_URL=https://fakestoreapi.com
```

> Agrega `.env` a `.gitignore` si no está ya. Para este proyecto no hay secrets, pero es buena práctica.

---

## Paso 3: Crear la instancia de Axios

Crea `src/services/api.ts`:

```typescript
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json'
  }
})
```

---

## Paso 4: Adaptar el tipo `Product`

La FakeStore API devuelve productos con esta estructura:

```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack",
  "price": 109.95,
  "description": "Your perfect pack...",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fAn8sYPs.jpg",
  "rating": { "rate": 3.9, "count": 120 }
}
```

Actualiza `src/types/product.ts` para reflejar esta estructura:

```typescript
export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}
```

> **Nota**: Los campos cambian de español a inglés (la API es pública y usa inglés). Actualiza todas las referencias en los componentes que usaban `titulo`, `precio` y `disponible`.

---

## Paso 5: Crear el servicio de productos

Crea `src/services/productos.service.ts`:

```typescript
import { api } from './api'
import type { Product } from '@/types/product'

export async function getProductos(): Promise<Product[]> {
  const response = await api.get<Product[]>('/products')
  return response.data
}

export async function getProducto(id: number): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`)
  return response.data
}

export async function getProductosPorCategoria(categoria: string): Promise<Product[]> {
  const response = await api.get<Product[]>(`/products/category/${categoria}`)
  return response.data
}

export async function getCategorias(): Promise<string[]> {
  const response = await api.get<string[]>('/products/categories')
  return response.data
}
```

---

## Paso 6: Actualizar `useProductosStore`

Reemplaza el contenido de `src/stores/useProductosStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/product'
import { getProductos, getCategorias } from '@/services/productos.service'

export const useProductosStore = defineStore('productos', () => {
  const productos = ref<Product[]>([])
  const categorias = ref<string[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function cargar(): Promise<void> {
    if (productos.value.length > 0) return  // evitar re-fetch
    cargando.value = true
    error.value = null
    try {
      const [prods, cats] = await Promise.all([getProductos(), getCategorias()])
      productos.value = prods
      categorias.value = cats
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar productos'
    } finally {
      cargando.value = false
    }
  }

  function refetch(): void {
    productos.value = []
    cargar()
  }

  return { productos, categorias, cargando, error, cargar, refetch }
})
```

---

## Paso 7: Actualizar los componentes para el nuevo tipo `Product`

Los campos han cambiado (`titulo` → `title`, `precio` → `price`, se elimina `disponible`). Actualiza las referencias:

### `ProductCard.vue`

Actualiza las props y el template:

```vue
<script setup lang="ts">
import type { Product } from '@/types/product'

defineProps<{ producto: Product }>()
const emit = defineEmits<{ agregar: [producto: Product] }>()
</script>

<template>
  <div class="card">
    <img :src="producto.image" :alt="producto.title" class="card-img" />
    <div class="card-body">
      <h3 class="card-titulo">{{ producto.title }}</h3>
      <p class="card-desc">{{ producto.description.slice(0, 80) }}...</p>
      <div class="card-footer">
        <span class="precio">${{ producto.price.toFixed(2) }}</span>
        <span class="rating">⭐ {{ producto.rating.rate }}</span>
        <button @click="emit('agregar', producto)" class="btn-agregar">
          + Carrito
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.card-img { width: 100%; height: 180px; object-fit: contain; padding: 1rem; background: #f8f8f8; }
.card-body { padding: 1rem; }
.card-titulo { font-size: 0.9rem; color: #35495E; margin-bottom: 0.4rem; line-height: 1.3; }
.card-desc { font-size: 0.8rem; color: #777; margin-bottom: 0.75rem; }
.card-footer { display: flex; align-items: center; gap: 0.5rem; }
.precio { font-weight: bold; color: #42B883; flex: 1; }
.rating { font-size: 0.8rem; color: #888; }
.btn-agregar { padding: 0.35rem 0.75rem; background: #42B883; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
.btn-agregar:hover { background: #35495E; }
</style>
```

### `ProductosView.vue`

Agrega el estado de error y el filtro por categoría:

```vue
<template>
  <!-- ... -->
  <div v-if="cargando" class="estado-carga">
    Cargando productos...
  </div>

  <div v-else-if="error" class="estado-error">
    <p>{{ error }}</p>
    <button @click="productosStore.refetch()">Reintentar</button>
  </div>

  <template v-else>
    <!-- Filtro por categoría -->
    <select v-model="categoriaSeleccionada" class="select-categoria">
      <option value="">Todas las categorías</option>
      <option v-for="cat in categorias" :key="cat" :value="cat">
        {{ cat }}
      </option>
    </select>
    <!-- ... grid de productos -->
  </template>
</template>
```

---

## Validaciones Esperadas

- [ ] Al cargar la página, se hace una petición real a `fakestoreapi.com` (verificar en DevTools → Network)
- [ ] Se muestra el estado de carga mientras llegan los datos
- [ ] Si hay un error de red (desactivar wifi), se muestra el mensaje de error con botón "Reintentar"
- [ ] Las imágenes de los productos se cargan desde la API
- [ ] El filtro por categoría funciona con las categorías reales de la API
- [ ] El carrito funciona con el nuevo tipo `Product` (usa `title` y `price`)

---

## Entregables

- `.env` con la URL base de la API
- `src/services/api.ts`
- `src/services/productos.service.ts`
- `src/types/product.ts` actualizado
- `src/stores/useProductosStore.ts` actualizado
- `src/components/ProductCard.vue` actualizado

---

## Commits Sugeridos

```bash
git add .env src/services/ src/types/product.ts
git commit -m "feat: capa de servicios HTTP con Axios y adaptación de tipos (módulo 11)"
git add src/stores/useProductosStore.ts src/components/ProductCard.vue src/views/
git commit -m "refactor: actualizar store y componentes para usar API real"
```
