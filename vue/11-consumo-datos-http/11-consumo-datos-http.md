# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 11: Consumo de Datos HTTP

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

La mayoría de aplicaciones obtienen datos de una API externa. Vue no incluye un cliente HTTP propio; la comunidad usa `fetch` nativo o **Axios**, una librería que simplifica los headers, la serialización JSON, los interceptores y el manejo de errores.

En este módulo se reemplaza el `setTimeout` simulado de los módulos anteriores por una llamada real a una API pública, organizando la capa de servicios en archivos separados.

---

## 2. Conceptos Clave

### Variables de entorno con Vite

Vite expone las variables de entorno con el prefijo `VITE_` al cliente:

```bash
# .env
VITE_API_BASE_URL=https://fakestoreapi.com
```

```typescript
// Acceso en código
const baseURL = import.meta.env.VITE_API_BASE_URL
```

Nunca pongas tokens secretos en variables `VITE_`: son visibles en el bundle del cliente. Los secretos van en el servidor.

### `fetch` nativo vs Axios

| Característica | `fetch` nativo | Axios |
|---|---|---|
| Incluido en el navegador | Sí | No (instalar) |
| JSON automático | No (`res.json()`) | Sí |
| Interceptores | No (manual) | Sí |
| Timeout | No (manual con AbortController) | Sí |
| Cancelación | AbortController | Sí |
| Transformadores | No | Sí |
| Compatibilidad SSR | Sí (Node 18+) | Sí |

Para proyectos de producción, Axios es la elección más común por sus interceptores.

---

## 3. Explicación Técnica Detallada

### Instalación de Axios

```bash
pnpm add axios
```

### Crear una instancia configurada

En lugar de importar Axios directamente en cada archivo, se crea una instancia base:

```typescript
// src/services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor de request: añadir token de auth
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de response: manejo global de errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirigir a login (se implementa en módulo 12)
    }
    return Promise.reject(error)
  }
)
```

### Organizar servicios

```typescript
// src/services/productos.service.ts
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

export async function createProducto(datos: Omit<Product, 'id'>): Promise<Product> {
  const response = await api.post<Product>('/products', datos)
  return response.data
}
```

### Patrón de estados: loading / error / data

```typescript
const productos = ref<Product[]>([])
const cargando = ref(false)
const error = ref<string | null>(null)

async function cargarProductos(): Promise<void> {
  cargando.value = true
  error.value = null

  try {
    productos.value = await getProductos()
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message
    } else {
      error.value = 'Error inesperado al cargar productos'
    }
  } finally {
    cargando.value = false
  }
}
```

### Tipado de errores de Axios

```typescript
import type { AxiosError } from 'axios'

catch (e) {
  const axiosError = e as AxiosError<{ message: string }>
  if (axiosError.response) {
    error.value = axiosError.response.data.message
  } else if (axiosError.request) {
    error.value = 'Sin respuesta del servidor'
  } else {
    error.value = 'Error de configuración'
  }
}
```

### Paginación

```typescript
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

const pagina = ref(1)
const limit = 8

async function cargarPagina(p: number): Promise<void> {
  pagina.value = p
  const res = await api.get<PaginatedResponse<Product>>('/products', {
    params: { page: p, limit }
  })
  productos.value = res.data.data
  totalProductos.value = res.data.total
}
```

---

## 4. Ejemplos de Código

### Store con carga HTTP real

```typescript
// src/stores/useProductosStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/product'
import { getProductos } from '@/services/productos.service'

export const useProductosStore = defineStore('productos', () => {
  const productos = ref<Product[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function cargar(): Promise<void> {
    if (productos.value.length > 0) return  // evitar re-fetch
    cargando.value = true
    error.value = null
    try {
      productos.value = await getProductos()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar'
    } finally {
      cargando.value = false
    }
  }

  return { productos, cargando, error, cargar }
})
```

### Componente con estados de carga y error

```vue
<template>
  <div class="estado-carga" v-if="cargando">
    <span class="spinner"></span> Cargando productos...
  </div>

  <div class="estado-error" v-else-if="error">
    <p>{{ error }}</p>
    <button @click="productosStore.cargar()">Reintentar</button>
  </div>

  <template v-else>
    <EmptyState v-if="!productos.length" mensaje="No hay productos" />
    <div v-else class="grid">
      <ProductCard v-for="p in productos" :key="p.id" :producto="p" />
    </div>
  </template>
</template>
```

---

## 5. Buenas Prácticas

- **Una instancia de Axios por proyecto**: configurada con `baseURL`, timeout e interceptores.
- **Servicios separados por dominio**: `productos.service.ts`, `auth.service.ts` — no mezclarlo con los stores.
- **Siempre maneja el `finally`**: asegura que `cargando` vuelve a `false` incluso si hay error.
- **No expongas tokens en el código fuente**: usa variables de entorno; nunca los hagas commit.
- **Tipar la respuesta de la API**: `api.get<Product[]>(...)` da autocomplete y type-safety.
- **Evita re-fetches innecesarios**: guarda en caché con una condición `if (datos.length > 0) return`.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| CORS error en consola | La API no permite el origen del frontend | Configurar proxy en `vite.config.ts` o CORS en el backend |
| `TypeError: Cannot read properties of undefined` | Respuesta de API con estructura diferente a lo esperado | Verificar la forma real de la respuesta con DevTools |
| Variables de entorno `undefined` | Prefijo `VITE_` ausente o archivo `.env` sin reiniciar Vite | Reiniciar `pnpm dev` y verificar el prefijo `VITE_` |
| `Network Error` sin info de status | Petición bloqueada antes de llegar al servidor | Revisar la URL base; puede ser un error de HTTPS/HTTP |
| Datos desactualizados al navegar | Re-fetch evitado pero datos han cambiado | Implementar invalidación de caché o usar `refetch` condicional |

---

## 7. Relación con el Proyecto Incremental

El store `useProductosStore` se actualiza para cargar datos de la [FakeStore API](https://fakestoreapi.com/products), una API pública que devuelve productos reales. El `setTimeout` de módulos anteriores se elimina.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/
├── .env                         ← Nuevo: VITE_API_BASE_URL
├── src/
│   ├── services/
│   │   ├── api.ts               ← Nuevo: instancia Axios
│   │   └── productos.service.ts ← Nuevo: funciones de servicio
│   └── stores/
│       └── useProductosStore.ts ← Actualizado: usa servicio HTTP
```

---

## 8. Referencias

- [Axios - Documentación](https://axios-http.com/docs/intro)
- [Vite - Variables de entorno](https://vitejs.dev/guide/env-and-mode)
- [FakeStore API](https://fakestoreapi.com)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Vue 3 - Llamadas a API con Composition API](https://vuejs.org/guide/best-practices/composition-api-faq)
