// Crea un error con un status HTTP, para tirarlo con throw.
export function crearError(message, status = 500) {
  const error = new Error(message)
  error.status = status
  return error
}

export function errorHandler(err, req, res, next) {
  if (!err.status) console.error(err)

  if (err.name === 'ValidationError') {
    const campos = {}
    for (const [campo, detalle] of Object.entries(err.errors)) {
      campos[campo] = detalle.message
    }
    return res.status(400).json({ data: null, error: { message: 'Hay datos inválidos', campos } })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ data: null, error: { message: `"${err.value}" no es un valor válido para ${err.path}` } })
  }

  if (err.code === 11000) {
    const [campo, valor] = Object.entries(err.keyValue)[0]
    return res.status(409).json({ data: null, error: { message: `Ya existe un registro con ${campo} = ${valor}` } })
  }

  res.status(err.status || 500).json({
    data: null,
    error: { message: err.message || 'Error interno del servidor' },
  })
}
