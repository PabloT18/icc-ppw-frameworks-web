# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 9: Rutas, Layouts y React Router

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Agregar tres rutas a ReactStore: pagina de inicio (`/`), detalle de producto (`/products/:id`) y favoritos (`/favorites`). Crear un `MainLayout` con header de navegacion compartido. Navegar al detalle al hacer clic en una tarjeta.

---

## Instalacion

```bash
pnpm add react-router-dom
```

---

## Archivos que se van a crear o modificar

```
src/
├── main.tsx                              (modificado — BrowserRouter)
├── App.tsx                               (modificado — Routes)
├── layouts/
│   └── MainLayout.tsx                    (nuevo — desde files/)
└── pages/
    ├── HomePage.tsx                      (nuevo — desde files/)
    ├── ProductDetailPage.tsx             (nuevo — desde files/)
    ├── FavoritesPage.tsx                 (nuevo — desde files/)
    └── NotFoundPage.tsx                  (nuevo)
```

---

## Paso 1: Envolver la app en `BrowserRouter`

**(copiar)**

Modificar `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

**¿Que hace este codigo?**
- `BrowserRouter` habilita el routing del lado del cliente para toda la app
- Se coloca una sola vez en `main.tsx`, lo mas arriba posible — no dentro de componentes de pagina

---

## Paso 2: Crear `MainLayout`

**(copiar — desde `files/MainLayout.tsx`)**

Crear `src/layouts/MainLayout.tsx`:

```tsx
import { Outlet, NavLink } from 'react-router-dom'

function MainLayout() {
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#60a5fa' : 'white',
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 400,
    borderBottom: isActive ? '2px solid #60a5fa' : '2px solid transparent',
    paddingBottom: '2px',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ background: '#1a1a1a', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <NavLink to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 700 }}>
          ReactStore
        </NavLink>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <NavLink to="/" end style={navLinkStyle}>
            Productos
          </NavLink>
          <NavLink to="/favorites" style={navLinkStyle}>
            Favoritos ❤️
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.85rem', borderTop: '1px solid #e5e7eb', marginTop: '2rem' }}>
        ReactStore &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default MainLayout
```

**¿Que hace este codigo?**
- `<Outlet />` es el marcador donde React Router renderiza la pagina activa segun la URL
- `end` en el NavLink de Productos evita que se marque activo cuando la URL es `/favorites` (sin `end`, `/` coincide con cualquier URL)
- `navLinkStyle` es una funcion — `NavLink` la llama con `{ isActive }` para aplicar estilos dinamicos

---

## Paso 3: Crear las paginas

**(copiar — desde `files/`)**

**`src/pages/NotFoundPage.tsx`:**

```tsx
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Pagina no encontrada</p>
      <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage
```

**`src/pages/FavoritesPage.tsx` (desde `files/FavoritesPage.tsx`):**

```tsx
import useLocalStorage from '@/hooks/useLocalStorage'
import useProducts from '@/hooks/useProducts'
import ProductList from '@/components/ProductList'

function FavoritesPage() {
  const { productos, cargando } = useProducts(100)
  const [favoritos, setFavoritos] = useLocalStorage<number[]>('react-store-favoritos', [])

  const toggleFavorito = (id: number) => {
    setFavoritos(favoritos.includes(id) ? favoritos.filter(fid => fid !== id) : [...favoritos, id])
  }

  const productosFavoritos = productos.filter(p => favoritos.includes(p.id))

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Mis Favoritos ({productosFavoritos.length})</h2>
      <ProductList
        productos={productosFavoritos}
        cargando={cargando}
        busqueda=""
        favoritos={favoritos}
        onToggleFavorito={toggleFavorito}
      />
    </div>
  )
}

export default FavoritesPage
```

---

## Paso 4: Crear `ProductDetailPage`

**(copiar — desde `files/ProductDetailPage.tsx`)**

Crear `src/pages/ProductDetailPage.tsx`:

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getProductById } from '@/services/product.service'
import type { Product } from '@/types/product.types'

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [producto, setProducto] = useState<Product | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setCargando(true)
    getProductById(Number(id))
      .then(setProducto)
      .catch(() => setError('Producto no encontrado'))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  if (error || !producto) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>{error}</p>
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', cursor: 'pointer', border: 'none', background: 'none', color: '#2563eb', fontWeight: 600 }}>
        ← Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <img
          src={producto.thumbnail}
          alt={producto.title}
          style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '1' }}
        />
        <div>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'capitalize' }}>{producto.category}</span>
          <h1 style={{ margin: '0.5rem 0 1rem', fontSize: '1.5rem' }}>{producto.title}</h1>
          <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{producto.description}</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb', margin: '1rem 0' }}>
            ${producto.price.toFixed(2)}
          </p>
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
- `useParams<{ id: string }>()` tipifica el parametro como string (siempre string en URL)
- `navigate(-1)` navega a la pagina anterior en el historial del navegador — equivale al boton Atras
- El `useEffect` depende de `id` — si el usuario navega de `/products/1` a `/products/2`, el efecto se re-ejecuta

---

## Paso 5: Crear `HomePage`

**(completar)**

Mover la logica de productos desde `App.tsx` a `src/pages/HomePage.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useProducts from '@/hooks/useProducts'
import useCategories from '@/hooks/useCategories'
import useLocalStorage from '@/hooks/useLocalStorage'
import ProductList from '@/components/ProductList'
import FilterPanel from '@/components/FilterPanel'
import type { ProductFilters } from '@/types/product.types'
import { FILTROS_INICIALES } from '@/types/product.types'

function HomePage() {
  const navigate = useNavigate()
  const { productos, cargando, error } = useProducts(100)
  const { categorias } = useCategories()
  const [favoritos, setFavoritos] = useLocalStorage<number[]>('react-store-favoritos', [])
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [filtros, setFiltros] = useState<ProductFilters>(FILTROS_INICIALES)

  const toggleFavorito = (id: number) => {
    setFavoritos(favoritos.includes(id) ? favoritos.filter(fid => fid !== id) : [...favoritos, id])
  }

  // TODO 5.1: Agregar handler para navegar al detalle
  // const handleVerDetalle = (id: number) => navigate(`/products/${id}`)

  const productosFiltrados = productos
    .filter(p => p.title.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => categoriaActiva === 'todas' || p.category === categoriaActiva)
    .filter(p => p.price >= filtros.precioMin && p.price <= filtros.precioMax)
    .filter(p => p.rating >= filtros.ratingMin)
    .sort((a, b) => {
      if (filtros.ordenar === 'precio-asc') return a.price - b.price
      if (filtros.ordenar === 'precio-desc') return b.price - a.price
      if (filtros.ordenar === 'rating-desc') return b.rating - a.rating
      return a.title.localeCompare(b.title)
    })

  if (error) return <p style={{ padding: '2rem', color: '#dc2626' }}>Error: {error}</p>

  return (
    <div>
      <div style={{ background: '#1a1a1a', padding: '1rem 2rem' }}>
        <input
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontSize: '1rem', width: '100%', maxWidth: '400px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'flex-start' }}>
        <aside style={{ width: '260px', flexShrink: 0 }}>
          <FilterPanel filtros={filtros} onAplicar={setFiltros} />
        </aside>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                style={{
                  padding: '0.35rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  background: categoriaActiva === cat ? '#2563eb' : 'white',
                  color: categoriaActiva === cat ? 'white' : '#333',
                  textTransform: 'capitalize',
                  fontSize: '0.85rem',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* TODO 5.2: Pasar prop onVerDetalle={handleVerDetalle} a ProductList */}
          <ProductList
            productos={productosFiltrados}
            cargando={cargando}
            busqueda={busqueda}
            favoritos={favoritos}
            onToggleFavorito={toggleFavorito}
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage
```

---

## Paso 6: Configurar rutas en `App.tsx`

**(copiar)**

Reemplazar `src/App.tsx` con la configuracion de rutas:

```tsx
import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import FavoritesPage from '@/pages/FavoritesPage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
```

**¿Que hace este codigo?**
- `<Route element={<MainLayout />}>` es la ruta padre que actua como layout — no tiene `path`
- `<Route index />` se renderiza en la ruta raiz del padre (en este caso `/`)
- `path="*"` captura cualquier URL no definida — la pagina 404 queda fuera del layout para que sea independiente

> Captura pendiente: la app muestra el header con "Productos" y "Favoritos ❤️"; al hacer clic en "Favoritos" la URL cambia a `/favorites` y el nav link se resalta.

---

## Paso 7: Navegar al detalle desde `ProductCard`

**(completar)**

Agregar un boton "Ver detalles" a `ProductCard` que navegue a `/products/:id`:

```tsx
// En ProductCard, agregar prop opcional
interface ProductCardProps {
  product: Product
  isFavorite: boolean
  onToggleFavorite: () => void
  onVerDetalle?: () => void   // TODO 7.1: agregar esta prop
}

// En el JSX, agregar boton al final de .content
// TODO 7.2: agregar un <button> que llame a onVerDetalle
<button
  onClick={onVerDetalle}
  style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #2563eb', color: '#2563eb', background: 'white', cursor: 'pointer', fontWeight: 600 }}
>
  Ver detalles
</button>
```

> Captura pendiente: al hacer clic en "Ver detalles" en cualquier tarjeta, la URL cambia a `/products/N` y se muestra la imagen, nombre, descripcion, precio y rating del producto.

---

## Validaciones Esperadas

- [ ] El header con navegacion aparece en todas las rutas del layout
- [ ] Navegar a `/favorites` muestra la pagina de favoritos sin recargar la pagina
- [ ] La URL `/products/1` muestra el detalle del producto con id 1
- [ ] El boton Volver en el detalle regresa a la lista
- [ ] La URL `/cualquier-cosa-invalida` muestra la pagina 404
- [ ] `NavLink` se resalta correctamente segun la ruta activa

---

## Entregables

- `src/main.tsx` con `BrowserRouter`
- `src/App.tsx` con `Routes` y `Route`
- `src/layouts/MainLayout.tsx`
- `src/pages/HomePage.tsx`, `ProductDetailPage.tsx`, `FavoritesPage.tsx`, `NotFoundPage.tsx`
- `src/components/ProductCard.tsx` con prop `onVerDetalle`

---

## Commits Sugeridos

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: instalar react-router-dom"
git commit -m "feat: crear MainLayout con navegacion y Outlet"
git commit -m "feat: crear paginas HomePage, ProductDetailPage, FavoritesPage y NotFoundPage"
git commit -m "feat: configurar rutas anidadas en App.tsx"
git commit -m "feat: navegar al detalle desde ProductCard"
```
