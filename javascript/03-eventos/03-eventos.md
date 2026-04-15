# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 3: Eventos en JavaScript

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

Los **eventos** son la base de la interactividad en la web. Un evento es cualquier accion que ocurre en el navegador: un click, una tecla presionada, el envio de un formulario, el movimiento del mouse, el scroll de la pagina. JavaScript permite "escuchar" estos eventos y ejecutar codigo en respuesta.

### Formas de manejar eventos

| Metodo | Sintaxis | Recomendado | Razon |
|--------|----------|:-----------:|-------|
| HTML inline | `onclick="funcion()"` | No | Mezcla HTML con JS |
| Propiedad DOM | `elemento.onclick = fn` | No | Solo un handler por evento |
| `addEventListener` | `elemento.addEventListener('click', fn)` | **Si** | Multiples handlers, mas control |

```javascript
// HTML inline (EVITAR)
// <button onclick="saludar()">Click</button>

// Propiedad DOM (EVITAR)
boton.onclick = function() {
  console.log('Click');
};

// addEventListener (USAR SIEMPRE)
boton.addEventListener('click', function() {
  console.log('Click');
});

// addEventListener con arrow function
boton.addEventListener('click', () => {
  console.log('Click');
});

// addEventListener con funcion nombrada (para poder remover)
function manejarClick() {
  console.log('Click');
}
boton.addEventListener('click', manejarClick);
boton.removeEventListener('click', manejarClick);
```

---

## 2. Conceptos Clave

### Tipos de eventos principales

| Categoria | Eventos | Descripcion |
|-----------|---------|-------------|
| **Mouse** | `click`, `dblclick`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`, `mousemove` | Interacciones con el mouse |
| **Teclado** | `keydown`, `keyup`, `keypress` (deprecated) | Teclas presionadas |
| **Formulario** | `submit`, `reset`, `change`, `input`, `focus`, `blur` | Interaccion con formularios |
| **Ventana** | `load`, `DOMContentLoaded`, `resize`, `scroll`, `unload` | Eventos del navegador |
| **Touch** | `touchstart`, `touchmove`, `touchend` | Dispositivos tactiles |
| **Drag** | `dragstart`, `drag`, `dragend`, `drop`, `dragover` | Arrastrar y soltar |
| **Clipboard** | `copy`, `cut`, `paste` | Portapapeles |

### El objeto Event

Cada vez que se dispara un evento, JavaScript crea un objeto `Event` con informacion detallada:

```javascript
boton.addEventListener('click', (event) => {
  // Propiedades comunes
  console.log(event.type);       // "click"
  console.log(event.target);     // elemento que origino el evento
  console.log(event.currentTarget); // elemento que tiene el listener
  console.log(event.timeStamp);  // cuando ocurrio

  // Propiedades de mouse
  console.log(event.clientX);    // posicion X en la ventana
  console.log(event.clientY);    // posicion Y en la ventana
  console.log(event.button);     // 0=izq, 1=medio, 2=der

  // Teclas modificadoras
  console.log(event.altKey);     // true si Alt estaba presionado
  console.log(event.ctrlKey);    // true si Ctrl estaba presionado
  console.log(event.shiftKey);   // true si Shift estaba presionado
});
```

### Eventos de teclado

```javascript
document.addEventListener('keydown', (event) => {
  console.log(event.key);     // "Enter", "a", "ArrowUp", "Escape"
  console.log(event.code);    // "Enter", "KeyA", "ArrowUp", "Escape"
  console.log(event.keyCode); // DEPRECATED, no usar

  // Combinaciones de teclas
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault(); // evitar guardar la pagina
    console.log('Ctrl+S presionado');
  }

  if (event.key === 'Escape') {
    console.log('Escape presionado');
  }
});
```

---

## 3. Explicacion Tecnica Detallada

### preventDefault()

Evita el comportamiento por defecto del navegador. Casos comunes:

```javascript
// Evitar que un formulario se envie (recargue la pagina)
const formulario = document.querySelector('form');
formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Formulario procesado con JS');
  // Procesar datos aqui
});

// Evitar que un enlace navegue
const enlace = document.querySelector('a');
enlace.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Enlace interceptado');
});

// Evitar click derecho (menu contextual)
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  console.log('Menu contextual bloqueado');
});
```

### stopPropagation()

Detiene la propagacion del evento hacia los elementos padre:

```javascript
// Sin stopPropagation: click en hijo tambien dispara click en padre
const padre = document.querySelector('.padre');
const hijo = document.querySelector('.hijo');

padre.addEventListener('click', () => {
  console.log('Click en padre');
});

hijo.addEventListener('click', (e) => {
  e.stopPropagation(); // Solo se ejecuta este handler
  console.log('Click en hijo');
});
```

### Event Delegation (Delegacion de eventos)

En lugar de agregar eventos a cada elemento individual, se agrega un solo evento al padre y se usa `event.target` para identificar quien lo disparo. Es mas eficiente y funciona con elementos creados dinamicamente.

```javascript
// SIN delegacion (ineficiente, no funciona con nuevos elementos)
const botones = document.querySelectorAll('.btn');
botones.forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Click en boton');
  });
});

// CON delegacion (eficiente, funciona con nuevos elementos)
const contenedor = document.querySelector('#contenedor');
contenedor.addEventListener('click', (e) => {
  // Verificar si el click fue en un boton
  if (e.target.matches('.btn')) {
    console.log('Click en boton:', e.target.textContent);
  }

  // Verificar si fue en un boton de eliminar
  if (e.target.matches('.btn-eliminar')) {
    const card = e.target.closest('.card');
    card.remove();
  }
});
```

**Cuando usar delegacion:**

| Escenario | Sin delegacion | Con delegacion |
|-----------|:-:|:-:|
| Lista fija de 5 items | Valido | Valido |
| Lista dinamica (items se agregan/eliminan) | No funciona | **Funciona** |
| 100+ elementos con el mismo evento | 100 listeners | **1 listener** |
| Performance | Mas memoria | **Menos memoria** |

### Fases de propagacion

Los eventos se propagan en tres fases:

1. **Captura** (de arriba hacia abajo): `document > html > body > div > button`
2. **Target**: el elemento que recibio el evento
3. **Burbujeo** (de abajo hacia arriba): `button > div > body > html > document`

```javascript
// Por defecto, los listeners se ejecutan en fase de burbujeo
elemento.addEventListener('click', handler);

// Para escuchar en fase de captura, pasar true como tercer parametro
elemento.addEventListener('click', handler, true);

// Con opciones
elemento.addEventListener('click', handler, {
  capture: false,  // fase de burbujeo (defecto)
  once: true,      // se ejecuta una sola vez, luego se remueve
  passive: true    // no llamara preventDefault (mejor scroll performance)
});
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Formulario interactivo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formulario Interactivo</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 0 20px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, textarea { width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 1rem; }
    input:focus, textarea:focus { border-color: #F7DF1E; outline: none; }
    .error { border-color: #e74c3c !important; }
    .error-msg { color: #e74c3c; font-size: 0.85rem; margin-top: 4px; display: none; }
    .error-msg.visible { display: block; }
    button { padding: 12px 24px; background: #F7DF1E; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; font-weight: bold; }
    button:hover { background: #e6cf1a; }
    .char-count { text-align: right; color: #999; font-size: 0.85rem; }
    #resultado { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; display: none; }
  </style>
</head>
<body>
  <h1>Registro</h1>
  <form id="formulario">
    <div class="form-group">
      <label for="nombre">Nombre completo</label>
      <input type="text" id="nombre" placeholder="Tu nombre">
      <p class="error-msg" id="error-nombre">El nombre es obligatorio (min 3 caracteres)</p>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="tu@email.com">
      <p class="error-msg" id="error-email">Ingresa un email valido</p>
    </div>
    <div class="form-group">
      <label for="mensaje">Mensaje</label>
      <textarea id="mensaje" rows="4" maxlength="200" placeholder="Tu mensaje..."></textarea>
      <p class="char-count"><span id="chars">0</span>/200</p>
    </div>
    <button type="submit">Enviar</button>
  </form>
  <div id="resultado"></div>

  <script src="app.js"></script>
</body>
</html>
```

```javascript
// app.js
'use strict';

const formulario = document.querySelector('#formulario');
const inputNombre = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const textMensaje = document.querySelector('#mensaje');
const charCount = document.querySelector('#chars');
const resultado = document.querySelector('#resultado');

// Contador de caracteres en tiempo real
textMensaje.addEventListener('input', (e) => {
  const longitud = e.target.value.length;
  charCount.textContent = longitud;
  charCount.style.color = longitud > 180 ? '#e74c3c' : '#999';
});

// Validacion en tiempo real al salir del campo
inputNombre.addEventListener('blur', () => {
  validarCampo(inputNombre, inputNombre.value.trim().length >= 3, 'error-nombre');
});

inputEmail.addEventListener('blur', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  validarCampo(inputEmail, emailRegex.test(inputEmail.value), 'error-email');
});

// Funcion de validacion visual
function validarCampo(input, esValido, errorId) {
  const errorMsg = document.getElementById(errorId);
  if (esValido) {
    input.classList.remove('error');
    errorMsg.classList.remove('visible');
  } else {
    input.classList.add('error');
    errorMsg.classList.add('visible');
  }
  return esValido;
}

// Envio del formulario
formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombreValido = validarCampo(inputNombre, inputNombre.value.trim().length >= 3, 'error-nombre');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValido = validarCampo(inputEmail, emailRegex.test(inputEmail.value), 'error-email');

  if (nombreValido && emailValido) {
    resultado.style.display = 'block';
    resultado.innerHTML = `
      <strong>Datos recibidos:</strong><br>
      Nombre: ${inputNombre.value.trim()}<br>
      Email: ${inputEmail.value.trim()}<br>
      Mensaje: ${textMensaje.value.trim() || '(sin mensaje)'}
    `;
    formulario.reset();
    charCount.textContent = '0';
  }
});

// Limpiar errores al escribir
inputNombre.addEventListener('input', () => {
  inputNombre.classList.remove('error');
  document.getElementById('error-nombre').classList.remove('visible');
});

inputEmail.addEventListener('input', () => {
  inputEmail.classList.remove('error');
  document.getElementById('error-email').classList.remove('visible');
});
```

### Ejemplo 2: Event Delegation con lista dinamica

```javascript
// delegacion.js
'use strict';

const app = document.querySelector('#app');

// Datos
let tareas = [
  { id: 1, texto: 'Estudiar JavaScript', completada: false },
  { id: 2, texto: 'Hacer la practica', completada: false },
  { id: 3, texto: 'Subir al repositorio', completada: true }
];

// Renderizar
function renderizar() {
  app.innerHTML = `
    <h2>Mis Tareas</h2>
    <div class="input-group">
      <input type="text" id="nueva-tarea" placeholder="Nueva tarea...">
      <button data-action="agregar">Agregar</button>
    </div>
    <ul class="lista-tareas">
      ${tareas.map(t => `
        <li class="${t.completada ? 'completada' : ''}" data-id="${t.id}">
          <span data-action="toggle">${t.texto}</span>
          <button data-action="eliminar">X</button>
        </li>
      `).join('')}
    </ul>
    <p>${tareas.filter(t => !t.completada).length} pendiente(s)</p>
  `;
}

// UN SOLO event listener para todo (delegacion)
app.addEventListener('click', (e) => {
  const action = e.target.dataset.action;

  if (action === 'agregar') {
    const input = document.querySelector('#nueva-tarea');
    const texto = input.value.trim();
    if (texto) {
      tareas.push({ id: Date.now(), texto, completada: false });
      renderizar();
    }
  }

  if (action === 'eliminar') {
    const id = Number(e.target.closest('li').dataset.id);
    tareas = tareas.filter(t => t.id !== id);
    renderizar();
  }

  if (action === 'toggle') {
    const id = Number(e.target.closest('li').dataset.id);
    const tarea = tareas.find(t => t.id === id);
    if (tarea) tarea.completada = !tarea.completada;
    renderizar();
  }
});

// Tambien escuchar Enter en el input (delegacion con keydown)
app.addEventListener('keydown', (e) => {
  if (e.target.id === 'nueva-tarea' && e.key === 'Enter') {
    const texto = e.target.value.trim();
    if (texto) {
      tareas.push({ id: Date.now(), texto, completada: false });
      renderizar();
    }
  }
});

renderizar();
```

---

## 5. Comparaciones / Tablas

### target vs currentTarget

| Propiedad | Descripcion | Uso comun |
|-----------|-------------|-----------|
| `event.target` | Elemento que **origino** el evento (donde se hizo click) | Delegacion de eventos |
| `event.currentTarget` | Elemento que **tiene** el `addEventListener` | Dentro del handler |

```javascript
// Si tenemos: <div id="padre"><button>Click</button></div>
padre.addEventListener('click', (e) => {
  console.log(e.target);        // <button> (donde se hizo click)
  console.log(e.currentTarget); // <div#padre> (donde esta el listener)
});
```

### Eventos de input

| Evento | Se dispara cuando... | Uso tipico |
|--------|----------------------|------------|
| `input` | El valor cambia (cada tecla) | Busqueda en tiempo real |
| `change` | El valor cambia Y pierde focus | Selects, checkboxes |
| `focus` | El campo recibe focus | Mostrar ayuda |
| `blur` | El campo pierde focus | Validar campo |
| `keydown` | Se presiona una tecla | Atajos de teclado |
| `keyup` | Se suelta una tecla | Detectar tecla final |
| `submit` | Se envia el formulario | Validar y procesar |

### matches() vs closest()

| Metodo | Descripcion | Ejemplo |
|--------|-------------|---------|
| `element.matches(selector)` | Verifica si el elemento coincide con el selector | `e.target.matches('.btn')` |
| `element.closest(selector)` | Busca el ancestro mas cercano (o si mismo) que coincida | `e.target.closest('.card')` |

---

## 6. Funcionalidades Complementarias

### Eventos personalizados (Custom Events)

```javascript
// Crear un evento personalizado
const eventoExito = new CustomEvent('operacion-exitosa', {
  detail: { mensaje: 'Se guardo correctamente', timestamp: Date.now() }
});

// Escuchar el evento personalizado
document.addEventListener('operacion-exitosa', (e) => {
  console.log(e.detail.mensaje);
});

// Disparar el evento
document.dispatchEvent(eventoExito);
```

### Remover event listeners

```javascript
// Funcion nombrada (necesaria para remover)
function handleClick() {
  console.log('Click');
}

boton.addEventListener('click', handleClick);
boton.removeEventListener('click', handleClick);

// Con once: true (se remueve automaticamente despues de la primera ejecucion)
boton.addEventListener('click', handleClick, { once: true });

// AbortController (moderno, para remover multiples listeners)
const controller = new AbortController();

boton.addEventListener('click', handleClick, { signal: controller.signal });
input.addEventListener('input', handleInput, { signal: controller.signal });

// Remover todos los listeners asociados al controller
controller.abort();
```

### Errores comunes

```javascript
// ERROR: Arrow function no se puede remover (es anonima)
boton.addEventListener('click', () => console.log('click'));
// boton.removeEventListener('click', ???); // No hay referencia

// ERROR: Olvidar preventDefault en formularios
form.addEventListener('submit', (e) => {
  // Si no se llama e.preventDefault(), la pagina se recarga
  procesarFormulario();
});

// ERROR: Agregar listeners dentro de un loop sin delegacion
items.forEach(item => {
  item.addEventListener('click', handler); // N listeners
});
// MEJOR: usar delegacion con un solo listener en el padre
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

Crear la estructura:

```
practica-03/
  index.html
  css/
    styles.css
  js/
    app.js
```

### Paso 2: Crear un formulario de contacto

En `index.html`, crear un formulario con los campos:
- Nombre (texto, obligatorio)
- Email (email, obligatorio)
- Asunto (select con 3+ opciones)
- Mensaje (textarea, obligatorio, max 300 caracteres)
- Boton Enviar

### Paso 3: Validacion en tiempo real

Implementar con eventos:
- `input` en cada campo: limpiar errores visuales al escribir
- `blur` en cada campo: validar al salir
- Contador de caracteres en el textarea con evento `input`
- Cambio visual (borde rojo, mensaje de error) cuando un campo es invalido

### Paso 4: Envio del formulario

Usar el evento `submit` con `preventDefault()` para:
1. Validar todos los campos
2. Si son validos, mostrar los datos en un `<div>` debajo del formulario
3. Limpiar el formulario despues de enviar
4. Si hay errores, hacer focus en el primer campo invalido

### Paso 5: Agregar interactividad adicional

Implementar al menos 3 de las siguientes funcionalidades usando event delegation:
1. **Tema oscuro/claro** - Boton que alterne clases CSS en el body
2. **Atajos de teclado** - Ctrl+Enter para enviar el formulario
3. **Accordion/FAQ** - Secciones que se expanden/colapsan al hacer click
4. **Tabs** - Pestanas que muestran/ocultan contenido
5. **Contador de clicks** - Mostrar cuantas veces se hizo click en una zona

### Paso 6: Event delegation en practica

Crear una lista de elementos (tareas, notas, etc.) donde:
1. Se puedan agregar nuevos elementos
2. Se puedan eliminar elementos
3. Se puedan marcar como completados
4. Todo con **un solo** `addEventListener` en el contenedor padre

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Formulario con validacion** - Mostrando errores visuales en campos invalidos
2. **Formulario enviado** - Mostrando los datos renderizados
3. **Contador de caracteres** - Textarea con el contador actualizandose
4. **Interactividad adicional** - Captura de la funcionalidad extra elegida
5. **Delegacion de eventos** - Lista con agregar/eliminar/completar funcionando
6. **Consola limpia** - DevTools sin errores
7. **Codigo fuente** - Capturas del JavaScript relevante

### Formato del Archivo de Evidencias

```markdown
### 1. Validacion de formulario
![Validacion](assets/01-validacion.png)
**Descripcion:** Campos con borde rojo y mensajes de error...

### 2. Delegacion de eventos
![Delegacion](assets/02-delegacion.png)
**Descripcion:** Lista con un solo event listener en el contenedor padre...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias
- Codigo funcional sin errores en consola
- Todos los eventos implementados con `addEventListener` (no inline)

---

## Reglas

- No usar frameworks
- Solo HTML + CSS + JavaScript puro
- No usar `onclick` en el HTML (solo `addEventListener`)
- Usar event delegation cuando haya multiples elementos similares
- Siempre usar `preventDefault()` en formularios
- No usar `alert()` - mostrar feedback en el DOM

---

## Notas de Implementacion

- `addEventListener` es la forma moderna y recomendada de manejar eventos
- Event delegation es un patron fundamental: un listener en el padre en lugar de N en los hijos
- `preventDefault()` evita el comportamiento default del navegador (ej: submit recarga la pagina)
- `stopPropagation()` detiene la propagacion del evento hacia los padres
- Usar `event.target.matches()` o `event.target.closest()` para identificar el elemento en delegacion

---


