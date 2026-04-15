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

```
practica-07/
  index.html
  css/
    styles.css
  js/
    storage.js
    app.js
```

### Paso 2: Crear el servicio de Storage

En `storage.js`, implementar un objeto/modulo con operaciones CRUD sobre localStorage:
- `getAll()` - leer todos los items
- `create(item)` - agregar un item con ID unico
- `update(id, cambios)` - actualizar un item
- `delete(id)` - eliminar un item
- `clear()` - eliminar todos

### Paso 3: Lista CRUD persistente

1. Formulario para agregar items (cualquier dominio: tareas, contactos, notas)
2. Lista visual de items guardados
3. Boton para marcar como completado/activo (toggle)
4. Boton para eliminar con confirmacion
5. Los datos deben sobrevivir al recargar la pagina

### Paso 4: Agregar edicion inline

1. Al hacer click en "Editar", el texto se convierte en input editable
2. Al presionar Enter o click fuera, se guarda el cambio
3. Boton "Cancelar" para descartar
4. El cambio se persiste en localStorage

### Paso 5: Selector de tema persistente

1. Al menos 3 opciones de tema visual (claro, oscuro, otro)
2. El tema seleccionado se guarda en localStorage
3. Al recargar, se aplica el tema guardado
4. Cambiar tema actualiza variables CSS custom

### Paso 6: Estadisticas y exportar datos

1. Mostrar estadisticas: total, completados, pendientes
2. Boton "Exportar" que descarga los datos como archivo JSON
3. Boton "Importar" que lee un archivo JSON y carga los datos
4. Informacion de espacio usado en Storage

---

## 8. Resultados y Evidencias

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


