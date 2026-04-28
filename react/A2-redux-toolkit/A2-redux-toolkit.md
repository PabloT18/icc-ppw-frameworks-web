# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Actividad 2: Redux Toolkit — Estado Global con Patron Flux

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo de la Actividad

Implementar el patron de estado global Redux Toolkit (RTK) en ReactStore. Crear slices para productos y favoritos, configurar el store central y conectar los componentes. Comprender el patron Flux (Action → Reducer → Store → View) y las ventajas de RTK sobre Redux clasico.

---

## 2. Redux vs Redux Toolkit

Redux clasico requeria mucho boilerplate: action types como constantes, action creators manuales, reducers con switch/case y spread inmutable. RTK elimina todo eso:

| Redux Clasico | Redux Toolkit |
|---|---|
| `const ADD_ITEM = 'ADD_ITEM'` | Generado automaticamente por `createSlice` |
| Action creators manuales | Generados automaticamente por `createSlice` |
| `switch/case` con spread | `state.items.push(item)` (usa Immer internamente) |
| `applyMiddleware(thunk)` | `configureStore` incluye thunk y devtools |
| Async: redux-saga o thunk manual | `createAsyncThunk` integrado |

---

## 3. El Patron Flux

```
Usuario interactua
       ↓
  dispatch(action)
       ↓
    Reducer procesa
       ↓
    Store actualiza
       ↓
  Componentes re-renderizan
```

En RTK:
```ts
// 1. dispatch
dispatch(fetchProducts())

// 2. createAsyncThunk genera:
//    products/fetchProducts/pending
//    products/fetchProducts/fulfilled
//    products/fetchProducts/rejected

// 3. El slice maneja con extraReducers
builder.addCase(fetchProducts.fulfilled, (state, action) => {
  state.products = action.payload
})

// 4. Componente se suscribe
const products = useSelector(state => state.products.items)
```

---

## 4. `createSlice` — El Nucleo de RTK

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '@/types/product.types'

const productsSlice = createSlice({
  name: 'products',         // prefijo de los action types

  initialState: {
    items: [] as Product[],
    loading: false,
    error: null as string | null,
  },

  reducers: {
    // Reducer sincrono — RTK usa Immer, se puede "mutar" el estado
    clearProducts: (state) => {
      state.items = []
    },
  },

  // Para thunks async
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
        state.error = action.error.message ?? 'Error desconocido'
      })
  },
})

// RTK genera automaticamente:
export const { clearProducts } = productsSlice.actions
export default productsSlice.reducer
```

---

## 5. `createAsyncThunk` — Acciones Asincronas

```ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getProducts } from '@/services/product.service'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',   // nombre del action type
  async (limit: number = 30) => {
    const data = await getProducts(limit)
    return data.products       // lo que retorne va a action.payload en fulfilled
  }
)
```

Genera automaticamente tres action types:
- `products/fetchProducts/pending`
- `products/fetchProducts/fulfilled`
- `products/fetchProducts/rejected`

---

## 6. `configureStore` — El Store Central

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

// Tipos inferidos — usar en toda la app
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

---

## 7. Hooks Tipados

```ts
// src/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Hooks tipados para evitar casteos manuales
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

Uso en componentes:
```tsx
const dispatch = useAppDispatch()
const products = useAppSelector(state => state.products.items)
const loading = useAppSelector(state => state.products.loading)
```

---

## 8. Provider en la App

```tsx
// main.tsx
import { Provider } from 'react-redux'
import { store } from '@/store'

root.render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)
```

El `Provider` hace disponible el store a todos los componentes descendientes. Solo se define una vez en `main.tsx`.

---

## 9. Selectores

```ts
// src/store/productsSlice.ts — selectores exportados
export const selectAllProducts = (state: RootState) => state.products.items
export const selectProductsLoading = (state: RootState) => state.products.loading
export const selectProductsError = (state: RootState) => state.products.error

// selectores derivados con createSelector (memoizados)
import { createSelector } from '@reduxjs/toolkit'

export const selectProductsByCategory = createSelector(
  [selectAllProducts, (_state: RootState, category: string) => category],
  (products, category) => products.filter(p => p.category === category)
)
```

---

## 10. Referencias

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux Toolkit — Quick Start](https://redux-toolkit.js.org/tutorials/quick-start)
- [createSlice API](https://redux-toolkit.js.org/api/createSlice)
- [createAsyncThunk API](https://redux-toolkit.js.org/api/createAsyncThunk)
- [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
