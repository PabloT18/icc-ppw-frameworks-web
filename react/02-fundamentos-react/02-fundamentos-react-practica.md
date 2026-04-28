# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 2: Fundamentos de React

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Explorar JSX, crear los primeros componentes funcionales, entender como se componen entre si y aplicar expresiones JavaScript dentro del JSX del proyecto ReactStore.

---

## Contexto de la Practica

Continuamos sobre el proyecto `react-store` del modulo 1. En esta practica se reemplaza el `App.tsx` limpio con una estructura mas rica que usa expresiones, fragmentos y componentes propios.

**Estado del proyecto al inicio de esta practica:**
- `src/App.tsx` — componente minimo del modulo 1
- `src/index.css` — estilos globales del modulo 1

---

## Archivos que se van a crear o modificar

```
src/
├── App.tsx              (modificado)
└── components/
    └── HelloWorld.tsx   (nuevo — desde files/)
```

---

## Archivos base en `files/`

Esta practica incluye los archivos base en la carpeta `files/` del modulo. Copiarlos a `src/components/` antes de comenzar los pasos.

---

## Paso 1: Crear la carpeta de componentes

**(copiar)**

```bash
mkdir src/components
```

Esta carpeta contendra todos los componentes propios del proyecto. La estructura crecera con cada modulo.

---

## Paso 2: Crear el componente `HelloWorld`

**(copiar — desde `files/HelloWorld.tsx`)**

Crear el archivo `src/components/HelloWorld.tsx` con el siguiente contenido:

```tsx
function HelloWorld() {
  const nombreSitio = 'ReactStore'
  const descripcion = 'Tu tienda de productos favorita'
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>{nombreSitio}</h1>
      <p>{descripcion}</p>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        {fechaActual}
      </p>
    </div>
  )
}

export default HelloWorld
```

**¿Que hace este codigo?**
- `function HelloWorld()` — componente funcional cuyo nombre empieza con mayuscula
- Las variables `nombreSitio`, `descripcion` y `fechaActual` se calculan antes del `return`
- Las llaves `{}` dentro del JSX permiten insertar expresiones JavaScript
- `export default HelloWorld` hace el componente disponible para ser importado en otros archivos

---

## Paso 3: Usar el componente en `App`

**(copiar)**

Reemplazar el contenido de `src/App.tsx` con:

```tsx
import HelloWorld from '@/components/HelloWorld'

function App() {
  return (
    <div className="app">
      <HelloWorld />
    </div>
  )
}

export default App
```

**¿Que hace este codigo?**
- `import HelloWorld from '@/components/HelloWorld'` — importa el componente usando el alias `@` configurado en el modulo 1 (apunta a `src/`)
- `<HelloWorld />` — usa el componente como si fuera un elemento HTML; React lo renderiza llamando a la funcion
- No se necesita pasar argumentos todavia — el componente no recibe props aun

Verificar en el navegador que aparece el titulo y la descripcion.

> Captura pendiente: navegador mostrando "ReactStore" con la fecha actual.

---

## Paso 4: Explorar Fragmentos

**(completar)**

Modificar `HelloWorld.tsx` para retornar dos secciones sin un div extra. Buscar el `return` actual y reemplazarlo:

```tsx
return (
  <>
    <header style={{ background: '#1a1a1a', color: 'white', padding: '1rem' }}>
      <h1>{nombreSitio}</h1>
    </header>
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <p>{descripcion}</p>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        {fechaActual}
      </p>
    </main>
  </>
)
```

**¿Que hace este codigo?**
- `<>...</>` es un Fragmento — agrupa elementos sin agregar un nodo extra al DOM real
- Ahora el componente retorna dos elementos (`header` y `main`) sin necesidad de un `div` contenedor
- Inspeccionando en DevTools, no aparecera un div extra envolviendo el header y el main

> Captura pendiente: DevTools mostrando que no hay div extra en el DOM.

---

## Paso 5: Probar expresiones JavaScript en JSX

**(completar)**

Agregar dentro de `<main>` una nueva seccion que use una expresion condicional y una operacion matematica. Insertarla despues del parrafo de fecha:

```tsx
{/* TODO 5.1: Agregar un parrafo que muestre si el usuario esta autenticado */}
{/* Usar el operador ternario: condicion ? 'Si' : 'No' */}
{/* const estaAutenticado = false */}
{/* <p>{estaAutenticado ? 'Bienvenido de nuevo' : 'Inicia sesion para continuar'}</p> */}
```

Solución esperada — agregar antes del cierre de `<main>`:

```tsx
const estaAutenticado = false

// ... dentro del return, en <main>
<p style={{ marginTop: '1rem', color: estaAutenticado ? 'green' : '#555' }}>
  {estaAutenticado ? 'Bienvenido de nuevo' : 'Inicia sesion para continuar'}
</p>
```

**¿Que hace este codigo?**
- El operador ternario dentro de `{}` permite renderizado condicional simple
- Los estilos en linea tambien pueden usar expresiones: `color: estaAutenticado ? 'green' : '#555'`
- Cambiar `estaAutenticado` a `true` para ver el cambio

---

## Paso 6: Crear un segundo componente

**(copiar — desde `files/App.tsx`)**

Ver el archivo `files/App.tsx` para la version de referencia de como quedara `App.tsx` al finalizar este modulo.

Crear `src/components/StatusBanner.tsx`:

```tsx
function StatusBanner() {
  const totalProductos = 150
  const categorias = ['Electronica', 'Ropa', 'Hogar', 'Deportes']

  return (
    <section style={{ background: '#e8f4fd', padding: '1rem', margin: '1rem', borderRadius: '8px' }}>
      <h2>Catalogo</h2>
      <p>{totalProductos} productos disponibles</p>
      <p>Categorias: {categorias.join(' · ')}</p>
    </section>
  )
}

export default StatusBanner
```

Importar y usar en `App.tsx`:

```tsx
import HelloWorld from '@/components/HelloWorld'
import StatusBanner from '@/components/StatusBanner'

function App() {
  return (
    <div className="app">
      <HelloWorld />
      <StatusBanner />
    </div>
  )
}

export default App
```

**¿Que hace este codigo?**
- `categorias.join(' · ')` — llama a un metodo de array dentro del JSX para generar un string
- Se pueden usar todos los metodos de JavaScript dentro de `{}`
- Los dos componentes se componen verticalmente dentro de `<div className="app">`

> Captura pendiente: vista del proyecto con HelloWorld + StatusBanner.

---

## Validaciones Esperadas

- [ ] El componente `HelloWorld` muestra el titulo, descripcion y fecha sin errores en consola
- [ ] El componente usa Fragmento `<>...</>` correctamente (verificar en DevTools)
- [ ] `StatusBanner` aparece debajo de `HelloWorld`
- [ ] Las expresiones JavaScript dentro de `{}` se evaluan correctamente
- [ ] No hay errores de TypeScript en ningun archivo

---

## Entregables

- Componentes `HelloWorld.tsx` y `StatusBanner.tsx` creados en `src/components/`
- `App.tsx` importa y usa ambos componentes
- El proyecto corre sin errores en `http://localhost:5173`

---

## Commits Sugeridos

```bash
git commit -m "feat: crear componentes HelloWorld y StatusBanner"
git commit -m "feat: componer componentes en App con expresiones JSX"
```
