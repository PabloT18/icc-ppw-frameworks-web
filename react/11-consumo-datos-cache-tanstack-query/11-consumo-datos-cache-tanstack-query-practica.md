# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 11: Consumo de Datos y Cache con TanStack Query

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Instalar TanStack Query, configurar el `QueryClient`, reemplazar los hooks manuales `useProducts` y `useCategories` con `useQuery`, y migrar el fetch del detalle de producto de `useEffect` a `useQuery`. Al finalizar, la navegacion entre paginas ya visitadas sera instantanea gracias al cache.

---

## Instalacion

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

---

## Archivos que se van a crear o modificar

```
src/
├── main.tsx                              (modificado — QueryClientProvider)
├── App.tsx                               (modificado — ReactQueryDevtools)
├── hooks/
│   ├── useProductsQuery.ts              (nuevo — desde files/)
│   ├── useCategoriesQuery.ts            (nuevo — desde files/)
│   └── useProductDetailQuery.ts         (nuevo — desde files/)
└── pages/
    └── ProductDetailPage.tsx            (modificado — usa useProductDetailQuery)
```

---

## Paso 1: Configurar `QueryClient` en `main.tsx`

**(copiar)**

Modificar `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 2,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
```

**¿Que hace este codigo?**
- `QueryClient` es el repositorio central de cache — debe crearse **fuera** del componente para que no se reinicie en cada render
- `QueryClientProvider` lo distribuye a todos los hooks `useQuery` de la app
- `staleTime: 5 minutos` significa que los productos no se vuelven a pedir si se visitaron en los ultimos 5 minutos

---

## Paso 2: Crear hooks con `useQuery`

**(copiar — desde `files/`)**

Crear `src/hooks/useProductsQuery.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/services/product.service'

export function useProductsQuery(limit = 30) {
  return useQuery({
    queryKey: ['products', limit],
    queryFn: () => getProducts(limit),
  })
}
```

Crear `src/hooks/useCategoriesQuery.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/product.service'

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // categorias cambian poco — cachear 10 min
  })
}
```

Crear `src/hooks/useProductDetailQuery.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import { getProductById } from '@/services/product.service'

export function useProductDetailQuery(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: id > 0,   // no hacer fetch si el id no es valido
  })
}
```

**¿Que hace este codigo?**
- La query key `['products', limit]` incluye `limit` — si cambia a 50, se crea una entrada de cache separada
- `enabled: id > 0` — evita lanzar la peticion si `id` es 0 o negativo (ej: parsing fallido de la URL)
- El valor de retorno de `useQuery` ya incluye `data`, `isLoading`, `isError`, `error` — no hay que definirlos con useState

---

## Paso 3: Migrar `HomePage` a los nuevos hooks

**(completar)**

Modificar `src/pages/HomePage.tsx` para usar los hooks de TanStack Query:

```tsx
// TODO 3.1: Reemplazar los imports de custom hooks
// Antes:
// import useProducts from '@/hooks/useProducts'
// import useCategories from '@/hooks/useCategories'
// Despues:
import { useProductsQuery } from '@/hooks/useProductsQuery'
import { useCategoriesQuery } from '@/hooks/useCategoriesQuery'

// TODO 3.2: Reemplazar las llamadas a hooks
// Antes:
// const { productos, cargando, error } = useProducts(100)
// const { categorias } = useCategories()
// Despues:
const { data, isLoading, isError } = useProductsQuery(100)
const productos = data?.products ?? []
const { data: categoriaData } = useCategoriesQuery()
const categorias = ['todas', ...(categoriaData ?? [])]
```

---

## Paso 4: Migrar `ProductDetailPage` a `useQuery`

**(copiar)**

Modificar `src/pages/ProductDetailPage.tsx`:

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useProductDetailQuery } from '@/hooks/useProductDetailQuery'

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: producto, isLoading, isError } = useProductDetailQuery(Number(id ?? 0))

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>

  if (isError || !producto) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#dc2626' }}>Producto no encontrado</p>
        <button onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>Volver</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1rem', cursor: 'pointer', border: 'none', background: 'none', color: '#2563eb', fontWeight: 600, fontSize: '1rem' }}
      >
        ← Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <img src={producto.thumbnail} alt={producto.title} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '1' }} />
        <div>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'capitalize' }}>{producto.category}</span>
          <h1 style={{ margin: '0.5rem 0 1rem', fontSize: '1.5rem' }}>{producto.title}</h1>
          <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{producto.description}</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb', margin: '1rem 0' }}>${producto.price.toFixed(2)}</p>
          <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
            <span>★ {producto.rating.toFixed(1)}</span>
            <span>{producto.stock} en stock</span>
            <span>-{producto.discountPercentage.toFixed(0)}% dto.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
```

**¿Que hace este codigo?**
- La primera vez que se visita `/products/42`, hace el fetch
- La segunda vez (navegar atras y volver a entrar), los datos aparecen **instantaneamente** del cache
- Si el cache expira (5 min), vuelve a hacer el fetch automaticamente en segundo plano

---

## Paso 5: Agregar DevTools

**(copiar)**

Modificar `src/App.tsx` para agregar las DevTools:

```tsx
import { Routes, Route } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import FavoritesPage from '@/pages/FavoritesPage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
```

> Captura pendiente: panel de DevTools de TanStack Query en la esquina inferior derecha mostrando las queries `['products', 100]` y `['categories']` en estado "fresh" (verde). Al navegar al detalle y volver, la query `['products', 100]` no se vuelve a ejecutar.

---

## Validaciones Esperadas

- [ ] El panel de DevTools aparece en la esquina inferior derecha (icono de cohete)
- [ ] Las queries aparecen como "fresh" durante 5 minutos
- [ ] Navegar al detalle de un producto y volver a la lista no genera nuevas peticiones en Network
- [ ] Al visitar el detalle de un producto por segunda vez, los datos aparecen instantaneamente
- [ ] Si se desconecta el internet y se navega a una pagina ya visitada, los datos aun se muestran del cache

---

## Entregables

- `src/main.tsx` con `QueryClientProvider`
- `src/hooks/useProductsQuery.ts`, `useCategoriesQuery.ts`, `useProductDetailQuery.ts`
- `src/pages/HomePage.tsx` y `ProductDetailPage.tsx` migrados a `useQuery`
- `src/App.tsx` con `ReactQueryDevtools`

---

## Commits Sugeridos

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: instalar @tanstack/react-query y devtools"
git commit -m "feat: configurar QueryClient en main.tsx"
git commit -m "feat: crear hooks useProductsQuery, useCategoriesQuery, useProductDetailQuery"
git commit -m "refactor: migrar HomePage y ProductDetailPage a useQuery"
```
