interface LoadingSpinnerProps {
    mensaje?: string
}

function LoadingSpinner({ mensaje = 'Cargando productos...' }: LoadingSpinnerProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5rem',
                gap: '1rem',
                color: '#888',
                gridColumn: '1 / -1',
            }}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #2563eb',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
            <p style={{ margin: 0 }}>{mensaje}</p>
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

export default LoadingSpinner
