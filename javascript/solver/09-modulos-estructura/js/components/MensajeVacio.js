'use strict';

import { createElement } from '../utils/index.js';

/**
 * Componente MensajeVacio - Mensaje cuando no hay productos
 * @param {string} mensaje - Mensaje a mostrar
 * @returns {HTMLElement} - Elemento del DOM
 */
export function MensajeVacio(mensaje) {
  const container = createElement('div', { className: 'mensaje-vacio' });

  const icon = createElement('div', { className: 'mensaje-vacio__icon' }, '📦');
  const text = createElement('p', {}, mensaje);

  container.appendChild(icon);
  container.appendChild(text);

  return container;
}
