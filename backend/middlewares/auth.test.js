// ➕ PLUS OPCIONAL · Pruebas unitarias con Jest (clase 19)
// Se corre con: npm test   (no hace falta levantar la API ni la base)
import { jest } from '@jest/globals'
import { soloRol } from './auth.js'

describe('soloRol', () => {
  test('rechaza a un lector con 403', () => {
    const req = { usuario: { id: '1', rol: 'lector' } }
    const next = jest.fn()

    expect(() => soloRol('admin')(req, {}, next)).toThrow('No tenés permiso')
    expect(next).not.toHaveBeenCalled()
  })

  // 🚧 Plus: escribí este test. Armá un req con rol 'admin', llamá a soloRol('admin')
  // y verificá que next se haya llamado. Después borrá el .todo.
  test.todo('deja pasar a un admin')
})
