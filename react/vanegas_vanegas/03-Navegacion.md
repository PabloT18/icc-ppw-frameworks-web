# Programación y Plataformas Web 

# Frameworks Web: React

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo"> </div>

## Práctica 3: Navegación en React

### Autores

*Miguel Ángel Vanegas*   
📧 mvanegasp@est.ups.edu.ec  
💻 GitHub: [MiguelV145](https://github.com/MiguelV145)  
*Jose Vanegas*  
📧 jvanegasp1@est.ups.edu.ec   
💻 GitHub: [josevac1](https://github.com/josevac1)

---

## 🧭 Navegación en React
La navegación en React es fundamentalmente diferente a la navegación tradicional en HTML.
Mientras que en HTML usamos etiquetas `<a href="">`, en React utilizamos el componente `<Link to>` del paquete react-router-dom para crear aplicaciones de una sola página (SPA), que no requieren recargar la página completa.

## 🔄 ¿Por qué NO usar `link` tradicional?

### ❌ Navegación Tradicional con `link to`:
```tsx
<!-- Esto RECARGA toda la página -->
 <nav>
      <Link to="/perfil">Ir al Perfil</Link>
      <Link to="/productos">Ver Productos</Link>
    </nav>
```

**Problemas:**
- ✗ Recarga completa de la página
- ✗ Pérdida del estado de la aplicación
- ✗ Menor rendimiento y más tiempo de carga
- ✗ Experiencia de usuario interrumpida
- ✗Posibles errores de enrutamiento

### ✅ Navegación con `router`:
```tsx
<!-- Esto SOLO cambia el contenido, sin recargar -->
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </BrowserRouter>
```

**Ventajas:**
- ✓ Navegación instantánea
- ✓ Preserva el estado de la aplicación
- ✓ Mejor experiencia de usuario
- ✓ Aplicación de una sola página (SPA)
- ✓ Protección de rutas (Route Guards)

## 📚 ¿Qué son las Propiedades(props)?

Los props (propiedades) en React son una forma de pasar datos de un componente a otro, permitiendo la comunicación y personalización de los componentes.

En React, no existen directivas como en Angular.
En su lugar, se utilizan propiedades (props), componentes, hooks y expresiones JSX para modificar el comportamiento del DOM y controlar la interfaz de usuario.

### 1. **Componentes**
Los componentes en React son similares a las directivas de componente en Angular.
Definen una parte reutilizable de la interfaz, junto con su comportamiento y estructura como podemos ver en estos dos ejemplo:

```tsx
function Home() {
  return <h1>Bienvenido a la página principal</h1>;
}
```

```tsx
// Uso del componente
<Home />
}
```

### 2. **Renderizado condicional (equivalente a directivas estructurales)

En React, el control del flujo del DOM se logra con expresiones condicionales en TSX, usando operadores como `&&`, `?`: o funciones.

```tsx
function Perfil({ usuario }) {
  return (
    <div>
      {usuario ? (
        <p>Bienvenido {usuario.nombre}</p>
      ) : (
        <p>Por favor, inicia sesión</p>
      )}
    </div>
  );
}

```
Esto cumple el mismo rol que las directivas estructurales (`*ngIf`, `@if`, `@for`) en Angular: mostrar u ocultar elementos según condiciones o listas.

### 3. **Atributos dinámicos y estilos (equivalente a directivas de atributo)**

En React, los atributos y comportamientos del DOM se controlan mediante props y expresiones dinámicas, no con directivas como `ngClass` o `routerLink`.
Para la navegación, React utiliza el componente `Link` del paquete `react-router-dom`, que reemplaza a `routerLink` en Angular.

```html
<!-- routerLink es una directiva de atributo -->
<a routerLink="/inicio">Inicio</a>
<div [ngClass]="{'activo': isActive}">Contenido</div>
```

## 🔗 RouterLink: Tipos de Sintaxis

Angular ofrece dos formas principales de usar `routerLink`:

### 1. **Sintaxis de String Simple**
```html
<a routerLink="/">Home</a>
<a routerLink="/productos">Productos</a>
<a routerLink="/contacto">Contacto</a>
```

**Características:**
- ✓ Sintaxis más simple
- ✓ Ideal para rutas estáticas
- ✓ Fácil de leer y escribir

### 2. **Sintaxis de Array (Binding)**
```html
<a [routerLink]="['/perfil']">Perfil</a>
<a [routerLink]="['/usuario', usuarioId]">Ver Usuario</a>
<a [routerLink]="['/productos', 'categoria', categoriaId]">Categoría</a>
```

**Características:**
- ✓ Permite pasar parámetros dinámicos
- ✓ Más flexible para rutas complejas
- ✓ Ideal para rutas con variables

## 💡 Ejemplos Prácticos

### Ejemplo 1: Navegación Básica en React
```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2>Mi Aplicación React</h2>
      <ul style={styles.ul}>
        <li><Link to="/" style={styles.link}>🏠 Inicio</Link></li>
        <li><Link to="/productos" style={styles.link}>📦 Productos</Link></li>
        <li><Link to="/contacto" style={styles.link}>📞 Contacto</Link></li>
      </ul>
    </nav>
  );
}

function Inicio() {
  return <h1>Página de Inicio</h1>;
}

function Productos() {
  return <h1>Página de Productos</h1>;
}

function Contacto() {
  return <h1>Página de Contacto</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Menú de navegación */}
      <Navbar />

      {/* Aquí se renderizan los componentes según la ruta */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </BrowserRouter>
  );
}

// 🖌️ Estilos en objeto JS (equivalente a la sección "styles" en Angular)
const styles = {
  nav: {
    background: "#f0f0f0",
    padding: "1rem",
    marginBottom: "2rem",
  },
  ul: {
    listStyle: "none",
    display: "flex",
    gap: "1rem",
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
  },
  linkHover: {
    background: "#e9ecef",
  }
};

```

### Ejemplo 2: Navegación con Parámetros
```typescript
// productos.component.ts
import React from "react";
import { Link } from "react-router-dom";

export default function ProductosPage() {
  const productos = [
    { id: 1, nombre: "Laptop", descripcion: "Laptop Gaming", precio: 1200 },
    { id: 2, nombre: "Mouse", descripcion: "Mouse Inalámbrico", precio: 25 },
    { id: 3, nombre: "Teclado", descripcion: "Teclado Mecánico", precio: 80 }
  ];

  return (
    <div>
      <h2>Lista de Productos</h2>

      {productos.map((producto) => (
        <div key={producto.id} className="producto-card">
          <h3>{producto.nombre}</h3>
          <p>{producto.descripcion}</p>
          <p><strong>Precio: ${producto.precio}</strong></p>

          <Link to={`/producto/${producto.id}`} className="btn-detalle">
            👁️ Ver Detalles
          </Link>
        </div>
      ))}

      <style>{`
        .producto-card {
          border: 1px solid #dee2e6;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 8px;
        }

        .btn-detalle {
          background: #007bff;
          color: white;
          padding: 0.5rem 1rem;
          text-decoration: none;
          border-radius: 4px;
          display: inline-block;
          margin-top: 0.5rem;
        }

        .btn-detalle:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
}

```

## 🎯 Diferencias Clave: String vs Array


| Aspecto | `<Link to="/ruta">` | `useNavigate()` |
|---------|----------------------|------------------|
| **Formato** | Declarativo (en el JSX) | Imperativo (desde funciones) |
| **Parámetros** | ✓ Soporta rutas dinámicas: `/ruta/${id}` | ✓ Soporta: `navigate(\`/ruta/${id}\`)` |
| **Uso de variables** | ✓ Sí, con interpolación | ✓ Sí, directo en la lógica del componente |
| **Cuándo usarlo** | Para navegación desde menús o enlaces visibles | Para navegar después de acciones (guardar, login, eliminar) |
| **Complejidad** | Simple | Más flexible para lógica compleja |

### Ejemplos Comparativos:

## 🎯 Ejemplos Comparativos en React

```tsx
// ✅ String simple: Ideal para rutas fijas
import { Link } from "react-router-dom";

<nav>
  <Link to="/">Inicio</Link>
  <Link to="/productos">Productos</Link>
  <Link to="/contacto">Contacto</Link>
</nav>

// ✅ Rutas dinámicas con variables
<Link to="/perfil">Mi Perfil</Link>
<Link to={`/usuario/${usuario.id}`}>
  Ver Usuario: {usuario.nombre}
</Link>
<Link to={`/producto/${producto.id}/reviews`}>
  Reviews del Producto
</Link>

// 🔍 Ejemplo con múltiples parámetros
<Link to={`/categoria/${categoria.id}/producto/${producto.id}`}>
  Ver Producto en Categoría
</Link>

```


## 🚀 RouterLink Activo

React Router utiliza `<NavLink>` para detectar si la ruta está activa:
```tsx
import { NavLink } from "react-router-dom";

<nav>
  <NavLink 
    to="/" 
    className={({ isActive }) => isActive ? "active" : ""}
  >
    Inicio
  </NavLink>

  <NavLink 
    to="/productos" 
    className={({ isActive }) => isActive ? "active" : ""}
  >
    Productos
  </NavLink>

  <NavLink 
    to="/contacto" 
    className={({ isActive }) => isActive ? "active" : ""}
  >
    Contacto
  </NavLink>
</nav>

<style>
.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>

```

## 📱 Navegación Programática

React usa el hook `useNavigate()` para navegar desde funciones:

```typescript
import { useNavigate } from "react-router-dom";

export function EjemploComponent() {
  const navigate = useNavigate();

  const irAProductos = () => {
    navigate("/productos");
  };

  const irAProducto = (id) => {
    navigate(`/producto/${id}`);
  };

  return (
    <>
      <button onClick={irAProductos}>Ver Productos</button>
      <button onClick={() => irAProducto(123)}>Ver Producto 123</button>
    </>
  );
}

```



## 🎓 Resumen


1. **React usa React Router** para crear aplicaciones SPA  
   Permite cambiar vistas sin recargar la página, ofreciendo una experiencia rápida y fluida.

2. **No usar `<a href="">`**, porque recarga la página completa  
   Esto reinicia la app, borra el estado y rompe la experiencia SPA.

3. **Navegación Declarativa con `<Link>`**
```tsx
import { Link } from "react-router-dom";

<nav>
  <Link to="/">Inicio</Link>
  <Link to="/productos">Productos</Link>
  <Link to={`/producto/${10}`}>Ver Producto 10</Link>
</nav>

```
La navegación en React ofrece una experiencia moderna y optimizada gracias a su enfoque de Single Page Application (SPA). Con React Router, la aplicación puede cambiar de vista sin recargar la página, permitiendo transiciones rápidas, fluidas y sin interrupciones. Esto mejora el rendimiento, conserva el estado y brinda una interacción más natural para el usuario.

## �️ Implementación Práctica

Sigue estos pasos para implementar la navegación en tu proyecto React:

### Paso 1: Crear las Páginas Principales

#### 1.1 Crear ProyectosPage

En una carpeta creamos una carpeta de componentes y creamos la carpeta de `Proyectos` y su archivo `proyectoPagetsx`.

![Page-creacion](/react/vanegas_vanegas/assets/creacionpage.png)
#### 1.2 Crear ProyectosDosPage

Se hace lo mismo para Proyectodospage

![Pagedos-creacion](/react/vanegas_vanegas/assets/creacionpagedos.png)

### Paso 2: Configurar las Rutas
configuracion: `app.tsx`

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./componentes/homePage";
import PerfilHome from "./componentes/perfilHome";
import ProyectoPage from "./componentes/Proyectopage/proyectoPage";
import ProyectoDosPage from "./componentes/Proyectodospage/proyectoDosPage";
import NavBar from  "./componentes/share/componet/nav-bar/nav_bar";
import { ProyectoServiceProvider } from "./componentes/Proyectodospage/Service/ProyectoService";
function App() {
  return (
    <BrowserRouter basename="/icc-ppw-u1-01fundamentos-react">

    <h1>Mi Aplicación</h1>
      <NavBar />
      <ProyectoServiceProvider>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/perfil" element={<PerfilHome />} />
        <Route path="/page" element={<ProyectoPage />} />
        <Route path="/dospage" element={<ProyectoDosPage />} />
      </Routes>
      </ProyectoServiceProvider>
    </BrowserRouter>
  );
}

export default App;
```
Este código configura la navegación de una aplicación React usando React Router, permitiendo cambiar de página sin recargar la web. Dentro de `<BrowserRouter>` se muestra el título, el menú (`NavBar`) y se usa `ProyectoServiceProvider` para compartir datos entre componentes. Las rutas definidas (`/`, `/perfil`, `/page`, `/dospage`) permiten mostrar diferentes pantallas según la URL. En resumen, este archivo organiza cómo el usuario se mueve dentro de la aplicación y qué componentes se muestran en cada sección.

### Paso 3: Agregar al Navbar
configuracion: `nav_bar.tsx` y `nav-barc.css`
```tsx
import { NavLink } from "react-router-dom";
import "./nav-barc.css";

export default function NavBar() {
  return (
    <nav>
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        HomePage
      </NavLink>

      <NavLink
        to="/perfil"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        PerfilHome
      </NavLink>

      <NavLink
        to="/page"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
       ProyectoPage
      </NavLink>

      <NavLink
        to="/dospage"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        ProyectoDosPage
      </NavLink>
    </nav>
  );
}
```

Este componente `NavBar` crea un menú de navegación en React utilizando `NavLink`, que permite mostrar enlaces que cambian de estilo automáticamente cuando la ruta está activa. Cada NavLink apunta a una página diferente de la app (`/`, `/perfil`, `/page`, `/dospage`) y usa una función en `className` para aplicar la clase "`active`" cuando el usuario está en esa ruta, lo que permite resaltar visualmente el enlace activo. Además, el archivo usa estilos propios importados desde "`nav-barc.css`".

### Paso 4: Crear Componentes para Proyectos y separarlos en componentes indivuduals

```tsx
import { useState } from 'react';
import type { Proyecto } from '../interfaces/proyecto-interfaces';
 
interface AddProyectoProps {
  onAddProyecto: (newProyectoData: Omit<Proyecto, 'id'>) => void;
  onRemoveProyecto: () => void; // ❗ OJO: ya no recibe id aquí
}

const AddProyecto: React.FC<AddProyectoProps> = ({ 
  onAddProyecto, 
  onRemoveProyecto 
}) => {

  const [name, setName] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProyecto({
      nombre: name,
      description: descripcion,
    });

    setName('');
    setDescripcion('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Agregar proyecto (Componente)</h4>
     
      <input
        type="text"
        placeholder="Nombre del proyecto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Descripción del proyecto"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <div style={{ marginTop: '10px' }}>
        <button type="submit">Agregar</button>

        <button 
          type="button" 
          onClick={onRemoveProyecto}  
          style={{ marginLeft: '8px' }} 
        >
          Eliminar
        </button>
      </div>

    </form>
  );
};

export default AddProyecto;
```

El componente AddProyecto funciona como un formulario que permite ingresar el nombre y la descripción de un proyecto y enviarlos al servicio global mediante la función `onAddProyecto`, limpiando los campos después de agregarlo. Además, incluye un botón Eliminar que llama directamente a `onRemoveProyecto`, permitiendo que la eliminación se maneje desde el componente padre. En resumen, este componente solo recopila datos y dispara acciones, dejando toda la lógica de gestión al servicio y al padre.
#### 4.1 Crear Componente para Agregar Proyectos

codigo de `addproyecto.tsx`.
```tsx
import { useState } from 'react';
import type { Proyecto } from '../interfaces/proyecto-interfaces';
 
interface AddProyectoProps {
  onAddProyecto: (newProyectoData: Omit<Proyecto, 'id'>) => void;
  onRemoveProyecto: () => void; 
}

const AddProyecto: React.FC<AddProyectoProps> = ({ 
  onAddProyecto, 
  onRemoveProyecto 
}) => {

  const [name, setName] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProyecto({
      nombre: name,
      description: descripcion,
    });

    setName('');
    setDescripcion('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Agregar proyecto (Componente)</h4>
     
      <input
        type="text"
        placeholder="Nombre del proyecto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Descripción del proyecto"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <div style={{ marginTop: '10px' }}>
        <button type="submit">Agregar</button>

        <button 
          type="button" 
          onClick={onRemoveProyecto}  
          style={{ marginLeft: '8px' }} 
        >
          Eliminar
        </button>
      </div>

    </form>
  );
};

export default AddProyecto;

```


#### 4.2 Crear Componente para Lista de Proyectos

codigo de listadoProyecto.tsx

```tsx
iimport React from 'react';
import type { Proyecto } from '../../interfaces/proyecto-interfaces';


interface ListadoProps {
  listName: string;
  proyectos: Proyecto[];

}

const ListadoProyecto: React.FC<ListadoProps> = ({ 
  listName, 
  proyectos, 
   
}) => {
  return (
    <div>
      <h3>{listName}</h3>
      <ul>
        {proyectos.map((proyecto) => (
          <li key={proyecto.id}>
            {proyecto.nombre} - {proyecto.description}
            
          

          </li>
        ))}
        {proyectos.length === 0 && <p>No hay proyectos.</p>}
      </ul>
    </div>
  );
};

export default ListadoProyecto;

```

El componente ListadoProyecto se encarga únicamente de mostrar en pantalla los proyectos que recibe como propiedad. Primero presenta un título usando `listName`, y luego construye una lista donde cada proyecto es dibujado con su nombre y descripción usando un .`map()`. Cada elemento tiene una clave única basada en su `id`, lo que ayuda a React a manejar correctamente la lista. Si no existen proyectos, el componente muestra un mensaje indicando que la lista está vacía. En esencia, este componente solo muestra datos y no incluye botones ni lógica para modificar la lista, por lo que funciona como un componente de presentación simple y claro.

### Paso 5: Implementar la Página de Proyectos

proyectopage.tsx

```tsx
import { useState } from 'react';
import  type { Proyecto } from './interfaces/proyecto-interfaces';
import ListadoProyecto from './componentes/listado-componentes/listadoProyecto';



const ProyectoPage: React.FC = () => {
  
 
  const [name, setName] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    { id: 1, nombre: 'Proyecto A (Local)', description: 'descipcion' }
  ]);

  
  const handleAddProyecto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProyecto: Proyecto = {
      id: Math.floor(Math.random() * 1000),
      nombre: name,
      description: descripcion,
    };
    
   
    setProyectos(currentProyectos => [...currentProyectos, newProyecto]);

    setName('');
    setDescripcion('');
  };

  
  return (
    <div>
      <h1>Proyecto (Estado Local)</h1>
      <section>
        
        <form onSubmit={handleAddProyecto}>
          <h3>Agregar proyecto</h3>
          <h4>Proyecto Agregar: {name}</h4> 
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="descripcion del proyecto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <button type="submit">Agregar Proyecto</button>
        </form>

        <hr />

        
        <div>
          <h3>Listado Interno</h3>
          <ul>
            {proyectos.map((proyecto) => (
              <li key={proyecto.id}>
                {proyecto.nombre} - {proyecto.description}
                
            
              </li>
            ))}
          </ul>
        </div>

        <hr />

      
        <ListadoProyecto
          listName="Lista Proyecto (Componente Hijo)"
          proyectos={proyectos}
        />
      </section>
    </div>
  );
};


export default ProyectoPage;

```

El componente ProyectoPage maneja un listado de proyectos usando estado local mediante `useState`. Permite escribir el nombre y la descripción de un nuevo proyecto en un formulario y, cuando se envía, crea un objeto con un id generado al azar y lo agrega al arreglo `proyectos`. Luego limpia los campos del formulario. El listado de proyectos se muestra de dos maneras: directamente dentro del mismo componente y también a través del componente hijo `listadoProyecto`, que recibe la lista como prop. En resumen, este componente controla internamente la creación de proyectos y muestra los resultados tanto localmente como mediante un componente externo.
Proyecto-page.ts

### Paso 6: Implementar la Página ProyectosDos

Proyecto-dos.tsx

```tsx
import { useProyectoService } from './Service/ProyectoService';
import ListadoProyecto from '../Proyectopage/componentes/listado-componentes/listadoProyecto';
import AddProyectos from '../Proyectopage/componentes/addProyectos';
 
export const ProyectoDosPage: React.FC = () => {
  
  const { proyectos, addProyecto, removeProyecto } = useProyectoService();

  return (
    <div>
      
      <ListadoProyecto 
        listName="Listado de Proyectos (Global)"
        proyectos={proyectos} 
      />
      
      <AddProyectos 
        onAddProyecto={addProyecto} 
        onRemoveProyecto={() => {
          if (proyectos.length > 0) {
            const lastId = proyectos[0].id;
            removeProyecto(lastId);
          }
        }}
      />

    </div>
  );
};

export default ProyectoDosPage;
```

El componente ProyectoDosPage usa el hook `useProyectoService` para manejar una lista global de proyectos y las funciones para agregar y eliminar. Muestra el componente `listadoProyecto`, que recibe y despliega la lista completa, y también incluye `AddProyectos`, que permite añadir nuevos proyectos y eliminar uno existente. Cuando se presiona eliminar, se toma el primer proyecto de la lista y se envía su id a `removeProyecto`. En resumen, este componente conecta la lógica global del servicio con los componentes que muestran y gestionan los proyectos.

## �📸 Capturas de Implementación

### 1. Configuración de Rutas (app.tsx)


```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./componentes/homePage";
import PerfilHome from "./componentes/perfilHome";
import ProyectoPage from "./componentes/Proyectopage/proyectoPage";
import ProyectoDosPage from "./componentes/Proyectodospage/proyectoDosPage";
import NavBar from  "./componentes/share/componet/nav-bar/nav_bar";
import { ProyectoServiceProvider } from "./componentes/Proyectodospage/Service/ProyectoService";
function App() {
  return (
    <BrowserRouter basename="/icc-ppw-u1-01fundamentos-react">

    <h1>Mi Aplicación</h1>
      <NavBar />
      <ProyectoServiceProvider>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/perfil" element={<PerfilHome />} />
        <Route path="/page" element={<ProyectoPage />} />
        <Route path="/dospage" element={<ProyectoDosPage />} />
      </Routes>
      </ProyectoServiceProvider>
    </BrowserRouter>
  );
}

export default App;

```

### 2. Navegación con RouterLink

```Typescript
 <nav>
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        HomePage
      </NavLink>

      <NavLink
        to="/perfil"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        PerfilHome
      </NavLink>

      <NavLink
        to="/page"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
       ProyectoPage
      </NavLink>

      <NavLink
        to="/dospage"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        ProyectoDosPage
      </NavLink>
    </nav>
```
### 3. Componente con Navegación
Protecto-dospage.tsx
```tsx
<ListadoProyecto 
        listName="Listado de Proyectos (Global)"
        proyectos={proyectos} 
      />
```

Proyecto-page.tsx
```tsx
 <ListadoProyecto
          listName="Lista Proyecto (Componente Hijo)"
          proyectos={proyectos}
        />
```
### 4. Aplicación Funcionando

- HomePage
![HomePage](/react/vanegas_vanegas/assets/react-home.png)

- PerfilPage
![PerfilPage](/react/vanegas_vanegas/assets/react-perfil.png)


- ProyectoPage
![ProyectoPage](/react/vanegas_vanegas/assets/reactproyectopage.png)


- ProyectoDosPage
![ProyectoDosPage](/react/vanegas_vanegas/assets/reactProyectopagedos.png)



## 🔗 Enlaces del Proyecto

- **Repositorio GitHub**: 

[josevac1 y miguelv145](https://github.com/josevac1/icc-ppw-u1-01fundamentos-react)
- **GitHub Pages**: 

[josevac1 y miguelv145](https://josevac1.github.io/icc-ppw-u1-01fundamentos-react/dospage)


## 📝 Notas de Implementación

Este proyecto utiliza una arquitectura moderna basada en **React 18+**. A continuación se detallan las principales prácticas aplicadas:

- ✔️ **React 18+ con Hooks modernos (useState, useEffect, custom hooks)** para una gestión clara y eficiente del estado.  
- ✔️ Implementación de **navegación estática y dinámica** mediante **React Router v6+**, siguiendo patrones SPA.  
- ✔️ Uso de un **Hook personalizado (`useProyectoService`)** para manejar el estado global de proyectos, imitando un servicio como en Angular.  
- ✔️ Separación limpia entre componentes:  
  - **Página principal (`ProyectoDosPage`)**  
  - **Componente de listado (`ListadoProyecto`)**  
  - **Componente para agregar/eliminar (`AddProyectos`)**  
- ✔️ Estilos mejorados usando **CSS moderno**, compatible con Tailwind o CSS Modules.  
- ✔️ Arquitectura basada en **componentes reutilizables**, evitando lógica duplicada y favoreciendo la escalabilidad.  
- ✔️ Navegación tipo SPA con tránsito fluido entre páginas sin recargar la aplicación.  

