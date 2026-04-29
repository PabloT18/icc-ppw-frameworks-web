# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 05: Rutas Dinámicas y Paginación

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Las rutas estáticas (un archivo = una ruta) son suficientes para sitios pequeños. Pero cuando el contenido crece — decenas de artículos, catálogos de recursos, listas de módulos — generarlas manualmente sería inviable. Astro resuelve esto con **rutas dinámicas** basadas en `getStaticPaths()`: una función que le indica a Astro qué rutas generar y con qué datos.

Este módulo cubre rutas dinámicas con parámetros y paginación estática.

---

## 2. Conceptos Clave

### Archivos con parámetros dinámicos

En Astro, los corchetes en el nombre del archivo definen un parámetro:

```
src/pages/recursos/[slug].astro    →   /recursos/astro-docs
                                       /recursos/mdn-web
                                       /recursos/can-i-use
```

El archivo se genera **N veces**, una por cada ruta retornada por `getStaticPaths`.

### `getStaticPaths()`

```astro
---
export function getStaticPaths() {
  // Retorna un array de objetos { params, props }
  return [
    { params: { slug: 'astro-docs' }, props: { titulo: 'Astro Docs', url: '...' } },
    { params: { slug: 'mdn-web' },    props: { titulo: 'MDN', url: '...' } },
  ];
}

// Los props declarados en getStaticPaths están disponibles aquí:
const { titulo, url } = Astro.props;
const { slug } = Astro.params;
---
```

### Paginación con `paginate()`

Astro tiene soporte nativo para paginación:

```astro
---
export function getStaticPaths({ paginate }) {
  const items = [...]; // Array completo
  return paginate(items, { pageSize: 10 });
}

const { page } = Astro.props;
// page.data     → items de la página actual
// page.currentPage → número de página
// page.total    → total de páginas
// page.url.prev → URL página anterior
// page.url.next → URL página siguiente
---
```

La URL generada es: `/recursos/1`, `/recursos/2`, etc.

---

## 3. Explicación

### Flujo completo de una ruta dinámica

```
1. Astro encuentra src/pages/recursos/[slug].astro
2. Llama a getStaticPaths()
3. Por cada objeto retornado: genera una ruta con esos params y props
4. El template usa Astro.params (la URL) y Astro.props (los datos)
5. En dist/ quedan: /recursos/astro-docs/index.html, /recursos/mdn-web/index.html
```

### Tipos de parámetros

```
[slug]        → un segmento: /recursos/algo
[...path]     → múltiples segmentos: /docs/a/b/c
```

### Parámetros tipados con TypeScript

```astro
---
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  return recursos.map(r => ({
    params: { slug: r.slug },
    props: { recurso: r },
  }));
}) satisfies GetStaticPaths;

interface Props {
  recurso: Recurso;
}
const { recurso } = Astro.props;
---
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Detalle de recurso

```astro
---
// src/pages/recursos/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';

const recursos = [
  { slug: 'astro-docs', titulo: 'Astro Docs', url: 'https://docs.astro.build', descripcion: 'Referencia oficial de Astro.', categoria: 'Framework' },
  { slug: 'mdn-web',    titulo: 'MDN Web Docs', url: 'https://developer.mozilla.org', descripcion: 'Referencia HTML, CSS y JS.', categoria: 'Referencia' },
  { slug: 'can-i-use',  titulo: 'Can I Use',  url: 'https://caniuse.com', descripcion: 'Compatibilidad de APIs.', categoria: 'Herramienta' },
];

export function getStaticPaths() {
  return recursos.map(r => ({
    params: { slug: r.slug },
    props: { recurso: r },
  }));
}

interface Props {
  recurso: typeof recursos[0];
}
const { recurso } = Astro.props;
---

<BaseLayout titulo={recurso.titulo} descripcion={recurso.descripcion}>
  <nav><a href="/recursos">← Volver a recursos</a></nav>
  <h1>{recurso.titulo}</h1>
  <p>{recurso.descripcion}</p>
  <p>Categoría: <strong>{recurso.categoria}</strong></p>
  <a href={recurso.url} target="_blank" rel="noopener">Visitar sitio →</a>
</BaseLayout>
```

### Ejemplo 2: Listado con paginación

```astro
---
// src/pages/recursos/[page].astro
import BaseLayout from '../../layouts/BaseLayout.astro';

const todosLosRecursos = [
  // ... array largo de recursos
];

export function getStaticPaths({ paginate }) {
  return paginate(todosLosRecursos, { pageSize: 5 });
}

const { page } = Astro.props;
---

<BaseLayout titulo={`Recursos — Página ${page.currentPage}`}>
  <h1>Recursos</h1>
  <ul>
    {page.data.map(r => (
      <li><a href={`/recursos/${r.slug}`}>{r.titulo}</a></li>
    ))}
  </ul>

  <nav class="paginacion">
    {page.url.prev && <a href={page.url.prev}>← Anterior</a>}
    <span>Página {page.currentPage} de {page.total}</span>
    {page.url.next && <a href={page.url.next}>Siguiente →</a>}
  </nav>
</BaseLayout>
```

---

## 5. Buenas Prácticas

- El slug debe derivarse del título con un proceso reproducible (p. ej. `titulo.toLowerCase().replace(/\s+/g, '-')`).
- Centralizar los datos en un archivo `src/data/recursos.ts` para no duplicarlos entre páginas.
- Usar `satisfies GetStaticPaths` para tipado estricto de `getStaticPaths`.
- Generar siempre la página `/recursos` (índice) además de `/recursos/[slug]` (detalle).
- Agregar `rel="canonical"` en las páginas de detalle para evitar contenido duplicado en SEO.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 404 en rutas dinámicas | `getStaticPaths` no retorna el slug exacto | Verificar que los slugs coinciden en `params` y en los datos |
| Datos `undefined` en el template | Props no declarados en `getStaticPaths` | Agregar el objeto al `props` de cada ruta |
| Paginación empieza en `/[page]` no en `/1` | La primera página siempre es `/1` con `paginate` | Agregar redirección o página `index.astro` |
| Build falla en ruta dinámica | `getStaticPaths` retorna 0 elementos | El array de datos no puede estar vacío en build estático |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` incorpora:

- Página de listado de recursos (`/recursos/1`, `/recursos/2`, ...).
- Página de detalle de cada recurso (`/recursos/[slug]`).
- Archivo `src/data/recursos.ts` como fuente de verdad de los datos.

---

## 8. Recursos

- [Rutas dinámicas](https://docs.astro.build/es/guides/routing/#rutas-din%C3%A1micas)
- [getStaticPaths](https://docs.astro.build/es/reference/api-reference/#getstaticpaths)
- [Paginación](https://docs.astro.build/es/guides/routing/#paginaci%C3%B3n)
