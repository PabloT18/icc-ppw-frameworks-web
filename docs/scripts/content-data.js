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
        description: 'Proyecto base incremental con Angular 21, standalone y router moderno.',
        
        links: [
          { text: 'Material', url: '../angular/01-instalacion-configuracion/01-instalacion-configuracion.md' },
          { text: 'Práctica', url: '../angular/01-instalacion-configuracion/01-instalacion-configuracion-practica.md' }
        ]
      },
      {
        number: '02',
        title: 'Fundamentos de Angular',
        description: 'Standalone, signals, computed y control flow moderno en Angular 21.',
        
        links: [
          { text: 'Material', url: '../angular/02-fundamentos-angular/02-fundamentos-angular.md' },
          { text: 'Práctica', url: '../angular/02-fundamentos-angular/02-fundamentos-angular-practica.md' }
        ]
      },
      {
        number: '03',
        title: 'Navegación',
        description: 'Router moderno, shell principal y rutas parametrizadas.',
        
        links: [
          { text: 'Material', url: '../angular/03-navegacion/03-navegacion.md' },
          { text: 'Práctica', url: '../angular/03-navegacion/03-navegacion-practica.md' }
        ]
      },
      {
        number: '04',
        title: 'Formularios Reactivos',
        description: 'Reactive Forms modernos con tipado fuerte y validadores reutilizables.',
        
        links: [
          { text: 'Material', url: '../angular/04-formularios-reactivos/04-formularios-reactivos.md' },
          { text: 'Práctica', url: '../angular/04-formularios-reactivos/04-formularios-reactivos-practica.md' }
        ]
      },
      {
        number: '05',
        title: 'Estilos y Layout con Tailwind',
        description: 'Layout responsive, tipografía y composición visual base con TailwindCSS.',
        
        links: [
          { text: 'Material', url: '../angular/05-estilos-layout-tailwind/05-estilos-layout-tailwind.md' },
          { text: 'Práctica', url: '../angular/05-estilos-layout-tailwind/05-estilos-layout-tailwind-practica.md' }
        ]
      },
      {
        number: '06',
        title: 'Temas y Componentes UI',
        description: 'Sistema visual, DaisyUI y componentes reutilizables para la interfaz.',

        links: [
          { text: 'Material', url: '../angular/06-temas-componentes-ui/06-temas-componentes-ui.md' },
          { text: 'Práctica', url: '../angular/06-temas-componentes-ui/06-temas-componentes-ui-practica.md' }
        ]
      },
      {
        number: '07',
        title: 'Consumo de Servicios HTTP',
        description: 'HttpClient, servicios tipados y estados de carga/error en UI.',
        
        links: [
          { text: 'Material', url: '../angular/07-consumo-servicios-http/07-consumo-servicios-http.md' },
          { text: 'Práctica', url: '../angular/07-consumo-servicios-http/07-consumo-servicios-http-practica.md' }
        ]
      },
      {
        number: '08',
        title: 'Mejoras Visuales y Usabilidad',
        description: 'Feedback visual, paginación, estados vacíos y mejoras de experiencia de usuario.',
        
        links: [
          { text: 'Material', url: '../angular/08-mejoras-visuales-usabilidad/08-mejoras-visuales-usabilidad.md' },
          { text: 'Práctica', url: '../angular/08-mejoras-visuales-usabilidad/08-mejoras-visuales-usabilidad-practica.md' }
        ]
      },
      {
        number: '09',
        title: 'Firebase y Autenticación',
        description: 'Autenticación, Firestore y persistencia por usuario en la nube.',
        
        links: [
          { text: 'Material', url: '../angular/09-firebase-autenticacion/09-firebase-autenticacion.md' },
          { text: 'Práctica', url: '../angular/09-firebase-autenticacion/09-firebase-autenticacion-practica.md' }
        ]
      },
      {
        number: '10',
        title: 'Guards y Seguridad de Rutas',
        description: 'Rutas protegidas, guards funcionales y navegación condicionada por sesión.',
        
        links: [
          { text: 'Material', url: '../angular/10-guards-seguridad-rutas/10-guards-seguridad-rutas.md' },
          { text: 'Práctica', url: '../angular/10-guards-seguridad-rutas/10-guards-seguridad-rutas-practica.md' }
        ]
      },
      {
        number: '11',
        title: 'Deploy',
        description: 'Build de producción y publicación del proyecto incremental.',
        
        links: [
          { text: 'Material', url: '../angular/11-deploy/11-deploy.md' },
          { text: 'Práctica', url: '../angular/11-deploy/11-deploy-practica.md' }
        ]
      },
      
    ],
    addons:[

      {
        number: 'A1',
        title: 'Heurísticas de Usabilidad',
                description: 'Evaluación e implementación heurística como proyecto separado del recorrido principal.',

        type: 'Addon',
        links: [
          { text: 'Material', url:url_git+ '/angular/A1-ui-heuristicas/A1-ui-heuristicas.md' },
          { text: 'Práctica', url:url_git+ '/angular/A1-ui-heuristicas/A1-ui-heuristicas-practica.md' }
        ]
      },
        {
        number: 'A2',
        title: 'Heurísticas de Usabilidad',
        description: 'Evaluación e implementación heurística como proyecto separado del recorrido principal.',
        type: 'Addon',
        links: [
          { text: 'Material', url:url_git+ '/angular/A2-ui-heuristicas-impl/A2-ui-heuristicas-impl.md' },
          { text: 'Práctica', url:url_git+ '/angular/A2-ui-heuristicas-impl/A2-ui-heuristicas-impl-practica.md' }
        ]
      },
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
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg',
    color: '#FF5D01',
    description: 'Material Conceptual y Prácticas',
    modules: [
      {
        number: '01',
        title: 'Instalación y Configuración',
        description: 'Entorno de desarrollo, proyecto astro-campus y primeros pasos con Astro v5.',
        
        links: [
          { text: 'Material', url: '../astro/01-instalacion-configuracion/01-instalacion-configuracion.md' },
          { text: 'Práctica', url: '../astro/01-instalacion-configuracion/01-instalacion-configuracion-practica.md' }
        ]
      },
      {
        number: '02',
        title: 'Fundamentos de Astro',
        description: 'Componentes .astro, frontmatter, props, slots y primeras páginas.',
        
        links: [
          { text: 'Material', url: '../astro/02-fundamentos-astro/02-fundamentos-astro.md' },
          { text: 'Práctica', url: '../astro/02-fundamentos-astro/02-fundamentos-astro-practica.md' }
        ]
      },
      {
        number: '03',
        title: 'Rutas, Layouts y Navegación',
        description: 'Sistema de archivos como rutas, BaseLayout, Header, Footer y página 404.',
        
        links: [
          { text: 'Material', url: '../astro/03-rutas-layouts-navegacion/03-rutas-layouts-navegacion.md' },
          { text: 'Práctica', url: '../astro/03-rutas-layouts-navegacion/03-rutas-layouts-navegacion-practica.md' }
        ]
      },
      {
        number: '04',
        title: 'Componentes, Props y Estilos',
        description: 'Props tipadas con TypeScript, scoped styles, variables CSS y sistema de tokens.',
        
        links: [
          { text: 'Material', url: '../astro/04-componentes-props-estilos/04-componentes-props-estilos.md' },
          { text: 'Práctica', url: '../astro/04-componentes-props-estilos/04-componentes-props-estilos-practica.md' }
        ]
      },
      {
        number: '05',
        title: 'Rutas Dinámicas y Paginación',
        description: 'getStaticPaths, slugs, paginación con paginate() y páginas de detalle.',
        
        links: [
          { text: 'Material', url: '../astro/05-rutas-dinamicas-paginacion/05-rutas-dinamicas-paginacion.md' },
          { text: 'Práctica', url: '../astro/05-rutas-dinamicas-paginacion/05-rutas-dinamicas-paginacion-practica.md' }
        ]
      },
      {
        number: '06',
        title: 'Contenido Markdown y Collections',
        description: 'Content Collections, esquemas Zod, frontmatter tipado y renderizado de Markdown.',
        
        links: [
          { text: 'Material', url: '../astro/06-contenido-markdown-collections/06-contenido-markdown-collections.md' },
          { text: 'Práctica', url: '../astro/06-contenido-markdown-collections/06-contenido-markdown-collections-practica.md' }
        ]
      },
      {
        number: '07',
        title: 'Consumo de Datos en Build Time',
        description: 'fetch() en frontmatter, datos de APIs externas y generación estática de páginas.',
        
        links: [
          { text: 'Material', url: '../astro/07-consumo-datos-build-time/07-consumo-datos-build-time.md' },
          { text: 'Práctica', url: '../astro/07-consumo-datos-build-time/07-consumo-datos-build-time-practica.md' }
        ]
      },
      {
        number: '08',
        title: 'Interactividad y LocalStorage',
        description: 'Scripts del cliente, localStorage, favoritos sin framework y define:vars.',
        
        links: [
          { text: 'Material', url: '../astro/08-interactividad-localstorage/08-interactividad-localstorage.md' },
          { text: 'Práctica', url: '../astro/08-interactividad-localstorage/08-interactividad-localstorage-practica.md' }
        ]
      },
      {
        number: '09',
        title: 'Formularios y Endpoints',
        description: 'API Routes, modo hybrid, validación de formularios y respuestas JSON.',
        
        links: [
          { text: 'Material', url: '../astro/09-formularios-endpoints/09-formularios-endpoints.md' },
          { text: 'Práctica', url: '../astro/09-formularios-endpoints/09-formularios-endpoints-practica.md' }
        ]
      },
      {
        number: '10',
        title: 'SSR y Middleware',
        description: 'Modo server, Node adapter, defineMiddleware, Astro.locals y endpoints SSR.',
        
        links: [
          { text: 'Material', url: '../astro/10-ssr-middleware/10-ssr-middleware.md' },
          { text: 'Práctica', url: '../astro/10-ssr-middleware/10-ssr-middleware-practica.md' }
        ]
      },
      {
        number: '11',
        title: 'Autenticación y Protección de Rutas',
        description: 'Login con cookies httpOnly, validación en middleware y rutas protegidas.',
        
        links: [
          { text: 'Material', url: '../astro/11-autenticacion-proteccion-rutas/11-autenticacion-proteccion-rutas.md' },
          { text: 'Práctica', url: '../astro/11-autenticacion-proteccion-rutas/11-autenticacion-proteccion-rutas-practica.md' }
        ]
      },
      {
        number: '12',
        title: 'SEO, Accesibilidad y Rendimiento',
        description: 'Meta tags, Open Graph, landmarks ARIA, View Transitions y skip links.',
        
        links: [
          { text: 'Material', url: '../astro/12-seo-accesibilidad-rendimiento/12-seo-accesibilidad-rendimiento.md' },
          { text: 'Práctica', url: '../astro/12-seo-accesibilidad-rendimiento/12-seo-accesibilidad-rendimiento-practica.md' }
        ]
      },
      {
        number: '13',
        title: 'Deploy',
        description: 'Build de producción, netlify.toml y publicación en Netlify o Cloudflare Pages.',
        
        links: [
          { text: 'Material', url: '../astro/13-deploy/13-deploy.md' },
          { text: 'Práctica', url: '../astro/13-deploy/13-deploy-practica.md' }
        ]
      },],
    addons:[
      {
        number: 'A1',
        title: 'Islands Architecture e Integraciones',
        description: 'Directivas client:*, integración React y barra de búsqueda como isla.',
        type: 'Addon',
        links: [
          { text: 'Material', url: '../astro/A1-islands-integraciones/A1-islands-integraciones.md' },
          { text: 'Práctica', url: '../astro/A1-islands-integraciones/A1-islands-integraciones-practica.md' }
        ]
      },
      {
        number: 'A2',
        title: 'RSS Feed',
        description: 'Generación de feed RSS con @astrojs/rss y autodiscovery en el layout.',
        type: 'Addon',
        links: [
          { text: 'Material', url: '../astro/A2-rss-feed/A2-rss-feed.md' },
          { text: 'Práctica', url: '../astro/A2-rss-feed/A2-rss-feed-practica.md' }
        ]
      },
      {
        number: 'A3',
        title: 'Astro DB y Server Actions',
        description: 'Base de datos libSQL integrada, Server Actions con Zod y sistema de likes.',
        type: 'Addon',
        links: [
          { text: 'Material', url: '../astro/A3-astro-db-server-actions/A3-astro-db-server-actions.md' },
          { text: 'Práctica', url: '../astro/A3-astro-db-server-actions/A3-astro-db-server-actions-practica.md' }
        ]
      },
      {
        number: 'A4',
        title: 'E-commerce: Carrito con NanoStores',
        description: 'Estado compartido entre islas React con NanoStores y carrito de compras.',
        type: 'Addon',
        links: [
          { text: 'Material', url: '../astro/A4-ecommerce-carrito-nanostores/A4-ecommerce-carrito-nanostores.md' },
          { text: 'Práctica', url: '../astro/A4-ecommerce-carrito-nanostores/A4-ecommerce-carrito-nanostores-practica.md' }
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
    description: 'Material Conceptual y Prácticas',
    modules: [
      {
        number: '01',
        title: 'Instalación y Configuración',
        description: 'Proyecto ReactStore con Vite, React 19, TypeScript y pnpm. Estructura de carpetas y configuración inicial.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/01-instalacion-configuracion/01-instalacion-configuracion.md' },
          { text: 'Práctica', url:url_git+ '/react/01-instalacion-configuracion/01-instalacion-configuracion-practica.md' }
        ]
      },
      {
        number: '02',
        title: 'Fundamentos de React',
        description: 'JSX, componentes funcionales, props, renderizado condicional y CSS Modules.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/02-fundamentos-react/02-fundamentos-react.md' },
          { text: 'Práctica', url:url_git+ '/react/02-fundamentos-react/02-fundamentos-react-practica.md' }
        ]
      },
      {
        number: '03',
        title: 'Componentes, Props y Estilos',
        description: 'Composición de componentes, tipado de props con TypeScript y sistema de estilos con CSS Modules.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/03-componentes-props-estilos/03-componentes-props-estilos.md' },
          { text: 'Práctica', url:url_git+ '/react/03-componentes-props-estilos/03-componentes-props-estilos-practica.md' }
        ]
      },
      {
        number: '04',
        title: 'Eventos y Estado con useState',
        description: 'Manejo de eventos, estado local con useState y patrones de actualización inmutable.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/04-eventos-estado-useState/04-eventos-estado-useState.md' },
          { text: 'Práctica', url:url_git+ '/react/04-eventos-estado-useState/04-eventos-estado-useState-practica.md' }
        ]
      },
      {
        number: '05',
        title: 'Renderizado de Listas y Condicionales',
        description: 'Renderizado de listas con map, claves, renderizado condicional y componentes de estado vacío.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/05-renderizado-listas-condicionales/05-renderizado-listas-condicionales.md' },
          { text: 'Práctica', url:url_git+ '/react/05-renderizado-listas-condicionales/05-renderizado-listas-condicionales-practica.md' }
        ]
      },
      {
        number: '06',
        title: 'Efectos y Fetch con useEffect',
        description: 'Ciclo de vida con useEffect, consumo de APIs, estados de carga/error y limpieza de efectos.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/06-efectos-useEffect-fetch/06-efectos-useEffect-fetch.md' },
          { text: 'Práctica', url:url_git+ '/react/06-efectos-useEffect-fetch/06-efectos-useEffect-fetch-practica.md' }
        ]
      },
      {
        number: '07',
        title: 'Custom Hooks',
        description: 'Extracción de lógica reutilizable en hooks personalizados, useProducts y useProductDetail.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/07-custom-hooks/07-custom-hooks.md' },
          { text: 'Práctica', url:url_git+ '/react/07-custom-hooks/07-custom-hooks-practica.md' }
        ]
      },
      {
        number: '08',
        title: 'Formularios y Validación',
        description: 'Formularios controlados, validación con React Hook Form y manejo de errores por campo.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/08-formularios-validacion/08-formularios-validacion.md' },
          { text: 'Práctica', url:url_git+ '/react/08-formularios-validacion/08-formularios-validacion-practica.md' }
        ]
      },
      {
        number: '09',
        title: 'Rutas, Layouts y React Router',
        description: 'Navegación con React Router v7, rutas anidadas, layouts compartidos y páginas de error.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/09-rutas-layouts-react-router/09-rutas-layouts-react-router.md' },
          { text: 'Práctica', url:url_git+ '/react/09-rutas-layouts-react-router/09-rutas-layouts-react-router-practica.md' }
        ]
      },
      {
        number: '10',
        title: 'Context API y Estado Global',
        description: 'Estado compartido con Context API, FavoritesContext, AuthContext y rutas protegidas.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/10-context-api-estado-global/10-context-api-estado-global.md' },
          { text: 'Práctica', url:url_git+ '/react/10-context-api-estado-global/10-context-api-estado-global-practica.md' }
        ]
      },
      {
        number: '11',
        title: 'Consumo de Datos y Caché con TanStack Query',
        description: 'Fetching declarativo, caché inteligente, paginación y sincronización con useQuery.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/11-consumo-datos-cache-tanstack-query/11-consumo-datos-cache-tanstack-query.md' },
          { text: 'Práctica', url:url_git+ '/react/11-consumo-datos-cache-tanstack-query/11-consumo-datos-cache-tanstack-query-practica.md' }
        ]
      },
      {
        number: '12',
        title: 'Optimización del Renderizado',
        description: 'memo, useMemo, useCallback, lazy loading, Suspense y análisis con bundle visualizer.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/12-optimizacion-renderizado/12-optimizacion-renderizado.md' },
          { text: 'Práctica', url:url_git+ '/react/12-optimizacion-renderizado/12-optimizacion-renderizado-practica.md' }
        ]
      },
      {
        number: '13',
        title: 'Autenticación y Rutas Protegidas',
        description: 'Login con JWT, AuthContext, PrivateRoute, persistencia de sesión y logout.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/13-autenticacion-rutas-protegidas/13-autenticacion-rutas-protegidas.md' },
          { text: 'Práctica', url:url_git+ '/react/13-autenticacion-rutas-protegidas/13-autenticacion-rutas-protegidas-practica.md' }
        ]
      },
      {
        number: '14',
        title: 'Testing con Vitest y React Testing Library',
        description: 'Tests unitarios y de integración con Vitest, RTL, mocks y cobertura de código.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/14-testing-vitest-react-testing-library/14-testing-vitest-react-testing-library.md' },
          { text: 'Práctica', url:url_git+ '/react/14-testing-vitest-react-testing-library/14-testing-vitest-react-testing-library-practica.md' }
        ]
      },
      {
        number: '15',
        title: 'Deploy',
        description: 'Build de producción, SPA routing, deploy en Netlify y Vercel con variables de entorno.',
        
        links: [
          { text: 'Material', url:url_git+ '/react/15-deploy/15-deploy.md' },
          { text: 'Práctica', url:url_git+ '/react/15-deploy/15-deploy-practica.md' }
        ]
      },
     
    ],
    addons:[
       {
        number: 'A1',
        title: 'Zustand: Estado Global Avanzado',
        description: 'Gestión de estado con Zustand, middleware persist y devtools, migración desde Context API.',
        type: 'Addon',
        links: [
          { text: 'Material', url:url_git+ '/react/A1-zustand-estado-global-avanzado/A1-zustand-estado-global-avanzado.md' },
          { text: 'Práctica', url:url_git+ '/react/A1-zustand-estado-global-avanzado/A1-zustand-estado-global-avanzado-practica.md' }
        ]
      },
      {
        number: 'A2',
        title: 'Redux Toolkit',
        description: 'Estado centralizado con RTK, createSlice, createAsyncThunk y RTK DevTools.',
        type: 'Addon',
        links: [
          { text: 'Material', url:url_git+ '/react/A2-redux-toolkit/A2-redux-toolkit.md' },
          { text: 'Práctica', url:url_git+ '/react/A2-redux-toolkit/A2-redux-toolkit-practica.md' }
        ]
      },
      {
        number: 'A3',
        title: 'Panel Administrativo de Productos',
        description: 'CRUD completo con TanStack Query, mutaciones optimistas, tabla con orden y paginación.',
        type: 'Addon',
        links: [
          { text: 'Material', url:url_git+ '/react/A3-panel-administrativo-productos/A3-panel-administrativo-productos.md' },
          { text: 'Práctica', url:url_git+ '/react/A3-panel-administrativo-productos/A3-panel-administrativo-productos-practica.md' }
        ]
      },
      {
        number: 'A4',
        title: 'Carga de Archivos',
        description: 'Componente ImageUploader con drag & drop, validación de tipo/tamaño y previews.',
        type: 'Addon',
        links: [
          { text: 'Material', url:url_git+ '/react/A4-carga-archivos/A4-carga-archivos.md' },
          { text: 'Práctica', url:url_git+ '/react/A4-carga-archivos/A4-carga-archivos-practica.md' }
        ]
      },
      {
        number: 'A5',
        title: 'Calendario de Eventos',
        description: 'Mini calendario mensual con date-fns, eventos persistidos en localStorage y modal CRUD.',
        type: 'Addon',
        links: [
          { text: 'Material', url:url_git+ '/react/A5-mern-calendar/A5-mern-calendar.md' },
          { text: 'Práctica', url:url_git+ '/react/A5-mern-calendar/A5-mern-calendar-practica.md' }
        ]
      }
    ],

    resources: [
      {
        title: 'Documentación Oficial',
        type: 'externo',
        description: 'Guías completas y referencias de React',
        url: 'https://react.dev'
      },
      {
        title: 'React Tutorial',
        type: 'externo',
        description: 'Tutorial interactivo oficial de React',
        url: 'https://react.dev/learn'
      },
      {
        title: 'React en GitHub',
        type: 'externo',
        description: 'Repositorio oficial y código fuente',
        url: 'https://github.com/facebook/react'
      }
    ]
  },

  vue: {
    name: 'Vue',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
    color: '#42B883',
    description: 'Material Conceptual y Prácticas',
    modules: [
      {
        number: '01',
        title: 'Instalación y Configuración',
        description: 'Proyecto ppw-vue-app con Vite, Vue 3, TypeScript y pnpm. Composition API y estructura base.',
        links: [
          { text: 'Teoría', url: url_git+'vue/01-instalacion-configuracion/01-instalacion-configuracion.md' },
          { text: 'Práctica', url: url_git+'vue/01-instalacion-configuracion/01-instalacion-configuracion-practica.md' }
        ]
      },
      {
        number: '02',
        title: 'Fundamentos de Vue',
        description: 'Composition API, ref, reactive, computed, watch y template syntax con script setup.',
        links: [
          { text: 'Teoría', url: url_git+'vue/02-fundamentos-vue/02-fundamentos-vue.md' },
          { text: 'Práctica', url: url_git+'vue/02-fundamentos-vue/02-fundamentos-vue-practica.md' }
        ]
      },
      {
        number: '03',
        title: 'Componentes y Props',
        description: 'defineProps, defineEmits, v-model en componentes, slots y comunicación padre-hijo.',
        links: [
          { text: 'Teoría', url: url_git+'vue/03-componentes-props/03-componentes-props.md' },
          { text: 'Práctica', url: url_git+'vue/03-componentes-props/03-componentes-props-practica.md' }
        ]
      },
      {
        number: '04',
        title: 'Estilos y Layout',
        description: 'Scoped styles, CSS modules, variables CSS, layouts y diseño responsive.',
        links: [
          { text: 'Teoría', url: url_git+'vue/04-estilos-layout/04-estilos-layout.md' },
          { text: 'Práctica', url: url_git+'vue/04-estilos-layout/04-estilos-layout-practica.md' }
        ]
      },
      {
        number: '05',
        title: 'Directivas y Renderizado',
        description: 'v-if, v-show, v-for con key, v-bind, v-on y renderizado condicional y de listas.',
        links: [
          { text: 'Teoría', url: url_git+'vue/05-directivas-renderizado/05-directivas-renderizado.md' },
          { text: 'Práctica', url: url_git+'vue/05-directivas-renderizado/05-directivas-renderizado-practica.md' }
        ]
      },
      {
        number: '06',
        title: 'Formularios y Validación',
        description: 'v-model, modificadores, validación reactiva y patrones de formulario reutilizables.',
        links: [
          { text: 'Teoría', url: url_git+'vue/06-formularios-validacion/06-formularios-validacion.md' },
          { text: 'Práctica', url: url_git+'vue/06-formularios-validacion/06-formularios-validacion-practica.md' }
        ]
      },
      {
        number: '07',
        title: 'Composables',
        description: 'Extracción de lógica reutilizable en composables: useCarrito, useFiltros, useLocalStorage.',
        links: [
          { text: 'Teoría', url: url_git+'vue/07-composables/07-composables.md' },
          { text: 'Práctica', url: url_git+'vue/07-composables/07-composables-practica.md' }
        ]
      },
      {
        number: '08',
        title: 'Vue Router',
        description: 'Enrutamiento SPA, rutas dinámicas, rutas anidadas, navegación programática y RouterLink.',
        links: [
          { text: 'Teoría', url: url_git+'vue/08-vue-router/08-vue-router.md' },
          { text: 'Práctica', url: url_git+'vue/08-vue-router/08-vue-router-practica.md' }
        ]
      },
      {
        number: '09',
        title: 'Pinia: Estado Global',
        description: 'Stores con Pinia, storeToRefs, pinia-plugin-persistedstate y estado compartido entre vistas.',
        links: [
          { text: 'Teoría', url: url_git+'vue/09-pinia-estado-global/09-pinia-estado-global.md' },
          { text: 'Práctica', url: url_git+'vue/09-pinia-estado-global/09-pinia-estado-global-practica.md' }
        ]
      },
      {
        number: '10',
        title: 'Ciclo de Vida y Watchers',
        description: 'Hooks de ciclo de vida, watch, watchEffect y patrones para datos asíncronos.',
        links: [
          { text: 'Teoría', url: url_git+'vue/10-ciclo-vida-watchers/10-ciclo-vida-watchers.md' },
          { text: 'Práctica', url: url_git+'vue/10-ciclo-vida-watchers/10-ciclo-vida-watchers-practica.md' }
        ]
      },
      {
        number: '11',
        title: 'Consumo de Datos HTTP',
        description: 'Axios, instancia configurada, interceptores, variables de entorno VITE_ y servicios tipados.',
        links: [
          { text: 'Teoría', url: url_git+'vue/11-consumo-datos-http/11-consumo-datos-http.md' },
          { text: 'Práctica', url: url_git+'vue/11-consumo-datos-http/11-consumo-datos-http-practica.md' }
        ]
      },
      {
        number: '12',
        title: 'Autenticación y Guards',
        description: 'Login simulado con JWT, useAuthStore en Pinia, router.beforeEach y rutas protegidas.',
        links: [
          { text: 'Teoría', url: url_git+'vue/12-autenticacion-guards/12-autenticacion-guards.md' },
          { text: 'Práctica', url: url_git+'vue/12-autenticacion-guards/12-autenticacion-guards-practica.md' }
        ]
      },
      {
        number: '13',
        title: 'Optimización y Estructura',
        description: 'Lazy loading de rutas, utilidades de formato, accesibilidad con ARIA y buenas prácticas.',
        links: [
          { text: 'Teoría', url: url_git+'vue/13-optimizacion-estructura/13-optimizacion-estructura.md' },
          { text: 'Práctica', url: url_git+'vue/13-optimizacion-estructura/13-optimizacion-estructura-practica.md' }
        ]
      },
      {
        number: '14',
        title: 'Testing con Vitest',
        description: 'Vitest, @vue/test-utils, happy-dom, tests de composables, stores y componentes.',
        links: [
          { text: 'Teoría', url: url_git+'vue/14-testing-vitest/14-testing-vitest.md' },
          { text: 'Práctica', url: url_git+'vue/14-testing-vitest/14-testing-vitest-practica.md' }
        ]
      },
      {
        number: '15',
        title: 'Deploy',
        description: 'Build de producción con Vite, manualChunks, SPA routing y deploy en Netlify y Vercel.',
        links: [
          { text: 'Teoría', url: url_git+'vue/15-deploy/15-deploy.md' },
          { text: 'Práctica', url: url_git+'vue/15-deploy/15-deploy-practica.md' }
        ]
      }
    ],
    addons: [
      {
        number: 'A1',
        title: 'Introducción a Nuxt 3',
        description: 'Proyecto ppw-nuxt-intro: SSR, enrutamiento por archivos, useFetch y useSeoMeta.',
        type: 'Addon',
        links: [
          { text: 'Teoría', url: url_git+'vue/A1-nuxt-introduccion/A1-nuxt-introduccion.md' },
          { text: 'Práctica', url: url_git+'vue/A1-nuxt-introduccion/A1-nuxt-introduccion-practica.md' }
        ]
      },
      {
        number: 'A2',
        title: 'Panel Administrativo',
        description: 'Dashboard con sidebar, tabla de datos, paginación y CRUD completo con modales.',
        type: 'Addon',
        links: [
          { text: 'Teoría', url: url_git+'vue/A2-panel-administrativo/A2-panel-administrativo.md' },
          { text: 'Práctica', url: url_git+'vue/A2-panel-administrativo/A2-panel-administrativo-practica.md' }
        ]
      },
      {
        number: 'A3',
        title: 'Carga de Archivos',
        description: 'Input file, URL.createObjectURL para preview, validación, drag & drop y barra de progreso.',
        type: 'Addon',
        links: [
          { text: 'Teoría', url: url_git+'vue/A3-carga-archivos/A3-carga-archivos.md' },
          { text: 'Práctica', url: url_git+'vue/A3-carga-archivos/A3-carga-archivos-practica.md' }
        ]
      },
      {
        number: 'A4',
        title: 'SSR, SEO y Rutas de Servidor',
        description: 'Nuxt Nitro server routes como proxy, Open Graph, Twitter Cards y JSON-LD estructurado.',
        type: 'Addon',
        links: [
          { text: 'Teoría', url: url_git+'vue/A4-ssr-seo-nuxt/A4-ssr-seo-nuxt.md' },
          { text: 'Práctica', url: url_git+'vue/A4-ssr-seo-nuxt/A4-ssr-seo-nuxt-practica.md' }
        ]
      },
      {
        number: 'A5',
        title: 'Proyecto Full-Stack con Nuxt',
        description: 'App de notas full-stack: Nuxt + Nitro CRUD API con useStorage, sin backend separado.',
        type: 'Addon',
        links: [
          { text: 'Teoría', url: url_git+'vue/A5-proyecto-fullstack/A5-proyecto-fullstack.md' },
          { text: 'Práctica', url: url_git+'vue/A5-proyecto-fullstack/A5-proyecto-fullstack-practica.md' }
        ]
      }
    ],
    resources: [
      {
        title: 'Documentación Oficial',
        description: 'Guías completas y referencias de Vue 3',
        url: 'https://vuejs.org'
      },
      {
        title: 'Pinia',
        description: 'Gestión de estado oficial para Vue 3',
        url: 'https://pinia.vuejs.org'
      },
      {
        title: 'Vue Router',
        description: 'Router oficial de Vue con composables',
        url: 'https://router.vuejs.org'
      },
      {
        title: 'Nuxt 3',
        description: 'Framework full-stack basado en Vue 3',
        url: 'https://nuxt.com'
      },
      {
        title: 'Vite',
        description: 'Herramienta de build ultrarrápida para Vue',
        url: 'https://vitejs.dev'
      }
    ]
  }
};
