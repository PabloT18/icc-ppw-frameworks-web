# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 03: Rutas, Layouts y Navegación

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Una de las características más potentes de Astro es su sistema de enrutamiento basado en archivos. No hay que configurar un router externo: la estructura de `src/pages/` define automáticamente las rutas disponibles. Este módulo cubre tres conceptos relacionados: el **sistema de rutas**, los **layouts** que dan estructura consistente a las páginas, y la **navegación** entre ellas.

### ¿Por qué Astro usa rutas basadas en archivos?

Porque en un sitio de contenido (blog, portal, documentación) la jerarquía de carpetas refleja naturalmente la jerarquía de contenido. Esta convención elimina la fricción de mantener un archivo de rutas separado y hace el proyecto más predecible.

---

## 2. Conceptos Clave

### Sistema de rutas en Astro

```
src/pages/
├── index.astro          →  /
├── about.astro          →  /about
├── contacto.astro       →  /contacto
├── blog/
│   ├── index.astro      →  /blog
│   └── primer-post.md   →  /blog/primer-post
└── 404.astro            →  página de error 404
```

Cualquier archivo `.astro`, `.md` o `.mdx` en `src/pages/` genera una ruta. Los archivos en subcarpetas generan rutas anidadas.

### Layouts

Un layout es un componente `.astro` que acepta un `<slot />` — el espacio donde se inserta el contenido de la página que lo usa. Los layouts viven en `src/layouts/` (convención, no obligatorio).

```
Layout recibe la página como contenido del slot:

┌─────────────────────────────────┐
│ <html> <head> ...               │  ← Layout (common shell)
│   <body>                        │
│     <Header />                  │
│     ┌───────────────────────┐   │
│     │  <slot />             │   │  ← Contenido de la página
│     │  (aquí va la página)  │   │
│     └───────────────────────┘   │
│     <Footer />                  │
│   </body>                       │
└─────────────────────────────────┘
```

### `<slot />` y props de layout

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  titulo: string;
  descripcion?: string;
}
const { titulo, descripcion = "" } = Astro.props;
---

<html lang="es">
  <head>
    <title>{titulo} — Astro Campus</title>
    {descripcion && <meta name="description" content={descripcion} />}
  </head>
  <body>
    <header>...</header>
    <main>
      <slot />         <!-- Aquí va el contenido de la página -->
    </main>
    <footer>...</footer>
  </body>
</html>
```

Uso del layout en una página:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout titulo="Inicio" descripcion="Portal de contenido">
  <h1>Bienvenido</h1>
  <p>Este contenido va dentro del slot.</p>
</BaseLayout>
```

---

## 3. Explicación Técnica

### Navegación en Astro: HTML puro

A diferencia de React Router o Angular RouterLink, la navegación en Astro usa etiquetas `<a>` estándar de HTML:

```astro
<a href="/">Inicio</a>
<a href="/about">Acerca</a>
<a href="/blog">Blog</a>
```

Esto es correcto porque Astro genera HTML estático. Cada página es un documento completo; el navegador hace una petición HTTP normal para cada página, y como el HTML ya está pre-generado en el servidor, la respuesta es casi instantánea.

### Detectar la ruta activa

Astro proporciona `Astro.url` para saber la URL actual y marcar el enlace activo:

```astro
---
const rutaActual = Astro.url.pathname;
---

<nav>
  <a href="/" class={rutaActual === '/' ? 'activo' : ''}>Inicio</a>
  <a href="/about" class={rutaActual === '/about' ? 'activo' : ''}>Acerca</a>
</nav>
```

### Página 404 personalizada

Crear `src/pages/404.astro` es suficiente. Astro la sirve automáticamente cuando no se encuentra una ruta:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout titulo="Página no encontrada">
  <h1>404 — Página no encontrada</h1>
  <a href="/">← Volver al inicio</a>
</BaseLayout>
```

### Slots nombrados

Para layouts con múltiples áreas de inyección:

```astro
---
// src/layouts/BaseLayout.astro
---

<html lang="es">
  <body>
    <header>
      <slot name="header" />  <!-- slot nombrado -->
    </header>
    <main>
      <slot />                <!-- slot por defecto -->
    </main>
  </body>
</html>
```

Uso:

```astro
<BaseLayout titulo="Ejemplo">
  <h1 slot="header">Título en el header</h1>
  <p>Contenido en el slot por defecto</p>
</BaseLayout>
```

---

## 4. Ejemplos de Código

### Ejemplo 1: `BaseLayout.astro` completo

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
```

### Ejemplo 2: `Header.astro` con navegación activa

```astro
---
const rutaActual = Astro.url.pathname;

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/about', label: 'Acerca' },
  { href: '/recursos', label: 'Recursos' },
];
---

<header class="site-header">
  <div class="logo">
    <a href="/">Astro Campus</a>
  </div>
  <nav>
    {navLinks.map(link => (
      <a
        href={link.href}
        class={rutaActual === link.href ? 'nav-link activo' : 'nav-link'}
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
    border-bottom: 1px solid #333;
    background: #0f0f0f;
  }
  .logo a { color: #FF5D01; text-decoration: none; font-weight: bold; font-size: 1.2rem; }
  nav { display: flex; gap: 1.5rem; }
  .nav-link { color: #aaa; text-decoration: none; }
  .nav-link:hover { color: #e8e8e8; }
  .nav-link.activo { color: #FF5D01; font-weight: 600; }
</style>
```

### Ejemplo 3: Página usando el layout

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout titulo="Inicio" descripcion="Bienvenido a Astro Campus">
  <h1>Bienvenido a Astro Campus</h1>
  <p>Portal de contenido construido módulo a módulo con Astro.</p>
</BaseLayout>
```

---

## 5. Buenas Prácticas

- Un solo `BaseLayout.astro` para todas las páginas del sitio evita duplicar `<html>`, `<head>` y meta tags.
- Incluir `aria-current="page"` en los enlaces de navegación activos para accesibilidad.
- No duplicar el `<html lang="">` o el `<meta charset>` entre layout y página.
- Centralizar los estilos globales en el layout o en un `global.css` importado desde él.
- Mantener el `<Header>` y `<Footer>` como componentes separados, no incrustados directamente en el layout.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| HTML duplicado (`<html>` anidado) | Layout y página incluyen `<html>` | El layout maneja el shell; la página solo pasa contenido al slot |
| Link activo siempre marcado | Comparación de pathname incorrecta | Usar `===` exacta; para rutas anidadas usar `startsWith` |
| 404 no personalizada | No existe `src/pages/404.astro` | Crear el archivo con el nombre exacto |
| `<slot>` no renderiza | Olvidó el tag `<slot />` en el layout | Agregar `<slot />` donde debe ir el contenido |

---

## 7. Relación con el Proyecto Incremental

En este módulo, **Astro Campus** adquiere una estructura visual consistente:

- `BaseLayout.astro` envuelve todas las páginas.
- `Header.astro` con navegación activa aparece en todas las páginas.
- `Footer.astro` con créditos aparece en todas las páginas.
- Página `404.astro` para errores de navegación.

A partir de este punto, agregar nuevas páginas (módulos siguientes) solo requiere crear un archivo en `src/pages/` y usar `BaseLayout`.

---

## 8. Recursos

- [Rutas en Astro](https://docs.astro.build/es/guides/routing/)
- [Layouts](https://docs.astro.build/es/basics/layouts/)
- [Slots](https://docs.astro.build/es/basics/astro-components/#slots)
- [Astro.url](https://docs.astro.build/es/reference/api-reference/#astrourl)
