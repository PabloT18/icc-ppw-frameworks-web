import { useState, useMemo } from 'react'
import type { Product } from '@/types/product.types'

type SortField = 'title' | 'price' | 'rating' | 'stock'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 10

interface Props {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete: (id: number) => void
    isDeleting: boolean
}

export default function ProductsTable({ products, onEdit, onDelete, isDeleting }: Props) {
    const [sortField, setSortField] = useState<SortField>('title')
    const [sortDir, setSortDir] = useState<SortDir>('asc')
    const [page, setPage] = useState(1)

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDir('asc')
            setPage(1)
        }
    }

    const sorted = useMemo(() => {
        return [...products].sort((a, b) => {
            const mult = sortDir === 'asc' ? 1 : -1
            const va = a[sortField]
            const vb = b[sortField]
            if (typeof va === 'string') return va.localeCompare(vb as string) * mult
            return ((va as number) - (vb as number)) * mult
        })
    }, [products, sortField, sortDir])

    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
    const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
        <th
            onClick={() => handleSort(field)}
            style={{ cursor: 'pointer', userSelect: 'none', padding: '0.75rem', whiteSpace: 'nowrap' }}
        >
            {label} {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : ''}
        </th>
    )

    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                        <SortHeader field="title" label="Nombre" />
                        <SortHeader field="price" label="Precio" />
                        <SortHeader field="rating" label="Rating" />
                        <SortHeader field="stock" label="Stock" />
                        <th style={{ padding: '0.75rem' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.75rem' }}>
                                <img
                                    src={p.thumbnail}
                                    alt={p.title}
                                    width={40}
                                    style={{ verticalAlign: 'middle', marginRight: '0.5rem', borderRadius: '4px' }}
                                />
                                {p.title}
                            </td>
                            <td style={{ padding: '0.75rem' }}>${p.price.toFixed(2)}</td>
                            <td style={{ padding: '0.75rem' }}>⭐ {p.rating.toFixed(1)}</td>
                            <td style={{ padding: '0.75rem' }}>{p.stock}</td>
                            <td style={{ padding: '0.75rem' }}>
                                <button onClick={() => onEdit(p)} style={{ marginRight: '0.5rem' }}>
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm(`¿Eliminar "${p.title}"?`)) {
                                            onDelete(p.id)
                                        }
                                    }}
                                    disabled={isDeleting}
                                    style={{ color: 'red' }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    ← Anterior
                </button>
                <span>Pagina {page} de {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                    Siguiente →
                </button>
            </div>
        </div>
    )
}
