import Libro from '../models/libro.model.js'
import { crearError } from '../middlewares/errorHandler.js'

export async function listarLibros(req, res) {
  const libros = await Libro.find().sort({ titulo: 1 }).populate('lector', 'nombre')
  res.json({ data: libros, error: null })
}

export async function listarMios(req, res) {
  const libros = await Libro.find({ lector: req.usuario.id }).sort({ titulo: 1 })
  res.json({ data: libros, error: null })
}

export async function crearLibro(req, res) {
  const { titulo, autor, paginas } = req.body
  const libro = await Libro.create({ titulo, autor, paginas, lector: req.usuario.id })
  res.status(201).json({ data: libro, error: null })
}

export async function marcarLeido(req, res) {
  const libro = await Libro.findOneAndUpdate(
    { _id: req.params.id, lector: req.usuario.id },
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
