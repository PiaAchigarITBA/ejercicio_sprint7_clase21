import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario.model.js'
import Libro from '../models/libro.model.js'
import { crearError } from '../middlewares/errorHandler.js'

export async function registrar(req, res) {
  if (typeof req.body.password !== 'string' || req.body.password.length < 8) {
    throw crearError('La contraseña necesita al menos 8 caracteres', 400)
  }

  const { nombre, email, password } = req.body
  // 🚧 PASO 1 · Guardar la contraseña hasheada
  // Hoy se guarda el texto tal cual. Hasheala con bcrypt (costo 10) y guardá el hash.
  const usuario = await Usuario.create({ nombre, email, password })

  res.status(201).json({
    data: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
    error: null,
  })
}

export async function login(req, res) {
  const { email, password } = req.body
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw crearError('Faltan el email o la contraseña', 400)
  }

  const usuario = await Usuario.findOne({ email }).select('+password')

  // 🚧 PASO 2 · Login y token
  // a. Si no hay usuario o la contraseña no coincide con el hash (bcrypt.compare, ¡con await!),
  //    tirá un 401 con el mensaje 'Email o contraseña incorrectos' (el mismo en los dos casos).
  // b. Firmá un JWT con { id, rol } del usuario, process.env.JWT_SECRET y vencimiento de 1 hora.
  const token = null

  res.json({
    data: { token, usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol } },
    error: null,
  })
}

// Derecho de supresión (art. 16, Ley 25.326): la persona borra su cuenta y sus datos.
export async function borrarCuenta(req, res) {
  await Libro.deleteMany({ lector: req.usuario.id })
  await Usuario.findByIdAndDelete(req.usuario.id)
  res.status(204).end()
}
