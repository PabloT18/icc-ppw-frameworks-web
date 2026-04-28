# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica A2: Redux Toolkit — Estado Global con Patron Flux

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Instalar Redux Toolkit y react-redux. Crear un store con dos slices: `productsSlice` (con thunk asincrono) y `favoritesSlice` (sincrono). Conectar la lista de productos y los favoritos usando `useAppSelector` y `useAppDispatch`.

---

## Paso 1: Instalar Redux Toolkit y react-redux

**(copiar)**

```bash
pnpm add @reduxjs/toolkit react-redux
```

**¿Que hace este comando?**
- `@reduxjs/toolkit` — RTK con `createSlice`, `createAsyncThunk`, `configureStore` y `createSelector`
- `react-redux` — bindings de React: `Provider`, `useSelector`, `useDispatch`

---

## Paso 2: Crear el slice de productos

**(copiar)**

Crear `src/store/productsSlice.ts`:

```ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types/product.types'
import { getProducts } from '@/services/product.service'
import type { RootState } from './index'

// Thunk asincrono para cargar productos
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (limit: number = 30) => {
    const data = await getProducts(limit)
    return data.products
  }
)

interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error al cargar productos'
      })
  },
})

export const { clearProducts } = productsSlice.actions

// Selectores
export const selectAllProducts = (state: RootState) => state.products.items
export const selectProductsLoading = (state: RootState) => state.products.loading
export const selectProductsError = (state: RootState) => state.products.error

export default productsSlice.reducer
```

**¿Que hace este codigo?**
- `createAsyncThunk` crea un thunk que llama a `getProducts` y retorna el array de productos
- RTK usa Immer internamente — en los reducers de `extraReducers` se puede "mutar" `state` directamente
- Los selectores se exportan desde el slice para centralizar la logica de acceso al estado

---

## Paso 3: Crear el slice de favoritos

**(copiar)**

Crear `src/store/favoritesSlice.ts`:

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'

interface FavoritesState {
  ids: number[]
}

const getInitialIds = (): number[] => {
  try {
    const stored = localStorage.getItem('rtk-favorites')
    return stored ? (JSON.parse(stored) as number[]) : []
  } catch {
    return []
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { ids: getInitialIds() } as FavoritesState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const index = state.ids.indexOf(id)
      if (index >= 0) {
        state.ids.splice(index, 1)
      } else {
        state.ids.push(id)
      }
      // Persistir manualmente (RTK no tiene persist integrado)
      localStorage.setItem('rtk-favorites', JSON.stringify(state.ids))
    },
    clearFavorites: (state) => {
      state.ids = []
      localStorage.removeItem('rtk-favorites')
    },
  },
})

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions

// Selectores
export const selectFavoriteIds = (state: RootState) => state.favorites.ids
export const selectIsFavorite = (id: number) => (state: RootState) =>
  state.favorites.ids.includes(id)

export default favoritesSlice.reducer
```

**¿Que hace este codigo?**
- `getInitialIds` lee de localStorage al inicializar el store — recupera favoritos de sesiones anteriores
- Immer permite usar `state.ids.splice` y `state.ids.push` en lugar de spreads inmutables
- `selectIsFavorite` es un selector factory — retorna un selector para un id especifico

---

## Paso 4: Configurar el store central y hooks tipados

**(copiar)**

Crear `src/store/index.ts`:

```ts
import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './productsSlice'
import favoritesReducer from './favoritesSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Crear `src/store/hooks.ts`:

```ts
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

**¿Que hace este codigo?**
- `RootState` y `AppDispatch` se infieren automaticamente del store — no hay que mantenerlos manualmente
- Los hooks tipados `useAppDispatch` y `useAppSelector` dan autocompletado de TypeScript para el estado del store

---

## Paso 5: Agregar el Provider en `main.tsx`

**(completar)**

En `src/main.tsx`, envolver la app con el `Provider` de Redux:

```tsx
import { Provider } from 'react-redux'
import { store } from '@/store'

// TODO A2.1: Agregar Provider como primer wrapper
root.render(
  <StrictMode>
    {/* <Provider store={store}> */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    {/* </Provider> */}
  </StrictMode>
)
```

**¿Que hace este cambio?**
El `Provider` hace disponible el store de Redux a todos los componentes descendientes. Debe ser el wrapper exterior para que todos los otros providers y componentes puedan acceder al estado.

---

## Paso 6: Conectar la lista de productos

**(completar)**

En `src/pages/HomePage.tsx`, reemplazar el hook de TanStack Query por Redux:

```tsx
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProducts, selectAllProducts, selectProductsLoading, selectProductsError } from '@/store/productsSlice'

export default function HomePage() {
  const dispatch = useAppDispatch()

  // TODO A2.2: Despachar fetchProducts al montar y suscribirse al estado
  // useEffect(() => {
  //   dispatch(fetchProducts(30))
  // }, [dispatch])
  //
  // const products = useAppSelector(selectAllProducts)
  // const loading = useAppSelector(selectProductsLoading)
  // const error = useAppSelector(selectProductsError)

  const products = []       // reemplazar
  const loading = false     // reemplazar
  const error = null        // reemplazar

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="grid">
      {products.map(p => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}
```

---

## Paso 7: Conectar favoritos con Redux

**(completar)**

En `src/components/ProductCard.tsx`:

```tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleFavorite, selectIsFavorite } from '@/store/favoritesSlice'

function ProductCard({ producto }: { producto: Product }) {
  const dispatch = useAppDispatch()

  // TODO A2.3: Usar selector y dispatcher de Redux para favoritos
  // const esFavorito = useAppSelector(selectIsFavorite(producto.id))
  // const handleToggle = () => dispatch(toggleFavorite(producto.id))

  const esFavorito = false
  const handleToggle = () => {}

  return (
    <div>
      {/* ... contenido del card ... */}
      <button onClick={handleToggle}>
        {esFavorito ? '❤️' : '🤍'}
      </button>
    </div>
  )
}
```

---

## Verificacion con Redux DevTools

> Captura pendiente: Redux DevTools Extension mostrando el state tree con `products.items` y `favorites.ids`. Captura del action log mostrando `products/fetchProducts/pending` → `products/fetchProducts/fulfilled`.

**Checklist:**
- [ ] `pnpm build` pasa sin errores de TypeScript
- [ ] Los productos cargan desde la API al montar `HomePage`
- [ ] En DevTools: el action `products/fetchProducts/fulfilled` aparece en el log
- [ ] El state tree muestra `products.items` con el array de productos
- [ ] Hacer clic en favoritos despacha `favorites/toggleFavorite`
- [ ] Los favoritos se guardan en `localStorage` (clave `rtk-favorites`)

---

## Comparacion Final: Context API vs Zustand vs Redux Toolkit

| Criterio | Context API | Zustand | Redux Toolkit |
|---|---|---|---|
| Boilerplate | Medio | Minimo | Bajo (con RTK) |
| DevTools | No | Si (Redux DevTools) | Si (Redux DevTools) |
| Async | Manual | Natural | createAsyncThunk |
| TypeScript | Manual | Excelente | Excelente |
| Tamano bundle | 0 (nativo) | ~1KB | ~11KB |
| Curva aprendizaje | Baja | Muy baja | Media |
| Ideal para | Temas, auth | Apps medianas | Apps grandes / equipos |

---

## Commits Sugeridos

```bash
git commit -m "feat: instalar @reduxjs/toolkit y react-redux"
git commit -m "feat: crear productsSlice con fetchProducts thunk"
git commit -m "feat: crear favoritesSlice con persistencia en localStorage"
git commit -m "feat: configurar store central e index.ts con RootState/AppDispatch"
git commit -m "refactor: conectar HomePage y ProductCard con Redux store"
```
