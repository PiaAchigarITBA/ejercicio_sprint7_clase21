import { Schema, model } from 'mongoose'

const usuarioSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // select: false → las consultas no traen la contraseña, salvo que se pida con .select('+password')
  password: { type: String, required: true, select: false },
  rol: { type: String, enum: ['lector', 'admin'], default: 'lector' },
}, { timestamps: true })

export default model('Usuario', usuarioSchema, 'usuarios')
