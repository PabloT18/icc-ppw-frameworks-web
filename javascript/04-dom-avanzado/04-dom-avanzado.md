# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 4: DOM Avanzado y Componentes

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

En esta practica se explora la creacion de **componentes reutilizables** usando JavaScript puro. Un componente es una pieza de UI independiente que encapsula su estructura HTML, estilos y comportamiento. Los frameworks como React o Angular automatizan este patron, pero entender como funciona en Vanilla JS es fundamental para comprender que hacen los frameworks internamente.

### Que problema resuelve?

| Sin componentes | Con componentes |
|-----------------|-----------------|
| HTML duplicado en multiples paginas | Una sola funcion que genera el HTML |
| Cambiar un boton requiere editar 10 archivos | Cambiar la funcion actualiza todos |
| Dificil de mantener | Modular y mantenible |
| Logica dispersa | Logica encapsulada |

---

## 2. Conceptos Clave

### Que es un componente en Vanilla JS?

Una **funcion** que recibe datos (props) y retorna HTML (string o elementos DOM).

```javascript
// Componente como funcion que retorna HTML string
function Card(titulo, descripcion, imagen) {
  return `
    <div class="card">
      <img src="${imagen}" alt="${titulo}">
      <h3>${titulo}</h3>
      <p>${descripcion}</p>
    </div>
  `;
}

// Uso
document.querySelector('#app').innerHTML = Card('Laptop', 'Laptop gaming 16GB', 'laptop.jpg');
```

### Enfoques para crear componentes

| Enfoque | Descripcion | Ventaja | Desventaja |
|---------|-------------|---------|------------|
| **Template Literals** | Funcion que retorna string HTML | Simple, legible | innerHTML puede ser inseguro |
| **createElement** | Funcion que retorna nodos DOM | Mas seguro, eventos integrados | Mas verboso |
| **Template HTML** | Usar `<template>` del DOM | Nativo, reutilizable | Menos flexible |
| **Web Components** | Custom Elements nativos | Estandar del navegador | Mas complejo |

---

## 3. Explicacion Tecnica Detallada

### Componentes con Template Literals

```javascript
// Componente: Tarjeta de producto
function ProductCard({ id, nombre, precio, imagen, categoria }) {
  return `
    <article class="product-card" data-id="${id}" data-categoria="${categoria}">
      <img src="${imagen}" alt="${nombre}" class="product-card__img">
      <div class="product-card__body">
        <span class="product-card__categoria">${categoria}</span>
        <h3 class="product-card__titulo">${nombre}</h3>
        <p class="product-card__precio">$${precio.toFixed(2)}</p>
        <button class="product-card__btn" data-action="agregar" data-id="${id}">
          Agregar al carrito
        </button>
      </div>
    </article>
  `;
}

// Componente: Lista de productos
function ProductList(productos) {
  if (productos.length === 0) {
    return '<p class="empty">No hay productos disponibles</p>';
  }
  return `
    <div class="product-grid">
      ${productos.map(p => ProductCard(p)).join('')}
    </div>
  `;
}

// Componente: Header
function Header(titulo, subtitulo) {
  return `
    <header class="header">
      <h1>${titulo}</h1>
      <p>${subtitulo}</p>
    </header>
  `;
}

// Renderizar todo
function renderApp() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    ${Header('Mi Tienda', 'Los mejores productos')}
    ${ProductList(productos)}
  `;
}
```

### Componentes con createElement

```javascript
// Componente: Tarjeta con createElement (mas seguro)
function crearCard(datos) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = datos.id;

  const titulo = document.createElement('h3');
  titulo.textContent = datos.titulo; // textContent es seguro contra XSS

  const descripcion = document.createElement('p');
  descripcion.textContent = datos.descripcion;

  const boton = document.createElement('button');
  boton.textContent = 'Ver detalle';
  boton.addEventListener('click', () => {
    console.log(`Detalle de: ${datos.titulo}`);
  });

  card.append(titulo, descripcion, boton);
  return card;
}

// Renderizar multiples cards
function renderizarCards(contenedor, datos) {
  const fragment = document.createDocumentFragment();
  datos.forEach(item => {
    fragment.appendChild(crearCard(item));
  });
  contenedor.innerHTML = '';
  contenedor.appendChild(fragment);
}
```

### Componentes con `<template>` HTML

```html
<!-- Definir template en el HTML (no se renderiza) -->
<template id="template-card">
  <div class="card">
    <h3 class="card-titulo"></h3>
    <p class="card-descripcion"></p>
    <span class="card-precio"></span>
    <button class="card-btn">Ver mas</button>
  </div>
</template>
```

```javascript
// Usar el template
function crearCardDesdeTemplate(datos) {
  const template = document.querySelector('#template-card');
  const clon = template.content.cloneNode(true); // copia profunda

  clon.querySelector('.card-titulo').textContent = datos.titulo;
  clon.querySelector('.card-descripcion').textContent = datos.descripcion;
  clon.querySelector('.card-precio').textContent = `$${datos.precio}`;
  clon.querySelector('.card').dataset.id = datos.id;

  return clon;
}
```

### Renderizado dinamico de listas

```javascript
// Patron: renderizar lista desde array de datos
const usuarios = [
  { id: 1, nombre: 'Ana Garcia', email: 'ana@mail.com', rol: 'admin' },
  { id: 2, nombre: 'Luis Perez', email: 'luis@mail.com', rol: 'usuario' },
  { id: 3, nombre: 'Maria Lopez', email: 'maria@mail.com', rol: 'editor' }
];

// Componente fila de tabla
function TablaRow(usuario) {
  return `
    <tr data-id="${usuario.id}">
      <td>${usuario.nombre}</td>
      <td>${usuario.email}</td>
      <td><span class="badge badge--${usuario.rol}">${usuario.rol}</span></td>
      <td>
        <button data-action="editar" data-id="${usuario.id}">Editar</button>
        <button data-action="eliminar" data-id="${usuario.id}">Eliminar</button>
      </td>
    </tr>
  `;
}

// Componente tabla completa
function TablaUsuarios(usuarios) {
  return `
    <table class="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${usuarios.map(u => TablaRow(u)).join('')}
      </tbody>
    </table>
  `;
}
```

### classList API a fondo

```javascript
const elemento = document.querySelector('.componente');

// Agregar clases condicionalmente
function actualizarEstado(elemento, estado) {
  // Eliminar todos los estados posibles
  elemento.classList.remove('estado--activo', 'estado--inactivo', 'estado--pendiente');
  // Agregar el estado actual
  elemento.classList.add(`estado--${estado}`);
}

// Toggle con condicion
function toggleMenu(menuId) {
  const menu = document.getElementById(menuId);
  const isOpen = menu.classList.toggle('menu--abierto');

  // toggle retorna true si agrego la clase, false si la quito
  console.log(isOpen ? 'Menu abierto' : 'Menu cerrado');
}

// Clases dinamicas basadas en datos
function renderizarItem(item) {
  const clases = ['item'];
  if (item.destacado) clases.push('item--destacado');
  if (item.completado) clases.push('item--completado');
  if (!item.activo) clases.push('item--inactivo');

  return `<div class="${clases.join(' ')}">${item.nombre}</div>`;
}
```

### Data Attributes para estado

```javascript
// Usar data attributes para almacenar estado en el DOM
function renderizarProducto(producto) {
  return `
    <div class="producto"
         data-id="${producto.id}"
         data-precio="${producto.precio}"
         data-categoria="${producto.categoria}"
         data-en-stock="${producto.stock > 0}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
    </div>
  `;
}

// Leer data attributes para filtrar/ordenar
function filtrarPorCategoria(categoria) {
  const productos = document.querySelectorAll('.producto');
  productos.forEach(p => {
    const coincide = p.dataset.categoria === categoria;
    p.style.display = coincide ? 'block' : 'none';
  });
}

function ordenarPorPrecio() {
  const contenedor = document.querySelector('#productos');
  const productos = [...document.querySelectorAll('.producto')];
  productos.sort((a, b) => Number(a.dataset.precio) - Number(b.dataset.precio));
  productos.forEach(p => contenedor.appendChild(p));
}
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Sistema de tarjetas con filtros

```javascript
// componentes.js
'use strict';

// --- DATOS ---
const peliculas = [
  { id: 1, titulo: 'Inception', genero: 'Ciencia Ficcion', year: 2010, rating: 8.8, poster: 'https://via.placeholder.com/200x300' },
  { id: 2, titulo: 'The Dark Knight', genero: 'Accion', year: 2008, rating: 9.0, poster: 'https://via.placeholder.com/200x300' },
  { id: 3, titulo: 'Pulp Fiction', genero: 'Drama', year: 1994, rating: 8.9, poster: 'https://via.placeholder.com/200x300' },
  { id: 4, titulo: 'Interstellar', genero: 'Ciencia Ficcion', year: 2014, rating: 8.6, poster: 'https://via.placeholder.com/200x300' },
  { id: 5, titulo: 'Fight Club', genero: 'Drama', year: 1999, rating: 8.8, poster: 'https://via.placeholder.com/200x300' },
  { id: 6, titulo: 'Mad Max: Fury Road', genero: 'Accion', year: 2015, rating: 8.1, poster: 'https://via.placeholder.com/200x300' }
];

// --- COMPONENTES ---
function PeliculaCard(pelicula) {
  return `
    <div class="pelicula-card" data-id="${pelicula.id}" data-genero="${pelicula.genero}">
      <img src="${pelicula.poster}" alt="${pelicula.titulo}">
      <div class="pelicula-card__info">
        <h3>${pelicula.titulo}</h3>
        <span class="genero-badge">${pelicula.genero}</span>
        <p>${pelicula.year} | Rating: ${pelicula.rating}</p>
        <button data-action="favorito" data-id="${pelicula.id}">Favorito</button>
      </div>
    </div>
  `;
}

function FiltrosBar(generos, activo) {
  return `
    <div class="filtros">
      <button class="filtro-btn ${activo === 'todos' ? 'filtro-btn--activo' : ''}" data-filtro="todos">
        Todos
      </button>
      ${generos.map(g => `
        <button class="filtro-btn ${activo === g ? 'filtro-btn--activo' : ''}" data-filtro="${g}">
          ${g}
        </button>
      `).join('')}
    </div>
  `;
}

function ContadorResultados(total, filtradas) {
  return `
    <p class="contador">
      Mostrando ${filtradas} de ${total} peliculas
    </p>
  `;
}

// --- ESTADO ---
let filtroActivo = 'todos';

// --- RENDER ---
function render() {
  const generos = [...new Set(peliculas.map(p => p.genero))];
  const filtradas = filtroActivo === 'todos'
    ? peliculas
    : peliculas.filter(p => p.genero === filtroActivo);

  document.querySelector('#app').innerHTML = `
    <h1>Catalogo de Peliculas</h1>
    ${FiltrosBar(generos, filtroActivo)}
    ${ContadorResultados(peliculas.length, filtradas.length)}
    <div class="peliculas-grid">
      ${filtradas.map(p => PeliculaCard(p)).join('')}
    </div>
  `;
}

// --- EVENTOS (delegacion) ---
document.querySelector('#app').addEventListener('click', (e) => {
  // Filtros
  if (e.target.matches('[data-filtro]')) {
    filtroActivo = e.target.dataset.filtro;
    render();
  }

  // Favorito
  if (e.target.matches('[data-action="favorito"]')) {
    const id = Number(e.target.dataset.id);
    const pelicula = peliculas.find(p => p.id === id);
    e.target.textContent = e.target.textContent === 'Favorito' ? 'Agregado' : 'Favorito';
    e.target.classList.toggle('btn--activo');
    console.log(`Favorito: ${pelicula.titulo}`);
  }
});

render();
```

### Ejemplo 2: Componente Accordion reutilizable

```javascript
// accordion.js
function Accordion(items) {
  return `
    <div class="accordion">
      ${items.map((item, index) => `
        <div class="accordion__item" data-index="${index}">
          <button class="accordion__header" data-action="toggle-accordion" data-index="${index}">
            ${item.titulo}
            <span class="accordion__icon">+</span>
          </button>
          <div class="accordion__body" style="display: none;">
            <div class="accordion__content">${item.contenido}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Manejo de eventos con delegacion
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-action="toggle-accordion"]')) {
    const btn = e.target.closest('[data-action="toggle-accordion"]');
    const item = btn.closest('.accordion__item');
    const body = item.querySelector('.accordion__body');
    const icon = item.querySelector('.accordion__icon');
    const isOpen = body.style.display !== 'none';

    body.style.display = isOpen ? 'none' : 'block';
    icon.textContent = isOpen ? '+' : '-';
    item.classList.toggle('accordion__item--activo');
  }
});
```

---

## 5. Comparaciones / Tablas

### innerHTML vs createElement para componentes

| Criterio | innerHTML (template literals) | createElement |
|----------|:-:|:-:|
| Legibilidad | Alta (parece HTML) | Media (codigo verbose) |
| Seguridad XSS | Riesgo si hay datos del usuario | Seguro |
| Performance (pocos) | Similar | Similar |
| Performance (muchos) | Mejor (un solo reflow) | Peor (multiples reflows sin fragment) |
| Eventos | Se pierden al re-renderizar | Se mantienen |
| Ideal para | Contenido estatico/confiable | Contenido con datos del usuario |

### Patrones de componentes

| Patron | Complejidad | Reutilizacion | Ejemplo |
|--------|:-:|:-:|---------|
| Funcion con string | Baja | Alta | `Card(datos)` retorna HTML string |
| Funcion con DOM nodes | Media | Alta | `crearCard(datos)` retorna Element |
| Template HTML | Media | Media | `<template>` + cloneNode |
| Clase ES6 | Alta | Muy alta | `new Card(datos).render()` |
| Web Components | Alta | Maxima | `<mi-card>` custom element |

---

## 6. Funcionalidades Complementarias

### Patron de estado simple

```javascript
// Estado centralizado simple
const estado = {
  items: [],
  filtro: 'todos',
  ordenamiento: 'nombre',
  pagina: 1
};

function actualizarEstado(cambios) {
  Object.assign(estado, cambios);
  render(); // re-renderizar con el nuevo estado
}

// Uso
actualizarEstado({ filtro: 'activos' });
actualizarEstado({ pagina: 2 });
```

### Sanitizar HTML (prevenir XSS)

```javascript
// Funcion para escapar HTML en datos del usuario
function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Uso en componentes con datos del usuario
function ComentarioCard(comentario) {
  return `
    <div class="comentario">
      <strong>${escaparHTML(comentario.autor)}</strong>
      <p>${escaparHTML(comentario.texto)}</p>
    </div>
  `;
}
```

### Naming conventions para componentes

| Tipo | Convencion | Ejemplo |
|------|-----------|---------|
| Componente (funcion) | PascalCase | `ProductCard()`, `NavBar()` |
| Handler de evento | camelCase con prefijo handle/on | `handleClick()`, `onSubmit()` |
| Data attribute action | kebab-case | `data-action="agregar-item"` |
| Clases CSS (BEM) | bloque__elemento--modificador | `card__titulo--destacado` |

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

```
practica-04/
  index.html
  css/
    styles.css
  js/
    app.js
    componentes.js
    datos.js
```

### Paso 2: Definir los datos (copiar y adaptar)

#### 2.1 Estructura de datos

En `datos.js`, crear un array con al menos 8 objetos. Ejemplo con películas:

```javascript
// datos.js
'use strict';

const peliculas = [
  {
    id: 1,
    titulo: 'Inception',
    director: 'Christopher Nolan',
    genero: 'Ciencia Ficcion',
    year: 2010,
    rating: 8.8,
    poster: 'https://via.placeholder.com/200x300',
    favorito: false
  },
  {
    id: 2,
    titulo: 'The Dark Knight',
    director: 'Christopher Nolan',
    genero: 'Accion',
    year: 2008,
    rating: 9.0,
    poster: 'https://via.placeholder.com/200x300',
    favorito: false
  },
  // ... agregar al menos 6 objetos más
];
```

**Nota:** Puedes usar otro dominio (libros, recetas, videojuegos, etc.), pero debe tener al menos 6 propiedades incluyendo una categoría para filtrar.

### Paso 3: Componentes base (copiar como referencia)

#### 3.1 Estructura HTML base

En `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Práctica 4 - Componentes</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div id="app"></div>

  <script defer src="js/datos.js"></script>
  <script defer src="js/componentes.js"></script>
  <script defer src="js/app.js"></script>
</body>
</html>
```

#### 3.2 Componente Card (ejemplo para copiar)

En `componentes.js`, crear funciones que retornan HTML:

```javascript
// componentes.js
'use strict';

// Componente: Tarjeta individual
function PeliculaCard(pelicula) {
  const iconoFavorito = pelicula.favorito ? '★' : '☆';
  
  return `
    <article class="card" data-id="${pelicula.id}" data-genero="${pelicula.genero}">
      <img src="${pelicula.poster}" alt="${pelicula.titulo}" class="card__img">
      <div class="card__body">
        <h3 class="card__titulo">${pelicula.titulo}</h3>
        <p class="card__director">${pelicula.director}</p>
        <div class="card__info">
          <span class="badge">${pelicula.genero}</span>
          <span class="rating">⭐ ${pelicula.rating}</span>
          <span class="year">${pelicula.year}</span>
        </div>
        <div class="card__actions">
          <button data-action="favorito" data-id="${pelicula.id}">
            ${iconoFavorito} Favorito
          </button>
          <button data-action="eliminar" data-id="${pelicula.id}">Eliminar</button>
        </div>
      </div>
    </article>
  `;
}
```

### Paso 4: Componentes adicionales (debes implementar)

#### 4.1 Componente FilterBar

```javascript
// TODO: Crear función FilterBar(generos, activo) que retorne:
// - Un contenedor con botones para cada género
// - Un botón "Todos" que esté activo por defecto
// - Usar data-filtro en cada botón
// - Agregar clase 'filtro-btn--activo' al filtro seleccionado

function FilterBar(generos, activo) {
  // Tu código aquí
}
```

#### 4.2 Componente SearchBar

```javascript
// TODO: Crear función SearchBar() que retorne:
// - Un input de búsqueda con placeholder
// - Un botón de limpiar búsqueda (opcional)

function SearchBar() {
  return `
    <div class="search-bar">
      <input type="text" id="busqueda" placeholder="Buscar...">
    </div>
  `;
}
```

#### 4.3 Componente ContadorResultados

```javascript
// TODO: Crear función que muestre "Mostrando X de Y elementos"

function ContadorResultados(total, filtrados) {
  // Tu código aquí
}
```

### Paso 5: Lógica de renderizado (debes implementar)

#### 5.1 Estado de la aplicación

En `app.js`, definir el estado:

```javascript
// app.js
'use strict';

// Estado global
let filtroActivo = 'todos';
let busqueda = '';
```

#### 5.2 Función principal de renderizado

```javascript
// TODO: Crear función render() que:
// 1. Obtenga los géneros únicos del array
// 2. Filtre los datos según filtroActivo y busqueda
// 3. Renderice toda la aplicación en #app usando los componentes

function render() {
  // 1. Obtener géneros únicos
  const generos = [...new Set(peliculas.map(p => p.genero))];
  
  // 2. Filtrar datos
  let datosFiltrados = peliculas;
  
  // TODO: Si filtroActivo !== 'todos', filtrar por género
  
  // TODO: Si busqueda no está vacía, filtrar por título
  // Pista: usar includes() en minúsculas
  
  // 3. Renderizar
  document.querySelector('#app').innerHTML = `
    <h1>Catálogo de Películas</h1>
    ${SearchBar()}
    ${FilterBar(generos, filtroActivo)}
    ${ContadorResultados(peliculas.length, datosFiltrados.length)}
    <div class="grid">
      ${datosFiltrados.map(p => PeliculaCard(p)).join('')}
    </div>
  `;
}

// Renderizar al cargar
render();
```

### Paso 6: Event delegation (debes implementar)

#### 6.1 Manejo de eventos con delegación

```javascript
// TODO: UN SOLO addEventListener en #app que maneje:

document.querySelector('#app').addEventListener('click', (e) => {
  // 1. Filtros
  if (e.target.matches('[data-filtro]')) {
    // TODO: Actualizar filtroActivo con e.target.dataset.filtro
    // TODO: Llamar render()
  }
  
  // 2. Favorito
  if (e.target.matches('[data-action="favorito"]')) {
    const id = Number(e.target.dataset.id);
    // TODO: Encontrar la película en el array
    // TODO: Cambiar pelicula.favorito = !pelicula.favorito
    // TODO: Llamar render()
  }
  
  // 3. Eliminar
  if (e.target.matches('[data-action="eliminar"]')) {
    const id = Number(e.target.dataset.id);
    // TODO: Eliminar del array con findIndex + splice
    // TODO: Llamar render()
  }
});
```

#### 6.2 Búsqueda en tiempo real

```javascript
// TODO: Agregar evento input en #busqueda
// Usar event delegation en #app con evento 'input'

document.querySelector('#app').addEventListener('input', (e) => {
  if (e.target.id === 'busqueda') {
    // TODO: Actualizar variable busqueda
    // TODO: Llamar render()
  }
});
```

### Paso 7: Componente adicional (debes implementar)

Elegir e implementar **al menos 1** de las siguientes opciones:

#### Opción A: Modal de detalle

```javascript
// Componente Modal
function Modal(pelicula) {
  if (!pelicula) return '';
  
  return `
    <div class="modal" id="modal">
      <div class="modal__contenido">
        <button class="modal__cerrar" data-action="cerrar-modal">×</button>
        <h2>${pelicula.titulo}</h2>
        <img src="${pelicula.poster}" alt="${pelicula.titulo}">
        <p><strong>Director:</strong> ${pelicula.director}</p>
        <p><strong>Género:</strong> ${pelicula.genero}</p>
        <p><strong>Año:</strong> ${pelicula.year}</p>
        <p><strong>Rating:</strong> ${pelicula.rating}</p>
      </div>
    </div>
  `;
}

// TODO: Agregar data-action="ver-detalle" a las cards
// TODO: En el event listener, detectar click en ver-detalle
// TODO: Renderizar Modal dentro del #app o body
```

#### Opción B: Tabs de categorías

```javascript
// TODO: Crear componente Tabs que muestre pestañas
// TODO: Al hacer click en una pestaña, mostrar solo ese contenido
// TODO: Usar classList para marcar la pestaña activa
```

#### Opción C: Notificación toast

```javascript
function mostrarToast(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  
  // TODO: Agregar clase 'toast--visible' después de un pequeño delay
  // TODO: Remover el toast después de 3 segundos
}

// Llamar cuando se agregue a favoritos o se elimine
```

### Paso 8: Estilos CSS

Aplicar estilos para:
- Grid responsive para las cards
- Estados hover y active en botones
- Transiciones suaves
- Estilos para el componente adicional (modal/tabs/toast)

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Estructura del proyecto** - Explorador de archivos con la organización
2. **Vista general** - Página con cards renderizadas y filtros visibles
3. **Filtrado activo** - Vista con un filtro aplicado, contador actualizado
4. **Búsqueda** - Resultados filtrados por texto en tiempo real
5. **Interacción favoritos** - Cards marcadas como favoritas
6. **Componente adicional** - Modal, tabs o toast funcionando
7. **Código fuente** - Capturas de `componentes.js` y `app.js`
8. **Consola limpia** - DevTools sin errores

### Formato del README

```markdown
### 1. Vista general del catálogo
![Vista general](assets/01-vista-general.png)
**Descripción:** Se renderizan N tarjetas dinámicamente desde el array de datos...

### 2. Sistema de filtrado
![Filtrado](assets/02-filtrado.png)
**Descripción:** Al seleccionar una categoría, se aplica el filtro y se actualiza el contador...

### 3. Búsqueda en tiempo real
![Búsqueda](assets/03-busqueda.png)
**Descripción:** El input de búsqueda filtra los resultados mientras se escribe...
```

---

## 9. Entregables

### 9.1 Estructura del repositorio

El estudiante deberá subir su solución en GitHub respetando la siguiente estructura:

```
/04-dom-avanzado
  ├── index.html
  ├── css/
  │     └── styles.css
  ├── js/
  │     ├── datos.js
  │     ├── componentes.js
  │     └── app.js
  ├── assets/
  │     ├── 01-vista-general.png
  │     ├── 02-filtrado.png
  │     ├── 03-busqueda.png
  │     ├── 04-componente-adicional.png
  │     └── ...
  └── README.md
```

### 9.2 README (informe)

Debe incluir:

- **Descripción breve** del sistema implementado
- **Fragmentos de código** de los componentes principales
- **Imágenes** insertadas correctamente desde `/assets`

#### 9.2.1 Código destacado

Ejemplos de las funciones principales:
- Componente Card con template literals
- Función render() con filtrado
- Event delegation en acción
- Componente adicional implementado

#### 9.2.2 Capturas

1. Vista general con todas las funcionalidades
2. Sistema de filtrado funcionando
3. Búsqueda en tiempo real
4. Componente adicional (modal/tabs/toast)
5. Consola sin errores

### 9.3 Requisitos técnicos

- ✅ Solo HTML + CSS + JavaScript puro (no frameworks)
- ✅ Mínimo 3 archivos JS separados (datos, componentes, app)
- ✅ Cada componente como función independiente
- ✅ Event delegation (un solo listener en contenedor padre)
- ✅ Data attributes para IDs y acciones
- ✅ Código sin errores en consola

### 9.4 Criterios de evaluación

| Criterio | Puntos |
|----------|:------:|
| Componentes reutilizables correctamente implementados | 30% |
| Sistema de filtrado y búsqueda funcional | 25% |
| Event delegation correctamente aplicado | 20% |
| Componente adicional (modal/tabs/toast) | 15% |
| Código limpio, organizado y sin errores | 10% |

---


