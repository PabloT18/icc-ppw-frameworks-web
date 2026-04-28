'use strict';

/**
 * Servicio de almacenamiento genérico usando localStorage
 */

const StorageService = {
  /**
   * Obtener todos los items de una clave
   * @param {string} key - Clave de almacenamiento
   * @returns {Array} - Array de items
   */
  getAll(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return [];
    }
  },

  /**
   * Obtener un item por ID
   * @param {string} key - Clave de almacenamiento
   * @param {number} id - ID del item
   * @returns {object|null} - Item encontrado o null
   */
  getById(key, id) {
    const items = this.getAll(key);
    return items.find(item => item.id === id) || null;
  },

  /**
   * Guardar un nuevo item
   * @param {string} key - Clave de almacenamiento
   * @param {object} data - Datos del item (sin ID)
   * @returns {object} - Item guardado con ID
   */
  save(key, data) {
    const items = this.getAll(key);
    const newItem = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    this._setAll(key, items);
    return newItem;
  },

  /**
   * Actualizar un item existente
   * @param {string} key - Clave de almacenamiento
   * @param {number} id - ID del item
   * @param {object} data - Datos actualizados
   * @returns {object|null} - Item actualizado o null
   */
  update(key, id, data) {
    const items = this.getAll(key);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this._setAll(key, items);
    return items[index];
  },

  /**
   * Eliminar un item
   * @param {string} key - Clave de almacenamiento
   * @param {number} id - ID del item
   * @returns {boolean} - true si se eliminó
   */
  delete(key, id) {
    const items = this.getAll(key);
    const filtered = items.filter(item => item.id !== id);
    
    if (filtered.length === items.length) return false;

    this._setAll(key, filtered);
    return true;
  },

  /**
   * Limpiar todos los items de una clave
   * @param {string} key - Clave de almacenamiento
   */
  clear(key) {
    localStorage.removeItem(key);
  },

  /**
   * Guardar todos los items (privado)
   * @param {string} key - Clave de almacenamiento
   * @param {Array} items - Array de items
   */
  _setAll(key, items) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }
};

export default StorageService;
