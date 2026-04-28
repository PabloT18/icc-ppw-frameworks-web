# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica A3: Panel Administrativo de Productos

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Construir un panel `/admin/products` protegido por autenticacion. La pagina muestra una tabla de productos con ordenamiento por columna, paginacion y acciones de editar y eliminar. El formulario de edicion se presenta en un modal. Las mutaciones usan `useMutation` de TanStack Query.

---

## Paso 1: Agregar funciones de escritura al servicio

**(copiar)**

En `src/services/product.service.ts`, agregar las funciones CRUD:

```ts
const BASE = import.meta.env.VITE_API_URL

export async function createProduct(
  data: Pick<Product, 'title' | 'price' | 'description' | 'category'>
): Promise<Product> {
  const res = await fetch(`${BASE}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear el producto')
  return res.json()
}

export async function updateProduct(
  id: number,
  data: Partial<Pick<Product, 'title' | 'price' | 'description' | 'stock'>>
): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al actualizar el producto')
  return res.json()
}

export async function deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean }> {
  const res = await fetch(`${BASE}/products/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar el producto')
  return res.json()
}
```

**¿Que hace este codigo?**
- `createProduct` usa POST a `/products/add` — DummyJSON acepta el body y retorna el producto creado con un id asignado
- `updateProduct` usa PUT a `/products/:id` con solo los campos a actualizar
- `deleteProduct` usa DELETE y retorna `{ id, isDeleted: true }` — la eliminacion es simulada

---

## Paso 2: Crear el hook de mutaciones

**(copiar)**

Crear `src/hooks/useProductMutations.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct, updateProduct, deleteProduct } from '@/services/product.service'
import type { Product } from '@/types/product.types'

export function useProductMutations() {
  const queryClient = useQueryClient()

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: invalidateProducts,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: invalidateProducts,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidateProducts,
  })

  return { createMutation, updateMutation, deleteMutation }
}
```

**¿Que hace este codigo?**
- `useQueryClient` da acceso al cache de TanStack Query
- `invalidateQueries` con `queryKey: ['products']` marca el cache como obsoleto — el proximo render que necesite los productos los volvera a pedir
- Centralizar las tres mutaciones en un hook evita duplicar la logica de invalidacion en cada componente

---

## Paso 3: Crear el componente `EditProductModal`

**(copiar)**

Crear `src/components/admin/EditProductModal.tsx`:

```tsx
import { useState, useEffect } from 'react'
import type { Product } from '@/types/product.types'

interface Props {
  producto: Product | null   // null = crear nuevo
  onClose: () => void
  onSave: (data: Partial<Product>) => void
  isPending: boolean
}

export default function EditProductModal({ producto, onClose, onSave, isPending }: Props) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState(0)

  useEffect(() => {
    if (producto) {
      setTitle(producto.title)
      setPrice(producto.price)
      setDescription(producto.description)
      setStock(producto.stock)
    }
  }, [producto])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ title, price, description, stock })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '480px', maxWidth: '90vw' }}>
        <h2>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>
            Nombre
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '0.5rem' }}
            />
          </label>

          <label>
            Precio (USD)
            <input
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              required
              style={{ display: 'block', width: '100%', padding: '0.5rem' }}
            />
          </label>

          <label>
            Stock
            <input
              type="number"
              min={0}
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              required
              style={{ display: 'block', width: '100%', padding: '0.5rem' }}
            />
          </label>

          <label>
            Descripcion
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ display: 'block', width: '100%', padding: '0.5rem' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} disabled={isPending}>
              Cancelar
            </button>
            <button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**¿Que hace este codigo?**
- `useEffect` carga los valores del producto cuando se abre el modal de edicion — si `producto` es null, los campos quedan en los valores iniciales vacios
- El overlay fijo con `inset: 0` cubre toda la pantalla
- `isPending` deshabilita los botones mientras la mutacion esta en proceso para evitar doble submit

---

## Paso 4: Crear la tabla de productos

**(copiar)**

Crear `src/components/admin/ProductsTable.tsx`:

```tsx
import { useState, useMemo } from 'react'
import type { Product } from '@/types/product.types'

type SortField = 'title' | 'price' | 'rating' | 'stock'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 10

interface Props {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  isDeleting: boolean
}

export default function ProductsTable({ products, onEdit, onDelete, isDeleting }: Props) {
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
      setPage(1)
    }
  }

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1
      const va = a[sortField]
      const vb = b[sortField]
      if (typeof va === 'string') return va.localeCompare(vb as string) * mult
      return ((va as number) - (vb as number)) * mult
    })
  }, [products, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      onClick={() => handleSort(field)}
      style={{ cursor: 'pointer', userSelect: 'none', padding: '0.75rem' }}
    >
      {label} {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : ''}
    </th>
  )

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <SortHeader field="title" label="Nombre" />
            <SortHeader field="price" label="Precio" />
            <SortHeader field="rating" label="Rating" />
            <SortHeader field="stock" label="Stock" />
            <th style={{ padding: '0.75rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  width={40}
                  style={{ verticalAlign: 'middle', marginRight: '0.5rem', borderRadius: '4px' }}
                />
                {p.title}
              </td>
              <td style={{ padding: '0.75rem' }}>${p.price.toFixed(2)}</td>
              <td style={{ padding: '0.75rem' }}>⭐ {p.rating.toFixed(1)}</td>
              <td style={{ padding: '0.75rem' }}>{p.stock}</td>
              <td style={{ padding: '0.75rem' }}>
                <button
                  onClick={() => onEdit(p)}
                  style={{ marginRight: '0.5rem' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar "${p.title}"?`)) {
                      onDelete(p.id)
                    }
                  }}
                  disabled={isDeleting}
                  style={{ color: 'red' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          ← Anterior
        </button>
        <span>Pagina {page} de {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          Siguiente →
        </button>
      </div>
    </div>
  )
}
```

**¿Que hace este codigo?**
- `useMemo` recalcula el array ordenado solo cuando cambian `products`, `sortField` o `sortDir` — evita ordenar en cada render
- `window.confirm` es la forma mas simple de pedir confirmacion antes de eliminar — en produccion se reemplazaria por un modal propio
- El componente `SortHeader` es interno al archivo — es un componente auxiliar de un solo uso

---

## Paso 5: Crear la pagina AdminProductsPage

**(completar)**

Crear `src/pages/AdminProductsPage.tsx`:

```tsx
import { useState } from 'react'
import { useProductsQuery } from '@/hooks/useProductsQuery'
import { useProductMutations } from '@/hooks/useProductMutations'
import ProductsTable from '@/components/admin/ProductsTable'
import EditProductModal from '@/components/admin/EditProductModal'
import type { Product } from '@/types/product.types'

export default function AdminProductsPage() {
  const { data, isLoading } = useProductsQuery(100)
  const { createMutation, updateMutation, deleteMutation } = useProductMutations()

  // null = modal abierto para crear, Product = modal abierto para editar, undefined = cerrado
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined)

  // TODO A3.1: Implementar handleSave para crear o editar segun corresponda
  const handleSave = (formData: Partial<Product>) => {
    if (editingProduct === null) {
      // crear nuevo
      // createMutation.mutate({ title: formData.title!, price: formData.price!, ... })
    } else if (editingProduct) {
      // editar existente
      // updateMutation.mutate({ id: editingProduct.id, data: formData })
    }
    setEditingProduct(undefined)
  }

  if (isLoading) return <p>Cargando productos...</p>

  const products = data?.products ?? []

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Administracion de Productos</h1>
        <button onClick={() => setEditingProduct(null)}>
          + Nuevo Producto
        </button>
      </div>

      <ProductsTable
        products={products}
        onEdit={(p) => setEditingProduct(p)}
        onDelete={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
      />

      {editingProduct !== undefined && (
        <EditProductModal
          producto={editingProduct}
          onClose={() => setEditingProduct(undefined)}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  )
}
```

---

## Paso 6: Agregar la ruta de admin en App.tsx

**(completar)**

En `src/App.tsx`, agregar la ruta protegida para admin:

```tsx
// TODO A3.2: Agregar ruta /admin/products como ruta protegida
// Dentro del PrivateRoute:
// { path: 'admin/products', element: <AdminProductsPage /> }
```

---

## Verificacion

> Captura pendiente: tabla de productos con columnas ordenables — una columna con flecha ▲ o ▼. Captura del modal abierto con el formulario de edicion.

**Checklist:**
- [ ] La pagina `/admin/products` requiere login para acceder
- [ ] La tabla muestra los productos con paginacion de 10 por pagina
- [ ] Hacer clic en encabezado de columna ordena los productos
- [ ] Hacer clic dos veces en la misma columna invierte el orden
- [ ] El boton "Editar" abre el modal con los datos del producto
- [ ] Guardar en el modal llama a la API y recarga la lista
- [ ] Eliminar pide confirmacion antes de proceder
- [ ] Durante la mutation, los botones estan deshabilitados

---

## Commits Sugeridos

```bash
git commit -m "feat: agregar funciones createProduct, updateProduct, deleteProduct al servicio"
git commit -m "feat: crear useProductMutations con useMutation y cache invalidation"
git commit -m "feat: crear ProductsTable con ordenamiento y paginacion"
git commit -m "feat: crear EditProductModal para crear y editar productos"
git commit -m "feat: crear AdminProductsPage y agregar ruta protegida"
```
