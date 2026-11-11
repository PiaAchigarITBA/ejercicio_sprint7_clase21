import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../contexto/AuthContext.jsx'

export function RutaPrivada({ roles }) {
  // 🚧 PASO 3 · a. Leé el usuario con useAuth().
  // - Sin sesión: <Navigate to="/login" replace />
  // - Si recibe roles y el rol del usuario no está: <Navigate to="/" replace />
  // - Si no, <Outlet /> muestra la página.
  return <Outlet />
}
