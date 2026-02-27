# Programación y Plataformas Web 

# Frameworks Web: Astro

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 3: Navegación en Astro

### Autores

**Pablo Torres**  
📧 ptorresp@ups.edu.ec  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## Navegación en Astro: Un Enfoque Diferente

La navegación en Astro es fundamentalmente diferente a la que encontramos en frameworks SPA como Angular, React o Vue. Mientras que esos frameworks utilizan enrutamiento del lado del cliente (Client-Side Routing) con JavaScript, **Astro usa navegación tradicional del navegador** similar a sitios web clásicos.

## ¿Por qué Astro NO usa Client-Side Routing?

### Diferencias Fundamentales

En Angular o React, la navegación es manejada por JavaScript:

```html
<!-- Angular: RouterLink intercepta el click -->
<a routerLink="/perfil">Ver Perfil</a>

<!-- React Router: Link previene la recarga -->
<Link to="/perfil">Ver Perfil</Link>
```

Estos enlaces **NO recargan la página**. El framework intercepta el click, actualiza la URL y renderiza el nuevo componente sin hacer una petición al servidor.

En Astro, usamos enlaces HTML estándar:

```html
<!-- Astro: Enlace HTML tradicional -->
<a href="/perfil">Ver Perfil</a>
```

Este enlace **SÍ navega normalmente**, pero como Astro genera HTML estático ultra-optimizado, la navegación es extremadamente rápida. Además, los navegadores modernos hacen precarga automática de páginas, haciendo la experiencia casi instantánea.

##  ¿Es Más Lento? No Necesariamente

Aunque Astro usa navegación tradicional, varias optimizaciones hacen que la experiencia sea igual de rápida:

### 1. **View Transitions API**

Astro 3.0+ soporta la View Transitions API nativa del navegador, permitiendo transiciones suaves entre páginas **sin JavaScript adicional**:

```astro
---
// src/layouts/BaseLayout.astro
---

<html lang="es" transition:animate="fade">
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Con esto, la navegación tiene animaciones suaves como en una SPA.

### 2. **Prefetch Automático**

Los navegadores modernos precargan automáticamente los enlaces visibles, por lo que cuando el usuario hace click, la página ya está en caché.

### 3. **HTML Estático Ultra-Rápido**

Como Astro genera HTML estático, no hay renderizado del lado del cliente. El navegador simplemente muestra el HTML inmediatamente.

## Navegación Basada en Archivos

La característica más importante de la navegación en Astro es el **enrutamiento automático basado en archivos**.

### Estructura de Carpetas = Rutas

```
src/pages/
├── index.astro           → /
├── about.astro           → /about
├── perfil.astro          → /perfil
├── blog/
│   ├── index.astro       → /blog
│   ├── post-1.astro      → /blog/post-1
│   └── post-2.astro      → /blog/post-2
└── productos/
    ├── index.astro       → /productos
    └── [id].astro        → /productos/:id (dinámico)
```

**No hay configuración de rutas**. La estructura de carpetas define automáticamente las URLs.

## Tipos de Enlaces en Astro

### 1. Enlaces Internos (Entre Páginas de tu Sitio)

Para navegar entre páginas de tu propio sitio, usa enlaces relativos o absolutos:

```astro
<!-- Enlaces absolutos (recomendado) -->
<a href="/">Inicio</a>
<a href="/perfil">Mi Perfil</a>
<a href="/blog">Blog</a>

<!-- Enlaces relativos -->
<a href="../">Volver</a>
<a href="./contacto">Contacto</a>
```

**Recomendación**: Usa rutas absolutas (`/perfil`) en lugar de relativas (`../perfil`) para evitar problemas.

### 2. Enlaces Externos

Para enlaces externos, siempre incluye `http://` o `https://`:

```astro
<!-- Enlace externo -->
<a href="https://github.com/PabloT18" target="_blank" rel="noopener noreferrer">
  GitHub
</a>
```

**Importante**: Siempre usa `target="_blank"` y `rel="noopener noreferrer"` para enlaces externos por seguridad.

### 3. Enlaces a Recursos Estáticos

Para recursos en la carpeta `public/`:

```astro
<!-- Recursos en public/ -->
<img src="/favicon.svg" alt="Logo">
<a href="/curriculum.pdf" download>Descargar CV</a>
```

**Nota**: Los archivos en `public/` se sirven desde la raíz `/`.

## Navegación con Estilo Activo

A diferencia de Angular que tiene `routerLinkActive`, en Astro debemos manejar el estado activo manualmente:

### Opción 1: Usando `Astro.url`

```astro
---
// src/components/Navbar.astro
const currentPath = Astro.url.pathname;
---

<nav>
  <a 
    href="/" 
    class:list={['nav-link', { active: currentPath === '/' }]}
  >
    Inicio
  </a>
  
  <a 
    href="/perfil" 
    class:list={['nav-link', { active: currentPath === '/perfil' }]}
  >
    Perfil
  </a>
  
  <a 
    href="/blog" 
    class:list={['nav-link', { active: currentPath.startsWith('/blog') }]}
  >
    Blog
  </a>
</nav>

<style>
  .nav-link {
    color: #64748b;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }
  
  .nav-link:hover {
    background: #f1f5f9;
  }
  
  .nav-link.active {
    color: #0ea5e9;
    background: #e0f2fe;
    font-weight: 600;
  }
</style>
```

**Explicación del código:**

1. **`Astro.url.pathname`**: Obtiene la ruta actual (e.g., `/perfil`)
2. **`class:list`**: Directiva de Astro para aplicar clases condicionalmente
3. **`.startsWith('/blog')`**: Marca como activo todas las páginas que empiecen con `/blog`

### Opción 2: Componente Reutilizable

Crear un componente `NavLink` para reutilizar la lógica:

```astro
---
// src/components/NavLink.astro
interface Props {
  href: string;
  children: any;
}

const { href } = Astro.props;
const currentPath = Astro.url.pathname;
const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
---

<a 
  href={href} 
  class:list={['nav-link', { active: isActive }]}
>
  <slot />
</a>

<style>
  .nav-link {
    color: #64748b;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }
  
  .nav-link:hover {
    background: #f1f5f9;
  }
  
  .nav-link.active {
    color: #0ea5e9;
    background: #e0f2fe;
    font-weight: 600;
  }
</style>
```

Y usarlo en cualquier lugar:

```astro
---
import NavLink from '../components/NavLink.astro';
---

<nav>
  <NavLink href="/">🏠 Inicio</NavLink>
  <NavLink href="/perfil">👤 Perfil</NavLink>
  <NavLink href="/blog"> Blog</NavLink>
  <NavLink href="/contacto">📧 Contacto</NavLink>
</nav>
```

## Rutas Dinámicas

Astro soporta rutas dinámicas usando corchetes `[]`:

### Ejemplo: Blog con Posts Dinámicos

```
src/pages/blog/
├── index.astro
└── [slug].astro
```

**`src/pages/blog/[slug].astro`:**

```astro
---
// Función que genera todas las rutas estáticas
export async function getStaticPaths() {
  return [
    { params: { slug: 'mi-primer-post' } },
    { params: { slug: 'astro-vs-angular' } },
    { params: { slug: 'guia-navegacion' } }
  ];
}

const { slug } = Astro.params;
---

<h1>Post: {slug}</h1>
<p>Esta es la página del post "{slug}"</p>
```

**URLs generadas:**
- `/blog/mi-primer-post`
- `/blog/astro-vs-angular`
- `/blog/guia-navegacion`

### Con Datos de una API o CMS

```astro
---
// src/pages/productos/[id].astro
export async function getStaticPaths() {
  const response = await fetch('https://api.example.com/productos');
  const productos = await response.json();
  
  return productos.map((producto) => ({
    params: { id: producto.id.toString() },
    props: { producto }
  }));
}

const { producto } = Astro.props;
---

<h1>{producto.nombre}</h1>
<p>{producto.descripcion}</p>
<p>Precio: ${producto.precio}</p>
```

## Navegación con View Transitions

Para una experiencia SPA-like sin JavaScript adicional:

### Paso 1: Agregar View Transitions al Layout

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Paso 2: Personalizar Transiciones

```astro
---
import { fade, slide } from 'astro:transitions';
---

<div transition:animate={fade({ duration: '0.3s' })}>
  <h1>Contenido con transición fade</h1>
</div>

<aside transition:animate={slide({ duration: '0.5s' })}>
  <p>Sidebar con transición slide</p>
</aside>
```

### Paso 3: Persistir Elementos Entre Páginas

Para mantener elementos (como un reproductor de música) entre navegaciones:

```astro
<audio transition:persist>
  <source src="/musica.mp3" type="audio/mpeg" />
</audio>
```

## Comparación: Astro vs Angular

| Aspecto | Angular | Astro |
|---------|---------|-------|
| **Tipo de Navegación** | Client-Side Routing (SPA) | Traditional Navigation |
| **Directiva** | `routerLink` | `href` (HTML estándar) |
| **Recarga de Página** | ❌ No recarga | ✅ Recarga (pero optimizado) |
| **Configuración** | `app.routes.ts` manual | Automático (basado en archivos) |
| **Estado Activo** | `routerLinkActive` | Manual con `Astro.url` |
| **JavaScript** | Siempre cargado | Solo si es necesario |
| **Transiciones** | Requiere librerías | View Transitions API nativa |
| **Rutas Dinámicas** | `:id` en config | `[id].astro` |
| **Mejor Para** | Aplicaciones complejas | Sitios de contenido |

## Práctica

### Estructura del Proyecto

```
src/
├── layouts/
│   └── BaseLayout.astro
├── components/
│   ├── Navbar.astro
│   └── NavLink.astro
└── pages/
    ├── index.astro
    ├── perfil.astro
    ├── blog/
    │   ├── index.astro
    │   └── [slug].astro
    └── contacto.astro
```

### BaseLayout.astro

```astro
---
import { ViewTransitions } from 'astro:transitions';
import Navbar from '../components/Navbar.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = "Mi sitio Astro" } = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <ViewTransitions />
  </head>
  <body>
    <Navbar />
    
    <main>
      <slot />
    </main>
    
    <footer>
      <p>&copy; 2025 Mi Sitio Astro</p>
    </footer>
  </body>
</html>

<style is:global>
  :root {
    --color-primary: #0ea5e9;
    --color-bg: #ffffff;
    --color-text: #1e293b;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
  }
  
  main {
    min-height: calc(100vh - 140px);
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  footer {
    background: #f1f5f9;
    padding: 2rem;
    text-align: center;
    margin-top: 4rem;
  }
</style>
```

### Navbar.astro

```astro
---
import NavLink from './NavLink.astro';
---

<header>
  <nav>
    <div class="nav-brand">
      <a href="/">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original.svg" alt="Astro" width="32" height="32">
        <span>Mi Sitio Astro</span>
      </a>
    </div>
    
    <ul class="nav-links">
      <li><NavLink href="/">🏠 Inicio</NavLink></li>
      <li><NavLink href="/perfil">👤 Perfil</NavLink></li>
      <li><NavLink href="/blog"> Blog</NavLink></li>
      <li><NavLink href="/contacto">📧 Contacto</NavLink></li>
    </ul>
  </nav>
</header>

<style>
  header {
    background: #1e293b;
    color: white;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-brand a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
  }
  
  .nav-links {
    list-style: none;
    display: flex;
    gap: 0.5rem;
  }
  
  @media (max-width: 768px) {
    nav {
      flex-direction: column;
      gap: 1rem;
    }
    
    .nav-links {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
```

### NavLink.astro

```astro
---
interface Props {
  href: string;
}

const { href } = Astro.props;
const currentPath = Astro.url.pathname;
const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
---

<a 
  href={href} 
  class:list={['nav-link', { active: isActive }]}
>
  <slot />
</a>

<style>
  .nav-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
    font-weight: 500;
  }
  
  .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .nav-link.active {
    color: white;
    background: #0ea5e9;
    font-weight: 600;
  }
</style>
```

### index.astro

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Inicio - Mi Sitio Astro">
  <section class="hero">
    <h1>Bienvenido a Mi Sitio Astro</h1>
    <p>Explora las diferentes secciones usando la navegación superior</p>
    
    <div class="cards">
      <div class="card">
        <h3>👤 Perfil</h3>
        <p>Conoce más sobre mí</p>
        <a href="/perfil" class="btn">Ver perfil</a>
      </div>
      
      <div class="card">
        <h3> Blog</h3>
        <p>Lee mis últimos artículos</p>
        <a href="/blog" class="btn">Ver blog</a>
      </div>
      
      <div class="card">
        <h3>📧 Contacto</h3>
        <p>Ponte en contacto</p>
        <a href="/contacto" class="btn">Contactar</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #0ea5e9, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero p {
    font-size: 1.25rem;
    color: #64748b;
    margin-bottom: 3rem;
  }
  
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }
  
  .card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .card h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .card p {
    color: #64748b;
    margin-bottom: 1.5rem;
  }
  
  .btn {
    display: inline-block;
    background: #0ea5e9;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 0.375rem;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s;
  }
  
  .btn:hover {
    background: #0284c7;
  }
</style>
```

### blog/index.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = [
  { slug: 'introduccion-astro', title: 'Introducción a Astro', date: '2025-01-15' },
  { slug: 'navegacion-astro', title: 'Navegación en Astro', date: '2025-01-20' },
  { slug: 'astro-vs-angular', title: 'Astro vs Angular', date: '2025-01-25' }
];
---

<BaseLayout title="Blog - Mi Sitio Astro">
  <h1>Blog</h1>
  
  <div class="posts-list">
    {posts.map(post => (
      <article class="post-card">
        <h2>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h2>
        <time datetime={post.date}>{post.date}</time>
      </article>
    ))}
  </div>
</BaseLayout>

<style>
  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  
  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .post-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .post-card:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .post-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  .post-card a {
    color: #0ea5e9;
    text-decoration: none;
  }
  
  .post-card a:hover {
    text-decoration: underline;
  }
  
  .post-card time {
    color: #64748b;
    font-size: 0.875rem;
  }
</style>
```

### blog/[slug].astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  return [
    {
      params: { slug: 'introduccion-astro' },
      props: { 
        title: 'Introducción a Astro',
        date: '2025-01-15',
        content: 'Astro es un framework moderno para construir sitios web rápidos...'
      }
    },
    {
      params: { slug: 'navegacion-astro' },
      props: { 
        title: 'Navegación en Astro',
        date: '2025-01-20',
        content: 'La navegación en Astro es diferente a otros frameworks...'
      }
    },
    {
      params: { slug: 'astro-vs-angular' },
      props: { 
        title: 'Astro vs Angular',
        date: '2025-01-25',
        content: 'Comparando dos frameworks con filosofías diferentes...'
      }
    }
  ];
}

const { title, date, content } = Astro.props;
---

<BaseLayout title={title}>
  <article class="post">
    <header>
      <h1>{title}</h1>
      <time datetime={date}>{date}</time>
    </header>
    
    <div class="content">
      <p>{content}</p>
    </div>
    
    <nav class="post-nav">
      <a href="/blog" class="back-link">← Volver al blog</a>
    </nav>
  </article>
</BaseLayout>

<style>
  .post {
    max-width: 800px;
    margin: 0 auto;
  }
  
  header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
  }
  
  header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  header time {
    color: #64748b;
    font-size: 0.875rem;
  }
  
  .content {
    line-height: 1.8;
    font-size: 1.125rem;
    margin-bottom: 3rem;
  }
  
  .post-nav {
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .back-link {
    color: #0ea5e9;
    text-decoration: none;
    font-weight: 500;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
</style>
```

## Resumen de Conceptos Clave

1. **Navegación Tradicional**: Astro usa enlaces HTML estándar `<a href="">`, no client-side routing
2. **Enrutamiento Automático**: La estructura de carpetas en `src/pages/` define las rutas
3. **View Transitions**: API nativa para transiciones suaves entre páginas
4. **Estado Activo**: Se maneja manualmente con `Astro.url.pathname`
5. **Rutas Dinámicas**: Usando `[parametro].astro` con `getStaticPaths()`
6. **Optimización**: Astro genera HTML estático ultra-rápido
7. **Sin JavaScript**: Por defecto, la navegación no requiere JavaScript

## Cuándo Usar Astro vs Angular

| Escenario | Recomendación |
|-----------|---------------|
| Blog o sitio de contenido |  Astro |
| Portfolio personal |  Astro |
| Documentación |  Astro |
| Landing pages |  Astro |
| E-commerce simple |  Astro |
| Dashboard complejo |  Angular |
| Aplicación con estado complejo |  Angular |
| SPA con muchas interacciones |  Angular |

## Recursos Adicionales

- **[Routing - Astro Docs](https://docs.astro.build/en/core-concepts/routing/)**
- **[View Transitions - Astro Docs](https://docs.astro.build/en/guides/view-transitions/)**
- **[Dynamic Routes - Astro Docs](https://docs.astro.build/en/core-concepts/routing/#dynamic-routes)**

---

## Conclusión

La navegación en Astro es más simple que en frameworks SPA tradicionales porque aprovecha la navegación nativa del navegador. Aunque esto significa que hay "recargas" de página, las optimizaciones de Astro (HTML estático, View Transitions, prefetch) hacen que la experiencia sea igual de rápida.

La filosofía de Astro es: **"No uses JavaScript si no lo necesitas"**. Para sitios de contenido, blogs, portfolios y landing pages, esta aproximación resulta en sitios extremadamente rápidos y eficientes.
