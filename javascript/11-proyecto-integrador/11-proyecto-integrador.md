# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 11: Proyecto Integrador

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

Este proyecto integrador consolida **todos los temas** vistos en las practicas 01-10. Se construira una aplicacion web completa, funcional y desplegada, usando exclusivamente HTML, CSS y JavaScript puro. El resultado es una Single Page Application (SPA) que demuestra dominio de JavaScript para el desarrollo web.

### Temas integrados

| # | Tema | Aplicacion en el proyecto |
|:-:|------|--------------------------|
| 01 | Sintaxis y fundamentos | Variables, funciones, arrays, objetos |
| 02 | DOM basico | Seleccionar y manipular elementos |
| 03 | Eventos | Listeners, delegacion, formularios |
| 04 | DOM avanzado y componentes | Funciones-componente reutilizables |
| 05 | Asincronia | async/await, Promise.all |
| 06 | Fetch API | Consumir API REST (GET, POST, PUT, DELETE) |
| 07 | Storage | localStorage para persistencia |
| 08 | Formularios y validacion | Crear, validar, enviar |
| 09 | Modulos | ES Modules, import/export, estructura |
| 10 | Optimizacion | Debounce, lazy loading, accesibilidad |

---

## 2. Descripcion del Proyecto

### Opcion A: Administrador de Coleccion

Una aplicacion para gestionar una coleccion personal (libros, peliculas, videojuegos, recetas, musica, etc.) con datos de una API publica y persistencia local.

### Opcion B: Dashboard de Datos

Un panel informativo que consume una o mas APIs publicas y presenta datos de forma visual con filtros, busqueda y favoritos persistentes.

### Opcion C: Tema libre

El estudiante propone una aplicacion que integre los mismos requisitos funcionales. Debe aprobarse previamente.

---

## 3. Requisitos Funcionales

### Obligatorios (todos deben cumplirse)

#### R1: Estructura modular (Practica 09)

```
proyecto-integrador/
  index.html
  css/
    styles.css
    variables.css
  js/
    app.js                ← Punto de entrada
    config.js              ← Constantes, URLs de API
    router.js              ← Navegacion hash
    services/
      api.js               ← Peticiones HTTP
      storage.js           ← localStorage CRUD
    components/
      Card.js
      Header.js
      Modal.js
      Form.js
      Loader.js
      index.js             ← Re-exports
    utils/
      format.js
      validate.js
      performance.js
      index.js             ← Re-exports
    pages/
      home.js
      detail.js
      favorites.js
  assets/
```

- Minimo 10 archivos `.js` separados
- `<script type="module">` en index.html
- Cada archivo con una sola responsabilidad
- Barrel files (index.js) para re-exports

#### R2: Consumo de API REST (Practica 06)

- Consumir al menos una API publica con `fetch`
- Implementar al menos GET y una operacion adicional (POST, PUT o DELETE)
- Manejo de errores con try/catch
- Spinner de carga visible mientras se obtienen datos
- Verificar `response.ok` en todas las peticiones

APIs sugeridas:

| API | URL | Datos |
|-----|-----|-------|
| JSONPlaceholder | jsonplaceholder.typicode.com | Posts, users, comments |
| PokeAPI | pokeapi.co/api/v2 | Pokemon, habilidades |
| RestCountries | restcountries.com/v3.1 | Paises del mundo |
| TheMealDB | themealdb.com/api | Recetas de cocina |
| Open Library | openlibrary.org | Libros |

#### R3: Persistencia con localStorage (Practica 07)

- CRUD completo en localStorage (crear, leer, actualizar, eliminar)
- Al menos una funcionalidad de "Favoritos" o "Guardados"
- Preferencias de usuario persistentes (tema, ultimo filtro, etc.)
- Los datos persisten al recargar la pagina

#### R4: Formulario con validacion (Practica 08)

- Al menos un formulario con minimo 5 campos
- Validacion con JavaScript (no solo HTML5)
- Mensajes de error especificos por campo
- Feedback visual en tiempo real (focusout + input)
- FormData para recopilar datos

#### R5: Componentes reutilizables (Practica 04)

- Minimo 4 funciones-componente diferentes
- Cada componente en su propio archivo
- Componentes reciben datos como parametro
- Al menos un componente usado en mas de una vista/pagina

#### R6: Navegacion SPA con Hash Router (Practicas 03-04)

```javascript
// router.js
const routes = {
  '#/': homePage,
  '#/detalle': detallePage,
  '#/favoritos': favoritosPage,
  '#/crear': crearPage
};

function router() {
  const hash = window.location.hash || '#/';
  const page = routes[hash.split('?')[0]];

  if (page) {
    document.querySelector('#app').innerHTML = '';
    page();
  } else {
    document.querySelector('#app').innerHTML = '<h2>Pagina no encontrada</h2>';
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
```

- Minimo 3 vistas/paginas diferentes
- Navegacion sin recargar la pagina
- Links con `href="#/ruta"`
- Pagina 404 si la ruta no existe

#### R7: Optimizacion (Practica 10)

- Debounce en busqueda
- Lazy loading de imagenes (Intersection Observer o `loading="lazy"`)
- Event delegation (no listeners individuales en cada item)
- Al menos 3 atributos de accesibilidad (alt, aria-label, aria-live, role)

---

## 4. Requisitos No Funcionales

| Requisito | Criterio |
|-----------|---------|
| Responsive | Funcionar en movil (>= 375px) y desktop |
| Sin errores | Consola sin errores (warnings aceptables) |
| Codigo limpio | Nombres descriptivos, funciones pequenas, early return |
| Sin frameworks | Solo HTML + CSS + JavaScript puro |
| Desplegado | Publicado en GitHub Pages |
| Documentado | README.md con instrucciones |

---

## 5. Ejemplo de Flujo de la Aplicacion

```
[Usuario abre la app]
      |
      v
[Home: carga datos de API con spinner]
      |
      v
[Muestra lista de cards con datos de la API]
      |
      +---> [Buscar: input con debounce filtra cards]
      |
      +---> [Filtrar: botones filtran por categoria]
      |
      +---> [Click en card -> navega a #/detalle?id=X]
      |         |
      |         v
      |     [Detalle: muestra info completa del item]
      |     [Boton "Agregar a favoritos" -> guarda en localStorage]
      |
      +---> [Nav: "Favoritos" -> navega a #/favoritos]
      |         |
      |         v
      |     [Lista de favoritos desde localStorage]
      |     [Boton "Quitar" -> elimina de localStorage]
      |
      +---> [Nav: "Crear" -> navega a #/crear]
                |
                v
            [Formulario con validacion]
            [Al enviar: POST a API + guardar en localStorage]
```

---

## 6. Navegacion Hash Router - Detalle

```javascript
// --- router.js ---
import { renderHome } from './pages/home.js';
import { renderDetalle } from './pages/detail.js';
import { renderFavoritos } from './pages/favorites.js';
import { renderCrear } from './pages/create.js';

const routes = {
  '#/': renderHome,
  '#/detalle': renderDetalle,
  '#/favoritos': renderFavoritos,
  '#/crear': renderCrear
};

export function navigateTo(hash) {
  window.location.hash = hash;
}

export function getParams() {
  const hash = window.location.hash;
  const queryString = hash.split('?')[1] || '';
  return new URLSearchParams(queryString);
}

function router() {
  const hash = window.location.hash || '#/';
  const routeKey = hash.split('?')[0];
  const renderPage = routes[routeKey];
  const app = document.querySelector('#app');

  // Limpiar contenido
  app.innerHTML = '';

  if (renderPage) {
    renderPage(app);
  } else {
    app.innerHTML = `
      <div class="page-404">
        <h2>404 - Pagina no encontrada</h2>
        <a href="#/">Volver al inicio</a>
      </div>
    `;
  }

  // Scroll al inicio
  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', router);
}
```

```html
<!-- Navegacion en el HTML -->
<nav>
  <a href="#/">Inicio</a>
  <a href="#/favoritos">Favoritos</a>
  <a href="#/crear">Crear</a>
</nav>

<main id="app"></main>
```

```javascript
// Navegar a detalle con parametros
// <a href="#/detalle?id=25">Ver detalle</a>

// En pages/detail.js:
import { getParams } from '../router.js';

export async function renderDetalle(container) {
  const params = getParams();
  const id = params.get('id');
  // fetch datos con el id...
}
```

---

## 7. Parte Practica (Implementacion)

### Fase 1: Planificacion

1. Elegir el dominio de la aplicacion (coleccion, dashboard, o tema libre)
2. Elegir la API publica a consumir
3. Definir las 3-4 vistas/paginas
4. Diseñar la estructura de carpetas
5. Listar los componentes necesarios

### Fase 2: Estructura base

1. Crear toda la estructura de carpetas
2. Configurar `index.html` con `<script type="module">`
3. Implementar el hash router
4. Crear CSS base con variables custom
5. Verificar que la navegacion funciona

### Fase 3: Servicios

1. Implementar `services/api.js` con funciones para consumir la API elegida
2. Implementar `services/storage.js` con CRUD generico de localStorage
3. Crear `config.js` con URLs y constantes
4. Probar los servicios en consola

### Fase 4: Componentes

1. Crear al menos 4 componentes en archivos separados
2. Exportar cada componente
3. Crear barrel file `components/index.js`
4. Probar componentes individualmente

### Fase 5: Paginas

1. Implementar la pagina Home (lista de items desde API)
2. Implementar la pagina Detalle (info completa de un item)
3. Implementar la pagina Favoritos (items desde localStorage)
4. Implementar la pagina Crear (formulario con validacion)
5. Conectar todo con el router

### Fase 6: Optimizacion

1. Agregar debounce a la busqueda
2. Implementar lazy loading de imagenes
3. Verificar event delegation en las listas
4. Agregar atributos de accesibilidad
5. Probar responsive en movil
6. Limpiar errores de consola

### Fase 7: Despliegue

1. Verificar que todo funciona en local
2. Push a GitHub
3. Activar GitHub Pages (Settings > Pages > Source: main branch)
4. Verificar la URL desplegada

---

## 8. Criterios de Evaluacion

| Criterio | Peso | Detalle |
|----------|:----:|---------|
| Estructura modular | 15% | Minimo 10 archivos JS, carpetas organizadas, ES Modules |
| Consumo API | 15% | fetch + async/await, manejo de errores, spinner |
| localStorage CRUD | 15% | Crear, leer, actualizar, eliminar, persistencia |
| Formulario validado | 10% | 5+ campos, validacion JS, feedback visual |
| Componentes | 10% | 4+ componentes reutilizables, bien separados |
| Navegacion SPA | 10% | Hash router, 3+ vistas, 404 |
| Optimizacion | 10% | Debounce, lazy loading, delegation, a11y |
| UI/UX y responsive | 10% | Diseño coherente, funciona en movil |
| Codigo limpio | 5% | Nombres, funciones, estructura |

---

## 9. Resultados y Evidencias

### Capturas requeridas

1. **Home** - Vista principal con datos de la API cargados
2. **Busqueda** - Resultados filtrados con debounce
3. **Detalle** - Vista de detalle de un item
4. **Favoritos** - Lista de favoritos desde localStorage
5. **Formulario** - Con validacion mostrando errores y campos validos
6. **Responsive** - Vista en movil (DevTools device mode)
7. **Network** - Pestaña Network mostrando peticiones a la API
8. **Application** - Pestaña Application mostrando datos en localStorage
9. **Consola** - Consola sin errores
10. **GitHub Pages** - App desplegada y funcionando
11. **Estructura** - Arbol de archivos del proyecto

### Formato del Archivo de Evidencias

```markdown
### 1. Pagina principal (Home)
![Home](assets/01-home.png)
**Descripcion:** Al cargar la app se muestran N items de la API...

### 2. Busqueda con debounce
![Busqueda](assets/02-busqueda.png)
**Descripcion:** Al escribir en el input, se filtran items con debounce...

### 3. Detalle del item
![Detalle](assets/03-detalle.png)
**Descripcion:** Al hacer click en una card, navega a #/detalle?id=X...
```

---

## 10. Entregables

- Repositorio GitHub con codigo completo
- Minimo 10 archivos JavaScript con ES Modules
- App desplegada en GitHub Pages (URL funcional)
- README.md con: descripcion, API usada, instrucciones para ejecutar
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias
- Consola sin errores

---

## Reglas

- No usar frameworks (React, Vue, Angular, etc.)
- No usar librerias JS externas (jQuery, Axios, Lodash, etc.)
- Solo HTML + CSS + JavaScript puro
- CSS frameworks permitidos: Bootstrap o Tailwind (opcional, solo CSS)
- La aplicacion debe funcionar como SPA (sin recargas de pagina)
- Debe consumir al menos una API publica real
- Debe usar `<script type="module">`
- Debe estar desplegada en GitHub Pages

---

## Notas de Implementacion

- GitHub Pages sirve solo archivos estaticos - perfecto para este proyecto
- Para activar GitHub Pages: Settings > Pages > Source: Deploy from a branch > main / root
- La URL sera: `https://usuario.github.io/nombre-repo/`
- Los modulos ES requieren servidor (GitHub Pages lo provee)
- Si la API tiene CORS issues, elegir otra API que lo permita
- Probar en modo incognito para verificar que no depende de cache
- El hash router funciona nativamente en GitHub Pages (no necesita configuracion)

---

## APIs Publicas Verificadas (CORS habilitado)

| API | URL | Documentacion |
|-----|-----|---------------|
| JSONPlaceholder | `https://jsonplaceholder.typicode.com` | jsonplaceholder.typicode.com |
| PokeAPI | `https://pokeapi.co/api/v2` | pokeapi.co |
| RestCountries | `https://restcountries.com/v3.1` | restcountries.com |
| TheMealDB | `https://www.themealdb.com/api/json/v1/1` | themealdb.com/api.php |
| Dog CEO | `https://dog.ceo/api` | dog.ceo/dog-api |
| Open Trivia DB | `https://opentdb.com/api.php` | opentdb.com |
| Rick and Morty | `https://rickandmortyapi.com/api` | rickandmortyapi.com |
| Fake Store | `https://fakestoreapi.com` | fakestoreapi.com |

---


