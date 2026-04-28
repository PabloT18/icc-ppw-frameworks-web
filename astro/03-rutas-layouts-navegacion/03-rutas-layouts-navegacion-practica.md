# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 03: Rutas, Layouts y Navegación

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Añadir una capa de estructura visual consistente a `astro-campus`: un layout base compartido con header y footer, navegación con indicador de página activa, y una página 404 personalizada.

---

## Contexto de la Práctica

Después del módulo 02, el proyecto tiene dos páginas (`index.astro` y `about.astro`) pero cada una duplica el shell HTML completo. Este módulo centraliza esa estructura en `BaseLayout.astro`.

---

## Archivos que se crean / modifican

```
astro-campus/
└── src/
    ├── components/
    │   ├── Header.astro     ← NUEVO
    │   └── Footer.astro     ← NUEVO
    ├── layouts/
    │   └── BaseLayout.astro ← NUEVO
    └── pages/
        ├── index.astro      ← MODIFICADO (usa BaseLayout)
        ├── about.astro      ← MODIFICADO (usa BaseLayout)
        └── 404.astro        ← NUEVO
```

---

## Paso 1: Crear `BaseLayout.astro`

**¿Qué hace este paso?** Centraliza el shell HTML (`<html>`, `<head>`, meta tags, `<body>`) en un único lugar. Todas las páginas lo usarán como contenedor.

Crear `src/layouts/BaseLayout.astro`:

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  titulo: string;
  descripcion?: string;
}

const { titulo, descripcion = "Portal de contenido Astro Campus" } = Astro.props;
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={descripcion} />
    <title>{titulo} — Astro Campus</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style is:global>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: #0f0f0f;
    color: #e8e8e8;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  main {
    flex: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
  }
  h1 { color: #FF5D01; }
  h2 { color: #ccc; }
  a  { color: #FF5D01; }
</style>
```

---

## Paso 2: Crear `Header.astro`

**¿Qué hace este paso?** Crea la barra de navegación superior con indicador de página activa.

Crear `src/components/Header.astro`:

```astro
---
const rutaActual = Astro.url.pathname;

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/about', label: 'Acerca' },
];
---

<header class="site-header">
  <div class="logo">
    <a href="/">🚀 Astro Campus</a>
  </div>
  <nav aria-label="Navegación principal">
    {navLinks.map(link => (
      <a
        href={link.href}
        class:list={['nav-link', { activo: rutaActual === link.href }]}
        aria-current={rutaActual === link.href ? 'page' : undefined}
      >
        {link.label}
      </a>
    ))}
  </nav>
</header>

<style>
  .site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-bottom: 1px solid #1e1e1e;
    background: #0a0a0a;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .logo a {
    color: #FF5D01;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
  }
  nav { display: flex; gap: 1.5rem; }
  .nav-link {
    color: #aaa;
    text-decoration: none;
    font-size: 0.95rem;
    padding: 0.25rem 0;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s;
  }
  .nav-link:hover { color: #e8e8e8; }
  .nav-link.activo {
    color: #FF5D01;
    border-bottom-color: #FF5D01;
  }
</style>
```

---

## Paso 3: Crear `Footer.astro`

**¿Qué hace este paso?** Agrega un pie de página consistente con el año dinámico generado en el servidor.

Crear `src/components/Footer.astro`:

```astro
---
const anio = new Date().getFullYear();
---

<footer class="site-footer">
  <p>© {anio} Astro Campus — Programación y Plataformas Web</p>
</footer>

<style>
  .site-footer {
    border-top: 1px solid #1e1e1e;
    padding: 1rem 2rem;
    text-align: center;
    color: #555;
    font-size: 0.85rem;
    background: #0a0a0a;
  }
</style>
```

---

## Paso 4: Refactorizar `index.astro` para usar `BaseLayout`

**¿Qué hace este paso?** Reemplaza el shell HTML duplicado por el uso del layout. La página ahora solo contiene su contenido específico.

Actualizar `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import RecursoCard from '../components/RecursoCard.astro';

const recursos = [
  {
    titulo: "Documentación oficial de Astro",
    url: "https://docs.astro.build/es/",
    descripcion: "Referencia completa del framework Astro.",
  },
  {
    titulo: "MDN Web Docs",
    url: "https://developer.mozilla.org/es/",
    descripcion: "Referencia de HTML, CSS y JavaScript.",
  },
];
---

<BaseLayout titulo="Inicio" descripcion="Portal de contenido Astro Campus">
  <h1>Astro Campus</h1>
  <p>Portal de contenido construido con Astro, módulo a módulo.</p>

  <section>
    <h2>Recursos</h2>
    {recursos.map(r => (
      <RecursoCard titulo={r.titulo} url={r.url} descripcion={r.descripcion} />
    ))}
  </section>
</BaseLayout>
```

---

## Paso 5: Refactorizar `about.astro`

Actualizar `src/pages/about.astro` del mismo modo:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const equipo = [
  { nombre: "Pablo Torres", rol: "Docente", github: "PabloT18" },
];
---

<BaseLayout titulo="Acerca" descripcion="Información sobre el proyecto Astro Campus">
  <h1>Acerca de Astro Campus</h1>
  <p>Proyecto incremental para aprender Astro en el curso PPW.</p>

  <h2>Equipo</h2>
  <ul>
    {equipo.map(p => (
      <li>
        <strong>{p.nombre}</strong> — {p.rol} ·
        <a href={`https://github.com/${p.github}`} target="_blank" rel="noopener">GitHub</a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

---

## Paso 6: Crear `404.astro`

**¿Qué hace este paso?** Provee una página de error 404 personalizada que mantiene el layout del sitio.

Crear `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout titulo="Página no encontrada">
  <div class="error-container">
    <h1>404</h1>
    <p>La página que buscas no existe.</p>
    <a href="/">← Volver al inicio</a>
  </div>
</BaseLayout>

<style>
  .error-container {
    text-align: center;
    padding: 4rem 0;
  }
  h1 { font-size: 6rem; color: #FF5D01; margin: 0; }
  p { font-size: 1.2rem; color: #aaa; }
</style>
```

---

## Paso 7: TODO — Completar por el estudiante

El siguiente componente tiene partes incompletas. Completar según las instrucciones:

```astro
---
// src/components/NavLink.astro
// Componente auxiliar para un enlace de navegación con estado activo

interface Props {
  // TODO: Declarar las props: href (string), label (string)
}

// TODO: Desestructurar Astro.props con los tipos correctos
const { ___, ___ } = Astro.props;

// TODO: Obtener la ruta actual con Astro.url.pathname
const rutaActual = ___;

// TODO: Calcular si el enlace está activo
const estaActivo = ___ === ___;
---

<!-- TODO: Renderizar el enlace con la clase 'activo' cuando corresponde -->
<!-- Hint: usar class:list o expresión ternaria -->
<a href={___} class={___}>
  {___}
</a>

<style>
  a { color: #aaa; text-decoration: none; }
  /* TODO: Agregar estilo para a.activo */
</style>
```

---

## Validaciones esperadas

- [ ] Todas las páginas usan `BaseLayout.astro` (no tienen `<html>` propio)
- [ ] El `Header` aparece en todas las páginas con el mismo estilo
- [ ] El enlace activo se resalta visualmente al navegar
- [ ] `http://localhost:4321/ruta-inexistente` muestra la página 404 personalizada
- [ ] `pnpm astro check` no reporta errores de tipos
- [ ] El año en el `Footer` corresponde al año actual

---

## Entregables

- `src/layouts/BaseLayout.astro` con header, main slot y footer
- `src/components/Header.astro` con navegación activa
- `src/components/Footer.astro` con año dinámico
- `src/pages/404.astro` personalizada
- Capturas mostrando la navegación activa en al menos dos páginas diferentes

---

## Commits sugeridos

```
feat: add BaseLayout.astro with header and footer slots
feat: add Header.astro with active link detection
feat: add Footer.astro with dynamic year
refactor: migrate index.astro and about.astro to use BaseLayout
feat: add 404.astro custom error page
```
