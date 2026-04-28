'use strict';

import { CONFIG } from '../config.js';
import { createElement, formatearCategoria, formatearPrecio, truncate } from '../utils/index.js';

/**
 * Componente ProductCard - Tarjeta de producto
 * @param {object} producto - Objeto producto
 * @param {Function} onEdit - Callback para editar
 * @param {Function} onDelete - Callback para eliminar
 * @param {Function} onView - Callback para ver detalle
 * @returns {HTMLElement} - Elemento card del DOM
 */
export function ProductCard(producto, onEdit, onDelete, onView) {
  const card = createElement('div', { className: 'product-card' });

  // Header
  const header = createElement('div', { className: 'product-card__header' });
  
  const title = createElement('h3', { className: 'product-card__title' }, producto.nombre);
  const category = createElement('span', { className: 'product-card__category' }, formatearCategoria(producto.categoria));
  
  header.appendChild(title);
  header.appendChild(category);

  // Body
  const body = createElement('div', { className: 'product-card__body' });

  // Descripción
  if (producto.descripcion) {
    const desc = createElement('p', { className: 'product-card__description' }, truncate(producto.descripcion, 80));
    body.appendChild(desc);
  }

  // Info (Precio y Stock)
  const info = createElement('div', { className: 'product-card__info' });

  const priceDiv = createElement('div', { className: 'product-card__price' });
  const priceLabel = createElement('div', { className: 'product-card__price-label' }, 'Precio');
  const priceValue = createElement('div', { className: 'product-card__price-value' }, formatearPrecio(producto.precio));
  priceDiv.appendChild(priceLabel);
  priceDiv.appendChild(priceValue);

  const stockDiv = createElement('div', { className: 'product-card__stock' });
  const stockLabel = createElement('div', { className: 'product-card__stock-label' }, 'Stock');
  const stockValue = createElement('div', { 
    className: `product-card__stock-value ${producto.stock === 0 ? 'stock--agotado' : producto.stock < CONFIG.MIN_STOCK ? 'stock--bajo' : ''}`
  }, producto.stock);
  
  stockDiv.appendChild(stockLabel);
  stockDiv.appendChild(stockValue);

  // Badge de estado de stock
  const badge = createElement('span', {
    className: `product-card__badge ${producto.stock === 0 ? 'badge--agotado' : producto.stock < CONFIG.MIN_STOCK ? 'badge--bajo' : 'badge--disponible'}`
  }, producto.stock === 0 ? 'Agotado' : producto.stock < CONFIG.MIN_STOCK ? 'Stock Bajo' : 'Disponible');
  
  stockDiv.appendChild(badge);

  info.appendChild(priceDiv);
  info.appendChild(stockDiv);

  // Actions
  const actions = createElement('div', { className: 'product-card__actions' });

  const btnView = createElement('button', { 
    className: 'btn-info',
    onClick: () => onView(producto)
  }, 'Ver');

  const btnEdit = createElement('button', { 
    className: 'btn-primary',
    onClick: () => onEdit(producto)
  }, 'Editar');

  const btnDelete = createElement('button', { 
    className: 'btn-danger',
    onClick: () => onDelete(producto)
  }, 'Eliminar');

  actions.appendChild(btnView);
  actions.appendChild(btnEdit);
  actions.appendChild(btnDelete);

  // Ensamblar
  body.appendChild(info);
  body.appendChild(actions);

  card.appendChild(header);
  card.appendChild(body);

  return card;
}
