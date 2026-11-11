import { Router } from 'express'
import { registrar, login, borrarCuenta } from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/auth.js'

const router = Router()

router.post('/registro', registrar)
router.post('/login', login)
router.delete('/cuenta', verificarToken, borrarCuenta)

export default router
