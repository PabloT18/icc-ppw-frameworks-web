# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 5: Programacion Asincrona

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

JavaScript es un lenguaje **single-threaded** (un solo hilo de ejecucion). Esto significa que solo puede ejecutar una tarea a la vez. Sin embargo, muchas operaciones en la web son lentas: peticiones HTTP, lectura de archivos, temporizadores. Si JS esperara a que cada una termine, la interfaz se congelaria.

La programacion asincrona permite que JS **delegue** tareas lentas al navegador y continue ejecutando codigo. Cuando la tarea termina, JS retoma el resultado a traves de callbacks, promesas o async/await.

### Por que importa?

| Operacion | Tiempo aproximado | Sincrono | Asincrono |
|-----------|:-:|:-:|:-:|
| Calcular 1+1 | <1ms | OK | Innecesario |
| Peticion HTTP | 100ms-5s | UI congelada | UI fluida |
| Lectura archivo | 10ms-500ms | UI congelada | UI fluida |
| setTimeout 3s | 3s | Imposible | Funciona |

---

## 2. Conceptos Clave

### El Event Loop

El motor de JS tiene un solo hilo, pero el navegador tiene APIs adicionales que manejan tareas asincronas. El **Event Loop** coordina todo:

1. **Call Stack** - Pila de ejecucion (funciones que se estan ejecutando ahora)
2. **Web APIs** - APIs del navegador (setTimeout, fetch, DOM events)
3. **Callback Queue** (Task Queue) - Cola de callbacks listos para ejecutarse
4. **Microtask Queue** - Cola de promesas (mayor prioridad que Callback Queue)

```
                    +-----------+
                    | Web APIs  |
                    | setTimeout|
      +------+     | fetch     |     +---------+
      | Call  |---->| DOM events|---->| Callback|
      | Stack |     +-----------+     | Queue   |
      +------+                        +---------+
         ^                                 |
         |         +------------+          |
         |<--------| Microtask  |<---------+
                   | Queue      |
                   | (Promises) |
                   +------------+
```

### Orden de ejecucion

```javascript
console.log('1. Sincrono');

setTimeout(() => {
  console.log('2. setTimeout (Callback Queue)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise (Microtask Queue)');
});

console.log('4. Sincrono');

// Salida:
// 1. Sincrono
// 4. Sincrono
// 3. Promise (Microtask Queue)
// 2. setTimeout (Callback Queue)
```

---

## 3. Explicacion Tecnica Detallada

### Callbacks

Un callback es una funcion que se pasa como argumento a otra funcion y se ejecuta cuando la operacion termina.

```javascript
// Callback simple con setTimeout
function saludarDespues(nombre, callback) {
  setTimeout(() => {
    const saludo = `Hola, ${nombre}`;
    callback(saludo);
  }, 2000);
}

saludarDespues('Pablo', (mensaje) => {
  console.log(mensaje); // "Hola, Pablo" (despues de 2s)
});
```

#### Callback Hell

El problema principal de los callbacks es el anidamiento excesivo:

```javascript
// Callback Hell - dificil de leer y mantener
obtenerUsuario(id, (usuario) => {
  obtenerPedidos(usuario.id, (pedidos) => {
    obtenerDetalle(pedidos[0].id, (detalle) => {
      obtenerEnvio(detalle.envioId, (envio) => {
        console.log(envio.estado);
        // ... y esto puede seguir
      });
    });
  });
});
```

### Promesas (Promise)

Una promesa es un objeto que representa el resultado eventual de una operacion asincrona. Tiene tres estados:

| Estado | Descripcion | Metodo |
|--------|-------------|--------|
| **pending** | En curso, no ha terminado | - |
| **fulfilled** | Termino exitosamente | `.then()` |
| **rejected** | Termino con error | `.catch()` |

```javascript
// Crear una promesa
function obtenerDatos(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url) {
        resolve({ datos: 'Resultado exitoso', url });
      } else {
        reject(new Error('URL no proporcionada'));
      }
    }, 1500);
  });
}

// Usar la promesa
obtenerDatos('https://api.ejemplo.com/datos')
  .then(resultado => {
    console.log('Exito:', resultado.datos);
    return resultado; // se puede encadenar
  })
  .then(resultado => {
    console.log('URL:', resultado.url);
  })
  .catch(error => {
    console.error('Error:', error.message);
  })
  .finally(() => {
    console.log('Operacion completada (exito o error)');
  });
```

### Encadenamiento de promesas (Promise Chaining)

```javascript
// Cada .then() retorna una nueva promesa
function paso1() {
  return new Promise(resolve => {
    setTimeout(() => resolve('Resultado paso 1'), 1000);
  });
}

function paso2(datoAnterior) {
  return new Promise(resolve => {
    setTimeout(() => resolve(`${datoAnterior} + Resultado paso 2`), 1000);
  });
}

function paso3(datoAnterior) {
  return new Promise(resolve => {
    setTimeout(() => resolve(`${datoAnterior} + Resultado paso 3`), 1000);
  });
}

// Encadenamiento limpio (vs callback hell)
paso1()
  .then(resultado => paso2(resultado))
  .then(resultado => paso3(resultado))
  .then(resultadoFinal => {
    console.log(resultadoFinal);
    // "Resultado paso 1 + Resultado paso 2 + Resultado paso 3"
  })
  .catch(error => console.error(error));
```

### Promise.all, Promise.race, Promise.allSettled

```javascript
const promesa1 = new Promise(resolve => setTimeout(() => resolve('Uno'), 1000));
const promesa2 = new Promise(resolve => setTimeout(() => resolve('Dos'), 2000));
const promesa3 = new Promise((_, reject) => setTimeout(() => reject('Error tres'), 1500));

// Promise.all - espera a TODAS, falla si alguna falla
Promise.all([promesa1, promesa2])
  .then(resultados => console.log(resultados)) // ['Uno', 'Dos']
  .catch(error => console.error(error));

// Promise.race - retorna la PRIMERA que termine (exito o error)
Promise.race([promesa1, promesa2])
  .then(primero => console.log(primero)) // 'Uno'
  .catch(error => console.error(error));

// Promise.allSettled - espera a TODAS, nunca falla
Promise.allSettled([promesa1, promesa2, promesa3])
  .then(resultados => {
    console.log(resultados);
    // [
    //   { status: 'fulfilled', value: 'Uno' },
    //   { status: 'fulfilled', value: 'Dos' },
    //   { status: 'rejected', reason: 'Error tres' }
    // ]
  });
```

### async / await

`async/await` es azucar sintactica sobre promesas que permite escribir codigo asincrono como si fuera sincrono.

```javascript
// Funcion async retorna una promesa automaticamente
async function obtenerUsuario(id) {
  // await pausa la ejecucion DENTRO de esta funcion hasta que la promesa se resuelva
  const respuesta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const usuario = await respuesta.json();
  return usuario;
}

// Llamar la funcion async
obtenerUsuario(1)
  .then(usuario => console.log(usuario.name))
  .catch(error => console.error(error));
```

### Manejo de errores con try/catch

```javascript
async function cargarDatos() {
  try {
    const respuesta = await fetch('https://api.ejemplo.com/datos');

    if (!respuesta.ok) {
      throw new Error(`HTTP Error: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    console.log('Datos cargados:', datos);
    return datos;

  } catch (error) {
    console.error('Error al cargar datos:', error.message);
    // Manejar el error: mostrar mensaje al usuario, etc.
    return null;

  } finally {
    console.log('Carga finalizada');
    // Ocultar spinner, etc.
  }
}
```

### Ejecucion paralela con async/await

```javascript
// MALO - secuencial (una espera a la otra)
async function secuencial() {
  const usuario = await obtenerUsuario(1);     // espera 1s
  const posts = await obtenerPosts(1);          // espera 1s
  const comentarios = await obtenerComentarios(1); // espera 1s
  // Total: ~3 segundos
}

// BUENO - paralelo (todas al mismo tiempo)
async function paralelo() {
  const [usuario, posts, comentarios] = await Promise.all([
    obtenerUsuario(1),
    obtenerPosts(1),
    obtenerComentarios(1)
  ]);
  // Total: ~1 segundo (la mas lenta)
}
```

### setTimeout e setInterval

```javascript
// setTimeout - ejecuta una vez despues de X milisegundos
const timeoutId = setTimeout(() => {
  console.log('Ejecutado despues de 3 segundos');
}, 3000);

// Cancelar timeout
clearTimeout(timeoutId);

// setInterval - ejecuta cada X milisegundos
let contador = 0;
const intervalId = setInterval(() => {
  contador++;
  console.log(`Tick ${contador}`);
  if (contador >= 5) {
    clearInterval(intervalId); // detener despues de 5 ticks
  }
}, 1000);
```

---

## 4. Ejemplos de Codigo

### Ejemplo 1: Simulador de carga con promesas

```javascript
'use strict';

// Simular una API con delays aleatorios
function simularPeticion(nombre, exito = true) {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 2000 + 500;
    setTimeout(() => {
      if (exito) {
        resolve({ nombre, datos: `Datos de ${nombre}`, tiempo: Math.round(delay) });
      } else {
        reject(new Error(`Error al cargar ${nombre}`));
      }
    }, delay);
  });
}

// UI: mostrar estado de carga
function mostrarEstado(mensaje, tipo = 'info') {
  const log = document.querySelector('#log');
  const entrada = document.createElement('div');
  entrada.className = `log-entry log-entry--${tipo}`;
  entrada.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  log.appendChild(entrada);
  log.scrollTop = log.scrollHeight;
}

// Cargar todo secuencialmente
async function cargarSecuencial() {
  mostrarEstado('Inicio carga secuencial...', 'info');
  const inicio = performance.now();

  try {
    const usuarios = await simularPeticion('Usuarios');
    mostrarEstado(`Cargado: ${usuarios.nombre} (${usuarios.tiempo}ms)`, 'success');

    const productos = await simularPeticion('Productos');
    mostrarEstado(`Cargado: ${productos.nombre} (${productos.tiempo}ms)`, 'success');

    const pedidos = await simularPeticion('Pedidos');
    mostrarEstado(`Cargado: ${pedidos.nombre} (${pedidos.tiempo}ms)`, 'success');

  } catch (error) {
    mostrarEstado(`Error: ${error.message}`, 'error');
  }

  const total = Math.round(performance.now() - inicio);
  mostrarEstado(`Secuencial completado en ${total}ms`, 'info');
}

// Cargar todo en paralelo
async function cargarParalelo() {
  mostrarEstado('Inicio carga paralela...', 'info');
  const inicio = performance.now();

  try {
    const resultados = await Promise.all([
      simularPeticion('Usuarios'),
      simularPeticion('Productos'),
      simularPeticion('Pedidos')
    ]);

    resultados.forEach(r => {
      mostrarEstado(`Cargado: ${r.nombre} (${r.tiempo}ms)`, 'success');
    });

  } catch (error) {
    mostrarEstado(`Error: ${error.message}`, 'error');
  }

  const total = Math.round(performance.now() - inicio);
  mostrarEstado(`Paralelo completado en ${total}ms`, 'info');
}

// Botones
document.querySelector('#btn-secuencial').addEventListener('click', cargarSecuencial);
document.querySelector('#btn-paralelo').addEventListener('click', cargarParalelo);
```

### Ejemplo 2: Temporizador interactivo

```javascript
'use strict';

let intervaloId = null;
let tiempoRestante = 0;

function formatearTiempo(segundos) {
  const mins = Math.floor(segundos / 60).toString().padStart(2, '0');
  const segs = (segundos % 60).toString().padStart(2, '0');
  return `${mins}:${segs}`;
}

function actualizarDisplay() {
  document.querySelector('#display').textContent = formatearTiempo(tiempoRestante);
  const barra = document.querySelector('#barra-progreso');
  const total = Number(document.querySelector('#tiempo-input').value);
  const porcentaje = total > 0 ? ((total - tiempoRestante) / total) * 100 : 0;
  barra.style.width = `${porcentaje}%`;
}

function iniciar() {
  if (intervaloId) return;

  tiempoRestante = Number(document.querySelector('#tiempo-input').value);
  if (tiempoRestante <= 0) return;

  actualizarDisplay();

  intervaloId = setInterval(() => {
    tiempoRestante--;
    actualizarDisplay();

    if (tiempoRestante <= 0) {
      detener();
      document.querySelector('#display').textContent = 'Tiempo!';
      document.querySelector('#display').classList.add('display--terminado');
    }
  }, 1000);
}

function detener() {
  clearInterval(intervaloId);
  intervaloId = null;
}

function reiniciar() {
  detener();
  tiempoRestante = 0;
  document.querySelector('#display').textContent = '00:00';
  document.querySelector('#display').classList.remove('display--terminado');
  document.querySelector('#barra-progreso').style.width = '0%';
}

document.querySelector('#btn-iniciar').addEventListener('click', iniciar);
document.querySelector('#btn-detener').addEventListener('click', detener);
document.querySelector('#btn-reiniciar').addEventListener('click', reiniciar);
```

---

## 5. Comparaciones / Tablas

### Callbacks vs Promesas vs async/await

| Criterio | Callbacks | Promesas | async/await |
|----------|:-:|:-:|:-:|
| Legibilidad | Baja (anidacion) | Media (encadenamiento) | Alta (lineal) |
| Manejo de errores | Complicado | `.catch()` | `try/catch` |
| Encadenamiento | Callback hell | `.then().then()` | `await` secuencial |
| Ejecucion paralela | Manual | `Promise.all()` | `Promise.all()` con await |
| Soporte navegadores | Todos | IE no (pero irrelevante) | Moderno (ES2017+) |
| Cancelacion | Posible | No nativa | No nativa |

### Metodos de Promise

| Metodo | Comportamiento | Caso de uso |
|--------|---------------|-------------|
| `Promise.all()` | Espera a todas, falla si una falla | Cargar multiples recursos dependientes |
| `Promise.allSettled()` | Espera a todas, nunca falla | Cargar recursos independientes |
| `Promise.race()` | Retorna la primera | Timeout o cache vs red |
| `Promise.any()` | Retorna la primera exitosa | Intentar multiples fuentes |

### setTimeout vs setInterval

| Aspecto | setTimeout | setInterval |
|---------|-----------|-------------|
| Ejecucion | Una vez | Repetida |
| Cancelar | `clearTimeout(id)` | `clearInterval(id)` |
| Precision | No garantizada | Puede acumular drift |
| Consejo | Mejor para delays | Mejor usar setTimeout recursivo |

---

## 6. Funcionalidades Complementarias

### setTimeout recursivo (mejor que setInterval)

```javascript
// setInterval puede acumular imprecision
// setTimeout recursivo es mas preciso:
function reloj() {
  console.log(new Date().toLocaleTimeString());
  setTimeout(reloj, 1000);
}
reloj();
```

### Crear promesas desde APIs con callbacks

```javascript
// Convertir API basada en callbacks a promesas
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Uso
async function animacion() {
  elemento.classList.add('fade-in');
  await delay(500);
  elemento.classList.add('slide-up');
  await delay(300);
  elemento.classList.add('visible');
}
```

### Patron de reintentos

```javascript
async function fetchConReintentos(url, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      return await respuesta.json();
    } catch (error) {
      console.warn(`Intento ${i + 1} fallido: ${error.message}`);
      if (i === intentos - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // esperar mas cada intento
    }
  }
}
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Configurar el proyecto

```
practica-05/
  index.html
  css/
    styles.css
  js/
    app.js
```

### Paso 2: HTML completo (copiar)

**¿Qué hace este paso?** Proporciona toda la estructura HTML necesaria para la práctica. El HTML incluye tres secciones: simulador de carga de recursos, temporizador regresivo y manejo de errores. Copiar exactamente este código en `index.html`.

En `index.html`, copiar la estructura completa:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Práctica 5 - Asincronía</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <main class="page">
    <!-- SECCIÓN 1: CARGA SECUENCIAL VS PARALELA -->
    <section class="container">
      <h1>Simulador de Carga de Recursos</h1>
      
      <div class="button-group">
        <button type="button" id="btn-secuencial">Cargar Secuencial</button>
        <button type="button" id="btn-paralelo">Cargar Paralelo</button>
        <button type="button" id="btn-limpiar">Limpiar Log</button>
      </div>

      <div id="log" class="log"></div>
      
      <div id="resultados" class="resultados"></div>
    </section>

    <!-- SECCIÓN 2: TEMPORIZADOR -->
    <section class="container">
      <h2>Temporizador Regresivo</h2>

      <div class="form-group">
        <label for="input-tiempo">Tiempo en segundos:</label>
        <input type="number" id="input-tiempo" value="60" min="1" max="600">
      </div>

      <div id="display" class="display">00:00</div>

      <div class="progress-container">
        <div id="barra-progreso" class="progress-bar"></div>
      </div>

      <div class="button-group">
        <button type="button" id="btn-iniciar">Iniciar</button>
        <button type="button" id="btn-detener">Detener</button>
        <button type="button" id="btn-reiniciar">Reiniciar</button>
      </div>
    </section>

    <!-- SECCIÓN 3: MANEJO DE ERRORES -->
    <section class="container">
      <h2>Manejo de Errores</h2>

      <div class="button-group">
        <button type="button" id="btn-error">Simular Error</button>
        <button type="button" id="btn-reintentos">Reintentos Automáticos</button>
      </div>

      <div id="log-errores" class="log"></div>
    </section>
  </main>

  <script defer src="js/app.js"></script>
</body>
</html>
```

### Paso 3: CSS completo (copiar)

**¿Qué hace este paso?** Proporciona todos los estilos necesarios: reset básico, estilos de contenedores con gradiente, botones con efectos hover, logs estilo terminal con colores según tipo, display de temporizador grande, barra de progreso animada con gradiente, y animación de pulso para alertas. Copiar exactamente este código en `css/styles.css`.

En `css/styles.css`, copiar todos los estilos (tomar de `solver/05-asincronia/css/styles.css` - 320 líneas completas)

### Paso 4: JavaScript Parte 1 - Funciones base (copiar)

En `js/app.js`, empezar con la estructura base:

#### 4.1 Selección de elementos y variables globales (copiar)

**¿Qué hace este código?** Selecciona todos los elementos del DOM que se van a manipular y declara variables globales para medir tiempos de carga secuencial y paralela. Estas variables permitirán hacer la comparativa al final.

```javascript
'use strict';

/* =========================
   SIMULADOR DE PETICIONES
========================= */

const log = document.getElementById('log');
const resultados = document.getElementById('resultados');

let tiempoSecuencial = 0;
let tiempoParalelo = 0;
```

#### 4.2 Función para simular peticiones (copiar)

**¿Qué hace este código?** Crea una promesa que simula una petición a una API con un delay aleatorio entre `tiempoMin` y `tiempoMax`. Si `fallar` es true, rechaza la promesa con un error; si es false, resuelve con un objeto que contiene nombre, tiempo y timestamp.

```javascript
function simularPeticion(nombre, tiempoMin = 500, tiempoMax = 2000, fallar = false) {
  return new Promise((resolve, reject) => {
    const tiempoDelay = Math.floor(Math.random() * (tiempoMax - tiempoMin + 1)) + tiempoMin;

    setTimeout(() => {
      if (fallar) {
        reject(new Error(`Error al cargar ${nombre}`));
      } else {
        resolve({
          nombre,
          tiempo: tiempoDelay,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, tiempoDelay);
  });
}
```

#### 4.3 Funciones helper (copiar)

**¿Qué hace este código?** `formatearTiempo()` convierte milisegundos a segundos con 2 decimales. `mostrarLog()` crea un elemento div con clase según el tipo (info, success, error, warning) y lo agrega al log con timestamp automático, haciendo scroll al final.

```javascript
function formatearTiempo(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

function mostrarLog(mensaje, tipo = 'info') {
  const item = document.createElement('div');
  item.className = `log-item log-${tipo}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
}
```

### Paso 5: JavaScript Parte 2 - Carga secuencial y paralela (copiar y completar)

#### 5.1 Carga secuencial (completar)

**¿Qué hace este código?** Ejecuta 3 peticiones UNA TRAS OTRA usando `await`. Cada `await` pausa la ejecución hasta que la promesa se resuelva. Mide el tiempo total con `performance.now()` y guarda el resultado en `tiempoSecuencial` para la comparativa.

```javascript
async function cargarSecuencial() {
  mostrarLog('🔄 Iniciando carga secuencial...', 'info');
  resultados.classList.remove('visible');
  
  const inicio = performance.now();

  try {
    // TODO 5.1.1: Usar await para cargar 'Usuario' (500-1000ms)
    //   const usuario = await simularPeticion('Usuario', 500, 1000);
    //   mostrarLog(`✓ ${usuario.nombre} cargado en ${formatearTiempo(usuario.tiempo)}`, 'success');

    // TODO 5.1.2: Usar await para cargar 'Posts' (700-1500ms)
    //   const posts = await simularPeticion('Posts', 700, 1500);
    //   mostrarLog(`✓ ${posts.nombre} cargados en ${formatearTiempo(posts.tiempo)}`, 'success');

    // TODO 5.1.3: Usar await para cargar 'Comentarios' (600-1200ms)
    //   const comentarios = await simularPeticion('Comentarios', 600, 1200);
    //   mostrarLog(`✓ ${comentarios.nombre} cargados en ${formatearTiempo(comentarios.tiempo)}`, 'success');

    const fin = performance.now();
    const total = fin - inicio;
    tiempoSecuencial = total;

    mostrarLog(`✅ Secuencial completado en ${formatearTiempo(total)}`, 'success');
    mostrarComparativa();
  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, 'error');
  }
}
```

#### 5.2 Carga paralela (completar)

**¿Qué hace este código?** Ejecuta 3 peticiones SIMULTÁNEAMENTE usando `Promise.all()`. No espera a que termine una para empezar la siguiente, todas se ejecutan al mismo tiempo. El tiempo total será aproximadamente el de la petición MÁS LENTA, no la suma de todas.

```javascript
async function cargarParalelo() {
  mostrarLog('🔄 Iniciando carga paralela...', 'info');
  resultados.classList.remove('visible');
  
  const inicio = performance.now();

  try {
    // TODO 5.2.1: Crear array de promesas (NO usar await todavía)
    //   const promesas = [
    //     simularPeticion('Usuario', 500, 1000),
    //     simularPeticion('Posts', 700, 1500),
    //     simularPeticion('Comentarios', 600, 1200)
    //   ];

    // TODO 5.2.2: Usar await con Promise.all para esperar a TODAS
    //   const resultadosPromesas = await Promise.all(promesas);

    // TODO 5.2.3: Mostrar cada resultado con forEach
    //   resultadosPromesas.forEach((resultado) => {
    //     mostrarLog(`✓ ${resultado.nombre} cargado en ${formatearTiempo(resultado.tiempo)}`, 'success');
    //   });

    const fin = performance.now();
    const total = fin - inicio;
    tiempoParalelo = total;

    mostrarLog(`✅ Paralelo completado en ${formatearTiempo(total)}`, 'success');
    mostrarComparativa();
  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, 'error');
  }
}
```

#### 5.3 Mostrar comparativa y limpiar log (copiar)

**¿Qué hace este código?** `mostrarComparativa()` calcula la diferencia de tiempo entre secuencial y paralelo, muestra el porcentaje de mejora y crea dinámicamente el HTML del resultado. `limpiarLog()` resetea todo el estado.

```javascript
function mostrarComparativa() {
  if (tiempoSecuencial > 0 && tiempoParalelo > 0) {
    const diferencia = tiempoSecuencial - tiempoParalelo;
    const porcentaje = ((diferencia / tiempoSecuencial) * 100).toFixed(1);

    resultados.innerHTML = `
      <h3>📊 Comparativa de Rendimiento</h3>
      <p><strong>Carga Secuencial:</strong> ${formatearTiempo(tiempoSecuencial)}</p>
      <p><strong>Carga Paralela:</strong> ${formatearTiempo(tiempoParalelo)}</p>
      <p><strong>Diferencia:</strong> ${formatearTiempo(diferencia)} (${porcentaje}% más rápido)</p>
    `;
    resultados.classList.add('visible');
  }
}

function limpiarLog() {
  log.innerHTML = '';
  resultados.classList.remove('visible');
  tiempoSecuencial = 0;
  tiempoParalelo = 0;
}

// Conectar eventos
document.getElementById('btn-secuencial').addEventListener('click', cargarSecuencial);
document.getElementById('btn-paralelo').addEventListener('click', cargarParalelo);
document.getElementById('btn-limpiar').addEventListener('click', limpiarLog);
```

### Paso 6: JavaScript Parte 3 - Temporizador (copiar y completar)

#### 6.1 Selección de elementos y variables del temporizador (copiar)

**¿Qué hace este código?** Selecciona todos los elementos del temporizador y declara variables de estado: `intervaloId` guarda el ID del setInterval para poder cancelarlo, `tiempoRestante` son los segundos que faltan, `tiempoInicial` es el total configurado (para calcular porcentaje de progreso).

```javascript
/* =========================
   TEMPORIZADOR
========================= */

const inputTiempo = document.getElementById('input-tiempo');
const display = document.getElementById('display');
const barraProgreso = document.getElementById('barra-progreso');
const btnIniciar = document.getElementById('btn-iniciar');
const btnDetener = document.getElementById('btn-detener');
const btnReiniciar = document.getElementById('btn-reiniciar');

let intervaloId = null;
let tiempoRestante = 0;
let tiempoInicial = 0;
```

#### 6.2 Función para formatear tiempo del display (copiar)

**¿Qué hace este código?** Convierte segundos totales a formato MM:SS. Usa `Math.floor()` para obtener minutos enteros, el operador módulo `%` para los segundos restantes, y `padStart(2, '0')` para agregar ceros a la izquierda (ejemplo: 5 → "05").

```javascript
function formatearTiempoDisplay(segundos) {
  const mins = Math.floor(segundos / 60).toString().padStart(2, '0');
  const segs = (segundos % 60).toString().padStart(2, '0');
  return `${mins}:${segs}`;
}
```

#### 6.3 Actualizar display y barra de progreso (completar)

**¿Qué hace este código?** Actualiza el texto del display con el formato MM:SS. Calcula el porcentaje de progreso (cuánto ha avanzado de 0 a 100%) y actualiza el ancho de la barra. Si quedan 10 segundos o menos, agrega clase 'alerta' para cambiar colores a rojo.

```javascript
function actualizarDisplay() {
  // TODO 6.3.1: Actualizar el textContent del display
  //   display.textContent = formatearTiempoDisplay(tiempoRestante);

  if (tiempoInicial > 0) {
    // TODO 6.3.2: Calcular porcentaje de progreso
    //   const porcentaje = ((tiempoInicial - tiempoRestante) / tiempoInicial) * 100;
    //   barraProgreso.style.width = `${porcentaje}%`;

    // TODO 6.3.3: Agregar/quitar clase 'alerta' si quedan <= 10 segundos
    //   if (tiempoRestante <= 10 && tiempoRestante > 0) {
    //     display.classList.add('alerta');
    //     barraProgreso.classList.add('alerta');
    //   } else {
    //     display.classList.remove('alerta');
    //     barraProgreso.classList.remove('alerta');
    //   }
  }
}
```

#### 6.4 Función iniciar (completar)

**¿Qué hace este código?** Valida que no haya un intervalo activo ya, obtiene el tiempo del input, deshabilita botones para evitar múltiples intervalos, llama a `actualizarDisplay()` inmediatamente (no espera 1 segundo), y luego usa `setInterval()` para decrementar cada segundo. Cuando llega a 0, detiene automáticamente.

```javascript
function iniciar() {
  // TODO 6.4.1: Verificar que no haya intervalo activo
  //   if (intervaloId) {
  //     return;
  //   }

  // TODO 6.4.2: Obtener tiempo del input y validar
  //   const tiempo = parseInt(inputTiempo.value);
  //   if (isNaN(tiempo) || tiempo <= 0) {
  //     alert('Ingresa un tiempo válido');
  //     return;
  //   }

  // TODO 6.4.3: Inicializar variables y deshabilitar/habilitar botones
  //   tiempoRestante = tiempo;
  //   tiempoInicial = tiempo;
  //   btnIniciar.disabled = true;
  //   btnDetener.disabled = false;
  //   inputTiempo.disabled = true;

  // TODO 6.4.4: Actualizar display inmediatamente
  //   actualizarDisplay();

  // TODO 6.4.5: Crear intervalo que se ejecute cada 1000ms
  //   intervaloId = setInterval(() => {
  //     tiempoRestante--;
  //     actualizarDisplay();
  //
  //     if (tiempoRestante <= 0) {
  //       detener();
  //       display.classList.add('alerta');
  //       alert('⏰ ¡Tiempo terminado!');
  //     }
  //   }, 1000);
}
```

#### 6.5 Funciones detener y reiniciar (completar)

**¿Qué hace este código?** `detener()` usa `clearInterval()` para cancelar el intervalo, resetea `intervaloId` a null, y habilita/deshabilita botones apropiadamente. `reiniciar()` llama a `detener()` primero y luego resetea todas las variables y la UI a su estado inicial.

```javascript
function detener() {
  // TODO 6.5.1: Verificar que haya un intervalo activo
  //   if (intervaloId) {
  //     clearInterval(intervaloId);
  //     intervaloId = null;
  //     btnIniciar.disabled = false;
  //     btnDetener.disabled = true;
  //     inputTiempo.disabled = false;
  //   }
}

function reiniciar() {
  // TODO 6.5.2: Llamar a detener() primero
  //   detener();

  // TODO 6.5.3: Resetear variables y UI
  //   tiempoRestante = 0;
  //   tiempoInicial = 0;
  //   display.textContent = '00:00';
  //   barraProgreso.style.width = '0%';
  //   display.classList.remove('alerta');
  //   barraProgreso.classList.remove('alerta');
}

// Conectar eventos
btnIniciar.addEventListener('click', iniciar);
btnDetener.addEventListener('click', detener);
btnReiniciar.addEventListener('click', reiniciar);

// Deshabilitar botón detener al inicio
btnDetener.disabled = true;
```

### Paso 7: JavaScript Parte 4 - Manejo de errores (copiar y completar)

#### 7.1 Selección de elementos y función helper (copiar)

**¿Qué hace este código?** Selecciona el log de errores y define `mostrarLogError()` que funciona igual que `mostrarLog()` pero escribe en el log de la sección de errores. Usamos una función separada para mantener logs independientes por sección.

```javascript
/* =========================
   MANEJO DE ERRORES
========================= */

const logErrores = document.getElementById('log-errores');

function mostrarLogError(mensaje, tipo = 'info') {
  const item = document.createElement('div');
  item.className = `log-item log-${tipo}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  logErrores.appendChild(item);
  logErrores.scrollTop = logErrores.scrollHeight;
}
```

#### 7.2 Simular error con try/catch (completar)

**¿Qué hace este código?** Intenta ejecutar una promesa que SIEMPRE fallará (fallar=true). El bloque `try` nunca llegará al log de éxito porque la promesa será rechazada. El bloque `catch` captura el error y lo muestra en la UI sin romper la aplicación.

```javascript
async function simularError() {
  mostrarLogError('🔄 Intentando operación que fallará...', 'info');

  try {
    // TODO 7.2.1: Llamar simularPeticion con fallar=true
    //   await simularPeticion('API', 500, 1000, true);
    //   mostrarLogError('✓ Operación exitosa', 'success');
  } catch (error) {
    // TODO 7.2.2: Capturar el error y mostrarlo
    //   mostrarLogError(`❌ Error capturado: ${error.message}`, 'error');
    //   mostrarLogError('ℹ️ El error fue manejado correctamente con try/catch', 'info');
  }
}
```

#### 7.3 Reintentos automáticos con backoff exponencial (completar)

**¿Qué hace este código?** Intenta cargar un recurso hasta 3 veces. Si falla, espera un tiempo creciente antes de reintentar: 500ms, 1000ms, 2000ms (backoff exponencial con `Math.pow(2, i) * 500`). Registra cada intento en el log. Si todos fallan, lanza un error final.

```javascript
async function fetchConReintentos(nombre, intentos = 3) {
  mostrarLogError(`🔄 Iniciando ${intentos} intentos para cargar ${nombre}...`, 'info');

  // TODO 7.3.1: Crear loop for de 0 a intentos
  //   for (let i = 0; i < intentos; i++) {
  //     try {
  //       mostrarLogError(`⏳ Intento ${i + 1}/${intentos}...`, 'info');
  //       
  //       // Simular petición con 50% de probabilidad de fallo
  //       const resultado = await simularPeticion(nombre, 500, 1000, Math.random() > 0.5);
  //       
  //       mostrarLogError(`✓ Éxito en intento ${i + 1}: ${nombre} cargado`, 'success');
  //       return resultado;
  //     } catch (error) {
  //       mostrarLogError(`❌ Intento ${i + 1} falló: ${error.message}`, 'error');
  //       
  //       // TODO 7.3.2: Si NO es el último intento, esperar con backoff exponencial
  //       //   if (i < intentos - 1) {
  //       //     const espera = Math.pow(2, i) * 500;
  //       //     mostrarLogError(`⏰ Esperando ${espera}ms antes del siguiente intento...`, 'warning');
  //       //     await new Promise(resolve => setTimeout(resolve, espera));
  //       //   }
  //     }
  //   }

  // TODO 7.3.3: Si llegamos aquí, todos los intentos fallaron
  //   mostrarLogError(`💥 Todos los intentos fallaron para ${nombre}`, 'error');
  //   throw new Error(`No se pudo cargar ${nombre} después de ${intentos} intentos`);
}

// Conectar eventos
document.getElementById('btn-error').addEventListener('click', simularError);
document.getElementById('btn-reintentos').addEventListener('click', () => {
  fetchConReintentos('Recurso', 3).catch(() => {
    mostrarLogError('ℹ️ Proceso de reintentos completado', 'info');
  });
});
```

### Paso 8: Pruebas y verificación

**¿Qué hace este paso?** Verificar que toda la funcionalidad asíncrona esté implementada correctamente antes de entregar. Sigue esta lista de verificación en orden.

#### 8.1 Pruebas del simulador de carga

1. **Carga secuencial:**
   - Haz clic en "Cargar Secuencial"
   - Observa el log: las 3 peticiones deben ejecutarse UNA TRAS OTRA (espera a que termine una para empezar la siguiente)
   - El tiempo total debe ser aproximadamente la SUMA de los 3 tiempos individuales (4-6 segundos)

2. **Carga paralela:**
   - Haz clic en "Cargar Paralelo"
   - Observa el log: las 3 peticiones deben ejecutarse SIMULTÁNEAMENTE
   - El tiempo total debe ser aproximadamente el tiempo de la petición MÁS LENTA (1-2 segundos)

3. **Comparativa:**
   - Ejecuta AMBAS cargas (secuencial y luego paralelo, o viceversa)
   - Debe aparecer el cuadro de "Comparativa de Rendimiento"
   - La carga paralela debe ser 50-70% más rápida
   - Verifica que los números coincidan con los mostrados en el log

4. **Limpiar log:**
   - Haz clic en "Limpiar Log"
   - El log debe vaciarse completamente
   - La comparativa debe desaparecer

#### 8.2 Pruebas del temporizador

1. **Iniciar temporizador:**
   - Deja el valor por defecto (60 segundos) o cambia a 10 segundos
   - Haz clic en "Iniciar"
   - El display debe mostrar el tiempo en formato MM:SS
   - La barra de progreso debe crecer de izquierda a derecha
   - El botón "Iniciar" debe deshabilitarse
   - El botón "Detener" debe habilitarse

2. **Alerta de tiempo:**
   - Configura 15 segundos
   - Inicia el temporizador y espera hasta que queden 10 segundos o menos
   - El display debe ponerse ROJO y hacer animación de pulso
   - La barra también debe cambiar a rojo

3. **Detener temporizador:**
   - Inicia un temporizador
   - Haz clic en "Detener" a mitad del tiempo
   - El temporizador debe pausarse (no avanzar)
   - Los botones deben volver a su estado normal

4. **Reiniciar temporizador:**
   - Inicia un temporizador y déjalo avanzar
   - Haz clic en "Reiniciar"
   - El display debe volver a "00:00"
   - La barra debe volver a 0%
   - Todas las clases de alerta deben removerse

5. **Fin del temporizador:**
   - Configura 5 segundos
   - Deja que el temporizador llegue a 0
   - Debe detenerse automáticamente
   - Debe mostrar una alerta de navegador "⏰ ¡Tiempo terminado!"

#### 8.3 Pruebas de manejo de errores

1. **Simular error simple:**
   - Haz clic en "Simular Error"
   - Debe aparecer en el log: "Intentando operación que fallará..."
   - Debe capturar el error y mostrar: "❌ Error capturado: Error al cargar API"
   - Debe mostrar: "ℹ️ El error fue manejado correctamente con try/catch"
   - NO debe haber errores en la consola (todo fue manejado)

2. **Reintentos automáticos:**
   - Haz clic en "Reintentos Automáticos"
   - Debe mostrar: "Iniciando 3 intentos..."
   - Observa el log: debe mostrar cada intento (1/3, 2/3, 3/3)
   - Si un intento falla, debe mostrar el tiempo de espera antes del siguiente (500ms, 1000ms, 2000ms)
   - Si tiene éxito en algún intento, debe detenerse y no hacer más intentos
   - Si todos fallan, debe mostrar: "💥 Todos los intentos fallaron"

#### 8.4 Pruebas técnicas

1. **Consola sin errores:**
   - Abre DevTools (F12) → pestaña Console
   - Realiza todas las acciones anteriores
   - NO debe haber errores en rojo en la consola

2. **Promesas y async/await:**
   - Abre DevTools → pestaña Sources
   - Busca tu archivo `app.js`
   - Verifica que uses `async/await` en lugar de `.then()`
   - Verifica que uses `Promise.all()` en la carga paralela

3. **setInterval y clearInterval:**
   - Inicia el temporizador y ábrelo en Sources
   - Detén el temporizador
   - Verifica que NO queden intervalos activos (el display no debe seguir actualizándose)

4. **Manejo de estados:**
   - Intenta hacer clic en "Iniciar" múltiples veces seguidas
   - Solo debe crearse UN intervalo (verifica que el botón se deshabilite)
   - El tiempo no debe avanzar más rápido de lo normal

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Estructura del proyecto** - Explorador de archivos
2. **Carga secuencial** - Log mostrando las 3 peticiones ejecutándose una tras otra con tiempos
3. **Carga paralela** - Log mostrando Promise.all ejecutando simultáneamente
4. **Comparativa de tiempos** - Diferencia visible entre secuencial y paralelo
5. **Temporizador funcionando** - Display y barra de progreso actualizándose
6. **Manejo de errores** - Error capturado y mostrado en la UI
7. **Consola limpia** - DevTools sin errores
8. **Código fuente** - Capturas de async/await y Promise.all

### Formato del README

```markdown
### 1. Carga secuencial vs paralela
![Comparativa](assets/01-comparativa.png)
**Descripción:** La carga secuencial tomó 4.5s (suma de delays individuales), mientras que la paralela tomó 1.8s (el delay más largo)...

### 2. Temporizador en acción
![Temporizador](assets/02-temporizador.png)
**Descripción:** Temporizador de 30 segundos con barra de progreso actualizándose cada segundo...

### 3. Manejo de errores
![Error](assets/03-error.png)
**Descripción:** Error capturado con try/catch y mostrado en la interfaz de usuario...
```

---

## 9. Entregables

### 9.1 Estructura del repositorio

El estudiante deberá subir su solución en GitHub respetando la siguiente estructura:

```
/05-asincronia
  ├── index.html
  ├── css/
  │     └── styles.css
  ├── js/
  │     └── app.js
  ├── assets/
  │     ├── 01-comparativa.png
  │     ├── 02-temporizador.png
  │     ├── 03-error.png
  │     └── ...
  └── README.md
```

### 9.2 README (informe)

Debe incluir:

- **Descripción breve** del simulador implementado
- **Fragmentos de código** de las funciones principales
- **Imágenes** insertadas correctamente desde `/assets`
- **Análisis** de la diferencia de tiempo entre carga secuencial y paralela

#### 9.2.1 Código destacado

Ejemplos de las funciones principales:
- Función que retorna promesa con setTimeout
- Carga secuencial con await consecutivos
- Carga paralela con Promise.all
- Manejo de errores con try/catch
- Temporizador con setInterval

#### 9.2.2 Capturas

1. Comparativa secuencial vs paralelo con tiempos
2. Temporizador funcionando con barra de progreso
3. Error capturado y mostrado en UI

