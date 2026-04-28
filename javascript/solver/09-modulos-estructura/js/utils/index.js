'use strict';

/**
 * Barrel file - Re-exports de todas las utilidades
 * Permite importar desde un solo lugar: import { capitalize, validarPrecio, $ } from './utils/index.js'
 */

// Re-export de format.js
export {
    capitalize, formatearCategoria, formatearFecha, formatearNumero, formatearPrecio, truncate
} from './format.js';

// Re-export de validate.js
export {
    validarCategoria, validarLongitudMinima, validarNombre, validarNumeroPositivo,
    validarPrecio, validarProducto, validarRequerido, validarStock
} from './validate.js';

// Re-export de dom.js
export {
    $,
    $$, clearElement, createElement, hide, limpiarError, mostrarError, show, toggle
} from './dom.js';

