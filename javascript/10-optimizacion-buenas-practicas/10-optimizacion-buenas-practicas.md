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

Escribir codigo que funciona es el primer paso. Escribir codigo que funciona **bien** es el objetivo. Esta practica cubre tecnicas de optimizacion de rendimiento, accesibilidad basica, responsive design con JavaScript y patrones de codigo limpio que marcan la diferencia entre un proyecto amateur y uno profesional.

### Areas de mejora

| Area | Que mejora | Impacto |
|------|-----------|---------|
| Performance | Velocidad de la app | UX, SEO, retencion |
| Accesibilidad (a11y) | Uso por todos los usuarios | Inclusion, legal |
| Responsive | Adaptacion a dispositivos | Alcance, UX movil |
| Codigo limpio | Legibilidad, mantenimiento | Productividad del equipo |

---

## 2. Conceptos Clave

### Debounce

Retrasa la ejecucion de una funcion hasta que el usuario deje de disparar el evento durante un tiempo definido. Ideal para busqueda en tiempo real.

```javascript
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Uso: ejecutar busqueda solo cuando el usuario deja de escribir por 300ms
const inputBusqueda = document.querySelector('#busqueda');
inputBusqueda.addEventListener('input', debounce((e) => {
  buscarProductos(e.target.value);
}, 300));
```

### Throttle

Limita la ejecucion de una funcion a maximo una vez cada X milisegundos. Ideal para scroll y resize.

```javascript
function throttle(fn, limit = 200) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// Uso: ejecutar maximo una vez cada 200ms mientras hace scroll
window.addEventListener('scroll', throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 200));
```

### Diferencia visual

```
Sin debounce (input "hola"):
  h → buscar
  ho → buscar
  hol → buscar
  hola → buscar     (4 peticiones)

Con debounce 300ms:
  h → (espera)
  ho → (espera)
  hol → (espera)
  hola → (espera 300ms) → buscar   (1 peticion)

Sin throttle (scroll):
  scroll → ejecutar (x100 en 1 segundo)

Con throttle 200ms:
  scroll → ejecutar (maximo 5 en 1 segundo)
```

---

## 3. Explicacion Tecnica Detallada

### Lazy loading de imagenes

```javascript
// Opcion 1: Atributo nativo (recomendado, moderno)
// <img src="foto.jpg" loading="lazy" alt="Descripcion">

// Opcion 2: Intersection Observer (mas control)
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img); // dejar de observar
      }
    });
  }, {
    rootMargin: '100px' // cargar 100px antes de que sea visible
  });

  images.forEach(img => observer.observe(img));
}
```

```html
<!-- HTML para lazy loading con observer -->
<img data-src="fotos/imagen-grande.jpg" alt="Descripcion" class="lazy">
```

### Infinite scroll

```javascript
function infiniteScroll(cargarMas) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      cargarMas();
    }
  });

  // Observar un elemento sentinel al final de la lista
  const sentinel = document.querySelector('#sentinel');
  observer.observe(sentinel);
}

// HTML: <div id="sentinel"></div> al final de la lista
// Uso:
let pagina = 1;
infiniteScroll(async () => {
  pagina++;
  const datos = await fetchPagina(pagina);
  renderizarItems(datos);
});
```

### matchMedia - Responsive con JavaScript

```javascript
// Detectar si es movil
const isMobile = window.matchMedia('(max-width: 768px)');

function ajustarLayout(e) {
  if (e.matches) {
    // Es movil
    console.log('Vista movil');
    document.querySelector('.sidebar').classList.add('sidebar--oculta');
  } else {
    // Es desktop
    console.log('Vista desktop');
    document.querySelector('.sidebar').classList.remove('sidebar--oculta');
  }
}

// Ejecutar al cargar y al cambiar
ajustarLayout(isMobile);
isMobile.addEventListener('change', ajustarLayout);
```

### Preferencia de tema del sistema

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function aplicarTemaDelSistema(e) {
  document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
}

aplicarTemaDelSistema(prefersDark);
prefersDark.addEventListener('change', aplicarTemaDelSistema);
```

### Accesibilidad basica con JavaScript

```javascript
// 1. Manejo de foco
function openModal(modal) {
  modal.style.display = 'block';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  // Guardar el elemento que tenia foco
  const focusPrevio = document.activeElement;

  // Mover foco al modal
  const primerFocusable = modal.querySelector('button, input, [tabindex="0"]');
  if (primerFocusable) primerFocusable.focus();

  // Al cerrar, restaurar foco
  modal.addEventListener('close', () => {
    focusPrevio.focus();
  }, { once: true });
}

// 2. Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modalAbierto = document.querySelector('.modal[style*="display: block"]');
    if (modalAbierto) cerrarModal(modalAbierto);
  }
});

// 3. ARIA live regions para anuncios dinamicos
function anunciar(mensaje) {
  const liveRegion = document.querySelector('#aria-live');
  liveRegion.textContent = mensaje;
  // Los screen readers leeran automaticamente el cambio
}
// HTML: <div id="aria-live" aria-live="polite" class="sr-only"></div>

// 4. Skip to content
// <a href="#main-content" class="skip-link">Saltar al contenido</a>
```

```css
/* Screen reader only (visible solo para lectores de pantalla) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Skip link (visible solo con foco) */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 1000;
}
.skip-link:focus {
  top: 0;
}
```

### Performance: reducir reflows

```javascript
// MALO: multiples reflows
function maloRendimiento(items) {
  const lista = document.querySelector('#lista');
  items.forEach(item => {
    lista.innerHTML += `<li>${item}</li>`; // reflow en cada iteracion
  });
}

// BUENO: un solo reflow con DocumentFragment
function buenRendimiento(items) {
  const lista = document.querySelector('#lista');
  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    fragment.appendChild(li);
  });
  lista.appendChild(fragment); // un solo reflow
}

// BUENO: un solo reflow con innerHTML y join
function buenRendimiento2(items) {
  const lista = document.querySelector('#lista');
  lista.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}
```

### Codigo limpio en JavaScript

```javascript
// --- NOMBRADO ---
// MAL
const d = new Date();
const u = getU(1);
function proc(a, b) { return a * b * 0.15; }

// BIEN
const fechaActual = new Date();
const usuario = getUsuarioById(1);
function calcularIVA(subtotal, tasa = 0.15) { return subtotal * tasa; }


// --- FUNCIONES PEQUENAS ---
// MAL: funcion que hace demasiado
function procesarPedido(pedido) {
  // validar
  // calcular precios
  // aplicar descuentos
  // guardar en BD
  // enviar email
  // actualizar UI
}

// BIEN: funciones enfocadas
function validarPedido(pedido) { /* ... */ }
function calcularPrecioFinal(pedido) { /* ... */ }
function guardarPedido(pedido) { /* ... */ }
function notificarCliente(pedido) { /* ... */ }


// --- EARLY RETURN ---
// MAL: anidacion profunda
function obtenerDescuento(usuario) {
  if (usuario) {
    if (usuario.activo) {
      if (usuario.premium) {
        return 0.20;
      } else {
        return 0.05;
      }
    }
  }
  return 0;
}

// BIEN: early return
function obtenerDescuento(usuario) {
  if (!usuario) return 0;
  if (!usuario.activo) return 0;
  if (usuario.premium) return 0.20;
  return 0.05;
}


// --- DESTRUCTURING ---
// MAL
function crearCard(datos) {
  return `<h3>${datos.titulo}</h3><p>${datos.descripcion}</p>`;
}

// BIEN
function crearCard({ titulo, descripcion }) {
  return `<h3>${titulo}</h3><p>${descripcion}</p>`;
}


// --- VALORES POR DEFECTO ---
// MAL
function buscar(termino, pagina, limite) {
  pagina = pagina || 1;
  limite = limite || 10;
}

// BIEN
function buscar(termino, pagina = 1, limite = 10) {
  // ...
}
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Buscador optimizado con debounce

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

// Buscar posts
async function buscarPosts(termino) {
  if (!termino.trim()) {
    renderResultados([]);
    return;
  }

  document.querySelector('#estado').textContent = 'Buscando...';

  try {
    const response = await fetch(`${API_URL}?_limit=100`);
    const posts = await response.json();
    const filtrados = posts.filter(p =>
      p.title.toLowerCase().includes(termino.toLowerCase())
    );
    renderResultados(filtrados);
  } catch (error) {
    document.querySelector('#estado').textContent = `Error: ${error.message}`;
  }
}

function renderResultados(posts) {
  const container = document.querySelector('#resultados');
  document.querySelector('#estado').textContent =
    posts.length ? `${posts.length} resultado(s)` : 'Sin resultados';

  container.innerHTML = posts.map(p => `
    <div class="resultado">
      <h3>${p.title}</h3>
      <p>${p.body.slice(0, 100)}...</p>
    </div>
  `).join('');
}

// Evento con debounce
document.querySelector('#input-busqueda').addEventListener('input',
  debounce((e) => buscarPosts(e.target.value), 400)
);
```

### Ejemplo 2: Lista con Intersection Observer

```javascript
'use strict';

let pagina = 1;
let cargando = false;
const ITEMS_PER_PAGE = 20;

async function cargarItems() {
  if (cargando) return;
  cargando = true;

  document.querySelector('#loader').style.display = 'block';

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${pagina}&_limit=${ITEMS_PER_PAGE}`
    );
    const items = await response.json();

    if (items.length === 0) {
      observer.disconnect();
      document.querySelector('#loader').textContent = 'No hay mas items';
      return;
    }

    const container = document.querySelector('#lista');
    const html = items.map(item => `
      <div class="item">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </div>
    `).join('');
    container.insertAdjacentHTML('beforeend', html);

    pagina++;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    cargando = false;
    document.querySelector('#loader').style.display = 'none';
  }
}

// Intersection Observer para scroll infinito
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    cargarItems();
  }
}, { rootMargin: '200px' });

observer.observe(document.querySelector('#sentinel'));

// Carga inicial
cargarItems();
```

---

## 5. Comparaciones / Tablas

### Debounce vs Throttle

| Aspecto | Debounce | Throttle |
|---------|:-:|:-:|
| Ejecuta | Al final de la pausa | A intervalos regulares |
| Ideal para | Busqueda, input, resize | Scroll, mousemove |
| Ejemplo tiempo | 300ms sin actividad | Cada 200ms |
| Peticiones con input "hola" | 1 | 2-3 |
| Respuesta al usuario | Retrasada | Continua |

### Tecnicas de performance

| Tecnica | Problema que resuelve | Cuando usar |
|---------|----------------------|-------------|
| Debounce | Demasiadas peticiones | Busqueda en tiempo real |
| Throttle | Demasiados handlers | Scroll, resize |
| Lazy loading | Carga inicial lenta | Imagenes, componentes pesados |
| DocumentFragment | Reflows multiples | Insertar muchos elementos |
| Event delegation | Demasiados listeners | Listas dinamicas |
| RequestAnimationFrame | Animaciones janky | Animaciones JS |

### Checklist de accesibilidad

| Elemento | Verificar | Implementacion |
|----------|-----------|----------------|
| Imagenes | Alt text | `alt="descripcion"` |
| Formularios | Labels | `<label for="id">` |
| Botones | Texto descriptivo | `aria-label` si solo icono |
| Modales | Focus trap | Focus al primer elemento |
| Color | Contraste suficiente | 4.5:1 minimo (WCAG AA) |
| Navegacion | Teclado funcional | Tab, Enter, Escape |
| Contenido dinamico | Anunciar cambios | `aria-live="polite"` |

---

## 6. Funcionalidades Complementarias

### requestAnimationFrame

```javascript
// Animacion suave (60fps)
function animarProgreso(elemento, de, hasta, duracion) {
  const inicio = performance.now();

  function step(timestamp) {
    const progreso = Math.min((timestamp - inicio) / duracion, 1);
    const valor = de + (hasta - de) * progreso;
    elemento.style.width = `${valor}%`;

    if (progreso < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Uso
animarProgreso(document.querySelector('.barra'), 0, 100, 2000);
```

### Medir performance

```javascript
// Medir tiempo de ejecucion
performance.mark('inicio-render');

// ... codigo a medir ...

performance.mark('fin-render');
performance.measure('render', 'inicio-render', 'fin-render');

const medida = performance.getEntriesByName('render')[0];
console.log(`Render tomo: ${medida.duration.toFixed(2)}ms`);
```

### Console avanzada para debug

```javascript
// Agrupar logs relacionados
console.group('Datos del usuario');
console.log('Nombre:', usuario.nombre);
console.log('Email:', usuario.email);
console.groupEnd();

// Tabla para arrays de objetos
console.table(usuarios);

// Medir tiempo
console.time('fetch');
await fetch(url);
console.timeEnd('fetch'); // "fetch: 123.45ms"

// Assert (solo muestra si falla)
console.assert(edad >= 18, 'El usuario debe ser mayor de edad');

// Contar ocurrencias
items.forEach(item => {
  console.count(item.categoria); // "Electronica: 1", "Electronica: 2"...
});
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

```
practica-10/
  index.html
  css/
    styles.css
  js/
    app.js
    utils/
      performance.js
```

### Paso 2: Implementar debounce y throttle

1. Crear las funciones `debounce` y `throttle` en `performance.js`
2. Implementar un campo de busqueda con debounce
3. Implementar un listener de scroll con throttle
4. Mostrar un contador visual de cuantas veces se ejecuta cada handler para comparar con/sin optimizacion

### Paso 3: Lazy loading de imagenes

1. Crear una galeria con al menos 20 imagenes (pueden ser placeholders)
2. Implementar lazy loading con Intersection Observer
3. Mostrar un placeholder mientras carga la imagen
4. Log en consola cuando cada imagen se carga

### Paso 4: Responsive con matchMedia

1. Detectar si es movil o desktop con `matchMedia`
2. Cambiar el layout o comportamiento segun el breakpoint
3. Detectar preferencia de tema del sistema (`prefers-color-scheme`)
4. Aplicar tema claro/oscuro segun preferencia

### Paso 5: Accesibilidad basica

1. Agregar `aria-live` region para contenido dinamico
2. Implementar navegacion con teclado (Tab, Enter, Escape)
3. Agregar `alt` a todas las imagenes
4. Implementar focus visible en elementos interactivos

### Paso 6: Refactorizar codigo anterior

Tomar codigo de una practica anterior y aplicar:
1. Early return en al menos 2 funciones
2. Destructuring en parametros de funciones
3. Valores por defecto en parametros
4. Nombres descriptivos en variables y funciones

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Debounce en accion** - Busqueda funcionando con contador de ejecuciones
2. **Throttle en accion** - Scroll con contador de ejecuciones limitado
3. **Lazy loading** - Network tab mostrando carga diferida de imagenes
4. **Responsive** - Layout adaptado en movil y desktop
5. **Tema del sistema** - Tema claro y oscuro aplicados
6. **Accesibilidad** - Navegacion con teclado, aria-live
7. **Codigo refactorizado** - Antes/despues de aplicar buenas practicas
8. **Lighthouse** - Captura de DevTools > Lighthouse (aunque no sea 100)

### Formato del Archivo de Evidencias

```markdown
### 1. Debounce - busqueda optimizada
![Debounce](assets/01-debounce.png)
**Descripcion:** Sin debounce se ejecutan N peticiones, con debounce solo 1...

### 2. Lighthouse score
![Lighthouse](assets/02-lighthouse.png)
**Descripcion:** Puntaje de Performance, Accessibility, Best Practices...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Debounce y throttle implementados y aplicados
- Lazy loading con Intersection Observer
- matchMedia para responsive y tema
- Al menos 3 mejoras de accesibilidad
- Codigo refactorizado con buenas practicas
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias

---

## Reglas

- No usar frameworks
- Solo HTML + CSS + JavaScript puro
- Debounce y throttle deben ser funciones propias (no de librerias)
- Lazy loading debe usar Intersection Observer (no scroll listener)
- Al menos 3 atributos ARIA en la pagina
- Codigo debe seguir las convenciones de nombrado enseñadas

---

## Notas de Implementacion

- `IntersectionObserver` es mas eficiente que calcular scroll manualmente
- `requestAnimationFrame` ejecuta antes del repaint (~60fps)
- `debounce` ejecuta al FINAL de la pausa, `throttle` ejecuta DURANTE el flujo
- `matchMedia` es mas eficiente que un resize listener para detectar breakpoints
- `aria-live="polite"` espera a que el screen reader termine, `assertive` interrumpe
- `performance.now()` tiene precision de microsegundos
- Lighthouse en DevTools: Ctrl+Shift+I > Lighthouse > Analyze page

---


