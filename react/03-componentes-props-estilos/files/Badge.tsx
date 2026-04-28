interface BadgeProps {
    texto: string
    tipo?: 'categoria' | 'oferta' | 'agotado'
}

function Badge({ texto, tipo = 'categoria' }: BadgeProps) {
    const estilosBase: React.CSSProperties = {
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'capitalize',
    }

    const coloresPorTipo = {
        categoria: { background: '#e8f4fd', color: '#1e6eb0' },
        oferta: { background: '#fde8e8', color: '#b01e1e' },
        agotado: { background: '#f0f0f0', color: '#666' },
    }

    return (
        <span style={{ ...estilosBase, ...coloresPorTipo[tipo] }}>
            {texto}
        </span>
    )
}

export default Badge
