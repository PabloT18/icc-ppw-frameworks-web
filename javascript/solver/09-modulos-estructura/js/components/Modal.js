'use strict';

import { CONFIG } from '../config.js';
import { createElement, formatearCategoria, formatearFecha, formatearPrecio } from '../utils/index.js';

/**
 * Componente Modal - Modal de detalle de producto
 * @param {object} producto - Objeto producto
 * @param {Function} onClose - Callback para cerrar
 * @returns {HTMLElement} - Elemento modal del DOM
 */
export function Modal(producto, onClose) {
  const modal = createElement('div', { className: 'modal' });

  const content = createElement('div', { className: 'modal__content' });

  // Header
  const header = createElement('div', { className: 'modal__header' });
  const title = createElement('h2', { className: 'modal__title' }, 'Detalle del Producto');
  const closeBtn = createElement('button', {
    className: 'modal__close',
    onClick: onClose
  }, '×');

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Body
  const body = createElement('div', { className: 'modal__body' });

  const detalles = [
    { label: 'Nombre', valor: producto.nombre },
    { label: 'Categoría', valor: formatearCategoria(producto.categoria) },
    { label: 'Precio', valor: formatearPrecio(producto.precio) },
    { label: 'Stock', valor: producto.stock },
    { label: 'Estado', valor: producto.stock === 0 ? 'Agotado' : producto.stock < CONFIG.MIN_STOCK ? 'Stock Bajo' : 'Disponible' },
    { label: 'Descripción', valor: producto.descripcion || 'Sin descripción' },
    { label: 'Fecha de creación', valor: formatearFecha(producto.createdAt) }
  ];

  detalles.forEach(({ label, valor }) => {
    const item = createElement('div', { style: { marginBottom: '1rem' } });
    const labelEl = createElement('strong', {}, `${label}: `);
    const valorEl = createElement('span', {}, String(valor));
    
    item.appendChild(labelEl);
    item.appendChild(valorEl);
    body.appendChild(item);
  });

  // Footer
  const footer = createElement('div', { className: 'modal__footer' });
  const closeFooterBtn = createElement('button', {
    className: 'btn-secondary',
    onClick: onClose
  }, 'Cerrar');

  footer.appendChild(closeFooterBtn);

  // Ensamblar
  content.appendChild(header);
  content.appendChild(body);
  content.appendChild(footer);
  modal.appendChild(content);

  // Cerrar al hacer click fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      onClose();
    }
  });

  return modal;
}
