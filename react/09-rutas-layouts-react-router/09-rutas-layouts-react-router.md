# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 9: Rutas, Layouts y React Router

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Comprender el sistema de enrutamiento del lado del cliente (client-side routing), instalar y configurar `react-router-dom`, definir rutas con `<Routes>` y `<Route>`, navegar con `<Link>` y `<NavLink>`, leer parametros dinamicos con `useParams`, navegar programaticamente con `useNavigate`, y crear layouts compartidos con rutas anidadas.

---

## 2. Explicacion Conceptual

### Que es el routing del lado del cliente

Las SPA (Single Page Applications) no recargan la pagina al navegar. React Router intercepta los cambios de URL y renderiza el componente correspondiente sin peticion al servidor:

```
URL /                    → renderiza <HomePage>
URL /products            → renderiza <ProductsPage>
URL /products/42         → renderiza <ProductDetailPage> con id=42
URL /favorites           → renderiza <FavoritesPage>
```

### Estructura basica de React Router v6

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- `path="*"` captura cualquier ruta no definida — sirve para la pagina 404
- `:id` es un parametro dinamico — puede tomar cualquier valor

### Rutas anidadas y layouts

Las rutas anidadas permiten compartir UI (header, footer, sidebar) entre varias rutas hijas:

```tsx
<Route element={<MainLayout />}>          {/* Layout compartido */}
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<ProductsPage />} />
</Route>
```

El layout debe renderizar `<Outlet />` donde van los hijos:

```tsx
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
      <header>...</header>
      <main>
        <Outlet />     {/* Aqui se renderiza la pagina activa */}
      </main>
      <footer>...</footer>
    </div>
  )
}
```

---

## 3. Fundamento Tecnico

### Link y NavLink

```tsx
import { Link, NavLink } from 'react-router-dom'

// Link basico — no recarga la pagina
<Link to="/products">Ver productos</Link>

// NavLink — agrega clase 'active' cuando la ruta coincide
<NavLink
  to="/products"
  style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#2563eb' : 'inherit' })}
>
  Productos
</NavLink>
```

### useParams

```tsx
import { useParams } from 'react-router-dom'

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  // id es siempre string aunque la URL sea /products/42
  const idNumerico = Number(id)
}
```

### useNavigate

```tsx
import { useNavigate } from 'react-router-dom'

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`/products/${product.id}`)}>
      {/* ... */}
    </div>
  )
}
```

### useSearchParams — parametros de query

```tsx
import { useSearchParams } from 'react-router-dom'

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const busqueda = searchParams.get('q') ?? ''

  return (
    <input
      value={busqueda}
      onChange={e => setSearchParams({ q: e.target.value })}
    />
  )
}
```

---

## 4. Patrones de Organizacion

### Estructura de carpetas con routing

```
src/
├── main.tsx                    (BrowserRouter aqui — una vez)
├── App.tsx                     (Routes aqui)
├── components/
│   ├── ProductCard.tsx
│   └── FilterPanel.tsx
├── layouts/
│   └── MainLayout.tsx          (Outlet aqui)
└── pages/
    ├── HomePage.tsx
    ├── ProductDetailPage.tsx
    └── NotFoundPage.tsx
```

### Diferencia entre index route y parent route

```tsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<HomePage />} />         {/* Ruta raiz del layout */}
  <Route path="products/:id" element={<ProductDetailPage />} />
</Route>
```

`<Route index />` equivale a `path=""` — se renderiza cuando la URL coincide exactamente con el padre.

---

## 5. Consideraciones de Despliegue

Al usar `BrowserRouter`, el servidor debe servir `index.html` para cualquier ruta. En Vite dev server esto funciona automaticamente. En produccion con Netlify se agrega un archivo `_redirects`:

```
/*  /index.html  200
```

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| La URL cambia pero no se renderiza nada | `<Routes>` fuera de `<BrowserRouter>` | Envolver toda la app en `<BrowserRouter>` en `main.tsx` |
| `useParams` devuelve `undefined` | El componente no esta dentro de una `<Route path=".../:id">` | Verificar que la ruta define el parametro con `:nombre` |
| El layout no aparece | `<Outlet />` ausente en el componente de layout | Agregar `<Outlet />` donde deben ir las rutas hijas |
| Clic en `<Link>` recarga la pagina | Se uso `<a href>` en lugar de `<Link to>` | Reemplazar `<a>` por `<Link>` de react-router-dom |

---

## 7. Relacion con el Proyecto Incremental

En este modulo ReactStore pasa de ser una SPA de una sola "vista" a tener tres rutas:
- `/` — lista de productos con filtros
- `/products/:id` — detalle de un producto individual
- `/favorites` — lista de productos marcados como favoritos

Se crea el `MainLayout` con header de navegacion compartido.

> Ver solucion de referencia en: `react/solver/react-store/src/pages/`

---

## 8. Referencias

- [React Router v6 Docs](https://reactrouter.com/en/main/start/tutorial)
- [useParams — React Router](https://reactrouter.com/en/main/hooks/use-params)
- [useNavigate — React Router](https://reactrouter.com/en/main/hooks/use-navigate)
- [Rutas anidadas — React Router](https://reactrouter.com/en/main/start/concepts#nested-routes)
