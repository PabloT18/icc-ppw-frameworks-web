# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 8: Composables

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Práctico

Extraer la lógica del carrito y los filtros del catálogo a composables reutilizables. Al finalizar, `App.vue` estará significativamente simplificado y la lógica de negocio vivirá en archivos dedicados.

---

## Contexto

`App.vue` actualmente tiene toda la lógica: filtros, carrito, formulario. En esta práctica se crean tres composables:
- `useCarrito`: maneja items, totales y operaciones del carrito
- `useFiltroProductos`: maneja búsqueda y filtro de disponibilidad
- `useLocalStorage`: persiste datos en localStorage

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/src/
├── composables/
│   ├── useCarrito.ts          ← Crear
│   ├── useFiltroProductos.ts  ← Crear
│   └── useLocalStorage.ts     ← Crear
└── App.vue                    ← Simplificar
```

---

## Paso 1: Crear `useLocalStorage`

Crea `src/composables/useLocalStorage.ts`:

```typescript
import { ref, watch } from 'vue'

export function useLocalStorage<T>(clave: string, valorInicial: T) {
  const dato = ref<T>(valorInicial)

  // Hidratación inicial desde localStorage
  const guardado = localStorage.getItem(clave)
  if (guardado) {
    try {
      dato.value = JSON.parse(guardado) as T
    } catch {
      dato.value = valorInicial
    }
  }

  // Persistir cambios automáticamente
  watch(
    dato,
    (nuevoValor) => {
      localStorage.setItem(clave, JSON.stringify(nuevoValor))
    },
    { deep: true }
  )

  function limpiar(): void {
    dato.value = valorInicial
    localStorage.removeItem(clave)
  }

  return { dato, limpiar }
}
```

**¿Para qué sirve?** Este composable se usa dentro de `useCarrito` para persistir los items del carrito entre recargas de página.

**Prueba rápida** (opcional en consola del navegador):
```javascript
// El carrito debe persistir al recargar la página
```

---

## Paso 2: Crear `useCarrito`

Crea `src/composables/useCarrito.ts`:

```typescript
import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import type { Product } from '@/types/product'

export function useCarrito() {
  const { dato: items, limpiar } = useLocalStorage<Product[]>('ppw-carrito', [])

  const cantidadItems = computed(() => items.value.length)

  const subtotal = computed(() =>
    items.value.reduce((acc, p) => acc + p.precio, 0)
  )

  const iva = computed(() => subtotal.value * 0.12)

  const total = computed(() => subtotal.value + iva.value)

  function agregar(producto: Product): void {
    if (!items.value.find(p => p.id === producto.id)) {
      items.value = [...items.value, producto]
    }
  }

  function quitar(id: number): void {
    items.value = items.value.filter(p => p.id !== id)
  }

  return {
    items,
    cantidadItems,
    subtotal,
    iva,
    total,
    agregar,
    quitar,
    limpiarCarrito: limpiar
  }
}
```

**Puntos clave:**
- Usa `useLocalStorage` internamente para persistir los items
- `items.value = [...items.value, producto]` en lugar de `.push()` para que `watch` detecte el cambio correctamente con un nuevo objeto
- Retorna nombres descriptivos (`limpiarCarrito` en lugar de `limpiar`) para evitar conflictos al desestructurar

---

## Paso 3: Crear `useFiltroProductos`

Crea `src/composables/useFiltroProductos.ts`:

```typescript
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'

export function useFiltroProductos(obtenerProductos: () => Product[]) {
  const busqueda = ref<string>('')
  const soloDisponibles = ref<boolean>(false)
  const historialBusquedas = ref<string[]>([])

  const productosFiltrados = computed<Product[]>(() => {
    let resultado = obtenerProductos()

    if (soloDisponibles.value) {
      resultado = resultado.filter(p => p.disponible)
    }

    const termino = busqueda.value.toLowerCase().trim()
    if (termino) {
      resultado = resultado.filter(p =>
        p.titulo.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino)
      )
    }

    return resultado
  })

  function registrarBusqueda(termino: string): void {
    const t = termino.trim()
    if (t && !historialBusquedas.value.includes(t)) {
      historialBusquedas.value.unshift(t)
      if (historialBusquedas.value.length > 5) {
        historialBusquedas.value.pop()
      }
    }
  }

  function aplicarBusquedaDelHistorial(termino: string): void {
    busqueda.value = termino
  }

  return {
    busqueda,
    soloDisponibles,
    historialBusquedas,
    productosFiltrados,
    registrarBusqueda,
    aplicarBusquedaDelHistorial
  }
}
```

---

## Paso 4: Simplificar `App.vue`

Reemplaza toda la lógica del `<script setup>` de `App.vue` con los composables:

```typescript
import { ref, watch, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import BaseCard from '@/components/BaseCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import ProductForm from '@/components/ProductForm.vue'
import { useCarrito } from '@/composables/useCarrito'
import { useFiltroProductos } from '@/composables/useFiltroProductos'
import type { Product } from '@/types/product'

// ─── Estado global del componente ───────────────────────────────────
const cargando = ref(true)
const productos = ref<Product[]>([])
const mostrarFormulario = ref(false)
let nextId = 5

// ─── Composables ────────────────────────────────────────────────────
const {
  items: carritoItems,
  cantidadItems,
  subtotal,
  iva,
  total,
  agregar: agregarAlCarrito,
  quitar: quitarDelCarrito
} = useCarrito()

const {
  busqueda,
  soloDisponibles,
  historialBusquedas,
  productosFiltrados,
  registrarBusqueda,
  aplicarBusquedaDelHistorial
} = useFiltroProductos(() => productos.value)

// ─── Lifecycle ──────────────────────────────────────────────────────
onMounted(() => {
  setTimeout(() => {
    productos.value = [
      { id: 1, titulo: 'Laptop Pro', descripcion: 'i7, 16GB RAM, SSD 512GB', precio: 1299.99, disponible: true },
      { id: 2, titulo: 'Monitor 4K', descripcion: '27", panel IPS, 144Hz', precio: 549.00, disponible: true },
      { id: 3, titulo: 'Teclado Mecánico', descripcion: 'Cherry MX Red, RGB', precio: 189.99, disponible: false },
      { id: 4, titulo: 'Mouse Inalámbrico', descripcion: 'DPI ajustable', precio: 45.99, disponible: true },
    ]
    cargando.value = false
  }, 1000)
})

// Registrar búsquedas en historial
watch(busqueda, registrarBusqueda)

// ─── Acciones ───────────────────────────────────────────────────────
function agregarProducto(datos: Omit<Product, 'id'>): void {
  productos.value.push({ id: nextId++, ...datos })
  mostrarFormulario.value = false
}
```

**¿Cuánto se simplificó `App.vue`?**  
El script pasó de ~80 líneas de lógica mezclada a ~50 líneas muy legibles, con cada responsabilidad claramente separada en composables.

---

## Paso 5: Verificar persistencia del carrito

Con el composable `useLocalStorage` integrado en `useCarrito`:

1. Agrega un producto al carrito
2. Recarga la página (F5)
3. El carrito debe mantener el producto

> Captura pendiente: carrito con items persistidos después de recargar la página.

---

## Validaciones Esperadas

- [ ] La carpeta `src/composables/` tiene los tres archivos TypeScript
- [ ] El carrito persiste entre recargas de página (localStorage)
- [ ] Los filtros y búsqueda siguen funcionando exactamente igual que antes
- [ ] `App.vue` no tiene lógica de carrito ni de filtros directamente
- [ ] Los composables retornan tipos correctamente inferidos (verificar en IDE)
- [ ] Sin errores TypeScript ni en consola

---

## Entregables

- `src/composables/useLocalStorage.ts`
- `src/composables/useCarrito.ts`
- `src/composables/useFiltroProductos.ts`
- `src/App.vue` simplificado usando los tres composables

---

## Commits Sugeridos

```bash
git add src/composables/
git commit -m "feat: composables useCarrito, useFiltroProductos y useLocalStorage (módulo 08)"
git add src/App.vue
git commit -m "refactor: simplificar App.vue usando composables"
```
