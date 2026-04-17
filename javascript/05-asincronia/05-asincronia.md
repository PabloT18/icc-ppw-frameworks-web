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

### Paso 2: Funciones base (copiar como referencia)

#### 2.1 Estructura HTML base

En `index.html`:

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
  <div class="container">
    <h1>Simulador de Operaciones Asíncronas</h1>
    
    <div class="controles">
      <button id="btn-secuencial">Carga Secuencial</button>
      <button id="btn-paralelo">Carga Paralela</button>
      <button id="btn-error">Simular Error</button>
    </div>

    <div id="resultados"></div>
    <div id="log"></div>

    <div class="temporizador">
      <h2>Temporizador</h2>
      <input type="number" id="tiempo-input" min="1" max="300" value="10">
      <div id="display">00:00</div>
      <div class="barra-container">
        <div id="barra-progreso"></div>
      </div>
      <div class="timer-controles">
        <button id="btn-iniciar">Iniciar</button>
        <button id="btn-detener">Pausar</button>
        <button id="btn-reiniciar">Reiniciar</button>
      </div>
    </div>
  </div>

  <script defer src="js/app.js"></script>
</body>
</html>
```

#### 2.2 Funciones que simulan APIs (copiar y entender)

En `app.js`, crear funciones que retornan promesas:

```javascript
'use strict';

// Simular petición a una API con delay
function simularPeticion(nombre, tiempoMin = 500, tiempoMax = 2000, fallar = false) {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * (tiempoMax - tiempoMin) + tiempoMin;
    
    setTimeout(() => {
      if (fallar) {
        reject(new Error(`Error al cargar ${nombre}`));
      } else {
        resolve({
          nombre,
          datos: `Datos de ${nombre}`,
          timestamp: new Date().toISOString(),
          delay: Math.round(delay)
        });
      }
    }, delay);
  });
}

// Función helper para formatear tiempo
function formatearTiempo(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

// Función helper para mostrar log en UI
function mostrarLog(mensaje, tipo = 'info') {
  const log = document.getElementById('log');
  const entrada = document.createElement('div');
  entrada.className = `log-entry log-entry--${tipo}`;
  
  const timestamp = document.createElement('span');
  timestamp.className = 'log-timestamp';
  timestamp.textContent = `[${new Date().toLocaleTimeString()}]`;
  
  const texto = document.createElement('span');
  texto.textContent = mensaje;
  
  entrada.appendChild(timestamp);
  entrada.appendChild(texto);
  log.appendChild(entrada);
  log.scrollTop = log.scrollHeight;
}
```

### Paso 3: Carga secuencial (debes implementar)

#### 3.1 Implementar carga secuencial

```javascript
// TODO: Crear función async cargarSecuencial() que:
// 1. Muestre un log de inicio
// 2. Mida el tiempo con performance.now()
// 3. Use await para cargar 3 recursos uno tras otro
// 4. Muestre cada resultado en el log
// 5. Calcule y muestre el tiempo total

async function cargarSecuencial() {
  mostrarLog('🔄 Iniciando carga secuencial...', 'info');
  const inicio = performance.now();

  try {
    // TODO: await simularPeticion('Usuarios')
    // TODO: mostrar resultado con mostrarLog()
    
    // TODO: await simularPeticion('Productos')
    // TODO: mostrar resultado
    
    // TODO: await simularPeticion('Pedidos')
    // TODO: mostrar resultado

  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, 'error');
  }

  const total = Math.round(performance.now() - inicio);
  mostrarLog(`✅ Secuencial completado en ${formatearTiempo(total)}`, 'success');
}

// Conectar evento
document.getElementById('btn-secuencial').addEventListener('click', cargarSecuencial);
```

### Paso 4: Carga paralela (debes implementar)

#### 4.1 Implementar carga paralela con Promise.all

```javascript
// TODO: Crear función async cargarParalelo() que:
// 1. Use Promise.all() para ejecutar las 3 peticiones simultáneamente
// 2. Mida el tiempo total
// 3. Muestre la diferencia de velocidad vs secuencial

async function cargarParalelo() {
  mostrarLog('🔄 Iniciando carga paralela...', 'info');
  const inicio = performance.now();

  try {
    // TODO: const resultados = await Promise.all([
    //   simularPeticion('Usuarios'),
    //   simularPeticion('Productos'),
    //   simularPeticion('Pedidos')
    // ]);

    // TODO: resultados.forEach(r => mostrarLog(...))

  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, 'error');
  }

  const total = Math.round(performance.now() - inicio);
  mostrarLog(`✅ Paralelo completado en ${formatearTiempo(total)}`, 'success');
}

// Conectar evento
document.getElementById('btn-paralelo').addEventListener('click', cargarParalelo);
```

#### 4.2 Comparativa visual

Agregar en `#resultados` una tabla comparativa mostrando:
- Tiempo secuencial
- Tiempo paralelo
- Diferencia porcentual

### Paso 5: Temporizador (debes implementar)

#### 5.1 Lógica del temporizador

```javascript
let intervaloId = null;
let tiempoRestante = 0;

// Función helper ya proporcionada arriba
function formatearTiempo(segundos) {
  const mins = Math.floor(segundos / 60).toString().padStart(2, '0');
  const segs = (segundos % 60).toString().padStart(2, '0');
  return `${mins}:${segs}`;
}

// TODO: Crear función actualizarDisplay() que:
// 1. Actualice #display con formatearTiempo(tiempoRestante)
// 2. Calcule el porcentaje de progreso
// 3. Actualice el ancho de #barra-progreso

function actualizarDisplay() {
  // Tu código aquí
}

// TODO: Crear función iniciar() que:
// 1. Verifique que no haya un intervalo activo
// 2. Obtenga el tiempo del input
// 3. Use setInterval para decrementar cada segundo
// 4. Cuando llegue a 0, detenga y muestre alerta visual

function iniciar() {
  // Tu código aquí
}

// TODO: Crear función detener() que:
// 1. Use clearInterval(intervaloId)
// 2. Resetee intervaloId a null

function detener() {
  // Tu código aquí
}

// TODO: Crear función reiniciar() que:
// 1. Llame a detener()
// 2. Resetee tiempoRestante a 0
// 3. Resetee la UI (display y barra)

function reiniciar() {
  // Tu código aquí
}

// Conectar eventos
document.getElementById('btn-iniciar').addEventListener('click', iniciar);
document.getElementById('btn-detener').addEventListener('click', detener);
document.getElementById('btn-reiniciar').addEventListener('click', reiniciar);
```

### Paso 6: Manejo de errores (debes implementar)

#### 6.1 Simular error

```javascript
// TODO: Crear función async simularError() que:
// 1. Intente cargar con simularPeticion('API', 500, 1000, true)
// 2. Capture el error con try/catch
// 3. Muestre el error en la UI con mostrarLog()

async function simularError() {
  mostrarLog('🔄 Intentando operación que fallará...', 'info');
  
  try {
    const resultado = await simularPeticion('API Fallida', 500, 1000, true);
    mostrarLog(`Éxito: ${resultado.nombre}`, 'success');
  } catch (error) {
    // TODO: Mostrar error en la UI
    mostrarLog(`${error.message}`, 'error');
  }
}

// Conectar evento
document.getElementById('btn-error').addEventListener('click', simularError);
```

#### 6.2 Reintentos automáticos (opcional)

```javascript
// TODO: Crear función fetchConReintentos() que:
// 1. Intente hasta 3 veces
// 2. Espere más tiempo entre cada intento (backoff exponencial)
// 3. Registre cada intento en el log

async function fetchConReintentos(nombre, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      mostrarLog(`Intento ${i + 1}/${intentos}...`, 'info');
      // TODO: Implementar lógica de reintentos
    } catch (error) {
      // TODO: Si es el último intento, lanzar error
      // TODO: Si no, esperar antes del siguiente intento
    }
  }
}
```

### Paso 7: Estilos CSS

Aplicar estilos para:
- Estados de los botones (activo, deshabilitado, hover)
- Logs con colores según tipo (info, success, error)
- Barra de progreso animada
- Display del temporizador destacado
- Transiciones suaves

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

