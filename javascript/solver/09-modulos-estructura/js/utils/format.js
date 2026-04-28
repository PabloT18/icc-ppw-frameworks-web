'use strict';

/**
 * Utilidades de formato
 */

/**
 * Formatear precio en USD
 * @param {number} valor - Valor numérico
 * @returns {string} - Precio formateado
 */
export function formatearPrecio(valor) {
  return `$${Number(valor).toFixed(2)}`;
}

/**
 * Formatear fecha
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
 * Truncar texto
 * @param {string} texto - Texto a truncar
 * @param {number} max - Longitud máxima
 * @returns {string} - Texto truncado
 */
export function truncate(texto, max = 100) {
  if (!texto || texto.length <= max) return texto;
  return texto.slice(0, max) + '...';
}

/**
 * Formatear número con separador de miles
 * @param {number} numero - Número a formatear
 * @returns {string} - Número formateado
 */
export function formatearNumero(numero) {
  return Number(numero).toLocaleString('es-EC');
}

/**
 * Obtener nombre de categoría
 * @param {string} categoria - Categoría
 * @returns {string} - Nombre formateado
 */
export function formatearCategoria(categoria) {
  const categorias = {
    electronica: 'Electrónica',
    ropa: 'Ropa',
    alimentos: 'Alimentos',
    hogar: 'Hogar',
    deportes: 'Deportes'
  };
  return categorias[categoria] || capitalize(categoria);
}
