# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 07: Consumo de Datos en Build Time

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Consumir una API REST pública (`JSONPlaceholder`) durante el build de Astro, renderizar los datos en páginas estáticas y generar páginas de detalle dinámicas desde los datos de la API.

---

## Archivos que se crean / modifican

```
astro-campus/
└── src/
    ├── lib/
    │   └── api.ts              ← NUEVO
    └── pages/
        └── noticias/
            ├── index.astro     ← NUEVO
            └── [id].astro      ← NUEVO
```

---

## Paso 1: Crear `src/lib/api.ts`

**¿Qué hace este paso?** Centraliza la lógica de fetch con funciones tipadas. Facilita reutilizar las llamadas a la API en distintas páginas.

```typescript
// src/lib/api.ts

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function getPosts(limit = 10): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts?_limit=${limit}`);
  if (!res.ok) throw new Error(`Error al obtener posts: ${res.status}`);
  return res.json() as Promise<Post[]>;
}

export async function getPostById(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error(`Post ${id} no encontrado: ${res.status}`);
  return res.json() as Promise<Post>;
}

// Capitaliza la primera letra de cada oración (limpieza de datos API)
export function capitalizarTitulo(titulo: string): string {
  return titulo.charAt(0).toUpperCase() + titulo.slice(1);
}
```

---

## Paso 2: Crear `src/pages/noticias/index.astro`

**¿Qué hace este paso?** Muestra una lista de posts obtenidos de la API durante el build. El HTML resultante no necesita JavaScript en el cliente.

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getPosts, capitalizarTitulo } from '../../lib/api';

let posts = [];
let error = null;

try {
  posts = await getPosts(9);
} catch (err) {
  error = err instanceof Error ? err.message : 'Error al cargar noticias';
  console.error('[build] noticias/index:', error);
}
---

<BaseLayout titulo="Noticias">
  <h1>Noticias</h1>
  <p class="fuente">Datos desde JSONPlaceholder API (generados en build time)</p>

  {error ? (
    <div class="error">
      <p>⚠️ No se pudieron cargar las noticias: {error}</p>
    </div>
  ) : (
    <div class="grid">
      {posts.map(post => (
        <article class="card">
          <h2>
            <a href={`/noticias/${post.id}`}>
              {capitalizarTitulo(post.title)}
            </a>
          </h2>
          <p>{post.body.slice(0, 100)}…</p>
          <a href={`/noticias/${post.id}`} class="leer-mas">Leer más →</a>
        </article>
      ))}
    </div>
  )}
</BaseLayout>

<style>
  .fuente {
    font-size: 0.85rem;
    color: var(--color-text-muted, #aaa);
    margin-bottom: 2rem;
    font-style: italic;
  }
  .error {
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid var(--color-error, #f87171);
    border-radius: var(--radius-md, 0.5rem);
    padding: 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .card {
    background: var(--color-bg-card, #1a1a1a);
    border: 1px solid var(--color-border, #333);
    border-radius: var(--radius-md, 0.5rem);
    padding: 1.25rem;
  }
  .card h2 { font-size: 1rem; margin: 0 0 0.5rem; }
  .card h2 a { color: var(--color-text, #e8e8e8); text-decoration: none; }
  .card h2 a:hover { color: var(--color-brand, #FF5D01); }
  .card p { font-size: 0.9rem; color: var(--color-text-muted, #aaa); margin: 0 0 1rem; }
  .leer-mas { font-size: 0.85rem; color: var(--color-brand, #FF5D01); }
</style>
```

---

## Paso 3: Crear `src/pages/noticias/[id].astro`

**¿Qué hace este paso?** Genera una página estática para cada post usando `getStaticPaths`. Los 100 posts de la API generan 100 archivos HTML.

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getPosts, capitalizarTitulo } from '../../lib/api';
import type { Post } from '../../lib/api';

export async function getStaticPaths() {
  // Obtenemos todos los posts para generar las rutas
  const posts = await getPosts(20); // Limitamos a 20 para no sobrecargar el build
  return posts.map(post => ({
    params: { id: String(post.id) },
    props: { post },
  }));
}

interface Props {
  post: Post;
}

const { post } = Astro.props;
const titulo = capitalizarTitulo(post.title);
---

<BaseLayout titulo={titulo}>
  <nav><a href="/noticias">← Noticias</a></nav>

  <article class="noticia">
    <h1>{titulo}</h1>
    <p class="meta">Post #{post.id} · Usuario #{post.userId}</p>
    <div class="cuerpo">
      <p>{post.body}</p>
    </div>
  </article>
</BaseLayout>

<style>
  .noticia { max-width: 680px; }
  .meta { color: var(--color-text-muted, #aaa); font-size: 0.85rem; margin-bottom: 1.5rem; }
  .cuerpo p { line-height: 1.8; font-size: 1.05rem; }
</style>
```

---

## Paso 4: TODO — Completar por el estudiante

```typescript
// src/lib/api.ts — EXTENSIÓN
// TODO: Agregar la función getUser que obtiene un usuario por id
// Interfaz a implementar:
export interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}
// export async function getUserById(id: number): Promise<User> { ... }
```

```astro
---
// TODO en src/pages/noticias/[id].astro:
// Obtener el usuario (autor) del post usando getUserById(post.userId)
// Mostrar el nombre del autor en la página de detalle
// Agregar manejo de error si getUserById falla (el post igual debe mostrarse)
---
```

---

## Validaciones esperadas

- [ ] `pnpm dev` muestra `/noticias` con 9 cards de posts
- [ ] Los títulos están capitalizados correctamente
- [ ] `/noticias/1` muestra el detalle del primer post
- [ ] `pnpm build` genera 20 páginas en `dist/noticias/`
- [ ] No hay errores de TypeScript (`pnpm astro check`)
- [ ] Si la API está offline durante el build, se muestra el mensaje de error (no falla el build)

---

## Entregables

- `src/lib/api.ts` con funciones `getPosts`, `getPostById`, `getUserById`
- Páginas `/noticias` y `/noticias/[id]` funcionales
- Captura de la grilla de noticias
- Captura de una página de detalle con autor visible

---

## Commits sugeridos

```
feat: add src/lib/api.ts with typed fetch utilities
feat: add /noticias page with build-time data
feat: add /noticias/[id] dynamic pages from API
feat: add getUserById and display author in post detail
```
