'use strict';

/**
 * Configuración global de la aplicación
 */

export const CONFIG = {
  STORAGE_KEY: 'productos',
  MIN_STOCK: 10,
  DEBOUNCE_MS: 300,
  CATEGORIAS: {
    electronica: 'Electrónica',
    ropa: 'Ropa',
    alimentos: 'Alimentos',
    hogar: 'Hogar',
    deportes: 'Deportes'
  }
};

export const MENSAJES = {
  PRODUCTO_GUARDADO: 'Producto guardado exitosamente',
  PRODUCTO_ELIMINADO: 'Producto eliminado correctamente',
  PRODUCTO_ACTUALIZADO: 'Producto actualizado correctamente',
  SIN_PRODUCTOS: 'No hay productos registrados',
  SIN_RESULTADOS: 'No se encontraron productos con los filtros aplicados'
};
