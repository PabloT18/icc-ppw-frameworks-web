import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface AuthUser {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    image: string
    token: string
}

interface AuthContextType {
    usuario: AuthUser | null
    estaAutenticado: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<AuthUser | null>(() => {
        const guardado = localStorage.getItem('auth_user')
        return guardado ? JSON.parse(guardado) : null
    })

    const login = useCallback(async (username: string, password: string) => {
        const res = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        if (!res.ok) {
            const data = await res.json()
            throw new Error(data.message || 'Credenciales incorrectas')
        }

        const data: AuthUser = await res.json()
        setUsuario(data)
        localStorage.setItem('auth_user', JSON.stringify(data))
    }, [])

    const logout = useCallback(() => {
        setUsuario(null)
        localStorage.removeItem('auth_user')
    }, [])

    return (
        <AuthContext.Provider value={{ usuario, estaAutenticado: usuario !== null, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return ctx
}
