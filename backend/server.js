import express from 'express'
import { conectarDB } from './config/db.js'
import authRouter from './routes/auth.routes.js'
import librosRouter from './routes/libros.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/libros', librosRouter)

app.use(errorHandler)

const PORT = process.env.PORT ?? 3000

await conectarDB()

app.listen(PORT, () => {
  console.log(`🚀 API en http://localhost:${PORT}/api/libros`)
})
