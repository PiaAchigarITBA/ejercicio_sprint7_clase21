import { useEffect, useState } from 'react'
import { api } from '../servicios/api.js'
import { TarjetaLibro } from '../componentes/TarjetaLibro.jsx'

export default function Admin() {
  const [libros, setLibros] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/libros').then(({ data }) => setLibros(data.data))
  }, [])

  async function borrar(id) {
    try {
      await api.delete(`/libros/${id}`)
      setLibros(libros.filter((l) => l._id !== id))
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'No se pudo borrar')
    }
  }

  return (
    <>
      <h1>Administrar</h1>
      {error && <p className="error">{error}</p>}
      <section className="lista">
        {libros.map((l) => (
          <TarjetaLibro key={l._id} libro={l}>
            <button onClick={() => borrar(l._id)}>Borrar</button>
          </TarjetaLibro>
        ))}
      </section>
    </>
  )
}
