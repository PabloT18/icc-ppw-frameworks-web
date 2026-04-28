'use strict';

/**
 * Debounce - Retrasa la ejecución de una función hasta que
 * el usuario deje de disparar el evento durante un tiempo definido
 * 
 * @param {Function} fn - Función a ejecutar
 * @param {number} delay - Tiempo de espera en ms (default: 300ms)
 * @returns {Function} Función debounced
 * 
 * Ideal para: búsqueda en tiempo real, resize, input
 */
export function debounce(fn, delay = 300) {
  let timer;
  
  return function(...args) {
    // Cancelar el timer anterior si existe
    clearTimeout(timer);
    
    // Crear nuevo timer
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * Throttle - Limita la ejecución de una función a máximo
 * una vez cada X milisegundos
 * 
 * @param {Function} fn - Función a ejecutar
 * @param {number} limit - Intervalo mínimo entre ejecuciones (default: 200ms)
 * @returns {Function} Función throttled
 * 
 * Ideal para: scroll, mousemove, resize continuo
 */
export function throttle(fn, limit = 200) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    // Solo ejecutar si ha pasado el tiempo límite
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Lazy load de imágenes con Intersection Observer
 * 
 * @param {string} selector - Selector de imágenes a observar
 * @param {object} options - Opciones para IntersectionObserver
 */
export function lazyLoadImages(selector = 'img[data-src]', options = {}) {
  const images = document.querySelectorAll(selector);
  
  const defaultOptions = {
    root: null,
    rootMargin: '100px', // Cargar 100px antes de ser visible
    threshold: 0
  };
  
  const observerOptions = { ...defaultOptions, ...options };
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Cargar la imagen real
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          
          // Evento personalizado cuando carga
          img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.dispatchEvent(new CustomEvent('imageLoaded', {
              detail: { src: img.src }
            }));
          });
        }
        
        // Dejar de observar esta imagen
        obs.unobserve(img);
      }
    });
  }, observerOptions);
  
  images.forEach(img => observer.observe(img));
  
  return observer;
}

/**
 * Infinite scroll - Detecta cuando se llega al final de una lista
 * 
 * @param {string} sentinelSelector - Selector del elemento sentinel
 * @param {Function} callback - Función a ejecutar al llegar al final
 * @param {object} options - Opciones para IntersectionObserver
 * @returns {IntersectionObserver} Observer creado
 */
export function infiniteScroll(sentinelSelector, callback, options = {}) {
  const sentinel = document.querySelector(sentinelSelector);
  
  if (!sentinel) {
    console.error(`Sentinel "${sentinelSelector}" no encontrado`);
    return null;
  }
  
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  };
  
  const observerOptions = { ...defaultOptions, ...options };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  }, observerOptions);
  
  observer.observe(sentinel);
  
  return observer;
}

/**
 * Performance: Medir tiempo de ejecución de una función
 * 
 * @param {string} name - Nombre de la medida
 * @param {Function} fn - Función a medir
 * @returns {Promise<{result: any, duration: number}>}
 */
export async function measurePerformance(name, fn) {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  
  performance.mark(startMark);
  
  const result = await fn();
  
  performance.mark(endMark);
  performance.measure(name, startMark, endMark);
  
  const measure = performance.getEntriesByName(name)[0];
  const duration = measure.duration;
  
  // Limpiar marcas
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(name);
  
  return { result, duration };
}

/**
 * DocumentFragment para evitar múltiples reflows
 * Renderiza múltiples elementos de una sola vez
 * 
 * @param {Array} items - Array de items a renderizar
 * @param {Function} renderFn - Función que retorna un HTMLElement
 * @returns {DocumentFragment}
 */
export function createFragment(items, renderFn) {
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const element = renderFn(item);
    if (element instanceof HTMLElement) {
      fragment.appendChild(element);
    }
  });
  
  return fragment;
}

/**
 * RequestAnimationFrame helper para animaciones suaves
 * 
 * @param {Function} callback - Función a ejecutar en cada frame
 * @param {number} duration - Duración en ms (opcional)
 */
export function animate(callback, duration = null) {
  const start = performance.now();
  
  function step(timestamp) {
    let progress = 1;
    
    if (duration) {
      const elapsed = timestamp - start;
      progress = Math.min(elapsed / duration, 1);
    }
    
    const shouldContinue = callback(progress, timestamp);
    
    if (duration && progress < 1) {
      requestAnimationFrame(step);
    } else if (!duration && shouldContinue !== false) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}
