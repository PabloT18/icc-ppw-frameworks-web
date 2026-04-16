/**
 * content-data.js
 * Datos de contenido para las páginas de frameworks
 * Este archivo centraliza todos los enlaces y contenidos para facilitar actualizaciones
 * SOLO DATOS - Sin lógica de renderizado
 */

// Exponer datos globalmente para que render-modules.js pueda accederlos
url_git = "https://github.com/PabloT18/icc-ppw-frameworks-web/blob/main/";
window.frameworksData = {
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
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/01-introduccion-sintaxis/01-introduccion-sintaxis.md' }
        ]
      },
      {
        number: '02',
        title: 'DOM Básico',
        description: 'Manipulación del DOM, selección de elementos y modificación de contenido.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/02-dom-basico/02-dom-basico.md' }
        ]
      },
      {
        number: '03',
        title: 'Eventos',
        description: 'Manejo de eventos del navegador y respuesta a interacciones del usuario.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/03-eventos/03-eventos.md' }
        ]
      },
      {
        number: '04',
        title: 'DOM Avanzado',
        description: 'Técnicas avanzadas de manipulación del DOM y patrones de diseño.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/04-dom-avanzado/04-dom-avanzado.md' }
        ]
      },
      {
        number: '05',
        title: 'Asincronía',
        description: 'Callbacks, Promesas, async/await y manejo de operaciones asíncronas.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/05-asincronia/05-asincronia.md' }
        ]
      },
      {
        number: '06',
        title: 'Fetch API',
        description: 'Consumo de APIs REST, peticiones HTTP y manejo de respuestas.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/06-fetch-api/06-fetch-api.md' }
        ]
      },
      {
        number: '07',
        title: 'Storage',
        description: 'LocalStorage, SessionStorage y persistencia de datos en el navegador.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/07-storage/07-storage.md' }
        ]
      },
      {
        number: '08',
        title: 'Formularios y Validación',
        description: 'Validación de formularios, expresiones regulares y sanitización de datos.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/08-formularios-validacion/08-formularios-validacion.md' }
        ]
      },
      {
        number: '09',
        title: 'Módulos y Estructura',
        description: 'ES Modules, organización de código y patrones de arquitectura.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/09-modulos-estructura/09-modulos-estructura.md' }
        ]
      },
      {
        number: '10',
        title: 'Optimización y Buenas Prácticas',
        description: 'Performance, debugging y mejores prácticas de desarrollo.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/10-optimizacion-buenas-practicas/10-optimizacion-buenas-practicas.md' }
        ]
      },
      {
        number: '11',
        title: 'Proyecto Integrador',
        description: 'Aplicación práctica de todos los conceptos aprendidos.',
        type: 'practica',
        links: [
          { text: 'Material', url: url_git+'javascript/11-proyecto-integrador/11-proyecto-integrador.md' }
        ]
      }
    ],
    resources: [
      {
        title: 'Documentación Oficial',
        type: 'externo',
        description: 'MDN Web Docs - Referencia completa de JavaScript',
        url: 'https://developer.mozilla.org/es/docs/Web/JavaScript'
      },
      {
        title: 'JavaScript.info',
        type: 'externo',

        description: 'Tutorial moderno y completo de JavaScript',
        url: 'https://javascript.info'
      },
      {
        title: 'Eloquent JavaScript',
        type: 'externo',

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
          { text: 'Material', url: '../angular/01-instalacion_configuracio/01-instalacion_configuracio.md' }
        ]
      },
      {
        number: '02',
        title: 'Fundamentos',
        description: 'Componentes, templates, data binding y directivas básicas.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../angular/02-fundamentos/02-fundamentos.md' },
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
          { text: 'Material', url: '../angular/03-Navegacion/03-Navegacion.md' }
        ]
      },
      {
        number: '04',
        title: 'Formularios',
        description: 'Formularios reactivos, validación y manejo de datos.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../angular/04-Formularios/04-Formularios.md' }
        ]
      },
      {
        number: '05',
        title: 'UI y Heurísticas',
        description: 'Principios de usabilidad y heurísticas de Nielsen aplicadas.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../angular/05-UI-Heuristicas/05-UI-Heuristicas.md' }
        ]
      },
      {
        number: '06',
        title: 'Implementación de Heurísticas',
        description: 'Aplicación práctica de principios de usabilidad.',
        type: 'practica',
        links: [
          { text: 'Material', url: '../angular/06-UI-Heuristicas-impl/06-UI-Heuristicas-impl.md' }
        ]
      },
      {
        number: '07',
        title: 'Estilos',
        description: 'CSS, SCSS y estilos en componentes Angular.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../angular/07-Estilos/07-Estilos.md' }
        ]
      },
      {
        number: '08',
        title: 'Estilos, Temas y Componentes',
        description: 'Angular Material, temas personalizados y componentes reutilizables.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../angular/08-Estilos-Tema-Componentes/08-Estilos-Tema-Componentes.md' }
        ]
      },
      {
        number: '09',
        title: 'Consumo de Servicios',
        description: 'HttpClient, servicios REST y manejo de datos externos.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../angular/09-Consumos_servicos/09-Consumos_servicos.md' }
        ]
      },
      {
        number: '10',
        title: 'Mejoras Visuales',
        description: 'Animaciones, transiciones y efectos visuales.',
        type: 'practica',
        links: [
          { text: 'Material', url: '../angular/10-mejoras-vsuales/10-mejoras-vsuales.md' }
        ]
      },
      {
        number: '11',
        title: 'Firebase',
        description: 'Integración con Firebase, autenticación y base de datos en tiempo real.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../angular/11-firebase/11-firebase.md' }
        ]
      },
      {
        number: '12',
        title: 'Guards y Seguridad de Rutas',
        description: 'Protección de rutas, autenticación y autorización.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../angular/12-guards-seguridad-rutas/12-guards-seguridad-rutas.md' }
        ]
      }
    ],
    resources: [
      {
        title: 'Documentación Oficial',
        type: 'externo',

        description: 'Guías y referencias completas de Angular',
        url: 'https://angular.dev'
      },
      {
        title: 'Angular Material',
        type: 'externo',

        description: 'Componentes UI basados en Material Design',
        url: 'https://material.angular.io'
      },
      {
        title: 'RxJS',
        type: 'externo',

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
          { text: 'Material', url: '../astro/01-instalacion_configuracio-astro.md' }
        ]
      },
      {
        number: '02',
        title: 'Fundamentos',
        description: 'Componentes, layouts y arquitectura de islas.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../astro/02-fundamentos-astro.md' }
        ]
      },
      {
        number: '03',
        title: 'Navegación',
        description: 'Routing, páginas dinámicas y generación de sitios estáticos.',
        type: 'teoria',
        links: [
          { text: 'Material', url: '../astro/03-navegacion-astro.md' }
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
  },

  react: {
    name: 'React',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    color: '#61DAFB',
    description: 'Material y Proyectos de Estudiantes',
    modules: [
      {
        number: '01',
        title: 'Ávila Cabrera',
        description: 'Proyecto de práctica en React',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../react/avila_cabrera/' }
        ]
      },
      {
        number: '02',
        title: 'Gómez Valarezo',
        description: 'Proyecto de práctica en React',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../react/gomez_valarezo/' }
        ]
      },
      {
        number: '03',
        title: 'Mantilla Quevedo',
        description: 'Proyecto de práctica en React',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../react/mantilla_quevedo/' }
        ]
      },
      {
        number: '04',
        title: 'Vanegas Vanegas',
        description: 'Proyecto de práctica en React',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../react/vanegas_vanegas/' }
        ]
      },
      {
        number: '05',
        title: 'Zúñiga',
        description: 'Proyecto de práctica en React',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../react/zuniga_1/' }
        ]
      }
    ],
    resources: [
      {
        title: 'Documentación Oficial',
        description: 'Guías completas y referencias de React',
        url: 'https://react.dev'
      },
      {
        title: 'React Tutorial',
        description: 'Tutorial interactivo oficial de React',
        url: 'https://react.dev/learn'
      },
      {
        title: 'React en GitHub',
        description: 'Repositorio oficial y código fuente',
        url: 'https://github.com/facebook/react'
      }
    ]
  },

  vue: {
    name: 'Vue',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
    color: '#42B883',
    description: 'Material y Proyectos de Estudiantes',
    modules: [
      {
        number: '01',
        title: 'Calle Torres',
        description: 'Proyecto de práctica en Vue',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../vue/calle_torres/' }
        ]
      },
      {
        number: '02',
        title: 'Guamán Guanga',
        description: 'Proyecto de práctica en Vue',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../vue/guaman_guanga/' }
        ]
      },
      {
        number: '03',
        title: 'Ramón Serrano',
        description: 'Proyecto de práctica en Vue',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../vue/ramon_serrano/' }
        ]
      },
      {
        number: '04',
        title: 'Vascónez Morocho',
        description: 'Proyecto de práctica en Vue',
        type: 'practica',
        links: [
          { text: 'Ver Proyecto', url: '../vue/vasconez_morocho/' }
        ]
      }
    ],
    resources: [
      {
        title: 'Documentación Oficial',
        description: 'Guías completas y referencias de Vue',
        url: 'https://vuejs.org'
      },
      {
        title: 'Vue School',
        description: 'Cursos y tutoriales de Vue',
        url: 'https://vueschool.io'
      },
      {
        title: 'Vue Mastery',
        description: 'Plataforma de aprendizaje Vue',
        url: 'https://www.vuemastery.com'
      },
      {
        title: 'Vuetify',
        description: 'Framework de componentes Material Design',
        url: 'https://vuetifyjs.com'
      },
      {
        title: 'Vue en GitHub',
        description: 'Repositorio oficial y código fuente',
        url: 'https://github.com/vuejs/core'
      }
    ]
  }
};
