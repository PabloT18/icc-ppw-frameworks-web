# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 4: Eventos y Estado con useState

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Agregar interactividad a los componentes de React mediante el manejo de eventos sinteticos y el hook `useState` para gestionar el estado local. Al finalizar, los componentes reaccionaran a las acciones del usuario y actualizaran la UI de forma automatica.

---

## 2. Explicacion Conceptual

### Que es el estado?

El **estado** es informacion que el componente gestiona internamente y que puede cambiar con el tiempo como respuesta a acciones del usuario, respuestas de una API, timers, etc.

Cuando el estado cambia, React vuelve a renderizar el componente automaticamente para reflejar el nuevo estado en la UI — sin necesidad de manipular el DOM manualmente.

```tsx
// Sin estado — solo muestra datos, no reacciona al usuario
function Contador() {
  let cuenta = 0

  function incrementar() {
    cuenta++ // ❌ Esto cambia la variable pero NO actualiza la UI
    console.log(cuenta) // el valor cambia en memoria pero React no lo sabe
  }

  return (
    <div>
      <p>{cuenta}</p>
      <button onClick={incrementar}>Incrementar</button>
    </div>
  )
}

// Con estado — React re-renderiza cuando cambia
function Contador() {
  const [cuenta, setCuenta] = useState(0) // ✅

  function incrementar() {
    setCuenta(cuenta + 1) // React sabe que el estado cambio y re-renderiza
  }

  return (
    <div>
      <p>{cuenta}</p>
      <button onClick={incrementar}>Incrementar</button>
    </div>
  )
}
```

### El hook `useState`

```tsx
const [estado, setEstado] = useState(valorInicial)
```

- `useState(valorInicial)` — inicializa el estado con un valor
- `estado` — el valor actual (no mutable directamente)
- `setEstado` — funcion para actualizar el estado; cada llamada dispara un re-render
- La desestructuracion `[estado, setEstado]` es la convencion estandar

**El valor inicial puede ser:**
```tsx
useState(0)           // numero
useState('')          // string
useState(false)       // booleano
useState([])          // array
useState(null)        // null
useState({ nombre: '', precio: 0 })  // objeto
```

### Actualizacion de estado

**Forma directa** — cuando el nuevo valor no depende del anterior:
```tsx
setNombre('Maria')
setActivo(false)
```

**Forma funcional** — cuando el nuevo valor depende del anterior (recomendada para evitar bugs con actualizaciones asincronas):
```tsx
// ❌ Puede fallar si hay multiples actualizaciones en el mismo ciclo
setCuenta(cuenta + 1)

// ✅ Siempre usa el valor mas reciente
setCuenta(prevCuenta => prevCuenta + 1)
```

### Actualizar objetos en el estado

El estado es **inmutable**: nunca se modifica el objeto original, se crea uno nuevo:

```tsx
const [usuario, setUsuario] = useState({ nombre: 'Ana', edad: 25 })

// ❌ Mutacion directa — React no detecta el cambio
usuario.nombre = 'Maria'
setUsuario(usuario) // El mismo objeto referencia, React no re-renderiza

// ✅ Crear un nuevo objeto con spread
setUsuario({ ...usuario, nombre: 'Maria' })
```

### Actualizar arrays en el estado

```tsx
const [lista, setLista] = useState<string[]>([])

// Agregar un elemento
setLista([...lista, 'nuevo'])

// Eliminar un elemento
setLista(lista.filter(item => item !== 'eliminar'))

// Actualizar un elemento
setLista(lista.map(item => item === 'viejo' ? 'actualizado' : item))
```

---

## 3. Fundamento Tecnico

### Eventos sinteticos en React

React no usa los eventos del DOM directamente — usa **SyntheticEvent**, una capa de abstraccion que normaliza el comportamiento entre navegadores.

```tsx
// onClick — eventos de raton
<button onClick={handleClick}>Click</button>

// onChange — campos de formulario
<input onChange={handleChange} />

// onSubmit — formularios
<form onSubmit={handleSubmit}>

// onMouseEnter / onMouseLeave
<div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>

// onKeyDown / onKeyUp
<input onKeyDown={handleKeyDown} />
```

### Tipado de manejadores de eventos

```tsx
// Evento generico
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault()
  console.log('Click en:', event.currentTarget)
}

// Evento de input
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  setValue(event.target.value)
}

// Evento de formulario
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  // procesar datos del formulario
}
```

### Reglas de los Hooks (introduccion)

Los hooks como `useState` tienen reglas estrictas:

1. **Solo llamar hooks en el nivel superior** — nunca dentro de `if`, `for` o funciones anidadas
2. **Solo llamar hooks en componentes funcionales** — no en funciones utilitarias normales

```tsx
// ❌ Hook dentro de un condicional
function Componente() {
  if (condicion) {
    const [valor, setValor] = useState(0) // Error
  }
}

// ✅ Hook siempre en el nivel superior
function Componente() {
  const [valor, setValor] = useState(0)

  if (condicion) {
    // usar valor aqui
  }
}
```

### Estado derivado

Cuando un valor puede calcularse a partir del estado existente, no se necesita un nuevo `useState`:

```tsx
const [precio, setPrecio] = useState(100)
const [cantidad, setCantidad] = useState(3)

// ✅ Estado derivado — calculado en cada render
const total = precio * cantidad

// ❌ Innecesario — crea estado redundante que puede desincronizarse
const [total, setTotal] = useState(precio * cantidad)
```

---

## 4. Ejemplos de Codigo

### Toggle de visibilidad

```tsx
function ColapsableCard({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(true)

  return (
    <div>
      <button onClick={() => setAbierto(prev => !prev)}>
        {abierto ? '▲' : '▼'} {titulo}
      </button>
      {abierto && <div>{children}</div>}
    </div>
  )
}
```

### Input controlado

```tsx
function BuscadorSimple() {
  const [busqueda, setBusqueda] = useState('')

  return (
    <div>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar producto..."
      />
      {busqueda && <p>Buscando: {busqueda}</p>}
    </div>
  )
}
```

### Multiple estado

```tsx
function FormularioSimple() {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState(0)
  const [activo, setActivo] = useState(true)

  return (
    <form>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      <input type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} />
      <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} />
    </form>
  )
}
```

---

## 5. Buenas Practicas

- **Usar la forma funcional** (`prev => prev + 1`) cuando el nuevo valor depende del anterior.
- **Agrupar estados relacionados en un objeto** cuando se actualizan siempre juntos.
- **No duplicar estado**: si un valor puede derivarse del estado, calcularlo directamente.
- **Nombrar la funcion setter con el prefijo `set`**: `setNombre`, `setActivo`, `setContador`.
- **Inicializar el estado con el tipo correcto**: `useState<string>('')`, `useState<number[]>([])`.

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| La UI no se actualiza al modificar el estado | Mutar el estado directamente en lugar de usar el setter | Usar `setEstado(nuevoValor)` |
| El estado tiene un render de retraso | Leer el estado inmediatamente despues de llamar al setter | Usar la forma funcional o `useEffect` |
| `useState` dentro de un `if` | Viola las reglas de hooks | Mover el hook al nivel superior del componente |
| Estado de array/objeto desincronizado | Usar spread incorrecto | Verificar que se crea un nuevo objeto/array |

---

## 7. Relacion con el Proyecto Incremental

En este modulo se agrega un **boton de favorito** a `ProductCard` usando `useState`. Cada tarjeta mantiene su propio estado de favorito independiente.

Adicionalmente se crea un `Counter.tsx` como ejercicio aislado para entender el ciclo basico de estado antes de aplicarlo en el contexto real del proyecto.

En el modulo 10 (Context API) el estado de favoritos se elevara al nivel global para compartirlo entre componentes.

> Ver solucion de referencia en: `react/solver/react-store/src/components/ProductCard.tsx`

---

## 8. Notas de Rendimiento

- `useState` es sincrono en su lectura pero asincrono en la actualizacion: React puede agrupar multiples llamadas al setter en un solo re-render (batching).
- Re-renderizar un componente no es costoso por si solo — React es eficiente. No optimizar prematuramente.
- `useRef` (modulo 12) es una alternativa cuando se necesita una variable mutable que no debe disparar re-renders.

---

## 9. Referencias

- [useState — React Docs](https://react.dev/reference/react/useState)
- [Responder a eventos — React Docs](https://react.dev/learn/responding-to-events)
- [Estado: la memoria de un componente — React Docs](https://react.dev/learn/state-a-components-memory)
- [Actualizar objetos en el estado — React Docs](https://react.dev/learn/updating-objects-in-state)
