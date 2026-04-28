# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 06: Contenido Markdown y Content Collections

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Configurar una Content Collection para el Blog de `astro-campus`, definir un schema con Zod, y crear páginas de índice y detalle usando la API de colecciones de Astro.

---

## Archivos que se crean / modifican

```
astro-campus/
└── src/
    ├── content/
    │   ├── config.ts                         ← NUEVO
    │   └── blog/
    │       ├── introduccion-astro.md          ← NUEVO
    │       ├── rutas-dinamicas.md             ← NUEVO
    │       └── content-collections.md         ← NUEVO
    └── pages/
        └── blog/
            ├── index.astro                    ← NUEVO
            └── [slug].astro                   ← NUEVO
```

---

## Paso 1: Crear `src/content/config.ts`

**¿Qué hace este paso?** Define la colección `blog` con un schema Zod que valida el frontmatter de cada archivo Markdown.

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string().optional(),
    fecha: z.coerce.date(),
    autor: z.string().default('Pablo Torres'),
    etiquetas: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

---

## Paso 2: Crear los archivos de contenido Markdown

**¿Qué hace este paso?** Crea los primeros posts de la colección. Astro validará automáticamente el frontmatter contra el schema.

### Post 1: `src/content/blog/introduccion-astro.md`

```markdown
---
titulo: "Introducción a Astro"
descripcion: "Qué es Astro y por qué usarlo para sitios centrados en contenido."
fecha: 2024-03-15
autor: "Pablo Torres"
etiquetas: ["astro", "web", "ssg"]
draft: false
---

## ¿Qué es Astro?

Astro es un framework web moderno que genera HTML estático optimizado.
A diferencia de otros frameworks, Astro envía **cero JavaScript** por defecto.

## Ventajas principales

- Rendimiento excepcional (100/100 en Lighthouse es la norma)
- Soporte nativo para Markdown y MDX
- Compatible con React, Vue, Svelte e incluso mezclarlos
- Content Collections con validación de tipos
```

### Post 2: `src/content/blog/rutas-dinamicas.md`

```markdown
---
titulo: "Rutas Dinámicas en Astro"
descripcion: "Cómo usar getStaticPaths para generar páginas desde datos."
fecha: 2024-03-22
autor: "Pablo Torres"
etiquetas: ["astro", "routing", "typescript"]
draft: false
---

## getStaticPaths

La función `getStaticPaths` es el corazón de las rutas dinámicas en Astro.
Retorna un array de objetos `{ params, props }` que Astro usa para generar páginas.

## Paginación nativa

Astro incluye soporte de primera clase para paginación con la función `paginate()`.
```

### Post 3: `src/content/blog/content-collections.md`

```markdown
---
titulo: "Content Collections: Contenido Tipado"
descripcion: "Gestiona colecciones de Markdown con validación de schema."
fecha: 2024-03-29
autor: "Pablo Torres"
etiquetas: ["astro", "content", "zod"]
draft: false
---

## ¿Qué son las Content Collections?

Las Content Collections son la manera recomendada de manejar colecciones de contenido
en Astro. Permiten definir un schema con Zod y obtener tipos automáticos.

## API principal

- `getCollection('blog')` — obtiene todos los posts
- `getEntry('blog', 'slug')` — obtiene un post específico
- `post.render()` — renderiza el Markdown a HTML
```

---

## Paso 3: Crear `src/pages/blog/index.astro`

**¿Qué hace este paso?** Muestra la lista de posts ordenados por fecha, excluyendo los drafts.

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
---

<BaseLayout titulo="Blog">
  <h1>Blog</h1>
  <p class="intro">Artículos sobre Astro y desarrollo web moderno.</p>

  <ul class="lista-posts">
    {posts.map(post => (
      <li class="post-item">
        <a href={`/blog/${post.slug}`}>
          <h2>{post.data.titulo}</h2>
          <time datetime={post.data.fecha.toISOString()}>
            {post.data.fecha.toLocaleDateString('es-EC', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </time>
          {post.data.descripcion && <p>{post.data.descripcion}</p>}
        </a>
        <div class="etiquetas">
          {post.data.etiquetas.map(tag => <span class="tag">{tag}</span>)}
        </div>
      </li>
    ))}
  </ul>
</BaseLayout>

<style>
  .intro { color: var(--color-text-muted, #aaa); margin-bottom: 2rem; }
  .lista-posts { list-style: none; padding: 0; }
  .post-item {
    border-bottom: 1px solid var(--color-border, #333);
    padding: 1.5rem 0;
  }
  .post-item a { text-decoration: none; display: block; }
  .post-item a:hover h2 { color: var(--color-brand, #FF5D01); }
  .post-item h2 { margin: 0 0 0.25rem; }
  time { font-size: 0.85rem; color: var(--color-text-muted, #aaa); }
  .etiquetas { margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .tag {
    background: var(--color-bg-card, #1a1a1a);
    border: 1px solid var(--color-border, #333);
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-full, 9999px);
    font-size: 0.75rem;
    color: var(--color-text-muted, #aaa);
  }
</style>
```

---

## Paso 4: Crear `src/pages/blog/[slug].astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout titulo={post.data.titulo} descripcion={post.data.descripcion}>
  <nav><a href="/blog">← Blog</a></nav>

  <article class="post">
    <header>
      <h1>{post.data.titulo}</h1>
      <p class="meta">
        Por {post.data.autor} —
        <time>{post.data.fecha.toLocaleDateString('es-EC', { dateStyle: 'long' })}</time>
      </p>
      <div class="etiquetas">
        {post.data.etiquetas.map(tag => <span class="tag">{tag}</span>)}
      </div>
    </header>
    <div class="contenido">
      <Content />
    </div>
  </article>
</BaseLayout>

<style>
  .post { max-width: 720px; }
  .post header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border, #333); }
  .meta { color: var(--color-text-muted, #aaa); font-size: 0.9rem; }
  .etiquetas { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem; }
  .tag {
    background: var(--color-bg-card, #1a1a1a);
    border: 1px solid var(--color-border, #333);
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-full, 9999px);
    font-size: 0.75rem;
    color: var(--color-text-muted, #aaa);
  }
  .contenido { line-height: 1.8; }
  .contenido h2 { color: var(--color-brand, #FF5D01); margin-top: 2rem; }
  .contenido code { background: var(--color-bg-card, #1a1a1a); padding: 0.1rem 0.4rem; border-radius: 3px; }
</style>
```

---

## Paso 5: TODO — Completar por el estudiante

```typescript
// TODO en src/content/config.ts:
// Agregar un campo 'imagen' opcional al schema
// Tipo: z.string().optional()
// Propósito: URL de imagen destacada del post

// TODO en src/content/blog/:
// Crear un cuarto post con draft: true
// Verificar que NO aparece en el listado
// Verificar que su URL /blog/[slug] da 404 en el build
```

```astro
---
// TODO en src/pages/blog/index.astro:
// Mostrar el número total de posts al inicio de la página
// Ejemplo: "6 artículos disponibles"
---
```

---

## Validaciones esperadas

- [ ] `pnpm astro check` no reporta errores de schema
- [ ] `/blog` muestra 3 posts ordenados por fecha (más reciente primero)
- [ ] `/blog/introduccion-astro` muestra el contenido del post
- [ ] El frontmatter inválido (campo faltante) genera un error descriptivo de Zod
- [ ] `pnpm build` genera HTML para todas las páginas del blog

---

## Entregables

- `src/content/config.ts` con schema completo
- 4 archivos Markdown en `src/content/blog/` (3 publicados + 1 draft)
- Páginas `/blog` y `/blog/[slug]` funcionales
- Captura de la lista de posts y una vista de detalle

---

## Commits sugeridos

```
feat: add blog content collection with zod schema
feat: add 3 blog posts to collection
feat: add /blog index page with sorted posts
feat: add /blog/[slug] detail page with Content render
feat: add draft post and verify exclusion from build
```
