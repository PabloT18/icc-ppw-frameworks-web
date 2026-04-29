# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 06: Contenido Markdown y Content Collections

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Astro es el framework ideal para sitios centrados en contenido. Su sistema de **Content Collections** permite gestionar colecciones de archivos Markdown o MDX con validación de esquema TypeScript, generación automática de tipos y consultas tipadas. Es la alternativa integrada a CMSs para contenido estático.

---

## 2. Conceptos Clave

### Markdown en Astro

Cualquier archivo `.md` en `src/pages/` se convierte en una ruta automáticamente:

```
src/pages/blog/primer-post.md  →  /blog/primer-post
```

El front matter del Markdown define metadatos:

```markdown
---
titulo: Mi primer post
fecha: 2024-03-15
autor: Pablo Torres
etiquetas: [astro, web]
draft: false
---

# Contenido del post

Texto con **Markdown** normal.
```

### Content Collections

Las Content Collections viven en `src/content/` (no en `src/pages/`) y se consultan con la API de Astro:

```
src/content/
├── config.ts           # Definición de colecciones y schemas
└── blog/               # Colección "blog"
    ├── primer-post.md
    └── segundo-post.md
```

### Definir una colección en `config.ts`

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',   // 'content' para Markdown/MDX
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    descripcion: z.string().optional(),
    autor: z.string().default('Anónimo'),
    etiquetas: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

### Consultar colecciones

```astro
---
import { getCollection, getEntry } from 'astro:content';

// Todos los posts (sin drafts):
const posts = await getCollection('blog', ({ data }) => !data.draft);

// Un post específico:
const post = await getEntry('blog', 'primer-post');

// Renderizar el contenido de un post:
const { Content } = await post.render();
---

<Content />
```

---

## 3. Explicación

### Diferencia: `src/pages/` vs `src/content/`

| Aspecto | `src/pages/` | `src/content/` |
|---------|:---:|:---:|
| Genera rutas automáticamente | Sí | No (requiere `getStaticPaths`) |
| Validación de frontmatter | No | Sí (Zod schema) |
| Tipado automático | No | Sí |
| Consulta con API | No | Sí (`getCollection`) |
| Soporte para drafts | Manual | Integrado |

### Layouts para Markdown en `src/pages/`

```astro
---
// src/layouts/PostLayout.astro
interface Props {
  frontmatter: {
    titulo: string;
    fecha: string;
    autor?: string;
  };
}

const { frontmatter } = Astro.props;
---

<BaseLayout titulo={frontmatter.titulo}>
  <article>
    <h1>{frontmatter.titulo}</h1>
    <p>Por {frontmatter.autor} — {frontmatter.fecha}</p>
    <slot />
  </article>
</BaseLayout>
```

En el archivo Markdown:

```markdown
---
layout: ../../layouts/PostLayout.astro
titulo: Mi post
fecha: 2024-03-15
autor: Pablo Torres
---

Contenido aquí...
```

### Ordenar y filtrar con `getCollection`

```typescript
const posts = (await getCollection('blog'))
  .filter(p => !p.data.draft)
  .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Archivo Markdown de post

```markdown
---
titulo: "Introducción a Astro"
descripcion: "Qué es Astro y por qué usarlo para sitios de contenido."
fecha: 2024-03-15
autor: "Pablo Torres"
etiquetas: ["astro", "web", "ssg"]
draft: false
---

## ¿Qué es Astro?

Astro es un framework web centrado en el contenido que genera HTML estático ultra-rápido.

## Características principales

- **Zero JS por defecto** — no envía JavaScript innecesario al navegador
- **Islands Architecture** — interactividad solo donde se necesita
- **Content Collections** — gestión tipada de contenido Markdown
```

### Ejemplo 2: Índice de posts con `getCollection`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter(p => !p.data.draft)
  .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
---

<BaseLayout titulo="Blog">
  <h1>Blog</h1>
  <ul>
    {posts.map(post => (
      <li>
        <a href={`/blog/${post.slug}`}>{post.data.titulo}</a>
        <time>{post.data.fecha.toLocaleDateString('es-EC')}</time>
      </li>
    ))}
  </ul>
</BaseLayout>
```

### Ejemplo 3: Detalle con `render()`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, getEntry } from 'astro:content';

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
  <article>
    <h1>{post.data.titulo}</h1>
    <p>
      Por {post.data.autor} — 
      <time>{post.data.fecha.toLocaleDateString('es-EC')}</time>
    </p>
    <Content />
  </article>
</BaseLayout>
```

---

## 5. Buenas Prácticas

- Usar `z.coerce.date()` para fechas en el schema — convierte strings ISO a objetos `Date`.
- Marcar posts en desarrollo con `draft: true` para excluirlos del build de producción.
- Centralizar la definición de colecciones en `src/content/config.ts`.
- Ordenar siempre los posts por fecha descendente antes de renderizar.
- Usar `descripcion` en el schema para metadatos SEO.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module 'astro:content'` | Proyecto no soporta Content Collections | Verificar que Astro >= 2.0 |
| Schema validation error | Frontmatter no coincide con el schema | Verificar tipos y campos requeridos |
| `post.render()` undefined | `getEntry` no encontró el archivo | Verificar el slug exacto del archivo |
| Posts no aparecen en el listado | `draft: true` sin filtrar | Agregar `.filter(p => !p.data.draft)` |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` incorpora una sección **Blog** con:

- Colección `blog` con schema validado.
- Página de índice `/blog` con posts ordenados por fecha.
- Páginas de detalle `/blog/[slug]` con el contenido renderizado.

---

## 8. Recursos

- [Content Collections](https://docs.astro.build/es/guides/content-collections/)
- [Markdown en Astro](https://docs.astro.build/es/guides/markdown-content/)
- [Zod (schemas)](https://zod.dev/)
- [getCollection API](https://docs.astro.build/es/reference/api-reference/#getcollection)
