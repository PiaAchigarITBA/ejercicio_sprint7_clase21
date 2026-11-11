// ➕ PLUS OPCIONAL · Pruebas con React Testing Library (clase 19)
// Se corre con: npm test   (no hace falta levantar la API)
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../contexto/AuthContext.jsx'
import { Navbar } from './Navbar.jsx'

function mostrarNavbar(usuario) {
  if (usuario) localStorage.setItem('usuario', JSON.stringify(usuario))
  render(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => localStorage.clear())

test('sin sesión muestra Ingresar y no Mis libros', () => {
  mostrarNavbar(null)
  expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Mis libros' })).not.toBeInTheDocument()
})

// 🚧 Plus: escribí este test, con un usuario de rol 'lector'.
// Tiene que ver el link Mis libros y NO el link Administrar (usá queryByRole).
// Después borrá el .todo.
test.todo('un lector ve Mis libros, pero no Administrar')

test('al tocar Salir vuelve a mostrar Ingresar', async () => {
  mostrarNavbar({ id: '2', nombre: 'Ana', rol: 'admin' })
  await userEvent.click(screen.getByRole('button', { name: 'Salir' }))
  expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument()
})
