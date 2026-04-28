# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo A2: RSS Feed

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

RSS (Really Simple Syndication) es un formato XML estándar que permite a los usuarios suscribirse a actualizaciones de contenido. Aunque su uso masivo disminuyó con las redes sociales, sigue siendo el estándar para podcasts, blogs técnicos y herramientas de agregación.

Astro tiene soporte nativo para generar feeds RSS con el paquete `@astrojs/rss`.

---

## 2. Conceptos Clave

### Estructura de un feed RSS

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Astro Campus Blog</title>
    <link>https://astro-campus.netlify.app</link>
    <description>Recursos de programación web moderna</description>
    <item>
      <title>Introducción a Astro</title>
      <link>https://astro-campus.netlify.app/blog/intro-astro</link>
      <description>Primeros pasos con Astro...</description>
      <pubDate>Mon, 01 Jan 2025 00:00:00 GMT</pubDate>
      <guid>https://astro-campus.netlify.app/blog/intro-astro</guid>
    </item>
  </channel>
</rss>
```

### Autodiscovery

```html
<!-- En el <head> del layout, permite que navegadores y lectores detecten el feed -->
<link rel="alternate" type="application/rss+xml" title="Astro Campus RSS" href="/rss.xml" />
```

---

## 3. Explicación Técnica

### Instalar `@astrojs/rss`

```bash
pnpm add @astrojs/rss
```

### Endpoint `src/pages/rss.xml.ts`

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Astro Campus Blog',
    description: 'Recursos y tutoriales de programación web moderna.',
    site: context.site!.toString(),
    items: posts.map(post => ({
      title: post.data.titulo,
      description: post.data.descripcion,
      pubDate: post.data.fecha,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>es-ec</language>',
  });
}
```

### Configurar `site` en `astro.config.mjs`

```javascript
export default defineConfig({
  site: 'https://astro-campus.netlify.app',
  // ... resto de la config
});
```

`context.site` solo tiene valor si `site` está configurado. Sin él, el feed fallará.

---

## 4. Ejemplos de Código

### Feed con sanitización de HTML

```typescript
import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import { getCollection, render } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const items = await Promise.all(
    posts.map(async post => {
      const { Content } = await render(post);
      return {
        title: post.data.titulo,
        pubDate: post.data.fecha,
        link: `/blog/${post.slug}/`,
        // Incluir contenido completo sanitizado
        content: sanitizeHtml(post.body ?? '', {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
      };
    })
  );

  return rss({
    title: 'Astro Campus Blog',
    description: 'Recursos de programación web moderna.',
    site: context.site!.toString(),
    items,
  });
}
```

---

## 5. Buenas Prácticas

- Siempre configurar `site` en `astro.config.mjs` — el feed usa URLs absolutas.
- Agregar el link de autodiscovery en el `<head>` de BaseLayout.
- Sanitizar HTML si incluyes el contenido completo de los posts.
- Validar el feed con [W3C Feed Validator](https://validator.w3.org/feed/).
- Limitar a los últimos 20-50 items para no sobrecargar el feed.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `context.site` undefined | `site` no configurado en `astro.config.mjs` | Agregar `site: 'https://...'` |
| Feed 404 | Modo SSR sin `prerender = false` explícito en static | En modo server, funciona por defecto |
| Fechas inválidas | Formato de fecha incorrecto | Usar objetos `Date` nativos |
| HTML en description | Tags sin escapar | Sanitizar con `sanitize-html` |

---

## 7. Relación con el Proyecto Incremental

En este módulo complementario, `astro-campus` añade:

- Endpoint `/rss.xml` con los posts del blog.
- Autodiscovery en `BaseLayout.astro`.
- `site` configurado en `astro.config.mjs`.

---

## 8. Recursos

- [@astrojs/rss](https://docs.astro.build/es/guides/rss/)
- [W3C Feed Validator](https://validator.w3.org/feed/)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)
