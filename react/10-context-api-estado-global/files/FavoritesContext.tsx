import { createContext, useContext, type ReactNode } from 'react'
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

export function useFavorites() {
    const ctx = useContext(FavoritesContext)
    if (!ctx) throw new Error('useFavorites debe usarse dentro de FavoritesProvider')
    return ctx
}
