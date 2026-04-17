# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 7: Web Storage y Persistencia

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

Las aplicaciones web necesitan **persistir datos** en el navegador para funcionar sin conexion, recordar preferencias, o mantener estado entre recargas. **Web Storage** (localStorage y sessionStorage) es la forma mas sencilla de almacenar datos clave-valor en el navegador sin necesidad de un servidor o base de datos.

### Cuando usar Web Storage?

| Escenario | Solucion | Justificacion |
|-----------|----------|---------------|
| Preferencias del usuario (tema, idioma) | localStorage | Persiste entre sesiones |
| Carrito de compras temporal | sessionStorage | Se limpia al cerrar pestana |
| Cache de datos de API | localStorage | Evitar peticiones repetidas |
| Datos de un formulario en progreso | sessionStorage | Recuperar si se recarga |
| Autenticacion (tokens) | localStorage con cuidado | Persiste entre sesiones |
| Datos grandes o complejos | IndexedDB | Web Storage tiene limite de 5-10MB |

---

## 2. Conceptos Clave

### localStorage vs sessionStorage

| Caracteristica | localStorage | sessionStorage |
|:-:|:-:|:-:|
| Persistencia | Permanente (hasta borrado manual) | Hasta cerrar la pestana/ventana |
| Alcance | Mismo origen (dominio + protocolo + puerto) | Misma pestana Y mismo origen |
| Capacidad | ~5-10MB | ~5-10MB |
| Compartido entre pestanas | Si | No |
| API | Identica | Identica |

### API comun

```javascript
// Ambos tienen exactamente la misma API:
storage.setItem('clave', 'valor');    // guardar
storage.getItem('clave');              // leer (retorna string o null)
storage.removeItem('clave');           // eliminar uno
storage.clear();                       // eliminar todo
storage.key(indice);                   // obtener clave por indice
storage.length;                        // cantidad de items
```

### Restriccion importante: solo strings

Web Storage solo almacena **strings**. Para guardar objetos o arrays se usa `JSON.stringify()` para guardar y `JSON.parse()` para leer.

```javascript
// Guardar un objeto
const usuario = { nombre: 'Pablo', edad: 30 };
localStorage.setItem('usuario', JSON.stringify(usuario));

// Leer el objeto
const datos = JSON.parse(localStorage.getItem('usuario'));
console.log(datos.nombre); // 'Pablo'
```

---

## 3. Explicacion Tecnica Detallada

### Operaciones basicas

```javascript
// ---- GUARDAR ----
localStorage.setItem('nombre', 'Pablo Torres');
localStorage.setItem('tema', 'oscuro');

// Guardar un array
const favoritos = ['JavaScript', 'CSS', 'HTML'];
localStorage.setItem('favoritos', JSON.stringify(favoritos));

// Guardar un objeto complejo
const config = {
  tema: 'oscuro',
  idioma: 'es',
  notificaciones: true,
  fuente: 16
};
localStorage.setItem('config', JSON.stringify(config));


// ---- LEER ----
const nombre = localStorage.getItem('nombre'); // 'Pablo Torres'
const noExiste = localStorage.getItem('clave_inexistente'); // null

// Leer con valor por defecto
const tema = localStorage.getItem('tema') || 'claro';

// Leer objeto
const configGuardada = JSON.parse(localStorage.getItem('config'));
// Cuidado: si no existe, JSON.parse(null) retorna null
const configSegura = JSON.parse(localStorage.getItem('config')) || {};


// ---- ELIMINAR ----
localStorage.removeItem('nombre'); // elimina solo 'nombre'
localStorage.clear(); // elimina TODO


// ---- ITERAR ----
for (let i = 0; i < localStorage.length; i++) {
  const clave = localStorage.key(i);
  const valor = localStorage.getItem(clave);
  console.log(`${clave}: ${valor}`);
}
```

### Patron CRUD con localStorage

```javascript
// Servicio de Storage para una entidad
const TareaStorage = {
  CLAVE: 'tareas',

  // Leer todas
  getAll() {
    return JSON.parse(localStorage.getItem(this.CLAVE)) || [];
  },

  // Leer una por id
  getById(id) {
    const tareas = this.getAll();
    return tareas.find(t => t.id === id) || null;
  },

  // Crear
  create(tarea) {
    const tareas = this.getAll();
    tarea.id = Date.now(); // ID unico simple
    tarea.creadoEn = new Date().toISOString();
    tareas.push(tarea);
    localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
    return tarea;
  },

  // Actualizar
  update(id, cambios) {
    const tareas = this.getAll();
    const indice = tareas.findIndex(t => t.id === id);
    if (indice === -1) return null;
    tareas[indice] = { ...tareas[indice], ...cambios };
    localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
    return tareas[indice];
  },

  // Eliminar
  delete(id) {
    const tareas = this.getAll();
    const filtradas = tareas.filter(t => t.id !== id);
    if (filtradas.length === tareas.length) return false;
    localStorage.setItem(this.CLAVE, JSON.stringify(filtradas));
    return true;
  },

  // Eliminar todo
  clear() {
    localStorage.removeItem(this.CLAVE);
  }
};
```

### sessionStorage para datos temporales

```javascript
// Guardar progreso de un formulario largo
function guardarProgresoFormulario() {
  const datos = {
    paso: 2,
    nombre: document.querySelector('#nombre').value,
    email: document.querySelector('#email').value,
    timestamp: Date.now()
  };
  sessionStorage.setItem('formulario_progreso', JSON.stringify(datos));
}

// Restaurar al recargar la pagina
function restaurarProgreso() {
  const progreso = JSON.parse(sessionStorage.getItem('formulario_progreso'));
  if (progreso) {
    document.querySelector('#nombre').value = progreso.nombre || '';
    document.querySelector('#email').value = progreso.email || '';
    console.log(`Restaurado desde paso ${progreso.paso}`);
  }
}

// Limpiar al enviar exitosamente
function enviarFormulario() {
  // ... enviar datos ...
  sessionStorage.removeItem('formulario_progreso');
}
```

### Evento storage (sincronizar entre pestanas)

```javascript
// Se dispara cuando OTRA pestana modifica localStorage
window.addEventListener('storage', (e) => {
  console.log('Clave modificada:', e.key);
  console.log('Valor anterior:', e.oldValue);
  console.log('Valor nuevo:', e.newValue);
  console.log('URL de la pestana que hizo el cambio:', e.url);

  // Ejemplo: sincronizar tema entre pestanas
  if (e.key === 'tema') {
    aplicarTema(e.newValue);
  }
});
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Lista de tareas persistente

```javascript
'use strict';

// --- STORAGE SERVICE ---
const TareaStorage = {
  CLAVE: 'tareas_app',

  getAll() {
    return JSON.parse(localStorage.getItem(this.CLAVE)) || [];
  },

  save(tareas) {
    localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
  },

  create(texto) {
    const tareas = this.getAll();
    const nueva = {
      id: Date.now(),
      texto,
      completada: false,
      creadoEn: new Date().toISOString()
    };
    tareas.push(nueva);
    this.save(tareas);
    return nueva;
  },

  toggleCompletada(id) {
    const tareas = this.getAll();
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
      this.save(tareas);
    }
    return tarea;
  },

  delete(id) {
    const tareas = this.getAll().filter(t => t.id !== id);
    this.save(tareas);
  }
};

// --- COMPONENTES ---
function TareaItem(tarea) {
  return `
    <li class="tarea ${tarea.completada ? 'tarea--completada' : ''}" data-id="${tarea.id}">
      <input type="checkbox" ${tarea.completada ? 'checked' : ''} data-action="toggle" data-id="${tarea.id}">
      <span class="tarea__texto">${tarea.texto}</span>
      <button data-action="eliminar" data-id="${tarea.id}">X</button>
    </li>
  `;
}

function ContadorTareas(tareas) {
  const pendientes = tareas.filter(t => !t.completada).length;
  return `<p>${pendientes} tarea(s) pendiente(s) de ${tareas.length} total</p>`;
}

// --- RENDER ---
function render() {
  const tareas = TareaStorage.getAll();
  document.querySelector('#lista-tareas').innerHTML = tareas.map(TareaItem).join('');
  document.querySelector('#contador').innerHTML = ContadorTareas(tareas);
}

// --- EVENTOS ---
document.querySelector('#form-tarea').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector('#input-tarea');
  const texto = input.value.trim();
  if (!texto) return;

  TareaStorage.create(texto);
  input.value = '';
  render();
});

document.querySelector('#lista-tareas').addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.matches('[data-action="toggle"]')) {
    TareaStorage.toggleCompletada(id);
    render();
  }

  if (e.target.matches('[data-action="eliminar"]')) {
    TareaStorage.delete(id);
    render();
  }
});

// Cargar al inicio
render();
```

### Ejemplo 2: Selector de tema persistente

```javascript
'use strict';

const TEMA_CLAVE = 'app_tema';
const TEMAS = {
  claro: {
    '--bg-color': '#ffffff',
    '--text-color': '#333333',
    '--primary': '#3498db',
    '--card-bg': '#f5f5f5'
  },
  oscuro: {
    '--bg-color': '#1a1a2e',
    '--text-color': '#e0e0e0',
    '--primary': '#e94560',
    '--card-bg': '#16213e'
  },
  naturaleza: {
    '--bg-color': '#f0f4e8',
    '--text-color': '#2d3436',
    '--primary': '#27ae60',
    '--card-bg': '#dfe6da'
  }
};

function aplicarTema(nombre) {
  const tema = TEMAS[nombre];
  if (!tema) return;

  Object.entries(tema).forEach(([propiedad, valor]) => {
    document.documentElement.style.setProperty(propiedad, valor);
  });

  // Actualizar boton activo
  document.querySelectorAll('[data-tema]').forEach(btn => {
    btn.classList.toggle('btn--activo', btn.dataset.tema === nombre);
  });

  // Persistir
  localStorage.setItem(TEMA_CLAVE, nombre);
}

// Cargar tema guardado al inicio
const temaGuardado = localStorage.getItem(TEMA_CLAVE) || 'claro';
aplicarTema(temaGuardado);

// Evento para cambiar tema
document.querySelector('#controles-tema').addEventListener('click', (e) => {
  if (e.target.matches('[data-tema]')) {
    aplicarTema(e.target.dataset.tema);
  }
});
```

---

## 5. Comparaciones / Tablas

### localStorage vs sessionStorage vs cookies

| Criterio | localStorage | sessionStorage | Cookies |
|----------|:-:|:-:|:-:|
| Capacidad | ~5-10MB | ~5-10MB | ~4KB |
| Persistencia | Permanente | Sesion (pestana) | Configurable (expires) |
| Enviado al servidor | No | No | Si (en cada peticion) |
| API | Sencilla | Sencilla | Compleja (string) |
| Acceso JS | Si | Si | Si (si no es HttpOnly) |
| Entre pestanas | Si | No | Si |

### JSON.stringify / JSON.parse

| Tipo JS | JSON.stringify | JSON.parse |
|---------|:-:|:-:|
| string | `'"hola"'` | `'hola'` |
| number | `'42'` | `42` |
| boolean | `'true'` | `true` |
| null | `'null'` | `null` |
| array | `'[1,2,3]'` | `[1,2,3]` |
| object | `'{"a":1}'` | `{a: 1}` |
| undefined | Omitido | - |
| function | Omitido | - |
| Date | `'"2024-01-01..."'` (string) | string (NO Date) |

### Cuando usar cada storage

| Necesidad | Solucion |
|-----------|----------|
| Preferencias de UI | localStorage |
| Token de sesion en SPA | localStorage |
| Datos durante una pestaña de navegación | sessionStorage |
| Datos grandes (>5MB) | IndexedDB |
| Enviar datos al servidor | Cookies |
| Cache offline | Service Worker + Cache API |

---

## 6. Funcionalidades Complementarias

### Helper seguro para Storage

```javascript
// Wrapper que maneja errores y parseo automaticamente
const Storage = {
  get(clave, valorDefecto = null) {
    try {
      const item = localStorage.getItem(clave);
      return item ? JSON.parse(item) : valorDefecto;
    } catch {
      return valorDefecto;
    }
  },

  set(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error('Storage lleno o no disponible:', error);
      return false;
    }
  },

  remove(clave) {
    localStorage.removeItem(clave);
  },

  has(clave) {
    return localStorage.getItem(clave) !== null;
  }
};
```

### Verificar disponibilidad de Storage

```javascript
function storageDisponible(tipo) {
  try {
    const storage = window[tipo];
    const test = '__test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

if (!storageDisponible('localStorage')) {
  console.warn('localStorage no disponible - modo privado o deshabilitado');
}
```

### Cache simple de API con TTL

```javascript
const Cache = {
  set(clave, datos, ttlMinutos = 30) {
    const item = {
      datos,
      expira: Date.now() + ttlMinutos * 60 * 1000
    };
    localStorage.setItem(`cache_${clave}`, JSON.stringify(item));
  },

  get(clave) {
    const item = JSON.parse(localStorage.getItem(`cache_${clave}`));
    if (!item) return null;
    if (Date.now() > item.expira) {
      localStorage.removeItem(`cache_${clave}`);
      return null; // expirado
    }
    return item.datos;
  }
};

// Uso con fetch
async function obtenerDatos(url, cacheClave) {
  const cacheado = Cache.get(cacheClave);
  if (cacheado) {
    console.log('Datos desde cache');
    return cacheado;
  }

  const response = await fetch(url);
  const datos = await response.json();
  Cache.set(cacheClave, datos, 15); // cache de 15 minutos
  return datos;
}
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

Crea la siguiente estructura de carpetas y archivos:

```
practica-07/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── storage.js
    └── app.js
```

**¿Qué vamos a construir?**

Una lista de tareas simple que:
- Persiste en `localStorage`
- Permite agregar, eliminar y marcar como completadas
- Guarda el tema seleccionado (claro/oscuro)
- Todo se mantiene al recargar la página

---

### Paso 2: HTML completo (copiar)

**¿Qué hace este código?**

Estructura HTML simple con:
- Selector de tema (2 botones)
- Formulario para agregar tareas
- Lista para mostrar tareas
- Botón para limpiar todo

**Archivo:** `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Práctica 07 - Web Storage | Lista de Tareas</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1 class="header__title">📝 Lista de Tareas Persistente</h1>
      <p class="header__subtitle">Práctica 7 - Web Storage API (localStorage)</p>
    </header>

    <!-- Selector de tema simple -->
    <section class="theme-selector">
      <button class="theme-btn theme-btn--active" data-theme="claro">☀️ Claro</button>
      <button class="theme-btn" data-theme="oscuro">🌙 Oscuro</button>
    </section>

    <!-- Formulario para crear tarea -->
    <section class="form-section">
      <form class="task-form" id="form-tarea">
        <div class="form-group">
          <label for="input-tarea" class="form-label">Nueva Tarea</label>
          <div class="form-input-group">
            <input 
              type="text" 
              id="input-tarea" 
              class="form-input" 
              placeholder="Escribe una tarea..." 
              maxlength="100"
              required
              autocomplete="off"
            >
            <button type="submit" class="btn btn--primary">
              ➕ Agregar
            </button>
          </div>
        </div>
      </form>
    </section>

    <!-- Mensaje de estado -->
    <div id="mensaje-estado" class="mensaje oculto"></div>

    <!-- Lista de tareas -->
    <section class="tasks-section">
      <ul class="tasks-list" id="lista-tareas">
        <!-- Las tareas se renderizan aquí -->
      </ul>
    </section>

    <!-- Botón limpiar todo -->
    <section class="actions">
      <button class="btn btn--danger" id="btn-limpiar">
        🗑️ Limpiar Todo
      </button>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>Práctica 07 - Web Storage | Los datos persisten al recargar</p>
    </footer>
  </div>

  <!-- Scripts -->
  <script src="js/storage.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

### Paso 3: CSS completo (copiar)

**¿Qué hace este código?**

Estilos básicos para la aplicación. Usa **CSS Variables** que serán modificadas dinámicamente por JavaScript para cambiar el tema.

**Nota:** Copia el archivo completo de `solver/07-storage/css/styles.css` ya que el CSS es extenso pero simple (variables CSS, estilos de formulario, lista de tareas, botones y mensajes).

---

### Paso 4: JavaScript Parte 1 - Servicio de Storage (copiar y completar)

**¿Qué hace este código?**

Crea un objeto `TareaStorage` que **encapsula todas las operaciones de localStorage**. Este patrón se llama **Servicio** y separa la lógica de persistencia del resto de la aplicación.

**Archivo:** `js/storage.js`

#### 4.1: Estructura del servicio (copiar)

```javascript
'use strict';

/* =========================
   SERVICIO DE STORAGE
========================= */

const TareaStorage = {
  CLAVE: 'tareas_lista',

  /**
   * Obtener todas las tareas desde localStorage
   * @returns {Array} Array de tareas
   */
  getAll() {
    try {
      const datos = localStorage.getItem(this.CLAVE);
      if (!datos) {
        return [];
      }
      return JSON.parse(datos);
    } catch (error) {
      console.error('Error al leer tareas:', error);
      return [];
    }
  },

  /**
   * Guardar todas las tareas en localStorage
   * @param {Array} tareas - Array de tareas
   */
  guardar(tareas) {
    try {
      localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  },

  // Los siguientes métodos se completan abajo...
};
```

**¿Por qué este patrón?**
- ✅ **Centraliza** todas las operaciones de Storage en un solo lugar
- ✅ **Encapsula** los detalles de `JSON.stringify/parse`
- ✅ **Maneja errores** en un solo lugar
- ✅ **Reutilizable** en cualquier parte del código

#### 4.2: Métodos CRUD (completar)

Completa los siguientes métodos dentro del objeto `TareaStorage`:

```javascript
  /**
   * TODO 4.2.1: Crear una nueva tarea
   * @param {string} texto - Texto de la tarea
   * @returns {Object} Tarea creada
   */
  crear(texto) {
    // TODO 4.2.1.1: Obtener todas las tareas con this.getAll()
    
    // TODO 4.2.1.2: Crear objeto nueva tarea con:
    //   - id: Date.now() (ID único usando timestamp)
    //   - texto: texto.trim() (sin espacios al inicio/fin)
    //   - completada: false
    
    // TODO 4.2.1.3: Agregar la nueva tarea al array con push()
    
    // TODO 4.2.1.4: Guardar el array actualizado con this.guardar(tareas)
    
    // TODO 4.2.1.5: Retornar el objeto nueva
  },

  /**
   * TODO 4.2.2: Alternar estado completada/pendiente
   * @param {number} id - ID de la tarea
   */
  toggleCompletada(id) {
    // TODO 4.2.2.1: Obtener todas las tareas
    
    // TODO 4.2.2.2: Buscar la tarea con find() usando t => t.id === id
    
    // TODO 4.2.2.3: Si existe, invertir su propiedad completada (!tarea.completada)
    
    // TODO 4.2.2.4: Guardar el array actualizado
  },

  /**
   * TODO 4.2.3: Eliminar una tarea
   * @param {number} id - ID de la tarea
   */
  eliminar(id) {
    // TODO 4.2.3.1: Obtener todas las tareas
    
    // TODO 4.2.3.2: Filtrar el array para excluir la tarea con ese id
    //   const filtradas = tareas.filter(t => t.id !== id);
    
    // TODO 4.2.3.3: Guardar el array filtrado
  },

  /**
   * TODO 4.2.4: Eliminar todas las tareas
   */
  limpiarTodo() {
    // TODO 4.2.4.1: Usar localStorage.removeItem(this.CLAVE) para eliminar la clave completa
  }
```

#### 4.3: Servicio de Tema (copiar)

Agrega al final de `storage.js`:

```javascript
/* =========================
   SERVICIO DE TEMA
========================= */

const TemaStorage = {
  CLAVE: 'tema_app',

  getTema() {
    return localStorage.getItem(this.CLAVE) || 'claro';
  },

  setTema(tema) {
    localStorage.setItem(this.CLAVE, tema);
  }
};
```

---

### Paso 5: JavaScript Parte 2 - Renderizado con createElement (copiar y completar)

**¿Qué hace este código?**

Implementa funciones que **construyen elementos DOM usando la API createElement**. Esto es más seguro que `innerHTML` porque evita vulnerabilidades XSS.

**Archivo:** `js/app.js`

#### 5.1: Selección de elementos (copiar)

```javascript
'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS DOM
========================= */

const formTarea = document.getElementById('form-tarea');
const inputTarea = document.getElementById('input-tarea');
const listaTareas = document.getElementById('lista-tareas');
const mensajeEstado = document.getElementById('mensaje-estado');
const btnLimpiar = document.getElementById('btn-limpiar');
const themeBtns = document.querySelectorAll('[data-theme]');

/* =========================
   ESTADO GLOBAL
========================= */

let tareas = []; // Array de tareas en memoria
```

#### 5.2: Función crear elemento de tarea (completar)

**¿Por qué NO usar innerHTML?**

```javascript
// ❌ MAL - innerHTML puede causar problemas de seguridad
function crearTareaInnerHTML(tarea) {
  return `<li>${tarea.texto}</li>`; // Si texto contiene <script>, se ejecuta!
}

// ✅ BIEN - createElement es seguro
function crearTarea(tarea) {
  const li = document.createElement('li');
  li.textContent = tarea.texto; // textContent escapa HTML automáticamente
  return li;
}
```

**Implementación completa:**

```javascript
/**
 * TODO 5.2.1: Crear elemento de tarea con createElement
 * @param {Object} tarea - { id, texto, completada }
 * @returns {HTMLElement} Elemento <li>
 */
function crearElementoTarea(tarea) {
  // Crear <li>
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = tarea.id;
  
  if (tarea.completada) {
    li.classList.add('task-item--completed');
  }
  
  // TODO 5.2.1.1: Crear checkbox
  //   const checkbox = document.createElement('input');
  //   checkbox.type = 'checkbox';
  //   checkbox.className = 'task-item__checkbox';
  //   checkbox.checked = tarea.completada;
  
  // TODO 5.2.1.2: Crear span de texto
  //   const span = document.createElement('span');
  //   span.className = 'task-item__text';
  //   span.textContent = tarea.texto;  // Usar textContent, NO innerHTML
  
  // TODO 5.2.1.3: Crear botón eliminar
  //   const btnEliminar = document.createElement('button');
  //   btnEliminar.className = 'btn btn--danger btn--small';
  //   btnEliminar.textContent = '🗑️';
  
  // TODO 5.2.1.4: Crear contenedor de acciones
  //   const divAcciones = document.createElement('div');
  //   divAcciones.className = 'task-item__actions';
  //   divAcciones.appendChild(btnEliminar);
  
  // TODO 5.2.1.5: Ensamblar todo
  //   li.appendChild(checkbox);
  //   li.appendChild(span);
  //   li.appendChild(divAcciones);
  
  // TODO 5.2.1.6: Agregar event listeners
  //   checkbox.addEventListener('change', () => toggleTarea(tarea.id));
  //   btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));
  
  return li;
}
```

#### 5.3: Función renderizar tareas (completar)

```javascript
/**
 * TODO 5.3.1: Renderizar todas las tareas
 */
function renderizarTareas() {
  // TODO 5.3.1.1: Limpiar la lista actual
  //   listaTareas.innerHTML = '';
  
  // TODO 5.3.1.2: Si no hay tareas, mostrar mensaje vacío
  //   if (tareas.length === 0) {
  //     const divVacio = document.createElement('div');
  //     divVacio.className = 'empty-state';
  //     const p = document.createElement('p');
  //     p.textContent = '🎉 No hay tareas. ¡Agrega una para comenzar!';
  //     divVacio.appendChild(p);
  //     listaTareas.appendChild(divVacio);
  //     return;
  //   }
  
  // TODO 5.3.1.3: Crear y agregar cada tarea
  //   tareas.forEach(tarea => {
  //     const elemento = crearElementoTarea(tarea);
  //     listaTareas.appendChild(elemento);
  //   });
}
```

#### 5.4: Función mostrar mensaje (copiar)

```javascript
/**
 * Mostrar mensaje temporal
 * @param {string} texto - Texto del mensaje
 * @param {string} tipo - 'success' o 'error'
 */
function mostrarMensaje(texto, tipo = 'success') {
  mensajeEstado.textContent = texto;
  mensajeEstado.className = `mensaje mensaje--${tipo}`;
  mensajeEstado.classList.remove('oculto');
  
  setTimeout(() => {
    mensajeEstado.classList.add('oculto');
  }, 3000);
}
```

---

### Paso 6: JavaScript Parte 3 - Lógica de tareas (completar)

**¿Qué hace este código?**

Implementa las funciones que **interactúan con localStorage** para CRUD de tareas.

#### 6.1: Cargar tareas (copiar)

```javascript
/**
 * Cargar tareas desde localStorage
 */
function cargarTareas() {
  tareas = TareaStorage.getAll();
  renderizarTareas();
}
```

#### 6.2: Agregar tarea (completar)

```javascript
/**
 * TODO 6.2.1: Agregar nueva tarea
 * @param {string} texto - Texto de la tarea
 */
function agregarTarea(texto) {
  // TODO 6.2.1.1: Validar que no esté vacío
  //   if (!texto.trim()) {
  //     mostrarMensaje('El texto no puede estar vacío', 'error');
  //     return;
  //   }
  
  // TODO 6.2.1.2: Usar el servicio para crear la tarea
  //   const nueva = TareaStorage.crear(texto);
  
  // TODO 6.2.1.3: Actualizar estado local leyendo desde localStorage
  //   tareas = TareaStorage.getAll();
  
  // TODO 6.2.1.4: Re-renderizar la lista
  //   renderizarTareas();
  
  // TODO 6.2.1.5: Mostrar mensaje de éxito
  //   mostrarMensaje(`✓ Tarea "${nueva.texto}" agregada`);
}
```

#### 6.3: Métodos auxiliares (completar)

```javascript
/**
 * TODO 6.3.1: Alternar completada/pendiente
 */
function toggleTarea(id) {
  // TODO 6.3.1.1: Usar TareaStorage.toggleCompletada(id)
  
  // TODO 6.3.1.2: Recargar tareas desde localStorage
  
  // TODO 6.3.1.3: Re-renderizar
}

/**
 * TODO 6.3.2: Eliminar tarea
 */
function eliminarTarea(id) {
  // TODO 6.3.2.1: Buscar la tarea para confirmar
  //   const tarea = tareas.find(t => t.id === id);
  
  // TODO 6.3.2.2: Pedir confirmación
  //   if (!confirm(`¿Eliminar "${tarea.texto}"?`)) return;
  
  // TODO 6.3.2.3: Usar TareaStorage.eliminar(id)
  
  // TODO 6.3.2.4: Recargar y re-renderizar
  
  // TODO 6.3.2.5: Mostrar mensaje
}

/**
 * TODO 6.3.3: Limpiar todo
 */
function limpiarTodo() {
  // TODO 6.3.3.1: Validar que haya tareas
  
  // TODO 6.3.3.2: Pedir confirmación
  
  // TODO 6.3.3.3: Usar TareaStorage.limpiarTodo()
  
  // TODO 6.3.3.4: Limpiar estado local y re-renderizar
}
```

---

### Paso 7: JavaScript Parte 4 - Tema y eventos (completar)

#### 7.1: Aplicar tema (completar)

```javascript
/**
 * TODO 7.1.1: Aplicar tema
 * @param {string} nombreTema - 'claro' o 'oscuro'
 */
function aplicarTema(nombreTema) {
  // TODO 7.1.1.1: Si es oscuro, aplicar variables CSS oscuras
  //   if (nombreTema === 'oscuro') {
  //     document.documentElement.style.setProperty('--bg-primary', '#1a1a2e');
  //     document.documentElement.style.setProperty('--card-bg', '#16213e');
  //     // ... más variables
  //   } else {
  //     // Tema claro (valores por defecto)
  //   }
  
  // TODO 7.1.1.2: Actualizar botones activos
  //   themeBtns.forEach(btn => {
  //     btn.classList.toggle('theme-btn--active', btn.dataset.theme === nombreTema);
  //   });
  
  // TODO 7.1.1.3: Guardar en localStorage
  //   TemaStorage.setTema(nombreTema);
}
```

#### 7.2: Eventos (copiar)

```javascript
/* =========================
   EVENTOS
========================= */

// Evento: Submit del formulario
formTarea.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = inputTarea.value.trim();
  agregarTarea(texto);
  inputTarea.value = '';
});

// Evento: Limpiar todo
btnLimpiar.addEventListener('click', limpiarTodo);

// Evento: Cambiar tema
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    aplicarTema(btn.dataset.theme);
  });
});
```

#### 7.3: Inicialización (copiar)

```javascript
/* =========================
   INICIALIZACIÓN
========================= */

// Cargar tema guardado
const temaGuardado = TemaStorage.getTema();
aplicarTema(temaGuardado);

// Cargar tareas desde localStorage
cargarTareas();

// Mensaje de bienvenida
if (tareas.length === 0) {
  mostrarMensaje('👋 Bienvenido! Agrega tu primera tarea', 'success');
}
```

---

### Paso 8: Pruebas

1. **Agregar tareas:** Agrega 3-5 tareas
2. **Recarga la página:** Verifica que las tareas siguen ahí (localStorage funciona)
3. **Marcar completadas:** Marca algunas como completadas, recarga, verifica persistencia
4. **Cambiar tema:** Cambia al tema oscuro, recarga, verifica que se mantuvo
5. **Eliminar tareas:** Elimina algunas tareas
6. **Limpiar todo:** Elimina todas las tareas
7. **DevTools:** Abre DevTools > Application > Local Storage > tu dominio, verifica que ves las claves `tareas_lista` y `tema_app`

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Lista con datos** - Tareas creadas visibles
2. **Persistencia** - Recargar página y verificar que los datos persisten
3. **Tema oscuro** - Cambio de tema aplicado
4. **DevTools Application** - Local Storage mostrando datos guardados
5. **Código** - Capturas de storage.js y app.js

### Formato del Archivo de Evidencias

```markdown
### 1. Lista con datos persistentes
![Lista](assets/01-lista.png)
**Descripción:** Se crearon 5 tareas y al recargar persisten...

### 2. DevTools - Local Storage
![DevTools](assets/02-devtools.png)
**Descripción:** En Application > Local Storage se ve `tareas_lista` con el JSON...
```

---

## 9. Entregables

- Repositorio GitHub con el código completo
- Estructura de carpetas correcta
- Servicio de Storage funcional (storage.js)
- CRUD completo de tareas (app.js)
- Persistencia de tema
- Construcción con createElement (NO innerHTML)
- Capturas de pantalla en `assets/`
- Archivo `.md` con evidencias

---

## 10. Reglas

- ✅ Solo HTML + CSS + JavaScript puro (no frameworks)
- ✅ Usar el patrón de Servicio para Storage
- ✅ Usar `JSON.stringify()` y `JSON.parse()` correctamente
- ✅ Construcción del DOM con `createElement` (NO `innerHTML` para datos dinámicos)
- ✅ Los datos deben persistir al recargar la página
- ✅ Verificar que `localStorage.getItem()` no retorne `null` antes de parsear
- ✅ Manejo de errores con `try/catch` en operaciones de Storage

---

## 11. Notas Importantes

### Sobre localStorage

- `localStorage.getItem('clave')` retorna `null` si no existe, NO `undefined`
- `JSON.parse(null)` retorna `null` (no lanza error)
- `JSON.parse('undefined')` SÍ lanza error
- localStorage tiene límite de ~5-10MB por origen
- En modo privado/incógnito, algunos navegadores bloquean localStorage

### Sobre createElement vs innerHTML

```javascript
// ❌ NUNCA hagas esto con datos del usuario
elemento.innerHTML = `<p>${datoDelUsuario}</p>`;
// Si datoDelUsuario = "<script>alert('XSS')</script>", se ejecuta!

// ✅ Siempre usa createElement y textContent
const p = document.createElement('p');
p.textContent = datoDelUsuario; // Seguro: escapa HTML automáticamente
```

### Sobre JSON

- `Date` se serializa como string, al parsear NO vuelve a ser Date
- Funciones y `undefined` se pierden al serializar
- `NaN` e `Infinity` se convierten en `null`
- Propiedades con valor `undefined` se omiten del JSON

---



### Capturas requeridas

1. **Lista con datos** - Items creados y visibles
2. **Persistencia** - Recargar pagina y verificar que los datos siguen
3. **Edicion** - Item siendo editado inline
4. **Eliminar** - Item eliminado
5. **Tema** - Al menos 2 temas diferentes aplicados
6. **DevTools Application** - Pestaña Application > Local Storage mostrando datos
7. **Exportar/Importar** - Archivo JSON generado y datos importados
8. **Codigo** - Capturas del servicio de Storage

### Formato del Archivo de Evidencias

```markdown
### 1. Lista con datos persistentes
![Lista](assets/01-lista.png)
**Descripcion:** Se crean items y al recargar la pagina persisten...

### 2. DevTools - Application > Local Storage
![DevTools](assets/02-devtools.png)
**Descripcion:** En DevTools > Application > Local Storage se ven los datos...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Servicio de Storage en archivo separado
- CRUD completo persistente (crear, leer, editar, eliminar)
- Selector de tema persistente
- Exportar/importar datos JSON
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias

---

## Reglas

- No usar frameworks
- Solo HTML + CSS + JavaScript puro
- Toda lectura/escritura a Storage debe usar el servicio centralizado
- JSON.stringify/JSON.parse obligatorio para datos no-string
- Verificar que `getItem()` no retorne `null` antes de usar los datos
- Los datos deben persistir al recargar la pagina

---

## Notas de Implementacion

- `localStorage.getItem()` retorna `null` si la clave no existe, no `undefined`
- `JSON.parse(null)` retorna `null` (no lanza error)
- `JSON.parse('undefined')` SI lanza error
- Web Storage tiene un limite de ~5-10MB por origen
- En modo privado/incognito, algunos navegadores lanzan error al escribir
- `Date` se serializa como string, al hacer `JSON.parse` no se convierte de vuelta a Date
- Funciones y `undefined` se pierden al serializar con JSON

---


