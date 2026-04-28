import { useState, useEffect } from 'react'
import type { Product } from '@/types/product.types'

interface Props {
    producto: Product | null
    onClose: () => void
    onSave: (data: Partial<Product>) => void
    isPending: boolean
}

export default function EditProductModal({ producto, onClose, onSave, isPending }: Props) {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [stock, setStock] = useState(0)

    useEffect(() => {
        if (producto) {
            setTitle(producto.title)
            setPrice(producto.price)
            setDescription(producto.description)
            setStock(producto.stock)
        }
    }, [producto])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ title, price, description, stock })
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '8px',
                    width: '480px',
                    maxWidth: '90vw',
                }}
            >
                <h2>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label>
                        Nombre
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </label>

                    <label>
                        Precio (USD)
                        <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            required
                            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </label>

                    <label>
                        Stock
                        <input
                            type="number"
                            min={0}
                            value={stock}
                            onChange={(e) => setStock(Number(e.target.value))}
                            required
                            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </label>

                    <label>
                        Descripcion
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </label>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={isPending}>
                            {isPending ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
