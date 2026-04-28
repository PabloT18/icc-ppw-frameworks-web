# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 04: Componentes, Props y Estilos

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Los componentes son la unidad de composición en Astro. A diferencia de los módulos anteriores donde los componentes eran simples, este módulo explora en profundidad el sistema de props, la reutilización de componentes a distintos niveles y las estrategias de estilos: scoped, global, tokens CSS, y hoja de estilos compartida.

El objetivo es que el estudiante pueda construir un sistema de diseño básico: un conjunto de componentes reutilizables con estilos consistentes aplicado a todo el proyecto.

---

## 2. Conceptos Clave

### Componentes Astro: el modelo mental

Un componente `.astro` es una función que recibe props y devuelve HTML. No tiene estado reactivo, no hace re-renderizado en cliente: se ejecuta una vez en el servidor/build y produce HTML estático.

```
Props → [ Frontmatter: lógica del servidor ] → HTML Template
```

### Props avanzados: tipos, valores por defecto, validación

```astro
---
interface Props {
  titulo: string;
  subtitulo?: string;       // opcional
  variante?: 'primario' | 'secundario';  // union type
  destacado?: boolean;
  conteo?: number;
}

const {
  titulo,
  subtitulo = "",
  variante = 'primario',
  destacado = false,
  conteo = 0,
} = Astro.props;
---
```

### `class:list` — control de clases dinámicas

```astro
---
const { activo, tamanio = 'md' } = Astro.props;
---

<button
  class:list={[
    'btn',
    `btn-${tamanio}`,
    { 'btn-activo': activo },
    { 'btn-inactivo': !activo },
  ]}
>
  Click
</button>
```

`class:list` acepta: strings, objetos `{ clase: booleano }`, arrays de los anteriores.

### Tokens de diseño con variables CSS

```css
/* src/styles/global.css */
:root {
  --color-brand:     #FF5D01;
  --color-bg:        #0f0f0f;
  --color-bg-card:   #1a1a1a;
  --color-text:      #e8e8e8;
  --color-text-muted:#aaa;
  --color-border:    #333;
  --radius-md:       0.5rem;
  --radius-lg:       1rem;
  --shadow-card:     0 2px 8px rgba(0,0,0,0.4);
}
```

Los tokens se usan en componentes: `color: var(--color-brand)`.

---

## 3. Explicación Técnica

### Organización de estilos en Astro

| Técnica | Cuándo usar | Cómo |
|---------|-------------|------|
| `<style>` scoped | Estilos exclusivos del componente | Default en `.astro` |
| `<style is:global>` | Reset, tipografía base | En `BaseLayout.astro` |
| `import '*.css'` | Hojas CSS compartidas | En frontmatter |
| Variables CSS (custom properties) | Tokens de diseño | En `:root` del global.css |
| Clases utilitarias propias | Utilidades simples | En global.css |

### Composición de componentes

Los componentes se pueden anidar:

```
BaseLayout
  └── Header
        └── NavLink (por cada enlace)
  └── main (slot)
        └── HeroSection
              └── RecursoCard (múltiples)
  └── Footer
```

### `Astro.slots.has(nombre)` — slots condicionales

```astro
---
const tieneAcciones = Astro.slots.has('acciones');
---

<div class="card">
  <slot />
  {tieneAcciones && (
    <div class="card-acciones">
      <slot name="acciones" />
    </div>
  )}
</div>
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Componente `Hero.astro`

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
  ctaLabel = "Explorar",
  ctaHref = "/recursos",
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
    color: var(--color-brand, #FF5D01);
    margin-bottom: 1rem;
  }
  .subtitulo {
    font-size: 1.1rem;
    color: var(--color-text-muted, #aaa);
    max-width: 500px;
    margin: 0 auto 2rem;
  }
  .cta {
    display: inline-block;
    background: var(--color-brand, #FF5D01);
    color: #fff;
    padding: 0.75rem 2rem;
    border-radius: var(--radius-md, 0.5rem);
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.2s;
  }
  .cta:hover { opacity: 0.85; }
</style>
```

### Ejemplo 2: `Badge.astro` — variantes con `class:list`

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

### Ejemplo 3: `global.css` con tokens

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
  --font-mono:        'Courier New', Courier, monospace;
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
```

---

## 5. Buenas Prácticas

- Definir tokens de diseño en `global.css` desde el principio para mantener consistencia.
- Usar `class:list` en lugar de concatenar strings con ternario para clases dinámicas.
- Los props con múltiples variantes deben usar union types (`'info' | 'exito'`), no strings genéricos.
- Un componente debe tener un solo propósito. Si crece demasiado, dividirlo.
- Evitar estilos inline en el template; centralizarlos en `<style>` o en la hoja global.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Variable CSS no aplica | Olvidó definirla en `:root` | Agregar `--variable` en `:root` del global.css |
| Estilos de un componente "se escapan" | Uso de `is:global` accidental | Usar `<style>` sin `is:global` para estilos scoped |
| `class:list` ignora una clase | El valor booleano es `undefined` o `null` | Garantizar booleano explícito con `!!` o `Boolean()` |
| Props con tipo incorrecto | TypeScript permisivo | Usar `interface Props` explícita y `pnpm astro check` |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` adquiere:

- Un `Hero.astro` en la página de inicio.
- Componente `Badge.astro` para etiquetar categorías de recursos.
- Sistema de tokens CSS en `src/styles/global.css` importado desde el layout.
- `RecursoCard.astro` actualizado para usar variantes visuales.

---

## 8. Recursos

- [Componentes en Astro](https://docs.astro.build/es/basics/astro-components/)
- [class:list](https://docs.astro.build/es/reference/directives-reference/#classlist)
- [Estilos y CSS](https://docs.astro.build/es/guides/styling/)
- [Slots](https://docs.astro.build/es/basics/astro-components/#slots)
