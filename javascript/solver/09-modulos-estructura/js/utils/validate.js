'use strict';

/**
 * Utilidades de validación
 */

/**
 * Validar que un campo no esté vacío
 * @param {string} valor - Valor a validar
 * @returns {boolean} - true si es válido
 */
export function validarRequerido(valor) {
  return valor !== null && valor !== undefined && String(valor).trim() !== '';
}

/**
 * Validar longitud mínima
 * @param {string} valor - Valor a validar
 * @param {number} min - Longitud mínima
 * @returns {boolean} - true si es válido
 */
export function validarLongitudMinima(valor, min) {
  return String(valor).length >= min;
}

/**
 * Validar número positivo
 * @param {number} valor - Valor a validar
 * @returns {boolean} - true si es válido
 */
export function validarNumeroPositivo(valor) {
  const num = Number(valor);
  return !isNaN(num) && num >= 0;
}

/**
 * Validar precio
 * @param {number} precio - Precio a validar
 * @returns {object} - { valido: boolean, error: string }
 */
export function validarPrecio(precio) {
  if (!validarRequerido(precio)) {
    return { valido: false, error: 'El precio es obligatorio' };
  }

  if (!validarNumeroPositivo(precio)) {
    return { valido: false, error: 'El precio debe ser un número positivo' };
  }

  const num = Number(precio);
  if (num === 0) {
    return { valido: false, error: 'El precio debe ser mayor a 0' };
  }

  return { valido: true, error: '' };
}

/**
 * Validar stock
 * @param {number} stock - Stock a validar
 * @returns {object} - { valido: boolean, error: string }
 */
export function validarStock(stock) {
  if (!validarRequerido(stock)) {
    return { valido: false, error: 'El stock es obligatorio' };
  }

  if (!validarNumeroPositivo(stock)) {
    return { valido: false, error: 'El stock debe ser un número positivo o cero' };
  }

  return { valido: true, error: '' };
}

/**
 * Validar nombre de producto
 * @param {string} nombre - Nombre a validar
 * @returns {object} - { valido: boolean, error: string }
 */
export function validarNombre(nombre) {
  if (!validarRequerido(nombre)) {
    return { valido: false, error: 'El nombre es obligatorio' };
  }

  if (!validarLongitudMinima(nombre, 3)) {
    return { valido: false, error: 'El nombre debe tener al menos 3 caracteres' };
  }

  if (nombre.length > 50) {
    return { valido: false, error: 'El nombre no puede superar 50 caracteres' };
  }

  return { valido: true, error: '' };
}

/**
 * Validar categoría
 * @param {string} categoria - Categoría a validar
 * @returns {object} - { valido: boolean, error: string }
 */
export function validarCategoria(categoria) {
  if (!validarRequerido(categoria)) {
    return { valido: false, error: 'La categoría es obligatoria' };
  }

  const categoriasValidas = ['electronica', 'ropa', 'alimentos', 'hogar', 'deportes'];
  if (!categoriasValidas.includes(categoria)) {
    return { valido: false, error: 'Categoría no válida' };
  }

  return { valido: true, error: '' };
}

/**
 * Validar producto completo
 * @param {object} producto - Objeto producto
 * @returns {object} - { valido: boolean, errores: object }
 */
export function validarProducto(producto) {
  const errores = {};

  const validacionNombre = validarNombre(producto.nombre);
  if (!validacionNombre.valido) {
    errores.nombre = validacionNombre.error;
  }

  const validacionCategoria = validarCategoria(producto.categoria);
  if (!validacionCategoria.valido) {
    errores.categoria = validacionCategoria.error;
  }

  const validacionPrecio = validarPrecio(producto.precio);
  if (!validacionPrecio.valido) {
    errores.precio = validacionPrecio.error;
  }

  const validacionStock = validarStock(producto.stock);
  if (!validacionStock.valido) {
    errores.stock = validacionStock.error;
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
}
