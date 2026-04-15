# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 1: Introduccion y Sintaxis de JavaScript

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

JavaScript es el lenguaje de programacion del navegador. Junto con HTML (estructura) y CSS (presentacion), forma la triada fundamental del desarrollo web front-end. A diferencia de HTML y CSS, JavaScript permite crear comportamiento dinamico: responder a acciones del usuario, manipular contenido, comunicarse con servidores y construir aplicaciones interactivas completas.

### Por que JavaScript?

| Aspecto | HTML/CSS solamente | Con JavaScript |
|---------|-------------------|----------------|
| **Contenido** | Estatico | Dinamico, se actualiza sin recargar |
| **Interaccion** | Enlaces y formularios basicos | Cualquier tipo de interaccion |
| **Validacion** | Solo atributos HTML5 | Logica personalizada completa |
| **Datos** | No se procesan | Se procesan, transforman y envian |
| **Experiencia** | Paginas simples | Aplicaciones web completas |

### Donde se ejecuta JavaScript?

```html
<!-- Opcion 1: Script interno (dentro del HTML) -->
<script>
  console.log('Hola desde script interno');
</script>

<!-- Opcion 2: Script externo (archivo separado) - RECOMENDADO -->
<script src="app.js"></script>

<!-- Opcion 3: Script externo al final del body - MEJOR PRACTICA -->
<body>
  <h1>Mi pagina</h1>
  <script src="app.js"></script>
</body>
```

**Regla importante:** Siempre colocar la etiqueta `<script>` al final del `<body>` o usar el atributo `defer` para que el HTML se cargue primero.

```html
<!-- Alternativa con defer -->
<head>
  <script src="app.js" defer></script>
</head>
```

1. El navegador sigue cargando el HTML
2. Descarga el JS en paralelo
3. Espera a que el HTML esté completamente parseado
4. Ejecuta el JS

Esto garantiza que:
```javascript
document.querySelector('#elemento')
```

sí funcione, porque el DOM ya existe.

---

## 2. Conceptos Clave

### Variables: let, const y var

| Declaracion | Reasignable | Scope | Hoisting | Uso recomendado |
|-------------|-------------|-------|----------|-----------------|
| `const` | No | Bloque | No accesible | Para valores que no cambian. **Usar por defecto** |
| `let` | Si | Bloque | No accesible | Cuando el valor necesita cambiar |
| `var` | Si | Funcion | Si (undefined) | **Evitar.** Legacy, causa errores sutiles |

```javascript
// const: valor fijo
const PI = 3.14159;
const nombre = 'Juan';
const colores = ['rojo', 'azul']; // El array puede mutar, la referencia no

// let: valor variable
let contador = 0;
let edad = 25;
edad = 26; // OK

// var: evitar en codigo moderno
var mensaje = 'hola'; // scope de funcion, no de bloque
```

### Tipos de datos

JavaScript tiene 8 tipos de datos:

**Primitivos (inmutables):**

| Tipo | Ejemplo | typeof |
|------|---------|--------|
| `string` | `'Hola'`, `"Mundo"`, `` `template` `` | `"string"` |
| `number` | `42`, `3.14`, `NaN`, `Infinity` | `"number"` |
| `boolean` | `true`, `false` | `"boolean"` |
| `undefined` | `undefined` | `"undefined"` |
| `null` | `null` | `"object"` (bug historico) |
| `bigint` | `9007199254740991n` | `"bigint"` |
| `symbol` | `Symbol('id')` | `"symbol"` |

**No primitivo (mutable):**

| Tipo | Ejemplo | typeof |
|------|---------|--------|
| `object` | `{}`, `[]`, `new Date()` | `"object"` |

```javascript
// Verificar tipos
const texto = 'Pablo';
const numero = 42;
const activo = true;
const vacio = null;
const sinDefinir = undefined;

console.log(typeof texto);      // "string"
console.log(typeof numero);     // "number"
console.log(typeof activo);     // "boolean"
console.log(typeof vacio);      // "object" (bug historico)
console.log(typeof sinDefinir); // "undefined"

// Arrays y objetos
const frutas = ['manzana', 'pera', 'uva'];
const persona = { nombre: 'Ana', edad: 30 };

console.log(Array.isArray(frutas)); // true
console.log(typeof persona);       // "object"
```

### Operadores

```javascript
// Aritmeticos
const suma = 10 + 5;       // 15
const resta = 10 - 5;      // 5
const multi = 10 * 5;      // 50
const division = 10 / 3;   // 3.333...
const modulo = 10 % 3;     // 1
const potencia = 2 ** 3;   // 8

// Comparacion (usar siempre === y !==)
console.log(5 === '5');   // false (compara valor Y tipo)
console.log(5 == '5');    // true  (solo valor, EVITAR)
console.log(5 !== '5');   // true
console.log(5 != '5');    // false (EVITAR)

// Logicos
const a = true;
const b = false;
console.log(a && b);  // false (AND)
console.log(a || b);  // true  (OR)
console.log(!a);       // false (NOT)

// Asignacion compuesta
let x = 10;
x += 5;  // x = 15
x -= 3;  // x = 12
x *= 2;  // x = 24
x /= 4;  // x = 6
```

---

## 3. Explicacion Tecnica Detallada

### Estructuras de control de flujo

#### Condicionales

```javascript
// if / else if / else
const nota = 85;

if (nota >= 90) {
  console.log('Sobresaliente');
} else if (nota >= 70) {
  console.log('Aprobado');
} else {
  console.log('Reprobado');
}

// Operador ternario
const estado = nota >= 70 ? 'Aprobado' : 'Reprobado';

// switch
const dia = 'lunes';

switch (dia) {
  case 'lunes':
  case 'martes':
  case 'miercoles':
  case 'jueves':
  case 'viernes':
    console.log('Dia laborable');
    break;
  case 'sabado':
  case 'domingo':
    console.log('Fin de semana');
    break;
  default:
    console.log('Dia no valido');
}
```

#### Bucles

```javascript
// for clasico
for (let i = 0; i < 5; i++) {
  console.log(`Iteracion ${i}`);
}

// for...of (para arrays y strings)
const nombres = ['Ana', 'Luis', 'Maria'];
for (const nombre of nombres) {
  console.log(nombre);
}

// for...in (para propiedades de objetos)
const usuario = { nombre: 'Pedro', edad: 25, ciudad: 'Cuenca' };
for (const clave in usuario) {
  console.log(`${clave}: ${usuario[clave]}`);
}

// while
let contador = 0;
while (contador < 3) {
  console.log(contador);
  contador++;
}

// do...while (se ejecuta al menos una vez)
let num = 0;
do {
  console.log(num);
  num++;
} while (num < 3);
```

### Funciones

JavaScript ofrece varias formas de declarar funciones:

```javascript
// 1. Declaracion de funcion (function declaration)
function sumar(a, b) {
  return a + b;
}

// 2. Expresion de funcion (function expression)
const restar = function(a, b) {
  return a - b;
};

// 3. Arrow function (funcion flecha) - MODERNA
const multiplicar = (a, b) => {
  return a * b;
};

// Arrow function con retorno implicito (una sola expresion)
const dividir = (a, b) => a / b;

// Arrow function con un solo parametro (sin parentesis)
const doble = n => n * 2;
```

**Comparacion entre tipos de funciones:**

| Caracteristica | Declaration | Expression | Arrow |
|----------------|-------------|------------|-------|
| **Hoisting** | Si | No | No |
| **this** | Dinamico | Dinamico | Hereda del padre |
| **Nombre** | Obligatorio | Opcional | No tiene |
| **Uso comun** | Funciones globales | Callbacks | Callbacks, metodos cortos |

### Parametros avanzados

```javascript
// Valores por defecto
function saludar(nombre = 'Mundo') {
  return `Hola, ${nombre}!`;
}
console.log(saludar());       // "Hola, Mundo!"
console.log(saludar('Ana'));  // "Hola, Ana!"

// Rest parameters
function sumarTodos(...numeros) {
  return numeros.reduce((total, n) => total + n, 0);
}
console.log(sumarTodos(1, 2, 3, 4)); // 10

// Destructuring en parametros
function mostrarUsuario({ nombre, edad }) {
  console.log(`${nombre} tiene ${edad} anos`);
}
mostrarUsuario({ nombre: 'Luis', edad: 22 });
```

### Scope (ambito)

```javascript
// Scope global
const global = 'Soy global';

function ejemplo() {
  // Scope de funcion
  const local = 'Soy local';
  console.log(global); // accesible
  console.log(local);  // accesible

  if (true) {
    // Scope de bloque
    const bloque = 'Soy de bloque';
    let otraVariable = 'Tambien de bloque';
    console.log(bloque); // accesible
  }
  // console.log(bloque); // ERROR: no accesible fuera del bloque
}
// console.log(local); // ERROR: no accesible fuera de la funcion
```

### Template Literals

```javascript
const nombre = 'Ana';
const edad = 25;

// Concatenacion clasica (evitar)
const msg1 = 'Hola, ' + nombre + '. Tienes ' + edad + ' anos.';

// Template literal (usar siempre)
const msg2 = `Hola, ${nombre}. Tienes ${edad} anos.`;

// Multilinea
const html = `
  <div class="card">
    <h2>${nombre}</h2>
    <p>Edad: ${edad}</p>
  </div>
`;

// Expresiones dentro de template literals
const precio = 50;
const impuesto = 0.12;
const total = `Total: $${(precio * (1 + impuesto)).toFixed(2)}`;
```

### Arrays: metodos esenciales

```javascript
const numeros = [1, 2, 3, 4, 5];

// map: transforma cada elemento
const dobles = numeros.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter: filtra elementos segun condicion
const pares = numeros.filter(n => n % 2 === 0);
// [2, 4]

// find: encuentra el primer elemento que cumple
const mayor3 = numeros.find(n => n > 3);
// 4

// reduce: acumula un valor
const suma = numeros.reduce((acc, n) => acc + n, 0);
// 15

// forEach: ejecuta una funcion por cada elemento
numeros.forEach(n => console.log(n));

// includes: verifica si existe un elemento
console.log(numeros.includes(3)); // true

// some / every
console.log(numeros.some(n => n > 4));  // true (al menos uno)
console.log(numeros.every(n => n > 0)); // true (todos)

// Spread operator
const masNumeros = [...numeros, 6, 7, 8];
```

### Objetos

```javascript
// Crear objeto
const persona = {
  nombre: 'Carlos',
  edad: 28,
  direccion: {
    ciudad: 'Cuenca',
    pais: 'Ecuador'
  },
  saludar() {
    return `Hola, soy ${this.nombre}`;
  }
};

// Acceder a propiedades
console.log(persona.nombre);           // "Carlos"
console.log(persona['edad']);          // 28
console.log(persona.direccion.ciudad); // "Cuenca"

// Destructuring
const { nombre, edad, direccion: { ciudad } } = persona;
console.log(nombre, edad, ciudad); // "Carlos" 28 "Cuenca"

// Spread con objetos
const personaActualizada = { ...persona, edad: 29, email: 'carlos@mail.com' };

// Object.keys, values, entries
console.log(Object.keys(persona));    // ["nombre", "edad", "direccion", "saludar"]
console.log(Object.values(persona));  // ["Carlos", 28, {...}, f]
console.log(Object.entries(persona)); // [["nombre","Carlos"], ["edad",28], ...]
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Calculadora basica

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculadora Basica</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; }
    input { width: 80px; padding: 8px; margin: 5px; }
    button { padding: 8px 16px; cursor: pointer; }
    #resultado { margin-top: 15px; font-size: 1.2rem; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Calculadora</h1>
  <input type="number" id="num1" placeholder="Numero 1">
  <input type="number" id="num2" placeholder="Numero 2">
  <br>
  <button onclick="calcular('sumar')">+</button>
  <button onclick="calcular('restar')">-</button>
  <button onclick="calcular('multiplicar')">x</button>
  <button onclick="calcular('dividir')">/</button>
  <div id="resultado"></div>

  <script src="app.js"></script>
</body>
</html>
```

```javascript
// app.js
function calcular(operacion) {
  const num1 = parseFloat(document.getElementById('num1').value);
  const num2 = parseFloat(document.getElementById('num2').value);
  const resultado = document.getElementById('resultado');

  if (isNaN(num1) || isNaN(num2)) {
    resultado.textContent = 'Ingrese numeros validos';
    return;
  }

  const operaciones = {
    sumar: (a, b) => a + b,
    restar: (a, b) => a - b,
    multiplicar: (a, b) => a * b,
    dividir: (a, b) => b !== 0 ? a / b : 'Error: division por cero'
  };

  const res = operaciones[operacion](num1, num2);
  resultado.textContent = `Resultado: ${res}`;
}
```

### Ejemplo 2: Lista de tareas en consola

```javascript
// tareas.js
const tareas = [];

function agregarTarea(texto) {
  const tarea = {
    id: Date.now(),
    texto,
    completada: false,
    fecha: new Date().toLocaleDateString()
  };
  tareas.push(tarea);
  console.log(`Tarea agregada: "${texto}"`);
}

function completarTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    const estado = tarea.completada ? 'completada' : 'pendiente';
    console.log(`Tarea "${tarea.texto}" marcada como ${estado}`);
  }
}

function listarTareas() {
  if (tareas.length === 0) {
    console.log('No hay tareas');
    return;
  }
  tareas.forEach(t => {
    const check = t.completada ? '[x]' : '[ ]';
    console.log(`${check} ${t.texto} (${t.fecha})`);
  });
}

function eliminarCompletadas() {
  const cantidad = tareas.filter(t => t.completada).length;
  const pendientes = tareas.filter(t => !t.completada);
  tareas.length = 0;
  tareas.push(...pendientes);
  console.log(`${cantidad} tarea(s) eliminada(s)`);
}

// Uso
agregarTarea('Estudiar JavaScript');
agregarTarea('Hacer la practica');
agregarTarea('Subir al repositorio');
listarTareas();
```

---

## 5. Comparaciones / Tablas

### == vs === (Igualdad)

| Expresion | `==` (abstracta) | `===` (estricta) | Explicacion |
|-----------|:-:|:-:|-------------|
| `5 == '5'` | `true` | `false` | `==` convierte tipos |
| `0 == false` | `true` | `false` | `==` convierte boolean a number |
| `null == undefined` | `true` | `false` | Caso especial de `==` |
| `'' == 0` | `true` | `false` | String vacio se convierte a 0 |
| `NaN == NaN` | `false` | `false` | NaN no es igual a nada |

**Regla: siempre usar `===` y `!==`.**

### var vs let vs const

| Escenario | `var` | `let` | `const` |
|-----------|:---:|:---:|:---:|
| Puede reasignarse | Si | Si | No |
| Tiene scope de bloque | No | Si | Si |
| Puede redeclararse | Si | No | No |
| Sufre hoisting | Si (como `undefined`) | Si (pero TDZ) | Si (pero TDZ) |
| Uso recomendado | Nunca | Cuando cambia | **Por defecto** |

### Metodos de array: cuando usar cada uno

| Necesitas... | Metodo | Retorna |
|-------------|--------|---------|
| Transformar cada elemento | `map()` | Nuevo array |
| Filtrar elementos | `filter()` | Nuevo array (subset) |
| Encontrar un elemento | `find()` | El elemento o `undefined` |
| Verificar si existe | `some()` / `every()` | `boolean` |
| Acumular un valor | `reduce()` | Valor acumulado |
| Ejecutar por cada uno | `forEach()` | `undefined` |
| Verificar si contiene | `includes()` | `boolean` |
| Encontrar indice | `findIndex()` | Indice o `-1` |

---

## 6. Funcionalidades Complementarias

### Console API (mas alla de console.log)

```javascript
console.log('Mensaje normal');
console.warn('Advertencia');
console.error('Error');
console.table([{ nombre: 'Ana', edad: 25 }, { nombre: 'Luis', edad: 30 }]);
console.time('proceso');
// ... codigo ...
console.timeEnd('proceso'); // muestra tiempo transcurrido
console.group('Grupo');
console.log('Detalle 1');
console.log('Detalle 2');
console.groupEnd();
```

### Conversion de tipos

```javascript
// String a Number
const n1 = Number('42');       // 42
const n2 = parseInt('42px');   // 42
const n3 = parseFloat('3.14'); // 3.14
const n4 = +'42';             // 42 (operador unario +)

// Number a String
const s1 = String(42);      // "42"
const s2 = (42).toString();  // "42"
const s3 = `${42}`;         // "42"

// A Boolean
const b1 = Boolean(0);    // false
const b2 = Boolean('');   // false
const b3 = Boolean(null); // false
const b4 = Boolean('hola'); // true
const b5 = Boolean(42);    // true

// Valores falsy: false, 0, '', null, undefined, NaN
// Todo lo demas es truthy
```

### Buenas practicas iniciales

1. Usar `const` por defecto, `let` solo cuando sea necesario, nunca `var`
2. Siempre usar `===` y `!==` para comparaciones
3. Usar template literals en lugar de concatenacion
4. Nombrar variables y funciones descriptivamente en camelCase
5. Declarar variables al inicio del scope donde se usan
6. Evitar variables globales
7. Usar `'use strict'` al inicio de los scripts

```javascript
'use strict';

// Esto lanza error en strict mode (variable no declarada)
// miVariable = 10; // ReferenceError

const miVariable = 10; // Correcto
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

Crear la siguiente estructura de archivos:

```
practica-01/
  index.html
  css/
    styles.css
  js/
    app.js
```

El archivo `index.html` debe:
- Tener estructura HTML5 completa
- Enlazar el archivo CSS en el `<head>`
- Enlazar el archivo JS al final del `<body>` (o con `defer`)

### Paso 2: Variables y tipos de datos

En `app.js`, crear variables que representen informacion de un estudiante:

- `nombre` (string, const)
- `apellido` (string, const)
- `edad` (number, let)
- `carrera` (string, const)
- `semestre` (number, let)
- `activo` (boolean, const)
- `materias` (array de strings, const)
- `direccion` (objeto con ciudad, provincia, const)

Mostrar toda la informacion en consola usando `console.log` y `console.table`.

### Paso 3: Funciones de utilidad

Crear las siguientes funciones (usar arrow functions cuando sea apropiado):

1. `calcularPromedio(notas)` - Recibe un array de numeros y retorna el promedio
2. `esMayorDeEdad(edad)` - Retorna true si edad >= 18
3. `formatearNombre(nombre, apellido)` - Retorna "APELLIDO, Nombre" (apellido en mayusculas)
4. `generarSaludo(nombre, hora)` - Retorna saludo segun la hora: "Buenos dias", "Buenas tardes" o "Buenas noches"

### Paso 4: Operaciones con arrays

Dado un array de objetos `estudiantes`:

```javascript
const estudiantes = [
  { nombre: 'Ana', nota: 85, activo: true },
  { nombre: 'Luis', nota: 42, activo: true },
  { nombre: 'Maria', nota: 93, activo: false },
  { nombre: 'Carlos', nota: 67, activo: true },
  { nombre: 'Sofia', nota: 78, activo: true }
];
```

Implementar:
1. Obtener solo los aprobados (nota >= 70) usando `filter`
2. Obtener un array con solo los nombres usando `map`
3. Calcular el promedio general usando `reduce`
4. Encontrar al estudiante con la nota mas alta usando `reduce` o `sort`
5. Verificar si todos estan activos usando `every`
6. Verificar si alguno tiene nota > 90 usando `some`

### Paso 5: Mostrar resultados en el HTML

Crear una seccion en `index.html` donde se muestren los resultados de los Pasos 2, 3 y 4.

- Usar `document.getElementById()` para obtener los contenedores
- Usar `innerHTML` o `textContent` para insertar contenido
- Aplicar estilos basicos con CSS para que sea legible

**Nota:** Este paso es una introduccion minima al DOM. Se profundizara en la Practica 02.

### Paso 6: Refactorizacion

Revisar todo el codigo y aplicar:
- `'use strict'` al inicio
- Nombres descriptivos en todas las variables
- `const` en lugar de `let` donde sea posible
- Template literals en todos los strings compuestos
- Comentarios breves donde sea necesario

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Estructura del proyecto** - Captura del explorador de archivos mostrando la organizacion de carpetas y archivos
2. **Consola del navegador** - Captura mostrando la salida de `console.log` y `console.table` del Paso 2
3. **Resultados de funciones** - Captura de la consola mostrando el retorno de las funciones del Paso 3
4. **Operaciones con arrays** - Captura mostrando los resultados de filter, map, reduce del Paso 4
5. **Pagina renderizada** - Captura del navegador mostrando los resultados en el HTML (Paso 5)
6. **Codigo fuente** - Capturas del archivo `app.js` completo

### Formato del Archivo de Evidencias

```markdown
### 1. Estructura del proyecto
![Estructura](assets/01-estructura.png)
**Descripcion:** Organizacion de archivos del proyecto...

### 2. Consola: Variables y tipos
![Consola](assets/02-consola-variables.png)
**Descripcion:** Salida de console.log mostrando...

### 3. Funciones de utilidad
![Funciones](assets/03-funciones.png)
**Descripcion:** Resultados de las funciones...
```

---

## 9. Entregables

- Repositorio GitHub con el codigo completo
- Capturas de pantalla en la carpeta `assets/`
- Archivo `.md` completado con evidencias y descripciones
- El codigo debe ejecutarse sin errores en la consola del navegador

---

## Reglas

- No usar frameworks (React, Angular, Vue, etc.)
- Solo HTML + CSS + JavaScript puro (Vanilla JS)
- No usar librerias externas (jQuery, Lodash, etc.)
- Codigo propio: comprender lo que se escribe
- Usar `const` por defecto, `let` cuando sea necesario, nunca `var`
- Siempre comparar con `===`

---

## Notas de Implementacion

- Usar un navegador moderno (Chrome, Firefox, Edge) con DevTools abierto
- La consola del navegador (F12 > Console) es la herramienta principal de depuracion
- Se puede usar la extension Live Server de VSCode para recargar automaticamente
- Todo el codigo de esta practica se puede probar directamente en la consola del navegador

---


