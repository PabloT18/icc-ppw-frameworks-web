# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 12: SEO, Accesibilidad y Rendimiento

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Un sitio funcionalmente correcto que nadie encuentra o que excluye a parte de sus usuarios tiene un valor limitado. SEO (Search Engine Optimization), accesibilidad y rendimiento no son extras opcionales — son parte del estándar de calidad de cualquier aplicación web moderna.

Astro tiene ventajas nativas: genera HTML limpio, cero JS por defecto y estructura semántica sencilla de construir correctamente.

---

## 2. Conceptos Clave

### Meta tags esenciales

```html
<!-- Básicos -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="Descripción concisa de la página (150-160 chars)." />
<title>Título de la página | Nombre del Sitio</title>

<!-- Open Graph (compartir en redes sociales) -->
<meta property="og:title"       content="Título" />
<meta property="og:description" content="Descripción" />
<meta property="og:image"       content="https://ejemplo.com/og-image.jpg" />
<meta property="og:url"         content="https://ejemplo.com/pagina" />
<meta property="og:type"        content="website" />

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Título" />
<meta name="twitter:description" content="Descripción" />
<meta name="twitter:image"       content="https://ejemplo.com/og-image.jpg" />
```

### Accesibilidad (a11y) — conceptos clave

| Concepto | Ejemplo |
|----------|---------|
| Landmark roles | `<header>`, `<main>`, `<nav>`, `<footer>` |
| Texto alternativo | `<img alt="Descripción de la imagen" />` |
| Focus visible | No eliminar outline CSS |
| Contraste | Ratio mínimo 4.5:1 (AA) para texto normal |
| Skip link | `<a href="#main-content">Saltar al contenido</a>` |
| aria-label | Para elementos interactivos sin texto visible |
| Headings | Jerarquía correcta: h1 > h2 > h3 |

### `<Image>` de Astro

```astro
---
import { Image } from 'astro:assets';
import miImagen from '../assets/foto.jpg';
---

<!-- Astro optimiza automáticamente: tamaño, formato WebP, lazy loading -->
<Image src={miImagen} alt="Descripción" width={800} height={450} />
```

### View Transitions

```astro
---
// En BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

Añade transiciones suaves entre páginas (tipo SPA) sin JavaScript adicional.

---

## 3. Explicación Técnica

### Componente `SEO.astro`

Centralizar los meta tags en un componente reutilizable:

```astro
---
// src/components/SEO.astro
interface Props {
  titulo: string;
  descripcion?: string;
  imagen?: string;
  url?: string;
  tipo?: 'website' | 'article';
}

const {
  titulo,
  descripcion = 'Plataforma de recursos de programación web moderna.',
  imagen = '/og-default.jpg',
  url = Astro.url.href,
  tipo = 'website',
} = Astro.props;

const tituloPagina = `${titulo} | Astro Campus`;
---

<title>{tituloPagina}</title>
<meta name="description" content={descripcion} />

<meta property="og:title"       content={tituloPagina} />
<meta property="og:description" content={descripcion} />
<meta property="og:image"       content={imagen} />
<meta property="og:url"         content={url} />
<meta property="og:type"        content={tipo} />

<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content={tituloPagina} />
<meta name="twitter:description" content={descripcion} />
<meta name="twitter:image"       content={imagen} />
```

### Skip link de accesibilidad

```astro
<!-- Al inicio de BaseLayout.astro, antes del Header -->
<a href="#main-content" class="skip-link">Saltar al contenido</a>

<!-- En el <main> de BaseLayout.astro -->
<main id="main-content">
  <slot />
</main>
```

```css
/* Visible solo al recibir foco (teclado) */
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  background: var(--color-brand);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  z-index: 1000;
}
.skip-link:focus { top: 0; }
```

---

## 4. Ejemplos de Código

### Ejemplo 1: BaseLayout con SEO + ViewTransitions + Skip link

```astro
---
import { ViewTransitions } from 'astro:transitions';
import SEO from '../components/SEO.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  titulo: string;
  descripcion?: string;
}

const { titulo, descripcion } = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <SEO titulo={titulo} descripcion={descripcion} />
    <ViewTransitions />
  </head>
  <body>
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### Ejemplo 2: Imagen optimizada en RecursoCard

```astro
---
import { Image } from 'astro:assets';
// Solo para imágenes locales (en /src/assets/)
// Para imágenes remotas usar: inferRemoteSize, domains en config
---
<!-- Para URLs externas, Image requiere configuración adicional -->
<!-- Para este proyecto, usar img HTML con loading="lazy" -->
<img
  src={imagenUrl}
  alt={`Imagen de ${titulo}`}
  loading="lazy"
  decoding="async"
  width="400"
  height="225"
/>
```

---

## 5. Buenas Prácticas

- Siempre incluir `alt` en imágenes. Si es decorativa, usar `alt=""`.
- El `<h1>` debe ser único por página y describir el contenido principal.
- No usar `tabindex` positivos — arruina el orden de foco natural.
- Probar con teclado: Tab, Shift+Tab, Enter, Espacio.
- Validar contraste con herramientas como WebAIM Contrast Checker.
- `<title>` diferente en cada página para SEO y navegación con tabs.
- No superar 160 caracteres en `meta[name="description"]`.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `<title>` igual en todas las páginas | SEO duplicado | Incluir título dinámico en cada ruta |
| Imágenes sin `alt` | Falta de accesibilidad | Siempre agregar, aunque sea `alt=""` |
| Contraste insuficiente | Color gris muy claro sobre fondo oscuro | Verificar con herramientas WCAG |
| ViewTransitions rompe scripts | Scripts no se re-ejecutan tras transición | Usar `data-astro-rerun` o mover lógica a módulos |
| Open Graph image no carga | URL relativa en el tag `og:image` | Siempre usar URL absoluta |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` añade:

- Componente `SEO.astro` centralizado.
- `BaseLayout.astro` actualizado con SEO, skip link y View Transitions.
- Metadatos específicos en páginas de detalle (blog, recursos).
- Atributo `lang="es"` en el `<html>`.

---

## 8. Recursos

- [SEO en Astro](https://docs.astro.build/es/guides/seo/)
- [Image component](https://docs.astro.build/es/guides/images/)
- [View Transitions](https://docs.astro.build/es/guides/view-transitions/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse (Chrome DevTools)](https://developer.chrome.com/docs/lighthouse/)
