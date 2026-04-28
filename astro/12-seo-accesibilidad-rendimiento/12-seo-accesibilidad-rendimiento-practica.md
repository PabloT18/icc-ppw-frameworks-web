# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 12: SEO, Accesibilidad y Rendimiento

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Integrar un componente SEO centralizado, View Transitions y mejoras de accesibilidad en `astro-campus`.

---

## Archivos que se crean / modifican

```
astro-campus/
└── src/
    ├── components/
    │   ├── SEO.astro             ← NUEVO
    │   └── BaseLayout.astro     ← MODIFICAR
    └── styles/
        └── global.css           ← MODIFICAR: agregar .skip-link
```

---

## Paso 1: Crear `src/components/SEO.astro`

**¿Qué hace este paso?** Centraliza todos los meta tags de SEO, Open Graph y Twitter Card en un componente reutilizable.

```astro
---
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

---

## Paso 2: Actualizar `src/layouts/BaseLayout.astro`

**¿Qué hace este paso?** Integra el componente SEO, el skip link de accesibilidad y las View Transitions.

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
    <main id="main-content" class="container">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

---

## Paso 3: Agregar el estilo `.skip-link` a `global.css`

```css
/* Accesibilidad: skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  background: var(--color-brand);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  z-index: 1000;
  transition: top 0.1s;
}
.skip-link:focus {
  top: 0;
}
```

---

## Paso 4: TODO — Completar por el estudiante

```astro
---
// TODO en src/pages/blog/[slug].astro:
// Pasar la descripción del post a BaseLayout
// Pasar tipo="article" al componente SEO
// Ejemplo:
// <BaseLayout titulo={post.data.titulo} descripcion={post.data.descripcion}>
---
```

```astro
---
// TODO en cualquier página:
// Verificar que todos los <img> tienen atributo alt
// Verificar que no hay dos <h1> en la misma página
// Probar navegación solo con teclado (Tab, Enter)
---
```

---

## Validaciones esperadas

- [ ] El `<title>` en cada página sigue el formato "Título | Astro Campus"
- [ ] Las meta tags og:title y og:description se generan correctamente
- [ ] El skip link aparece al presionar Tab por primera vez
- [ ] Las transiciones entre páginas son suaves (View Transitions)
- [ ] Lighthouse Score en Performance > 90 en producción
- [ ] No hay imágenes sin `alt` en el sitio

---

## Entregables

- `src/components/SEO.astro` funcional
- `BaseLayout.astro` con SEO + skip link + ViewTransitions
- `global.css` con estilos del skip link
- Captura del Lighthouse report del sitio en producción

---

## Commits sugeridos

```
feat: add SEO component with Open Graph and Twitter Card
feat: integrate ViewTransitions in BaseLayout
feat: add skip-link for keyboard accessibility
```
