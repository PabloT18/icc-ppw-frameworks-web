# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Actividad 3: Panel Administrativo de Productos — CRUD con TanStack Query

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo de la Actividad

Construir un panel administrativo para gestionar productos usando la API simulada de DummyJSON. Implementar operaciones CRUD (crear, leer, actualizar, eliminar) con `useMutation` de TanStack Query. Aprender el patron de actualizacion optimista y la invalidacion de cache.

---

## 2. DummyJSON — Endpoints de Escritura

DummyJSON ofrece endpoints de escritura simulados — los datos no se guardan realmente en el servidor, pero las respuestas son realistas:

| Operacion | Metodo | Endpoint | Body |
|---|---|---|---|
| Crear producto | POST | `/products/add` | `{ title, price, description, category }` |
| Actualizar producto | PUT | `/products/:id` | campos a actualizar |
| Eliminar producto | DELETE | `/products/:id` | — |

Respuesta del DELETE:
```json
{
  "id": 1,
  "title": "...",
  "isDeleted": true,
  "deletedOn": "2024-01-01T00:00:00.000Z"
}
```

---

## 3. `useMutation` de TanStack Query

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

const deleteMutation = useMutation({
  mutationFn: (id: number) => deleteProduct(id),

  // Cuando la mutacion tiene exito, invalidar el cache
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  },

  // Callback cuando falla
  onError: (error: Error) => {
    console.error('Error al eliminar:', error.message)
  },
})

// Ejecutar la mutacion
deleteMutation.mutate(productId)

// Estado de la mutacion
deleteMutation.isPending   // true mientras procesa
deleteMutation.isError     // true si fallo
deleteMutation.isSuccess   // true si tuvo exito
```

---

## 4. Actualizacion Optimista

La actualizacion optimista actualiza la UI inmediatamente antes de que el servidor responda, y revierte si hay error:

```ts
const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
    updateProduct(id, data),

  // Antes de la mutacion — guardar estado anterior
  onMutate: async ({ id, data }) => {
    // Cancelar refetches en curso para ese query
    await queryClient.cancelQueries({ queryKey: ['products'] })

    // Guardar snapshot del estado actual
    const previousProducts = queryClient.getQueryData(['products'])

    // Actualizar el cache optimisticamente
    queryClient.setQueryData(['products'], (old: Product[]) =>
      old.map(p => p.id === id ? { ...p, ...data } : p)
    )

    // Retornar el snapshot para el rollback
    return { previousProducts }
  },

  // Si falla, revertir al estado anterior
  onError: (_err, _vars, context) => {
    queryClient.setQueryData(['products'], context?.previousProducts)
  },

  // Siempre invalidar al terminar (exito o error)
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  },
})
```

---

## 5. Patron de Modal para Crear/Editar

```tsx
// Estado del modal — null = cerrado, undefined = nuevo, Product = editar
const [modalProducto, setModalProducto] = useState<Product | null | undefined>(undefined)
// undefined = sin abrir todavia
// null = crear nuevo
// Product = editar existente

return (
  <>
    <button onClick={() => setModalProducto(null)}>+ Nuevo producto</button>

    {modalProducto !== undefined && (
      <EditProductModal
        producto={modalProducto}      // null = formulario vacio, Product = pre-cargado
        onClose={() => setModalProducto(undefined)}
        onSave={(data) => {
          if (modalProducto === null) {
            createMutation.mutate(data)
          } else {
            updateMutation.mutate({ id: modalProducto.id, data })
          }
          setModalProducto(undefined)
        }}
      />
    )}
  </>
)
```

---

## 6. Tabla de Productos con Ordenamiento

```tsx
type SortField = 'title' | 'price' | 'rating' | 'stock'
type SortDir = 'asc' | 'desc'

const [sortField, setSortField] = useState<SortField>('title')
const [sortDir, setSortDir] = useState<SortDir>('asc')

const sorted = useMemo(() => {
  return [...products].sort((a, b) => {
    const mult = sortDir === 'asc' ? 1 : -1
    if (typeof a[sortField] === 'string') {
      return (a[sortField] as string).localeCompare(b[sortField] as string) * mult
    }
    return ((a[sortField] as number) - (b[sortField] as number)) * mult
  })
}, [products, sortField, sortDir])

const handleSort = (field: SortField) => {
  if (field === sortField) {
    setSortDir(d => d === 'asc' ? 'desc' : 'asc')
  } else {
    setSortField(field)
    setSortDir('asc')
  }
}
```

---

## 7. Paginacion del Lado del Cliente

```tsx
const PAGE_SIZE = 10

const [page, setPage] = useState(1)

const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

// Controles de paginacion
<div>
  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
  <span>{page} / {totalPages}</span>
  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
</div>
```

---

## 8. Referencias

- [TanStack Query — useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutation)
- [TanStack Query — Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [DummyJSON — Products API](https://dummyjson.com/docs/products)
