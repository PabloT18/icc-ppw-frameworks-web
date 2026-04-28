'use strict';

/**
 * Detectar tipo de dispositivo con matchMedia
 * 
 * @returns {object} Información del dispositivo
 */
export function detectarDispositivo() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
  const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    tipo: isMobile ? 'móvil' : isTablet ? 'tablet' : 'desktop',
    ancho: window.innerWidth,
    alto: window.innerHeight
  };
}

/**
 * Observar cambios en breakpoints
 * 
 * @param {string} query - Media query a observar
 * @param {Function} callback - Función a ejecutar cuando cambia
 * @returns {MediaQueryList} Media query list
 */
export function observarBreakpoint(query, callback) {
  const mediaQuery = window.matchMedia(query);
  
  // Ejecutar callback inicial
  callback(mediaQuery);
  
  // Observar cambios
  mediaQuery.addEventListener('change', callback);
  
  return mediaQuery;
}

/**
 * Detectar preferencia de tema del sistema
 * 
 * @param {Function} callback - Función a ejecutar cuando cambia el tema
 * @returns {MediaQueryList} Media query list
 */
export function observarTemaDelSistema(callback) {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  callback(darkModeQuery.matches ? 'dark' : 'light');
  
  darkModeQuery.addEventListener('change', (e) => {
    callback(e.matches ? 'dark' : 'light');
  });
  
  return darkModeQuery;
}

/**
 * Detectar preferencia de movimiento reducido
 * 
 * @param {Function} callback - Función a ejecutar cuando cambia
 * @returns {MediaQueryList} Media query list
 */
export function observarPreferenciaMovimiento(callback) {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  callback(motionQuery.matches);
  
  motionQuery.addEventListener('change', (e) => {
    callback(e.matches);
  });
  
  return motionQuery;
}

/**
 * Breakpoints comunes
 */
export const BREAKPOINTS = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)'
};

/**
 * Sistema de breakpoints múltiples
 * Observa todos los breakpoints y ejecuta callbacks correspondientes
 * 
 * @param {object} breakpointsConfig - Objeto con queries y callbacks
 * @returns {Array<MediaQueryList>} Array de media queries
 */
export function setupResponsive(breakpointsConfig) {
  const queries = [];
  
  Object.entries(breakpointsConfig).forEach(([name, { query, callback }]) => {
    const mediaQuery = observarBreakpoint(query, (mq) => {
      if (mq.matches) {
        callback(name, mq);
      }
    });
    
    queries.push(mediaQuery);
  });
  
  return queries;
}
