# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 10: Optimizacion y Buenas Practicas

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

Escribir codigo que funciona es el primer paso. Escribir codigo que funciona **bien**, rapido y accesible para todos es el objetivo profesional. Esta practica cubre tecnicas esenciales de optimizacion de rendimiento, accesibilidad basica, responsive design con JavaScript y patrones de codigo limpio que marcan la diferencia entre un proyecto amateur y uno profesional.

### Por que optimizar?

| Aspecto | Sin optimizacion | Con optimizacion |
|---------|:-:|:-:|
| Performance | Busqueda: 50 peticiones/segundo | Busqueda: 1 peticion cada 300ms |
| Scroll | 100+ eventos/segundo (lag) | 5 eventos/segundo (fluido) |
| Imagenes | Todas cargan al inicio (5MB) | Cargan bajo demanda (~500KB) |
| Accesibilidad | No usable con teclado | Completamente accesible |
| Responsive | Layout roto en movil | Adaptado a todos los dispositivos |
| Codigo | 500 lineas, dificil mantener | Funciones pequenas, reutilizables |

---

## 2. Conceptos Clave

### Debounce

**Definicion:** Retrasa la ejecucion de una funcion hasta que el usuario deje de disparar el evento durante un tiempo definido.

```javascript
function debounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Uso
inputBusqueda.addEventListener('input', debounce((e) => {
  buscar(e.target.value);
}, 300));
```

**Cuando usar:**
- ✅ Busqueda en tiempo real
- ✅ Autocompletado
- ✅ Validacion de formularios mientras escribes
- ✅ Resize de ventana

### Throttle

**Definicion:** Limita la ejecucion de una funcion a maximo una vez cada X milisegundos.

```javascript
function throttle(fn, limit = 200) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// Uso
window.addEventListener('scroll', throttle(() => {
  actualizarProgreso();
}, 200));
```

**Cuando usar:**
- ✅ Scroll tracking
- ✅ Mouse move
- ✅ Resize continuo
- ✅ Game loops

### Comparacion visual

```
Usuario escribe "hola" en busqueda:

SIN DEBOUNCE (4 peticiones):
h    → buscar("h")
ho   → buscar("ho")
hol  → buscar("hol")
hola → buscar("hola")

CON DEBOUNCE 300ms (1 peticion):
h    → espera...
ho   → espera...
hol  → espera...
hola → espera 300ms → buscar("hola")

Usuario hace scroll:

SIN THROTTLE:
Evento cada 10ms = 100 eventos/segundo

CON THROTTLE 200ms:
Maximo 1 evento cada 200ms = 5 eventos/segundo
```

---

## 3. Explicacion Tecnica Detallada

### Debounce - Implementacion paso a paso

```javascript
function debounce(fn, delay = 300) {
  // 1. Variable para guardar el timer
  let timer;
  
  // 2. Retornar una nueva funcion
  return function(...args) {
    // 3. Cancelar el timer anterior si existe
    clearTimeout(timer);
    
    // 4. Crear un nuevo timer
    timer = setTimeout(() => {
      // 5. Ejecutar la funcion original con el contexto correcto
      fn.apply(this, args);
    }, delay);
  };
}
```

**Explicacion:**
1. `timer` guarda el ID del timeout actual
2. La funcion retornada es la que realmente se ejecuta en cada evento
3. `clearTimeout` cancela el timer anterior (resetea el contador)
4. `setTimeout` crea un nuevo timer de `delay` ms
5. `fn.apply(this, args)` ejecuta la funcion original manteniendo el contexto (`this`) y argumentos

### Throttle - Implementacion paso a paso

```javascript
function throttle(fn, limit = 200) {
  // 1. Variable para guardar el timestamp de la ultima ejecucion
  let lastCall = 0;
  
  // 2. Retornar una nueva funcion
  return function(...args) {
    // 3. Obtener timestamp actual
    const now = Date.now();
    
    // 4. Verificar si ha pasado el tiempo limite
    if (now - lastCall >= limit) {
      // 5. Actualizar timestamp y ejecutar
      lastCall = now;
      fn.apply(this, args);
    }
    // Si no ha pasado el tiempo, no hace nada (ignora el evento)
  };
}
```

**Explicacion:**
1. `lastCall` guarda el timestamp (ms desde 1970) de la ultima ejecucion
2. Retorna funcion que se ejecuta en cada evento
3. `Date.now()` obtiene timestamp actual
4. Compara tiempo transcurrido con el limite
5. Solo ejecuta si ha pasado suficiente tiempo

### Lazy Loading con Intersection Observer

```javascript
function lazyLoadImages(selector = 'img[data-src]') {
  const images = document.querySelectorAll(selector);
  
  // Configurar observer
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      // Verificar si el elemento es visible
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Cargar imagen real
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        
        // Dejar de observar esta imagen
        obs.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px' // Cargar 100px antes de ser visible
  });
  
  // Observar todas las imagenes
  images.forEach(img => observer.observe(img));
}
```

**HTML correspondiente:**

```html
<!-- Usar data-src en lugar de src -->
<img data-src="foto-grande.jpg" alt="Descripcion" class="lazy">
```

**Como funciona:**
1. Las imagenes tienen `data-src` en lugar de `src` (no cargan automaticamente)
2. `IntersectionObserver` detecta cuando una imagen esta por ser visible
3. `rootMargin: '100px'` carga 100px antes (mejora UX)
4. Cuando es visible, mueve `data-src` → `src` (dispara la carga)
5. `unobserve` deja de observar (ya cargo, no necesita mas)

### Infinite Scroll

```javascript
function infiniteScroll(sentinelSelector, callback) {
  const sentinel = document.querySelector(sentinelSelector);
  
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      callback(); // Cargar mas items
    }
  });
  
  observer.observe(sentinel);
  return observer;
}

// HTML: elemento sentinel al final de la lista
// <div id="sentinel"></div>

// Uso
let pagina = 1;
infiniteScroll('#sentinel', async () => {
  pagina++;
  const items = await fetch(`/api/items?page=${pagina}`);
  renderizarItems(items);
});
```

### matchMedia - Responsive con JavaScript

```javascript
// Detectar si es movil
const isMobile = window.matchMedia('(max-width: 768px)');

function handleLayoutChange(mediaQuery) {
  if (mediaQuery.matches) {
    // Es movil
    sidebar.classList.add('hidden');
    menu.classList.add('hamburger');
  } else {
    // Es desktop
    sidebar.classList.remove('hidden');
    menu.classList.remove('hamburger');
  }
}

// Ejecutar al cargar
handleLayoutChange(isMobile);

// Observar cambios
isMobile.addEventListener('change', handleLayoutChange);
```

**Ventaja sobre resize listener:**

```javascript
// ❌ MALO: se ejecuta constantemente
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    // cambiar layout
  }
});

// ✅ BUENO: solo se ejecuta al cruzar el breakpoint
const mobile = window.matchMedia('(max-width: 768px)');
mobile.addEventListener('change', (e) => {
  if (e.matches) {
    // cambiar layout solo cuando cruza el breakpoint
  }
});
```

### Preferencia de tema del sistema

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function aplicarTema(esDark) {
  document.documentElement.setAttribute(
    'data-theme',
    esDark ? 'dark' : 'light'
  );
}

// Aplicar tema inicial
aplicarTema(prefersDark.matches);

// Observar cambios
prefersDark.addEventListener('change', (e) => {
  aplicarTema(e.matches);
});
```

**CSS correspondiente:**

```css
:root {
  --color-bg: #ffffff;
  --color-text: #000000;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}
```

### Accesibilidad basica con JavaScript

#### 1. ARIA live regions (anuncios dinamicos)

```javascript
function anunciar(mensaje, prioridad = 'polite') {
  const liveRegion = document.querySelector('#aria-live');
  liveRegion.setAttribute('aria-live', prioridad);
  liveRegion.textContent = mensaje;
}

// HTML
// <div id="aria-live" aria-live="polite" class="sr-only"></div>

// Uso
anunciar('Se guardaron 3 productos');
anunciar('Error: formulario invalido', 'assertive'); // Interrumpe
```

**Tipos de aria-live:**
- `polite`: Espera a que el screen reader termine de leer
- `assertive`: Interrumpe la lectura actual (usar solo para errores criticos)

#### 2. Focus trap en modales

```javascript
function trapFocus(container) {
  const focusables = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  
  function handleTab(e) {
    if (e.key !== 'Tab') return;
    
    // Shift + Tab en el primero → ir al ultimo
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
    // Tab en el ultimo → ir al primero
    else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  
  container.addEventListener('keydown', handleTab);
  
  // Retornar funcion para liberar
  return () => container.removeEventListener('keydown', handleTab);
}

// Uso
const modal = document.querySelector('#modal');
const releaseTrap = trapFocus(modal);

// Al cerrar modal
cerrarModal();
releaseTrap(); // Liberar trap
```

#### 3. Cerrar con Escape

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modalAbierto = document.querySelector('.modal:not([aria-hidden="true"])');
    if (modalAbierto) {
      cerrarModal(modalAbierto);
    }
  }
});
```

#### 4. Validacion accesible de formularios

```javascript
function mostrarError(input, mensaje, esValido) {
  const errorId = `${input.id}-error`;
  let errorElement = document.getElementById(errorId);
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.setAttribute('role', 'alert');
    input.parentElement.appendChild(errorElement);
  }
  
  if (esValido) {
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
  } else {
    errorElement.textContent = mensaje;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
  }
}

// Uso
const email = document.querySelector('#email');
email.addEventListener('blur', () => {
  const esValido = validarEmail(email.value);
  mostrarError(email, 'Email invalido', esValido);
});
```

### Performance: Reducir reflows

```javascript
// ❌ MALO: Multiples reflows (uno por cada appendChild)
function renderizarMalo(items) {
  const lista = document.querySelector('#lista');
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    lista.appendChild(li); // Reflow aqui en cada iteracion
  });
}

// ✅ BUENO: Un solo reflow con DocumentFragment
function renderizarBueno(items) {
  const lista = document.querySelector('#lista');
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    fragment.appendChild(li); // No causa reflow (en memoria)
  });
  
  lista.appendChild(fragment); // Un solo reflow aqui
}
```

**Por que es mas rapido?**
- `appendChild` al DOM causa **reflow** (recalculo de layout)
- `DocumentFragment` esta en memoria (no causa reflow)
- Agregar fragment al DOM causa un solo reflow al final

### requestAnimationFrame para animaciones

```javascript
// ❌ MALO: setTimeout/setInterval no sincroniza con repaint
function animarConTimeout(elemento) {
  let ancho = 0;
  setInterval(() => {
    ancho += 5;
    elemento.style.width = `${ancho}px`;
  }, 16); // ~60fps pero no sincronizado
}

// ✅ BUENO: requestAnimationFrame sincroniza con el navegador
function animarConRAF(elemento, duracion = 1000) {
  const inicio = performance.now();
  
  function step(timestamp) {
    const progreso = Math.min((timestamp - inicio) / duracion, 1);
    const ancho = progreso * 100; // 0 a 100
    
    elemento.style.width = `${ancho}%`;
    
    if (progreso < 1) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Buscador con debounce y performance

```javascript
'use strict';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Debounce
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Buscar con medicion de performance
async function buscarPosts(termino) {
  if (!termino.trim()) {
    renderResultados([]);
    return;
  }
  
  // Marcar inicio
  performance.mark('search-start');
  
  try {
    const response = await fetch(`${API_URL}?_limit=100`);
    const posts = await response.json();
    
    const filtrados = posts.filter(p =>
      p.title.toLowerCase().includes(termino.toLowerCase())
    );
    
    // Marcar fin y medir
    performance.mark('search-end');
    performance.measure('search', 'search-start', 'search-end');
    
    const medida = performance.getEntriesByName('search')[0];
    console.log(`Busqueda tomo: ${medida.duration.toFixed(2)}ms`);
    
    renderResultados(filtrados);
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderResultados(posts) {
  const container = document.querySelector('#resultados');
  
  if (posts.length === 0) {
    container.innerHTML = '<p>No hay resultados</p>';
    return;
  }
  
  // Usar fragment para un solo reflow
  const fragment = document.createDocumentFragment();
  
  posts.slice(0, 10).forEach(post => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const title = document.createElement('h3');
    title.textContent = post.title;
    
    const body = document.createElement('p');
    body.textContent = post.body.slice(0, 100) + '...';
    
    card.appendChild(title);
    card.appendChild(body);
    fragment.appendChild(card);
  });
  
  container.innerHTML = '';
  container.appendChild(fragment);
}

// Evento con debounce
document.querySelector('#search').addEventListener('input',
  debounce((e) => buscarPosts(e.target.value), 400)
);
```

### Ejemplo 2: Modal accesible completo

```javascript
'use strict';

function openModal(modalId, triggerId) {
  const modal = document.querySelector(modalId);
  const trigger = document.querySelector(triggerId);
  
  // Guardar elemento previo con foco
  const previouslyFocused = document.activeElement;
  
  // Mostrar modal
  modal.style.display = 'block';
  modal.removeAttribute('aria-hidden');
  
  // Setup focus trap
  const focusables = modal.querySelectorAll(
    'button, [href], input, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusables[0];
  const lastFocusable = focusables[focusables.length - 1];
  
  // Mover foco al modal
  setTimeout(() => firstFocusable.focus(), 100);
  
  // Trap de foco
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
  
  // Cerrar con Escape
  function closeOnEscape(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }
  
  // Cerrar modal
  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    
    // Restaurar foco
    previouslyFocused.focus();
    
    // Limpiar listeners
    modal.removeEventListener('keydown', trapFocus);
    document.removeEventListener('keydown', closeOnEscape);
  }
  
  // Agregar listeners
  modal.addEventListener('keydown', trapFocus);
  document.addEventListener('keydown', closeOnEscape);
  
  // Boton de cerrar
  modal.querySelector('.btn-close').addEventListener('click', closeModal, { once: true });
  
  return { closeModal };
}

// Uso
document.querySelector('#btn-open').addEventListener('click', () => {
  openModal('#modal', '#btn-open');
});
```

---

## 5. Comparaciones / Tablas

### Debounce vs Throttle

| Aspecto | Debounce | Throttle |
|---------|:-:|:-:|
| **Ejecucion** | Al FINAL de la pausa | DURANTE el flujo a intervalos |
| **Timer** | Se resetea en cada evento | No se resetea |
| **Uso tipico** | Busqueda, autocompletado | Scroll, mouse move |
| **Ejemplo tiempo** | 300ms sin actividad | Cada 200ms |
| **Input "hola"** | 1 ejecucion (al final) | 2-3 ejecuciones |
| **Scroll 2 segundos** | 1 ejecucion (al parar) | ~10 ejecuciones |
| **Respuesta** | Retrasada pero eficiente | Continua y limitada |

### Tecnicas de optimizacion de rendimiento

| Tecnica | Problema que resuelve | Cuando usar | Mejora tipica |
|---------|----------------------|-------------|---------------|
| Debounce | Demasiadas peticiones API | Busqueda en tiempo real | 90-95% menos peticiones |
| Throttle | Demasiados handlers | Scroll, resize, mousemove | 80-90% menos ejecuciones |
| Lazy loading | Carga inicial lenta | Imagenes, componentes pesados | 50-70% menos carga inicial |
| DocumentFragment | Multiples reflows | Renderizar listas largas | 2-5x mas rapido |
| Event delegation | Demasiados listeners | Listas dinamicas | N listeners → 1 listener |
| requestAnimationFrame | Animaciones con lag | Animaciones JS | 60fps sincronizado |

### Checklist de accesibilidad

| Elemento | Que verificar | Como implementar |
|----------|--------------|------------------|
| **Imagenes** | Alt text descriptivo | `<img src="..." alt="Descripcion clara">` |
| **Formularios** | Labels asociados | `<label for="email">Email</label>` |
| **Botones** | Texto descriptivo | `<button aria-label="Cerrar modal">✕</button>` |
| **Modales** | Focus trap + Escape | trapFocus() + keydown Escape |
| **Color** | Contraste minimo 4.5:1 | Verificar con DevTools |
| **Navegacion** | Teclado funcional | Tab, Enter, Escape, Arrows |
| **Contenido dinamico** | Anuncios a SR | `<div aria-live="polite">` |
| **Focus visible** | Outline visible | `:focus-visible { outline: ... }` |

### Breakpoints comunes con matchMedia

| Breakpoint | Media Query | Uso tipico |
|------------|-------------|------------|
| Mobile | `(max-width: 768px)` | Layout movil |
| Tablet | `(min-width: 769px) and (max-width: 1024px)` | Layout tablet |
| Desktop | `(min-width: 1025px)` | Layout desktop |
| Landscape | `(orientation: landscape)` | Detectar rotacion |
| Dark mode | `(prefers-color-scheme: dark)` | Tema oscuro |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Desactivar animaciones |
| High contrast | `(prefers-contrast: high)` | Aumentar contraste |

---

## 6. Funcionalidades Complementarias

### Performance API - Medir tiempos

```javascript
// Marcar puntos en el tiempo
performance.mark('inicio-render');

// ... codigo a medir ...

performance.mark('fin-render');

// Crear medida entre marcas
performance.measure('render', 'inicio-render', 'fin-render');

// Obtener resultado
const medida = performance.getEntriesByName('render')[0];
console.log(`Render tomo: ${medida.duration.toFixed(2)}ms`);

// Limpiar
performance.clearMarks();
performance.clearMeasures();
```

### Console avanzada para debugging

```javascript
// Agrupar logs relacionados
console.group('📦 Datos del usuario');
console.log('Nombre:', usuario.nombre);
console.log('Email:', usuario.email);
console.log('Rol:', usuario.rol);
console.groupEnd();

// Tabla para arrays de objetos
console.table(productos);

// Medir tiempo
console.time('fetch-users');
await fetchUsers();
console.timeEnd('fetch-users'); // "fetch-users: 234.56ms"

// Assert (solo muestra si falla)
console.assert(edad >= 18, 'Usuario debe ser mayor de edad');

// Contar ocurrencias
productos.forEach(p => {
  console.count(p.categoria); // "Electronica: 1", "Electronica: 2"...
});

// Trace (stack trace)
console.trace('Como llegamos aqui?');
```

### Preferencias del sistema

```javascript
function detectarPreferencias() {
  return {
    temaOscuro: window.matchMedia('(prefers-color-scheme: dark)').matches,
    movimientoReducido: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    contrasteAlto: window.matchMedia('(prefers-contrast: high)').matches,
    datosReducidos: window.matchMedia('(prefers-reduced-data: reduce)').matches
  };
}

const prefs = detectarPreferencias();

if (prefs.movimientoReducido) {
  // Desactivar animaciones
  document.documentElement.style.setProperty('--transition-duration', '0ms');
}

if (prefs.datosReducidos) {
  // No cargar imagenes pesadas
  document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
  });
}
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Crear estructura del proyecto

Crear la siguiente estructura:

```
practica-10-tu-apellido/
  index.html
  css/
    styles.css
  js/
    app.js
    utils/
      performance.js
      accessibility.js
      responsive.js
```

### Paso 2: Copiar HTML base

Copiar el siguiente codigo en `index.html`:

#### ¿Que hace este codigo?

Estructura HTML con multiples secciones de demostracion: busqueda con debounce, scroll con throttle, galeria con lazy loading, infinite scroll, deteccion responsive, demos de accesibilidad y modal. Incluye regiones ARIA y skip link.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Optimización y Buenas Prácticas</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- Skip to content -->
  <a href="#main-content" class="skip-link">Saltar al contenido</a>

  <!-- ARIA live region -->
  <div id="aria-live" aria-live="polite" class="sr-only"></div>

  <div class="container">
    <header class="header">
      <h1>⚡ Optimización y Buenas Prácticas</h1>
      <p>Demo completa de performance y accesibilidad</p>
      
      <button id="btn-toggle-theme" aria-label="Cambiar tema">
        <span id="theme-icon">🌙</span>
      </button>
    </header>

    <main id="main-content">
      <!-- Seccion 1: Debounce -->
      <section class="demo-section">
        <h2>1. Debounce - Búsqueda Optimizada</h2>
        <p>Escribe para buscar. Observa el contador de ejecuciones.</p>
        
        <input 
          type="search" 
          id="search-debounce" 
          placeholder="Buscar posts..."
          aria-describedby="search-stats"
        >
        
        <div id="search-stats">
          <span>Ejecuciones: <strong id="debounce-count">0</strong></span>
          <span id="search-status">Esperando búsqueda...</span>
        </div>

        <div id="search-results" role="region" aria-live="polite">
          <!-- Resultados -->
        </div>
      </section>

      <!-- Seccion 2: Throttle -->
      <section class="demo-section">
        <h2>2. Throttle - Scroll Tracking</h2>
        <p>Scroll en la caja. El throttle limita a 1 ejecución cada 200ms.</p>
        
        <div class="stats">
          <span>Ejecuciones: <strong id="throttle-count">0</strong></span>
          <span>Posición: <strong id="scroll-position">0px</strong></span>
        </div>

        <div id="scroll-area" class="scroll-area" tabindex="0">
          <div class="scroll-content">
            <p>📜 Contenido largo para hacer scroll</p>
            <div style="height: 2000px; background: linear-gradient(#e3f2fd, #1976d2);"></div>
          </div>
        </div>
      </section>

      <!-- Seccion 3: Lazy Loading -->
      <section class="demo-section">
        <h2>3. Lazy Loading - Intersection Observer</h2>
        <p>Imágenes cargan solo cuando están por ser visibles.</p>
        
        <div class="stats">
          <span>Cargadas: <strong id="images-loaded">0</strong> / <strong id="images-total">20</strong></span>
        </div>

        <div id="gallery" class="gallery">
          <!-- Imagenes generadas dinamicamente -->
        </div>
      </section>

      <!-- Seccion 4: Responsive -->
      <section class="demo-section">
        <h2>4. Responsive - matchMedia</h2>
        
        <div class="device-info">
          <div class="info-card">
            <h3>📱 Dispositivo</h3>
            <p id="device-type">-</p>
          </div>
          
          <div class="info-card">
            <h3>🎨 Tema del sistema</h3>
            <p id="system-theme">-</p>
          </div>
        </div>
      </section>

      <!-- Seccion 5: Accesibilidad -->
      <section class="demo-section">
        <h2>5. Accesibilidad</h2>
        
        <div class="demo-card">
          <h3>Modal accesible</h3>
          <button id="btn-open-modal" class="btn-primary">Abrir Modal</button>
        </div>

        <div class="demo-card">
          <h3>Formulario con validación</h3>
          <form id="demo-form" novalidate>
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" id="nombre" required aria-required="true">
              <div id="nombre-error" class="error-mensaje" role="alert"></div>
            </div>
            
            <button type="submit">Enviar</button>
          </form>
        </div>
      </section>
    </main>
  </div>

  <!-- Modal -->
  <div id="modal-overlay" class="modal-overlay" style="display: none;">
    <div id="modal" class="modal" role="dialog" aria-modal="true">
      <h2 id="modal-title">Modal Accesible</h2>
      <p>Focus trap activo. Tab para navegar, Escape para cerrar.</p>
      <button id="btn-close-modal" class="btn-close">Cerrar</button>
    </div>
  </div>

  <script type="module" src="js/app.js"></script>
</body>
</html>
```

### Paso 3: Crear utils/performance.js (copiar y completar)

Crear `js/utils/performance.js`:

#### ¿Que hace este codigo?

Funciones de optimizacion: debounce retrasa ejecucion, throttle limita frecuencia, lazyLoadImages usa IntersectionObserver, infiniteScroll detecta scroll al final, measurePerformance mide tiempos.

```javascript
'use strict';

// TODO 3.1: Implementar debounce(fn, delay)
// Debe retornar funcion que cancela timer anterior y crea nuevo timer
export function debounce(fn, delay = 300) {
  let timer;
  
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// TODO 3.2: Implementar throttle(fn, limit)
// Debe retornar funcion que solo ejecuta si paso el tiempo limite
export function throttle(fn, limit = 200) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// TODO 3.3: Implementar lazyLoadImages(selector, options)
// Debe usar IntersectionObserver para cargar imagenes bajo demanda
export function lazyLoadImages(selector = 'img[data-src]', options = {}) {
  const images = document.querySelectorAll(selector);
  
  const defaultOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0
  };
  
  const observerOptions = { ...defaultOptions, ...options };
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          
          img.addEventListener('load', () => {
            img.dispatchEvent(new CustomEvent('imageLoaded'));
          });
        }
        
        obs.unobserve(img);
      }
    });
  }, observerOptions);
  
  images.forEach(img => observer.observe(img));
  
  return observer;
}

// TODO 3.4: Implementar infiniteScroll(sentinelSelector, callback)
// Debe ejecutar callback cuando sentinel es visible
export function infiniteScroll(sentinelSelector, callback) {
  const sentinel = document.querySelector(sentinelSelector);
  
  if (!sentinel) {
    console.error(`Sentinel "${sentinelSelector}" no encontrado`);
    return null;
  }
  
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      callback();
    }
  });
  
  observer.observe(sentinel);
  
  return observer;
}

// TODO 3.5: Implementar measurePerformance(name, fn)
// Debe usar performance.mark y performance.measure
export async function measurePerformance(name, fn) {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  
  performance.mark(startMark);
  const result = await fn();
  performance.mark(endMark);
  
  performance.measure(name, startMark, endMark);
  const measure = performance.getEntriesByName(name)[0];
  
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(name);
  
  return { result, duration: measure.duration };
}
```

### Paso 4: Crear utils/accessibility.js (copiar y completar)

Crear `js/utils/accessibility.js`:

#### ¿Que hace este codigo?

Funciones de accesibilidad: anunciar usa aria-live para screen readers, trapFocus mantiene foco dentro de modal, openAccessibleModal abre modal con manejo correcto de foco y teclado.

```javascript
'use strict';

// TODO 4.1: Implementar anunciar(mensaje, priority)
// Debe actualizar region aria-live para screen readers
export function anunciar(mensaje, priority = 'polite') {
  const liveRegion = document.querySelector('#aria-live');
  
  if (!liveRegion) return;
  
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = '';
  
  setTimeout(() => {
    liveRegion.textContent = mensaje;
  }, 100);
}

// TODO 4.2: Implementar trapFocus(container)
// Debe mantener foco dentro del contenedor con Tab/Shift+Tab
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  function handleTab(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
  
  container.addEventListener('keydown', handleTab);
  
  return () => container.removeEventListener('keydown', handleTab);
}

// TODO 4.3: Implementar openAccessibleModal(modal, trigger)
// Debe mostrar modal, setup focus trap, y retornar metodo close
export function openAccessibleModal(modal, trigger) {
  const previouslyFocused = trigger || document.activeElement;
  
  modal.style.display = 'flex';
  modal.removeAttribute('aria-hidden');
  
  const releaseTrap = trapFocus(modal);
  
  const firstFocusable = modal.querySelector(
    'button, [href], input, [tabindex]:not([tabindex="-1"])'
  );
  
  if (firstFocusable) {
    setTimeout(() => firstFocusable.focus(), 100);
  }
  
  function close() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    releaseTrap();
    
    if (previouslyFocused) {
      previouslyFocused.focus();
    }
  }
  
  function handleEscape(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handleEscape);
    }
  }
  
  document.addEventListener('keydown', handleEscape);
  
  return {
    close,
    removeEscapeListener: () => document.removeEventListener('keydown', handleEscape)
  };
}
```

### Paso 5: Crear utils/responsive.js (copiar)

Crear `js/utils/responsive.js`:

#### ¿Que hace este codigo?

Funciones responsive: detectarDispositivo verifica tipo con matchMedia, observarTemaDelSistema detecta preferencia dark/light, observarBreakpoint ejecuta callback al cruzar breakpoint.

```javascript
'use strict';

// TODO 5.1: Exportar detectarDispositivo()
export function detectarDispositivo() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
  const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    tipo: isMobile ? 'móvil' : isTablet ? 'tablet' : 'desktop',
    ancho: window.innerWidth,
    alto: window.innerHeight
  };
}

// TODO 5.2: Exportar observarTemaDelSistema(callback)
export function observarTemaDelSistema(callback) {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  callback(darkModeQuery.matches ? 'dark' : 'light');
  
  darkModeQuery.addEventListener('change', (e) => {
    callback(e.matches ? 'dark' : 'light');
  });
  
  return darkModeQuery;
}

// TODO 5.3: Exportar observarBreakpoint(query, callback)
export function observarBreakpoint(query, callback) {
  const mediaQuery = window.matchMedia(query);
  
  callback(mediaQuery);
  
  mediaQuery.addEventListener('change', callback);
  
  return mediaQuery;
}
```

### Paso 6: Crear app.js principal (copiar y completar)

Crear `js/app.js`:

#### ¿Que hace este codigo?

Punto de entrada que integra todas las utilidades. Configura busqueda con debounce, scroll con throttle, lazy loading de imagenes, infinite scroll, deteccion responsive, modal accesible y medicion de performance.

```javascript
'use strict';

// TODO 6.1: Importar funciones desde utils/performance.js
import {
  debounce,
  throttle,
  lazyLoadImages,
  infiniteScroll,
  measurePerformance
} from './utils/performance.js';

// TODO 6.2: Importar funciones desde utils/accessibility.js
import {
  anunciar,
  openAccessibleModal
} from './utils/accessibility.js';

// TODO 6.3: Importar funciones desde utils/responsive.js
import {
  detectarDispositivo,
  observarTemaDelSistema
} from './utils/responsive.js';

// Estado
let state = {
  debounceCount: 0,
  throttleCount: 0,
  imagesLoaded: 0,
  imagesTotal: 20
};

// TODO 6.4: Implementar buscarPosts(termino) con debounce
async function buscarPosts(termino) {
  state.debounceCount++;
  document.getElementById('debounce-count').textContent = state.debounceCount;
  
  if (!termino.trim()) {
    document.getElementById('search-results').innerHTML = '<p>Escribe para buscar...</p>';
    return;
  }
  
  document.getElementById('search-status').textContent = 'Buscando...';
  
  const { result: posts, duration } = await measurePerformance('search', async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=100`);
    const data = await response.json();
    return data.filter(p => p.title.toLowerCase().includes(termino.toLowerCase()));
  });
  
  console.log(`Búsqueda tomó: ${duration.toFixed(2)}ms`);
  renderResultados(posts);
  
  anunciar(`${posts.length} resultados encontrados`);
}

function renderResultados(posts) {
  const container = document.getElementById('search-results');
  
  if (posts.length === 0) {
    container.innerHTML = '<p>No hay resultados</p>';
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  posts.slice(0, 10).forEach(post => {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const title = document.createElement('h3');
    title.textContent = post.title;
    
    card.appendChild(title);
    fragment.appendChild(card);
  });
  
  container.innerHTML = '';
  container.appendChild(fragment);
  
  document.getElementById('search-status').textContent = `${posts.length} resultado(s)`;
}

// TODO 6.5: Implementar handleScroll(e) con throttle
function handleScroll(e) {
  state.throttleCount++;
  document.getElementById('throttle-count').textContent = state.throttleCount;
  
  const position = e.target.scrollTop;
  document.getElementById('scroll-position').textContent = `${Math.round(position)}px`;
}

// TODO 6.6: Implementar setupLazyLoading()
function setupLazyLoading() {
  const gallery = document.getElementById('gallery');
  
  for (let i = 1; i <= state.imagesTotal; i++) {
    const img = document.createElement('img');
    img.setAttribute('data-src', `https://picsum.photos/300/300?random=${i}`);
    img.alt = `Imagen ${i}`;
    
    img.addEventListener('imageLoaded', () => {
      state.imagesLoaded++;
      document.getElementById('images-loaded').textContent = state.imagesLoaded;
    });
    
    gallery.appendChild(img);
  }
  
  lazyLoadImages('img[data-src]');
}

// TODO 6.7: Implementar setupResponsive()
function setupResponsive() {
  const dispositivo = detectarDispositivo();
  document.getElementById('device-type').textContent = dispositivo.tipo;
  
  observarTemaDelSistema((tema) => {
    document.getElementById('system-theme').textContent = 
      tema === 'dark' ? 'Oscuro' : 'Claro';
  });
}

// TODO 6.8: Implementar setupAccessibility()
function setupAccessibility() {
  const btnOpen = document.getElementById('btn-open-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  
  btnOpen.addEventListener('click', () => {
    const modalControls = openAccessibleModal(modalOverlay, btnOpen);
    
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      modalControls.close();
      modalControls.removeEscapeListener();
      anunciar('Modal cerrado');
    }, { once: true });
    
    anunciar('Modal abierto');
  });
}

// TODO 6.9: Inicializacion en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Busqueda con debounce
  document.getElementById('search-debounce').addEventListener('input',
    debounce((e) => buscarPosts(e.target.value), 400)
  );
  
  // Scroll con throttle
  document.getElementById('scroll-area').addEventListener('scroll',
    throttle(handleScroll, 200)
  );
  
  // Lazy loading
  setupLazyLoading();
  
  // Responsive
  setupResponsive();
  
  // Accesibilidad
  setupAccessibility();
  
  anunciar('Aplicación cargada');
});
```

### Paso 7: Crear CSS base

> **Nota:** Por brevedad, copiar el CSS completo desde `solver/10-optimizacion-buenas-practicas/css/styles.css` (incluye variables CSS, estilos para tema oscuro, componentes, animaciones y responsive).

### Paso 8: Probar y verificar

1. Abrir con Live Server
2. Verificar que busqueda solo ejecuta al dejar de escribir
3. Verificar que scroll ejecuta maximo cada 200ms
4. Verificar que imagenes cargan bajo demanda (Network tab)
5. Verificar navegacion con teclado (Tab, Escape)
6. Verificar que modal atrapa foco
7. Cambiar tamaño de ventana y verificar deteccion responsive

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Debounce funcionando** - Screenshot del input con contadores de ejecuciones (sin vs con debounce)
2. **Throttle funcionando** - Screenshot del scroll con contadores mostrando limitacion
3. **Lazy loading** - Screenshot de Network tab mostrando carga diferida de imagenes
4. **Responsive detectado** - Screenshot mostrando tipo de dispositivo detectado
5. **Tema del sistema** - Screenshot con tema claro y oscuro aplicados
6. **Modal accesible** - Screenshot del modal abierto con focus visible
7. **Navegacion con teclado** - Screenshot mostrando focus outline visible
8. **Console con performance** - Screenshot de console.log mostrando tiempos medidos
9. **Lighthouse** - Screenshot de DevTools > Lighthouse (performance, accessibility)

### Formato del Archivo de Evidencias

Crear `EVIDENCIAS.md`:

```markdown
# Evidencias - Practica 10: Optimizacion y Buenas Practicas

## 1. Debounce
![Debounce](assets/01-debounce.png)
**Descripcion:** Al escribir "javascript", sin debounce se ejecutaron 10 veces, con debounce solo 1 vez

## 2. Throttle
![Throttle](assets/02-throttle.png)
**Descripcion:** Durante 2 segundos de scroll, sin throttle 200+ ejecuciones, con throttle solo 10

## 3. Lazy Loading - Network
![Lazy Loading](assets/03-lazy-loading.png)
**Descripcion:** Network tab muestra imagenes cargando solo cuando hacen scroll

...
```

---

## 9. Entregables

### Archivos requeridos

- ✅ Repositorio GitHub con codigo completo
- ✅ Debounce y throttle implementados (funciones propias, no librerias)
- ✅ Lazy loading con Intersection Observer
- ✅ matchMedia para deteccion responsive
- ✅ Al menos 3 mejoras de accesibilidad implementadas
- ✅ Modal accesible con focus trap
- ✅ Medicion de performance con Performance API
- ✅ Carpeta `assets/` con al menos 8 capturas
- ✅ Archivo `EVIDENCIAS.md` completado
- ✅ `README.md` con instrucciones

### Estructura final del entregable

```
practica-10-tu-apellido/
  README.md
  EVIDENCIAS.md
  index.html
  css/
    styles.css
  js/
    app.js
    utils/
      performance.js
      accessibility.js
      responsive.js
  assets/
    01-debounce.png
    02-throttle.png
    03-lazy-loading.png
    04-responsive.png
    05-tema.png
    06-modal.png
    07-teclado.png
    08-console.png
    09-lighthouse.png
```

---

## Reglas Importantes

- ❌ No usar frameworks ni librerias (lodash, jQuery, etc.)
- ✅ Solo JavaScript puro
- ✅ Debounce y throttle deben ser funciones propias
- ✅ Lazy loading con IntersectionObserver (no scroll listener)
- ✅ Al menos 3 atributos ARIA en la pagina
- ✅ Modal debe atrapar foco con Tab/Shift+Tab
- ✅ Cerrar modal con Escape obligatorio
- ✅ Skip link funcional
- ✅ Ejecutar con Live Server (no file://)

---

## Notas de Implementacion

### Conceptos importantes

- `debounce` ejecuta al FINAL de la pausa, `throttle` ejecuta DURANTE el flujo
- `IntersectionObserver` es mas eficiente que calcular scroll manualmente
- `requestAnimationFrame` ejecuta antes del repaint (~60fps)
- `matchMedia` es mas eficiente que resize listener para detectar breakpoints
- `aria-live="polite"` espera que termine el SR, `assertive` interrumpe
- `performance.now()` tiene precision de microsegundos
- `DocumentFragment` evita reflows multiples
- `prefers-color-scheme` detecta tema del sistema operativo
- `prefers-reduced-motion` respeta preferencia de accesibilidad del usuario

### Buenas practicas de codigo

- Nombres descriptivos (no `d`, `fn`, `x` → usar `duracion`, `funcionCallback`, `coordenadaX`)
- Funciones pequenas (maximo 20-30 lineas)
- Early return para evitar anidacion profunda
- Destructuring en parametros de funciones
- Valores por defecto en parametros
- Comentarios solo cuando el codigo no es auto-explicativo
- Separar responsabilidades (cada funcion hace una cosa)

### Performance

- Usar `DocumentFragment` para insertar multiples elementos
- Evitar leer propiedades del DOM dentro de loops (causa reflow)
- Usar `debounce` para eventos frecuentes con peticiones API
- Usar `throttle` para eventos de UI (scroll, mousemove)
- Lazy load de imagenes y componentes pesados
- Medir con Performance API antes de optimizar

### Accesibilidad

- Todos los elementos interactivos accesibles con teclado
- Focus visible siempre (no `outline: none` sin alternativa)
- ARIA labels en botones con solo iconos
- ARIA live regions para contenido dinamico
- Contraste minimo 4.5:1 (verificar con DevTools)
- Skip link al inicio de la pagina
- Cerrar modales con Escape
- Focus trap en modales

---

## Referencias

- [MDN - Debouncing and Throttling](https://developer.mozilla.org/en-US/docs/Glossary/Debounce)
- [MDN - Intersection Observer API](https://developer.mozilla.org/es/docs/Web/API/Intersection_Observer_API)
- [MDN - Window.matchMedia()](https://developer.mozilla.org/es/docs/Web/API/Window/matchMedia)
- [MDN - Performance API](https://developer.mozilla.org/es/docs/Web/API/Performance)
- [MDN - ARIA](https://developer.mozilla.org/es/docs/Web/Accessibility/ARIA)
- [Web.dev - Performance](https://web.dev/performance/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Preguntas Frecuentes

**Q:** ¿Cuando usar debounce vs throttle?  
**A:** `debounce` para acciones que deben ejecutarse solo al final (busqueda, validacion). `throttle` para acciones continuas que deben limitarse (scroll, mousemove).

**Q:** ¿Por que IntersectionObserver y no scroll listener?  
**A:** IntersectionObserver es mas eficiente, no ejecuta constantemente, y el navegador lo optimiza mejor.

**Q:** ¿Como pruebo accesibilidad sin screen reader?  
**A:** Navega solo con teclado (Tab, Enter, Escape). Usa DevTools > Lighthouse > Accessibility.

**Q:** ¿Que es el focus trap y por que es importante?  
**A:** Mantiene el foco dentro del modal (Tab no sale del modal). Importante para usuarios de teclado y screen readers.

**Q:** ¿Como mido performance en produccion?  
**A:** Usa Performance API en el codigo, o herramientas como Lighthouse, WebPageTest, Chrome DevTools Performance tab.

---
