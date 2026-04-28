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

    // Validaciones específicas por nombre de campo
    if (valor) {
      switch (nombre) {
        case 'nombre':
          if (valor.length < 3) {
            error = 'El nombre debe tener al menos 3 caracteres';
          } else if (valor.length > 50) {
            error = 'El nombre no puede superar 50 caracteres';
          } else if (!REGEX.soloLetras.test(valor)) {
            error = 'El nombre solo puede contener letras y espacios';
          }
          break;

        case 'email':
          if (!REGEX.email.test(valor)) {
            error = 'Formato de email inválido';
          }
          break;

        case 'telefono':
          if (!REGEX.telefono.test(valor.replace(/\D/g, ''))) {
            error = 'El teléfono debe tener exactamente 10 dígitos';
          }
          break;

        case 'fecha_nacimiento':
          const fechaNac = new Date(valor);
          const hoy = new Date();
          const edad = hoy.getFullYear() - fechaNac.getFullYear();
          const mesActual = hoy.getMonth() - fechaNac.getMonth();
          
          let edadReal = edad;
          if (mesActual < 0 || (mesActual === 0 && hoy.getDate() < fechaNac.getDate())) {
            edadReal--;
          }

          if (edadReal < 18) {
            error = 'Debes ser mayor de 18 años';
          } else if (edadReal > 120) {
            error = 'Fecha de nacimiento inválida';
          }
          break;

        case 'genero':
          if (!valor || valor === '') {
            error = 'Debes seleccionar un género';
          }
          break;

        case 'password':
          if (valor.length < 8) {
            error = 'La contraseña debe tener al menos 8 caracteres';
          } else if (!/[A-Z]/.test(valor)) {
            error = 'Debe tener al menos una letra mayúscula';
          } else if (!/[a-z]/.test(valor)) {
            error = 'Debe tener al menos una letra minúscula';
          } else if (!/[0-9]/.test(valor)) {
            error = 'Debe tener al menos un número';
          }
          break;

        case 'confirmar_password':
          const password = document.querySelector('[name="password"]').value;
          if (valor !== password) {
            error = 'Las contraseñas no coinciden';
          }
          break;
      }
    }

    return {
      valido: error === '',
      error
    };
  },

  /**
   * Validar todos los campos del formulario
   * @param {HTMLFormElement} form - El formulario a validar
   * @returns {boolean} - true si todos los campos son válidos
   */
  validarFormulario(form) {
    const campos = form.querySelectorAll('input, select, textarea');
    let todosValidos = true;

    campos.forEach(campo => {
      const resultado = this.validarCampo(campo);
      
      if (!resultado.valido) {
        mostrarError(campo, resultado.error);
        todosValidos = false;
      } else {
        limpiarError(campo);
      }
    });

    return todosValidos;
  },

  /**
   * Evaluar la fuerza de una contraseña
   * @param {string} password - La contraseña a evaluar
   * @returns {object} - { nivel: string, clase: string, valor: number }
   */
  evaluarFuerzaPassword(password) {
    let fuerza = 0;

    if (password.length >= 8) fuerza++;
    if (password.length >= 12) fuerza++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
    if (/\d/.test(password)) fuerza++;
    if (/[^a-zA-Z0-9]/.test(password)) fuerza++;

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
