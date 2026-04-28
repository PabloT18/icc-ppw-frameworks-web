import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from './favoritesSlice'
import productsReducer from './productsSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
