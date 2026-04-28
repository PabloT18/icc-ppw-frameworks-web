import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function PrivateRoute() {
    const { estaAutenticado } = useAuth()
    return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
