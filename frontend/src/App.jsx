import { Routes, Route } from 'react-router'
import { Navbar } from './componentes/Navbar.jsx'
import { RutaPrivada } from './componentes/RutaPrivada.jsx'
import Catalogo from './paginas/Catalogo.jsx'
import Login from './paginas/Login.jsx'
import Registro from './paginas/Registro.jsx'
import MisLibros from './paginas/MisLibros.jsx'
import Admin from './paginas/Admin.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* 🚧 PASO 3 · b. Envolvé /mis-libros con <RutaPrivada /> y /admin con <RutaPrivada roles={['admin']} /> */}
          <Route path="/mis-libros" element={<MisLibros />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  )
}
