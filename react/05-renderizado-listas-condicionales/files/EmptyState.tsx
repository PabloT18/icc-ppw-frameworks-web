interface EmptyStateProps {
    titulo?: string
    descripcion?: string
    icono?: string
}

function EmptyState({
    titulo = 'No hay productos',
    descripcion = 'Prueba con otros terminos de busqueda',
    icono = '🔍',
}: EmptyStateProps) {
    return (
        <div
            style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                color: '#888',
                gridColumn: '1 / -1',
            }}
        >
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{icono}</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#444' }}>{titulo}</h3>
            <p style={{ margin: 0 }}>{descripcion}</p>
        </div>
    )
}

export default EmptyState
