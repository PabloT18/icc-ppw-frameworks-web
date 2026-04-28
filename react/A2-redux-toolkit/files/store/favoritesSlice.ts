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
      localStorage.setItem('rtk-favorites', JSON.stringify(state.ids))
    },
    clearFavorites: (state) => {
      state.ids = []
      localStorage.removeItem('rtk-favorites')
    },
  },
})

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions

export const selectFavoriteIds = (state: RootState) => state.favorites.ids
export const selectIsFavorite = (id: number) => (state: RootState) =>
  state.favorites.ids.includes(id)

export default favoritesSlice.reducer
