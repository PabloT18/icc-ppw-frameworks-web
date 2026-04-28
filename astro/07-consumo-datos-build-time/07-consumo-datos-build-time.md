# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 07: Consumo de Datos en Build Time

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Una de las capacidades más poderosas de Astro es la posibilidad de ejecutar `fetch()` en el **frontmatter** de los componentes durante el build. Esto significa que el resultado de llamadas a APIs externas se convierte en HTML estático: la API puede estar offline en producción y el sitio sigue funcionando perfectamente.

Este módulo explora el consumo de datos de APIs REST en tiempo de compilación, incluyendo manejo de errores, tipos TypeScript y generación de páginas desde datos remotos.

---

## 2. Conceptos Clave

### Fetch en frontmatter vs en `<script>`

```
FRONTMATTER (servidor / build time):
- Se ejecuta en Node.js durante el build
- El resultado queda "quemado" en el HTML
- No hay JavaScript en el cliente
- Ideal para: datos que no cambian en tiempo real

<script> (cliente):
- Se ejecuta en el navegador
- Puede actualizar la UI dinámicamente
- Requiere enviar JS al cliente
- Ideal para: datos que cambian frecuentemente, interacciones del usuario
```

### Cuándo usar build-time fetch

- Listas de recursos que cambian raramente (catálogos, documentación)
- Datos de APIs públicas para poblar páginas de contenido
- Reducir llamadas a APIs en tiempo de ejecución
- Sitios con presupuesto de API limitado

---

## 3. Explicación Técnica

### Patrón básico de fetch en frontmatter

```astro
---
// El tipo `Response` y `fetch` están disponibles globalmente en Node 18+
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

let posts: Post[] = [];
let error: string | null = null;

try {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  posts = await response.json() as Post[];
} catch (err) {
  error = err instanceof Error ? err.message : 'Error desconocido';
  console.error('[build] Error al obtener posts:', error);
}
---

{error ? (
  <p class="error">No se pudieron cargar los datos: {error}</p>
) : (
  <ul>
    {posts.map(p => <li>{p.title}</li>)}
  </ul>
)}
```

### Fetch tipado con función auxiliar

```typescript
// src/lib/api.ts
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}
```

### Generación de páginas desde API

```astro
---
// src/pages/posts/[id].astro
import { fetchJson } from '../../lib/api';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export async function getStaticPaths() {
  const posts = await fetchJson<Post[]>(
    'https://jsonplaceholder.typicode.com/posts'
  );
  return posts.map(post => ({
    params: { id: String(post.id) },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<h1>{post.title}</h1>
<p>{post.body}</p>
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Listado de posts de API pública

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

interface Post {
  id: number;
  title: string;
  body: string;
}

const posts = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
  .then(r => r.json()) as Post[];
---

<BaseLayout titulo="Noticias">
  <h1>Noticias recientes</h1>
  <div class="grid">
    {posts.map(post => (
      <article class="card">
        <h3>{post.title}</h3>
        <p>{post.body.slice(0, 100)}...</p>
        <a href={`/posts/${post.id}`}>Leer más →</a>
      </article>
    ))}
  </div>
</BaseLayout>
```

### Ejemplo 2: Función de utilidad tipada

```typescript
// src/lib/api.ts
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}

export async function getPosts(limit = 10): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts?_limit=${limit}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getPostById(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error(`Post ${id} no encontrado`);
  return res.json();
}
```

---

## 5. Buenas Prácticas

- Siempre usar `try/catch` alrededor del `fetch` en frontmatter — un error de red en build time detiene la generación del sitio.
- Usar variables de entorno para las URLs de APIs (`import.meta.env.PUBLIC_API_URL`).
- Crear funciones de utilidad en `src/lib/` para reutilizar la lógica de fetch entre páginas.
- Limitar el número de elementos en el build con `?_limit=N` cuando la API lo soporta.
- Registrar errores con `console.error` en frontmatter para que aparezcan en el log del build.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Build falla con `fetch is not defined` | Node < 18 | Actualizar a Node 18+ |
| Datos vacíos en producción | API caída durante el build | Implementar `try/catch` con fallback |
| Tipos incorrectos (`any`) | No se tipó la respuesta | Definir interfaces y usar `as Type` |
| Rate limiting durante build | Muchas peticiones a la misma API | Agregar `?_limit` o usar datos locales de fallback |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` añade:

- Página `/noticias` que muestra posts desde JSONPlaceholder.
- Páginas de detalle `/noticias/[id]` generadas desde la API.
- Archivo `src/lib/api.ts` con funciones de fetch tipadas.

---

## 8. Recursos

- [Fetch de datos en Astro](https://docs.astro.build/es/guides/data-fetching/)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — API REST pública para pruebas
- [Node.js Fetch API](https://nodejs.org/api/globals.html#fetch)
