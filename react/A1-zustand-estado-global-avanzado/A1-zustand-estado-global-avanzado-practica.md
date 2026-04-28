# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica A1: Zustand — Estado Global Avanzado

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Instalar Zustand y crear dos stores: `useFavoritesStore` (reemplazando el FavoritesContext del modulo 10) y `useCartStore` (nueva funcionalidad de carrito de compras). Conectar ambos stores a los componentes existentes.

---

## Paso 1: Instalar Zustand

**(copiar)**

```bash
pnpm add zustand
```

**¿Que hace este comando?**
Instala Zustand — solo 1KB de tamano, sin dependencias. La libreria exporta la funcion `create()` que crea un hook de estado global.

---

## Paso 2: Crear el store de favoritos

**(copiar)**

Crear `src/store/favoritesStore.ts`:

```ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface FavoritesStore {
  favoriteIds: number[]
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  devtools(
    persist(
      (set, get) => ({
        favoriteIds: [],

        toggleFavorite: (id: number) => {
          const { favoriteIds } = get()
          set({
            favoriteIds: favoriteIds.includes(id)
              ? favoriteIds.filter((fid) => fid !== id)
              : [...favoriteIds, id],
          })
        },

        isFavorite: (id: number) => get().favoriteIds.includes(id),

        clearFavorites: () => set({ favoriteIds: [] }),
      }),
      { name: 'react-store-favorites' }
    ),
    { name: 'FavoritesStore' }
  )
)
```

**¿Que hace este codigo?**
- `create<FavoritesStore>()` crea el hook tipado con TypeScript
- `persist` guarda el estado en localStorage con la clave `react-store-favorites` y lo restaura al recargar
- `devtools` conecta el store con Redux DevTools Extension del navegador
- `get()` dentro de las acciones da acceso al estado actual sin necesidad de `state`
- `toggleFavorite` agrega o quita el id dependiendo de si ya existe

---

## Paso 3: Migrar `ProductCard` a Zustand

**(completar)**

En `src/components/ProductCard.tsx`, reemplazar el uso de `useFavoritos()` por el store de Zustand:

```tsx
// Antes — Context API
import { useFavoritos } from '@/context/FavoritesContext'

// Despues — Zustand
import { useFavoritesStore } from '@/store/favoritesStore'

function ProductCard({ producto }: { producto: Product }) {
  // TODO A1.1: Usar selectores individuales del store
  // const esFavorito = useFavoritesStore(state => state.isFavorite(producto.id))
  // const toggleFavorite = useFavoritesStore(state => state.toggleFavorite)
  const esFavorito = false   // reemplazar
  const toggleFavorite = (_id: number) => {}  // reemplazar

  // el resto del componente permanece igual
}
```

**¿Que hace este codigo?**
- Los selectores extraen solo el valor que cada componente necesita — si otro producto cambia sus favoritos, este componente no re-renderiza
- `isFavorite(producto.id)` es un selector derivado que retorna boolean directamente

---

## Paso 4: Migrar `FavoritesPage` a Zustand

**(completar)**

En `src/pages/FavoritesPage.tsx`:

```tsx
import { useFavoritesStore } from '@/store/favoritesStore'

export default function FavoritesPage() {
  // TODO A1.2: Obtener favoriteIds del store
  // const favoriteIds = useFavoritesStore(state => state.favoriteIds)
  // const clearFavorites = useFavoritesStore(state => state.clearFavorites)
  const favoriteIds: number[] = []      // reemplazar
  const clearFavorites = () => {}       // reemplazar

  // Usar favoriteIds para filtrar productos (con useProductsQuery del modulo 11)
  // ...
}
```

---

## Paso 5: Crear el store del carrito

**(copiar)**

Crear `src/store/cartStore.ts`:

```ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Product } from '@/types/product.types'

export interface CartItem {
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

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product: Product) => {
          const { items } = get()
          const existing = items.find((i) => i.product.id === product.id)
          if (existing) {
            set({
              items: items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            })
          } else {
            set({ items: [...items, { product, quantity: 1 }] })
          }
        },

        removeItem: (productId: number) =>
          set((state) => ({
            items: state.items.filter((i) => i.product.id !== productId),
          })),

        updateQuantity: (productId: number, quantity: number) => {
          if (quantity <= 0) {
            get().removeItem(productId)
            return
          }
          set((state) => ({
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          }))
        },

        clearCart: () => set({ items: [] }),

        totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

        totalPrice: () =>
          get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      }),
      { name: 'react-store-cart' }
    ),
    { name: 'CartStore' }
  )
)
```

**¿Que hace este codigo?**
- `addItem` verifica si el producto ya esta en el carrito — si es asi, incrementa la cantidad
- `updateQuantity` llama a `removeItem` si la cantidad llega a 0 o menos
- `totalItems` y `totalPrice` son funciones (no valores) porque Zustand no tiene el concepto de "computed" — se calculan en cada llamada usando `get()`
- El carrito persiste en localStorage con la clave `react-store-cart`

---

## Paso 6: Crear el componente `CartButton`

**(completar)**

Crear `src/components/CartButton.tsx`:

```tsx
import { useCartStore } from '@/store/cartStore'

export default function CartButton() {
  // TODO A1.3: Conectar con el store del carrito
  // const totalItems = useCartStore(state => state.totalItems())
  const totalItems = 0  // reemplazar

  return (
    <button
      onClick={() => alert('Carrito: implementar CartPage')}
      style={{ position: 'relative', padding: '0.5rem 1rem' }}
    >
      🛒 Carrito
      {totalItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {totalItems}
        </span>
      )}
    </button>
  )
}
```

**¿Que hace este codigo?**
- Muestra el numero de items en el carrito como badge rojo sobre el icono
- Cuando `totalItems` es 0, el badge no se muestra (`{totalItems > 0 && ...}`)

---

## Paso 7: Agregar "Agregar al carrito" en `ProductDetailPage`

**(completar)**

En `src/pages/ProductDetailPage.tsx`, agregar el boton de agregar al carrito:

```tsx
import { useCartStore } from '@/store/cartStore'

// Dentro del componente:
// TODO A1.4: Obtener addItem del store del carrito
// const addItem = useCartStore(state => state.addItem)

// En el JSX, agregar junto al boton de favoritos:
// <button onClick={() => addItem(producto)}>
//   Agregar al carrito
// </button>
```

---

## Paso 8: Eliminar el Provider de FavoritesContext

**(completar)**

Una vez migrados todos los componentes a Zustand, en `src/main.tsx`:

```tsx
// TODO A1.5: Eliminar FavoritesProvider si todos los componentes usan el store
// Antes:
// <FavoritesProvider>
//   <App />
// </FavoritesProvider>

// Despues — Zustand no requiere Provider:
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
```

**¿Que hace este cambio?**
Zustand no necesita Provider — el store es un singleton del modulo. Esto simplifica `main.tsx` y elimina el anidamiento de Providers.

---

## Verificacion

> Captura pendiente: Redux DevTools Extension mostrando el store `FavoritesStore` con la lista de `favoriteIds`. Captura del store `CartStore` con los items del carrito.

**Checklist:**
- [ ] `pnpm build` pasa sin errores
- [ ] Los favoritos persisten al recargar la pagina (localStorage)
- [ ] El carrito persiste al recargar la pagina (localStorage)
- [ ] En Redux DevTools: ambos stores aparecen (`FavoritesStore`, `CartStore`)
- [ ] El badge del carrito en `CartButton` se actualiza al agregar productos

---

## Commits Sugeridos

```bash
git commit -m "feat: instalar Zustand para estado global"
git commit -m "feat: crear useFavoritesStore con persist y devtools"
git commit -m "feat: crear useCartStore con persist y devtools"
git commit -m "refactor: migrar ProductCard y FavoritesPage a Zustand"
git commit -m "feat: agregar CartButton con badge de cantidad"
```
