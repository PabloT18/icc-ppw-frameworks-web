'use strict';

/* =========================
   1. SELECTORES DEL DOM
========================= */

// Botón que dispara la petición
const btn = document.querySelector('#btn-cargar');

// Contenedor donde se van a renderizar las cards
const contenedor = document.querySelector('#contenedor');

// Elemento visual de carga
const loading = document.querySelector('#loading');

// Endpoint (API pública de Simpsons)
const URL = 'https://thesimpsonsapi.com/api/characters';



/* =========================
   2. EVENTO
========================= */

// Escuchamos el evento "click" del botón
// Cuando el usuario hace click, se ejecuta la función cargarDatos
btn.addEventListener('click', cargarDatos);


/* =========================
   3. FETCH (GET)
========================= */

// Se declara como async porque vamos a usar await dentro
// async permite trabajar con promesas de forma secuencial
async function cargarDatos() {
  try {
    // Mostrar el loading (quitamos la clase que lo oculta)
    // classList.remove elimina la clase CSS "oculto"
    loading.classList.remove('oculto');

    // Limpiar contenido previo
    contenedor.innerHTML = '';

    // Petición HTTP GET
    // fetch devuelve una Promise con la respuesta del servidor
    const response = await fetch(URL);

    // fetch NO lanza error en 404 o 500
    // por eso se valida manualmente con response.ok
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // Convertir la respuesta a JSON
    // también retorna una Promise → se usa await
    const data = await response.json();

    // IMPORTANTE: la lista está en data.results
    renderizar(data.results);


  } catch (error) {
    // Captura errores:
    // - errores de red
    // - errores manuales (throw)
    mostrarError(error.message);

  } finally {
    // Este bloque SIEMPRE se ejecuta
    // haya error o no
    // Se usa para limpiar estado (ocultar loading)
    loading.classList.add('oculto');
  }
}


/* =========================
   4. RENDERIZADO
========================= */

// Construye dinámicamente el HTML con createElement
// NO usa innerHTML → evita problemas de seguridad
function renderizar(lista) {

  // Recorremos cada elemento de la API
  lista.forEach(item => {

    // Crear contenedor de card
    const card = document.createElement('div');
    card.className = 'card';

       // La API devuelve ruta relativa → hay que completar la URL
    const bloqueImagen = document.createElement('div');
    bloqueImagen.className = 'card-imagen';
    const img = document.createElement('img');
    img.src = `https://cdn.thesimpsonsapi.com/500${item.portrait_path}`;
    img.alt = item.name;
    img.width = 100;

    
    bloqueImagen.appendChild(img);

    const bloqueTexto = document.createElement('div');
    bloqueTexto.className = 'card-contenido';

    const nombre = document.createElement('h3');
    nombre.textContent = item.name;

    const ocupacion = document.createElement('p');
    ocupacion.textContent = item.occupation || 'Sin ocupación';

    bloqueTexto.appendChild(nombre);
    bloqueTexto.appendChild(ocupacion);

    card.appendChild(bloqueImagen);
    card.appendChild(bloqueTexto);


    // Insertar en el DOM
    contenedor.appendChild(card);
  });
}


/* =========================
   5. MANEJO DE ERRORES
========================= */

// Muestra un mensaje en pantalla si algo falla
function mostrarError(mensaje) {
  const p = document.createElement('p');
  p.textContent = mensaje;
  p.style.color = 'red';

  contenedor.appendChild(p);
}