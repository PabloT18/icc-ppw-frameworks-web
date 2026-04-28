'use strict';

import { createElement } from '../utils/index.js';

/**
 * Componente StatCard - Tarjeta de estadística
 * @param {string} label - Etiqueta de la estadística
 * @param {string|number} value - Valor
 * @param {string} variant - Variante de color (primary, success, warning, danger)
 * @returns {HTMLElement} - Elemento card del DOM
 */
export function StatCard(label, value, variant = 'primary') {
  const card = createElement('div', {
    className: `stat-card ${variant !== 'primary' ? `stat-card--${variant}` : ''}`
  });

  const valueDiv = createElement('div', { className: 'stat-value' }, String(value));
  const labelDiv = createElement('div', { className: 'stat-label' }, label);

  card.appendChild(valueDiv);
  card.appendChild(labelDiv);

  return card;
}
