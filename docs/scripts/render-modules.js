/**
 * render-modules.js
 * Módulo para renderizar dinámicamente los módulos y recursos de frameworks
 * Funciona con cualquier framework usando data-framework en el body
 */

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  const frameworkKey = document.body.dataset.framework;
  
  // Validar que existe el framework en los datos
  if (!frameworkKey) {
    console.error('No se especificó data-framework en el body');
    return;
  }
  
  const data = window.frameworksData?.[frameworkKey];
  
  if (!data) {
    console.error(`No existe configuración para el framework: ${frameworkKey}`);
    return;
  }
  
  // Renderizar contenido
  renderModules(data.modules);
  if(data.addons){
    renderModulesComplementarios(data.addons);
  }
  renderResources(data.resources);
  
  // Renderizar features si existen (caso Astro)
  if (data.features) {
    renderFeatures(data.features);
  }
});

// ===== FUNCIÓN PARA RENDERIZAR MÓDULOS =====
function renderModules(modules = []) {
  const container = document.getElementById('modules-container');
  if (!container) return;
  
  // Limpiar contenedor
  container.replaceChildren();
  
  // Crear fragment para mejor rendimiento
  const fragment = document.createDocumentFragment();
  
  modules.forEach(module => {
    const card = createModuleCard(module);
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}



// ===== FUNCIÓN AUXILIAR PARA CREAR CARD DE MÓDULO =====
function createModuleCard(module) {
  const card = document.createElement('div');
  card.className = 'card content-item';
  
  // Título con badge
  const title = document.createElement('h3');
  title.textContent = `${module.number}. ${module.title} `;
  
  const badge = document.createElement('span');
  badge.className = `badge teoria`;
  badge.textContent = module.type === 'teoria' ? 'Teoría' : module.type;
  if(module.type)title.appendChild(badge);
  
  // Descripción
  const description = document.createElement('p');
  description.textContent = module.description;
  
  // Enlaces
  const linksContainer = document.createElement('div');
  linksContainer.className = 'content-links';
  
  module.links.forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.className = 'content-link';
    anchor.textContent = link.text;
    linksContainer.appendChild(anchor);
  });
  
  // Ensamblar card
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(linksContainer);
  
  return card;
}



// ===== FUNCIÓN PARA RENDERIZAR RECURSOS =====
function renderResources(resources = []) {
  const container = document.getElementById('resources-container');
  if (!container) return;
  
  // Limpiar contenedor
  container.replaceChildren();
  
  // Crear fragment para mejor rendimiento
  const fragment = document.createDocumentFragment();
  
  resources.forEach(resource => {
    const card = createResourceCard(resource);
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}

// ===== FUNCIÓN AUXILIAR PARA CREAR CARD DE RECURSO =====
function createResourceCard(resource) {
  const card = document.createElement('div');
  card.className = 'card content-item';
  
  // Título
  const title = document.createElement('h3');
  title.textContent = resource.title;

  const badge = document.createElement('span');
  badge.className = `badge teoria`;
  badge.textContent = resource.type === 'externo' ? 'Externo' : 'Interno';
  title.appendChild(badge);
  
  // Descripción
  const description = document.createElement('p');
  description.textContent = resource.description;
  
  // Enlaces
  const linksContainer = document.createElement('div');
  linksContainer.className = 'content-links';
  
  const anchor = document.createElement('a');
  anchor.href = resource.url;
  anchor.className = 'content-link';
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer'; // Seguridad
  anchor.textContent = 'Ver Recurso';
  
  linksContainer.appendChild(anchor);
  
  // Ensamblar card
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(linksContainer);
  
  return card;
}

// ===== FUNCIÓN PARA RENDERIZAR FEATURES (Opcional - para Astro) =====
function renderFeatures(features = []) {
  const container = document.getElementById('features-container');
  if (!container) return;
  
  // Limpiar contenedor
  container.replaceChildren();
  
  // Crear fragment
  const fragment = document.createDocumentFragment();
  
  features.forEach(feature => {
    const card = createFeatureCard(feature);
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}

// ===== FUNCIÓN AUXILIAR PARA CREAR CARD DE FEATURE =====
function createFeatureCard(feature) {
  const card = document.createElement('div');
  card.className = 'card';
  
  const title = document.createElement('h3');
  title.textContent = feature.title;
  
  const description = document.createElement('p');
  description.textContent = feature.description;
  
  card.appendChild(title);
  card.appendChild(description);
  
  return card;
}


// ===== FUNCIÓN PARA RENDERIZAR MÓDULOS Complementarios =====
function renderModulesComplementarios(modules = []) {
  const container = document.getElementById('modules-container-complementarios');
  if (!container) return;
  
  // Limpiar contenedor
  container.replaceChildren();
  
  // Crear fragment para mejor rendimiento
  const fragment = document.createDocumentFragment();
  
  modules.forEach(module => {
    const card = createModuleCard(module);
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}
