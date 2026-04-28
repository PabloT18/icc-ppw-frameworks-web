# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 13: Autenticacion y Rutas Protegidas

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Implementar un sistema de autenticacion completo en ReactStore: `AuthContext` con login/logout usando DummyJSON, formulario de login, componente `PrivateRoute` para proteger `/favorites`, y boton de logout en el header.

---

## Archivos que se van a crear o modificar

```
src/
├── main.tsx                         (modificado — AuthProvider)
├── App.tsx                          (modificado — rutas protegidas)
├── contexts/
│   └── AuthContext.tsx              (nuevo — desde files/)
├── pages/
│   └── LoginPage.tsx                (nuevo — desde files/)
├── components/
│   └── PrivateRoute.tsx             (nuevo — desde files/)
└── layouts/
    └── MainLayout.tsx               (modificado — boton logout)
```

---

## Paso 1: Crear `AuthContext`

**(copiar — desde `files/`)**

Crear `src/contexts/AuthContext.tsx`:

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

**¿Que hace este codigo?**
- El estado inicial de `usuario` usa una funcion de inicializacion lazy para leer `localStorage` una sola vez al montar
- `login` hace `POST /auth/login`, lanza un `Error` si la respuesta no es ok (para capturar en el formulario), guarda el usuario en localStorage
- `logout` limpia el estado y localStorage
- `useAuth()` lanza si se usa fuera del Provider — garantia en tiempo de ejecucion

---

## Paso 2: Crear `LoginPage`

**(copiar — desde `files/`)**

Crear `src/pages/LoginPage.tsx`:

```tsx
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

  // Si ya esta autenticado, ir al home
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
```

**¿Que hace este codigo?**
- Si el usuario ya esta autenticado al entrar a `/login`, redirige al home — evita mostrar el login a usuarios que ya iniciaron sesion
- `handleSubmit` llama `login()` del contexto, captura el error si falla y lo muestra en el formulario
- Los credenciales de prueba estan visibles debajo del formulario para facilitar el testing en ambiente educativo

---

## Paso 3: Crear `PrivateRoute`

**(copiar — desde `files/`)**

Crear `src/components/PrivateRoute.tsx`:

```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function PrivateRoute() {
  const { estaAutenticado } = useAuth()
  return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
```

**¿Que hace este codigo?**
- Si `estaAutenticado` es true, renderiza `<Outlet />` — los hijos anidados en la ruta
- Si no, `<Navigate to="/login" replace />` redirige al login sin dejar la ruta protegida en el historial
- Este componente se coloca como `element` de una ruta padre en `App.tsx`

---

## Paso 4: Registrar `AuthProvider` en `main.tsx`

**(copiar)**

```tsx
import { AuthProvider } from '@/contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>           {/* AuthProvider antes del FavoritesProvider */}
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
```

---

## Paso 5: Configurar rutas protegidas en `App.tsx`

**(copiar)**

```tsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import MainLayout from '@/layouts/MainLayout'
import PrivateRoute from '@/components/PrivateRoute'
import HomePage from '@/pages/HomePage'

const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <>
      <Suspense fallback={<div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>Cargando...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />

            {/* Ruta protegida */}
            <Route element={<PrivateRoute />}>
              <Route path="favorites" element={<FavoritesPage />} />
            </Route>
          </Route>

          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
```

---

## Paso 6: Agregar boton de logout en `MainLayout`

**(completar)**

Modificar `src/layouts/MainLayout.tsx`:

```tsx
import { useAuth } from '@/contexts/AuthContext'

// Dentro del componente MainLayout
const { estaAutenticado, usuario, logout } = useAuth()

// TODO 6.1: En el header, mostrar condicionalmente el usuario y boton de logout
{estaAutenticado ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <img src={usuario?.image} alt={usuario?.firstName} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
    <span style={{ fontSize: '0.9rem', color: '#374151' }}>{usuario?.firstName}</span>
    <button
      onClick={logout}
      style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
    >
      Salir
    </button>
  </div>
) : (
  // TODO 6.2: Mostrar NavLink a /login cuando no hay sesion
  <NavLink to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Ingresar</NavLink>
)}
```

> Captura pendiente: header mostrando la foto y nombre de usuario (Emily Johnson) con boton rojo "Salir". Luego de hacer logout, muestra el link "Ingresar".

---

## Validaciones Esperadas

- [ ] Al ingresar a `/favorites` sin sesion, redirige a `/login`
- [ ] Login con `emilys`/`emilyspass` funciona y redirige al home
- [ ] Login con credenciales incorrectas muestra el mensaje de error
- [ ] Recargar la pagina mantiene la sesion (se lee de localStorage)
- [ ] El boton "Salir" cierra la sesion y redirige si se intenta acceder a rutas protegidas

---

## Entregables

- `src/contexts/AuthContext.tsx`
- `src/pages/LoginPage.tsx`
- `src/components/PrivateRoute.tsx`
- `src/main.tsx` con `AuthProvider`
- `src/App.tsx` con ruta protegida
- `src/layouts/MainLayout.tsx` con logout

---

## Commits Sugeridos

```bash
git commit -m "feat: crear AuthContext con login/logout usando DummyJSON"
git commit -m "feat: crear LoginPage con formulario controlado"
git commit -m "feat: crear PrivateRoute para rutas protegidas"
git commit -m "feat: integrar AuthProvider en main.tsx y rutas en App.tsx"
git commit -m "feat: agregar boton de logout y avatar en MainLayout"
```
