# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 04: Componentes, Props y Estilos

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Construir un sistema de componentes reutilizables con props tipados y estilos consistentes usando tokens de diseño. El proyecto `astro-campus` adquirirá una identidad visual cohesiva.

---

## Archivos que se crean / modifican

```
astro-campus/
└── src/
    ├── components/
    │   ├── Hero.astro       ← NUEVO
    │   ├── Badge.astro      ← NUEVO
    │   └── RecursoCard.astro← MODIFICADO (usa tokens CSS)
    ├── layouts/
    │   └── BaseLayout.astro ← MODIFICADO (importa global.css)
    ├── styles/
    │   └── global.css       ← NUEVO
    └── pages/
        └── index.astro      ← MODIFICADO (usa Hero)
```

---

## Paso 1: Crear `src/styles/global.css`

**¿Qué hace este paso?** Define los tokens de diseño (variables CSS) que todos los componentes usarán. Centralizar aquí garantiza consistencia.

```css
/* src/styles/global.css */
:root {
  --color-brand:      #FF5D01;
  --color-bg:         #0f0f0f;
  --color-bg-card:    #1a1a1a;
  --color-bg-header:  #0a0a0a;
  --color-text:       #e8e8e8;
  --color-text-muted: #aaa;
  --color-border:     #333;
  --radius-sm:        0.25rem;
  --radius-md:        0.5rem;
  --radius-lg:        1rem;
  --shadow-card:      0 2px 8px rgba(0, 0, 0, 0.4);
  --font-sans:        system-ui, -apple-system, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; }

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  line-height: 1.6;
}

main {
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

h1 { color: var(--color-brand); }
h2 { color: var(--color-text-muted); }
a  { color: var(--color-brand); }
```

---

## Paso 2: Importar `global.css` en `BaseLayout.astro`

**¿Qué hace este paso?** Hace que los tokens estén disponibles globalmente. Solo necesita importarse una vez.

En el frontmatter de `BaseLayout.astro`, añadir:

```astro
---
import '../styles/global.css';
// ... resto de imports y lógica
---
```

---

## Paso 3: Crear `Hero.astro`

**¿Qué hace este paso?** Crea la sección de bienvenida de la página de inicio. Practica props con valores por defecto y uso de tokens CSS.

```astro
---
interface Props {
  titulo: string;
  subtitulo?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const {
  titulo,
  subtitulo = "Portal de contenido construido con Astro",
  ctaLabel = "Ver recursos",
  ctaHref = "#recursos",
} = Astro.props;
---

<section class="hero">
  <h1>{titulo}</h1>
  {subtitulo && <p class="subtitulo">{subtitulo}</p>}
  <a href={ctaHref} class="cta">{ctaLabel}</a>
</section>

<style>
  .hero {
    padding: 4rem 0 3rem;
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: var(--color-brand);
    margin-bottom: 1rem;
  }
  .subtitulo {
    font-size: 1.1rem;
    color: var(--color-text-muted);
    max-width: 520px;
    margin: 0 auto 2rem;
    line-height: 1.7;
  }
  .cta {
    display: inline-block;
    background: var(--color-brand);
    color: #fff;
    padding: 0.75rem 2rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.2s;
  }
  .cta:hover { opacity: 0.85; }
</style>
```

---

## Paso 4: Crear `Badge.astro`

**¿Qué hace este paso?** Practica el uso de `class:list` con variantes de estilo. Los badges etiquetarán categorías de recursos.

```astro
---
interface Props {
  texto: string;
  variante?: 'info' | 'exito' | 'advertencia' | 'error';
}

const { texto, variante = 'info' } = Astro.props;
---

<span class:list={['badge', `badge-${variante}`]}>{texto}</span>

<style>
  .badge {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .badge-info        { background: #1e3a5f; color: #60a5fa; }
  .badge-exito       { background: #14532d; color: #22c55e; }
  .badge-advertencia { background: #451a03; color: #f59e0b; }
  .badge-error       { background: #450a0a; color: #f87171; }
</style>
```

---

## Paso 5: Actualizar `RecursoCard.astro` con tokens

**¿Qué hace este paso?** Sustituye los colores hardcodeados por variables CSS definidas en el paso 1.

En `src/components/RecursoCard.astro`, actualizar la sección `<style>`:

```astro
<style>
  .card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--color-bg-card);
    box-shadow: var(--shadow-card);
    transition: border-color 0.2s;
  }
  .card:hover { border-color: var(--color-brand); }
  h3 { margin: 0 0 0.5rem; font-size: 1rem; }
  a  { color: var(--color-brand); text-decoration: none; }
  a:hover { text-decoration: underline; }
  p  { color: var(--color-text-muted); font-size: 0.875rem; margin: 0; }
</style>
```

---

## Paso 6: Usar `Hero` y `Badge` en `index.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Badge from '../components/Badge.astro';
import RecursoCard from '../components/RecursoCard.astro';

const recursos = [
  {
    titulo: "Documentación oficial de Astro",
    url: "https://docs.astro.build/es/",
    descripcion: "Referencia completa del framework Astro.",
    categoria: "info",
  },
  {
    titulo: "MDN Web Docs",
    url: "https://developer.mozilla.org/es/",
    descripcion: "Referencia de HTML, CSS y JavaScript.",
    categoria: "exito",
  },
];
---

<BaseLayout titulo="Inicio">
  <Hero titulo="Astro Campus" />

  <section id="recursos">
    <h2>Recursos</h2>
    {recursos.map(r => (
      <div>
        <Badge texto={r.categoria} variante={r.categoria as any} />
        <RecursoCard titulo={r.titulo} url={r.url} descripcion={r.descripcion} />
      </div>
    ))}
  </section>
</BaseLayout>
```

---

## Paso 7: TODO — Completar por el estudiante

```astro
---
// TODO: Crear un componente src/components/StatCard.astro
// El componente debe mostrar: un número grande (stat), una etiqueta (label) y
// un icono emoji opcional (icon). Ejemplo de uso:
// <StatCard stat="13" label="Módulos" icon="📚" />
// <StatCard stat="4" label="Proyectos" icon="🚀" />

interface Props {
  // TODO: Declarar props: stat (string), label (string), icon (opcional string)
}

const { ___, ___, ___ } = Astro.props;
---

<!-- TODO: Construir el template del componente con estilos usando variables CSS -->
<div class="stat-card">
  <!-- TODO: Mostrar el icono solo si fue provisto -->
  <!-- TODO: Mostrar el número en grande con color brand -->
  <!-- TODO: Mostrar el label con color muted -->
</div>

<style>
  /* TODO: Agregar estilos usando var(--color-*) */
</style>
```

---

## Validaciones esperadas

- [ ] `global.css` existe y está importado en `BaseLayout.astro`
- [ ] Los tokens CSS (`--color-brand`, etc.) están definidos en `:root`
- [ ] `Hero.astro` se muestra en la página de inicio
- [ ] `Badge.astro` cambia de color según la prop `variante`
- [ ] `RecursoCard.astro` usa variables CSS, no colores hardcodeados
- [ ] `pnpm astro check` no reporta errores

---

## Entregables

- `src/styles/global.css` con al menos 8 tokens definidos
- `src/components/Hero.astro`, `Badge.astro` y `StatCard.astro` completados
- Captura de la página de inicio con el Hero y los badges visibles

---

## Commits sugeridos

```
feat: add global.css with design tokens
feat: add Hero.astro component with props
feat: add Badge.astro with class:list variants
refactor: update RecursoCard to use CSS variables
feat: add StatCard.astro component
```
