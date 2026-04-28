'use strict';

/* =========================
   1. CONFIGURACIÓN Y SELECTORES
========================= */

// Clave bajo la cual se guardarán las tareas en localStorage
const CLAVE_STORAGE = 'tareas_lista_minima';

// Elementos del DOM
const input = document.querySelector('#input-tarea');
const btnAgregar = document.querySelector('#btn-agregar');
const lista = document.querySelector('#lista-tareas');
const btnLimpiar = document.querySelector('#btn-limpiar');

// Estado en memoria
let tareas = [];


/* =========================
   2. FUNCIONES DE STORAGE
========================= */

// Cargar tareas desde localStorage
function cargarDelStorage() {
  const datos = localStorage.getItem(CLAVE_STORAGE);
  // Si existen datos, parsearlos; si no, retornar array vacío
  return datos ? JSON.parse(datos) : [];
}

// Guardar tareas en localStorage
function guardarEnStorage() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
}


/* =========================
   3. FUNCIONES DE LÓGICA
========================= */

// Agregar nueva tarea
function agregarTarea(texto) {
  if (!texto.trim()) return;

  // Crear objeto tarea con ID único
  const nuevaTarea = {
    id: Date.now(),
    texto: texto.trim(),
    completada: false
  };

  tareas.push(nuevaTarea);
  guardarEnStorage();
  renderizar();
  input.value = '';
  input.focus();
}

// Eliminar tarea por ID
function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  guardarEnStorage();
  renderizar();
}

// Togglear estado completado
function toggleTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    guardarEnStorage();
    renderizar();
  }
}

// Limpiar todas las tareas
function limpiarTodo() {
  if (tareas.length === 0) return;
  if (confirm('¿Estás seguro de que quieres eliminar TODAS las tareas?')) {
    tareas = [];
    guardarEnStorage();
    renderizar();
  }
}


/* =========================
   4. RENDERIZADO CON DOM API
========================= */

function renderizar() {
  // Limpiar lista actual
  lista.innerHTML = '';

  // Si no hay tareas, mostrar mensaje
  if (tareas.length === 0) {
    const vacio = document.createElement('p');
    vacio.className = 'vacio';
    vacio.textContent = 'No hay tareas. ¡Agrega una!';
    lista.appendChild(vacio);
    btnLimpiar.disabled = true;
    return;
  }

  btnLimpiar.disabled = false;

  // Crear elemento para cada tarea
  tareas.forEach(tarea => {
    const item = document.createElement('div');
    item.className = 'item-tarea';
    if (tarea.completada) {
      item.classList.add('completada');
    }

    // Texto clickeable para marcar como completada
    const texto = document.createElement('span');
    texto.className = 'texto-tarea';
    texto.textContent = tarea.texto;
    texto.addEventListener('click', () => toggleTarea(tarea.id));

    // Botón eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

    item.appendChild(texto);
    item.appendChild(btnEliminar);
    lista.appendChild(item);
  });
}


/* =========================
   5. EVENT LISTENERS
========================= */

btnAgregar.addEventListener('click', () => {
  agregarTarea(input.value);
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    agregarTarea(input.value);
  }
});

btnLimpiar.addEventListener('click', limpiarTodo);


/* =========================
   6. INICIALIZACIÓN
========================= */

// Cargar tareas guardadas al abrir la página
tareas = cargarDelStorage();
renderizar();
input.focus();
