'use strict';

/* =========================
   Paso 2: Variables
========================= */

const nombre = 'Pablo';
const apellido = 'Torres';
let edad = 25;
const carrera = 'Computación';
let semestre = 7;
const activo = true;

const materias = ['Web', 'IA', 'Base de Datos'];

const direccion = {
  ciudad: 'Cuenca',
  provincia: 'Azuay'
};

console.table({ nombre, apellido, edad, carrera, semestre, activo, materias, direccion });

/* =========================
   Paso 3: Funciones
========================= */

const calcularPromedio = (notas) =>
  notas.reduce((acc, n) => acc + n, 0) / notas.length;

const esMayorDeEdad = (edad) => edad >= 18;

const formatearNombre = (nombre, apellido) =>
  `${apellido.toUpperCase()}, ${nombre}`;

const generarSaludo = (nombre, hora) => {
  if (hora < 12) return `Buenos días ${nombre}`;
  if (hora < 18) return `Buenas tardes ${nombre}`;
  return `Buenas noches ${nombre}`;
};

/* =========================
   Paso 4: Arrays
========================= */

const estudiantes = [
  { nombre: 'Ana', nota: 85, activo: true },
  { nombre: 'Luis', nota: 42, activo: true },
  { nombre: 'Maria', nota: 93, activo: false },
  { nombre: 'Carlos', nota: 67, activo: true },
  { nombre: 'Sofia', nota: 78, activo: true }
];

const aprobados = estudiantes.filter(e => e.nota >= 70);
const nombres = estudiantes.map(e => e.nombre);
const promedio = estudiantes.reduce((acc, e) => acc + e.nota, 0) / estudiantes.length;
const mejor = estudiantes.reduce((max, e) => e.nota > max.nota ? e : max);
const todosActivos = estudiantes.every(e => e.activo);
const algunoMayor90 = estudiantes.some(e => e.nota > 90);

/* =========================
   Paso 5: Mostrar en HTML
========================= */

document.getElementById('nombre').textContent = `${nombre} ${apellido}`;
document.getElementById('edad').textContent = `Edad: ${edad}`;
document.getElementById('carrera').textContent = `Carrera: ${carrera}`;

document.getElementById('aprobados').textContent = aprobados.map(e => e.nombre).join(', ');
document.getElementById('nombres').textContent = nombres.join(', ');
document.getElementById('promedio').textContent = promedio.toFixed(2);
document.getElementById('mejor').textContent = `${mejor.nombre} (${mejor.nota})`;
document.getElementById('activos').textContent = todosActivos;
document.getElementById('mayor90').textContent = algunoMayor90;

/* =========================
   Pruebas en consola
========================= */

console.log(calcularPromedio([10, 8, 9]));
console.log(esMayorDeEdad(edad));
console.log(formatearNombre(nombre, apellido));
console.log(generarSaludo(nombre, 10));