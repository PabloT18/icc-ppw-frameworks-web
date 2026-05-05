'use strict';

/**
 * MÓDULO DE COMPONENTES
 * 
 * Este módulo contiene funciones que generan elementos del DOM.
 * 
 * BUENA PRÁCTICA:
 * - Usar createElement en lugar de innerHTML para prevenir XSS
 * - Cada componente retorna un HTMLElement
 * - Los componentes son reutilizables
 */

import { capitalize } from './utils.js';

/**
 * Crear tarjeta de usuario
 * @param {object} usuario - Objeto usuario
 * @returns {HTMLElement} - Elemento card
 */
export function UsuarioCard(usuario) {
  const card = document.createElement('div');
  card.className = 'usuario-card';

  const titulo = document.createElement('h3');
  titulo.textContent = capitalize(usuario.nombre);

  const email = document.createElement('p');
  email.textContent = `correo ${usuario.email}`;

  const id = document.createElement('p');
  id.textContent = `ID: ${usuario.id}`;

  card.appendChild(titulo);
  card.appendChild(email);
  card.appendChild(id);

  return card;
}
