import useLocalStorage from '@/hooks/useLocalStorage'
import useProducts from '@/hooks/useProducts'
import ProductList from '@/components/ProductList'

function FavoritesPage() {
    const { productos, cargando } = useProducts(100)
    const [favoritos, setFavoritos] = useLocalStorage<number[]>('react-store-favoritos', [])

    const toggleFavorito = (id: number) => {
        setFavoritos(
            favoritos.includes(id) ? favoritos.filter(fid => fid !== id) : [...favoritos, id]
        )
    }

    const productosFavoritos = productos.filter(p => favoritos.includes(p.id))

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Mis Favoritos ({productosFavoritos.length})</h2>
            <ProductList
                productos={productosFavoritos}
                cargando={cargando}
                busqueda=""
                favoritos={favoritos}
                onToggleFavorito={toggleFavorito}
            />
        </div>
    )
}

export default FavoritesPage
