// Datos de contenido para las páginas de frameworks
// Este archivo centraliza todos los enlaces y contenidos para facilitar actualizaciones

const frameworksData = {
  javascript: {
    name: 'JavaScript',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    color: '#F7DF1E',
    description: 'Material Conceptual y Prácticas',
    modules: [
      {
        number: '01',
        title: 'Introducción y Sintaxis',
        description: 'Fundamentos del lenguaje, variables, tipos de datos y operadores.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/01-introduccion-sintaxis/01-introduccion-sintaxis.md' }
        ]
      },
      {
        number: '02',
        title: 'DOM Básico',
        description: 'Manipulación del DOM, selección de elementos y modificación de contenido.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/02-dom-basico/02-dom-basico.md' }
        ]
      },
      {
        number: '03',
        title: 'Eventos',
        description: 'Manejo de eventos del navegador y respuesta a interacciones del usuario.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/03-eventos/03-eventos.md' }
        ]
      },
      {
        number: '04',
        title: 'DOM Avanzado',
        description: 'Técnicas avanzadas de manipulación del DOM y patrones de diseño.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/04-dom-avanzado/04-dom-avanzado.md' }
        ]
      },
      {
        number: '05',
        title: 'Asincronía',
        description: 'Callbacks, Promesas, async/await y manejo de operaciones asíncronas.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/05-asincronia/05-asincronia.md' }
        ]
      },
      {
        number: '06',
        title: 'Fetch API',
        description: 'Consumo de APIs REST, peticiones HTTP y manejo de respuestas.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/06-fetch-api/06-fetch-api.md' }
        ]
      },
      {
        number: '07',
        title: 'Storage',
        description: 'LocalStorage, SessionStorage y persistencia de datos en el navegador.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/07-storage/07-storage.md' }
        ]
      },
      {
        number: '08',
        title: 'Formularios y Validación',
        description: 'Validación de formularios, expresiones regulares y sanitización de datos.',
        type: 'practica',
        links: [
          { text: 'Material Teórico', url: '../javascript/08-formularios-validacion/08-formularios-validacion.md' }
        ]
      },
      {
        number: '09',
        title: 'Módulos y Estructura',
        description: 'ES Modules, organización de código y patrones de arquitectura.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/09-modulos-estructura/09-modulos-estructura.md' }
        ]
      },
      {
        number: '10',
        title: 'Optimización y Buenas Prácticas',
        description: 'Performance, debugging y mejores prácticas de desarrollo.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../javascript/10-optimizacion-buenas-practicas/10-optimizacion-buenas-practicas.md' }
        ]
      },
      {
        number: '11',
        title: 'Proyecto Integrador',
        description: 'Aplicación práctica de todos los conceptos aprendidos.',
        type: 'practica',
        links: [
          { text: 'Material Teórico', url: '../javascript/11-proyecto-integrador/11-proyecto-integrador.md' }
        ]
      }
    ],
    resources: [
      {
        title: 'Documentación Oficial',
        description: 'MDN Web Docs - Referencia completa de JavaScript',
        url: 'https://developer.mozilla.org/es/docs/Web/JavaScript'
      },
      {
        title: 'JavaScript.info',
        description: 'Tutorial moderno y completo de JavaScript',
        url: 'https://javascript.info'
      },
      {
        title: 'Eloquent JavaScript',
        description: 'Libro gratuito sobre programación en JavaScript',
        url: 'https://eloquentjavascript.net'
      }
    ]
  },
  
  angular: {
    name: 'Angular',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg',
    color: '#DD0031',
    description: 'Material Conceptual y Prácticas',
    modules: [
      {
        number: '01',
        title: 'Instalación y Configuración',
        description: 'Configuración del entorno de desarrollo y primeros pasos con Angular CLI.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/01-instalacion_configuracio/01-instalacion_configuracio.md' }
        ]
      },
      {
        number: '02',
        title: 'Fundamentos',
        description: 'Componentes, templates, data binding y directivas básicas.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/02-fundamentos/02-fundamentos.md' },
          { text: 'Práctica', url: '../angular/02-fundamentos/02-fundamentos-practica.md' },
          { text: 'Archivo HTML', url: '../angular/02-fundamentos/02-fundamentos-file-1.html' }
        ]
      },
      {
        number: '03',
        title: 'Navegación',
        description: 'Routing, navegación entre vistas y parámetros de ruta.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/03-Navegacion/03-Navegacion.md' }
        ]
      },
      {
        number: '04',
        title: 'Formularios',
        description: 'Formularios reactivos, validación y manejo de datos.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/04-Formularios/04-Formularios.md' }
        ]
      },
      {
        number: '05',
        title: 'UI y Heurísticas',
        description: 'Principios de usabilidad y heurísticas de Nielsen aplicadas.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/05-UI-Heuristicas/05-UI-Heuristicas.md' }
        ]
      },
      {
        number: '06',
        title: 'Implementación de Heurísticas',
        description: 'Aplicación práctica de principios de usabilidad.',
        type: 'practica',
        links: [
          { text: 'Material Teórico', url: '../angular/06-UI-Heuristicas-impl/06-UI-Heuristicas-impl.md' }
        ]
      },
      {
        number: '07',
        title: 'Estilos',
        description: 'CSS, SCSS y estilos en componentes Angular.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/07-Estilos/07-Estilos.md' }
        ]
      },
      {
        number: '08',
        title: 'Estilos, Temas y Componentes',
        description: 'Angular Material, temas personalizados y componentes reutilizables.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/08-Estilos-Tema-Componentes/08-Estilos-Tema-Componentes.md' }
        ]
      },
      {
        number: '09',
        title: 'Consumo de Servicios',
        description: 'HttpClient, servicios REST y manejo de datos externos.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/09-Consumos_servicos/09-Consumos_servicos.md' }
        ]
      },
      {
        number: '10',
        title: 'Mejoras Visuales',
        description: 'Animaciones, transiciones y efectos visuales.',
        type: 'practica',
        links: [
          { text: 'Material Teórico', url: '../angular/10-mejoras-vsuales/10-mejoras-vsuales.md' }
        ]
      },
      {
        number: '11',
        title: 'Firebase',
        description: 'Integración con Firebase, autenticación y base de datos en tiempo real.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/11-firebase/11-firebase.md' }
        ]
      },
      {
        number: '12',
        title: 'Guards y Seguridad de Rutas',
        description: 'Protección de rutas, autenticación y autorización.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../angular/12-guards-seguridad-rutas/12-guards-seguridad-rutas.md' }
        ]
      }
    ],
    resources: [
      {
        title: 'Documentación Oficial',
        description: 'Guías y referencias completas de Angular',
        url: 'https://angular.dev'
      },
      {
        title: 'Angular Material',
        description: 'Componentes UI basados en Material Design',
        url: 'https://material.angular.io'
      },
      {
        title: 'RxJS',
        description: 'Programación reactiva con Observables',
        url: 'https://rxjs.dev'
      }
    ]
  },

  astro: {
    name: 'Astro',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg',
    color: '#FF5D01',
    description: 'Material Conceptual y Prácticas',
    modules: [
      {
        number: '01',
        title: 'Instalación y Configuración',
        description: 'Configuración del entorno de desarrollo y primeros pasos con Astro.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../astro/01-instalacion_configuracio-astro.md' }
        ]
      },
      {
        number: '02',
        title: 'Fundamentos',
        description: 'Componentes, layouts y arquitectura de islas.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../astro/02-fundamentos-astro.md' }
        ]
      },
      {
        number: '03',
        title: 'Navegación',
        description: 'Routing, páginas dinámicas y generación de sitios estáticos.',
        type: 'teoria',
        links: [
          { text: 'Material Teórico', url: '../astro/03-navegacion-astro.md' }
        ]
      }
    ],
    features: [
      {
        title: 'Zero JavaScript por defecto',
        description: 'Envía solo el JavaScript necesario al cliente.'
      },
      {
        title: 'Arquitectura de Islas',
        description: 'Hidratación parcial solo donde se necesita interactividad.'
      },
      {
        title: 'Framework Agnóstico',
        description: 'Usa React, Vue, Svelte o cualquier framework en el mismo proyecto.'
      },
      {
        title: 'Optimización Automática',
        description: 'Optimización de imágenes, CSS y assets sin configuración.'
      }
    ],
    resources: [
      {
        title: 'Documentación Oficial',
        description: 'Guías completas y referencias de Astro',
        url: 'https://docs.astro.build'
      },
      {
        title: 'Temas y Plantillas',
        description: 'Colección de temas y plantillas para Astro',
        url: 'https://astro.build/themes'
      },
      {
        title: 'Integraciones',
        description: 'Plugins y integraciones oficiales',
        url: 'https://astro.build/integrations'
      },
      {
        title: 'Astro en GitHub',
        description: 'Repositorio oficial y código fuente',
        url: 'https://github.com/withastro/astro'
      }
    ]
  }
};

// Función auxiliar para generar el HTML de los módulos
function generateModulesHTML(modules) {
  return modules.map(module => `
    <div class="card">
      <h3>${module.number}. ${module.title} <span class="badge ${module.type}">${module.type === 'teoria' ? 'Teoría' : 'Práctica'}</span></h3>
      <p>${module.description}</p>
      <div class="content-links">
        ${module.links.map(link => `<a href="${link.url}" class="content-link">${link.text}</a>`).join('\n        ')}
      </div>
    </div>
  `).join('\n');
}

// Función auxiliar para generar el HTML de recursos
function generateResourcesHTML(resources) {
  return resources.map(resource => `
    <div class="card">
      <h3>${resource.title}</h3>
      <p>${resource.description}</p>
      <div class="content-links">
        <a href="${resource.url}" class="content-link" target="_blank">Ver Recurso</a>
      </div>
    </div>
  `).join('\n');
}
