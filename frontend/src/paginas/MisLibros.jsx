import { useEffect, useState } from 'react'
import { api } from '../servicios/api.js'
import { useAuth } from '../contexto/AuthContext.jsx'
import { TarjetaLibro } from '../componentes/TarjetaLibro.jsx'

export default function MisLibros() {
  const { cerrarSesion } = useAuth()
  const [libros, setLibros] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/libros/mios')
      .then(({ data }) => setLibros(data.data))
      .catch((err) => setError(err.response?.data?.error?.message ?? 'No se pudo cargar'))
  }, [])

  async function agregar(e) {
    e.preventDefault()
    const datos = new FormData(e.target)
    try {
      const { data } = await api.post('/libros', {
        titulo: datos.get('titulo'),
        autor: datos.get('autor'),
        paginas: datos.get('paginas') || undefined,
      })
      setLibros([...libros, data.data])
      e.target.reset()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'No se pudo agregar')
    }
  }

  async function marcarLeido(id) {
    try {
      const { data } = await api.patch(`/libros/${id}/leido`)
      setLibros(libros.map((l) => (l._id === id ? data.data : l)))
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'No se pudo actualizar')
    }
  }

  async function borrarCuenta() {
    if (!confirm('¿Seguro? Se borran tu cuenta y tus libros, y no se puede deshacer.')) return
    // 🚧 PASO 5 · Derecho de supresión (art. 16, Ley 25.326)
    // Mandá DELETE a /auth/cuenta. Si sale bien, cerrá la sesión.
    // Si falla, mostrá el mensaje con setError.
  }

  return (
    <>
      <h1>Mis libros</h1>
      <form className="linea" onSubmit={agregar}>
        <input name="titulo" placeholder="Título" required />
        <input name="autor" placeholder="Autor" required />
        <input name="paginas" type="number" min="1" placeholder="Páginas" />
        <button className="primario">Agregar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {libros.length === 0 && <p className="vacio">Todavía no cargaste libros.</p>}
      <section className="lista">
        {libros.map((l) => (
          <TarjetaLibro key={l._id} libro={l}>
            {!l.leido && <button onClick={() => marcarLeido(l._id)}>Ya lo leí</button>}
          </TarjetaLibro>
        ))}
      </section>
      <button className="peligro" onClick={borrarCuenta}>Borrar mi cuenta</button>
    </>
  )
}
