'use strict';

/**
 * Anunciar mensaje a lectores de pantalla
 * 
 * @param {string} mensaje - Mensaje a anunciar
 * @param {string} priority - 'polite' (default) o 'assertive'
 */
export function anunciar(mensaje, priority = 'polite') {
  const liveRegion = document.querySelector('#aria-live');
  
  if (!liveRegion) {
    console.warn('No se encontró región aria-live');
    return;
  }
  
  // Cambiar prioridad si es necesario
  liveRegion.setAttribute('aria-live', priority);
  
  // Limpiar y setear nuevo mensaje
  liveRegion.textContent = '';
  
  // Timeout para que el screen reader detecte el cambio
  setTimeout(() => {
    liveRegion.textContent = mensaje;
  }, 100);
}

/**
 * Focus trap para modales
 * Mantiene el foco dentro de un contenedor
 * 
 * @param {HTMLElement} container - Contenedor donde atrapar el foco
 * @returns {Function} Función para liberar el trap
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  function handleTab(e) {
    if (e.key !== 'Tab') return;
    
    // Shift + Tab en el primero -> ir al último
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    }
    // Tab en el último -> ir al primero
    else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
  
  container.addEventListener('keydown', handleTab);
  
  // Retornar función para liberar el trap
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
}

/**
 * Abrir modal accesible
 * 
 * @param {HTMLElement} modal - Elemento del modal
 * @param {HTMLElement} trigger - Elemento que disparó el modal (para restaurar foco)
 * @returns {object} Objeto con métodos close y el releaseTrap
 */
export function openAccessibleModal(modal, trigger) {
  // Guardar elemento que tenía foco
  const previouslyFocused = trigger || document.activeElement;
  
  // Mostrar modal
  modal.style.display = 'flex';
  modal.removeAttribute('aria-hidden');
  
  // Configurar trap de foco
  const releaseTrap = trapFocus(modal);
  
  // Mover foco al primer elemento focusable del modal
  const firstFocusable = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (firstFocusable) {
    setTimeout(() => firstFocusable.focus(), 100);
  }
  
  // Función para cerrar
  function close() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    releaseTrap();
    
    // Restaurar foco
    if (previouslyFocused) {
      previouslyFocused.focus();
    }
  }
  
  // Cerrar con Escape
  function handleEscape(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handleEscape);
    }
  }
  
  document.addEventListener('keydown', handleEscape);
  
  return {
    close,
    releaseTrap,
    removeEscapeListener: () => document.removeEventListener('keydown', handleEscape)
  };
}

/**
 * Validar y mostrar errores en formulario de manera accesible
 * 
 * @param {HTMLInputElement} input - Campo de entrada
 * @param {string} errorMessage - Mensaje de error
 * @param {boolean} isValid - Si el campo es válido
 */
export function mostrarErrorAccesible(input, errorMessage, isValid) {
  const errorId = `${input.id}-error`;
  let errorElement = document.getElementById(errorId);
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'error-mensaje';
    errorElement.setAttribute('role', 'alert');
    input.parentElement.appendChild(errorElement);
  }
  
  if (isValid) {
    // Remover error
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    input.classList.remove('input-error');
  } else {
    // Mostrar error
    errorElement.textContent = errorMessage;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
    input.classList.add('input-error');
  }
}

/**
 * Detectar preferencias del usuario
 * 
 * @returns {object} Objeto con las preferencias detectadas
 */
export function detectarPreferencias() {
  return {
    prefiereTemaOscuro: window.matchMedia('(prefers-color-scheme: dark)').matches,
    prefiereMovimientoReducido: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefiereContrasteAlto: window.matchMedia('(prefers-contrast: high)').matches,
    prefiereDatosReducidos: window.matchMedia('(prefers-reduced-data: reduce)').matches
  };
}

/**
 * Configurar navegación con teclado para elementos custom
 * 
 * @param {NodeList|Array} elements - Elementos a configurar
 * @param {string} orientation - 'horizontal' o 'vertical'
 */
export function setupKeyboardNavigation(elements, orientation = 'horizontal') {
  elements.forEach((element, index) => {
    element.setAttribute('tabindex', index === 0 ? '0' : '-1');
    
    element.addEventListener('keydown', (e) => {
      let newIndex = index;
      
      if (orientation === 'horizontal') {
        if (e.key === 'ArrowRight') newIndex = (index + 1) % elements.length;
        if (e.key === 'ArrowLeft') newIndex = (index - 1 + elements.length) % elements.length;
      } else {
        if (e.key === 'ArrowDown') newIndex = (index + 1) % elements.length;
        if (e.key === 'ArrowUp') newIndex = (index - 1 + elements.length) % elements.length;
      }
      
      if (newIndex !== index) {
        e.preventDefault();
        elements[newIndex].focus();
        
        // Actualizar tabindex
        elements.forEach((el, i) => {
          el.setAttribute('tabindex', i === newIndex ? '0' : '-1');
        });
      }
    });
  });
}
