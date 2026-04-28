# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 10: Context API y Estado Global

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Entender cuando el estado local y el prop drilling se vuelven insuficientes, aprender a crear y consumir contextos con `createContext` y `useContext`, implementar el patron Provider con hook dedicado, y comprender las implicaciones de rendimiento de un contexto mal estructurado.

---

## 2. Explicacion Conceptual

### El problema del prop drilling

Cuando el estado necesita ser compartido entre muchos componentes, pasarlo por props genera "prop drilling":

```
App (favoritos, toggleFavorito)
  └── HomePage (favoritos, toggleFavorito)       ← solo lo pasa
        └── ProductList (favoritos, toggleFavorito)   ← solo lo pasa
              └── ProductCard (favoritos, toggleFavorito)  ← lo usa
```

Si la jerarquia tiene 4 niveles, todos los componentes intermedios deben recibir y pasar props que no les conciernen. Context API resuelve esto.

### createContext y useContext

```tsx
import { createContext, useContext } from 'react'

// 1. Crear el contexto con un valor por defecto
const TemaContext = createContext<'claro' | 'oscuro'>('claro')

// 2. Proveer el valor en algun nivel del arbol
function App() {
  return (
    <TemaContext.Provider value="oscuro">
      <Componente />   {/* Todos los hijos pueden leer el tema */}
    </TemaContext.Provider>
  )
}

// 3. Consumir desde cualquier nivel descendiente
function Componente() {
  const tema = useContext(TemaContext)
  return <div style={{ background: tema === 'oscuro' ? '#111' : '#fff' }}>...</div>
}
```

---

## 3. Fundamento Tecnico

### Patron recomendado: Provider con hook personalizado

El patron moderno encapsula `createContext`, el `Provider` y el hook de consumo en un solo archivo:

```tsx
// src/contexts/FavoritesContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import useLocalStorage from '@/hooks/useLocalStorage'

interface FavoritesContextType {
  favoritos: number[]
  toggleFavorito: (id: number) => void
  esFavorito: (id: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useLocalStorage<number[]>('react-store-favoritos', [])

  const toggleFavorito = (id: number) => {
    setFavoritos(
      favoritos.includes(id)
        ? favoritos.filter(fid => fid !== id)
        : [...favoritos, id]
    )
  }

  const esFavorito = (id: number) => favoritos.includes(id)

  return (
    <FavoritesContext.Provider value={{ favoritos, toggleFavorito, esFavorito }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// Hook con validacion — detecta uso fuera del Provider
export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de FavoritesProvider')
  return ctx
}
```

### Por que `null` como valor inicial

```tsx
const FavoritesContext = createContext<FavoritesContextType | null>(null)
```

Al usar `null`, cualquier consumo fuera del `Provider` lanzara un error claro en `useFavorites`. Si se usa un objeto vacio como valor inicial, los errores son silenciosos y dificiles de depurar.

### Cuando NO usar Context

Context es para estado **global o semi-global**: tema, autenticacion, carrito, idioma. No es para:
- Estado local de un componente (usar `useState`)
- Estado compartido entre dos componentes hermanos (elevar estado)
- Estado del servidor (usar TanStack Query — modulo 11)

Context re-renderiza **todos los consumidores** cuando el valor cambia. Si el contexto contiene un objeto grande que cambia frecuentemente, puede causar problemas de rendimiento. Soluciones: separar contextos por dominio, o usar `useMemo` para el value del Provider.

---

## 4. Ejemplos de Codigo

### Multiples contextos separados por dominio

```tsx
// En main.tsx — composicion de providers
<BrowserRouter>
  <FavoritesProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </FavoritesProvider>
</BrowserRouter>
```

### Context con reducer para estado complejo

Cuando el estado tiene varias transiciones logicas, combinar Context con `useReducer` es mas escalable que multiples `useState`:

```tsx
type CartAction =
  | { type: 'ADD'; productId: number }
  | { type: 'REMOVE'; productId: number }
  | { type: 'CLEAR' }

function cartReducer(state: number[], action: CartAction): number[] {
  switch (action.type) {
    case 'ADD': return [...state, action.productId]
    case 'REMOVE': return state.filter(id => id !== action.productId)
    case 'CLEAR': return []
    default: return state
  }
}

function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, [])
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}
```

---

## 5. Buenas Practicas

- **Un archivo por contexto**: `src/contexts/FavoritesContext.tsx` — exporta el Provider y el hook
- **Validar el contexto en el hook**: lanzar error si se usa fuera del Provider
- **Separar contextos por dominio**: no meter todo en un solo `AppContext`
- **No pasar funciones creadas inline al Provider**: usar `useCallback` para estabilizar referencias
- **Nombrar el Provider con sufijo `Provider`**: `FavoritesProvider`, `AuthProvider`, `CartProvider`

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| `useContext` retorna `null` o el valor inicial | Componente fuera del `Provider` | Verificar que el `Provider` envuelve al componente consumidor |
| Re-renders excesivos | El objeto `value` del Provider se recrea en cada render | Usar `useMemo` para el objeto o separar en contextos mas pequeños |
| El contexto no actualiza los consumidores | El `Provider` no envuelve correctamente — Provider y consumidor en ramas distintas | Subir el `Provider` en el arbol |

---

## 7. Relacion con el Proyecto Incremental

En este modulo los favoritos pasan de ser manejados con prop drilling entre `HomePage → ProductList → ProductCard` a ser consumidos directamente en `ProductCard` mediante `useFavorites()`. El modulo elimina las props `favoritos` y `onToggleFavorito` de `ProductList`.

> Ver solucion de referencia en: `react/solver/react-store/src/contexts/FavoritesContext.tsx`

---

## 8. Referencias

- [createContext — React Docs](https://react.dev/reference/react/createContext)
- [useContext — React Docs](https://react.dev/reference/react/useContext)
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [useReducer — React Docs](https://react.dev/reference/react/useReducer)
