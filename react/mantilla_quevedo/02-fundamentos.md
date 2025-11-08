# Programación y Plataformas Web

# Frameworks Web: React

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Práctica 2: Fundamentos

### Autores

*Valeria Mantilla*
📧 [amantillac3@est.ups.edu.ec](mailto:amantillac3@est.ups.edu.ec)
💻 GitHub: [Alanissette16](https://github.com/Alanissette16)

*Claudia Quevedo*
📧 [cquevedor@ups.edu.ec](mailto:cquevedor@ups.edu.ec)
💻 GitHub: [clcmono](https://github.com/clcmono)
---

## Fundamentos de React

## ¿Qué es React?

**React** es una biblioteca de JavaScript de código abierto desarrollada por **Facebook (Meta)** para construir interfaces de usuario interactivas y dinámicas. Se utiliza principalmente para desarrollar aplicaciones web de **una sola página (SPA)** y aplicaciones móviles mediante **React Native**. **React** permite crear **componentes** reutilizables que representan partes de la interfaz, lo que facilita el **mantenimiento y la escalabilidad** de los proyectos.

## Características principales de React

1. **Arquitectura basada en Componentes**
React utiliza componentes como bloques de construcción de la interfaz. Cada componente maneja su propio estado y puede reutilizarse en distintas partes de la aplicación.

2. **Virtual DOM**
React usa un DOM virtual para mejorar el rendimiento. Cuando los datos cambian, React actualiza solo los elementos necesarios del DOM real, optimizando la renderización.

3. **Unidireccionalidad de Datos (One-way Data Binding)**
Los datos en React fluyen en una sola dirección: desde los componentes padres hacia los hijos. Esto facilita el control del flujo de información y la depuración.

4. **JSX (JavaScript XML)**
JSX permite escribir código HTML dentro de JavaScript. Esto hace que la creación de componentes sea más intuitiva y legible.

5. **Hooks**
Los Hooks (como useState, useEffect, etc.) permiten utilizar el estado y el ciclo de vida en componentes funcionales, sin necesidad de clases.

6. **React Router**
Es la herramienta más común para manejar las rutas en React, permitiendo la navegación entre diferentes páginas o vistas dentro de una aplicación SPA.

7. **Compatibilidad con TypeScript**
React puede usarse con TypeScript para añadir tipado estático, lo que mejora la calidad del código y evita errores en tiempo de ejecución.

---

## Rutas (React Router)

Con React Router, puedes definir rutas para navegar entre diferentes vistas en tu aplicación. En nuestro caso, utilizamos el siguiente código para manejar las rutas:

```bash
pnpm add react-router-dom
```

`src/routes.tsx` (enrutador con rutas básicas Home y Perfil):

```tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Perfil from "./perfilPage/Perfil";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Inicio</Link> | <Link to="/perfil">Perfil</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Bienvenido a la práctica</h1>} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

```
**Ejemplo de Proyecto: Creación de un componente Perfil.tsx**

*Crear un archivo en src/perfilPage/, por ejemplo Perfil.tsx.*

Escribir el siguiente código en Perfil.tsx:

import { useState } from "react";

const Perfil = () => {
  const [name, setName] = useState<string>("Juan");
  const [lastName, setLastName] = useState<string>("Pérez");
  const [age, setAge] = useState<number>(30);

  const getFullName = () => {
    return `${name} ${lastName} con edad ${age} años`;
  };

  const changeData = () => {
    setName("Ana");
    setLastName("Gonzales");
    setAge(25);
  };

  const resetData = () => {
    setName("Juan");
    setLastName("Pérez");
    setAge(30);
  };

  const changeAge = () => {
    setAge(18);
  };

  return (
    <div>
      <h1>{name}</h1>
      <dl>
        <dt>Nombre:</dt>
        <dd>{name}</dd>
        <dt>Apellido:</dt>
        <dd>{lastName}</dd>
        <dt>Edad:</dt>
        <dd>{age}</dd>
        <dt>Nombre Completo:</dt>
        <dd>{getFullName()}</dd>
        <dt>Nombre y Apellido (Mayúsculas):</dt>
        <dd>{`${name} ${lastName}`.toUpperCase()}</dd>
      </dl>

      <button onClick={changeData}>Cambiar datos</button>
      <button onClick={changeAge}>Cambiar edad</button>
      <button onClick={resetData}>Reset</button>
    </div>
  );
};

export default Perfil;

**Estructura del Proyecto**
src/
 ├── assets/
 │    └── react.svg
 │    └── vite.svg
 ├── perfilPage/
 │    └── Perfil.tsx
 ├── App.tsx
 └── index.tsx

![Estructura del Proyecto](image-10.png)
**Resultados**

**Componentes generados:**

Perfil → Página de perfil con las funcionalidades de cambio y reset de datos.


**Capturas de Pantalla**
Captura de App.tsx
![App.tsx](image-5.png)
**Explicación:**

* Navegación: El menú de navegación se encuentra dentro de un nav con enlaces a la página de inicio y al perfil.
* Rutas: Se definen las rutas con <Route> y <Routes>. El componente Perfil se carga en la ruta /perfil.

**Captura de Perfil.tsx**
![Perfil.tsx](image-6.png)
![Perfil.tsx, parte2](image-7.png)
**Explicación:**

* Estado: Usamos useState para manejar el estado de name, lastName, y age.
* Métodos:
- getFullName: Devuelve el nombre completo concatenado con la edad.
- changeData: Cambia los datos del perfil a nuevos valores.
- resetData: Restaura los datos a los valores iniciales.
- changeAge: Cambia la edad a 18 cuando el usuario hace clic en el botón correspondiente.
- Interactividad: Hay tres botones que permiten cambiar los datos, cambiar la edad y resetear los datos del perfil.

**Página Desplegada**
![Pagina Inicial](image-8.png)
![Perfil](image-9.png)

**Explicación de la práctica:**

* El usuario accede al perfil.
* El perfil muestra el nombre y apellido en texto normal y en mayúsculas.

**Al hacer clic en los botones:**
- Cambiar datos: El perfil se actualiza con nuevos valores (por ejemplo, nombre "Ana", apellido "Gonzales").
- Cambiar edad: La edad del perfil se actualiza a 18.
- Reset: Los datos vuelven a los valores predeterminados (Juan Pérez, 30 años).