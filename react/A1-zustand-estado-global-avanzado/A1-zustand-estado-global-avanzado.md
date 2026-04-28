# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Actividad 1: Zustand — Estado Global Avanzado

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo de la Actividad

Reemplazar el sistema de Context API del modulo 10 con Zustand — una libreria de manejo de estado global minimalista y de alto rendimiento. Implementar un store de favoritos y un store de carrito de compras. Comprender las ventajas de Zustand frente a Context API para estado que cambia frecuentemente.

---

## 2. Por que Zustand?

| Aspecto | Context API | Zustand |
|---|---|---|
| Re-renders | Todos los consumidores del contexto re-renderizan | Solo los componentes que usan el slice que cambio |
| Boilerplate | Alto (createContext, Provider, hook) | Minimo (una funcion `create`) |
| DevTools | No nativo | Compatible con Redux DevTools |
| Async | Manual | Natural en las acciones |
| Selectors | No | Si — solo re-renderiza si el selector cambia |

---

## 3. Anatomia de un Store de Zustand

```ts
import { create } from 'zustand'

interface CounterStore {
  // Estado
  count: number

  // Acciones
  increment: () => void
  decrement: () => void
  reset: () => void
}

const useCounterStore = create<CounterStore>((set) => ({
  // Estado inicial
  count: 0,

  // Acciones — usan `set` para actualizar el estado
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// Uso en componente
function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)

  return <button onClick={increment}>{count}</button>
}
```

---

## 4. Selectors para Optimizacion de Renders

```tsx
// MAL — el componente re-renderiza cuando cualquier parte del store cambia
const store = useCounterStore()

// BIEN — el componente solo re-renderiza cuando `count` cambia
const count = useCounterStore((state) => state.count)

// Selector derivado
const isPositive = useCounterStore((state) => state.count > 0)
```

---

## 5. Middleware `persist` — Persistencia en localStorage

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [] as number[],

      toggleFavorite: (id: number) => {
        const { favoriteIds } = get()
        set({
          favoriteIds: favoriteIds.includes(id)
            ? favoriteIds.filter(f => f !== id)
            : [...favoriteIds, id],
        })
      },

      isFavorite: (id: number) => get().favoriteIds.includes(id),
    }),
    {
      name: 'react-store-favorites', // key en localStorage
    }
  )
)
```

`persist` guarda el estado en localStorage automaticamente y lo recupera al recargar.

---

## 6. Middleware `devtools` — Integracion con Redux DevTools

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (product) => {
          /* ... */
        },
      }),
      { name: 'react-store-cart' }
    ),
    { name: 'CartStore' } // nombre visible en DevTools
  )
)
```

---

## 7. Store del Carrito — Patron Completo

```ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { Product } from '@/types/product.types'

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product) => {
          const { items } = get()
          const existing = items.find(i => i.product.id === product.id)

          if (existing) {
            set({
              items: items.map(i =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            })
          } else {
            set({ items: [...items, { product, quantity: 1 }] })
          }
        },

        removeItem: (productId) =>
          set((state) => ({ items: state.items.filter(i => i.product.id !== productId) })),

        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(productId)
            return
          }
          set((state) => ({
            items: state.items.map(i =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          }))
        },

        clearCart: () => set({ items: [] }),

        totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

        totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      }),
      { name: 'react-store-cart' }
    ),
    { name: 'CartStore' }
  )
)

export default useCartStore
```

---

## 8. Diferencias con Context API

```tsx
// Context API — hay que envolver en Provider
<FavoritesProvider>
  <App />
</FavoritesProvider>

// Zustand — sin Provider, se importa el hook directamente
import { useFavoritesStore } from '@/store/favoritesStore'

function ProductCard({ producto }) {
  const isFavorite = useFavoritesStore(state => state.isFavorite(producto.id))
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite)
  // ...
}
```

---

## 9. Referencias

- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand persist middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Zustand vs Redux vs Context](https://docs.pmnd.rs/zustand/getting-started/comparison)
