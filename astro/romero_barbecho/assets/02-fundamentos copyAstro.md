# Programación y Plataformas Web 

# Frameworks Web: Astro

<div align="center">
  <img src="https://es.vecteezy.com/arte-vectorial/33289339-vector-un-logo-diseno-elemento-astro-logo" width="80" alt="Angular Logo">
</div>

## Practica 2: Fundamentos 

### Autores

**Jordy Romero**  
📧 jormeroa5@est.ups.edu.ec  
💻 GitHub: https://github.com/JordyRomeroa

**Nayely Barbecho**  
📧 @est.ups.edu.ec  
💻 GitHub: 

## Fundamentos de Astro

## ¿Qué es Astro?

Astro es un **framework web moderno** orientado principalmente a la construcción de sitios rápidos, escalables y optimizados. Está enfocado en el rendimiento: genera por defecto **archivos estáticos** y solo envía JavaScript al cliente cuando es estrictamente necesario (principio “Zero JS by default”).

Es perfecto para crear landing pages, portafolios, blogs, e-commerce y sitios modernos que pueden utilizar o no frameworks como React, Vue, Svelte, etc.

---

## Características principales de Astro

1. **Arquitectura basada en archivos (file-based routing)**  
   Cada archivo dentro de `src/pages` se convierte automáticamente en una ruta. No necesita configurar routers complicados.

2. **Island Architecture (Islas)**  
   Astro permite usar componentes interactivos solo donde se necesiten. Por ejemplo, un componente React o Svelte se puede usar dentro de un archivo `.astro` sin tener que convertir toda la app a un solo framework.

3. **Sin JavaScript por defecto**  
   El HTML que genera Astro es puramente estático salvo que se indique lo contrario.  
   Esto mejora la velocidad y el SEO.

4. **Soporte para múltiples frameworks**  
   Puedes mezclar React, Vue, Svelte, Solid, Preact, Lit, etc. en un mismo proyecto.

5. **Optimizado para producción**  
   Astro genera un sitio buildeado estático extremadamente rápido y ligero, ideal para despliegues en Vercel, Netlify, Cloudflare Pages, etc.

---

## Rutas en Astro

En Astro **no se define un archivo de configuración de rutas** como Angular.

Aquí las rutas funcionan así:

| Archivo dentro de `src/pages`        | URL generada |
|--------------------------------------|-------------|
| `src/pages/index.astro`             | `/`         |
| `src/pages/perfil.astro`            | `/perfil`   |
| `src/pages/proyectos.astro`         | `/proyectos`|

Es decir: **el nombre del archivo = la ruta del sitio**.

---

## Componentes

En Astro, un componente puede ser:

- un archivo `.astro`  
- un componente React, Vue, Svelte, etc.

Ejemplo básico de componente Astro:

```astro
---
/* Parte de lógica clásica */
const nombre = "Jordy";
---
```bash
<h2>Hola {nombre} desde Astro!</h2>
Servicios
```
Astro no usa servicios inyectados como Angular.
Aquí la lógica compartida se suele colocar en:

archivos .js/.ts dentro de src/lib

funciones exportadas

APIs en /src/pages/api/

Ejemplo:

ts
```bash
// src/lib/formatearTexto.ts
export function saludar(nombre: string) {
  return `Hola, ${nombre}!`;
}
y se usa así en un archivo .astro:
```

---
import { saludar } from "../lib/formatearTexto";
---
```bash
<p>{ saludar("Jordy") }</p>
Transformaciones (similar a Pipes en Angular)
Astro usa funciones JavaScript/TypeScript normales.
```

Ejemplo mayúsculas:

astro

---
```bash
const texto = "mi ejemplo";
const upper = (t) => t.toUpperCase();
---
```

```bash
<p>{ upper(texto) }</p>
Otro ejemplo para ordenar una lista:
```

astro

```bash
const items = [
  { name: "Carlos" },
  { name: "Andrea" },
  { name: "Jordy" }
];

const ordenar = (arr) => arr.sort((a, b) => a.name.localeCompare(b.name));
---
<ul>
  { ordenar(items).map(i => <li>{i.name}</li>) }
</ul>
```

Componentes de Angular
Los componentes son la piedra angular de cualquier aplicación Angular. Cada componente consta de tres partes principales:

Clase del Componente: Define la lógica y el comportamiento del componente utilizando TypeScript.

Plantilla HTML: Define la estructura y el diseño de la interfaz de usuario del componente.

Estilos CSS: Define la apariencia visual del componente, puede ser SCSS o cualquier otro preprocesador compatible.

Resultados
Creacion de un componente
Uso el comando ng generate component para crear un nuevo componente en Angular. Este comando genera automáticamente los archivos necesarios y actualiza el módulo correspondiente.

Componentes generados: HomePage, el cual le coloco en la carpeta src/app/home/pages/homePage.


Resolucion tarea
Seguir las instrucciones del siguiente GIST: GIST


Equivalencia de requerimientos Angular → Astro
En Angular se solicitó evidencias como capturas de app.routes.ts, componentes .ts y .html.

En Astro estos archivos no existen porque:

Astro crea rutas automáticamente según los archivos .astro dentro de src/pages.

Un componente o página en Astro se define en un solo archivo .astro que incluye lógica, HTML y CSS en un mismo lugar.

Por lo tanto, en Astro la evidencia equivalente será:

Captura de la carpeta src/pages donde se observan los archivos de las páginas creadas.

![Imagen](astro\romero_barbecho\imagenes\paginaweb.png)

1. Captura de la carpeta `src/pages` donde se observan los archivos de las páginas creadas. 
![imagen](astro\romero_barbecho\assets\cuarta.png) 
2. Captura del contenido de las páginas `.astro` (por ejemplo: `index.astro`, `perfil.astro` y `proyectos.astro`). 
![imagen](astro\romero_barbecho\assets\cuarta.png) 
3. Captura del sitio ya funcionando en el navegador. 
![imagen](astro\romero_barbecho\assets\paginaweb.png) 
4. Enlace a la pagina de githubPages 
https://jordyromeroa.github.io/icc-ppw-u1-FrameworkGrupal/ 
5. Enlace la repositorio de github del proyecto. 
https://github.com/JordyRomeroa/icc-ppw-u1-FrameworkGrupal.git 
6. Enlace de la rama del proyecto grupal 
https://github.com/PabloT18/icc-ppw-frameworks-web/tree/astro-romero_barbecho