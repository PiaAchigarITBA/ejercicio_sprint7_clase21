import { createContext, useContext, useState } from 'react'
import { api } from '../servicios/api.js'

const AuthContext = createContext(null)

function leerUsuarioGuardado() {
  const guardado = localStorage.getItem('usuario')
  return guardado ? JSON.parse(guardado) : null
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado)

  async function iniciarSesion(email, password) {
    // 🚧 PASO 2 · a. Hacé el POST a /auth/login con email y password.
    // La respuesta trae data.data.token y data.data.usuario: guardá los dos
    // en localStorage (el usuario con JSON.stringify) y actualizá el estado.
  }

  function cerrarSesion() {
    // 🚧 PASO 2 · b. Borrá 'token' y 'usuario' de localStorage y dejá el estado en null.
  }

  const valor = { usuario, iniciarSesion, cerrarSesion }
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
