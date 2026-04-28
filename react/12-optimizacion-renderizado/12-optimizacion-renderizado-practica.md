# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 12: Optimizacion de Renderizado

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Aplicar `React.memo`, `useMemo`, `useCallback` y `React.lazy + Suspense` al proyecto ReactStore. Medir el impacto usando React DevTools Profiler y la herramienta de analisis de bundles.

---

## Paso 1: Instalar el analizador de bundle

**(copiar)**

```bash
pnpm add -D rollup-plugin-visualizer
```

Modificar `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,           // abrir automaticamente en el browser
      filename: 'dist/stats.html',
      gzipSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

> Ejecutar `pnpm build` — se abrira un grafico del bundle en el browser mostrando el tamanio de cada modulo.

**¿Que hace este codigo?**
- `rollup-plugin-visualizer` genera un mapa de calor del bundle al compilar
- Permite identificar que librerias consumen mas espacio y que archivos podrian separarse en chunks

---

## Paso 2: Memorizar `ProductCard` con `React.memo`

**(copiar)**

Modificar `src/components/ProductCard.tsx` envolviendo el componente:

```tsx
import { memo } from 'react'
// ... resto de imports

const ProductCard = memo(function ProductCard({ producto }: Props) {
  // ... implementacion existente sin cambios
})

export default ProductCard
```

**¿Que hace este codigo?**
- `memo()` envuelve la funcion del componente — no cambia nada de su comportamiento
- Solo re-renderizara si `producto` cambia (comparacion superficial de props)
- Sin `memo`: 30 cards se re-renderizan cada vez que el estado del padre cambia (ej: escribir en el buscador)

---

## Paso 3: Estabilizar la funcion `toggleFavorito` con `useCallback`

**(completar)**

En `src/contexts/FavoritesContext.tsx`, envolver `toggleFavorito` en `useCallback`:

```tsx
import { useCallback } from 'react'

// TODO 3.1: Envolver la funcion en useCallback con el array de dependencias correcto
// La funcion usa setFavoritos — que dependencias necesita?
const toggleFavorito = useCallback((id: number) => {
  setFavoritos(prev =>
    prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  )
}, [setFavoritos]) // TODO 3.2: Completar el array de dependencias
```

**¿Que hace este codigo?**
- `useCallback` garantiza que `toggleFavorito` sea la misma referencia de funcion entre renders
- Esto es necesario para que `React.memo` en `ProductCard` funcione correctamente: si la funcion cambia de referencia, `memo` detecta el cambio y re-renderiza igualmente
- La dependencia es `setFavoritos` — pero como `useState` garantiza que `setFavoritos` es estable, el array puede ser `[]`

---

## Paso 4: Memorizar la lista filtrada con `useMemo`

**(copiar)**

En `src/pages/HomePage.tsx`, aplicar `useMemo` al filtrado:

```tsx
import { useMemo } from 'react'

// Reemplazar el calculo directo por useMemo
const productosFiltrados = useMemo(() => {
  const texto = busqueda.toLowerCase()

  return productos
    .filter(p => {
      const coincideBusqueda = p.title.toLowerCase().includes(texto) ||
        p.description.toLowerCase().includes(texto)
      const coincideCategoria = categoriaActiva === 'todas' || p.category === categoriaActiva
      const coincidePrecio = p.price >= filtros.precioMin && p.price <= filtros.precioMax
      const coincideRating = p.rating >= filtros.ratingMin
      return coincideBusqueda && coincideCategoria && coincidePrecio && coincideRating
    })
    .sort((a, b) => {
      if (filtros.ordenar === 'precio-asc') return a.price - b.price
      if (filtros.ordenar === 'precio-desc') return b.price - a.price
      if (filtros.ordenar === 'rating-desc') return b.rating - a.rating
      return a.title.localeCompare(b.title)
    })
}, [productos, busqueda, categoriaActiva, filtros])
```

**¿Que hace este codigo?**
- El filtrado y ordenamiento solo se recalcula cuando cambian los datos o los filtros
- Si `HomePage` re-renderiza por otra razon (poco probable pero posible), la lista no se vuelve a calcular
- El array de dependencias debe incluir **todas** las variables usadas dentro: `[productos, busqueda, categoriaActiva, filtros]`

---

## Paso 5: Code splitting con `React.lazy`

**(copiar)**

Modificar `src/App.tsx`:

```tsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage' // HomePage carga siempre (pagina principal)

// Estas paginas se cargan solo cuando el usuario navega a ellas
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <>
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Cargando...</p>
        </div>
      }>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
```

**¿Que hace este codigo?**
- `lazy(() => import(...))` convierte el import en dinamico — Vite lo separa en un chunk aparte
- `Suspense` muestra el `fallback` mientras el chunk se descarga (solo en la primera visita)
- En visitas posteriores, el chunk ya esta en el cache del browser — no hay delay perceptible

> Captura pendiente: output de `pnpm build` mostrando chunks separados para `ProductDetailPage` y `FavoritesPage`. Comparar el tamanio del bundle principal antes y despues.

---

## Paso 6: Medir con React DevTools Profiler (verificar)

**(verificar)**

1. Instalar la extension [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) en Chrome
2. Abrir DevTools (F12) → pestaña "Profiler"
3. Hacer clic en "Record" (⚫)
4. Escribir en el buscador de productos varias letras
5. Detener la grabacion
6. Observar cuantas veces re-renderizo `ProductCard` antes vs despues de `React.memo`

> Captura pendiente: Profiler de React DevTools mostrando el flamegraph. Los `ProductCard` que no cambiaron deben aparecer en gris ("Did not render").

---

## Paso 7: Agregar `useRef` para el campo de busqueda (completar)

**(completar)**

En `src/pages/HomePage.tsx`, agregar un boton para enfocar el buscador automaticamente:

```tsx
import { useRef } from 'react'

const buscadorRef = useRef<HTMLInputElement>(null)

// TODO 7.1: Agregar ref al input del buscador
<input
  ref={buscadorRef}
  type="search"
  // ...otros props
/>

// TODO 7.2: Agregar un boton que enfoque el input al hacer click
<button onClick={() => buscadorRef.current?.focus()}>
  Buscar productos
</button>
```

---

## Validaciones Esperadas

- [ ] `pnpm build` genera chunks separados para `ProductDetailPage` y `FavoritesPage`
- [ ] El grafico de visualizador se abre en el browser mostrando el tamanio de cada dependencia
- [ ] En el Profiler, al escribir en el buscador, solo el componente del buscador re-renderiza (no los ProductCard que no cambiaron)
- [ ] El boton "Buscar productos" enfoca el input sin causar re-render del componente

---

## Entregables

- `vite.config.ts` con `rollup-plugin-visualizer`
- `src/components/ProductCard.tsx` envuelto en `React.memo`
- `src/contexts/FavoritesContext.tsx` con `toggleFavorito` en `useCallback`
- `src/pages/HomePage.tsx` con `productosFiltrados` en `useMemo` y `buscadorRef`
- `src/App.tsx` con `React.lazy` + `Suspense` para paginas secundarias

---

## Commits Sugeridos

```bash
git commit -m "chore: instalar rollup-plugin-visualizer"
git commit -m "perf: memorizar ProductCard con React.memo"
git commit -m "perf: estabilizar toggleFavorito con useCallback"
git commit -m "perf: memoizar productosFiltrados con useMemo"
git commit -m "perf: code splitting con React.lazy y Suspense"
```
