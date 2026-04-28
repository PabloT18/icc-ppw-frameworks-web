# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica A2: RSS Feed

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Generar un feed RSS del blog de `astro-campus` y registrarlo con autodiscovery en el layout.

---

## Archivos que se crean / modifican

```
astro-campus/
├── astro.config.mjs               ← MODIFICAR: agregar site
└── src/
    ├── layouts/
    │   └── BaseLayout.astro       ← MODIFICAR: agregar link RSS
    └── pages/
        └── rss.xml.ts             ← NUEVO
```

---

## Paso 1: Instalar `@astrojs/rss`

```bash
pnpm add @astrojs/rss
```

---

## Paso 2: Agregar `site` en `astro.config.mjs`

**¿Qué hace este paso?** El endpoint RSS necesita URLs absolutas. `site` es la URL base del proyecto en producción.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://astro-campus.netlify.app', // ← reemplazar con tu URL real
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  server: { port: 4321 },
});
```

---

## Paso 3: Crear `src/pages/rss.xml.ts`

**¿Qué hace este paso?** Genera el XML del feed con los posts del blog.

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  // Ordenar por fecha descendente
  const ordenados = posts.sort(
    (a, b) => b.data.fecha.getTime() - a.data.fecha.getTime()
  );

  return rss({
    title: 'Astro Campus Blog',
    description: 'Recursos y tutoriales de programación web moderna.',
    site: context.site!.toString(),
    items: ordenados.map(post => ({
      title: post.data.titulo,
      description: post.data.descripcion,
      pubDate: post.data.fecha,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>es-ec</language>',
  });
}
```

---

## Paso 4: Agregar autodiscovery en `BaseLayout.astro`

```astro
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <SEO titulo={titulo} descripcion={descripcion} />
  <ViewTransitions />
  <!-- RSS autodiscovery -->
  <link rel="alternate" type="application/rss+xml" title="Astro Campus Blog" href="/rss.xml" />
</head>
```

---

## Paso 5: TODO — Completar por el estudiante

```typescript
// TODO en rss.xml.ts:
// Limitar el feed a los últimos 20 posts
// Pista: .slice(0, 20) después de ordenar
```

```typescript
// TODO:
// Validar el feed generado en https://validator.w3.org/feed/
// Copiar la URL de /rss.xml del servidor de preview y validar
```

---

## Validaciones esperadas

- [ ] `GET /rss.xml` retorna XML válido con Content-Type: application/xml
- [ ] El feed contiene los posts del blog (sin drafts)
- [ ] Los posts están ordenados del más reciente al más antiguo
- [ ] Las URLs en el feed son absolutas (con el dominio del site)
- [ ] El W3C Validator reporta el feed como válido

---

## Entregables

- `src/pages/rss.xml.ts` funcional
- `astro.config.mjs` con `site` configurado
- `BaseLayout.astro` con el link de autodiscovery
- Captura del XML del feed en el navegador

---

## Commits sugeridos

```
feat: add RSS feed endpoint at /rss.xml
feat: add RSS autodiscovery link to BaseLayout
```
