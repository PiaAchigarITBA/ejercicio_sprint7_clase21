# 📚 Club de lectura · Ejercicio full-stack - Sprint 7

⏱ **~45 minutos** · Express 5 + Mongoose 9 · bcrypt · jsonwebtoken · Vite + React 19 · React Router · axios · Context API · Node 22.12+ · MongoDB local o Atlas

## La situación

Un club de lectura tiene una API para que cada persona cargue los libros que va leyendo, y un front en React para usarla. Ninguno de los dos tiene seguridad resuelta todavía:

- **Parte 1 · Backend**: las contraseñas se guardan tal cual, el login no da token y cualquiera puede borrar libros.
- **Parte 2 · Frontend**: el front tiene todas las pantallas, pero no sabe nada de la sesión: no manda el token, no guarda quién entró, cualquiera abre Administrar.

Hacé primero la Parte 1. La Parte 2 depende de que el login y el token ya funcionen.

```
backend/    🚧 Parte 1 · PASO 1 a 4 (y plus opcional)
frontend/   🚧 Parte 2 · PASO 1 a 5 (y plus opcional)
```

## Para arrancar

Dos terminales:

```bash
# Terminal 1 · la API
cd backend
npm install
cp .env.example .env     # en Windows: copy .env.example .env  (y poné un JWT_SECRET)
npm run semilla           # 🌱 Ana (admin) y Beto (lector), con 4 libros
npm run dev                # → http://localhost:3000/api/libros

# Terminal 2 · el front
cd frontend
npm install
npm run dev                # → http://localhost:5173
```

| Usuario | Email             | Contraseña    | Rol    |
| ------- | ----------------- | -------------- | ------ |
| Ana     | `ana@club.com`  | `lectura123` | admin  |
| Beto    | `beto@club.com` | `libros123`  | lector |

---

## Parte 1 · Backend (API)

Ya está hecho todo lo demás: modelos, `soloRol`, la semilla, el `.env` y un revisor automático. Completás **5 lugares marcados con 🚧**, sin crear archivos.

```
backend/
├── controllers/auth.controller.js   🚧 PASO 1 y 2
├── middlewares/auth.js              🚧 PASO 3
├── routes/libros.routes.js          🚧 PASO 4
├── controllers/libros.controller.js 🚧 PASO 5
└── middlewares/auth.test.js         ➕ plus opcional
```

En **otra terminal**, cada vez que quieras ver cómo vas:

```bash
cd backend
npm run probar
```

Marca cada revisión con ✅ o ❌ y dice qué falló. Al principio casi todo da ❌. ⚠️ Vuelve a cargar la semilla cada vez.

### 1 · Guardar la contraseña hasheada (`controllers/auth.controller.js`) · ~3 min

Hoy se guarda el texto tal cual. Hasheá la contraseña y guardá el hash.

> 💡 **Pistas**
>
> - `bcrypt.hash(password, 10)` devuelve una promesa: va con `await`.
> - Guardalo en una constante, `hash`, y en `create` usá `password: hash`.

### 2 · Login y token (`controllers/auth.controller.js`) · ~5 min

Compará la contraseña y, si coincide, firmá un token.

> 💡 **Pistas**
>
> - `bcrypt.compare(textoQueEscribió, hashGuardado)` devuelve `true` o `false`, y va con `await`. Sin `await`, entra cualquiera.
> - Si el email no existe, `usuario` es `null`: `const coincide = usuario && await bcrypt.compare(...)`.
> - Si no coincide: `throw crearError('Email o contraseña incorrectos', 401)`. Es el mismo mensaje para los dos casos.
> - `jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' })`. Reemplazá el `null` por eso.

### 3 · Verificar el token (`middlewares/auth.js`) · ~4 min

Ya está hecho leer el header. Falta verificar el token.

> 💡 **Pistas**
>
> - `jwt.verify(token, process.env.JWT_SECRET)` devuelve el payload, o **tira un error** si el token está alterado o vencido.
> - Por eso va en un `try` / `catch`. En el `try`, `req.usuario = jwt.verify(...)`. En el `catch`, `throw crearError('Token inválido o vencido', 401)`.

### 4 · Proteger las rutas (`routes/libros.routes.js`) · ~3 min

`/mios` ya está protegida: copiá cómo se hace.

> 💡 **Pistas**
>
> - El middleware va entre la ruta y el controller: `router.post('/', verificarToken, crearLibro)`.
> - Para borrar, dos middlewares en orden: `verificarToken, soloRol('admin'), borrarLibro`. `verificarToken` va primero porque crea `req.usuario`, que `soloRol` necesita.

### 5 · Cada uno lo suyo (`controllers/libros.controller.js`) · ~5 min

a. Al crear un libro, el dueño (`lector`) tiene que salir del token, no del body: así nadie carga un libro a nombre de otra persona.
b. Marcar como leído: que solo encuentre el libro si, además del id, es del usuario del token.
c. "Mis libros": que traiga solo los del usuario del token, no todos.

> 💡 **Pistas**
>
> - En `crearLibro`, usá `req.usuario.id` como `lector` en vez del que venga en el body.
> - En `marcarLeido`, el filtro de `findOneAndUpdate` pide las dos cosas: `{ _id: req.params.id, lector: req.usuario.id }`. Si el libro es de otra persona, no lo encuentra y devuelve `null`.
> - En `listarMios`, agregale el filtro `{ lector: req.usuario.id }` a `Libro.find(...)`.

**Listo cuando…** `npm run probar` termina con **🎉 14 de 14 revisiones bien**.

#### ➕ Plus opcional · Pruebas con Jest

`middlewares/auth.test.js` ya tiene un test de `soloRol`. Completá el segundo (marcado con 🚧) y corré `npm test`. No hace falta levantar la API.

> 💡 **Pistas**
>
> - Copiá el test que ya está: **preparar** (`req` y `next`), **ejecutar** (`soloRol('admin')(req, {}, next)`) y **verificar** (`expect`).
> - El tuyo usa `rol: 'admin'` y termina con `expect(next).toHaveBeenCalled()`.
> - Cambiá `test.todo('...')` por `test('...', () => { ... })`.

---

## Parte 2 · Frontend

Con la Parte 1 funcionando, la API ya queda protegida (incluida una ruta para borrar la cuenta). Ahora el front en React tiene todas las pantallas, pero no sabe nada de la sesión. Los lugares para completar tienen 🚧. **No hay que crear archivos.**

```
frontend/src/
├── servicios/api.js                  🚧 PASO 1
├── contexto/AuthContext.jsx          🚧 PASO 2
├── componentes/RutaPrivada.jsx       🚧 PASO 3
├── App.jsx                           🚧 PASO 3
├── componentes/Navbar.jsx            🚧 PASO 4
├── paginas/MisLibros.jsx             🚧 PASO 5
└── componentes/Navbar.test.jsx       ➕ plus opcional
```

Probá entrar a **Mis libros**: dice "Falta el token". Es el punto de partida.

### 1 · Mandar el token (`servicios/api.js`) · ~3 min

Agregá un interceptor de request que, si hay un `token` en `localStorage`, lo mande en el header `Authorization: Bearer <token>`.

> 💡 **Pistas**
>
> - `api.interceptors.request.use((config) => { ... })` se ejecuta antes de cada pedido.
> - Adentro, leé `localStorage.getItem('token')`. Si existe, ``config.headers.Authorization = `Bearer ${token}` ``.
> - Siempre terminá con `return config`, o el pedido no sale.

### 2 · Guardar la sesión (`contexto/AuthContext.jsx`) · ~5 min

a. `iniciarSesion`: POST a `/auth/login`, guardá `token` y `usuario` en `localStorage` y actualizá el estado.
b. `cerrarSesion`: borrá las dos cosas y dejá el estado en `null`.
✔️ Ingresá como Beto: Mis libros muestra sus dos libros. Recargá: la sesión sigue.

> 💡 **Pistas**
>
> - `const { data } = await api.post('/auth/login', { email, password })`. Lo que manda la API está en `data.data`: ahí vienen `token` y `usuario`.
> - `localStorage` guarda solo texto: el usuario va con `JSON.stringify(...)`. El token ya es texto.
> - Después, `setUsuario(...)`, para que toda la app se entere.
> - En `cerrarSesion`, `localStorage.removeItem('token')`, lo mismo con `'usuario'`, y `setUsuario(null)`.

### 3 · Rutas privadas (`componentes/RutaPrivada.jsx` y `App.jsx`) · ~5 min

a. Sin sesión, `RutaPrivada` manda a `/login`. Si recibe `roles` y el rol no está, manda a `/`.
b. En `App.jsx`, envolvé `/mis-libros` con `<RutaPrivada />` y `/admin` con `<RutaPrivada roles={['admin']} />`.
✔️ Como Beto, escribí `/admin` en la barra: te devuelve al catálogo.

> 💡 **Pistas**
>
> - `const { usuario } = useAuth()` al principio de `RutaPrivada`.
> - Sin usuario: `return <Navigate to="/login" replace />`.
> - Para el rol: `if (roles && !roles.includes(usuario.rol))`. Si `roles` no se pasó, cualquier usuario con sesión entra.
> - En `App.jsx`, una `<Route element={<RutaPrivada />}>` **sin `path`** envuelve a las rutas que protege: van adentro, como hijas.

### 4 · Menú según quién entró (`componentes/Navbar.jsx`) · ~4 min

Mis libros, solo con sesión. Administrar, solo para `admin`. A la derecha: "Hola, nombre" y **Salir**, o Ingresar y Crear cuenta.

> 💡 **Pistas**
>
> - Importá `useAuth` y sacá `const { usuario, cerrarSesion } = useAuth()`.
> - "Solo si…" se escribe con `&&`: `{usuario && <Link to="/mis-libros">Mis libros</Link>}`.
> - Para el admin: `usuario?.rol === 'admin'`. Sin el `?.`, cuando no hay sesión da error, porque `usuario` es `null`.
> - "Esto o aquello" se escribe con ternario: `{usuario ? (...) : (...)}`. Si son varios elementos, envolvelos en `<>...</>`.

### 5 · Borrar mi cuenta (`paginas/MisLibros.jsx`) · ~3 min

La Ley 25.326 (art. 16) da derecho a pedir que borren tus datos. El botón ya está: hacé que mande `DELETE /auth/cuenta` y, si sale bien, cierre la sesión.
✔️ Creá una cuenta de prueba, cargale un libro y borrala: no podés volver a entrar y el libro desapareció del catálogo.

> 💡 **Pistas**
>
> - `await api.delete('/auth/cuenta')`: no hace falta mandar el id, porque la API sabe quién sos por el token.
> - Si sale bien, `cerrarSesion()`. Ya está disponible arriba: `const { cerrarSesion } = useAuth()`.
> - Envolvelo en `try` / `catch`, y en el `catch` usá `setError(...)`, como en `agregar`.

**Listo cuando…**

- [ ] Sin sesión: el menú muestra Catálogo, Ingresar y Crear cuenta. `/mis-libros` te lleva a Ingresar.
- [ ] Beto ve sus libros, agrega uno y lo marca como leído. No ve Administrar, y `/admin` lo devuelve al catálogo.
- [ ] Ana ve Administrar y puede borrar libros.
- [ ] Al recargar, la sesión sigue. Al tocar Salir, el menú cambia sin recargar.
- [ ] Borrar mi cuenta cierra la sesión, y esa cuenta ya no puede entrar.

#### ➕ Plus opcional · Pruebas con React Testing Library

`componentes/Navbar.test.jsx` ya tiene dos tests de la `Navbar`. Completá el tercero (marcado con 🚧) y corré, en `frontend/`:

```bash
npm test
```

No hace falta levantar la API. Hacelo después del paso 4: hasta entonces, los tests que vienen hechos fallan.

> 💡 **Pistas**
>
> - Copiá la estructura del primer test: `mostrarNavbar(usuario)` y después los `expect`.
> - El usuario es `{ id: '1', nombre: 'Beto', rol: 'lector' }`.
> - Para algo que **tiene** que estar: `screen.getByRole('link', { name: 'Mis libros' })` con `.toBeInTheDocument()`.
> - Para algo que **no** tiene que estar: `screen.queryByRole(...)` con `.not.toBeInTheDocument()`. `getByRole` tira error si no encuentra; `queryByRole` devuelve `null`.
> - Cambiá `test.todo('...')` por `test('...', () => { ... })`.
