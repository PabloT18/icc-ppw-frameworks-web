'use strict';

/**
 * MÓDULO DE UTILIDADES
 * 
 * Este módulo contiene funciones de ayuda que pueden ser reutilizadas
 * en diferentes partes de la aplicación.
 * 
 * CONCEPTOS:
 * - export: Exporta funciones para que puedan ser importadas en otros módulos
 * - Cada función exportada puede ser importada individualmente
 */

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Capitalizar texto
 * @param {string} texto - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
export function capitalize(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/**
 * Generar ID único
 * @returns {number} - Timestamp único
 */
export function generarId() {
  return Date.now();
}
