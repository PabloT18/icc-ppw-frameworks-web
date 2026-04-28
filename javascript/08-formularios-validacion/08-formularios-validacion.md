# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 8: Formularios y Validacion

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

Los formularios son la principal via de entrada de datos del usuario en una aplicacion web. Validar estos datos **antes** de enviarlos al servidor mejora la experiencia de usuario, reduce carga en el backend y previene datos invalidos o maliciosos.

HTML5 provee validacion nativa con atributos como `required`, `pattern`, `min`, `max`. JavaScript complementa con validaciones personalizadas mas complejas y feedback visual en tiempo real.

### Niveles de validacion

| Nivel | Donde | Ejemplo | Obligatorio? |
|:-:|:-:|:-:|:-:|
| HTML5 nativo | Navegador | `required`, `type="email"` | Recomendado |
| JavaScript cliente | Navegador | Regex, longitud, logica custom | Recomendado |
| Servidor | Backend | Sanitizar, verificar en BD | Obligatorio |

> **Nota importante**: La validacion en el cliente (navegador) NO es suficiente para seguridad. Un atacante puede deshabilitar JavaScript o modificar el HTML. La validacion en el servidor es **obligatoria** para aplicaciones reales.

---

## 2. Conceptos Clave

### FormData API

La API `FormData` permite capturar datos de formularios de forma sencilla:

```javascript
const form = document.querySelector('#mi-formulario');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  // Leer valores individuales
  const nombre = formData.get('nombre');
  const email = formData.get('email');

  // Iterar todos los campos
  for (const [clave, valor] of formData.entries()) {
    console.log(`${clave}: ${valor}`);
  }

  // Convertir a objeto plano
  const datos = Object.fromEntries(formData);
  console.log(datos); // { nombre: 'Pablo', email: 'pablo@mail.com', ... }
});
```

> **Importante**: `FormData` solo captura campos con atributo `name`. Los checkboxes no marcados NO aparecen en el FormData.

### Atributos de validacion HTML5

| Atributo | Aplica a | Descripcion |
|----------|----------|-------------|
| `required` | Todos | Campo obligatorio |
| `type="email"` | input | Formato email valido |
| `type="url"` | input | Formato URL valida |
| `type="number"` | input | Solo numeros |
| `type="date"` | input | Selector de fecha |
| `min` / `max` | number, date, range | Valor minimo/maximo |
| `minlength` / `maxlength` | text, textarea | Longitud de texto |
| `pattern` | text, search, tel, url | Regex personalizada |
| `step` | number, range | Incremento valido |

```html
<!-- Ejemplo con validaciones HTML5 -->
<form id="formulario" novalidate>
  <input type="text" name="nombre" required minlength="3" maxlength="50">
  <input type="email" name="email" required>
  <input type="tel" name="telefono" pattern="[0-9]{10}">
  <input type="number" name="edad" min="18" max="120">
  <input type="password" name="password" required minlength="8"
         pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$">
</form>
```

> **Nota**: El atributo `novalidate` desactiva la validacion nativa del navegador para usar validacion JavaScript personalizada.

### Eventos de formulario

| Evento | Se dispara cuando | Uso comun |
|--------|:-:|:-:|
| `submit` | Se envia el formulario | Validar y enviar |
| `input` | El valor cambia (en tiempo real) | Feedback instantaneo, limpiar errores |
| `change` | El valor cambia y pierde foco | Validar select, radio, checkbox |
| `focusout` | El campo pierde foco | Validar campo individual |
| `focusin` | El campo recibe foco | Mostrar ayuda contextual |
| `invalid` | El campo no pasa validacion nativa | Mensaje custom |
| `reset` | Se resetea el formulario | Limpiar estado y validaciones |

---

## 3. Explicacion Tecnica Detallada

### Constraint Validation API

JavaScript provee una API nativa para validar formularios programaticamente:

```javascript
const input = document.querySelector('#email');

// Propiedades de validacion (solo lectura)
input.validity.valid;          // boolean: campo valido?
input.validity.valueMissing;   // true si required y vacio
input.validity.typeMismatch;   // true si tipo incorrecto (ej: email invalido)
input.validity.patternMismatch;// true si no cumple pattern
input.validity.tooShort;       // true si menor que minlength
input.validity.tooLong;        // true si mayor que maxlength
input.validity.rangeUnderflow; // true si menor que min
input.validity.rangeOverflow;  // true si mayor que max
input.validity.customError;    // true si se seteo con setCustomValidity

// Metodos de validacion
input.checkValidity();         // verifica validez, dispara evento 'invalid' si es invalido
input.reportValidity();        // verifica y muestra mensaje nativo del navegador
input.setCustomValidity('msg');// setea mensaje de error personalizado
// setCustomValidity('') para limpiar (marcar campo como valido)

// Validar formulario completo
const form = document.querySelector('form');
form.checkValidity();          // true si TODOS los campos son validos
```

### Patron de validacion con eventos

```javascript
const form = document.querySelector('#formulario');

// Validar campo individual al perder foco
form.addEventListener('focusout', (e) => {
  if (e.target.matches('input, select, textarea')) {
    validarCampo(e.target);
  }
});

// Limpiar error al empezar a escribir
form.addEventListener('input', (e) => {
  if (e.target.matches('input, textarea')) {
    limpiarError(e.target);
  }
});

// Validar al enviar
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (validarFormulario(form)) {
    const datos = Object.fromEntries(new FormData(form));
    console.log('Datos validos:', datos);
    // enviar datos...
  }
});
```

### Funciones de validacion personalizada

```javascript
/**
 * Validar un campo individual segun su tipo
 * @param {HTMLElement} campo - El input a validar
 * @returns {boolean} - true si es valido
 */
function validarCampo(campo) {
  const valor = campo.value.trim();
  const nombre = campo.name;
  let error = '';

  // Validar required
  if (campo.hasAttribute('required') && !valor) {
    error = 'Este campo es obligatorio';
  }

  // Validaciones por tipo (solo si tiene valor)
  if (!error && valor) {
    switch (nombre) {
      case 'nombre':
        if (valor.length < 3) error = 'Minimo 3 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
          error = 'Solo letras y espacios';
        }
        break;

      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
          error = 'Email invalido';
        }
        break;

      case 'telefono':
        if (!/^\d{10}$/.test(valor.replace(/\D/g, ''))) {
          error = 'Debe tener 10 digitos';
        }
        break;

      case 'fecha_nacimiento':
        const edad = calcularEdad(new Date(valor));
        if (edad < 18) error = 'Debes ser mayor de 18 años';
        if (edad > 120) error = 'Fecha invalida';
        break;

      case 'password':
        if (valor.length < 8) error = 'Minimo 8 caracteres';
        else if (!/[A-Z]/.test(valor)) error = 'Al menos una mayuscula';
        else if (!/[a-z]/.test(valor)) error = 'Al menos una minuscula';
        else if (!/[0-9]/.test(valor)) error = 'Al menos un numero';
        break;

      case 'confirmar_password':
        const password = document.querySelector('[name="password"]').value;
        if (valor !== password) error = 'Las contraseñas no coinciden';
        break;
    }
  }

  // Mostrar o limpiar error
  if (error) {
    mostrarError(campo, error);
    return false;
  } else {
    limpiarError(campo);
    return true;
  }
}

/**
 * Validar todos los campos del formulario
 * @param {HTMLFormElement} form - El formulario a validar
 * @returns {boolean} - true si todos los campos son validos
 */
function validarFormulario(form) {
  const campos = form.querySelectorAll('input, select, textarea');
  let todosValidos = true;

  campos.forEach(campo => {
    if (!validarCampo(campo)) {
      todosValidos = false;
    }
  });

  return todosValidos;
}

/**
 * Calcular edad a partir de fecha de nacimiento
 * @param {Date} fechaNac - Fecha de nacimiento
 * @returns {number} - Edad en años
 */
function calcularEdad(fechaNac) {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  return edad;
}
```

### Feedback visual de errores

```javascript
/**
 * Mostrar mensaje de error en un campo
 * @param {HTMLElement} campo - El campo con error
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(campo, mensaje) {
  // Agregar clase de error al campo
  campo.classList.add('campo--error');
  campo.classList.remove('campo--valido');

  // Buscar o crear el elemento de mensaje
  let errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-mensaje';
    campo.parentElement.appendChild(errorDiv);
  }
  errorDiv.textContent = mensaje;
}

/**
 * Limpiar mensaje de error de un campo
 * @param {HTMLElement} campo - El campo a limpiar
 */
function limpiarError(campo) {
  campo.classList.remove('campo--error');
  
  // Solo marcar como valido si tiene contenido
  if (campo.value.trim()) {
    campo.classList.add('campo--valido');
  } else {
    campo.classList.remove('campo--valido');
  }

  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if (errorDiv) errorDiv.textContent = '';
}
```

```css
/* Estilos para feedback visual */
.campo--error {
  border-color: #e74c3c;
  background-color: #ffeaea;
}

.campo--valido {
  border-color: #2ecc71;
}

.error-mensaje {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
  min-height: 1.2em;
  font-weight: 500;
}
```

### Expresiones regulares comunes

```javascript
const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^\d{10}$/,
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  soloNumeros: /^\d+$/,
  cedula: /^\d{10}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,  // min 8, may, min, num
  url: /^https?:\/\/.+/,
  codigoPostal: /^\d{5,6}$/
};

/**
 * Validar un valor con una expresion regular
 * @param {string} valor - Valor a validar
 * @param {string} tipo - Tipo de regex del objeto REGEX
 * @returns {boolean} - true si cumple el patron
 */
function validarConRegex(valor, tipo) {
  return REGEX[tipo] ? REGEX[tipo].test(valor) : true;
}
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Medidor de fuerza de contraseña

```javascript
'use strict';

/**
 * Evaluar la fuerza de una contraseña
 * @param {string} password - Contraseña a evaluar
 * @returns {object} - { nivel: string, clase: string, valor: number }
 */
function evaluarFuerzaPassword(password) {
  let fuerza = 0;

  if (password.length >= 8) fuerza++;
  if (password.length >= 12) fuerza++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
  if (/\d/.test(password)) fuerza++;
  if (/[^a-zA-Z0-9]/.test(password)) fuerza++; // caracteres especiales

  const niveles = [
    { texto: '', clase: '' },
    { texto: 'Muy debil', clase: 'muy-debil' },
    { texto: 'Debil', clase: 'debil' },
    { texto: 'Media', clase: 'media' },
    { texto: 'Fuerte', clase: 'fuerte' },
    { texto: 'Muy fuerte', clase: 'muy-fuerte' }
  ];

  return niveles[fuerza];
}

// Uso
const inputPassword = document.querySelector('#password');
const indicador = document.querySelector('#password-strength');

inputPassword.addEventListener('input', (e) => {
  const fuerza = evaluarFuerzaPassword(e.target.value);
  indicador.textContent = `Fortaleza: ${fuerza.texto}`;
  indicador.className = `password-strength ${fuerza.clase}`;
});
```

```html
<div class="campo-grupo">
  <label for="password">Contraseña *</label>
  <input type="password" id="password" name="password" required minlength="8">
  <div class="password-strength" id="password-strength"></div>
  <div class="error-mensaje"></div>
</div>
```

```css
.password-strength {
  padding: 8px;
  margin-top: 4px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

.password-strength.muy-debil { background: #fee; color: #e74c3c; }
.password-strength.debil { background: #ffe8d6; color: #e67e22; }
.password-strength.media { background: #fff9e6; color: #f39c12; }
.password-strength.fuerte { background: #e8f8f0; color: #27ae60; }
.password-strength.muy-fuerte { background: #d4edda; color: #155724; }
```

### Ejemplo 2: Mascara de telefono

```javascript
'use strict';

/**
 * Aplicar mascara de telefono mientras el usuario escribe
 * @param {HTMLInputElement} input - El input de telefono
 */
function aplicarMascaraTelefono(input) {
  let valor = input.value.replace(/\D/g, ''); // Solo digitos
  
  if (valor.length > 10) {
    valor = valor.slice(0, 10);
  }

  // Formato: (099) 999-9999
  if (valor.length > 6) {
    valor = `(${valor.slice(0, 3)}) ${valor.slice(3, 6)}-${valor.slice(6)}`;
  } else if (valor.length > 3) {
    valor = `(${valor.slice(0, 3)}) ${valor.slice(3)}`;
  } else if (valor.length > 0) {
    valor = `(${valor}`;
  }

  input.value = valor;
}

// Uso
document.querySelector('#telefono').addEventListener('input', (e) => {
  aplicarMascaraTelefono(e.target);
});
```

### Ejemplo 3: Formulario con campos condicionales

```javascript
'use strict';

// HTML con campos condicionales
const htmlFormulario = `
  <select name="tipo" id="tipo-pedido" required>
    <option value="">Seleccionar...</option>
    <option value="envio">Envio a domicilio</option>
    <option value="retiro">Retiro en tienda</option>
  </select>

  <div id="campos-envio" style="display:none;">
    <input type="text" name="direccion" minlength="10">
    <input type="text" name="ciudad">
    <input type="text" name="codigo_postal" pattern="[0-9]{5,6}">
  </div>

  <div id="campos-retiro" style="display:none;">
    <select name="sucursal">
      <option value="">Seleccionar...</option>
      <option value="centro">Centro</option>
      <option value="norte">Norte</option>
    </select>
  </div>
`;

// Mostrar/ocultar campos segun seleccion
document.querySelector('#tipo-pedido').addEventListener('change', (e) => {
  const envio = document.querySelector('#campos-envio');
  const retiro = document.querySelector('#campos-retiro');

  envio.style.display = e.target.value === 'envio' ? 'block' : 'none';
  retiro.style.display = e.target.value === 'retiro' ? 'block' : 'none';

  // Agregar/quitar required segun visibilidad
  envio.querySelectorAll('input').forEach(input => {
    input.required = e.target.value === 'envio';
  });
  
  retiro.querySelectorAll('select').forEach(select => {
    select.required = e.target.value === 'retiro';
  });
});
```

---

## 5. Comparaciones / Tablas

### FormData vs acceso manual

| Metodo | Codigo | Ventaja | Desventaja |
|--------|--------|---------|------------|
| `FormData` | `new FormData(form)` | Estandar, soporta archivos | Checkboxes no marcados no aparecen |
| `getElementById` | `document.getElementById('campo').value` | Directo | Verboso para muchos campos |
| `querySelector` | `form.querySelector('[name="campo"]').value` | Flexible | Verboso |
| `form.elements` | `form.elements.campo.value` | Acceso por nombre | No funciona con nombres duplicados |
| `Object.fromEntries` | `Object.fromEntries(new FormData(form))` | Objeto plano rapido | Pierde checkboxes no marcados |

### Validacion HTML5 vs JavaScript

| Aspecto | HTML5 nativo | JavaScript custom |
|---------|:-:|:-:|
| Configuracion | Solo atributos HTML | Codigo JS |
| Mensajes | Default del navegador | Personalizados |
| Estilo de error | Burbuja del navegador | CSS personalizado |
| Logica compleja | No (solo pattern) | Si (validacion cruzada, async) |
| Validacion cruzada | No | Si (ej: confirmar password) |
| Async (verificar BD) | No | Si (con fetch) |
| UX | Basica | Completa (tiempo real, feedback visual) |

### Eventos focusin/focusout vs focus/blur

| Aspecto | focusin/focusout | focus/blur |
|---------|:-:|:-:|
| Burbujeo | Si | No |
| Delegacion de eventos | Si (recomendado) | No |
| Soporte | Navegadores modernos | Todos |

**Recomendacion**: Usar `focusin` y `focusout` con delegacion de eventos en el formulario:

```javascript
// ✅ BUENO: Un solo listener en el form
form.addEventListener('focusout', (e) => {
  if (e.target.matches('input')) validarCampo(e.target);
});

// ❌ MALO: Listener individual en cada input
inputs.forEach(input => {
  input.addEventListener('blur', () => validarCampo(input));
});
```

---

## 6. Funcionalidades Complementarias

### Deshabilitar boton hasta formulario completo

```javascript
/**
 * Verificar si todos los campos requeridos estan llenos
 * @param {HTMLFormElement} form - Formulario
 * @returns {boolean} - true si todos llenos
 */
function verificarCamposLlenos(form) {
  const camposRequeridos = form.querySelectorAll('[required]');
  
  return [...camposRequeridos].every(campo => {
    if (campo.type === 'checkbox') {
      return campo.checked;
    }
    return campo.value.trim() !== '';
  });
}

/**
 * Actualizar estado del boton submit
 */
function actualizarBotonEnviar(form) {
  const btn = form.querySelector('[type="submit"]');
  btn.disabled = !verificarCamposLlenos(form);
}

// Llamar en cada input
form.addEventListener('input', () => actualizarBotonEnviar(form));
```

### Autoguardado con sessionStorage

```javascript
const STORAGE_KEY = 'form_draft';

// Guardar progreso al escribir
form.addEventListener('input', () => {
  const datos = Object.fromEntries(new FormData(form));
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
});

// Restaurar al cargar
window.addEventListener('DOMContentLoaded', () => {
  const draft = sessionStorage.getItem(STORAGE_KEY);
  if (!draft) return;

  const datos = JSON.parse(draft);
  Object.entries(datos).forEach(([name, value]) => {
    const campo = form.querySelector(`[name="${name}"]`);
    if (campo) campo.value = value;
  });
});

// Limpiar al enviar exitosamente
form.addEventListener('submit', (e) => {
  // ... validar y enviar ...
  sessionStorage.removeItem(STORAGE_KEY);
});
```

### Validacion async (verificar email en servidor)

```javascript
/**
 * Verificar si un email ya esta registrado
 * @param {string} email - Email a verificar
 * @returns {Promise<boolean>} - true si esta disponible
 */
async function verificarEmailDisponible(email) {
  try {
    const response = await fetch(`/api/verificar-email?email=${email}`);
    const data = await response.json();
    return data.disponible;
  } catch (error) {
    console.error('Error al verificar email:', error);
    return true; // En caso de error, permitir continuar
  }
}

// Validar async al perder foco
const inputEmail = document.querySelector('#email');
let timeoutId;

inputEmail.addEventListener('focusout', async (e) => {
  const email = e.target.value.trim();
  
  if (!email) return;

  // Debounce: esperar 500ms despues del ultimo cambio
  clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => {
    const disponible = await verificarEmailDisponible(email);
    
    if (!disponible) {
      mostrarError(inputEmail, 'Este email ya esta registrado');
    } else {
      limpiarError(inputEmail);
    }
  }, 500);
});
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
// ❌ PELIGROSO: Si 'nombre' viene del usuario
const nombre = '<img src=x onerror="alert(\'XSS\')">';
div.innerHTML = `<p>Hola ${nombre}</p>`;
// Ejecuta el script malicioso
```

**Enfoque correcto: API del DOM**

```javascript
// ✅ SEGURO: textContent no interpreta HTML
function MensajeExito(mensaje) {
  // 1. Crear contenedor
  const container = document.createElement('div');
  container.className = 'mensaje-exito';
  
  // 2. Crear elementos internos
  const titulo = document.createElement('strong');
  titulo.textContent = '✓ Éxito'; // SEGURO
  
  const texto = document.createElement('p');
  texto.textContent = mensaje; // SEGURO
  
  // 3. Ensamblar
  container.appendChild(titulo);
  container.appendChild(texto);
  
  // 4. Retornar elemento del DOM
  return container;
}

// Uso
const mensaje = MensajeExito('Registro completado');
contenedor.appendChild(mensaje);
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
// ✅ OK: contenido estático
div.innerHTML = '<p>Bienvenido</p><button>Continuar</button>';

// ❌ NUNCA: datos dinámicos o del usuario
div.innerHTML = `<p>${userData}</p>`; // PELIGROSO
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
practica-08/
  index.html
  css/
    styles.css
  js/
    validacion.js
    components.js
    app.js
```

### Paso 2: HTML completo (copiar)

**¿Qué hace este paso?** Proporciona toda la estructura HTML necesaria para la práctica. El HTML incluye un formulario de registro con 8 campos (nombre, email, teléfono, fecha de nacimiento, género, contraseña, confirmar contraseña y términos), contenedores para mensajes de estado y resultados. Copiar exactamente este código en `index.html`.

En `index.html`, copiar la estructura completa:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Práctica 8 - Formularios y Validación</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <main class="page">
    <!-- SECCIÓN 1: FORMULARIO DE REGISTRO -->
    <section class="container">
      <h1>Formulario de Registro</h1>
      
      <form id="form-registro" class="form-registro" novalidate>
        
        <div class="form-group">
          <label for="nombre">Nombre completo *</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            placeholder="Ej: Juan Pérez" 
            required 
            minlength="3"
            maxlength="50">
          <div class="error-mensaje"></div>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="ejemplo@correo.com" 
            required>
          <div class="error-mensaje"></div>
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono *</label>
          <input 
            type="tel" 
            id="telefono" 
            name="telefono" 
            placeholder="0999999999" 
            required
            pattern="[0-9]{10}">
          <div class="error-mensaje"></div>
          <small class="help-text">10 dígitos sin espacios ni guiones</small>
        </div>

        <div class="form-group">
          <label for="fecha_nacimiento">Fecha de nacimiento *</label>
          <input 
            type="date" 
            id="fecha_nacimiento" 
            name="fecha_nacimiento" 
            required>
          <div class="error-mensaje"></div>
        </div>

        <div class="form-group">
          <label for="genero">Género *</label>
          <select id="genero" name="genero" required>
            <option value="">Seleccionar...</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
            <option value="prefiero_no_decir">Prefiero no decir</option>
          </select>
          <div class="error-mensaje"></div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña *</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Mínimo 8 caracteres" 
            required 
            minlength="8">
          <div class="password-strength" id="password-strength"></div>
          <div class="error-mensaje"></div>
          <small class="help-text">Mínimo 8 caracteres, una mayúscula, una minúscula y un número</small>
        </div>

        <div class="form-group">
          <label for="confirmar_password">Confirmar contraseña *</label>
          <input 
            type="password" 
            id="confirmar_password" 
            name="confirmar_password" 
            placeholder="Repetir contraseña" 
            required>
          <div class="error-mensaje"></div>
        </div>

        <div class="form-group form-group-checkbox">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              id="terminos" 
              name="terminos" 
              required>
            <span>Acepto los términos y condiciones *</span>
          </label>
          <div class="error-mensaje"></div>
        </div>

        <div class="form-actions">
          <button type="submit" id="btn-enviar" class="btn-submit">
            Registrarse
          </button>
          <button type="button" id="btn-limpiar" class="btn-secondary">
            Limpiar formulario
          </button>
        </div>
      </form>
    </section>

    <!-- SECCIÓN 2: MENSAJES DE ESTADO -->
    <section class="container">
      <div id="mensaje-estado" class="mensaje-estado oculto"></div>
    </section>

    <!-- SECCIÓN 3: DATOS ENVIADOS (solo para demostración) -->
    <section class="container">
      <h2>Datos del último registro</h2>
      <div id="resultado-registro" class="resultado-vacio">
        <p>No hay datos enviados aún</p>
      </div>
    </section>
  </main>

  <script defer src="js/validacion.js"></script>
  <script defer src="js/components.js"></script>
  <script defer src="js/app.js"></script>
</body>
</html>
```

### Paso 3: CSS completo (copiar)

**¿Qué hace este paso?** Define todos los estilos necesarios para la aplicación: diseño responsive, estilos de formulario, estados de validación (borde rojo/verde), mensajes de error, indicador de fuerza de contraseña y animaciones. Los estilos están en el archivo `solver/08-formularios-validacion/css/styles.css`.

En `css/styles.css`, copiar todos los estilos:

Tomar de `solver/08-formularios-validacion/css/styles.css`

### Paso 4: JavaScript Parte 1 - Servicio de validación (copiar y completar)

En `js/validacion.js`, crear el servicio que centraliza todas las validaciones:

#### 4.1 Expresiones regulares y estructura base (copiar)

**¿Qué hace este código?** Define todas las expresiones regulares necesarias para validar diferentes tipos de campos (email, teléfono, letras, etc.) y crea el objeto `ValidacionService` que encapsula toda la lógica de validación.

```javascript
'use strict';

/* =========================
   EXPRESIONES REGULARES
========================= */

const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^\d{10}$/,
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  soloNumeros: /^\d+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  url: /^https?:\/\/.+/
};

/* =========================
   SERVICIO DE VALIDACIÓN
========================= */

const ValidacionService = {
  
  /**
   * Validar un campo individual según su tipo
   * @param {HTMLElement} campo - El input/select/textarea a validar
   * @returns {object} - { valido: boolean, error: string }
   */
  validarCampo(campo) {
    const valor = campo.value.trim();
    const nombre = campo.name;
    const tipo = campo.type;
    let error = '';

    // Validar required
    if (campo.hasAttribute('required')) {
      if (tipo === 'checkbox') {
        if (!campo.checked) {
          error = 'Debes aceptar este campo';
        }
      } else if (!valor) {
        error = 'Este campo es obligatorio';
      }
    }

    // Si ya hay error de required, no validar más
    if (error) {
      return { valido: false, error };
    }

    // TODO 4.1.1: Implementar validaciones específicas por nombre de campo
    // Si el campo tiene valor, validar según el nombre del campo
    if (valor) {
      switch (nombre) {
        case 'nombre':
          // TODO 4.1.2: Validar que tenga mínimo 3 caracteres
          //   if (valor.length < 3) {
          //     error = 'El nombre debe tener al menos 3 caracteres';
          //   }
          // TODO 4.1.3: Validar que tenga máximo 50 caracteres
          //   else if (valor.length > 50) {
          //     error = 'El nombre no puede superar 50 caracteres';
          //   }
          // TODO 4.1.4: Validar que solo contenga letras y espacios usando REGEX.soloLetras
          //   else if (!REGEX.soloLetras.test(valor)) {
          //     error = 'El nombre solo puede contener letras y espacios';
          //   }
          break;

        case 'email':
          // TODO 4.1.5: Validar formato de email usando REGEX.email
          //   if (!REGEX.email.test(valor)) {
          //     error = 'Formato de email inválido';
          //   }
          break;

        case 'telefono':
          // TODO 4.1.6: Validar que tenga 10 dígitos usando REGEX.telefono
          //   Primero quitar caracteres no numéricos con .replace(/\D/g, '')
          //   if (!REGEX.telefono.test(valor.replace(/\D/g, ''))) {
          //     error = 'El teléfono debe tener exactamente 10 dígitos';
          //   }
          break;
      }
    }

    return {
      valido: error === '',
      error
    };
  },
```

#### 4.2 Validar fecha de nacimiento y contraseñas (completar)

**¿Qué hace este código?** Implementa validaciones más complejas: calcular edad a partir de fecha de nacimiento, validar requisitos de contraseña (mayúscula, minúscula, número) y verificar que las contraseñas coincidan.

```javascript
        case 'fecha_nacimiento':
          // TODO 4.2.1: Validar que el usuario sea mayor de 18 años
          //   Crear objeto Date, calcular edad, validar rango
          //   const fechaNac = new Date(valor);
          //   const hoy = new Date();
          //   const edad = hoy.getFullYear() - fechaNac.getFullYear();
          //   const mesActual = hoy.getMonth() - fechaNac.getMonth();
          //   
          //   let edadReal = edad;
          //   if (mesActual < 0 || (mesActual === 0 && hoy.getDate() < fechaNac.getDate())) {
          //     edadReal--;
          //   }
          //
          //   if (edadReal < 18) {
          //     error = 'Debes ser mayor de 18 años';
          //   } else if (edadReal > 120) {
          //     error = 'Fecha de nacimiento inválida';
          //   }
          break;

        case 'genero':
          // TODO 4.2.2: Validar que se haya seleccionado un género
          //   if (!valor || valor === '') {
          //     error = 'Debes seleccionar un género';
          //   }
          break;

        case 'password':
          // TODO 4.2.3: Validar requisitos de contraseña
          //   if (valor.length < 8) {
          //     error = 'La contraseña debe tener al menos 8 caracteres';
          //   } else if (!/[A-Z]/.test(valor)) {
          //     error = 'Debe tener al menos una letra mayúscula';
          //   } else if (!/[a-z]/.test(valor)) {
          //     error = 'Debe tener al menos una letra minúscula';
          //   } else if (!/[0-9]/.test(valor)) {
          //     error = 'Debe tener al menos un número';
          //   }
          break;

        case 'confirmar_password':
          // TODO 4.2.4: Validar que coincida con la contraseña principal
          //   const password = document.querySelector('[name="password"]').value;
          //   if (valor !== password) {
          //     error = 'Las contraseñas no coinciden';
          //   }
          break;
      }
    }

    return {
      valido: error === '',
      error
    };
  },
```

#### 4.3 Validar formulario completo y evaluar fuerza (completar)

**¿Qué hace este código?** Implementa la función que valida todos los campos del formulario a la vez (útil al enviar) y la función que evalúa la fuerza de la contraseña basándose en longitud y tipos de caracteres.

```javascript
  /**
   * Validar todos los campos del formulario
   * @param {HTMLFormElement} form - El formulario a validar
   * @returns {boolean} - true si todos los campos son válidos
   */
  validarFormulario(form) {
    // TODO 4.3.1: Seleccionar todos los campos del formulario
    //   const campos = form.querySelectorAll('input, select, textarea');
    
    // TODO 4.3.2: Inicializar variable todosValidos en true
    //   let todosValidos = true;

    // TODO 4.3.3: Iterar cada campo, validarlo, y actualizar todosValidos
    //   campos.forEach(campo => {
    //     const resultado = this.validarCampo(campo);
    //     
    //     if (!resultado.valido) {
    //       mostrarError(campo, resultado.error);
    //       todosValidos = false;
    //     } else {
    //       limpiarError(campo);
    //     }
    //   });

    // TODO 4.3.4: Retornar todosValidos
    //   return todosValidos;
  },

  /**
   * Evaluar la fuerza de una contraseña
   * @param {string} password - La contraseña a evaluar
   * @returns {object} - { nivel: string, clase: string, valor: number }
   */
  evaluarFuerzaPassword(password) {
    let fuerza = 0;

    // TODO 4.3.5: Incrementar fuerza según criterios
    //   if (password.length >= 8) fuerza++;
    //   if (password.length >= 12) fuerza++;
    //   if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
    //   if (/\d/.test(password)) fuerza++;
    //   if (/[^a-zA-Z0-9]/.test(password)) fuerza++; // caracteres especiales

    const niveles = [
      { texto: '', clase: '' },
      { texto: 'Muy débil', clase: 'muy-debil' },
      { texto: 'Débil', clase: 'debil' },
      { texto: 'Media', clase: 'media' },
      { texto: 'Fuerte', clase: 'fuerte' },
      { texto: 'Muy fuerte', clase: 'muy-fuerte' }
    ];

    return {
      nivel: niveles[fuerza].texto,
      clase: niveles[fuerza].clase,
      valor: fuerza
    };
  }
};
```

#### 4.4 Funciones de UI y máscara (copiar)

**¿Qué hace este código?** Implementa las funciones que muestran feedback visual al usuario: marcar campos con borde rojo/verde, mostrar mensajes de error y aplicar la máscara de teléfono en tiempo real.

```javascript
/* =========================
   FUNCIONES DE UI
========================= */

/**
 * Mostrar mensaje de error en un campo
 * @param {HTMLElement} campo - El campo con error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(campo, mensaje) {
  campo.classList.add('campo--error');
  campo.classList.remove('campo--valido');

  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if (errorDiv) {
    errorDiv.textContent = mensaje;
  }
}

/**
 * Limpiar mensaje de error de un campo
 * @param {HTMLElement} campo - El campo a limpiar
 */
function limpiarError(campo) {
  campo.classList.remove('campo--error');
  
  // Solo marcar como válido si tiene contenido
  if (campo.value.trim() || campo.type === 'checkbox' && campo.checked) {
    campo.classList.add('campo--valido');
  } else {
    campo.classList.remove('campo--valido');
  }

  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if (errorDiv) {
    errorDiv.textContent = '';
  }
}

/**
 * Formatear teléfono mientras el usuario escribe
 * @param {HTMLInputElement} input - El input de teléfono
 */
function aplicarMascaraTelefono(input) {
  let valor = input.value.replace(/\D/g, ''); // Solo dígitos
  
  if (valor.length > 10) {
    valor = valor.slice(0, 10);
  }

  // Formato: (099) 999-9999
  if (valor.length > 6) {
    valor = `(${valor.slice(0, 3)}) ${valor.slice(3, 6)}-${valor.slice(6)}`;
  } else if (valor.length > 3) {
    valor = `(${valor.slice(0, 3)}) ${valor.slice(3)}`;
  } else if (valor.length > 0) {
    valor = `(${valor}`;
  }

  input.value = valor;
}
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

#### 5.1 Componente MensajeExito - Construcción completa (copiar)

**¿Qué hace este código?** Construye un mensaje de éxito usando únicamente la API del DOM. Crea cada elemento (container, título, texto), asigna textos con `textContent`, y ensambla todo con `appendChild`. Retorna el elemento `<div>` completo.

```javascript
'use strict';

/* =========================
   COMPONENTES
========================= */

/**
 * Componente de mensaje de éxito
 * @param {string} mensaje - Mensaje de éxito a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeExito(mensaje) {
  const container = document.createElement('div');
  container.className = 'mensaje-exito';

  const titulo = document.createElement('strong');
  titulo.textContent = '✓ Éxito';

  const texto = document.createElement('p');
  texto.textContent = mensaje;

  container.appendChild(titulo);
  container.appendChild(texto);

  return container;
}
```

#### 5.2 Componente MensajeError (completar)

**¿Qué hace este código?** Construye un mensaje de error de forma similar al de éxito. Crea el contenedor, el título y el texto usando `createElement`, asigna valores con `textContent`, y ensambla con `appendChild`.

```javascript
/**
 * Componente de mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeError(mensaje) {
  // TODO 5.2.1: Crear un div con className 'mensaje-error'
  //   const container = document.createElement('div');
  //   container.className = 'mensaje-error';

  // TODO 5.2.2: Crear un <strong> con textContent '✗ Error'
  //   const titulo = document.createElement('strong');
  //   titulo.textContent = '✗ Error';

  // TODO 5.2.3: Crear un <p> con textContent igual al parámetro mensaje
  //   const texto = document.createElement('p');
  //   texto.textContent = mensaje;

  // TODO 5.2.4: Agregar titulo y texto al container con appendChild
  //   container.appendChild(titulo);
  //   container.appendChild(texto);

  // TODO 5.2.5: Retornar el container
  //   return container;
}
```

#### 5.3 Componente ResultadoCard (completar)

**¿Qué hace este código?** Construye una tarjeta que muestra todos los datos enviados del formulario. Crea la estructura con `createElement`, itera las entradas del objeto datos, formatea valores especiales (contraseña oculta, género traducido, fecha formateada) y ensambla todo.

```javascript
/**
 * Componente para mostrar los datos del registro
 * @param {object} datos - Objeto con los datos del formulario
 * @returns {HTMLElement} - Elemento div del DOM
 */
function ResultadoCard(datos) {
  const card = document.createElement('div');
  card.className = 'resultado-card';

  const titulo = document.createElement('h3');
  titulo.textContent = 'Datos registrados correctamente';
  card.appendChild(titulo);

  // Mapeo de nombres de campos a etiquetas legibles
  const labels = {
    nombre: 'Nombre completo',
    email: 'Email',
    telefono: 'Teléfono',
    fecha_nacimiento: 'Fecha de nacimiento',
    genero: 'Género',
    password: 'Contraseña',
    terminos: 'Términos aceptados'
  };

  // TODO 5.3.1: Iterar cada entrada del objeto datos con Object.entries()
  //   Object.entries(datos).forEach(([clave, valor]) => {
  //     // Crear item
  //     const item = document.createElement('div');
  //     item.className = 'resultado-item';
  //
  //     const label = document.createElement('strong');
  //     label.textContent = labels[clave] || clave;
  //
  //     const valorSpan = document.createElement('span');
  //     
  //     // Formatear valores especiales
  //     if (clave === 'password') {
  //       valorSpan.textContent = '•'.repeat(valor.length);
  //     } else if (clave === 'terminos') {
  //       valorSpan.textContent = valor ? 'Sí' : 'No';
  //     } else if (clave === 'genero') {
  //       const generos = {
  //         masculino: 'Masculino',
  //         femenino: 'Femenino',
  //         otro: 'Otro',
  //         prefiero_no_decir: 'Prefiero no decir'
  //       };
  //       valorSpan.textContent = generos[valor] || valor;
  //     } else if (clave === 'fecha_nacimiento') {
  //       const fecha = new Date(valor + 'T00:00:00');
  //       valorSpan.textContent = fecha.toLocaleDateString('es-ES', {
  //         day: '2-digit',
  //         month: 'long',
  //         year: 'numeric'
  //       });
  //     } else {
  //       valorSpan.textContent = valor;
  //     }
  //
  //     item.appendChild(label);
  //     item.appendChild(valorSpan);
  //     card.appendChild(item);
  //   });

  return card;
}
```

#### 5.4 Funciones auxiliares de renderizado (copiar)

**¿Qué hace este código?** Implementa funciones auxiliares que insertan los componentes en el DOM. `mostrarMensajeTemporal` muestra mensajes y los oculta automáticamente después de un tiempo. `renderizarResultado` y `limpiarResultado` manejan el contenedor de resultados.

```javascript
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

/**
 * Renderizar resultado del registro
 * @param {object} datos - Datos del formulario
 * @param {HTMLElement} contenedor - Elemento donde renderizar
 */
function renderizarResultado(datos, contenedor) {
  contenedor.innerHTML = '';
  const card = ResultadoCard(datos);
  contenedor.appendChild(card);
}

/**
 * Limpiar resultado del registro
 * @param {HTMLElement} contenedor - Elemento a limpiar
 */
function limpiarResultado(contenedor) {
  contenedor.innerHTML = '<p>No hay datos enviados aún</p>';
  contenedor.className = 'resultado-vacio';
}
```

### Paso 6: JavaScript Parte 3 - Estado y funciones principales (copiar y completar)

En `js/app.js`, empezar con las selecciones de elementos y funciones principales:

#### 6.1 Selección de elementos (copiar)

**¿Qué hace este código?** Selecciona todos los elementos HTML necesarios usando `querySelector()` para poder interactuar con ellos en el JavaScript.

```javascript
'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */

const formRegistro = document.querySelector('#form-registro');
const inputPassword = document.querySelector('#password');
const inputConfirmarPassword = document.querySelector('#confirmar_password');
const inputTelefono = document.querySelector('#telefono');
const passwordStrength = document.querySelector('#password-strength');
const btnEnviar = document.querySelector('#btn-enviar');
const btnLimpiar = document.querySelector('#btn-limpiar');

const mensajeEstado = document.querySelector('#mensaje-estado');
const resultadoRegistro = document.querySelector('#resultado-registro');
```

#### 6.2 Funciones principales (completar)

**¿Qué hace este código?** Define las funciones principales de la aplicación: validar campos con feedback, actualizar el indicador de fuerza de contraseña, verificar si todos los campos están llenos y procesar el envío del formulario.

```javascript
/* =========================
   FUNCIONES PRINCIPALES
========================= */

/**
 * Validar un campo individual y mostrar feedback visual
 * @param {HTMLElement} campo - Campo a validar
 */
function validarCampoConFeedback(campo) {
  // TODO 6.2.1: Llamar a ValidacionService.validarCampo(campo) y guardar en resultado
  //   const resultado = ValidacionService.validarCampo(campo);
  
  // TODO 6.2.2: Si no es válido, llamar a mostrarError(campo, resultado.error)
  //   if (!resultado.valido) {
  //     mostrarError(campo, resultado.error);
  //   }
  // TODO 6.2.3: Si es válido, llamar a limpiarError(campo)
  //   else {
  //     limpiarError(campo);
  //   }
}

/**
 * Actualizar el indicador de fuerza de contraseña
 * @param {string} password - Contraseña a evaluar
 */
function actualizarIndicadorFuerza(password) {
  if (!password) {
    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';
    return;
  }

  // TODO 6.2.4: Llamar a ValidacionService.evaluarFuerzaPassword(password)
  //   const fuerza = ValidacionService.evaluarFuerzaPassword(password);
  
  // TODO 6.2.5: Actualizar textContent y className del indicador
  //   passwordStrength.textContent = `Fortaleza: ${fuerza.nivel}`;
  //   passwordStrength.className = `password-strength ${fuerza.clase}`;
}

/**
 * Verificar si todos los campos requeridos están llenos
 * @param {HTMLFormElement} form - Formulario a verificar
 * @returns {boolean} - true si todos los campos requeridos tienen valor
 */
function verificarCamposLlenos(form) {
  const camposRequeridos = form.querySelectorAll('[required]');
  
  return [...camposRequeridos].every(campo => {
    if (campo.type === 'checkbox') {
      return campo.checked;
    }
    return campo.value.trim() !== '';
  });
}

/**
 * Actualizar estado del botón de enviar
 * @param {HTMLFormElement} form - Formulario
 */
function actualizarBotonEnviar(form) {
  // TODO 6.2.6: Llamar a verificarCamposLlenos y deshabilitar el botón si no están todos llenos
  //   const todosLlenos = verificarCamposLlenos(form);
  //   btnEnviar.disabled = !todosLlenos;
}
```

#### 6.3 Procesar envío del formulario (completar)

**¿Qué hace este código?** Maneja el proceso completo de envío: convierte FormData a objeto, incluye el checkbox manualmente (no viene en FormData si no está marcado), muestra mensajes, renderiza resultados, limpia el formulario y hace scroll.

```javascript
/**
 * Procesar el envío del formulario
 * @param {FormData} formData - Datos del formulario
 */
function procesarEnvio(formData) {
  // TODO 6.3.1: Convertir FormData a objeto con Object.fromEntries
  //   const datos = Object.fromEntries(formData);
  
  // TODO 6.3.2: Agregar el checkbox manualmente (FormData solo incluye si está checked)
  //   datos.terminos = formRegistro.querySelector('#terminos').checked;

  // Simular envío (aquí iría fetch a un servidor)
  console.log('Datos a enviar:', datos);

  // Mostrar mensaje de éxito
  mostrarMensajeTemporal(
    mensajeEstado,
    MensajeExito('Registro completado exitosamente. Los datos se muestran abajo.'),
    5000
  );

  // Renderizar resultado
  renderizarResultado(datos, resultadoRegistro);

  // Limpiar formulario
  formRegistro.reset();
  
  // Limpiar clases de validación
  const campos = formRegistro.querySelectorAll('input, select, textarea');
  campos.forEach(campo => {
    campo.classList.remove('campo--valido', 'campo--error');
  });

  // Limpiar indicador de contraseña
  passwordStrength.textContent = '';
  passwordStrength.className = 'password-strength';

  // Actualizar botón
  actualizarBotonEnviar(formRegistro);

  // Scroll al resultado
  resultadoRegistro.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
```

### Paso 7: JavaScript Parte 4 - Event listeners y delegación (copiar y completar)

#### 7.1 Submit del formulario (completar)

**¿Qué hace este código?** Maneja el evento submit del formulario: previene envío por defecto, valida todos los campos, muestra errores si hay problemas, y procesa el envío si todo es válido. Usa scroll automático al primer error.

```javascript
/* =========================
   EVENT LISTENERS
========================= */

// Submit del formulario
formRegistro.addEventListener('submit', (e) => {
  e.preventDefault();

  // TODO 7.1.1: Validar todos los campos con ValidacionService.validarFormulario
  //   const formularioValido = ValidacionService.validarFormulario(formRegistro);

  // TODO 7.1.2: Si NO es válido, mostrar mensaje de error
  //   if (!formularioValido) {
  //     mostrarMensajeTemporal(
  //       mensajeEstado,
  //       MensajeError('Por favor, corrige los errores en el formulario antes de continuar.'),
  //       5000
  //     );
  //     
  //     // Hacer scroll al primer campo con error
  //     const primerError = formRegistro.querySelector('.campo--error');
  //     if (primerError) {
  //       primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //       primerError.focus();
  //     }
  //     
  //     return;
  //   }

  // TODO 7.1.3: Si es válido, crear FormData y llamar a procesarEnvio
  //   const formData = new FormData(formRegistro);
  //   procesarEnvio(formData);
});
```

#### 7.2 Validación en tiempo real y otros eventos (copiar)

**¿Qué hace este código?** Implementa todos los eventos restantes: validación al perder foco, limpiar error al escribir, actualizar fuerza de contraseña, aplicar máscara de teléfono, revalidar confirmación de contraseña, y limpiar formulario.

```javascript
// Validar campo al perder el foco
formRegistro.addEventListener('focusout', (e) => {
  if (e.target.matches('input, select, textarea')) {
    validarCampoConFeedback(e.target);
  }
});

// Limpiar error al empezar a escribir
formRegistro.addEventListener('input', (e) => {
  if (e.target.matches('input, textarea')) {
    // Solo limpiar el error, no validar aún
    const errorDiv = e.target.parentElement.querySelector('.error-mensaje');
    if (errorDiv && errorDiv.textContent) {
      limpiarError(e.target);
    }
  }
  
  // Actualizar botón
  actualizarBotonEnviar(formRegistro);
});

// Actualizar fuerza de contraseña en tiempo real
inputPassword.addEventListener('input', (e) => {
  actualizarIndicadorFuerza(e.target.value);
});

// Aplicar máscara de teléfono
inputTelefono.addEventListener('input', (e) => {
  aplicarMascaraTelefono(e.target);
});

// Revalidar confirmación de contraseña cuando cambia la contraseña principal
inputPassword.addEventListener('input', () => {
  if (inputConfirmarPassword.value) {
    validarCampoConFeedback(inputConfirmarPassword);
  }
});

// Limpiar formulario
btnLimpiar.addEventListener('click', () => {
  if (confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
    formRegistro.reset();
    
    // Limpiar todas las validaciones visuales
    const campos = formRegistro.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
      campo.classList.remove('campo--valido', 'campo--error');
      const errorDiv = campo.parentElement.querySelector('.error-mensaje');
      if (errorDiv) {
        errorDiv.textContent = '';
      }
    });

    // Limpiar indicador de contraseña
    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';

    // Limpiar resultado
    limpiarResultado(resultadoRegistro);

    // Ocultar mensaje de estado
    mensajeEstado.classList.add('oculto');

    // Actualizar botón
    actualizarBotonEnviar(formRegistro);

    // Focus en el primer campo
    document.querySelector('#nombre').focus();
  }
});

/* =========================
   INICIALIZACIÓN
========================= */

// Deshabilitar botón inicialmente
actualizarBotonEnviar(formRegistro);

// Focus en el primer campo
document.querySelector('#nombre').focus();
```

### Paso 8: Pruebas y verificación

#### 8.1 Pruebas de validación de campos

1. **Nombre**
   - Dejar vacío → Mensaje "Este campo es obligatorio"
   - Escribir "Jo" → Mensaje "El nombre debe tener al menos 3 caracteres"
   - Escribir "Juan123" → Mensaje "El nombre solo puede contener letras y espacios"
   - Escribir "Juan Pérez" → Borde verde, sin mensaje de error

2. **Email**
   - Escribir "correo" → Mensaje "Formato de email inválido"
   - Escribir "correo@" → Mensaje "Formato de email inválido"
   - Escribir "correo@mail.com" → Borde verde

3. **Teléfono**
   - Escribir "099" → Mensaje "El teléfono debe tener exactamente 10 dígitos"
   - Escribir "0991234567" → Borde verde, formato automático (099) 123-4567

4. **Fecha de nacimiento**
   - Seleccionar una fecha de hace 10 años → Mensaje "Debes ser mayor de 18 años"
   - Seleccionar una fecha válida (mayor de 18 años) → Borde verde

5. **Contraseña**
   - Escribir "abc" → Indicador "Muy débil"
   - Escribir "abcdefgh" → Indicador "Débil", mensaje "Debe tener al menos una letra mayúscula"
   - Escribir "Abcdefgh" → Indicador "Media", mensaje "Debe tener al menos un número"
   - Escribir "Abcdefgh1" → Indicador "Fuerte", borde verde
   - Escribir "Abcdefgh1@#" → Indicador "Muy fuerte"

6. **Confirmar contraseña**
   - Escribir algo diferente → Mensaje "Las contraseñas no coinciden"
   - Escribir lo mismo que contraseña → Borde verde

7. **Términos y condiciones**
   - No marcar → Mensaje "Debes aceptar este campo"
   - Marcar → Sin error

#### 8.2 Pruebas de UX

1. **Botón deshabilitado**
   - Verificar que el botón "Registrarse" está deshabilitado al inicio
   - Llenar todos los campos
   - Verificar que el botón se habilita

2. **Validación en tiempo real**
   - Hacer click en un campo y salir sin escribir → Aparece error
   - Empezar a escribir → El error desaparece
   - Salir del campo → Validación completa

3. **Limpiar error al escribir**
   - Provocar un error en un campo
   - Empezar a escribir → El mensaje de error y el borde rojo desaparecen
   - Salir del campo → Se valida de nuevo

4. **Scroll automático**
   - Llenar mal varios campos
   - Hacer submit
   - Verificar que hace scroll al primer campo con error
   - Verificar que el campo recibe foco

5. **Confirmación de limpiar**
   - Click en "Limpiar formulario"
   - Verificar que pide confirmación
   - Cancelar → No se limpia
   - Aceptar → Formulario limpio, botón deshabilitado

#### 8.3 Pruebas de envío

1. **Envío exitoso**
   - Llenar correctamente todos los campos
   - Click en "Registrarse"
   - Verificar mensaje verde "Registro completado exitosamente"
   - Verificar que aparece tarjeta con todos los datos
   - Verificar que el formulario se limpia
   - Verificar que hace scroll a la tarjeta de resultado

2. **Formato de datos en resultado**
   - Verificar que la contraseña se muestra como "••••••••"
   - Verificar que el género se traduce (ej: "masculino" → "Masculino")
   - Verificar que la fecha se formatea (ej: "25 de diciembre de 2000")
   - Verificar que términos muestra "Sí"

3. **Consola**
   - Abrir DevTools > Console
   - Enviar formulario
   - Verificar que se imprime "Datos a enviar:" con el objeto completo

#### 8.4 Pruebas técnicas (DevTools)

1. **Elementos del DOM**
   - Inspeccionar un campo con error → Tiene clase `campo--error`
   - Inspeccionar un campo válido → Tiene clase `campo--valido`
   - Verificar que los mensajes de error se crean con `createElement` (no `innerHTML`)

2. **Console**
   - Verificar que no hay errores en consola
   - Verificar que los datos se imprimen al enviar

3. **Máscaras y formateo**
   - Escribir "0991234567" en teléfono → Verificar que se formatea a "(099) 123-4567"
   - Escribir letras en teléfono → Verificar que se ignoran

4. **Event listeners**
   - Verificar que `focusout` detecta salida de cualquier campo
   - Verificar que `input` detecta cambios en tiempo real
   - Verificar que `submit` previene envío por defecto

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Formulario vacío con botón deshabilitado** - Vista inicial
2. **Errores de validación** - Múltiples campos con borde rojo y mensajes específicos
3. **Campos válidos** - Campos con borde verde
4. **Indicador de fuerza de contraseña** - Mostrar al menos 3 niveles diferentes
5. **Error de contraseñas no coinciden** - Mensaje en confirmar contraseña
6. **Máscara de teléfono** - Formato (099) 999-9999
7. **Envío exitoso** - Mensaje verde y tarjeta con datos
8. **Tarjeta de resultado** - Datos formateados correctamente
9. **Consola** - Datos impresos al enviar
10. **Código** - Capturas de las funciones de validación y componentes

### Formato del Archivo de Evidencias

```markdown
### 1. Formulario con errores de validación
![Errores](assets/01-errores.png)
**Descripción:** Se muestran mensajes de error específicos por cada campo...

### 2. Validación exitosa y envío
![Éxito](assets/02-exito.png)
**Descripción:** Todos los campos con borde verde, mensaje de éxito, datos mostrados...

### 3. Indicador de fuerza de contraseña
![Fuerza](assets/03-fuerza.png)
**Descripción:** Indicador mostrando "Fuerte" con color verde...
```

---

## 9. Entregables

- Repositorio GitHub con el código completo
- Formulario con mínimo 8 campos y validaciones específicas
- Validación en tiempo real (focusout + input)
- Feedback visual completo (bordes, mensajes, indicador de contraseña)
- Componentes construidos con `createElement` (no `innerHTML`)
- Máscara de teléfono funcional
- Botón deshabilitado hasta formulario completo
- FormData para recopilar datos
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias

---

## Reglas

- No usar frameworks
- Solo HTML + CSS + JavaScript puro
- Usar `novalidate` en el form y validar con JavaScript
- `preventDefault()` obligatorio en el submit
- Todo campo obligatorio debe mostrar error si está vacío
- Mensajes de error específicos (no genéricos como "Campo inválido")
- No usar `alert()` para mostrar errores - usar el DOM
- **NO usar `innerHTML` para contenido dinámico** - usar `createElement` + `textContent` + `appendChild`
- Los componentes deben retornar elementos del DOM, no strings HTML
- Usar `textContent` para asignar texto (nunca `innerHTML` con datos del usuario)

---

## Notas de Implementación

### FormData API
- `FormData` solo captura campos con atributo `name`
- Los checkboxes no marcados NO aparecen en FormData → agregar manualmente
- `Object.fromEntries(new FormData(form))` convierte a objeto plano rápidamente
- Para archivos, FormData es la única opción (no Object.fromEntries)

### Validación
- `novalidate` en el form desactiva la validación nativa del navegador
- `focusout` burbujea, `blur` no → usar `focusout` para delegación de eventos
- Las expresiones regulares se prueban con `.test(valor)` que retorna boolean
- `setCustomValidity('')` limpia el error (vuelve válido el campo)
- Constraint Validation API: `campo.validity` tiene propiedades de solo lectura

### Eventos
- Usar delegación de eventos en el form (un solo listener para todos los campos)
- `focusout` para validar al salir del campo
- `input` para limpiar errores y feedback en tiempo real
- `submit` para validación final antes de enviar

### Manipulación del DOM
- **Evitar `innerHTML` con datos dinámicos**: riesgo de XSS y pérdida de performance
- Usar `createElement()` para crear elementos nuevos
- Usar `textContent` para asignar texto de forma segura (no interpreta HTML)
- Usar `appendChild()` para insertar elementos en el DOM
- Los componentes deben retornar elementos (`HTMLElement`), no strings
- Para limpiar un contenedor: `element.innerHTML = ''` es aceptable, o mejor `element.replaceChildren()`

### Ejemplo correcto de componente
```javascript
// ✅ CORRECTO: Retorna elemento del DOM
function MensajeError(mensaje) {
  const div = document.createElement('div');
  div.className = 'mensaje-error';
  
  const texto = document.createElement('p');
  texto.textContent = mensaje; // SEGURO
  
  div.appendChild(texto);
  return div; // Retorna HTMLElement
}

// Uso
const error = MensajeError('Email inválido');
contenedor.appendChild(error);
```

```javascript
// ❌ INCORRECTO: Retorna string y usa innerHTML
function MensajeError(mensaje) {
  return `<div class="mensaje-error"><p>${mensaje}</p></div>`; // INSEGURO
}

// Uso (peligroso)
contenedor.innerHTML = MensajeError(userInput); // ❌ XSS risk
```

---
