'use strict';

/**
 * Utilidades de DOM
 */

/**
 * Seleccionar un elemento
 * @param {string} selector - Selector CSS
 * @returns {HTMLElement|null} - Elemento encontrado
 */
export function $(selector) {
  return document.querySelector(selector);
}

/**
 * Seleccionar múltiples elementos
 * @param {string} selector - Selector CSS
 * @returns {NodeList} - Lista de elementos
 */
export function $$(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Crear elemento con atributos y contenido
 * @param {string} tag - Tag del elemento
 * @param {object} attrs - Atributos del elemento
 * @param {string|HTMLElement} children - Contenido (texto o elemento)
 * @returns {HTMLElement} - Elemento creado
 */
export function createElement(tag, attrs = {}, children = null) {
  const element = document.createElement(tag);

  // Asignar atributos
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else if (key === 'onClick' || key === 'onChange' || key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else {
      element[key] = value;
    }
  });

  // Agregar children
  if (children) {
    if (typeof children === 'string') {
      element.textContent = children;
    } else if (children instanceof HTMLElement) {
      element.appendChild(children);
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof HTMLElement) {
          element.appendChild(child);
        }
      });
    }
  }

  return element;
}

/**
 * Mostrar elemento
 * @param {HTMLElement} element - Elemento a mostrar
 */
export function show(element) {
  if (element) element.style.display = '';
}

/**
 * Ocultar elemento
 * @param {HTMLElement} element - Elemento a ocultar
 */
export function hide(element) {
  if (element) element.style.display = 'none';
}

/**
 * Alternar visibilidad
 * @param {HTMLElement} element - Elemento
 */
export function toggle(element) {
  if (!element) return;
  element.style.display = element.style.display === 'none' ? '' : 'none';
}

/**
 * Limpiar contenido de un elemento
 * @param {HTMLElement} element - Elemento a limpiar
 */
export function clearElement(element) {
  if (element) {
    element.innerHTML = '';
  }
}

/**
 * Mostrar error en un campo
 * @param {HTMLElement} campo - Campo del formulario
 * @param {string} mensaje - Mensaje de error
 */
export function mostrarError(campo, mensaje) {
  if (!campo) return;
  
  campo.classList.add('campo--error');
  campo.classList.remove('campo--valido');

  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if (errorDiv) {
    errorDiv.textContent = mensaje;
  }
}

/**
 * Limpiar error de un campo
 * @param {HTMLElement} campo - Campo del formulario
 */
export function limpiarError(campo) {
  if (!campo) return;

  campo.classList.remove('campo--error');
  
  if (campo.value.trim()) {
    campo.classList.add('campo--valido');
  } else {
    campo.classList.remove('campo--valido');
  }

  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if (errorDiv) {
    errorDiv.textContent = '';
  }
}
