import { defineConfig } from 'astro/config';

export default defineConfig({
  // El sitio se genera como HTML estático por defecto
  output: 'static',

  // URL base del sitio (usada en SEO y sitemaps)
  site: 'https://astro-campus.example.com',

  // Servidor de desarrollo
  server: {
    port: 4321,
  },
});
