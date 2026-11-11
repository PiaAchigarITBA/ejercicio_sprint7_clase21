export function TarjetaLibro({ libro, children }) {
  return (
    <article className="libro">
      <div className="datos">
        <h2>{libro.titulo}</h2>
        <p>
          {libro.autor}
          {libro.paginas && ` · ${libro.paginas} páginas`}
          {libro.lector?.nombre && ` · lo cargó ${libro.lector.nombre}`}
          {libro.leido && <span className="leido"> · ✓ leído</span>}
        </p>
      </div>
      {children}
    </article>
  )
}
