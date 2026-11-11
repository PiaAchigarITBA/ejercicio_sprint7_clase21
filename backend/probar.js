// Revisa cada paso del ejercicio contra la API. Ya viene hecho: no hace falta tocarlo.
// Uso: con la API levantada (npm run dev), en otra terminal: npm run probar
// ⚠️ Vuelve a cargar la semilla: borra los usuarios y libros que hayas creado.
import mongoose from 'mongoose'
import Usuario from './models/usuario.model.js'
import Libro from './models/libro.model.js'
import { cargarDatos } from './datos.js'

const API = `http://localhost:${process.env.PORT ?? 3000}/api`
let ok = 0
let total = 0

async function pedir(metodo, ruta, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(API + ruta, { method: metodo, headers, body: body && JSON.stringify(body) })
  const texto = await res.text()
  let json = null
  try { json = JSON.parse(texto) } catch {}
  return { status: res.status, json }
}

async function revisar(descripcion, prueba) {
  total++
  try {
    const motivo = await prueba()
    if (motivo) throw new Error(motivo)
    ok++
    console.log(`  ✅ ${descripcion}`)
  } catch (err) {
    console.log(`  ❌ ${descripcion}\n     → ${err.message}`)
  }
}

const tokenDe = async (email, password) => (await pedir('POST', '/auth/login', { body: { email, password } })).json?.data?.token
const payload = (token) => JSON.parse(Buffer.from(token.split('.')[1], 'base64url'))

try {
  await fetch(API + '/libros')
} catch {
  console.log('🔴 La API no responde. Levantala con npm run dev en otra terminal.')
  process.exit(1)
}

await mongoose.connect(process.env.MONGODB_URI)
const { ana, beto } = await cargarDatos()

console.log('\nPASO 1 · Registro seguro')
await revisar('el registro responde 201 y sin la contraseña', async () => {
  const r = await pedir('POST', '/auth/registro', { body: { nombre: 'Caro', email: 'caro@club.com', password: 'cuentos123', rol: 'admin' } })
  if (r.status !== 201) return `respondió ${r.status}: ${r.json?.error?.message}`
  if (JSON.stringify(r.json).includes('cuentos123')) return 'la respuesta trae la contraseña'
})
await revisar('la contraseña se guarda hasheada con bcrypt', async () => {
  const caro = await Usuario.findOne({ email: 'caro@club.com' }).select('+password')
  if (!caro) return 'no se guardó el usuario'
  if (!caro.password.startsWith('$2')) return `se guardó "${caro.password}": tiene que ser un hash $2b$10$...`
})
console.log('\nPASO 2 · Login y token')
await revisar('una contraseña incorrecta da 401', async () => {
  const r = await pedir('POST', '/auth/login', { body: { email: 'ana@club.com', password: 'otra' } })
  if (r.status !== 401) return `respondió ${r.status}`
})
await revisar('un email que no existe da 401 con el mismo mensaje', async () => {
  const a = await pedir('POST', '/auth/login', { body: { email: 'ana@club.com', password: 'otra' } })
  const b = await pedir('POST', '/auth/login', { body: { email: 'nadie@club.com', password: 'otra' } })
  if (b.status !== 401) return `respondió ${b.status}`
  if (a.json?.error?.message !== b.json?.error?.message) return 'los mensajes son distintos: así se puede averiguar qué emails existen'
})
await revisar('el login correcto devuelve un token con id y rol', async () => {
  const token = await tokenDe('ana@club.com', 'lectura123')
  if (typeof token !== 'string' || token.split('.').length !== 3) return `el token es ${token}`
  const p = payload(token)
  if (!p.id || p.rol !== 'admin' || !p.exp) return `el payload es ${JSON.stringify(p)}: falta id, rol o vencimiento`
})

console.log('\nPASO 3 · verificarToken')
await revisar('sin token, "mis libros" da 401', async () => {
  const r = await pedir('GET', '/libros/mios')
  if (r.status !== 401) return `respondió ${r.status}`
})
await revisar('con un token alterado da 401', async () => {
  const token = await tokenDe('beto@club.com', 'libros123')
  const r = await pedir('GET', '/libros/mios', { token: token + 'x' })
  if (r.status !== 401) return `respondió ${r.status}`
})
await revisar('con un token válido deja pasar (200)', async () => {
  const token = await tokenDe('beto@club.com', 'libros123')
  const r = await pedir('GET', '/libros/mios', { token })
  if (r.status !== 200) return `respondió ${r.status}: ${r.json?.error?.message}`
})

console.log('\nPASO 4 · Rutas protegidas')
await revisar('sin token, crear un libro da 401', async () => {
  const r = await pedir('POST', '/libros', { body: { titulo: 'X', autor: 'Y' } })
  if (r.status !== 401) return `respondió ${r.status}`
})
await revisar('un lector no puede borrar (403)', async () => {
  const token = await tokenDe('beto@club.com', 'libros123')
  const libro = await Libro.findOne({ lector: ana._id })
  const r = await pedir('DELETE', `/libros/${libro._id}`, { token })
  if (r.status !== 403) return `respondió ${r.status}`
})
await revisar('un admin sí puede borrar (204)', async () => {
  const token = await tokenDe('ana@club.com', 'lectura123')
  const libro = await Libro.findOne({ lector: beto._id })
  const r = await pedir('DELETE', `/libros/${libro._id}`, { token })
  if (r.status !== 204) return `respondió ${r.status}`
})

await cargarDatos()
await mongoose.disconnect()
console.log(`\n${ok === total ? '🎉' : '📋'} ${ok} de ${total} revisiones bien. La base quedó como la deja la semilla.`)
