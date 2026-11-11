import jwt from 'jsonwebtoken'
import { crearError } from './errorHandler.js'

export function verificarToken(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ')
  if (tipo !== 'Bearer' || !token) throw crearError('Falta el token', 401)

  // 🚧 PASO 3 · Verificar el token
  // Verificalo con jwt.verify y process.env.JWT_SECRET, y guardá lo que devuelve en req.usuario.
  // Si falla (firma alterada o vencido), tirá un 401 'Token inválido o vencido'.

  next()
}

export function soloRol(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) throw crearError('No tenés permiso', 403)
    next()
  }
}
