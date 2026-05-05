'use strict';

/**
 * APLICACIÓN PRINCIPAL
 * 
 * Este es el punto de entrada de la aplicación.
 * Importa funciones de otros módulos y coordina la lógica.
 * 
 * CONCEPTOS CLAVE:
 * - import: Importar funciones desde otros módulos
 * - type="module" en el HTML permite usar import/export
 * - Los módulos se ejecutan en modo estricto automáticamente
 * - Cada módulo tiene su propio scope (no contamina el scope global)
 */

// Importar funciones desde módulos
import { UsuarioCard } from './components.js';
import { generarId, validarEmail } from './utils.js';

/* =========================
   ESTADO
========================= */

const usuarios = [];

/* =========================
   ELEMENTOS DEL DOM
========================= */

const form = document.getElementById('form-usuario');
const inputNombre = document.getElementById('nombre');
const inputEmail = document.getElementById('email');
const contenedorResultados = document.getElementById('resultados');

/* =========================
   FUNCIONES
========================= */

/**
 * Agregar usuario
 * @param {string} nombre - Nombre del usuario
 * @param {string} email - Email del usuario
 */
function agregarUsuario(nombre, email) {
  const usuario = {
    id: generarId(),
    nombre,
    email
  };

  usuarios.push(usuario);
  renderizarUsuarios();
}

/**
 * Renderizar lista de usuarios
 */
function renderizarUsuarios() {
  // Limpiar contenedor
  contenedorResultados.innerHTML = '';

  // Crear card para cada usuario usando el componente
  usuarios.forEach(usuario => {
    const card = UsuarioCard(usuario);
    contenedorResultados.appendChild(card);
  });
}

/* =========================
   EVENT LISTENERS
========================= */

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();

  // Validar email
  if (!validarEmail(email)) {
    alert('Por favor ingresa un email válido');
    return;
  }

  // Agregar usuario
  agregarUsuario(nombre, email);

  // Limpiar formulario
  form.reset();
  inputNombre.focus();
});

/* =========================
   INICIALIZACIÓN
========================= */

console.log('Módulos cargados correctamente');
console.log('Usuarios importados:', usuarios);
