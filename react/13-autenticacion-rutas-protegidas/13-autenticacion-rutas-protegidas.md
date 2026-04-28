# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 13: Autenticacion y Rutas Protegidas

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Implementar autenticacion con JWT usando la API de DummyJSON. Crear un `AuthContext` que gestione el usuario y el token, proteger rutas con un componente `PrivateRoute`, y construir un formulario de login que redirige al usuario tras autenticarse correctamente.

---

## 2. Flujo de Autenticacion en una SPA

```
Usuario llena el formulario → POST /auth/login → API retorna { token, refreshToken }
→ Guardar token en localStorage
→ Incluir token en Authorization: Bearer <token> en peticiones posteriores
→ Al navegar a ruta protegida: verificar token → si no hay, redirigir a /login
→ Al cerrar sesion: eliminar token y redirigir a /login
```

El token JWT (JSON Web Token) es un string codificado en base64 con tres partes:
```
header.payload.signature
```

La aplicacion frontend **no valida la firma** (eso lo hace el servidor). Solo lo usa para enviarlo en el header `Authorization`.

---

## 3. API de DummyJSON para Autenticacion

```
POST https://dummyjson.com/auth/login
Content-Type: application/json

{
  "username": "emilys",
  "password": "emilyspass"
}
```

Respuesta:
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "image": "https://dummyjson.com/icon/emilys/128",
  "token": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

Otros usuarios disponibles en DummyJSON: `michaelw`/`michaelwpass`, `sophiab`/`sophiabpass`

---

## 4. AuthContext — Gestion Global del Usuario

El patron es identico al `FavoritesContext` del modulo 10, pero con la logica de login/logout:

```tsx
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
    // Recuperar usuario de localStorage al iniciar la app
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
```

---

## 5. PrivateRoute — Proteccion de Rutas

```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function PrivateRoute() {
  const { estaAutenticado } = useAuth()
  
  // Si no esta autenticado, redirigir a /login
  // 'replace' evita que /login quede en el historial de navegacion
  return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
```

Uso en `App.tsx`:

```tsx
<Routes>
  <Route element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path="products/:id" element={<ProductDetailPage />} />
    
    {/* Rutas protegidas — requieren login */}
    <Route element={<PrivateRoute />}>
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>
  </Route>
  <Route path="login" element={<LoginPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

---

## 6. Manejo de Errores en Login

```tsx
const [error, setError] = useState<string | null>(null)
const [cargando, setCargando] = useState(false)
const { login } = useAuth()
const navigate = useNavigate()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  setCargando(true)
  
  try {
    await login(usuario, contrasena)
    navigate('/', { replace: true }) // redirigir al home tras login exitoso
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error al iniciar sesion')
  } finally {
    setCargando(false)
  }
}
```

---

## 7. Enviar el Token en Peticiones Autenticadas

Para endpoints que requieren autenticacion en DummyJSON:

```tsx
const token = JSON.parse(localStorage.getItem('auth_user') ?? '{}')?.token

const res = await fetch('https://dummyjson.com/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
```

O centralizar en el servicio:

```tsx
function getAuthHeaders(): HeadersInit {
  const user = localStorage.getItem('auth_user')
  if (!user) return {}
  const { token } = JSON.parse(user)
  return { 'Authorization': `Bearer ${token}` }
}
```

---

## 8. Seguridad Importante

- Nunca guardar el token en una variable de estado visible en el DevTools de React — usar `localStorage` o `sessionStorage`
- No loggear tokens en consola
- Verificar `res.ok` antes de parsear la respuesta — DummyJSON devuelve 400 con `{ message: 'Invalid credentials' }` si las credenciales son incorrectas
- Los tokens de DummyJSON expiran — en produccion real, se necesita el `refreshToken` para obtener uno nuevo

---

## 9. Referencias

- [React Router — Rutas Protegidas](https://reactrouter.com/en/main/start/tutorial#protecting-routes)
- [DummyJSON Auth Docs](https://dummyjson.com/docs/auth)
- [JWT.io — Decodificador de tokens](https://jwt.io/)
- [localStorage vs cookies para tokens](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
