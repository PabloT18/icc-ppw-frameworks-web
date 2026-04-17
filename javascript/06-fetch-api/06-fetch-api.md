# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 6: Fetch API y Consumo de Servicios

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

**Fetch API** es la interfaz moderna de JavaScript para realizar peticiones HTTP desde el navegador. Reemplaza al antiguo `XMLHttpRequest` con una API basada en promesas, mas limpia y potente. Con Fetch se puede consumir APIs REST, enviar formularios, descargar archivos y cualquier comunicacion cliente-servidor.

### Que es una API REST?

Una API REST expone recursos a traves de URLs y usa metodos HTTP para operar sobre ellos:

| Metodo HTTP | Operacion | Ejemplo URL | Descripcion |
|:-:|:-:|:-:|:-:|
| GET | Leer | `/api/usuarios` | Obtener lista de usuarios |
| GET | Leer uno | `/api/usuarios/1` | Obtener usuario con id 1 |
| POST | Crear | `/api/usuarios` | Crear un nuevo usuario |
| PUT | Actualizar | `/api/usuarios/1` | Reemplazar usuario 1 |
| PATCH | Actualizar parcial | `/api/usuarios/1` | Modificar campos del usuario 1 |
| DELETE | Eliminar | `/api/usuarios/1` | Eliminar usuario 1 |

---

## 2. Conceptos Clave

### Anatomia de una peticion HTTP

```
GET /api/usuarios HTTP/1.1
Host: jsonplaceholder.typicode.com
Content-Type: application/json
Authorization: Bearer token123
```

### Anatomia de una respuesta HTTP

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 1, "name": "Leanne Graham" },
  { "id": 2, "name": "Ervin Howell" }
]
```

### Codigos de estado HTTP

| Rango | Significado | Ejemplos |
|:-:|:-:|:-:|
| 1xx | Informativo | 100 Continue |
| 2xx | Exito | 200 OK, 201 Created, 204 No Content |
| 3xx | Redireccion | 301 Moved, 304 Not Modified |
| 4xx | Error del cliente | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Error del servidor | 500 Internal Server Error, 503 Service Unavailable |

### APIs publicas para practicar

| API | URL Base | Descripcion |
|-----|----------|-------------|
| JSONPlaceholder | `https://jsonplaceholder.typicode.com` | Datos ficticios (users, posts, comments) |
| PokeAPI | `https://pokeapi.co/api/v2` | Datos de Pokemon |
| RestCountries | `https://restcountries.com/v3.1` | Datos de paises |
| Dog CEO | `https://dog.ceo/api` | Imagenes aleatorias de perros |

---

## 3. Explicacion Tecnica Detallada

### Sintaxis basica de fetch

```javascript
// fetch retorna una Promise
// La respuesta es un objeto Response
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => {
    console.log(response.status);  // 200
    console.log(response.ok);      // true (status 200-299)
    return response.json();        // parsear JSON (tambien retorna Promise)
  })
  .then(datos => {
    console.log(datos); // Array de usuarios
  })
  .catch(error => {
    console.error('Error de red:', error);
  });
```

### fetch con async/await

```javascript
async function obtenerUsuarios() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    // fetch NO lanza error en 404 o 500 - solo en errores de red
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const usuarios = await response.json();
    return usuarios;

  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}
```

### GET - Obtener datos

```javascript
// Obtener un recurso por ID
async function obtenerUsuario(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
}

// Obtener con query parameters
async function buscarPosts(userId) {
  const params = new URLSearchParams({ userId, _limit: 5 });
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?${params}`);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
}
```

### POST - Crear datos

```javascript
async function crearPost(nuevoPost) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoPost)
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const postCreado = await response.json();
  console.log('Post creado con ID:', postCreado.id);
  return postCreado;
}

// Uso
crearPost({
  title: 'Mi primer post',
  body: 'Contenido del post',
  userId: 1
});
```

### PUT - Actualizar (reemplazo completo)

```javascript
async function actualizarPost(id, datosActualizados) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosActualizados)
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
}
```

### PATCH - Actualizar parcialmente

```javascript
async function actualizarCampo(id, campo) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(campo) // solo los campos a cambiar
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
}

// Uso: solo cambia el titulo
actualizarCampo(1, { title: 'Titulo actualizado' });
```

### DELETE - Eliminar

```javascript
async function eliminarPost(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);
  console.log(`Post ${id} eliminado`);
  return true;
}
```

### Objeto Response - propiedades y metodos

```javascript
const response = await fetch(url);

// Propiedades
response.ok;         // boolean, true si status 200-299
response.status;     // numero, 200, 404, 500, etc.
response.statusText; // string, 'OK', 'Not Found', etc.
response.headers;    // objeto Headers
response.url;        // URL final (despues de redirects)

// Metodos (cada uno retorna Promise, solo se puede usar UNO)
await response.json();  // parsear como JSON
await response.text();  // texto plano
await response.blob();  // datos binarios (imagenes, archivos)
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: CRUD completo con JSONPlaceholder

```javascript
'use strict';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// --- SERVICIOS ---
const PostService = {
  async getAll(limit = 10) {
    const response = await fetch(`${API_URL}?_limit=${limit}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async create(post) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async update(id, post) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return true;
  }
};

// --- COMPONENTES ---
function PostCard(post) {
  return `
    <div class="post-card" data-id="${post.id}">
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <div class="post-card__actions">
        <button data-action="editar" data-id="${post.id}">Editar</button>
        <button data-action="eliminar" data-id="${post.id}">Eliminar</button>
      </div>
    </div>
  `;
}

function Spinner() {
  return '<div class="spinner">Cargando...</div>';
}

function ErrorMessage(mensaje) {
  return `<div class="error">${mensaje}</div>`;
}

// --- ESTADO Y RENDER ---
const contenedor = document.querySelector('#posts');
const form = document.querySelector('#form-post');

async function cargarPosts() {
  contenedor.innerHTML = Spinner();
  try {
    const posts = await PostService.getAll();
    contenedor.innerHTML = posts.map(p => PostCard(p)).join('');
  } catch (error) {
    contenedor.innerHTML = ErrorMessage(error.message);
  }
}

// --- EVENTOS ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const nuevoPost = {
    title: formData.get('title'),
    body: formData.get('body'),
    userId: 1
  };

  try {
    const creado = await PostService.create(nuevoPost);
    console.log('Creado:', creado);
    form.reset();
    await cargarPosts();
  } catch (error) {
    console.error('Error al crear:', error);
  }
});

contenedor.addEventListener('click', async (e) => {
  if (e.target.matches('[data-action="eliminar"]')) {
    const id = e.target.dataset.id;
    if (confirm('Eliminar este post?')) {
      try {
        await PostService.delete(id);
        e.target.closest('.post-card').remove();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }
});

// Iniciar
cargarPosts();
```

### Ejemplo 2: Buscador de Pokemon con PokeAPI

```javascript
'use strict';

const POKE_URL = 'https://pokeapi.co/api/v2/pokemon';

async function buscarPokemon(nombre) {
  const response = await fetch(`${POKE_URL}/${nombre.toLowerCase()}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Pokemon no encontrado');
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}

function PokemonCard(pokemon) {
  const tipos = pokemon.types.map(t => t.type.name).join(', ');
  return `
    <div class="pokemon-card">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <p><strong>ID:</strong> #${pokemon.id}</p>
      <p><strong>Tipo:</strong> ${tipos}</p>
      <p><strong>Altura:</strong> ${pokemon.height / 10}m</p>
      <p><strong>Peso:</strong> ${pokemon.weight / 10}kg</p>
      <div class="pokemon-stats">
        <h4>Estadisticas</h4>
        ${pokemon.stats.map(s => `
          <div class="stat">
            <span>${s.stat.name}</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${Math.min(s.base_stat, 100)}%">
                ${s.base_stat}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Busqueda
const formBusqueda = document.querySelector('#form-busqueda');
const resultado = document.querySelector('#resultado');

formBusqueda.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.querySelector('#input-pokemon').value.trim();
  if (!nombre) return;

  resultado.innerHTML = '<p>Buscando...</p>';

  try {
    const pokemon = await buscarPokemon(nombre);
    resultado.innerHTML = PokemonCard(pokemon);
  } catch (error) {
    resultado.innerHTML = `<p class="error">${error.message}</p>`;
  }
});
```

---

## 5. Comparaciones / Tablas

### fetch vs XMLHttpRequest

| Criterio | fetch | XMLHttpRequest |
|----------|:-:|:-:|
| Sintaxis | Promesas (moderna) | Callbacks (antigua) |
| Legibilidad | Alta | Baja |
| Soporte streams | Si | No |
| Cancelacion | AbortController | abort() nativo |
| Cookies | No envia por defecto en cross-origin | Envia por defecto |
| Error en 404 | NO lanza error | NO lanza error |
| Soporte | Navegadores modernos | Todos |

### Metodos HTTP

| Metodo | Idempotente | Body | Cache | Uso |
|--------|:-:|:-:|:-:|:-:|
| GET | Si | No | Si | Leer datos |
| POST | No | Si | No | Crear datos |
| PUT | Si | Si | No | Reemplazar datos completos |
| PATCH | No | Si | No | Actualizar campos parciales |
| DELETE | Si | Opcional | No | Eliminar datos |

### Metodos de parseo de Response

| Metodo | Retorna | Uso |
|--------|---------|-----|
| `response.json()` | Object/Array | APIs REST con JSON |
| `response.text()` | String | HTML, XML, texto plano |
| `response.blob()` | Blob | Imagenes, archivos binarios |
| `response.formData()` | FormData | Datos de formulario |
| `response.arrayBuffer()` | ArrayBuffer | Datos binarios raw |

---

## 6. Funcionalidades Complementarias

### URLSearchParams para query strings

```javascript
// Construir query parameters de forma limpia
const params = new URLSearchParams({
  q: 'javascript',
  page: 1,
  limit: 20,
  sort: 'date'
});

console.log(params.toString()); // 'q=javascript&page=1&limit=20&sort=date'
const url = `https://api.ejemplo.com/buscar?${params}`;
```

### AbortController para cancelar peticiones

```javascript
// Cancelar peticion si tarda demasiado
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

try {
  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  return response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Peticion cancelada por timeout');
  }
}
```

### Patron de servicio reutilizable

```javascript
// apiService.js - Wraper reutilizable para fetch
const ApiService = {
  baseUrl: 'https://jsonplaceholder.typicode.com',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options
    };

    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.status === 204 ? null : response.json();
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) });
  },

  put(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};
```

### Manipulacion del DOM: createElement vs innerHTML

**¿Por qué NO usar innerHTML?**

Aunque `innerHTML` parece conveniente, tiene problemas serios:

| Problema | Descripción | Impacto |
|----------|-------------|---------|
| **Seguridad (XSS)** | Interpreta HTML, permitiendo inyección de scripts | Crítico |
| **Performance** | Destruye y reconstruye todo el subárbol del DOM | Alto |
| **Event Listeners** | Se pierden los eventos al reemplazar innerHTML | Alto |
| **Mantenibilidad** | Strings de HTML mezclados con JavaScript | Medio |

**Ejemplo del problema de XSS:**

```javascript
// PELIGROSO: Si 'nombre' viene del usuario
const nombre = '<img src=x onerror="alert(\'XSS\')">';
div.innerHTML = `<p>Hola ${nombre}</p>`;
// Ejecuta el script malicioso
```

**Enfoque correcto: API del DOM**

```javascript
// SEGURO: textContent no interpreta HTML
function crearTarjeta(post) {
  // 1. Crear estructura
  const article = document.createElement('article');
  article.className = 'post-card';
  
  // 2. Crear elementos internos
  const titulo = document.createElement('h3');
  titulo.textContent = post.title; // SEGURO: no interpreta HTML
  
  const contenido = document.createElement('p');
  contenido.textContent = post.body;
  
  // 3. Ensamblar
  article.appendChild(titulo);
  article.appendChild(contenido);
  
  // 4. Retornar elemento del DOM
  return article;
}

// Uso
const tarjeta = crearTarjeta({ title: 'Hola', body: 'Mundo' });
contenedor.appendChild(tarjeta);
```

**Métodos clave de la API del DOM:**

| Método | Propósito | Ejemplo |
|--------|-----------|---------|
| `document.createElement(tag)` | Crear un elemento | `const div = document.createElement('div')` |
| `element.textContent = text` | Asignar texto (seguro) | `h1.textContent = 'Título'` |
| `element.appendChild(child)` | Agregar hijo al final | `div.appendChild(p)` |
| `element.classList.add(class)` | Agregar clase CSS | `div.classList.add('active')` |
| `element.dataset.id = value` | Asignar data-* | `button.dataset.id = '123'` |
| `element.setAttribute(attr, val)` | Asignar atributo | `img.setAttribute('alt', 'Logo')` |

**Cuándo SÍ usar innerHTML (casos limitados):**

1. **Contenido estático conocido**: HTML que tú escribes, sin datos del usuario
2. **Plantillas iniciales**: Cargar estructura fija al inicio
3. **Limpiar contenedor**: `element.innerHTML = ''` es válido (aunque `element.replaceChildren()` es mejor)

```javascript
// OK: contenido estático
div.innerHTML = '<p>Bienvenido</p><button>Continuar</button>';

// NUNCA: datos dinámicos o del usuario
div.innerHTML = `<p>${userData}</p>`; // ❌ PELIGROSO
```

**Buena práctica:**

- Para contenido dinámico: **SIEMPRE** usar `createElement` + `textContent` + `appendChild`
- Para limpiar: usar `innerHTML = ''` o mejor `element.replaceChildren()`
- Nunca interpolar datos del usuario en strings HTML

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

Crear la estructura:

```
practica-06/
  index.html
  css/
    styles.css
  js/
    apiService.js
    components.js
    app.js
```

### Paso 2: HTML completo (copiar)

**¿Qué hace este paso?** Proporciona toda la estructura HTML necesaria para la práctica. El HTML incluye un formulario para crear/editar posts, una barra de búsqueda y un contenedor para la lista de posts. Copiar exactamente este código en `index.html`.

En `index.html`, copiar la estructura completa:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Práctica 6 - Fetch API</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <main class="page">
    <!-- SECCIÓN 1: FORMULARIO -->
    <section class="container">
      <h1>Gestor de Posts</h1>
      
      <form id="form-post" class="form-post">
        <input type="hidden" id="post-id">
        
        <div class="form-group">
          <label for="titulo">Título *</label>
          <input type="text" id="titulo" placeholder="Título del post" required>
        </div>

        <div class="form-group">
          <label for="contenido">Contenido *</label>
          <textarea id="contenido" rows="4" placeholder="Contenido del post..." required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" id="btn-submit">Crear Post</button>
          <button type="button" id="btn-cancelar" class="btn-secondary" style="display: none;">Cancelar</button>
        </div>
      </form>
    </section>

    <!-- SECCIÓN 2: FILTROS Y BÚSQUEDA -->
    <section class="container">
      <div class="search-bar">
        <input type="search" id="input-buscar" placeholder="Buscar posts...">
        <button type="button" id="btn-buscar">Buscar</button>
        <button type="button" id="btn-limpiar" class="btn-secondary">Limpiar</button>
      </div>
      
      <div class="stats">
        <p id="contador">Total: <strong>0</strong> posts</p>
      </div>
    </section>

    <!-- SECCIÓN 3: LISTA DE POSTS -->
    <section class="container">
      <h2>Posts</h2>
      
      <div id="lista-posts" class="lista-posts">
        <!-- Los posts se renderizan aquí dinámicamente -->
      </div>

      <div id="mensaje-estado" class="mensaje-estado"></div>
    </section>
  </main>

  <script defer src="js/apiService.js"></script>
  <script defer src="js/components.js"></script>
  <script defer src="js/app.js"></script>
</body>
</html>
```

### Paso 3: CSS completo (copiar)

**¿Qué hace este paso?** Define todos los estilos necesarios para la aplicación: diseño responsive, tarjetas de posts, formulario, spinner de carga, mensajes de error/éxito y animaciones. Los estilos están en el archivo `solver/06-fetch-api/css/styles.css`.

En `css/styles.css`, copiar todos los estilos:

Tomar de `solver/06-fetch-api/css/styles.css`

### Paso 4: JavaScript Parte 1 - API Service (copiar y completar)

En `js/apiService.js`, crear el servicio que encapsula todas las peticiones HTTP a JSONPlaceholder:

#### 4.1 Estructura base del servicio (copiar)

**¿Qué hace este código?** Define un objeto `ApiService` que centraliza todas las llamadas a la API REST. Tiene un método genérico `request()` que maneja la configuración de fetch, validación de respuestas y manejo de errores para evitar repetir código.

```javascript
'use strict';

/* =========================
   API SERVICE
========================= */

const ApiService = {
  baseUrl: 'https://jsonplaceholder.typicode.com',

  /**
   * Método genérico para hacer peticiones HTTP
   * @param {string} endpoint - Ruta del endpoint (ej: '/posts')
   * @param {object} options - Opciones de fetch (method, body, headers)
   * @returns {Promise} - Promesa con los datos parseados
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // Configuración por defecto
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      // fetch NO lanza error en 4xx/5xx - debemos verificar response.ok
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // Si es 204 No Content, no hay body que parsear
      if (response.status === 204) {
        return null;
      }

      return await response.json();

    } catch (error) {
      console.error('Error en petición:', error);
      throw error;
    }
  },
```

#### 4.2 Método GET - Obtener posts (completar)

**¿Qué hace este código?** Implementa el método GET para obtener posts desde la API. Usa el método `request()` pasando el endpoint y opcionalmente un límite de resultados.

```javascript
  /**
   * GET - Obtener todos los posts (con límite opcional)
   */
  async getPosts(limit = 10) {
    // TODO 4.2.1: Retornar el resultado de llamar a this.request() con el endpoint correcto
    //   return this.request(`/posts?_limit=${limit}`);
  },

  /**
   * GET - Obtener un post por ID
   */
  async getPostById(id) {
    // TODO 4.2.2: Retornar el resultado de llamar a this.request() con /posts/{id}
    //   return this.request(`/posts/${id}`);
  },
```

#### 4.3 Método POST - Crear post (completar)

**¿Qué hace este código?** Implementa el método POST para crear un nuevo post. Debe pasar `method: 'POST'` y el body con los datos serializados como JSON usando `JSON.stringify()`.

```javascript
  /**
   * POST - Crear un nuevo post
   */
  async createPost(postData) {
    // TODO 4.3.1: Retornar el resultado de llamar a this.request() con:
    //   - endpoint: '/posts'
    //   - options: { method: 'POST', body: JSON.stringify(postData) }
    //   return this.request('/posts', {
    //     method: 'POST',
    //     body: JSON.stringify(postData)
    //   });
  },
```

#### 4.4 Métodos PUT y DELETE (completar)

**¿Qué hace este código?** Implementa PUT para actualizar un post completo y DELETE para eliminarlo. Ambos requieren el ID en el endpoint.

```javascript
  /**
   * PUT - Actualizar un post completo
   */
  async updatePost(id, postData) {
    // TODO 4.4.1: Retornar el resultado de llamar a this.request() con:
    //   - endpoint: `/posts/${id}`
    //   - options: { method: 'PUT', body: JSON.stringify(postData) }
    //   return this.request(`/posts/${id}`, {
    //     method: 'PUT',
    //     body: JSON.stringify(postData)
    //   });
  },

  /**
   * DELETE - Eliminar un post
   */
  async deletePost(id) {
    // TODO 4.4.2: Retornar el resultado de llamar a this.request() con:
    //   - endpoint: `/posts/${id}`
    //   - options: { method: 'DELETE' }
    //   return this.request(`/posts/${id}`, {
    //     method: 'DELETE'
    //   });
  },

  /**
   * GET - Buscar posts por userId
   */
  async getPostsByUser(userId) {
    return this.request(`/posts?userId=${userId}`);
  }
};
```

### Paso 5: JavaScript Parte 2 - Componentes con manipulación del DOM (copiar y completar)

**¿Por qué NO usar innerHTML?**

Aunque `innerHTML` parece más simple y rápido, tiene problemas importantes:

1. **Seguridad (XSS)**: Si se insertan datos del usuario directamente, un atacante puede inyectar código malicioso
2. **Performance**: Destruye y recrea todo el subárbol del DOM, perdiendo event listeners
3. **Mantenibilidad**: Mezcla HTML con JavaScript en strings difíciles de depurar
4. **Estándares modernos**: La API del DOM (`createElement`, `appendChild`) es el enfoque recomendado

**Enfoque correcto: Construcción con la API del DOM**

En lugar de crear strings de HTML, construimos elementos reales del DOM usando:
- `document.createElement()` - Crear elementos
- `element.textContent` - Asignar texto (seguro, no interpreta HTML)
- `element.appendChild()` - Insertar en el DOM
- `element.classList.add()` - Agregar clases CSS
- `element.dataset` - Asignar atributos data-*

**¿Qué hace este código?** Define funciones que **construyen y retornan elementos del DOM** (no strings). Cada componente crea su estructura usando `createElement`, asigna datos con `textContent` y retorna el elemento completo listo para insertar en el documento.

En `js/components.js`, implementar los componentes:

#### 5.1 Componente PostCard - Construcción completa (copiar)

**¿Qué hace este código?** Construye una tarjeta de post usando únicamente la API del DOM. Crea cada elemento (article, header, título, botones), asigna textos con `textContent`, configura clases y data attributes, y ensambla todo con `appendChild`. Retorna el elemento `<article>` completo.

```javascript
'use strict';

/* =========================
   COMPONENTES
========================= */

/**
 * Componente para renderizar una tarjeta de post
 * Construye el elemento usando la API del DOM (createElement)
 * @param {object} post - Objeto con los datos del post
 * @returns {HTMLElement} - Elemento article del DOM
 */
function PostCard(post) {
  // Crear el contenedor principal
  const article = document.createElement('article');
  article.className = 'post-card fade-in';
  article.dataset.id = post.id;

  // Crear el header
  const header = document.createElement('div');
  header.className = 'post-card-header';

  const title = document.createElement('h3');
  title.className = 'post-card-title';
  title.textContent = post.title;

  const badge = document.createElement('span');
  badge.className = 'post-card-id';
  badge.textContent = `#${post.id}`;

  header.appendChild(title);
  header.appendChild(badge);

  // Crear el body
  const body = document.createElement('p');
  body.className = 'post-card-body';
  body.textContent = post.body;

  // Crear el footer con botones
  const footer = document.createElement('div');
  footer.className = 'post-card-footer';

  const btnEditar = document.createElement('button');
  btnEditar.className = 'btn-editar';
  btnEditar.textContent = 'Editar';
  btnEditar.dataset.action = 'editar';
  btnEditar.dataset.id = post.id;

  const btnEliminar = document.createElement('button');
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.dataset.action = 'eliminar';
  btnEliminar.dataset.id = post.id;

  footer.appendChild(btnEditar);
  footer.appendChild(btnEliminar);

  // Ensamblar el article
  article.appendChild(header);
  article.appendChild(body);
  article.appendChild(footer);

  return article;
}
```

#### 5.2 Componente Spinner (completar)

**¿Qué hace este código?** Crea el spinner de carga usando `createElement`. Construye un contenedor con la clase 'loading', dentro un div con clase 'spinner' (el círculo animado) y un párrafo con el texto. Los ensambla con `appendChild`.

```javascript
/**
 * Componente de spinner de carga
 * @returns {HTMLElement} - Elemento div del DOM
 */
function Spinner() {
  // TODO 5.2.1: Crear un div con className 'loading'
  //   const container = document.createElement('div');
  //   container.className = 'loading';

  // TODO 5.2.2: Crear un div con className 'spinner' (el círculo animado)
  //   const spinner = document.createElement('div');
  //   spinner.className = 'spinner';

  // TODO 5.2.3: Crear un <p> con textContent 'Cargando posts...'
  //   const texto = document.createElement('p');
  //   texto.textContent = 'Cargando posts...';

  // TODO 5.2.4: Agregar spinner y texto al container con appendChild
  //   container.appendChild(spinner);
  //   container.appendChild(texto);

  // TODO 5.2.5: Retornar el container
  //   return container;
}
```

#### 5.3 Componentes de mensajes (completar)

**¿Qué hace este código?** Crea componentes para mensajes de error y éxito. Cada uno construye un div contenedor, agrega elementos internos (título, texto) usando `createElement` y `textContent`, y retorna el elemento completo.

```javascript
/**
 * Componente de mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeError(mensaje) {
  // TODO 5.3.1: Crear un div con className 'error'
  //   const container = document.createElement('div');
  //   container.className = 'error';

  // TODO 5.3.2: Crear un <strong> con textContent 'Error'
  //   const titulo = document.createElement('strong');
  //   titulo.textContent = 'Error';

  // TODO 5.3.3: Crear un <p> con textContent igual al parámetro mensaje
  //   const texto = document.createElement('p');
  //   texto.textContent = mensaje;

  // TODO 5.3.4: Agregar titulo y texto al container
  //   container.appendChild(titulo);
  //   container.appendChild(texto);

  // TODO 5.3.5: Retornar el container
  //   return container;
}

/**
 * Componente de mensaje de éxito
 * @param {string} mensaje - Mensaje de éxito a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeExito(mensaje) {
  // TODO 5.3.6: Crear un div con className 'success'
  //   const container = document.createElement('div');
  //   container.className = 'success';

  // TODO 5.3.7: Crear un <p> con textContent igual al parámetro mensaje
  //   const texto = document.createElement('p');
  //   texto.textContent = mensaje;

  // TODO 5.3.8: Agregar texto al container y retornar
  //   container.appendChild(texto);
  //   return container;
}

/**
 * Componente de estado vacío
 * @returns {HTMLElement} - Elemento div del DOM
 */
function EstadoVacio() {
  const container = document.createElement('div');
  container.className = 'estado-vacio';

  const texto = document.createElement('p');
  texto.textContent = 'No hay posts para mostrar';

  container.appendChild(texto);

  return container;
}
```

#### 5.4 Funciones de renderizado (copiar)

**¿Qué hace este código?** Implementa las funciones que insertan los componentes en el DOM. `renderizarPosts` limpia el contenedor y agrega cada post usando `appendChild`. `mostrarCargando` inserta el spinner. `mostrarMensajeTemporal` muestra mensajes temporales y los oculta automáticamente.

```javascript
/**
 * Limpiar contenedor y renderizar lista de posts
 * @param {array} posts - Array de posts a renderizar
 * @param {HTMLElement} contenedor - Elemento DOM donde renderizar
 */
function renderizarPosts(posts, contenedor) {
  // Limpiar contenedor
  contenedor.innerHTML = '';

  if (posts.length === 0) {
    contenedor.appendChild(EstadoVacio());
    return;
  }

  // Crear y agregar cada post
  posts.forEach(post => {
    const postElement = PostCard(post);
    contenedor.appendChild(postElement);
  });
}

/**
 * Mostrar spinner de carga
 * @param {HTMLElement} contenedor - Elemento DOM donde mostrar spinner
 */
function mostrarCargando(contenedor) {
  contenedor.innerHTML = '';
  contenedor.appendChild(Spinner());
}

/**
 * Mostrar mensaje temporal
 * @param {HTMLElement} contenedor - Elemento donde mostrar el mensaje
 * @param {HTMLElement} elemento - Elemento del mensaje (MensajeError o MensajeExito)
 * @param {number} duracion - Duración en ms (0 = no auto-ocultar)
 */
function mostrarMensajeTemporal(contenedor, elemento, duracion = 3000) {
  contenedor.innerHTML = '';
  contenedor.appendChild(elemento);
  contenedor.classList.remove('oculto');

  if (duracion > 0) {
    setTimeout(() => {
      contenedor.classList.add('oculto');
    }, duracion);
  }
}
```

### Paso 6: JavaScript Parte 3 - Estado y carga inicial (copiar y completar)

En `js/app.js`, empezar con las selecciones de elementos y funciones de carga:

#### 6.1 Selección de elementos y estado (copiar)

**¿Qué hace este código?** Selecciona todos los elementos HTML necesarios usando `querySelector()` y define variables globales para mantener el estado de la aplicación: array de posts, posts filtrados y modo de edición.

```javascript
'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */

const formPost = document.querySelector('#form-post');
const inputPostId = document.querySelector('#post-id');
const inputTitulo = document.querySelector('#titulo');
const inputContenido = document.querySelector('#contenido');
const btnSubmit = document.querySelector('#btn-submit');
const btnCancelar = document.querySelector('#btn-cancelar');

const inputBuscar = document.querySelector('#input-buscar');
const btnBuscar = document.querySelector('#btn-buscar');
const btnLimpiar = document.querySelector('#btn-limpiar');

const listaPosts = document.querySelector('#lista-posts');
const mensajeEstado = document.querySelector('#mensaje-estado');
const contador = document.querySelector('#contador strong');

/* =========================
   ESTADO GLOBAL
========================= */

let posts = [];
let postsFiltrados = [];
let modoEdicion = false;
```

#### 6.2 Cargar posts desde la API (completar)

**¿Qué hace este código?** Esta función se ejecuta al cargar la página. Muestra un spinner, hace una petición GET a la API usando `ApiService.getPosts()`, guarda los datos en las variables de estado, renderiza los posts y actualiza el contador. Si hay un error, muestra un mensaje.

```javascript
/* =========================
   FUNCIONES PRINCIPALES
========================= */

/**
 * Cargar todos los posts desde la API
 */
async function cargarPosts() {
  try {
    // TODO 6.2.1: Llamar a mostrarCargando() pasando listaPosts como parámetro
    //   mostrarCargando(listaPosts);

    // TODO 6.2.2: Llamar a ApiService.getPosts(20) y asignar el resultado a 'posts'
    //   posts = await ApiService.getPosts(20);

    // TODO 6.2.3: Copiar el array posts a postsFiltrados usando spread operator
    //   postsFiltrados = [...posts];

    // TODO 6.2.4: Llamar a renderizarPosts() pasando postsFiltrados y listaPosts
    //   renderizarPosts(postsFiltrados, listaPosts);

    // TODO 6.2.5: Llamar a actualizarContador()
    //   actualizarContador();

  } catch (error) {
    // Limpiar y mostrar error usando appendChild (no innerHTML)
    listaPosts.innerHTML = '';
    listaPosts.appendChild(MensajeError(`No se pudieron cargar los posts: ${error.message}`));
  }
}

/**
 * Actualizar el contador de posts
 */
function actualizarContador() {
  contador.textContent = postsFiltrados.length;
}
```

#### 6.3 Funciones auxiliares del formulario (copiar)

**¿Qué hace este código?** Define funciones para limpiar el formulario, cambiar a modo edición (cuando se quiere actualizar un post existente) y hacer scroll al formulario para mejor UX.

```javascript
/**
 * Limpiar el formulario y resetear estado
 */
function limpiarFormulario() {
  formPost.reset();
  inputPostId.value = '';
  modoEdicion = false;
  btnSubmit.textContent = 'Crear Post';
  btnCancelar.style.display = 'none';
}

/**
 * Cambiar a modo edición
 * @param {object} post - Post a editar
 */
function activarModoEdicion(post) {
  modoEdicion = true;
  inputPostId.value = post.id;
  inputTitulo.value = post.title;
  inputContenido.value = post.body;
  btnSubmit.textContent = 'Actualizar Post';
  btnCancelar.style.display = 'inline-block';
  
  // Scroll al formulario
  formPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
  inputTitulo.focus();
}
```

### Paso 7: JavaScript Parte 4 - CRUD completo (copiar y completar)

#### 7.1 Crear o actualizar post (completar)

**¿Qué hace este código?** Maneja tanto la creación (POST) como actualización (PUT) de posts. Detecta el modo usando la variable `modoEdicion`, deshabilita el botón mientras procesa, llama al método correspondiente del `ApiService`, actualiza el estado local y muestra un mensaje de confirmación.

```javascript
/**
 * Crear o actualizar un post
 * @param {object} datosPost - Datos del post
 */
async function guardarPost(datosPost) {
  try {
    btnSubmit.disabled = true;
    btnSubmit.textContent = modoEdicion ? 'Actualizando...' : 'Creando...';

    let resultado;

    if (modoEdicion) {
      // TODO 7.1.1: Obtener el ID del input oculto y convertirlo a número
      //   const id = parseInt(inputPostId.value);

      // TODO 7.1.2: Llamar a ApiService.updatePost(id, datosPost) y guardar en resultado
      //   resultado = await ApiService.updatePost(id, datosPost);
      
      // Actualizar en el array local
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...resultado, id };
      }

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${id} actualizado correctamente`),
        3000
      );

    } else {
      // TODO 7.1.3: Llamar a ApiService.createPost(datosPost) y guardar en resultado
      //   resultado = await ApiService.createPost(datosPost);
      
      // TODO 7.1.4: Agregar el resultado al INICIO del array posts usando unshift()
      //   posts.unshift(resultado);

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${resultado.id} creado correctamente`),
        3000
      );
    }

    // Re-renderizar
    postsFiltrados = [...posts];
    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();
    limpiarFormulario();

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al guardar: ${error.message}`),
      5000
    );
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = modoEdicion ? 'Actualizar Post' : 'Crear Post';
  }
}
```

#### 7.2 Eliminar post (completar)

**¿Qué hace este código?** Elimina un post de la API usando DELETE. Primero pide confirmación al usuario con `confirm()`, luego llama a `ApiService.deletePost()`, filtra el post del array local y actualiza la UI.

```javascript
/**
 * Eliminar un post
 * @param {number} id - ID del post a eliminar
 */
async function eliminarPost(id) {
  // TODO 7.2.1: Usar confirm() para pedir confirmación. Si retorna false, salir de la función
  //   if (!confirm(`¿Eliminar el post #${id}?`)) {
  //     return;
  //   }

  try {
    // TODO 7.2.2: Llamar a ApiService.deletePost(id) con await
    //   await ApiService.deletePost(id);

    // TODO 7.2.3: Filtrar el post eliminado del array posts
    //   posts = posts.filter(p => p.id !== id);

    // TODO 7.2.4: Filtrar el post eliminado del array postsFiltrados
    //   postsFiltrados = postsFiltrados.filter(p => p.id !== id);

    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();

    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeExito(`Post #${id} eliminado correctamente`),
      3000
    );

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al eliminar: ${error.message}`),
      5000
    );
  }
}
```

#### 7.3 Búsqueda de posts (completar)

**¿Qué hace este código?** Filtra los posts en el cliente (sin hacer petición a la API) buscando el término en el título y contenido. Si el término está vacío, muestra todos los posts.

```javascript
/**
 * Buscar posts por título o contenido
 * @param {string} termino - Término de búsqueda
 */
function buscarPosts(termino) {
  const terminoLower = termino.toLowerCase().trim();

  if (terminoLower === '') {
    // TODO 7.3.1: Si el término está vacío, copiar todos los posts a postsFiltrados
    //   postsFiltrados = [...posts];
  } else {
    // TODO 7.3.2: Filtrar posts donde el título O el body incluyan el término
    //   Usar .filter() y .includes() en las propiedades post.title y post.body
    //   postsFiltrados = posts.filter(post => {
    //     const tituloMatch = post.title.toLowerCase().includes(terminoLower);
    //     const bodyMatch = post.body.toLowerCase().includes(terminoLower);
    //     return tituloMatch || bodyMatch;
    //   });
  }

  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

/**
 * Limpiar búsqueda
 */
function limpiarBusqueda() {
  inputBuscar.value = '';
  postsFiltrados = [...posts];
  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}
```

#### 7.4 Event listeners y delegación (copiar)

**¿Qué hace este código?** Conecta todos los eventos: submit del formulario, botones de búsqueda y delegación de eventos para editar/eliminar posts. La delegación permite manejar clicks en botones creados dinámicamente.

```javascript
/* =========================
   EVENT LISTENERS
========================= */

// Submit del formulario
formPost.addEventListener('submit', (e) => {
  e.preventDefault();

  const datosPost = {
    title: inputTitulo.value.trim(),
    body: inputContenido.value.trim(),
    userId: 1
  };

  guardarPost(datosPost);
});

// Cancelar edición
btnCancelar.addEventListener('click', () => {
  limpiarFormulario();
});

// Buscar posts
btnBuscar.addEventListener('click', () => {
  buscarPosts(inputBuscar.value);
});

// Buscar con Enter
inputBuscar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    buscarPosts(inputBuscar.value);
  }
});

// Limpiar búsqueda
btnLimpiar.addEventListener('click', () => {
  limpiarBusqueda();
});

// Delegación de eventos para editar y eliminar
listaPosts.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  
  if (!action) return;

  const id = parseInt(e.target.dataset.id);
  const post = posts.find(p => p.id === id);

  if (action === 'editar' && post) {
    activarModoEdicion(post);
  }

  if (action === 'eliminar') {
    eliminarPost(id);
  }
});

/* =========================
   INICIALIZACIÓN
========================= */

// Cargar posts al iniciar
cargarPosts();
```

### Paso 8: Pruebas y verificación

#### 8.1 Pruebas de carga y renderizado

1. **Carga inicial**
   - Abrir `index.html` en el navegador
   - Verificar que aparece el spinner "Cargando posts..."
   - Verificar que se cargan 20 posts desde JSONPlaceholder
   - Verificar que el contador muestra "Total: 20 posts"
   - Verificar que cada tarjeta tiene título, contenido, ID y botones Editar/Eliminar

2. **Estados visuales**
   - Verificar que las tarjetas tienen efecto hover (elevación y borde azul)
   - Verificar que los botones tienen estados hover

#### 8.2 Pruebas de CRUD

1. **Crear post (POST)**
   - Llenar el formulario con título "Mi nuevo post" y contenido "Contenido de prueba"
   - Click en "Crear Post"
   - Verificar que el botón cambia a "Creando..."
   - Verificar que aparece mensaje verde "Post #101 creado correctamente"
   - Verificar que el nuevo post aparece al inicio de la lista
   - Verificar que el contador aumenta a 21

2. **Editar post (PUT)**
   - Click en "Editar" de cualquier post
   - Verificar que el formulario se llena con los datos del post
   - Verificar que el botón cambia a "Actualizar Post"
   - Verificar que aparece el botón "Cancelar"
   - Modificar el título a "Post actualizado"
   - Click en "Actualizar Post"
   - Verificar que aparece mensaje "Post #X actualizado correctamente"
   - Verificar que la tarjeta se actualiza con el nuevo título

3. **Cancelar edición**
   - Click en "Editar" de un post
   - Click en "Cancelar"
   - Verificar que el formulario se limpia
   - Verificar que el botón vuelve a "Crear Post"
   - Verificar que el botón "Cancelar" se oculta

4. **Eliminar post (DELETE)**
   - Click en "Eliminar" de un post
   - Verificar que aparece confirmación "¿Eliminar el post #X?"
   - Click en "Aceptar"
   - Verificar que aparece mensaje "Post #X eliminado correctamente"
   - Verificar que la tarjeta desaparece de la lista
   - Verificar que el contador disminuye

#### 8.3 Pruebas de búsqueda

1. **Buscar por título**
   - Escribir "qui" en el campo de búsqueda
   - Click en "Buscar" o presionar Enter
   - Verificar que solo aparecen posts cuyo título contenga "qui"
   - Verificar que el contador se actualiza

2. **Buscar por contenido**
   - Escribir "quia" en búsqueda
   - Verificar que filtra por título O contenido

3. **Limpiar búsqueda**
   - Click en "Limpiar"
   - Verificar que el input se vacía
   - Verificar que se muestran todos los posts
   - Verificar que el contador vuelve al total

4. **Búsqueda sin resultados**
   - Escribir "xyz123abc" (texto que no existe)
   - Verificar que muestra "No hay posts para mostrar"

#### 8.4 Pruebas técnicas (DevTools)

1. **Network tab**
   - Abrir DevTools > Network
   - Recargar la página
   - Verificar petición GET a `https://jsonplaceholder.typicode.com/posts?_limit=20`
   - Verificar status 200
   - Verificar que Response contiene array de 20 posts

2. **POST request**
   - Crear un post
   - En Network, buscar la petición POST a `/posts`
   - Verificar Request Headers: `Content-Type: application/json`
   - Verificar Request Payload con los datos enviados
   - Verificar Response con status 201 y el post creado

3. **Manejo de errores**
   - En el código, cambiar temporalmente `baseUrl` a una URL inválida
   - Recargar
   - Verificar que muestra mensaje de error en rojo
   - Restaurar la URL correcta

4. **Console**
   - Verificar que no hay errores en consola
   - Verificar que se muestra "Error en petición:" solo cuando hay errores reales

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Lista cargada** - Datos de la API renderizados en la pagina
2. **Spinner** - Estado de carga visible
3. **Crear** - Formulario enviado, nuevo item en la lista
4. **Editar** - Item modificado visible
5. **Eliminar** - Item removido
6. **Error** - Mensaje de error al fallar una peticion
7. **DevTools Network** - Pestaña Network mostrando las peticiones HTTP
8. **Codigo** - Capturas del servicio API y componentes

### Formato del Archivo de Evidencias

```markdown
### 1. Datos cargados desde la API
![Lista](assets/01-lista.png)
**Descripcion:** Se obtienen N registros desde la API con GET...

### 2. Network tab
![Network](assets/02-network.png)
**Descripcion:** En DevTools > Network se observan los requests GET, POST...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Servicio API separado en su propio archivo
- Operaciones CRUD completas (GET, POST, PUT, DELETE)
- Spinner de carga y manejo de errores visual
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias

---

## Reglas

- No usar frameworks
- Solo HTML + CSS + JavaScript puro (no Axios ni librerias HTTP)
- Usar `async/await` (no `.then()` encadenado)
- SIEMPRE verificar `response.ok` despues de `fetch`
- Todo error debe mostrarse en la UI (no solo en consola)
- Usar APIs publicas reales (no simular con setTimeout)
- No usar `XMLHttpRequest`
- **NO usar `innerHTML` para contenido dinamico** - usar `createElement` + `textContent` + `appendChild`
- Los componentes deben retornar elementos del DOM, no strings HTML
- Usar `textContent` para asignar texto (nunca `innerHTML` con datos del usuario)

---

## Notas de Implementacion

### Fetch API
- `fetch` NO lanza error en respuestas 4xx o 5xx, solo en errores de red
- Siempre verificar `response.ok` antes de parsear la respuesta
- `response.json()` retorna una promesa, necesita `await`
- Solo se puede consumir el body una vez (`.json()`, `.text()`, etc.)
- JSONPlaceholder simula POST/PUT/DELETE pero no persiste datos realmente
- `Content-Type: application/json` es obligatorio para enviar JSON en el body
- CORS puede bloquear peticiones cross-origin - usar APIs que lo permitan

### Manipulación del DOM
- **Evitar `innerHTML` con datos dinámicos**: riesgo de XSS y pérdida de performance
- Usar `createElement()` para crear elementos nuevos
- Usar `textContent` para asignar texto de forma segura (no interpreta HTML)
- Usar `appendChild()` para insertar elementos en el DOM
- Los componentes deben retornar elementos (`HTMLElement`), no strings
- Para limpiar un contenedor: `element.innerHTML = ''` es aceptable, o mejor `element.replaceChildren()`
- Event listeners con `addEventListener()` funcionan correctamente en elementos creados con `createElement`

### Ejemplo correcto de componente
```javascript
// ✅ CORRECTO: Retorna elemento del DOM
function Tarjeta(datos) {
  const div = document.createElement('div');
  div.className = 'tarjeta';
  
  const titulo = document.createElement('h3');
  titulo.textContent = datos.titulo; // SEGURO
  
  div.appendChild(titulo);
  return div; // Retorna HTMLElement
}

// Uso
const tarjeta = Tarjeta({ titulo: 'Hola' });
contenedor.appendChild(tarjeta);
```

```javascript
// ❌ INCORRECTO: Retorna string y usa innerHTML
function Tarjeta(datos) {
  return `<div class="tarjeta"><h3>${datos.titulo}</h3></div>`; // INSEGURO
}

// Uso (peligroso)
contenedor.innerHTML = Tarjeta({ titulo: userInput }); // ❌ XSS risk
```

---


