import mongoose from 'mongoose'

export async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`🟢 MongoDB conectado · base: ${mongoose.connection.name}`)
  } catch (err) {
    console.error('🔴 No se pudo conectar a MongoDB:', err.message)
    process.exit(1)
  }
}
