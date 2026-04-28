# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 05: Rutas Dinámicas y Paginación

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Implementar rutas dinámicas para el detalle de recursos y una página de listado paginada. El estudiante aprenderá a usar `getStaticPaths()` con datos estáticos y `paginate()` de Astro.

---

## Archivos que se crean / modifican

```
astro-campus/
└── src/
    ├── data/
    │   └── recursos.ts         ← NUEVO
    └── pages/
        └── recursos/
            ├── index.astro     ← NUEVO (listado base)
            ├── [page].astro    ← NUEVO (paginación)
            └── [slug].astro    ← NUEVO (detalle)
```

---

## Paso 1: Crear el archivo de datos `recursos.ts`

**¿Qué hace este paso?** Centraliza los datos de recursos en un único archivo TypeScript. Así `getStaticPaths` y el listado usan la misma fuente.

Crear `src/data/recursos.ts`:

```typescript
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
    descripcion: 'Iconos de tecnologías de desarrollo.',
    categoria: 'Herramienta',
  },
];
```

---

## Paso 2: Crear `src/pages/recursos/index.astro`

**¿Qué hace este paso?** Crea una página de índice de recursos en `/recursos`. Redirige a la primera página de la paginación.

```astro
---
// Redirige /recursos → /recursos/1
return Astro.redirect('/recursos/1');
---
```

---

## Paso 3: Crear la ruta paginada `[page].astro`

**¿Qué hace este paso?** Genera una página por cada "bloque" de recursos usando `paginate()`.

Crear `src/pages/recursos/[page].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import RecursoCard from '../../components/RecursoCard.astro';
import { recursos } from '../../data/recursos';

export function getStaticPaths({ paginate }) {
  return paginate(recursos, { pageSize: 3 });
}

const { page } = Astro.props;
---

<BaseLayout titulo={`Recursos — Página ${page.currentPage}`}>
  <h1>Recursos</h1>
  <p>Total: {recursos.length} recursos</p>

  <div class="lista">
    {page.data.map(r => (
      <a href={`/recursos/${r.slug}`} class="recurso-link">
        <RecursoCard titulo={r.titulo} url={r.url} descripcion={r.descripcion} />
      </a>
    ))}
  </div>

  <nav class="paginacion">
    {page.url.prev && <a href={page.url.prev} class="btn">← Anterior</a>}
    <span>Página {page.currentPage} de {page.total}</span>
    {page.url.next && <a href={page.url.next} class="btn">Siguiente →</a>}
  </nav>
</BaseLayout>

<style>
  .lista { margin: 2rem 0; }
  .recurso-link { text-decoration: none; display: block; }
  .paginacion {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border, #333);
    color: var(--color-text-muted, #aaa);
  }
  .btn {
    color: var(--color-brand, #FF5D01);
    text-decoration: none;
    border: 1px solid var(--color-brand, #FF5D01);
    padding: 0.4rem 1rem;
    border-radius: var(--radius-md, 0.5rem);
    font-size: 0.9rem;
  }
  .btn:hover { background: var(--color-brand, #FF5D01); color: #fff; }
</style>
```

---

## Paso 4: Crear la ruta de detalle `[slug].astro`

Crear `src/pages/recursos/[slug].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { recursos } from '../../data/recursos';

export function getStaticPaths() {
  return recursos.map(r => ({
    params: { slug: r.slug },
    props: { recurso: r },
  }));
}

const { recurso } = Astro.props;
---

<BaseLayout titulo={recurso.titulo} descripcion={recurso.descripcion}>
  <nav><a href="/recursos/1">← Volver a recursos</a></nav>

  <article>
    <h1>{recurso.titulo}</h1>
    <p class="cat">Categoría: <strong>{recurso.categoria}</strong></p>
    <p>{recurso.descripcion}</p>
    <a href={recurso.url} target="_blank" rel="noopener noreferrer" class="btn-visit">
      Visitar sitio →
    </a>
  </article>
</BaseLayout>

<style>
  article { margin-top: 1rem; }
  .cat { color: var(--color-text-muted, #aaa); }
  .btn-visit {
    display: inline-block;
    margin-top: 1.5rem;
    background: var(--color-brand, #FF5D01);
    color: #fff;
    padding: 0.6rem 1.5rem;
    border-radius: var(--radius-md, 0.5rem);
    text-decoration: none;
    font-weight: 600;
  }
  .btn-visit:hover { opacity: 0.85; }
</style>
```

---

## Paso 5: TODO — Completar por el estudiante

```typescript
// src/data/recursos.ts — EXTENSIÓN
// TODO: Agregar al menos 3 recursos más al array
// Cada recurso debe tener: slug único, titulo, url válida, descripcion y categoria
// Las categorías disponibles son: 'Framework' | 'Referencia' | 'Herramienta' | 'Comunidad'

export const recursosExtra: Recurso[] = [
  // TODO: primer recurso adicional
  // TODO: segundo recurso adicional
  // TODO: tercer recurso adicional
];
```

Y en `src/pages/recursos/[slug].astro`:

```astro
---
// TODO: Agregar metadatos SEO: rel="canonical" apuntando a la URL del recurso externo
// ¿Dónde colocarlo? En el <head> del layout, pasándolo como prop extra
---
```

---

## Validaciones esperadas

- [ ] `http://localhost:4321/recursos` redirige a `/recursos/1`
- [ ] `/recursos/1` muestra los primeros 3 recursos
- [ ] `/recursos/2` muestra los siguientes recursos
- [ ] Los botones Anterior/Siguiente funcionan correctamente
- [ ] `/recursos/astro-docs` muestra la página de detalle
- [ ] `pnpm build` genera todos los HTML sin errores
- [ ] `pnpm astro check` no reporta errores de TypeScript

---

## Entregables

- `src/data/recursos.ts` con al menos 9 recursos (6 originales + 3 nuevos)
- Páginas de listado y detalle funcionales
- Captura de `/recursos/1` con paginación visible
- Captura de una página de detalle

---

## Commits sugeridos

```
feat: add recursos.ts data source with typed interface
feat: add /recursos/[page].astro with pagination
feat: add /recursos/[slug].astro detail page
feat: add /recursos/index.astro redirect
feat: add 3 additional resources to data source
```
