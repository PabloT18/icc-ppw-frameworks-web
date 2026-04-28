'use strict';

// ===========================================
// Debounce
// ===========================================
function debounce(fn, delay = 300) {
  let timer;
  
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ===========================================
// Throttle
// ===========================================
function throttle(fn, limit = 200) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// ===========================================
// Estado
// ===========================================
let countSinDebounce = 0;
let countConDebounce = 0;
let countSinThrottle = 0;
let countConThrottle = 0;

// ===========================================
// Demo 1: Debounce
// ===========================================
const inputSearch = document.getElementById('search-debounce');

// Sin debounce (se ejecuta en cada tecla)
inputSearch.addEventListener('input', (e) => {
  countSinDebounce++;
  document.getElementById('count-sin-debounce').textContent = countSinDebounce;
});

// Con debounce (se ejecuta solo cuando dejas de escribir)
inputSearch.addEventListener('input', debounce((e) => {
  countConDebounce++;
  document.getElementById('count-con-debounce').textContent = countConDebounce;
  
  // Aquí iría la petición a la API
  console.log('🔍 Buscando:', e.target.value);
}, 300));

// ===========================================
// Demo 2: Throttle
// ===========================================
const scrollBox = document.getElementById('scroll-box');

// Sin throttle (se ejecuta constantemente)
scrollBox.addEventListener('scroll', (e) => {
  countSinThrottle++;
  document.getElementById('count-sin-throttle').textContent = countSinThrottle;
});

// Con throttle (se ejecuta máximo cada 200ms)
scrollBox.addEventListener('scroll', throttle((e) => {
  countConThrottle++;
  document.getElementById('count-con-throttle').textContent = countConThrottle;
  
  const position = e.target.scrollTop;
  document.getElementById('scroll-position').textContent = `${Math.round(position)}px`;
  
  console.log('📜 Scroll position:', position);
}, 200));

// ===========================================
// Logs iniciales
// ===========================================
console.log('✅ Min Example cargado');
console.log('Prueba escribir en el input y hacer scroll en la caja');
console.log('Observa la diferencia en el número de ejecuciones');
