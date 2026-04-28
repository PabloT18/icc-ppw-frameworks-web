import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getProductById } from '@/services/product.service'
import type { Product } from '@/types/product.types'

function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [producto, setProducto] = useState<Product | null>(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        setCargando(true)
        getProductById(Number(id))
            .then(setProducto)
            .catch(() => setError('Producto no encontrado'))
            .finally(() => setCargando(false))
    }, [id])

    if (cargando) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>

    if (error || !producto) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#dc2626' }}>{error}</p>
                <button onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
                    Volver
                </button>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    color: '#2563eb',
                    fontWeight: 600,
                    fontSize: '1rem',
                }}
            >
                ← Volver
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <img
                    src={producto.thumbnail}
                    alt={producto.title}
                    style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '1' }}
                />
                <div>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'capitalize' }}>
                        {producto.category}
                    </span>
                    <h1 style={{ margin: '0.5rem 0 1rem', fontSize: '1.5rem' }}>{producto.title}</h1>
                    <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{producto.description}</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb', margin: '1rem 0' }}>
                        ${producto.price.toFixed(2)}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                        <span>★ {producto.rating.toFixed(1)}</span>
                        <span>{producto.stock} en stock</span>
                        <span>-{producto.discountPercentage.toFixed(0)}% dto.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage
