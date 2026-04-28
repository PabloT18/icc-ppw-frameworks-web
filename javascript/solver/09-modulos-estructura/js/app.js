'use strict';

/* =========================
   IMPORTS
========================= */

import { MensajeVacio, Modal, ProductCard, StatCard } from './components/index.js';
import { CONFIG, MENSAJES } from './config.js';
import StorageService from './services/storage.js';
import {
    $,
    clearElement,
    hide,
    limpiarError,
    mostrarError,
    show,
    validarProducto
} from './utils/index.js';

/* =========================
   ESTADO DE LA APLICACIÓN
========================= */

let productos = [];
let productoEditando = null;
let filtros = {
  busqueda: '',
  categoria: '',
  stock: ''
};
let ordenamiento = 'nombre';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */

const formProducto = $('#form-producto');
const inputNombre = $('#nombre');
const inputCategoria = $('#categoria');
const inputPrecio = $('#precio');
const inputStock = $('#stock');
const inputDescripcion = $('#descripcion');
const btnCancelar = $('#btn-cancelar');

const inputSearch = $('#search');
const filterCategoria = $('#filter-categoria');
const filterStock = $('#filter-stock');
const sortBy = $('#sort-by');

const statsContainer = $('#stats-container');
const productsContainer = $('#products-container');
const modalDetalle = $('#modal-detalle');

/* =========================
   FUNCIONES DE DATOS
========================= */

/**
 * Cargar productos desde localStorage
 */
function cargarProductos() {
  productos = StorageService.getAll(CONFIG.STORAGE_KEY);
  renderizarTodo();
}

/**
 * Guardar producto (nuevo o editar)
 * @param {object} data - Datos del producto
 */
function guardarProducto(data) {
  if (productoEditando) {
    StorageService.update(CONFIG.STORAGE_KEY, productoEditando.id, data);
    productoEditando = null;
  } else {
    StorageService.save(CONFIG.STORAGE_KEY, data);
  }
  
  cargarProductos();
  limpiarFormulario();
}

/**
 * Eliminar producto
 * @param {number} id - ID del producto
 */
function eliminarProducto(id) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    StorageService.delete(CONFIG.STORAGE_KEY, id);
    cargarProductos();
  }
}

/**
 * Preparar formulario para editar
 * @param {object} producto - Producto a editar
 */
function editarProducto(producto) {
  productoEditando = producto;
  
  inputNombre.value = producto.nombre;
  inputCategoria.value = producto.categoria;
  inputPrecio.value = producto.precio;
  inputStock.value = producto.stock;
  inputDescripcion.value = producto.descripcion || '';

  formProducto.scrollIntoView({ behavior: 'smooth', block: 'start' });
  inputNombre.focus();
}

/**
 * Mostrar detalle de producto en modal
 * @param {object} producto - Producto a mostrar
 */
function verDetalleProducto(producto) {
  clearElement(modalDetalle);
  const modal = Modal(producto, cerrarModal);
  modalDetalle.appendChild(modal);
  show(modalDetalle);
}

/**
 * Cerrar modal de detalle
 */
function cerrarModal() {
  hide(modalDetalle);
  clearElement(modalDetalle);
}

/**
 * Limpiar formulario
 */
function limpiarFormulario() {
  formProducto.reset();
  productoEditando = null;
  
  // Limpiar validaciones visuales
  [inputNombre, inputCategoria, inputPrecio, inputStock].forEach(campo => {
    campo.classList.remove('campo--error', 'campo--valido');
    limpiarError(campo);
  });

  inputNombre.focus();
}

/* =========================
   FUNCIONES DE FILTRADO Y ORDENAMIENTO
========================= */

/**
 * Aplicar filtros a productos
 * @returns {Array} - Productos filtrados
 */
function aplicarFiltros() {
  let productosFiltrados = [...productos];

  // Filtro de búsqueda
  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase();
    productosFiltrados = productosFiltrados.filter(p => 
      p.nombre.toLowerCase().includes(termino) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(termino))
    );
  }

  // Filtro de categoría
  if (filtros.categoria) {
    productosFiltrados = productosFiltrados.filter(p => p.categoria === filtros.categoria);
  }

  // Filtro de stock
  if (filtros.stock === 'disponible') {
    productosFiltrados = productosFiltrados.filter(p => p.stock > 0);
  } else if (filtros.stock === 'bajo') {
    productosFiltrados = productosFiltrados.filter(p => p.stock > 0 && p.stock < CONFIG.MIN_STOCK);
  } else if (filtros.stock === 'agotado') {
    productosFiltrados = productosFiltrados.filter(p => p.stock === 0);
  }

  return productosFiltrados;
}

/**
 * Ordenar productos
 * @param {Array} productos - Productos a ordenar
 * @returns {Array} - Productos ordenados
 */
function ordenarProductos(productos) {
  const copia = [...productos];

  switch (ordenamiento) {
    case 'nombre':
      return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
    case 'precio':
      return copia.sort((a, b) => b.precio - a.precio);
    case 'stock':
      return copia.sort((a, b) => b.stock - a.stock);
    case 'fecha':
      return copia.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    default:
      return copia;
  }
}

/* =========================
   FUNCIONES DE RENDERIZADO
========================= */

/**
 * Renderizar estadísticas
 */
function renderizarEstadisticas() {
  clearElement(statsContainer);

  const total = productos.length;
  const disponibles = productos.filter(p => p.stock > 0).length;
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock < CONFIG.MIN_STOCK).length;
  const agotados = productos.filter(p => p.stock === 0).length;

  const stats = [
    StatCard('Total Productos', total, 'primary'),
    StatCard('Disponibles', disponibles, 'success'),
    StatCard('Stock Bajo', stockBajo, 'warning'),
    StatCard('Agotados', agotados, 'danger')
  ];

  stats.forEach(stat => statsContainer.appendChild(stat));
}

/**
 * Renderizar lista de productos
 */
function renderizarProductos() {
  clearElement(productsContainer);

  const productosFiltrados = aplicarFiltros();
  const productosOrdenados = ordenarProductos(productosFiltrados);

  if (productosOrdenados.length === 0) {
    const mensaje = productos.length === 0 ? MENSAJES.SIN_PRODUCTOS : MENSAJES.SIN_RESULTADOS;
    const mensajeVacio = MensajeVacio(mensaje);
    productsContainer.appendChild(mensajeVacio);
    return;
  }

  productosOrdenados.forEach(producto => {
    const card = ProductCard(
      producto,
      editarProducto,
      () => eliminarProducto(producto.id),
      verDetalleProducto
    );
    productsContainer.appendChild(card);
  });
}

/**
 * Renderizar todo (estadísticas + productos)
 */
function renderizarTodo() {
  renderizarEstadisticas();
  renderizarProductos();
}

/* =========================
   EVENT LISTENERS
========================= */

/**
 * Submit del formulario
 */
formProducto.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    precio: parseFloat(inputPrecio.value),
    stock: parseInt(inputStock.value, 10),
    descripcion: inputDescripcion.value.trim()
  };

  const validacion = validarProducto(data);

  if (!validacion.valido) {
    // Mostrar errores
    Object.entries(validacion.errores).forEach(([campo, error]) => {
      const input = $(`#${campo}`);
      if (input) {
        mostrarError(input, error);
      }
    });

    // Scroll al primer error
    const primerError = $('.campo--error');
    if (primerError) {
      primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      primerError.focus();
    }

    return;
  }

  // Guardar producto
  guardarProducto(data);
});

/**
 * Limpiar errores al escribir
 */
[inputNombre, inputCategoria, inputPrecio, inputStock].forEach(campo => {
  campo.addEventListener('input', () => {
    limpiarError(campo);
  });
});

/**
 * Cancelar edición
 */
btnCancelar.addEventListener('click', () => {
  limpiarFormulario();
});

/**
 * Búsqueda en tiempo real (con debounce)
 */
let searchTimeout;
inputSearch.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filtros.busqueda = e.target.value.trim();
    renderizarProductos();
  }, CONFIG.DEBOUNCE_MS);
});

/**
 * Filtro de categoría
 */
filterCategoria.addEventListener('change', (e) => {
  filtros.categoria = e.target.value;
  renderizarProductos();
});

/**
 * Filtro de stock
 */
filterStock.addEventListener('change', (e) => {
  filtros.stock = e.target.value;
  renderizarProductos();
});

/**
 * Ordenamiento
 */
sortBy.addEventListener('change', (e) => {
  ordenamiento = e.target.value;
  renderizarProductos();
});

/* =========================
   INICIALIZACIÓN
========================= */

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  inputNombre.focus();
});
