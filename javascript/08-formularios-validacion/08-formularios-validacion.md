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

Los formularios son la principal via de entrada de datos del usuario en una aplicacion web. Validar estos datos **antes** de enviarlos al servidor mejora la experiencia de usuario, reduce carga en el backend y previene datos invalidos.

HTML5 provee validacion nativa con atributos como `required`, `pattern`, `min`, `max`. JavaScript complementa con validaciones personalizadas mas complejas y feedback visual en tiempo real.

### Niveles de validacion

| Nivel | Donde | Ejemplo | Obligatorio? |
|:-:|:-:|:-:|:-:|
| HTML5 nativo | Navegador | `required`, `type="email"` | Recomendado |
| JavaScript cliente | Navegador | Regex, longitud, logica custom | Recomendado |
| Servidor | Backend | Sanitizar, verificar en BD | Obligatorio |

---

## 2. Conceptos Clave

### FormData API

```javascript
const form = document.querySelector('#mi-formulario');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  // Leer valores
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

### Atributos de validacion HTML5

| Atributo | Aplica a | Descripcion |
|----------|----------|-------------|
| `required` | Todos | Campo obligatorio |
| `type="email"` | input | Formato email valido |
| `type="url"` | input | Formato URL valida |
| `type="number"` | input | Solo numeros |
| `min` / `max` | number, date, range | Valor minimo/maximo |
| `minlength` / `maxlength` | text, textarea | Longitud de texto |
| `pattern` | text, search, tel, url | Regex personalizada |
| `step` | number, range | Incremento valido |

```html
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

---

## 3. Explicacion Tecnica Detallada

### Constraint Validation API

JavaScript provee una API nativa para validar formularios programaticamente:

```javascript
const input = document.querySelector('#email');

// Propiedades de validacion
input.validity.valid;          // boolean: campo valido?
input.validity.valueMissing;   // true si required y vacio
input.validity.typeMismatch;   // true si tipo incorrecto (ej: email invalido)
input.validity.patternMismatch;// true si no cumple pattern
input.validity.tooShort;       // true si menor que minlength
input.validity.tooLong;        // true si mayor que maxlength
input.validity.rangeUnderflow; // true si menor que min
input.validity.rangeOverflow;  // true si mayor que max
input.validity.customError;    // true si se seteó con setCustomValidity

// Metodos
input.checkValidity();         // verifica validez, dispara evento 'invalid'
input.reportValidity();        // verifica y muestra mensaje nativo
input.setCustomValidity('msg');// setea mensaje de error personalizado
// setCustomValidity('') para limpiar (campo valido)

// Validar formulario completo
const form = document.querySelector('form');
form.checkValidity();          // true si TODOS los campos son validos
```

### Validacion en tiempo real con eventos

```javascript
const form = document.querySelector('#formulario');

// Validar campo individual al perder foco
form.addEventListener('focusout', (e) => {
  if (e.target.matches('input, select, textarea')) {
    validarCampo(e.target);
  }
});

// Validar mientras escribe (con debounce)
form.addEventListener('input', (e) => {
  if (e.target.matches('input, textarea')) {
    // Limpiar error previo al escribir
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
function validarCampo(campo) {
  const valor = campo.value.trim();
  const nombre = campo.name;
  let error = '';

  // Validar required
  if (campo.hasAttribute('required') && !valor) {
    error = 'Este campo es obligatorio';
  }

  // Validaciones por tipo
  if (!error && valor) {
    switch (nombre) {
      case 'nombre':
        if (valor.length < 3) error = 'Minimo 3 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) error = 'Solo letras y espacios';
        break;

      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) error = 'Email invalido';
        break;

      case 'telefono':
        if (!/^\d{10}$/.test(valor)) error = 'Debe tener 10 digitos';
        break;

      case 'edad':
        const edad = Number(valor);
        if (edad < 18 || edad > 120) error = 'Debe ser entre 18 y 120';
        break;

      case 'password':
        if (valor.length < 8) error = 'Minimo 8 caracteres';
        else if (!/[A-Z]/.test(valor)) error = 'Debe tener al menos una mayuscula';
        else if (!/[a-z]/.test(valor)) error = 'Debe tener al menos una minuscula';
        else if (!/[0-9]/.test(valor)) error = 'Debe tener al menos un numero';
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

function validarFormulario(form) {
  const campos = form.querySelectorAll('input, select, textarea');
  let valido = true;
  campos.forEach(campo => {
    if (!validarCampo(campo)) valido = false;
  });
  return valido;
}
```

### Feedback visual de errores

```javascript
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

function limpiarError(campo) {
  campo.classList.remove('campo--error');
  campo.classList.add('campo--valido');

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
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  url: /^https?:\/\/.+/,
  codigoPostal: /^\d{5,6}$/
};

function validarConRegex(valor, tipo) {
  return REGEX[tipo] ? REGEX[tipo].test(valor) : true;
}
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Formulario de registro completo

```html
<form id="form-registro" novalidate>
  <div class="campo-grupo">
    <label for="nombre">Nombre completo *</label>
    <input type="text" id="nombre" name="nombre" required minlength="3">
  </div>

  <div class="campo-grupo">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required>
  </div>

  <div class="campo-grupo">
    <label for="telefono">Telefono</label>
    <input type="tel" id="telefono" name="telefono" pattern="[0-9]{10}">
  </div>

  <div class="campo-grupo">
    <label for="edad">Edad *</label>
    <input type="number" id="edad" name="edad" required min="18" max="120">
  </div>

  <div class="campo-grupo">
    <label for="password">Contraseña *</label>
    <input type="password" id="password" name="password" required minlength="8">
    <div class="password-strength" id="password-strength"></div>
  </div>

  <div class="campo-grupo">
    <label for="confirmar">Confirmar contraseña *</label>
    <input type="password" id="confirmar" name="confirmar_password" required>
  </div>

  <button type="submit" id="btn-enviar">Registrarse</button>
</form>
```

```javascript
'use strict';

const form = document.querySelector('#form-registro');

// Medidor de fuerza de contraseña
function evaluarFuerzaPassword(password) {
  let fuerza = 0;
  if (password.length >= 8) fuerza++;
  if (password.length >= 12) fuerza++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
  if (/\d/.test(password)) fuerza++;
  if (/[^a-zA-Z0-9]/.test(password)) fuerza++;

  const niveles = ['', 'Muy debil', 'Debil', 'Media', 'Fuerte', 'Muy fuerte'];
  const colores = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

  return { nivel: niveles[fuerza], color: colores[fuerza], valor: fuerza };
}

// Eventos
form.querySelector('#password').addEventListener('input', (e) => {
  const fuerza = evaluarFuerzaPassword(e.target.value);
  const indicador = document.querySelector('#password-strength');
  indicador.textContent = fuerza.nivel;
  indicador.style.color = fuerza.color;
});

form.addEventListener('focusout', (e) => {
  if (e.target.matches('input')) validarCampo(e.target);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validarFormulario(form)) {
    const datos = Object.fromEntries(new FormData(form));
    delete datos.confirmar_password; // no enviar confirmacion
    console.log('Registro exitoso:', datos);
    mostrarMensajeExito('Registro completado correctamente');
    form.reset();
  }
});

function mostrarMensajeExito(mensaje) {
  const exito = document.createElement('div');
  exito.className = 'mensaje-exito';
  exito.textContent = mensaje;
  form.insertAdjacentElement('beforebegin', exito);
  setTimeout(() => exito.remove(), 3000);
}
```

### Ejemplo 2: Formulario dinamico con campos condicionales

```javascript
'use strict';

function FormularioPedido() {
  return `
    <form id="form-pedido" novalidate>
      <div class="campo-grupo">
        <label>Tipo de pedido *</label>
        <select name="tipo" required>
          <option value="">Seleccionar...</option>
          <option value="envio">Envio a domicilio</option>
          <option value="retiro">Retiro en tienda</option>
        </select>
      </div>

      <div id="campos-envio" style="display:none;">
        <div class="campo-grupo">
          <label>Direccion *</label>
          <input type="text" name="direccion" minlength="10">
        </div>
        <div class="campo-grupo">
          <label>Ciudad *</label>
          <input type="text" name="ciudad">
        </div>
        <div class="campo-grupo">
          <label>Codigo postal *</label>
          <input type="text" name="codigo_postal" pattern="[0-9]{5,6}">
        </div>
      </div>

      <div id="campos-retiro" style="display:none;">
        <div class="campo-grupo">
          <label>Sucursal *</label>
          <select name="sucursal">
            <option value="">Seleccionar...</option>
            <option value="centro">Centro</option>
            <option value="norte">Norte</option>
            <option value="sur">Sur</option>
          </select>
        </div>
      </div>

      <button type="submit">Confirmar pedido</button>
    </form>
  `;
}

// Mostrar/ocultar campos segun tipo
document.addEventListener('change', (e) => {
  if (e.target.name === 'tipo') {
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
  }
});
```

---

## 5. Comparaciones / Tablas

### Eventos de formulario

| Evento | Se dispara cuando | Elemento | Uso comun |
|--------|:-:|:-:|:-:|
| `submit` | Se envia el formulario | `<form>` | Validar y enviar |
| `input` | El valor cambia (en tiempo real) | input, textarea | Feedback instantaneo |
| `change` | El valor cambia y pierde foco | input, select | Validar al salir |
| `focusin` | El campo recibe foco | input | Mostrar ayuda |
| `focusout` | El campo pierde foco | input | Validar campo |
| `invalid` | El campo no pasa validacion | input | Mensaje custom |
| `reset` | Se resetea el formulario | `<form>` | Limpiar estado |

### Formas de obtener datos del formulario

| Metodo | Codigo | Ventaja |
|--------|--------|---------|
| `FormData` | `new FormData(form)` | Estandar, soporta archivos |
| `getElementById` | `document.getElementById('campo').value` | Directo para un campo |
| `querySelector` | `form.querySelector('[name="campo"]').value` | Flexible |
| `form.elements` | `form.elements.campo.value` | Acceso por nombre |
| `Object.fromEntries` | `Object.fromEntries(new FormData(form))` | Objeto plano rapido |

### Validacion HTML5 vs JavaScript

| Aspecto | HTML5 nativo | JavaScript custom |
|---------|:-:|:-:|
| Configuracion | Solo atributos HTML | Codigo JS |
| Mensajes | Default del navegador | Personalizados |
| Estilo de error | Burbuja del navegador | CSS personalizado |
| Logica compleja | No (solo pattern) | Si |
| Validacion cruzada | No | Si (ej: confirmar password) |
| Async (verificar BD) | No | Si |

---

## 6. Funcionalidades Complementarias

### Deshabilitar boton hasta que el formulario sea valido

```javascript
function actualizarBotonEnviar(form) {
  const btn = form.querySelector('[type="submit"]');
  const campos = form.querySelectorAll('[required]');
  const todosLlenos = [...campos].every(c => c.value.trim());
  btn.disabled = !todosLlenos;
}

form.addEventListener('input', () => actualizarBotonEnviar(form));
```

### Mascara de input (formato telefono)

```javascript
document.querySelector('#telefono').addEventListener('input', (e) => {
  let valor = e.target.value.replace(/\D/g, ''); // solo digitos
  if (valor.length > 10) valor = valor.slice(0, 10);

  // Formato: (099) 999-9999
  if (valor.length > 6) {
    valor = `(${valor.slice(0, 3)}) ${valor.slice(3, 6)}-${valor.slice(6)}`;
  } else if (valor.length > 3) {
    valor = `(${valor.slice(0, 3)}) ${valor.slice(3)}`;
  } else if (valor.length > 0) {
    valor = `(${valor}`;
  }

  e.target.value = valor;
});
```

### Autoguardado con sessionStorage

```javascript
// Guardar progreso cada vez que el usuario escribe
form.addEventListener('input', (e) => {
  const datos = Object.fromEntries(new FormData(form));
  sessionStorage.setItem('form_draft', JSON.stringify(datos));
});

// Restaurar al cargar
window.addEventListener('DOMContentLoaded', () => {
  const draft = JSON.parse(sessionStorage.getItem('form_draft'));
  if (draft) {
    Object.entries(draft).forEach(([name, value]) => {
      const campo = form.querySelector(`[name="${name}"]`);
      if (campo) campo.value = value;
    });
  }
});

// Limpiar al enviar exitosamente
form.addEventListener('submit', (e) => {
  // ... validar y enviar ...
  sessionStorage.removeItem('form_draft');
});
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

```
practica-08/
  index.html
  css/
    styles.css
  js/
    validacion.js
    app.js
```

### Paso 2: Crear el formulario HTML

Crear un formulario de registro con al menos 8 campos:
1. Nombre (texto, obligatorio, minimo 3 caracteres)
2. Email (email, obligatorio)
3. Telefono (tel, 10 digitos)
4. Fecha de nacimiento (date, mayor de edad)
5. Genero (select)
6. Contraseña (password, minimo 8, mayuscula, minuscula, numero)
7. Confirmar contraseña (debe coincidir)
8. Terminos y condiciones (checkbox)

Usar `novalidate` para manejar la validacion con JavaScript.

### Paso 3: Implementar validacion JavaScript

En `validacion.js`:
1. Funcion `validarCampo(campo)` que valida un campo individual
2. Funcion `validarFormulario(form)` que valida todos los campos
3. Mensajes de error especificos por tipo de error
4. Al menos 3 campos con validacion regex personalizada

### Paso 4: Feedback visual en tiempo real

1. Validar al perder foco (`focusout`)
2. Limpiar error al empezar a escribir (`input`)
3. Borde rojo y mensaje para campos invalidos
4. Borde verde para campos validos
5. Indicador de fuerza de contraseña

### Paso 5: Envio del formulario

1. `preventDefault()` en el submit
2. Validar TODOS los campos antes de enviar
3. Recopilar datos con `FormData` + `Object.fromEntries`
4. Mostrar mensaje de exito/error
5. Resetear formulario al exito

### Paso 6: Funcionalidad extra

Implementar al menos una:
1. Mascara de telefono (formato visual mientras escribe)
2. Autoguardado del formulario en sessionStorage
3. Campos condicionales (mostrar/ocultar segun seleccion)
4. Boton de envio deshabilitado hasta formulario valido

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Formulario vacio** - Vista inicial
2. **Errores de validacion** - Campos con borde rojo y mensajes
3. **Campos validos** - Campos con borde verde
4. **Fuerza de contraseña** - Indicador mostrando diferentes niveles
5. **Confirmacion password** - Error cuando no coinciden
6. **Envio exitoso** - Mensaje de exito, datos en consola
7. **Funcionalidad extra** - Mascara, autoguardado o campos condicionales
8. **Codigo** - Capturas de funciones de validacion

### Formato del Archivo de Evidencias

```markdown
### 1. Formulario con errores
![Errores](assets/01-errores.png)
**Descripcion:** Se muestran mensajes de error especificos por campo...

### 2. Validacion exitosa
![Valido](assets/02-valido.png)
**Descripcion:** Todos los campos con borde verde y datos enviados...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Formulario con minimo 8 campos y validaciones
- Validacion en tiempo real (focusout + input)
- Feedback visual (bordes, mensajes de error, indicador password)
- FormData para recopilar datos
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias

---

## Reglas

- No usar frameworks
- Solo HTML + CSS + JavaScript puro
- Usar `novalidate` en el form y validar con JavaScript
- `preventDefault()` obligatorio en el submit
- Todo campo obligatorio debe mostrar error si esta vacio
- Mensajes de error especificos (no genericos como "Campo invalido")
- No usar `alert()` para mostrar errores - usar el DOM

---

## Notas de Implementacion

- `novalidate` en el form desactiva la validacion nativa del navegador
- `FormData` solo captura campos con atributo `name`
- `Object.fromEntries(new FormData(form))` no maneja checkboxes no marcados
- Para checkboxes, verificar con `form.querySelector('[name="terminos"]').checked`
- `focusout` burbujea, `blur` no - usar `focusout` para delegacion
- Las expresiones regulares se prueban con `.test(valor)` que retorna boolean
- `setCustomValidity('')` limpia el error (vuelve valido)

---


