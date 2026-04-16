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

## 3. Explicacion Tecnica 

### Modificar contenido

```javascript
const titulo = document.querySelector('#titulo');

// textContent: solo texto, ignora HTML (RECOMENDADO)
titulo.textContent = 'Nuevo titulo';

// innerText: similar a textContent pero respeta estilos CSS (display: none, etc.)
titulo.innerText = 'Texto visible';

// innerHTML: interpreta HTML (NO RECOMENDADO - riesgo de seguridad)
// Solo usar con contenido estático confiable, NUNCA con datos de usuario
titulo.innerHTML = 'Titulo <strong>importante</strong>';
```

**Seguridad - innerHTML es un riesgo:**

`innerHTML` permite ataques XSS (Cross-Site Scripting) y debe evitarse en la mayoría de casos:
```html
<p id="titulo"></p>
```
```javascript
const elemento = document.getElementById('titulo');
const userInput = '<script>alert("XSS")</script>';

//  Peligroso: interpreta el contenido como HTML
elemento.innerHTML = userInput;

//  Seguro: lo muestra como texto plano
elemento.textContent = userInput;
```

**Recomendación:** Definir la estructura HTML en el archivo `.html` y usar JS solo para actualizar el contenido con `textContent`. Esto prepara el código para frameworks modernos y mejora la seguridad.

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

**Enfoque recomendado:** `createElement` + `textContent`

```javascript
// Crear un nuevo elemento
const nuevoParrafo = document.createElement('p');
nuevoParrafo.textContent = 'Este parrafo fue creado con JavaScript';
nuevoParrafo.classList.add('parrafo-nuevo');

// Crear un elemento más complejo
const card = document.createElement('div');
card.classList.add('card');

const h3 = document.createElement('h3');
h3.textContent = 'Titulo de la card';

const p = document.createElement('p');
p.textContent = 'Descripcion de la card';

const button = document.createElement('button');
button.textContent = 'Ver mas';

// Ensamblar
card.appendChild(h3);
card.appendChild(p);
card.appendChild(button);

// Insertar en el DOM
const contenedor = document.querySelector('#contenedor');
contenedor.appendChild(card);
```

**Alternativa con innerHTML (no recomendada para datos dinámicos):**

```javascript
// Solo usar con contenido estático confiable
const card = document.createElement('div');
card.classList.add('card');
card.innerHTML = `
  <h3>Titulo estatico</h3>
  <p>Descripcion estatica</p>
  <button>Ver mas</button>
`;
```

**Métodos de inserción en el DOM:**

```javascript
const contenedor = document.querySelector('#contenedor');
const elemento = document.createElement('div');

contenedor.appendChild(elemento);                         // al final
contenedor.prepend(elemento);                             // al inicio
contenedor.insertBefore(elemento, contenedor.firstChild); // antes de un hijo
contenedor.append(elemento, nuevoParrafo);                // multiples al final

// insertAdjacentHTML: insertar HTML en posiciones especificas
//  Solo con contenido estático confiable
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

  // Crear estructura con createElement
  const li = document.createElement('li');
  
  const spanTexto = document.createElement('span');
  spanTexto.textContent = texto; //  textContent, no innerHTML
  
  const spanEliminar = document.createElement('span');
  spanEliminar.className = 'eliminar';
  spanEliminar.textContent = 'X';
  spanEliminar.addEventListener('click', () => {
    li.remove();
    actualizarContador();
  });

  li.appendChild(spanTexto);
  li.appendChild(spanEliminar);

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
  contenedor.innerHTML = ''; // Limpiar contenedor

  listaProductos.forEach(producto => {
    // Crear estructura de la tarjeta
    const card = document.createElement('div');
    card.classList.add('producto-card');
    card.dataset.id = producto.id;
    card.dataset.categoria = producto.categoria;

    // Crear elementos internos
    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const h3 = document.createElement('h3');
    h3.textContent = producto.nombre; // textContent

    const pCategoria = document.createElement('p');
    pCategoria.className = 'categoria';
    pCategoria.textContent = producto.categoria;

    const pPrecio = document.createElement('p');
    pPrecio.className = 'precio';
    pPrecio.textContent = `$${producto.precio}`;

    const btnDetalle = document.createElement('button');
    btnDetalle.className = 'btn-detalle';
    btnDetalle.textContent = 'Ver detalle';

    // Ensamblar tarjeta
    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(pCategoria);
    card.appendChild(pPrecio);
    card.appendChild(btnDetalle);

    contenedor.appendChild(card);
  });
}
```

---

## 5. Comparaciones / Tablas

### textContent vs innerHTML vs innerText

| Propiedad | Lee HTML | Escribe HTML | Seguro (XSS) | Performance | Uso recomendado |
|-----------|:---:|:---:|:---:|:---:|:---:|
| `textContent` | No | No | ✅ Si | Rapido | **Por defecto** |
| `innerHTML` | Si | Si | ❌ No | Medio | Evitar / Solo HTML estatico |
| `innerText` | No | No | ✅ Si | Lento (recalcula layout) | Cuando importa visibilidad CSS |

### createElement + textContent vs innerHTML

| Aspecto | createElement + textContent | innerHTML |
|---------|:---:|:---:|
| Seguridad | ✅ Más seguro | ⚠️ Riesgo XSS |
| Performance (pocos) | Similar | Similar |
| Performance (muchos) | Optimizable (Fragment) | Más rápido |
| Eventos existentes | ✅ Se preservan | ❌ Se pierden |
| Legibilidad | Más código pero explícito | Más conciso |
| Preparación para frameworks | ✅ Sí (separa estructura/contenido) | ❌ No (mezcla todo) |
| Uso recomendado | **Por defecto** | Solo limpiar contenedores |

**Mejor práctica:** Estructura con `createElement`, contenido con `textContent`. innerHTML solo para limpiar: `elemento.innerHTML = ''`

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
- En body un contenedor `<div id="app">` donde se renderizara todo el contenido dinamico
- El CSS enlazado y el JS con `defer`
- Titulo: `Práctica 2 - DOM`


### Paso 2: Crear estructura HTML y datos

#### 2.1 Estructura HTML base

En `index.html`, definir la estructura con elementos vacíos que se llenaran con JS:

- Div info-estudiante

  ![info-estudiante](assets/p2-1.png)

- Div estadisticas

  ![info-estadisticas](assets/p2-2.png)

- Div filtros
- Div contenedor-lista con filtro


  ![info-estudiante](assets/p2-3.png)


```html
  <div id="app">

    <div class="info-estudiante">
      <h2>Información del Estudiante</h2>
      <p><strong>Nombre:</strong> <span id="estudiante-nombre"></span></p>
      <p><strong>Carrera:</strong> <span id="estudiante-carrera"></span></p>
      <p><strong>Semestre:</strong> <span id="estudiante-semestre"></span></p>
    </div>

    <div class="estadisticas">
      <h2>Estadísticas</h2>
      <p><strong>Total:</strong> <span id="total-elementos"></span></p>
      <p><strong>Activos:</strong> <span id="elementos-activos"></span></p>
    </div>

    <div class="filtros">
      <button class="btn-filtro btn-filtro-activo" data-categoria="todas">Todas</button>
      <button class="btn-filtro" data-categoria="Trabajo">Trabajo</button>
      <button class="btn-filtro" data-categoria="Personal">Personal</button>
      <button class="btn-filtro" data-categoria="Estudio">Estudio</button>
    </div>

    <div id="contenedor-lista">

      <!-- Las tarjetas se insertarán aquí -->
    </div>

  </div>
```

#### 2.2 Datos en JavaScript

En `app.js`, crear:
- Información del estudiante (const)
- Array de objetos con al menos 6 elementos y 5 propiedades cada uno

```javascript
'use strict';

// Información del estudiante
const estudiante = {
  nombre: 'Tu Nombre Completo',
  carrera: 'Ingeniería de Sistemas',
  semestre: 5
};

// Lista de elementos (elegir un dominio: tareas, productos, películas, etc.)
const elementos = [
  { id: 1, titulo: 'Proyecto Web', descripcion: 'Terminar práctica JS', categoria: 'Estudio', prioridad: 'Alta', activo: true },
  { id: 2, titulo: 'Comprar comida', descripcion: 'Ir al supermercado', categoria: 'Personal', prioridad: 'Media', activo: true },
  { id: 3, titulo: 'Reunión', descripcion: 'Equipo de trabajo', categoria: 'Trabajo', prioridad: 'Alta', activo: false },
  { id: 4, titulo: 'Leer libro', descripcion: 'Capítulo de JS', categoria: 'Estudio', prioridad: 'Baja', activo: true },
  { id: 5, titulo: 'Ejercicio', descripcion: 'Salir a correr', categoria: 'Personal', prioridad: 'Media', activo: false },
  { id: 6, titulo: 'Deploy', descripcion: 'Subir proyecto', categoria: 'Trabajo', prioridad: 'Alta', activo: true }
];
```

### Paso 3: Actualizar información del estudiante

Crear una función `mostrarInfoEstudiante()` que:
1. Seleccione los elementos por ID usando `getElementById`
2. Actualice su contenido con `textContent`
3. Use template literals para formatear cuando sea necesario

```javascript
function mostrarInfoEstudiante() {
  document.getElementById('estudiante-nombre').textContent = estudiante.nombre;
  document.getElementById('estudiante-carrera').textContent = estudiante.carrera;
  document.getElementById('estudiante-semestre').textContent = `${estudiante.semestre}° semestre`;
}
```

### Paso 4: Renderizar la lista con enfoque híbrido

**Enfoque recomendado:** Crear la estructura HTML de cada tarjeta con `createElement`, luego llenar el contenido con `textContent`.

```javascript
function renderizarLista(datos) {
  const contenedor = document.getElementById('contenedor-lista');
  contenedor.innerHTML = '';

  const fragment = document.createDocumentFragment();

  datos.forEach(el => {

    const card = document.createElement('div');
    card.classList.add('card');

    const titulo = document.createElement('h3');
    titulo.textContent = el.titulo;

    const descripcion = document.createElement('p');
    descripcion.textContent = el.descripcion;

    const categoria = document.createElement('span');
    categoria.textContent = el.categoria;
    categoria.classList.add('badge', 'badge-categoria');

    const prioridad = document.createElement('span');
    prioridad.textContent = el.prioridad;
    prioridad.classList.add('badge');
    if (el.prioridad === 'Alta') {
  prioridad.classList.add('prioridad-alta');
} else if (el.prioridad === 'Media') {
  prioridad.classList.add('prioridad-media');
} else {
  prioridad.classList.add('prioridad-baja');
}

    const estado = document.createElement('span');
    estado.textContent = el.activo ? 'Activo' : 'Inactivo';
    estado.classList.add('badge');
    estado.classList.add(
      el.activo ? 'estado-activo' : 'estado-inactivo'
    );


    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn-eliminar');

    btnEliminar.addEventListener('click', () => {
      eliminarElemento(el.id);
    });

    card.appendChild(titulo);
    card.appendChild(descripcion);
    // CONTENEDOR DE BADGES
    const badges = document.createElement('div');
    badges.classList.add('badges');

    badges.appendChild(categoria);
    badges.appendChild(prioridad);
    badges.appendChild(estado);

    // ACCIONES
    const acciones = document.createElement('div');
    acciones.classList.add('card-actions');
    acciones.appendChild(btnEliminar);

    // ENSAMBLE FINAL
    card.appendChild(titulo);
    card.appendChild(descripcion);
    card.appendChild(badges);
    card.appendChild(acciones);

    fragment.appendChild(card);
  });

  contenedor.appendChild(fragment);
  actualizarEstadisticas();
}
```

**Ventajas de este enfoque:**
- ✅ Seguro: no usa innerHTML con datos
- ✅ Prepara para frameworks (Angular, React trabajan con DOM existente)
- ✅ Separa estructura (createElement) de contenido (textContent)
- ✅ Facilita evaluación: se ve el manejo directo del DOM

### Paso 5: Agregar funcionalidad de eliminar

Implementar la función de eliminación:

```javascript
function eliminarElemento(id) {
  const index = elementos.findIndex(el => el.id === id);
  if (index !== -1) {
    elementos.splice(index, 1);
    renderizarLista(elementos);
  }
}

function actualizarEstadisticas() {
  const total = elementos.length;
  const activos = elementos.filter(el => el.activo).length;
  
  document.getElementById('total-elementos').textContent = total;
  document.getElementById('elementos-activos').textContent = activos;
}
```

### Paso 6: Agregar filtrado básico

Crear botones de filtro (por categoria u otra propiedad) que:
1. Filtren el array con `.filter()`
2. Rendericen solo los elementos filtrados
3. Resalten visualmente el filtro activo usando `classList`

```javascript
function inicializarFiltros() {
  const botones = document.querySelectorAll('.btn-filtro');

  botones.forEach(btn => {
    btn.addEventListener('click', () => {

      const categoria = btn.dataset.categoria;

      document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('btn-filtro-activo'));
      btn.classList.add('btn-filtro-activo');

      if (categoria === 'todas') {
        renderizarLista(elementos);
      } else {
        const filtrados = elementos.filter(e => e.categoria === categoria);
        renderizarLista(filtrados);
      }
    });
  });
}
```

### Paso 7: Inicialización

Al cargar la página, ejecutar:

```javascript
// Inicializar aplicación
mostrarInfoEstudiante();
renderizarLista(elementos);
inicializarFiltros();
```

### Paso 8: Estilos CSS

Aplicar estilos para conseguir el estio mas similar:
- Layout con CSS Grid o Flexbox para las tarjetas
- Hover effects en las tarjetas
- Boton de eliminar con color rojo
- Filtros activos resaltados
- Responsive design basico


![alt text](assets/p2-4.png)

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

### 9. Entregables

### 9.1 Estructura del repositorio

El estudiante deberá subir su solución en GitHub respetando la siguiente estructura:

/02-dom-basico
  ├── index.html
  ├── css/
  │     └── styles.css
  ├── js/
  │     └── app.js
  ├── assets/
  │     ├── 01-vista-general.png
  │     ├── 02-filtrado.png
  │     └── ...
  └── README.md

---

### 9.2 README (informe)

Debe incluir:

- Descripción breve de la solución
- Fragmentos de código relevantes
- Imágenes insertadas correctamente desde `/assets`

#### 9.2.1 Código

- Ejemplos de funciones principales:
  - renderizado de la lista
  - eliminación de elementos
  - filtrado

#### 9.2.2 Imágenes

1. Vista general de la aplicación  
2. Filtrado aplicado

---



