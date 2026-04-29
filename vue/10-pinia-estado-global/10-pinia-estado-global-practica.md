# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 10: Pinia — Estado Global

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Migrar el estado del carrito del composable `useCarrito` a un Pinia store con persistencia automática en localStorage. Al finalizar, cualquier componente de la aplicación podrá acceder al carrito sin prop-drilling ni refs compartidas manualmente.

---

## Contexto

El composable `useCarrito` del módulo 08 funcionaba porque los refs estaban definidos fuera de la función (singleton). Pinia hace esto de forma oficial, con soporte de DevTools, persistencia integrada y mejor DX.

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/src/
├── stores/
│   ├── useCarritoStore.ts     ← Crear
│   └── useProductosStore.ts   ← Crear
├── views/
│   ├── ProductosView.vue      ← Modificar: usar useCarritoStore
│   └── CarritoView.vue        ← Modificar: usar useCarritoStore
├── components/
│   └── NavBar.vue             ← Modificar: usar useCarritoStore
└── main.ts                    ← Modificar: registrar Pinia + plugin
```

---

## Paso 1: Instalar Pinia y el plugin de persistencia

```bash
pnpm add pinia pinia-plugin-persistedstate
```

---

## Paso 2: Configurar Pinia en `main.ts`

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/main.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
```

---

## Paso 3: Crear `useCarritoStore`

Crea `src/stores/useCarritoStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref<Product[]>([])

  const cantidadItems = computed(() => items.value.length)

  const subtotal = computed(() =>
    items.value.reduce((acc, p) => acc + p.precio, 0)
  )

  const iva = computed(() => subtotal.value * 0.12)

  const total = computed(() => subtotal.value + iva.value)

  function agregar(producto: Product): void {
    if (!items.value.find(p => p.id === producto.id)) {
      items.value.push(producto)
    }
  }

  function quitar(id: number): void {
    items.value = items.value.filter(p => p.id !== id)
  }

  function limpiar(): void {
    items.value = []
  }

  return { items, cantidadItems, subtotal, iva, total, agregar, quitar, limpiar }
}, {
  persist: {
    key: 'ppw-carrito',
    pick: ['items']
  }
})
```

---

## Paso 4: Crear `useProductosStore`

Crea `src/stores/useProductosStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/product'

export const useProductosStore = defineStore('productos', () => {
  const productos = ref<Product[]>([])
  const cargando = ref(false)

  async function cargar(): Promise<void> {
    cargando.value = true
    // Simular fetch (se reemplazará con Axios en módulo 11)
    await new Promise(r => setTimeout(r, 800))
    productos.value = [
      { id: 1, titulo: 'Laptop Pro', descripcion: 'i7, 16GB RAM, SSD 512GB', precio: 1299.99, disponible: true },
      { id: 2, titulo: 'Monitor 4K', descripcion: '27", panel IPS, 144Hz', precio: 549.00, disponible: true },
      { id: 3, titulo: 'Teclado Mecánico', descripcion: 'Cherry MX Red, RGB', precio: 189.99, disponible: false },
      { id: 4, titulo: 'Mouse Inalámbrico', descripcion: 'DPI ajustable', precio: 45.99, disponible: true },
    ]
    cargando.value = false
  }

  function agregar(datos: Omit<Product, 'id'>): void {
    const id = Math.max(0, ...productos.value.map(p => p.id)) + 1
    productos.value.push({ id, ...datos })
  }

  return { productos, cargando, cargar, agregar }
})
```

---

## Paso 5: Actualizar `ProductosView.vue`

Reemplaza el uso del composable `useCarrito` y el estado local por los stores:

```typescript
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCarritoStore } from '@/stores/useCarritoStore'
import { useProductosStore } from '@/stores/useProductosStore'
import { useFiltroProductos } from '@/composables/useFiltroProductos'
import ProductCard from '@/components/ProductCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import ProductForm from '@/components/ProductForm.vue'
import type { Product } from '@/types/product'

const carritoStore = useCarritoStore()
const productosStore = useProductosStore()
const { productos, cargando } = storeToRefs(productosStore)

const {
  busqueda,
  soloDisponibles,
  productosFiltrados,
  registrarBusqueda,
} = useFiltroProductos(() => productos.value)

const mostrarFormulario = ref(false)

watch(busqueda, registrarBusqueda)

onMounted(() => productosStore.cargar())

function agregarProducto(datos: Omit<Product, 'id'>): void {
  productosStore.agregar(datos)
  mostrarFormulario.value = false
}
```

---

## Paso 6: Actualizar `CarritoView.vue`

Reemplaza el composable `useCarrito` por el store:

```typescript
import { storeToRefs } from 'pinia'
import { useCarritoStore } from '@/stores/useCarritoStore'
import EmptyState from '@/components/EmptyState.vue'
import { useRouter } from 'vue-router'

const carritoStore = useCarritoStore()
const { items, cantidadItems, subtotal, iva, total } = storeToRefs(carritoStore)
const { quitar, limpiar: limpiarCarrito } = carritoStore
const router = useRouter()
```

---

## Paso 7: Actualizar `NavBar.vue`

Reemplaza el composable por el store:

```typescript
import { storeToRefs } from 'pinia'
import { useCarritoStore } from '@/stores/useCarritoStore'

const carritoStore = useCarritoStore()
const { cantidadItems } = storeToRefs(carritoStore)
```

---

## Paso 8: Verificar en Vue DevTools

Con Pinia instalado, las Vue DevTools muestran la pestaña **Pinia** donde puedes:
- Ver el estado actual de cada store en tiempo real
- Inspeccionar el historial de cambios de estado
- Modificar el estado manualmente desde las DevTools

---

## Validaciones Esperadas

- [ ] El carrito persiste entre recargas (localStorage con clave `ppw-carrito`)
- [ ] El badge de la NavBar muestra la cantidad correcta de items
- [ ] Agregar/quitar productos en `CarritoView` actualiza la `NavBar` sin props
- [ ] El store de productos se carga una vez al entrar a `ProductosView`
- [ ] Agregar un producto desde el formulario aparece inmediatamente en el grid
- [ ] En Vue DevTools, los stores `carrito` y `productos` son visibles

---

## Entregables

- `src/stores/useCarritoStore.ts` con persistencia
- `src/stores/useProductosStore.ts`
- `src/main.ts` con Pinia y plugin registrados
- Vistas y NavBar actualizadas para usar los stores

---

## Commits Sugeridos

```bash
git add src/stores/ src/main.ts
git commit -m "feat: stores Pinia para carrito y productos con persistencia (módulo 10)"
git add src/views/ src/components/NavBar.vue
git commit -m "refactor: migrar vistas y NavBar a stores Pinia"
```
