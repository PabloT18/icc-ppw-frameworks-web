import { useState } from 'react'

interface CounterProps {
    inicial?: number
    paso?: number
}

function Counter({ inicial = 0, paso = 1 }: CounterProps) {
    const [cuenta, setCuenta] = useState(inicial)

    const incrementar = () => setCuenta(prev => prev + paso)
    const decrementar = () => setCuenta(prev => prev - paso)
    const reiniciar = () => setCuenta(inicial)

    return (
        <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'inline-block' }}>
            <p style={{ fontSize: '3rem', fontWeight: 700, margin: 0, color: cuenta < 0 ? '#dc2626' : '#111' }}>
                {cuenta}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button onClick={decrementar}>-</button>
                <button onClick={reiniciar} style={{ background: '#6b7280', color: 'white' }}>Reset</button>
                <button onClick={incrementar}>+</button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                Paso: {paso}
            </p>
        </div>
    )
}

export default Counter
