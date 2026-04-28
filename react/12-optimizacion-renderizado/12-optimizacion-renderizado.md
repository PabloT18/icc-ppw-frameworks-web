# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 12: Optimizacion de Renderizado

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Identificar re-renders innecesarios en una aplicacion React y aplicar las herramientas de optimizacion correctas: `React.memo`, `useMemo`, `useCallback`, `useRef`, y la carga diferida de componentes con `React.lazy` + `Suspense`. Aprender **cuando** optimizar y **cuando** no hacerlo.

---

## 2. La Regla de Oro de la Optimizacion

> "Las optimizaciones prematuras son la raiz de todo mal" — Donald Knuth

Antes de optimizar, verificar si hay un problema real. Un componente que re-renderiza en 0.1ms no necesita memorizacion. Solo optimizar cuando:
- El Profiler de React DevTools muestra renders lentos (>16ms)
- La UI se percibe lenta para el usuario
- Una computacion es genuinamente costosa (grandes listas, operaciones matematicas complejas)

---

## 3. Re-renders en React

React re-renderiza un componente cuando:
1. Su propio estado cambia
2. Su componente padre re-renderiza (aunque los props no hayan cambiado)
3. El contexto al que esta suscrito cambia

```
App (estado cambia)
├── Header           ← re-renderiza aunque no use el estado
├── ProductList      ← re-renderiza
│   ├── ProductCard  ← re-renderiza (×30 si hay 30 productos)
│   └── ProductCard  ← re-renderiza
└── Sidebar          ← re-renderiza aunque no use el estado
```

---

## 4. React.memo — Evitar Re-renders por Props

`React.memo` envuelve un componente y lo memoriza. Solo re-renderiza si **al menos un prop cambia**.

```tsx
import { memo } from 'react'
import { Product } from '@/types/product.types'

interface Props {
  producto: Product
  esFavorito: boolean
  onToggleFavorito: (id: number) => void
}

// Con React.memo — solo re-renderiza si alguno de sus props cambia
const ProductCard = memo(function ProductCard({ producto, esFavorito, onToggleFavorito }: Props) {
  return <article>...</article>
})

export default ProductCard
```

**Trampa**: si la prop es una funcion creada dentro del componente padre, cambia en cada render del padre, inutilizando `React.memo`. Solucion: `useCallback`.

---

## 5. useCallback — Funciones Estables

```tsx
// SIN useCallback — la funcion es nueva en cada render del padre
// ProductCard re-renderiza aunque no cambie nada
const handleToggle = (id: number) => {
  setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
}

// CON useCallback — la funcion es la misma referencia entre renders
const handleToggle = useCallback((id: number) => {
  setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
}, []) // dependencias vacias: la funcion nunca cambia
```

Usar `useCallback` tiene sentido cuando:
- La funcion se pasa a un componente envuelto en `React.memo`
- La funcion es una dependencia de otro `useEffect` o `useMemo`

---

## 6. useMemo — Computaciones Costosas

```tsx
const productosFiltrados = useMemo(() => {
  return productos
    .filter(p => p.price >= filtros.precioMin && p.price <= filtros.precioMax)
    .filter(p => p.rating >= filtros.ratingMin)
    .sort((a, b) => {
      if (filtros.ordenar === 'precio-asc') return a.price - b.price
      if (filtros.ordenar === 'precio-desc') return b.price - a.price
      if (filtros.ordenar === 'rating-desc') return b.rating - a.rating
      return a.title.localeCompare(b.title)
    })
}, [productos, filtros]) // recalcular solo si cambian productos o filtros
```

Sin `useMemo`, esta computacion se ejecuta en cada render aunque `productos` y `filtros` no hayan cambiado.

### Regla practica para useMemo

| Situacion | Usar useMemo? |
|---|---|
| Filtrar/ordenar una lista de 30 items | No es necesario |
| Filtrar/ordenar una lista de 10,000 items | Si |
| Calcular el total de un carrito | Si (si el carrito tiene muchos items) |
| Formatear un string | No |

---

## 7. useRef — Valores Mutables Sin Re-render

`useRef` guarda un valor mutable que persiste entre renders pero **no** causa re-render cuando cambia.

```tsx
// Casos de uso tipicos
const inputRef = useRef<HTMLInputElement>(null)  // referencia al DOM
const contadorRef = useRef(0)                     // contador que no necesita re-render
const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined) // ID de timer

// Acceder al DOM
<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>Enfocar</button>

// Debounce con useRef
function useDebouncedSearch(delay = 300) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  
  return (fn: () => void) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(fn, delay)
  }
}
```

---

## 8. React.lazy + Suspense — Code Splitting

Por defecto, Vite agrupa todo el codigo en un bundle. Con `React.lazy`, las paginas se cargan **solo cuando se navega a ellas**.

```tsx
import { lazy, Suspense } from 'react'

// Importacion dinamica — el bundle de estas paginas se descarga al navegar
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <Suspense fallback={<div>Cargando pagina...</div>}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
```

El resultado en el build:
```
dist/
├── assets/
│   ├── index-[hash].js          ← bundle principal (pequeno)
│   ├── ProductDetailPage-[hash].js  ← chunk separado
│   └── FavoritesPage-[hash].js      ← chunk separado
```

---

## 9. React Profiler

El Profiler de React DevTools muestra exactamente **cuanto tiempo** tomo cada render y **por que** se produjo.

Para usar el Profiler programaticamente:

```tsx
import { Profiler } from 'react'

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) {
  if (actualDuration > 16) {
    console.warn(`[Profiler] ${id} tardó ${actualDuration.toFixed(2)}ms en ${phase}`)
  }
}

<Profiler id="ProductList" onRender={onRenderCallback}>
  <ProductList productos={productos} />
</Profiler>
```

---

## 10. Errores Comunes

| Error | Consecuencia | Solucion |
|---|---|---|
| `React.memo` con funciones como props sin `useCallback` | Memo no tiene efecto | Usar `useCallback` en el padre |
| `useMemo` con array de dependencias vacio | El valor nunca se recalcula | Agregar todas las dependencias que se usan dentro |
| Comparacion de objetos en dependencias | `useMemo` recalcula siempre (referencia nueva) | Memorizar el objeto de filtros tambien, o usar valores primitivos |
| Agregar `React.memo` a todos los componentes | Overhead de comparacion mayor que el beneficio | Solo memorizar componentes que re-renderizan frecuentemente con los mismos props |

---

## 11. Referencias

- [React.memo — React Docs](https://react.dev/reference/react/memo)
- [useCallback — React Docs](https://react.dev/reference/react/useCallback)
- [useMemo — React Docs](https://react.dev/reference/react/useMemo)
- [useRef — React Docs](https://react.dev/reference/react/useRef)
- [lazy — React Docs](https://react.dev/reference/react/lazy)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
