import type { Product } from '@/types/product.types'
import ProductCard from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'

interface ProductListProps {
    productos: Product[]
    cargando?: boolean
    busqueda?: string
}

function ProductList({ productos, cargando = false, busqueda = '' }: ProductListProps) {
    if (cargando) {
        return <LoadingSpinner />
    }

    if (productos.length === 0) {
        return (
            <EmptyState
                titulo="Sin resultados"
                descripcion={busqueda ? `No hay productos para "${busqueda}"` : 'No hay productos disponibles'}
                icono={busqueda ? '🔍' : '📦'}
            />
        )
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem',
            }}
        >
            {productos.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

export default ProductList
