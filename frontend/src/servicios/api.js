import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// 🚧 PASO 1 · Mandar el token en cada pedido
// Agregá un interceptor de request: si hay un 'token' en localStorage,
// ponelo en el header Authorization con el formato `Bearer <token>`.
