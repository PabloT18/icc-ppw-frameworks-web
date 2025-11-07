# Programación y Plataformas Web 

# Frameworks Web: REACT

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" width="80" alt="Angular Logo">

</div>


## Practica 2: Fundamentos 

### Autores

**Diana Avila** 
📧 davilam3@est.ups.edu.ec 
💻 GitHub: [Diana Avila](https://github.com/davilam3)
**Sebastian Cabrera** 
📧 ccabreram1@est.ups.edu.ec 
💻 GitHub: [Sebastian Cabrera](https://github.com/Ccabreram1)







## Fudamentos de React

## ¿Qué es React?

React es una biblioteca o libreria de JavaScript desarrollada por Meta (Facebook) que se utiliza para crear interfaces de usuario (UI) interactivas, especialmente para aplicaciones web y móviles.
React te permite construir páginas web dinámicas donde el contenido cambia sin necesidad de recargar toda la página.

## Características principales de React

1. **Componentes**: Todo en React se construye con “componentes”, que son pequeñas piezas reutilizables de interfaz (por ejemplo: un botón, un formulario, una tarjeta de producto, etc.).

2. **Virtual DOM**: React usa una representación virtual del DOM del navegador para actualizar solo lo necesario, haciendo las aplicaciones más rápidas.

3. **Unidirectional Data Flow (flujo de datos unidireccional)**: Los datos fluyen en una sola dirección (de los padres a los hijos), lo que facilita el control y la depuración.

## Rutas

En React, la navegación entre diferentes vistas o componentes se gestiona mediante la librería React Router.
Este sistema de ruteo permite definir rutas que asocian una URL específica con un componente determinado, lo que facilita la creación de aplicaciones de una sola página (SPA) donde el contenido cambia sin recargar toda la página.

Las rutas se configuran dentro del componente principal utilizando elementos como BrowserRouter, Routes y Route.
De esta manera, React puede renderizar distintos componentes según la dirección actual del navegador, brindando una experiencia fluida al usuario.

## Servicios
En React, los servicios son funciones o módulos reutilizables que contienen la lógica de negocio o las operaciones que se comparten entre varios componentes.
Estos servicios pueden incluir operaciones como consultas a una API, validaciones, o gestión de datos.
Generalmente, los servicios se importan directamente en los componentes que los necesitan, o se comparten mediante Context API o custom hooks, lo que permite inyectar su funcionalidad de forma sencilla y reutilizable.

## Componentes de React

Los componentes son la base fundamental de cualquier aplicación desarrollada con React.
Cada componente representa una parte independiente y reutilizable de la interfaz de usuario, como botones, formularios, menús o vistas completas.

En React, un componente puede ser una función o una clase, aunque en la actualidad se recomienda usar componentes funcionales junto con hooks para manejar estado y efectos.

Cada componente en React consta de tres partes principales:

1. **Lógica del Componente (JavaScript o TypeScript)**
Define el comportamiento y la funcionalidad del componente, como el manejo de eventos, el estado o la obtención de datos.

2. **Plantilla JSX (JavaScript XML)**
Define la estructura visual de la interfaz combinando HTML y JavaScript en una sola sintaxis declarativa.

3. **Estilos CSS**
Controla la apariencia del componente. Se pueden aplicar estilos con CSS tradicional, CSS Modules, Styled Components o TailwindCSS, según las necesidades del proyecto.



## Resultados

### Creacion de un componente

Uso el comando `ng generate component` para crear un nuevo componente en Angular. Este comando genera automáticamente los archivos necesarios y actualiza el módulo correspondiente.

Componentes generados: HomePage, el cual le coloco en la carpeta `src/app/home/pages/homePage`.

![alt text](assets/06_componente-p2.png)

### Resolucion tarea

Seguir las instrucciones del siguiente GIST: [GIST](https://gist.github.com/PabloT18/f15f92224806731541d48027df336497)


1. Captura de `app.routes.ts`
2. Captura de `perfilPage.ts`
3. Captura de `perfilPage.html`
4. Captura de la pagina desplegada
5. Enlace a la pagina de githubPages
6. Enlace la repositorio de github del proyecto.

Paso 5 y 6 debe estar subido al AVAC. 

