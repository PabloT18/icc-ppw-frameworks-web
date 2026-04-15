# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 9: Modulos y Estructura de Proyecto

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

A medida que una aplicacion crece, tener todo el codigo en un solo archivo se vuelve insostenible. Los **ES Modules** (ESM) permiten dividir el codigo en archivos independientes con responsabilidades claras, exportar funciones/clases y reutilizarlas donde se necesiten.

Esta practica introduce la organizacion profesional de un proyecto JavaScript con multiples archivos, patrones de arquitectura simples y ES Modules nativos del navegador.

### Problemas sin modulos vs con modulos

| Sin modulos | Con modulos |
|-------------|-------------|
| Todo en un solo archivo de 500+ lineas | Archivos de 50-100 lineas enfocados |
| Variables globales que colisionan | Cada modulo tiene su propio scope |
| Dificil de encontrar funciones | Estructura de carpetas clara |
| Imposible reutilizar entre proyectos | import/export explicito |
| Orden de `<script>` importa | Dependencias declaradas |

---

## 2. Conceptos Clave

### ES Modules en el navegador

Para usar modulos en el navegador, el script debe tener `type="module"`:

```html
<!-- SIN modulos (script clasico) -->
<script src="app.js"></script>

<!-- CON modulos -->
<script type="module" src="js/app.js"></script>
```

### Diferencias entre script clasico y module

| Caracteristica | Script clasico | Module (`type="module"`) |
|:-:|:-:|:-:|
| Scope | Global (window) | Propio (aislado) |
| `this` en top-level | window | undefined |
| Variables globales | Si (var crea en window) | No |
| `use strict` | Manual | Automatico |
| import/export | No | Si |
| CORS | No requerido | Requerido |
| Ejecucion | Inmediata (bloquea) | Diferida (como defer) |
| Duplicados | Se ejecuta cada vez | Se ejecuta una sola vez |

### Requisito: servidor local

Los modulos requieren protocolo HTTP/HTTPS (no `file://`). Se necesita un servidor local:

```bash
# Opcion 1: Extension de VS Code
# Instalar "Live Server" y click en "Go Live"

# Opcion 2: Python
python3 -m http.server 8080

# Opcion 3: Node.js (npx)
npx serve
```

---

## 3. Explicacion Tecnica Detallada

### export - Exportar desde un modulo

```javascript
// --- utils.js ---

// Named exports (exportaciones con nombre)
export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-EC');
}

export function formatearMoneda(valor) {
  return `$${valor.toFixed(2)}`;
}

export const IVA = 0.15;

// Tambien se puede exportar al final
function calcularIVA(subtotal) {
  return subtotal * IVA;
}

function calcularTotal(subtotal) {
  return subtotal + calcularIVA(subtotal);
}

export { calcularIVA, calcularTotal };
```

```javascript
// --- Default export (uno por archivo) ---
// ProductService.js

const ProductService = {
  getAll() { /* ... */ },
  getById(id) { /* ... */ },
  create(data) { /* ... */ },
  update(id, data) { /* ... */ },
  delete(id) { /* ... */ }
};

export default ProductService;
```

### import - Importar en otro modulo

```javascript
// --- app.js ---

// Named imports (deben coincidir con el nombre exportado)
import { formatearFecha, formatearMoneda, IVA } from './utils.js';

// Default import (puede tener cualquier nombre)
import ProductService from './ProductService.js';

// Renombrar imports
import { formatearFecha as fmtFecha } from './utils.js';

// Importar todo como namespace
import * as Utils from './utils.js';
console.log(Utils.formatearMoneda(100)); // $100.00
console.log(Utils.IVA); // 0.15

// Combinar default y named
import Storage, { CLAVE_CONFIG } from './storage.js';
```

### Re-exports (barrel files)

```javascript
// --- componentes/index.js ---
// Centralizar exports de una carpeta

export { Card } from './Card.js';
export { Header } from './Header.js';
export { Footer } from './Footer.js';
export { Modal } from './Modal.js';

// En app.js se importa desde un solo lugar:
import { Card, Header, Footer, Modal } from './componentes/index.js';
```

### Estructura de proyecto recomendada

```
proyecto/
  index.html
  css/
    styles.css
    variables.css
  js/
    app.js              ← Punto de entrada principal
    config.js            ← Constantes y configuracion
    services/
      api.js             ← Llamadas HTTP (fetch)
      storage.js         ← localStorage CRUD
    components/
      Card.js            ← Componente Card
      Header.js          ← Componente Header
      Modal.js           ← Componente Modal
      index.js           ← Re-exports (barrel)
    utils/
      format.js          ← Funciones de formato
      validate.js        ← Funciones de validacion
      dom.js             ← Helpers de DOM
      index.js           ← Re-exports
    pages/
      home.js            ← Logica de la pagina principal
      detalle.js         ← Logica de la pagina de detalle
  assets/
    images/
```

### Patron MVC simplificado

```javascript
// --- Model (datos y logica de negocio) ---
// models/TaskModel.js
const STORAGE_KEY = 'tasks';

const TaskModel = {
  getAll() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  },

  add(texto) {
    const tasks = this.getAll();
    const task = { id: Date.now(), texto, done: false };
    tasks.push(task);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return task;
  },

  toggle(id) {
    const tasks = this.getAll();
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return task;
  },

  remove(id) {
    const tasks = this.getAll().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
};

export default TaskModel;
```

```javascript
// --- View (renderizado) ---
// views/TaskView.js

export function renderTaskList(tasks) {
  if (tasks.length === 0) return '<p class="empty">No hay tareas</p>';
  return `
    <ul class="task-list">
      ${tasks.map(t => `
        <li class="task ${t.done ? 'task--done' : ''}" data-id="${t.id}">
          <input type="checkbox" ${t.done ? 'checked' : ''} data-action="toggle">
          <span>${t.texto}</span>
          <button data-action="delete">X</button>
        </li>
      `).join('')}
    </ul>
  `;
}

export function renderCounter(tasks) {
  const pending = tasks.filter(t => !t.done).length;
  return `<p>${pending} pendiente(s)</p>`;
}
```

```javascript
// --- Controller (coordinacion) ---
// controllers/TaskController.js
import TaskModel from '../models/TaskModel.js';
import { renderTaskList, renderCounter } from '../views/TaskView.js';

const TaskController = {
  init() {
    this.container = document.querySelector('#task-container');
    this.counter = document.querySelector('#counter');
    this.setupEvents();
    this.render();
  },

  render() {
    const tasks = TaskModel.getAll();
    this.container.innerHTML = renderTaskList(tasks);
    this.counter.innerHTML = renderCounter(tasks);
  },

  setupEvents() {
    // Form submit
    document.querySelector('#task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = e.target.querySelector('input');
      if (input.value.trim()) {
        TaskModel.add(input.value.trim());
        input.value = '';
        this.render();
      }
    });

    // Delegacion en el contenedor
    this.container.addEventListener('click', (e) => {
      const li = e.target.closest('[data-id]');
      if (!li) return;
      const id = Number(li.dataset.id);

      if (e.target.matches('[data-action="toggle"]')) {
        TaskModel.toggle(id);
        this.render();
      }
      if (e.target.matches('[data-action="delete"]')) {
        TaskModel.remove(id);
        this.render();
      }
    });
  }
};

export default TaskController;
```

```javascript
// --- Punto de entrada ---
// app.js
import TaskController from './controllers/TaskController.js';

document.addEventListener('DOMContentLoaded', () => {
  TaskController.init();
});
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Utilidades exportables

```javascript
// --- utils/format.js ---
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str, max = 100) {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-EC', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}
```

```javascript
// --- utils/dom.js ---
export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function createElement(tag, attrs = {}, children = '') {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'class') el.className = val;
    else if (key.startsWith('data-')) el.setAttribute(key, val);
    else el[key] = val;
  });
  if (typeof children === 'string') el.innerHTML = children;
  else if (children instanceof Node) el.appendChild(children);
  return el;
}

export function show(el) { el.style.display = ''; }
export function hide(el) { el.style.display = 'none'; }
export function toggle(el) {
  el.style.display = el.style.display === 'none' ? '' : 'none';
}
```

### Ejemplo 2: Servicio API modular

```javascript
// --- services/api.js ---
const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options
  };

  const response = await fetch(url, config);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

export const PostAPI = {
  getAll: (limit = 10) => request(`/posts?_limit=${limit}`),
  getById: (id) => request(`/posts/${id}`),
  create: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/posts/${id}`, { method: 'DELETE' })
};

export const UserAPI = {
  getAll: () => request('/users'),
  getById: (id) => request(`/users/${id}`)
};
```

```javascript
// --- app.js ---
import { PostAPI, UserAPI } from './services/api.js';
import { $ } from './utils/dom.js';
import { truncate, capitalize } from './utils/format.js';

async function init() {
  const posts = await PostAPI.getAll(5);
  const html = posts.map(p => `
    <div class="post">
      <h3>${capitalize(p.title)}</h3>
      <p>${truncate(p.body, 80)}</p>
    </div>
  `).join('');
  $('#app').innerHTML = html;
}

init();
```

---

## 5. Comparaciones / Tablas

### Tipos de export

| Tipo | Sintaxis export | Sintaxis import | Cantidad |
|------|:-:|:-:|:-:|
| Named | `export function fn(){}` | `import { fn } from './m.js'` | Multiples |
| Named (final) | `export { a, b }` | `import { a, b } from './m.js'` | Multiples |
| Default | `export default obj` | `import obj from './m.js'` | 1 por archivo |
| Renombrado | `export { a as b }` | `import { b } from './m.js'` | Multiples |
| Namespace | - | `import * as M from './m.js'` | Todo |
| Re-export | `export { a } from './otro.js'` | - | Barrel pattern |

### Estructura plana vs organizada

| Estructura plana | Estructura organizada |
|--:|--:|
| `app.js` (500 lineas) | `app.js` (30 lineas, solo imports e init) |
| Variables globales | Modulos aislados |
| Buscar funciones con Ctrl+F | Cada archivo tiene un rol claro |
| Dificil de testear | Facil de testear por modulo |
| Un desarrollador a la vez | Multiples desarrolladores en paralelo |

### Patron de organizacion por responsabilidad

| Carpeta | Responsabilidad | Ejemplo |
|---------|:-:|:-:|
| `components/` | UI: generar HTML | Card.js, Modal.js, Header.js |
| `services/` | Datos: API, Storage | api.js, storage.js |
| `utils/` | Funciones puras reutilizables | format.js, validate.js |
| `models/` | Logica de negocio | TaskModel.js |
| `views/` | Renderizado de datos | TaskView.js |
| `controllers/` | Coordinacion modelo-vista | TaskController.js |

---

## 6. Funcionalidades Complementarias

### Archivo de configuracion

```javascript
// --- config.js ---
export const CONFIG = {
  API_URL: 'https://jsonplaceholder.typicode.com',
  ITEMS_PER_PAGE: 10,
  STORAGE_PREFIX: 'app_',
  DEBOUNCE_MS: 300
};

// Usar en otros modulos:
import { CONFIG } from './config.js';
fetch(`${CONFIG.API_URL}/posts?_limit=${CONFIG.ITEMS_PER_PAGE}`);
```

### Dynamic imports (carga bajo demanda)

```javascript
// Cargar modulo solo cuando se necesita
document.querySelector('#btn-graficos').addEventListener('click', async () => {
  const { renderChart } = await import('./components/Chart.js');
  renderChart(datos);
});
```

### Rutas del import (relativas)

```javascript
// Desde js/app.js importar js/utils/format.js
import { capitalize } from './utils/format.js';

// Desde js/controllers/TaskController.js importar js/models/TaskModel.js
import TaskModel from '../models/TaskModel.js';

// OBLIGATORIO: la extension .js es necesaria en el navegador
// import { fn } from './utils'  ERROR en el navegador
// import { fn } from './utils.js'  CORRECTO
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto con estructura modular

```
practica-09/
  index.html          ← <script type="module" src="js/app.js">
  css/
    styles.css
  js/
    app.js             ← Punto de entrada
    config.js           ← Constantes
    services/
      storage.js        ← CRUD localStorage
    components/
      Card.js           ← Componente tarjeta
      Modal.js          ← Componente modal
      Form.js           ← Componente formulario
      index.js          ← Re-exports
    utils/
      format.js         ← Funciones de formato
      validate.js       ← Funciones de validacion
      index.js          ← Re-exports
```

### Paso 2: Implementar los modulos de utilidades

En `utils/format.js` crear al menos 4 funciones exportadas (formatear fecha, moneda, capitalizar, truncar).  
En `utils/validate.js` crear al menos 3 funciones de validacion exportadas.

### Paso 3: Implementar el servicio de Storage

En `services/storage.js`, exportar un objeto con operaciones CRUD sobre localStorage. Debe ser generico (recibir la clave como parametro).

### Paso 4: Crear componentes modulares

En `components/`, crear al menos 3 funciones-componente:
1. Cada una en su propio archivo `.js`
2. Exportar con `export function`
3. Usar un archivo `index.js` para re-exports
4. Importar en `app.js` desde `./components/index.js`

### Paso 5: Integrar todo en app.js

`app.js` debe:
1. Importar los modulos necesarios
2. Inicializar la aplicacion en `DOMContentLoaded`
3. Conectar eventos con handlers
4. Coordinar servicios y componentes
5. No contener logica de negocio directa (delegarla a servicios/utils)

### Paso 6: Verificar separacion de responsabilidades

1. Ningun modulo debe tener mas de 80 lineas
2. Cada modulo debe tener una sola responsabilidad
3. Los componentes no deben acceder a localStorage directamente
4. Los servicios no deben manipular el DOM

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Estructura de archivos** - Arbol de carpetas del proyecto
2. **app.js** - Punto de entrada con imports
3. **Componente** - Archivo de componente con export
4. **Servicio** - Archivo de servicio con export
5. **Utilidad** - Archivo de utilidades con funciones exportadas
6. **Barrel file** - index.js con re-exports
7. **Aplicacion funcionando** - Pagina con datos renderizados
8. **DevTools Network** - Archivos JS individuales cargados
9. **Consola limpia** - Sin errores, modulos cargados correctamente

### Formato del Archivo de Evidencias

```markdown
### 1. Estructura de archivos
![Estructura](assets/01-estructura.png)
**Descripcion:** El proyecto tiene N archivos JS organizados en...

### 2. app.js con imports
![App](assets/02-app.png)
**Descripcion:** app.js importa componentes desde ./components/index.js...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Minimo 8 archivos `.js` separados
- Uso de `export` / `import` en todos los archivos
- `index.html` con `<script type="module">`
- Al menos un barrel file (index.js con re-exports)
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias

---

## Reglas

- No usar frameworks ni bundlers (Webpack, Vite, etc.)
- Solo ES Modules nativos del navegador
- `<script type="module" src="js/app.js">` obligatorio
- Cada archivo debe tener una sola responsabilidad
- La extension `.js` es obligatoria en los imports
- No usar variables globales entre modulos (solo import/export)
- Ejecutar con Live Server o servidor local (no file://)

---

## Notas de Implementacion

- `type="module"` activa strict mode automaticamente
- Los modulos se ejecutan una sola vez, incluso si se importan en multiples archivos
- Las rutas de import deben ser relativas (`./`, `../`) en el navegador
- La extension `.js` es obligatoria en imports del navegador (no como en Node.js)
- `import()` dinamico retorna una promesa (util para carga bajo demanda)
- Los modulos se cargan con CORS, necesitan servidor web (no file://)
- `export default` y `export {}` son los dos patrones principales

---


