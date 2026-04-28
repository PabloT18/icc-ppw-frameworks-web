'use strict';

/* =========================
   1. SELECTORES
========================= */

const form = document.querySelector('#formulario');
const inputPassword = document.querySelector('#password');
const passwordStrength = document.querySelector('.password-strength');
const resultado = document.querySelector('#resultado');


/* =========================
   2. EXPRESIONES REGULARES
========================= */

const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
};


/* =========================
   3. FUNCIONES DE VALIDACIÓN
========================= */

// Validar un campo individual
function validarCampo(campo) {
  const valor = campo.value.trim();
  const nombre = campo.name;
  let error = '';

  // Validar required (obligatorio)
  if (campo.hasAttribute('required') && !valor) {
    error = 'Este campo es obligatorio';
  }

  // Validaciones específicas por campo
  if (!error && valor) {
    if (nombre === 'nombre') {
      if (valor.length < 3) {
        error = 'Mínimo 3 caracteres';
      } else if (!REGEX.soloLetras.test(valor)) {
        error = 'Solo letras y espacios';
      }
    }

    if (nombre === 'email') {
      if (!REGEX.email.test(valor)) {
        error = 'Email inválido';
      }
    }

    if (nombre === 'password') {
      if (valor.length < 8) {
        error = 'Mínimo 8 caracteres';
      } else if (!/[A-Z]/.test(valor)) {
        error = 'Debe tener una mayúscula';
      } else if (!/[a-z]/.test(valor)) {
        error = 'Debe tener una minúscula';
      } else if (!/[0-9]/.test(valor)) {
        error = 'Debe tener un número';
      }
    }
  }

  // Mostrar u ocultar error
  if (error) {
    mostrarError(campo, error);
    return false;
  } else {
    limpiarError(campo);
    return true;
  }
}


/* =========================
   4. FEEDBACK VISUAL
========================= */

function mostrarError(campo, mensaje) {
  // Agregar clase de error
  campo.classList.add('campo--error');
  campo.classList.remove('campo--valido');

  // Mostrar mensaje
  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if (errorDiv) {
    errorDiv.textContent = mensaje;
  }
}

function limpiarError(campo) {
  // Quitar clase de error
  campo.classList.remove('campo--error');
  
  // Solo marcar como válido si tiene contenido
  if (campo.value.trim()) {
    campo.classList.add('campo--valido');
  }

  // Limpiar mensaje
  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if (errorDiv) {
    errorDiv.textContent = '';
  }
}


/* =========================
   5. FUERZA DE CONTRASEÑA
========================= */

function evaluarFuerzaPassword(password) {
  let fuerza = 0;

  if (password.length >= 8) fuerza++;
  if (/[A-Z]/.test(password)) fuerza++;
  if (/[a-z]/.test(password)) fuerza++;
  if (/[0-9]/.test(password)) fuerza++;
  if (/[^a-zA-Z0-9]/.test(password)) fuerza++; // caracteres especiales

  if (fuerza <= 2) return { texto: 'Débil', clase: 'debil' };
  if (fuerza === 3) return { texto: 'Media', clase: 'media' };
  return { texto: 'Fuerte', clase: 'fuerte' };
}


/* =========================
   6. EVENTOS
========================= */

// Validar al perder el foco (focusout)
form.addEventListener('focusout', (e) => {
  if (e.target.matches('input')) {
    validarCampo(e.target);
  }
});

// Limpiar error al escribir
form.addEventListener('input', (e) => {
  if (e.target.matches('input')) {
    const errorDiv = e.target.parentElement.querySelector('.error-mensaje');
    if (errorDiv && errorDiv.textContent) {
      limpiarError(e.target);
    }
  }
});

// Actualizar indicador de fuerza de contraseña
inputPassword.addEventListener('input', (e) => {
  const password = e.target.value;
  
  if (!password) {
    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';
    return;
  }

  const fuerza = evaluarFuerzaPassword(password);
  passwordStrength.textContent = `Fortaleza: ${fuerza.texto}`;
  passwordStrength.className = `password-strength ${fuerza.clase}`;
});

// Submit del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault(); // IMPORTANTE: prevenir envío por defecto

  // Validar todos los campos
  const campos = form.querySelectorAll('input');
  let todosValidos = true;

  campos.forEach(campo => {
    if (!validarCampo(campo)) {
      todosValidos = false;
    }
  });

  // Si todos son válidos, procesar datos
  if (todosValidos) {
    // Obtener datos del formulario
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData);

    // Mostrar datos en consola
    console.log('Datos válidos:', datos);

    // Mostrar mensaje de éxito
    resultado.className = 'exito';
    resultado.innerHTML = `
      <strong>✓ Registro exitoso</strong>
      <p>Nombre: ${datos.nombre}</p>
      <p>Email: ${datos.email}</p>
    `;

    // Limpiar formulario
    form.reset();
    
    // Limpiar validaciones visuales
    campos.forEach(campo => {
      campo.classList.remove('campo--valido', 'campo--error');
    });

    // Limpiar indicador de contraseña
    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';

  } else {
    // Mostrar error general
    resultado.className = 'error';
    resultado.innerHTML = '<strong>✗ Error</strong><p>Corrige los errores antes de enviar</p>';
  }
});
