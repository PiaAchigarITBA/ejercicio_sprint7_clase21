import Libro from '../models/libro.model.js'
import { crearError } from '../middlewares/errorHandler.js'

export async function listarLibros(req, res) {
  const libros = await Libro.find().sort({ titulo: 1 }).populate('lector', 'nombre')
  res.json({ data: libros, error: null })
}

export async function listarMios(req, res) {
  // 🚧 PASO 5 · c. Hoy trae todos: que traiga solo los del usuario del token.
  const libros = await Libro.find().sort({ titulo: 1 })
  res.json({ data: libros, error: null })
}

export async function crearLibro(req, res) {
  // 🚧 PASO 5 · a. El dueño (lector) tiene que salir del token, no del body.
  const { titulo, autor, paginas, lector } = req.body
  const libro = await Libro.create({ titulo, autor, paginas, lector })
  res.status(201).json({ data: libro, error: null })
}

export async function marcarLeido(req, res) {
  // 🚧 PASO 5 · b. Que solo encuentre el libro si es del usuario del token.
  const libro = await Libro.findByIdAndUpdate(
    req.params.id,
    { leido: true },
    { returnDocument: 'after' },
  )
  if (!libro) throw crearError('No existe o no es tuyo', 404)
  res.json({ data: libro, error: null })
}

export async function borrarLibro(req, res) {
  const libro = await Libro.findByIdAndDelete(req.params.id)
  if (!libro) throw crearError('No existe ese libro', 404)
  res.status(204).end()
}
