# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 2: Fundamentos de React

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Comprender el funcionamiento esencial de React: que es JSX, como se definen los componentes funcionales, como se estructura una aplicacion React y cuales son las reglas basicas que rigen el renderizado.

---

## 2. Explicacion Conceptual

### Que problema resuelve React?

En JavaScript puro (Vanilla JS), la UI se construye manipulando el DOM directamente:

```javascript
// Vanilla JS — manipulacion directa del DOM
const title = document.createElement('h1')
title.textContent = 'Hola Mundo'
title.className = 'main-title'
document.getElementById('app').appendChild(title)
```

Esto funciona para proyectos simples, pero escala mal: cuando el estado de la aplicacion cambia, hay que actualizar el DOM manualmente, coordinar entre múltiples elementos y gestionar eventos. Con el tiempo, el codigo se vuelve dificil de mantener.

React propone un modelo diferente: **declarativo**. En lugar de decirle al navegador *como* actualizar el DOM, describes *que* debe verse en pantalla segun el estado actual:

```tsx
// React — declarativo
function App() {
  return <h1 className="main-title">Hola Mundo</h1>
}
```

React se encarga de actualizar el DOM de manera eficiente cuando el estado cambia.

### El modelo declarativo vs imperativo

| Aspecto | Imperativo (Vanilla JS) | Declarativo (React) |
|---|---|---|
| Descripcion | Describes *como* hacer los cambios | Describes *que* debe verse |
| DOM | Se manipula directamente | React lo gestiona via Virtual DOM |
| Cuando algo cambia | Actualiza manualmente los elementos afectados | React calcula que cambio y actualiza solo eso |
| Legibilidad | Baja cuando el proyecto crece | Alta — la UI refleja el estado |

### Virtual DOM

React mantiene una representacion en memoria del DOM llamada **Virtual DOM**. Cuando el estado cambia:

1. React genera un nuevo Virtual DOM con el nuevo estado
2. Compara el Virtual DOM nuevo con el anterior (**diffing**)
3. Calcula la minima cantidad de cambios necesarios
4. Aplica solo esos cambios al DOM real (**reconciliation**)

Este proceso es lo que hace a React eficiente: no reconstruye toda la pagina, solo actualiza lo que cambio.

---

## 3. Fundamento Tecnico

### JSX — JavaScript XML

**JSX** es una extension de la sintaxis de JavaScript que permite escribir HTML dentro de JavaScript. No es HTML puro ni HTML valido en si mismo — es azucar sintactica que Babel/TypeScript compila a llamadas de funciones de React.

```tsx
// JSX — lo que escribe el desarrollador
const elemento = <h1 className="title">Hola</h1>

// JavaScript puro — lo que genera el compilador
const elemento = React.createElement('h1', { className: 'title' }, 'Hola')
```

Gracias a JSX, la sintaxis es mucho mas legible. Los archivos que contienen JSX deben tener extension `.jsx` o `.tsx` (con TypeScript).

### Reglas basicas de JSX

**1. Un unico elemento raiz por componente**

```tsx
// ❌ Error — multiples elementos raiz
return (
  <h1>Titulo</h1>
  <p>Parrafo</p>
)

// ✅ Correcto — envolver en un div
return (
  <div>
    <h1>Titulo</h1>
    <p>Parrafo</p>
  </div>
)

// ✅ Tambien correcto — usar un Fragmento (sin nodo DOM extra)
return (
  <>
    <h1>Titulo</h1>
    <p>Parrafo</p>
  </>
)
```

**2. `className` en lugar de `class`**

```tsx
// ❌ class es palabra reservada en JavaScript
<div class="container">

// ✅ Usar className
<div className="container">
```

**3. Atributos en camelCase**

```tsx
// HTML
<input onclick="handler()" tabindex="1" />

// JSX
<input onClick={handler} tabIndex={1} />
```

**4. Etiquetas siempre cerradas**

```tsx
// ❌ En HTML el cierre es opcional para algunos elementos
<br>
<input>
<img src="photo.jpg">

// ✅ En JSX todas las etiquetas deben cerrarse
<br />
<input />
<img src="photo.jpg" />
```

**5. Expresiones JavaScript entre llaves `{}`**

```tsx
const nombre = 'Maria'
const precio = 29.99

return (
  <div>
    <p>Hola, {nombre}!</p>
    <p>Precio: ${precio.toFixed(2)}</p>
    <p>Suma: {10 + 5}</p>
    <p>Hoy es: {new Date().toLocaleDateString()}</p>
  </div>
)
```

### Componentes funcionales

Un **componente** en React es una funcion que recibe datos (props) y retorna JSX describiendo lo que debe mostrarse en pantalla.

```tsx
// Componente funcional basico
function Saludo() {
  return <h2>Bienvenido a ReactStore</h2>
}

// Arrow function — equivalente
const Saludo = () => {
  return <h2>Bienvenido a ReactStore</h2>
}

// Arrow function con retorno implicito — equivalente
const Saludo = () => <h2>Bienvenido a ReactStore</h2>
```

**Regla importante**: los nombres de los componentes deben comenzar con **mayuscula**. React usa esta convencion para distinguir entre elementos HTML nativos (`<div>`, `<p>`) y componentes (`<ProductCard>`, `<Navbar>`).

```tsx
// ❌ React lo trata como un elemento HTML desconocido
function saludo() { return <h2>Hola</h2> }
<saludo />

// ✅ React lo reconoce como un componente
function Saludo() { return <h2>Hola</h2> }
<Saludo />
```

### Fragmentos

Cuando un componente necesita retornar multiples elementos sin agregar un nodo extra al DOM, se usan **Fragmentos**:

```tsx
import { Fragment } from 'react'

// Sintaxis larga
function Lista() {
  return (
    <Fragment>
      <li>Item 1</li>
      <li>Item 2</li>
    </Fragment>
  )
}

// Sintaxis corta (la mas comun)
function Lista() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  )
}
```

### Relacion entre `main.tsx`, `App` y componentes

```
index.html
    │
    └── <div id="root">
              │
              └── main.tsx (createRoot + render)
                      │
                      └── <App />
                              │
                              ├── <Navbar />
                              ├── <ProductList />
                              │       └── <ProductCard /> × N
                              └── <Footer />
```

- `index.html` → contiene el contenedor `#root`
- `main.tsx` → monta la aplicacion React sobre `#root`
- `App.tsx` → componente raiz que organiza la estructura principal
- Componentes → piezas reutilizables que se componen dentro de `App`

### Expresiones validas e invalidas en JSX

```tsx
// ✅ Valido — strings, numeros, expresiones, JSX, arrays
<p>{nombre}</p>
<p>{precio}</p>
<p>{condicion ? 'Si' : 'No'}</p>
<p>{lista.map(item => <span key={item.id}>{item.name}</span>)}</p>

// ❌ Invalido — objetos no se pueden renderizar directamente
<p>{usuario}</p>        // Error: Objects are not valid as a React child
<p>{{ key: 'val' }}</p> // Error

// Para renderizar propiedades de un objeto
<p>{usuario.nombre}</p> // ✅
```

---

## 4. Ejemplos de Codigo

### Componente con expresiones

```tsx
function TarjetaBienvenida() {
  const nombreSitio = 'ReactStore'
  const version = '1.0.0'
  const fechaActual = new Date().toLocaleDateString('es-ES')

  return (
    <div className="welcome-card">
      <h1>{nombreSitio}</h1>
      <p>Version {version}</p>
      <p>Hoy es {fechaActual}</p>
    </div>
  )
}
```

### Componente con condicional simple

```tsx
function EstadoConexion() {
  const estaConectado = true

  return (
    <div>
      {estaConectado ? (
        <p style={{ color: 'green' }}>Conectado</p>
      ) : (
        <p style={{ color: 'red' }}>Desconectado</p>
      )}
    </div>
  )
}
```

### Estilos en linea en JSX

```tsx
// Los estilos en linea son objetos JavaScript, no strings
<div style={{ color: 'red', fontSize: '18px', marginTop: '10px' }}>
  Texto con estilo
</div>

// Forma legible
const estilos = {
  color: 'red',
  fontSize: '18px',
  marginTop: '10px',
}

<div style={estilos}>Texto con estilo</div>
```

Nota: las propiedades CSS usan camelCase en JSX (`backgroundColor`, `marginTop`, `fontSize`).

---

## 5. Buenas Practicas

- **Un componente por archivo**: aunque tecnicamente es posible tener multiples componentes en un archivo, la convencion es uno por archivo para facilitar la navegacion y el testing.
- **Nombrar archivos igual que el componente**: si el componente es `ProductCard`, el archivo es `ProductCard.tsx`.
- **No hacer logica compleja en el JSX**: si el return tiene mucha logica, extraerla a variables antes del return.
- **Usar Fragmentos en lugar de divs innecesarios**: los divs extra generan nodos en el DOM que pueden afectar la accesibilidad y los estilos.

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| `Adjacent JSX elements must be wrapped` | Retornar multiples elementos raiz | Envolver en `<>...</>` o `<div>` |
| Componente no aparece en pantalla | Nombre del componente con minuscula | Cambiar a mayuscula la primera letra |
| `Objects are not valid as a React child` | Intentar renderizar un objeto directamente | Acceder a propiedades especificas del objeto |
| JSX no se compila | Extension de archivo incorrecta | Renombrar a `.tsx` si contiene JSX |
| `class` no funciona | Usar `class` en lugar de `className` | Cambiar a `className` |

---

## 7. Relacion con el Proyecto Incremental

En este modulo se reemplaza el `App.tsx` de Vite por la estructura base del proyecto **ReactStore**. Se aprende a leer y entender como `main.tsx` conecta con `App` y como fluye el arbol de componentes.

A partir del modulo 3, se comenzaran a crear los primeros componentes propios del proyecto.

> Ver solucion de referencia en: `react/solver/react-store/src/App.tsx`

---

## 8. Referencias

- [Introduccion a JSX — React Docs](https://react.dev/learn/writing-markup-with-jsx)
- [Tu primer componente — React Docs](https://react.dev/learn/your-first-component)
- [JavaScript en JSX con llaves — React Docs](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [Fragmentos — React Docs](https://react.dev/reference/react/Fragment)
