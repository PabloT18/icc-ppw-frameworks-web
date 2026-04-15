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

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

```
practica-06/
  index.html
  css/
    styles.css
  js/
    apiService.js
    componentes.js
    app.js
```

### Paso 2: Crear el servicio API

En `apiService.js`, crear un objeto o modulo que encapsule las llamadas a fetch. Usar una API publica (JSONPlaceholder o PokeAPI). Implementar metodos para GET, POST, PUT y DELETE.

### Paso 3: Listar datos desde la API

1. Al cargar la pagina, hacer `GET` a la API
2. Mostrar un spinner mientras carga
3. Renderizar los datos en tarjetas usando componentes
4. Mostrar mensaje si hay error

### Paso 4: Implementar formulario de creacion (POST)

1. Crear un formulario HTML
2. Al enviar, recopilar datos con `FormData`
3. Enviar con `POST` a la API
4. Agregar el nuevo item a la lista sin recargar

### Paso 5: Implementar editar y eliminar

1. Boton "Editar" que carga datos en el formulario y al enviar usa `PUT`
2. Boton "Eliminar" que envia `DELETE` y remueve del DOM
3. Confirmacion antes de eliminar

### Paso 6: Implementar busqueda/filtrado desde la API

1. Campo de busqueda que filtra por query parameter o en el cliente
2. Mostrar resultados filtrados
3. Contador de resultados

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

---

## Notas de Implementacion

- `fetch` NO lanza error en respuestas 4xx o 5xx, solo en errores de red
- Siempre verificar `response.ok` antes de parsear la respuesta
- `response.json()` retorna una promesa, necesita `await`
- Solo se puede consumir el body una vez (`.json()`, `.text()`, etc.)
- JSONPlaceholder simula POST/PUT/DELETE pero no persiste datos realmente
- `Content-Type: application/json` es obligatorio para enviar JSON en el body
- CORS puede bloquear peticiones cross-origin - usar APIs que lo permitan

---


