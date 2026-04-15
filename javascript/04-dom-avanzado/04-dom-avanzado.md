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

### Paso 2: Definir los datos

En `datos.js`, crear un array con al menos 8 objetos que representen un dominio (peliculas, libros, recetas, videojuegos, etc.). Cada objeto debe tener al menos 6 propiedades incluyendo una categoria para filtrar.

### Paso 3: Crear componentes reutilizables

En `componentes.js`, crear al menos 4 funciones-componente:
1. **Card** - Tarjeta individual para mostrar un item
2. **CardList** - Contenedor que renderiza multiples cards
3. **FilterBar** - Barra de filtros por categoria
4. **SearchBar** - Campo de busqueda

Cada componente debe recibir datos como parametro y retornar HTML.

### Paso 4: Implementar filtrado y busqueda

En `app.js`:
1. Mantener un estado simple (`let filtroActivo`, `let busqueda`)
2. Implementar filtrado por categoria
3. Implementar busqueda por texto
4. Re-renderizar la lista al cambiar filtro o busqueda
5. Mostrar contador de resultados

### Paso 5: Agregar interacciones con event delegation

Con un solo `addEventListener` en `#app`:
1. Click en filtros cambia la categoria
2. Click en "favorito" alterna el estado visualmente
3. Click en "eliminar" remueve el item
4. Input en busqueda filtra en tiempo real

### Paso 6: Agregar un componente adicional

Implementar uno de los siguientes:
1. **Modal** - Se abre al hacer click en una card, muestra detalle completo
2. **Tabs** - Organiza el contenido en pestanas
3. **Accordion** - Secciones colapsables
4. **Toast/Notificacion** - Mensaje temporal que aparece y desaparece

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Vista general** - Pagina con cards renderizadas y filtros visibles
2. **Filtrado activo** - Vista con un filtro aplicado, contador actualizado
3. **Busqueda** - Resultados filtrados por texto
4. **Interaccion** - Favorito marcado, item eliminado
5. **Componente adicional** - Modal, tabs, accordion o toast funcionando
6. **Codigo fuente** - Capturas de los archivos `componentes.js` y `app.js`
7. **Consola limpia** - DevTools sin errores

### Formato del Archivo de Evidencias

```markdown
### 1. Vista general con cards
![Cards](assets/01-cards.png)
**Descripcion:** Se renderizan N tarjetas con datos desde el array...

### 2. Filtrado por categoria
![Filtros](assets/02-filtrado.png)
**Descripcion:** Al seleccionar la categoria X, se muestran solo...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Al menos 3 archivos JS separados (datos, componentes, app)
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias
- Codigo funcional sin errores en consola

---

## Reglas

- No usar frameworks
- Solo HTML + CSS + JavaScript puro
- Cada componente debe ser una funcion independiente
- Usar event delegation (no agregar listeners a cada card)
- Separar datos, componentes y logica en archivos distintos
- Usar data attributes para almacenar IDs y acciones

---

## Notas de Implementacion

- Los componentes con template literals son los mas legibles para HTML estatico
- Siempre sanitizar datos del usuario antes de insertar con innerHTML
- Event delegation es obligatorio: un solo listener en el contenedor padre
- Los data attributes (`data-*`) permiten pasar informacion del HTML al JS
- classList.toggle retorna `true` si agrego la clase, `false` si la quito
- `document.createDocumentFragment()` mejora performance al agregar muchos nodos

---


