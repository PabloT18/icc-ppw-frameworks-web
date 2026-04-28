// src/data/recursos.ts
// Módulo 05 — Fuente de datos de recursos para rutas dinámicas

export interface Recurso {
  slug: string;
  titulo: string;
  url: string;
  descripcion: string;
  categoria: 'Framework' | 'Referencia' | 'Herramienta' | 'Comunidad';
}

export const recursos: Recurso[] = [
  {
    slug: 'astro-docs',
    titulo: 'Astro Docs',
    url: 'https://docs.astro.build/es/',
    descripcion: 'Documentación oficial completa de Astro.',
    categoria: 'Framework',
  },
  {
    slug: 'mdn-web',
    titulo: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/es/',
    descripcion: 'Referencia de HTML, CSS y JavaScript.',
    categoria: 'Referencia',
  },
  {
    slug: 'can-i-use',
    titulo: 'Can I Use',
    url: 'https://caniuse.com/',
    descripcion: 'Compatibilidad de APIs en navegadores.',
    categoria: 'Herramienta',
  },
  {
    slug: 'web-dev',
    titulo: 'web.dev',
    url: 'https://web.dev/',
    descripcion: 'Guías de rendimiento, accesibilidad y SEO de Google.',
    categoria: 'Referencia',
  },
  {
    slug: 'astro-discord',
    titulo: 'Astro Discord',
    url: 'https://astro.build/chat',
    descripcion: 'Comunidad oficial de Astro en Discord.',
    categoria: 'Comunidad',
  },
  {
    slug: 'devicon',
    titulo: 'Devicon',
    url: 'https://devicon.dev/',
    descripcion: 'Iconos SVG de tecnologías de desarrollo.',
    categoria: 'Herramienta',
  },
  {
    slug: 'css-tricks',
    titulo: 'CSS-Tricks',
    url: 'https://css-tricks.com/',
    descripcion: 'Artículos y snippets de CSS avanzado.',
    categoria: 'Referencia',
  },
  {
    slug: 'vitejs',
    titulo: 'Vite.js',
    url: 'https://vitejs.dev/',
    descripcion: 'Bundler de frontend ultra-rápido (base de Astro).',
    categoria: 'Herramienta',
  },
  {
    slug: 'typescript-docs',
    titulo: 'TypeScript Docs',
    url: 'https://www.typescriptlang.org/docs/',
    descripcion: 'Documentación oficial de TypeScript.',
    categoria: 'Referencia',
  },
];
