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

/* =========================
   FUNCIONES PRINCIPALES
========================= */

/**
 * Validar un campo individual y mostrar feedback visual
 * @param {HTMLElement} campo - Campo a validar
 */
function validarCampoConFeedback(campo) {
  const resultado = ValidacionService.validarCampo(campo);
  
  if (!resultado.valido) {
    mostrarError(campo, resultado.error);
  } else {
    limpiarError(campo);
  }
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

  const fuerza = ValidacionService.evaluarFuerzaPassword(password);
  passwordStrength.textContent = `Fortaleza: ${fuerza.nivel}`;
  passwordStrength.className = `password-strength ${fuerza.clase}`;
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
  const todosLlenos = verificarCamposLlenos(form);
  btnEnviar.disabled = !todosLlenos;
}

/**
 * Procesar el envío del formulario
 * @param {FormData} formData - Datos del formulario
 */
function procesarEnvio(formData) {
  // Convertir FormData a objeto
  const datos = Object.fromEntries(formData);
  
  // Agregar el checkbox manualmente (FormData solo incluye si está checked)
  datos.terminos = formRegistro.querySelector('#terminos').checked;

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

/* =========================
   EVENT LISTENERS
========================= */

// Submit del formulario
formRegistro.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validar todos los campos
  const formularioValido = ValidacionService.validarFormulario(formRegistro);

  if (!formularioValido) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError('Por favor, corrige los errores en el formulario antes de continuar.'),
      5000
    );
    
    // Hacer scroll al primer campo con error
    const primerError = formRegistro.querySelector('.campo--error');
    if (primerError) {
      primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      primerError.focus();
    }
    
    return;
  }

  // Procesar envío
  const formData = new FormData(formRegistro);
  procesarEnvio(formData);
});

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
