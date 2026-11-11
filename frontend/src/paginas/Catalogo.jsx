import { useEffect, useState } from 'react'
import { api } from '../servicios/api.js'
import { TarjetaLibro } from '../componentes/TarjetaLibro.jsx'

export default function Catalogo() {
  const [libros, setLibros] = useState([])

  useEffect(() => {
    api.get('/libros').then(({ data }) => setLibros(data.data))
  }, [])

  return (
    <>
      <h1>Catálogo del club</h1>
      <section className="lista">
        {libros.map((l) => <TarjetaLibro key={l._id} libro={l} />)}
      </section>
    </>
  )
}
