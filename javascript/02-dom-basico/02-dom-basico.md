# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 2: Manipulacion del DOM

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

El **DOM (Document Object Model)** es la representacion en memoria de la estructura HTML de una pagina web. El navegador convierte el HTML en un arbol de objetos JavaScript que podemos leer, modificar, crear y eliminar. Toda la interactividad de una pagina web depende de la manipulacion del DOM.

### HTML vs DOM

| Aspecto | HTML (archivo) | DOM (memoria) |
|---------|---------------|---------------|
| **Que es** | Texto plano con etiquetas | Arbol de objetos JavaScript |
| **Donde vive** | En el archivo `.html` | En la memoria del navegador |
| **Se puede modificar con JS** | No directamente | Si, en tiempo real |
| **Relacion** | Fuente original | Representacion viva del HTML |

```
Archivo HTML                     Arbol DOM
-----------                     ---------
<html>                          document
  <head>                          |-- html
    <title>Mi pag</title>             |-- head
  </head>                            |   |-- title
  <body>                              |       |-- "Mi pag"
    <h1>Hola</h1>                     |-- body
    <p>Texto</p>                          |-- h1
  </body>                                |   |-- "Hola"
</html>                                  |-- p
                                              |-- "Texto"
```

El objeto `document` es el punto de entrada a todo el arbol DOM.

---

## 2. Conceptos Clave

### Selectores del DOM

| Metodo | Selecciona | Retorna | Ejemplo |
|--------|-----------|---------|---------|
| `getElementById('id')` | Por ID | Un elemento o `null` | `document.getElementById('titulo')` |
| `querySelector('sel')` | Primer match del selector CSS | Un elemento o `null` | `document.querySelector('.card')` |
| `querySelectorAll('sel')` | Todos los matches | `NodeList` (no vivo) | `document.querySelectorAll('li')` |
| `getElementsByClassName('cl')` | Por clase | `HTMLCollection` (vivo) | `document.getElementsByClassName('item')` |
| `getElementsByTagName('tag')` | Por etiqueta | `HTMLCollection` (vivo) | `document.getElementsByTagName('p')` |

**Recomendacion:** Usar `querySelector` y `querySelectorAll` siempre. Son los mas flexibles y usan sintaxis CSS.

```javascript
// Selector por ID
const titulo = document.getElementById('titulo');

// Selector CSS (el primero que encuentre)
const primerCard = document.querySelector('.card');
const nav = document.querySelector('nav');
const botonEnviar = document.querySelector('#form-contacto button[type="submit"]');

// Todos los que coincidan
const items = document.querySelectorAll('.lista-item');
const parrafos = document.querySelectorAll('p');
const links = document.querySelectorAll('a[target="_blank"]');
```

### NodeList vs HTMLCollection

| Caracteristica | NodeList (`querySelectorAll`) | HTMLCollection (`getElementsBy...`) |
|----------------|:---:|:---:|
| Se actualiza automaticamente | No | Si (es "viva") |
| Tiene `forEach` | Si | No |
| Se puede convertir a array | `[...nodeList]` | `[...collection]` |
| Uso recomendado | Si | No |

```javascript
// NodeList: se puede iterar directamente
const items = document.querySelectorAll('.item');
items.forEach(item => console.log(item.textContent));

// HTMLCollection: hay que convertir primero
const divs = document.getElementsByTagName('div');
[...divs].forEach(div => console.log(div.textContent));
```

---

## 3. Explicacion Tecnica Detallada

### Modificar contenido

```javascript
const titulo = document.querySelector('#titulo');

// textContent: solo texto, ignora HTML
titulo.textContent = 'Nuevo titulo';

// innerHTML: interpreta HTML (cuidado con XSS)
titulo.innerHTML = 'Titulo <strong>importante</strong>';

// innerText: similar a textContent pero respeta estilos CSS (display: none, etc.)
titulo.innerText = 'Texto visible';
```

**Seguridad:** Nunca usar `innerHTML` con datos del usuario sin sanitizar. Puede causar ataques XSS (Cross-Site Scripting).

```javascript
// PELIGROSO: nunca hacer esto con input del usuario
const input = '<script>alert("XSS")</script>';
elemento.innerHTML = input; // Ejecutaria el script

// SEGURO: usar textContent para datos del usuario
elemento.textContent = input; // Se muestra como texto plano
```

### Modificar atributos

```javascript
const imagen = document.querySelector('img');
const enlace = document.querySelector('a');

// getAttribute / setAttribute
const src = imagen.getAttribute('src');
imagen.setAttribute('src', 'nueva-imagen.jpg');
imagen.setAttribute('alt', 'Descripcion de la imagen');

// Acceso directo (para atributos estandar)
enlace.href = 'https://ejemplo.com';
enlace.target = '_blank';
imagen.src = 'otra-imagen.jpg';

// Verificar si tiene un atributo
console.log(imagen.hasAttribute('alt')); // true/false

// Eliminar atributo
imagen.removeAttribute('width');
```

### Modificar estilos

```javascript
const caja = document.querySelector('.caja');

// Estilo individual (camelCase en JS)
caja.style.backgroundColor = '#3498db';
caja.style.color = 'white';
caja.style.padding = '20px';
caja.style.borderRadius = '8px';
caja.style.fontSize = '16px';

// Multiples estilos con cssText
caja.style.cssText = `
  background-color: #3498db;
  color: white;
  padding: 20px;
  border-radius: 8px;
`;

// Obtener estilos computados (incluye CSS externo)
const estilos = window.getComputedStyle(caja);
console.log(estilos.backgroundColor);
console.log(estilos.width);
```

### Modificar clases CSS

```javascript
const elemento = document.querySelector('.tarjeta');

// classList API (RECOMENDADO)
elemento.classList.add('activa');           // agrega clase
elemento.classList.remove('inactiva');      // elimina clase
elemento.classList.toggle('visible');       // agrega si no tiene, elimina si tiene
elemento.classList.contains('activa');      // true/false
elemento.classList.replace('vieja', 'nueva'); // reemplaza clase

// Agregar multiples clases
elemento.classList.add('clase1', 'clase2', 'clase3');

// className: reemplaza TODAS las clases (evitar)
elemento.className = 'tarjeta activa'; // sobreescribe todo
```

### Crear elementos

```javascript
// Crear un nuevo elemento
const nuevoParrafo = document.createElement('p');
nuevoParrafo.textContent = 'Este parrafo fue creado con JavaScript';
nuevoParrafo.classList.add('parrafo-nuevo');

// Crear un elemento mas complejo
const card = document.createElement('div');
card.classList.add('card');
card.innerHTML = `
  <h3>Titulo de la card</h3>
  <p>Descripcion de la card</p>
  <button>Ver mas</button>
`;

// Insertar en el DOM
const contenedor = document.querySelector('#contenedor');

contenedor.appendChild(card);                         // al final
contenedor.prepend(nuevoParrafo);                    // al inicio
contenedor.insertBefore(card, contenedor.firstChild); // antes de un hijo
contenedor.append(card, nuevoParrafo);               // multiples al final

// insertAdjacentHTML: insertar HTML en posiciones especificas
contenedor.insertAdjacentHTML('beforeend', '<p>Al final</p>');
contenedor.insertAdjacentHTML('afterbegin', '<p>Al inicio</p>');
contenedor.insertAdjacentHTML('beforebegin', '<p>Antes del contenedor</p>');
contenedor.insertAdjacentHTML('afterend', '<p>Despues del contenedor</p>');
```

### Eliminar elementos

```javascript
const elemento = document.querySelector('.eliminar-me');

// Metodo moderno (recomendado)
elemento.remove();

// Metodo clasico (desde el padre)
const padre = document.querySelector('#contenedor');
padre.removeChild(elemento);

// Eliminar todos los hijos
const lista = document.querySelector('ul');
lista.innerHTML = ''; // Forma rapida pero puede tener implicaciones de memoria

// Forma segura de eliminar todos los hijos
while (lista.firstChild) {
  lista.removeChild(lista.firstChild);
}
```

### Navegar por el arbol DOM

```javascript
const item = document.querySelector('.item-actual');

// Padres
item.parentElement;           // elemento padre directo
item.closest('.contenedor');  // ancestro mas cercano que coincide

// Hijos
item.children;                // HTMLCollection de hijos (solo elementos)
item.childNodes;              // NodeList de hijos (incluye texto y comentarios)
item.firstElementChild;       // primer hijo elemento
item.lastElementChild;        // ultimo hijo elemento

// Hermanos
item.nextElementSibling;      // siguiente hermano elemento
item.previousElementSibling;  // anterior hermano elemento
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Lista dinamica

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista Dinamica</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 0 20px; }
    .input-group { display: flex; gap: 10px; margin-bottom: 20px; }
    .input-group input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
    .input-group button { padding: 10px 20px; background: #F7DF1E; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    ul { list-style: none; padding: 0; }
    li { padding: 12px; margin: 8px 0; background: #f5f5f5; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
    li .eliminar { color: #e74c3c; cursor: pointer; font-weight: bold; }
    .contador { color: #666; font-size: 0.9rem; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>Lista de Compras</h1>
  <div class="input-group">
    <input type="text" id="input-item" placeholder="Agregar item...">
    <button id="btn-agregar">Agregar</button>
  </div>
  <ul id="lista"></ul>
  <p class="contador" id="contador"></p>

  <script src="app.js"></script>
</body>
</html>
```

```javascript
// app.js
'use strict';

const inputItem = document.querySelector('#input-item');
const btnAgregar = document.querySelector('#btn-agregar');
const lista = document.querySelector('#lista');
const contador = document.querySelector('#contador');

function agregarItem() {
  const texto = inputItem.value.trim();
  if (texto === '') return;

  const li = document.createElement('li');
  li.innerHTML = `
    <span>${texto}</span>
    <span class="eliminar">X</span>
  `;

  // Agregar evento de eliminar al boton X
  li.querySelector('.eliminar').addEventListener('click', () => {
    li.remove();
    actualizarContador();
  });

  lista.appendChild(li);
  inputItem.value = '';
  inputItem.focus();
  actualizarContador();
}

function actualizarContador() {
  const total = lista.children.length;
  contador.textContent = total > 0
    ? `${total} item(s) en la lista`
    : 'Lista vacia';
}

btnAgregar.addEventListener('click', agregarItem);
inputItem.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') agregarItem();
});

actualizarContador();
```

### Ejemplo 2: Galeria de tarjetas

```javascript
// datos.js
const productos = [
  { id: 1, nombre: 'Laptop', precio: 1200, imagen: 'https://via.placeholder.com/200', categoria: 'Tecnologia' },
  { id: 2, nombre: 'Auriculares', precio: 80, imagen: 'https://via.placeholder.com/200', categoria: 'Tecnologia' },
  { id: 3, nombre: 'Mochila', precio: 45, imagen: 'https://via.placeholder.com/200', categoria: 'Accesorios' },
  { id: 4, nombre: 'Libro JS', precio: 30, imagen: 'https://via.placeholder.com/200', categoria: 'Educacion' }
];

function renderizarProductos(contenedorId, listaProductos) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = '';

  listaProductos.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('producto-card');
    card.dataset.id = producto.id;
    card.dataset.categoria = producto.categoria;

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p class="categoria">${producto.categoria}</p>
      <p class="precio">$${producto.precio}</p>
      <button class="btn-detalle">Ver detalle</button>
    `;

    contenedor.appendChild(card);
  });
}
```

---

## 5. Comparaciones / Tablas

### textContent vs innerHTML vs innerText

| Propiedad | Lee HTML | Escribe HTML | Seguro (XSS) | Performance |
|-----------|:---:|:---:|:---:|:---:|
| `textContent` | No | No | Si | Rapido |
| `innerHTML` | Si | Si | No | Medio |
| `innerText` | No | No | Si | Lento (recalcula layout) |

### createElement vs innerHTML

| Aspecto | createElement + appendChild | innerHTML |
|---------|:---:|:---:|
| Seguridad | Mas seguro | Riesgo XSS |
| Performance (pocos) | Similar | Similar |
| Performance (muchos) | Mas lento | Mas rapido |
| Eventos existentes | Se preservan | Se pierden |
| Legibilidad | Mas codigo | Mas conciso |
| Uso recomendado | Datos del usuario | HTML estatico confiable |

### Metodos de insercion

| Metodo | Posicion | Acepta |
|--------|----------|--------|
| `appendChild(nodo)` | Al final del padre | Solo nodos |
| `prepend(nodo)` | Al inicio del padre | Nodos y strings |
| `append(nodo)` | Al final del padre | Nodos y strings, multiples |
| `before(nodo)` | Antes del elemento | Nodos y strings |
| `after(nodo)` | Despues del elemento | Nodos y strings |
| `insertBefore(nuevo, ref)` | Antes del nodo referencia | Solo nodos |
| `insertAdjacentHTML(pos, html)` | 4 posiciones posibles | Solo strings HTML |

---

## 6. Funcionalidades Complementarias

### Data attributes

Los atributos `data-*` permiten almacenar datos personalizados en elementos HTML:

```html
<div class="producto" data-id="123" data-categoria="tech" data-precio="99.99">
  Producto ejemplo
</div>
```

```javascript
const producto = document.querySelector('.producto');

// Leer data attributes
console.log(producto.dataset.id);        // "123"
console.log(producto.dataset.categoria); // "tech"
console.log(producto.dataset.precio);    // "99.99"

// Escribir data attributes
producto.dataset.stock = '5';
// Resultado: <div ... data-stock="5">

// Seleccionar por data attribute
const techProducts = document.querySelectorAll('[data-categoria="tech"]');
```

### Fragment para mejor performance

```javascript
// Sin fragment: cada appendChild causa un reflow
const lista = document.querySelector('ul');
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  lista.appendChild(li); // 100 reflows
}

// Con fragment: un solo reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
lista.appendChild(fragment); // 1 solo reflow
```

### Clonar nodos

```javascript
const original = document.querySelector('.template-card');
const copia = original.cloneNode(true);  // true = copia profunda (con hijos)
const copiaSuperficial = original.cloneNode(false); // solo el elemento, sin hijos
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

Crear la estructura:

```
practica-02/
  index.html
  css/
    styles.css
  js/
    app.js
```

El HTML debe tener:
- Un encabezado con el titulo de la aplicacion
- Un contenedor `<div id="app">` donde se renderizara todo el contenido dinamico
- El CSS enlazado y el JS con `defer`

### Paso 2: Crear datos de ejemplo

En `app.js`, crear un array de objetos que represente una lista de elementos (por ejemplo: tareas, productos, contactos, peliculas). Cada objeto debe tener al menos 5 propiedades.

Ejemplo de estructura (el estudiante debe elegir su propio dominio):

```javascript
const elementos = [
  { id: 1, titulo: '...', descripcion: '...', categoria: '...', activo: true },
  // al menos 6 elementos
];
```

### Paso 3: Renderizar la lista en el DOM

Crear una funcion `renderizarLista(datos)` que:
1. Seleccione el contenedor `#app`
2. Limpie su contenido
3. Cree una tarjeta (card) por cada elemento del array
4. Cada tarjeta debe mostrar todas las propiedades del objeto
5. Usar `createElement` y `classList.add` para estructurar las cards
6. Usar `document.createDocumentFragment()` para optimizar

### Paso 4: Agregar funcionalidad de eliminar

Cada tarjeta debe tener un boton "Eliminar" que:
1. Elimine el elemento del array original
2. Vuelva a renderizar la lista
3. Actualice un contador visible en la pagina

### Paso 5: Agregar filtrado basico

Crear botones de filtro (por categoria u otra propiedad) que:
1. Filtren el array con `.filter()`
2. Rendericen solo los elementos filtrados
3. Resalten visualmente el filtro activo usando `classList`

### Paso 6: Estilos CSS

Aplicar estilos para:
- Layout con CSS Grid o Flexbox para las tarjetas
- Hover effects en las tarjetas
- Boton de eliminar con color rojo
- Filtros activos resaltados
- Responsive design basico

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Estructura del proyecto** - Explorador de archivos con la organizacion 
2. **Lista renderizada** - Pagina con todas las tarjetas visibles
3. **Eliminacion de elemento** - Antes y despues de eliminar una tarjeta
4. **Filtrado activo** - Vista filtrada por una categoria
5. **Consola limpia** - DevTools mostrando que no hay errores
6. **Codigo fuente** - Capturas de `app.js` mostrando las funciones principales

### Formato del Archivo de Evidencias

```markdown
### 1. Lista renderizada
![Lista](assets/01-lista-renderizada.png)
**Descripcion:** Se muestran N tarjetas generadas dinamicamente...

### 2. Eliminacion
![Eliminar](assets/02-eliminacion.png)
**Descripcion:** Al hacer click en eliminar, la tarjeta se remueve...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias
- Codigo funcional sin errores en consola

---

## Reglas

- No usar frameworks (React, Angular, Vue, etc.)
- Solo HTML + CSS + JavaScript puro
- No usar librerias externas
- No usar `document.write()`
- Usar `textContent` en lugar de `innerHTML` cuando se insertan datos del usuario
- Usar `querySelector` / `querySelectorAll` como selectores principales

---

## Notas de Implementacion

- El DOM se manipula despues de que el HTML se ha cargado (usar `defer` en el script)
- `querySelectorAll` retorna un `NodeList` estatico, no se actualiza automaticamente
- Cada modificacion al DOM puede causar un reflow/repaint, agrupar cambios cuando sea posible
- Los data attributes (`data-*`) son utiles para almacenar metadata en elementos HTML

---


