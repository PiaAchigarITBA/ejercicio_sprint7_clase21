import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // El front pide /api/... a su mismo origen y Vite lo reenvía a la API (3000): no hay CORS.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  // Para el plus opcional de pruebas (npm test)
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
