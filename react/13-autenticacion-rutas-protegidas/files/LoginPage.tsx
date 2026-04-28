import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState(false)
    const { login, estaAutenticado } = useAuth()
    const navigate = useNavigate()

    if (estaAutenticado) {
        navigate('/', { replace: true })
        return null
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setCargando(true)

        try {
            await login(username, password)
            navigate('/', { replace: true })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesion')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#111827', fontSize: '1.5rem' }}>Iniciar Sesion</h1>

                {error && (
                    <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="username" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                            Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="emilys"
                            required
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                            Contrasena
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="emilyspass"
                            required
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        style={{
                            background: cargando ? '#93c5fd' : '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.875rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: cargando ? 'default' : 'pointer',
                            marginTop: '0.5rem',
                        }}
                    >
                        {cargando ? 'Iniciando sesion...' : 'Ingresar'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.85rem', marginTop: '1.5rem' }}>
                    Prueba: <strong>emilys</strong> / <strong>emilyspass</strong>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
