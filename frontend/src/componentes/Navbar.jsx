import { Link } from 'react-router'

// 🚧 PASO 4 · Que el menú dependa de quién entró (usá useAuth):
// - Mis libros: solo con sesión.
// - Administrar: solo si el rol es 'admin'.
// - A la derecha: con sesión, "Hola, {nombre}" y un botón Salir que llame a cerrarSesion;
//   sin sesión, Ingresar y Crear cuenta.
export function Navbar() {
  return (
    <nav>
      <Link to="/">Catálogo</Link>
      <Link to="/mis-libros">Mis libros</Link>
      <Link to="/admin">Administrar</Link>

      <div className="derecha">
        <Link to="/login">Ingresar</Link>
        <Link to="/registro">Crear cuenta</Link>
      </div>
    </nav>
  )
}
