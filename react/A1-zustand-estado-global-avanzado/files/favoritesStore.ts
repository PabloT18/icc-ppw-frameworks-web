import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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
