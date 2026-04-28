'use strict';

// Importar utilidades
import {
    createFragment,
    debounce,
    infiniteScroll,
    lazyLoadImages,
    measurePerformance,
    throttle
} from './utils/performance.js';

import {
    anunciar,
    detectarPreferencias,
    mostrarErrorAccesible,
    openAccessibleModal
} from './utils/accessibility.js';

import {
    detectarDispositivo,
    observarPreferenciaMovimiento,
    observarTemaDelSistema
} from './utils/responsive.js';

// ===========================================
// Estado de la aplicación
// ===========================================
let state = {
  debounceCount: 0,
  throttleCount: 0,
  imagesLoaded: 0,
  imagesTotal: 20,
  currentPage: 1,
  itemsCount: 0,
  loading: false,
  counter: 0,
  theme: 'auto',
  modalOpen: false
};

// ===========================================
// API Mock
// ===========================================
const API_URL = 'https://jsonplaceholder.typicode.com';

async function fetchPosts(query = '', page = 1, limit = 20) {
  const response = await fetch(`${API_URL}/posts?_page=${page}&_limit=${limit}`);
  const posts = await response.json();
  
  if (query) {
    return posts.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.body.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  return posts;
}

// ===========================================
// 1. Búsqueda con Debounce
// ===========================================
async function buscarPosts(termino) {
  state.debounceCount++;
  document.getElementById('debounce-count').textContent = state.debounceCount;
  
  const statusEl = document.getElementById('search-status');
  const resultsContainer = document.getElementById('search-results');
  
  if (!termino.trim()) {
    resultsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><p>Escribe para buscar...</p></div>';
    statusEl.textContent = 'Esperando búsqueda...';
    return;
  }
  
  statusEl.textContent = 'Buscando...';
  
  try {
    const { result: posts, duration } = await measurePerformance('search', async () => {
      return await fetchPosts(termino, 1, 100);
    });
    
    // Actualizar performance stat
    document.getElementById('perf-search').textContent = `${duration.toFixed(2)}ms`;
    
    renderResultados(posts);
    statusEl.textContent = `${posts.length} resultado(s) encontrado(s)`;
    
    anunciar(`Se encontraron ${posts.length} resultados para ${termino}`);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    resultsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Error al buscar</p></div>';
    statusEl.textContent = 'Error en búsqueda';
  }
}

function renderResultados(posts) {
  const container = document.getElementById('search-results');
  
  if (posts.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>No se encontraron resultados</p></div>';
    return;
  }
  
  // Usar fragment para un solo reflow
  const fragment = createFragment(posts.slice(0, 10), (post) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const title = document.createElement('h3');
    title.textContent = post.title;
    
    const body = document.createElement('p');
    body.textContent = post.body.slice(0, 150) + '...';
    
    card.appendChild(title);
    card.appendChild(body);
    
    return card;
  });
  
  container.innerHTML = '';
  container.appendChild(fragment);
}

// ===========================================
// 2. Scroll con Throttle
// ===========================================
function handleScroll(e) {
  state.throttleCount++;
  document.getElementById('throttle-count').textContent = state.throttleCount;
  
  const scrollArea = e.target;
  const scrollPosition = scrollArea.scrollTop;
  const scrollHeight = scrollArea.scrollHeight - scrollArea.clientHeight;
  const scrollPercent = (scrollPosition / scrollHeight) * 100;
  
  document.getElementById('scroll-position').textContent = `${Math.round(scrollPosition)}px`;
  document.getElementById('scroll-progress').textContent = `${Math.round(scrollPercent)}%`;
}

// ===========================================
// 3. Lazy Loading de Imágenes
// ===========================================
function setupLazyLoading() {
  const gallery = document.getElementById('gallery');
  
  // Generar imágenes (usando picsum.photos)
  for (let i = 1; i <= state.imagesTotal; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.setAttribute('data-src', `https://picsum.photos/300/300?random=${i}`);
    img.alt = `Imagen ${i}`;
    img.className = 'image-loading';
    
    // Placeholder mientras carga
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.textContent = '⏳';
    
    item.appendChild(placeholder);
    item.appendChild(img);
    gallery.appendChild(item);
    
    // Event listener para cuando carga
    img.addEventListener('imageLoaded', () => {
      state.imagesLoaded++;
      document.getElementById('images-loaded').textContent = state.imagesLoaded;
      placeholder.remove();
      img.classList.remove('image-loading');
    });
  }
  
  // Iniciar lazy loading
  lazyLoadImages('img[data-src]', { rootMargin: '100px' });
}

// ===========================================
// 4. Infinite Scroll
// ===========================================
async function cargarMasItems() {
  if (state.loading) return;
  
  state.loading = true;
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
  
  try {
    const posts = await fetchPosts('', state.currentPage, 20);
    
    if (posts.length === 0) {
      loader.innerHTML = '<p>No hay más items</p>';
      return;
    }
    
    renderPosts(posts);
    
    state.currentPage++;
    state.itemsCount += posts.length;
    
    document.getElementById('current-page').textContent = state.currentPage;
    document.getElementById('items-count').textContent = state.itemsCount;
  } catch (error) {
    console.error('Error cargando items:', error);
  } finally {
    state.loading = false;
    loader.style.display = 'none';
  }
}

function renderPosts(posts) {
  const container = document.getElementById('posts-list');
  
  const { result: fragment, duration } = measurePerformanceSync('render-posts', () => {
    return createFragment(posts, (post) => {
      const card = document.createElement('div');
      card.className = 'post-card';
      
      const id = document.createElement('div');
      id.className = 'post-card__id';
      id.textContent = `#${post.id}`;
      
      const title = document.createElement('h3');
      title.textContent = post.title;
      
      const body = document.createElement('p');
      body.textContent = post.body;
      
      card.appendChild(id);
      card.appendChild(title);
      card.appendChild(body);
      
      return card;
    });
  });
  
  container.appendChild(fragment);
  
  // Actualizar performance
  document.getElementById('perf-render').textContent = `${duration.toFixed(2)}ms`;
}

function measurePerformanceSync(name, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;
  
  return { result, duration };
}

// ===========================================
// 5. Responsive con matchMedia
// ===========================================
function setupResponsive() {
  // Detectar dispositivo inicial
  actualizarInfoDispositivo();
  
  // Observar tema del sistema
  observarTemaDelSistema((tema) => {
    if (state.theme === 'auto') {
      aplicarTema(tema);
    }
    document.getElementById('system-theme').textContent =
      tema === 'dark' ? 'Oscuro' : 'Claro';
  });
  
  // Observar preferencia de movimiento
  observarPreferenciaMovimiento((reducido) => {
    document.getElementById('motion-preference').textContent =
      reducido ? 'Reducir movimiento' : 'Movimiento normal';
  });
  
  // Observar cambios de tamaño
  window.addEventListener('resize', debounce(() => {
    actualizarInfoDispositivo();
  }, 300));
}

function actualizarInfoDispositivo() {
  const dispositivo = detectarDispositivo();
  
  document.getElementById('device-type').textContent =
    `${dispositivo.tipo} (${dispositivo.ancho}x${dispositivo.alto})`;
  
  document.getElementById('screen-resolution').textContent =
    `${window.screen.width}x${window.screen.height}`;
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  document.getElementById('theme-icon').textContent = tema === 'dark' ? '☀️' : '🌙';
  document.getElementById('theme-status').textContent =
    `Tema: ${tema === 'dark' ? 'Oscuro' : 'Claro'}`;
}

// ===========================================
// 6. Accesibilidad
// ===========================================
function setupAccessibility() {
  // Modal
  const btnOpenModal = document.getElementById('btn-open-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  
  btnOpenModal.addEventListener('click', () => {
    const modalControls = openAccessibleModal(modalOverlay, btnOpenModal);
    state.modalOpen = true;
    
    // Botones del modal
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-modal-cancel');
    
    const closeModal = () => {
      modalControls.close();
      modalControls.removeEscapeListener();
      state.modalOpen = false;
      anunciar('Modal cerrado');
    };
    
    btnClose.addEventListener('click', closeModal, { once: true });
    btnCancel.addEventListener('click', closeModal, { once: true });
    
    anunciar('Modal abierto');
  });
  
  // Formulario con validación
  const form = document.getElementById('demo-form');
  const inputNombre = document.getElementById('nombre');
  const inputEmail = document.getElementById('email');
  
  inputNombre.addEventListener('blur', () => {
    const valor = inputNombre.value.trim();
    const esValido = valor.length >= 3;
    mostrarErrorAccesible(
      inputNombre,
      'El nombre debe tener al menos 3 caracteres',
      esValido
    );
  });
  
  inputEmail.addEventListener('blur', () => {
    const valor = inputEmail.value.trim();
    const esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    mostrarErrorAccesible(
      inputEmail,
      'Ingresa un email válido',
      esValido
    );
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    anunciar('Formulario enviado correctamente');
    form.reset();
  });
  
  // Contador
  const btnIncrement = document.getElementById('btn-increment');
  const btnDecrement = document.getElementById('btn-decrement');
  const counterEl = document.getElementById('counter');
  
  btnIncrement.addEventListener('click', () => {
    state.counter++;
    counterEl.textContent = state.counter;
    anunciar(`Contador: ${state.counter}`);
  });
  
  btnDecrement.addEventListener('click', () => {
    state.counter--;
    counterEl.textContent = state.counter;
    anunciar(`Contador: ${state.counter}`);
  });
}

// ===========================================
// 7. Performance Monitoring
// ===========================================
function setupPerformanceMonitoring() {
  const btnBenchmark = document.getElementById('btn-benchmark');
  const resultsEl = document.getElementById('benchmark-results');
  
  btnBenchmark.addEventListener('click', async () => {
    resultsEl.textContent = 'Ejecutando benchmark...\n';
    
    // Test 1: Render con innerHTML vs createElement
    const test1 = await testRenderMethods();
    resultsEl.textContent += test1 + '\n\n';
    
    // Test 2: Múltiples reflows vs un solo reflow
    const test2 = await testReflows();
    resultsEl.textContent += test2 + '\n\n';
    
    anunciar('Benchmark completado');
  });
}

async function testRenderMethods() {
  const iterations = 1000;
  const items = Array.from({ length: iterations }, (_, i) => `Item ${i}`);
  
  // Test con innerHTML
  const { duration: innerHTMLTime } = await measurePerformance('innerHTML-test', () => {
    const container = document.createElement('div');
    container.innerHTML = items.map(item => `<div>${item}</div>`).join('');
    return container;
  });
  
  // Test con createElement
  const { duration: createElementTime } = await measurePerformance('createElement-test', () => {
    const container = document.createElement('div');
    items.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item;
      container.appendChild(div);
    });
    return container;
  });
  
  // Test con fragment
  const { duration: fragmentTime } = await measurePerformance('fragment-test', () => {
    const container = document.createElement('div');
    const fragment = createFragment(items, (item) => {
      const div = document.createElement('div');
      div.textContent = item;
      return div;
    });
    container.appendChild(fragment);
    return container;
  });
  
  return `Test de Render (${iterations} elementos):
  innerHTML:     ${innerHTMLTime.toFixed(2)}ms
  createElement: ${createElementTime.toFixed(2)}ms  
  Fragment:      ${fragmentTime.toFixed(2)}ms`;
}

async function testReflows() {
  // Test múltiples reflows
  const { duration: multipleReflows } = await measurePerformance('multiple-reflows', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    for (let i = 0; i < 100; i++) {
      const div = document.createElement('div');
      div.textContent = `Item ${i}`;
      container.appendChild(div);
      // Forzar reflow leyendo offsetHeight
      const height = container.offsetHeight;
    }
    
    container.remove();
  });
  
  // Test un solo reflow
  const { duration: singleReflow } = await measurePerformance('single-reflow', () => {
    const container = document.createElement('div');
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < 100; i++) {
      const div = document.createElement('div');
      div.textContent = `Item ${i}`;
      fragment.appendChild(div);
    }
    
    document.body.appendChild(container);
    container.appendChild(fragment);
    container.remove();
  });
  
  return `Test de Reflows (100 elementos):
  Múltiples reflows: ${multipleReflows.toFixed(2)}ms
  Un solo reflow:    ${singleReflow.toFixed(2)}ms
  Mejora:            ${((multipleReflows - singleReflow) / multipleReflows * 100).toFixed(1)}%`;
}

// ===========================================
// Inicialización
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Aplicación iniciada');
  
  // 1. Búsqueda con debounce
  const searchInput = document.getElementById('search-debounce');
  searchInput.addEventListener('input', debounce((e) => {
    buscarPosts(e.target.value);
  }, 400));
  
  // 2. Scroll con throttle
  const scrollArea = document.getElementById('scroll-area');
  scrollArea.addEventListener('scroll', throttle(handleScroll, 200));
  
  // 3. Lazy loading
  setupLazyLoading();
  
  // 4. Infinite scroll
  infiniteScroll('#sentinel', cargarMasItems, { rootMargin: '200px' });
  cargarMasItems(); // Carga inicial
  
  // 5. Responsive
  setupResponsive();
  
  // 6. Accesibilidad
  setupAccessibility();
  
  // 7. Performance monitoring
  setupPerformanceMonitoring();
  
  // Toggle de tema manual
  document.getElementById('btn-toggle-theme').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    state.theme = newTheme;
    aplicarTema(newTheme);
    anunciar(`Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`);
  });
  
  // Detectar preferencias iniciales
  const preferencias = detectarPreferencias();
  console.log('Preferencias del usuario:', preferencias);
  
  anunciar('Aplicación cargada y lista');
});
