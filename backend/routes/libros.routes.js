import { Router } from 'express'
import {
  listarLibros,
  listarMios,
  crearLibro,
  marcarLeido,
  borrarLibro,
} from '../controllers/libros.controller.js'
import { verificarToken, soloRol } from '../middlewares/auth.js'

const router = Router()

router.get('/', listarLibros)
router.get('/mios', verificarToken, listarMios)
// 🚧 PASO 4 · Proteger las rutas. /mios ya está protegida: usala de ejemplo.
// - Crear y marcar como leído: hace falta haber iniciado sesión.
// - Borrar: haber iniciado sesión y, además, ser admin (soloRol ya está hecho).
router.post('/', crearLibro)
router.patch('/:id/leido', marcarLeido)
router.delete('/:id', borrarLibro)

export default router
