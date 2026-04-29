# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 01: Instalación y Configuración

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

**Astro** es un framework web moderno orientado al contenido. Su objetivo principal es generar HTML puro en tiempo de compilación y enviar cero JavaScript innecesario al navegador. Esto lo hace extraordinariamente rápido para sitios de contenido: blogs, portales, documentación, marketing y catálogos.

A diferencia de frameworks SPA como React, Vue o Angular, Astro no convierte el navegador en el motor de renderizado. El servidor construye el HTML y el navegador simplemente lo muestra. Cuando el sitio necesita interactividad, Astro permite agregarla en islas específicas sin sacrificar el rendimiento global.

### ¿Por qué aprender Astro?

| Criterio | Angular / React / Vue | Astro |
|----------|:---:|:---:|
| Renderizado principal | Cliente (JS) | Servidor / Build time |
| JavaScript al navegador | Siempre | Solo donde se necesita |
| Velocidad en contenido estático | Media | Alta |
| SEO por defecto | Requiere configuración | Excelente |
| Soporte multi-framework | No | Sí |
| Curva de aprendizaje | Media-Alta | Media |

### Ecosistema Astro

| Herramienta | Propósito |
|-------------|-----------|
| `astro create` | Scaffolding del proyecto |
| `astro dev` | Servidor de desarrollo con HMR |
| `astro build` | Generación del sitio estático o server |
| `astro preview` | Preview del build de producción |
| Integraciones | Tailwind, React, Vue, Svelte, etc. |
| Adapters | Netlify, Vercel, Cloudflare, Node.js |

---

## 2. Conceptos Clave

### Modos de salida de Astro

```
output: 'static'   → HTML puro, deploy en CDN (Netlify, GitHub Pages)
output: 'server'   → SSR, requiere adapter (Node, Vercel, Netlify)
output: 'hybrid'   → Páginas mixtas: la mayoría estáticas, algunas SSR
```

### Estructura de un proyecto Astro

```
mi-proyecto-astro/
├── public/                 # Archivos estáticos (favicon, imágenes no procesadas)
│   └── favicon.svg
├── src/
│   ├── components/         # Componentes reutilizables .astro
│   ├── layouts/            # Layouts compartidos
│   ├── pages/              # Páginas → rutas automáticas
│   │   └── index.astro     # Ruta: /
│   └── styles/             # CSS global
├── astro.config.mjs        # Configuración principal
├── tsconfig.json           # TypeScript
└── package.json
```

### Anatomía de un componente `.astro`

```astro
---
// FRONTMATTER: ejecutado en el servidor / build time
// Aquí va: imports, fetch de datos, lógica de componente
const titulo = "Bienvenido";
const items = ["Astro", "HTML", "CSS"];
---

<!-- TEMPLATE: HTML con expresiones {JSX-like} -->
<h1>{titulo}</h1>
<ul>
  {items.map(item => <li>{item}</li>)}
</ul>

<style>
  /* ESTILOS: scoped automáticamente a este componente */
  h1 { color: #FF5D01; }
</style>
```

Las tres secciones (frontmatter, template, style) son opcionales. El frontmatter se delimita con `---` y **nunca se envía al navegador**.

---

## 3. Explicación

### Ciclo de vida de Astro

```
1. Lectura de src/pages/        → detecta rutas
2. Ejecución de frontmatter     → datos, fetch, lógica
3. Renderizado a HTML           → sin JS del servidor
4. Empaquetado de assets        → CSS, imágenes optimizadas
5. Escritura en dist/           → sitio listo para deploy
6. (Opcional) Islands           → hidratación parcial en cliente
```

### Diferencia entre frontmatter y `<script>`

```astro
---
// Esto se ejecuta en el servidor (build time o SSR)
// No está disponible en el navegador
const datos = await fetch('/api/algo').then(r => r.json());
---

<script>
  // Esto se ejecuta en el navegador
  // Tiene acceso al DOM, a window, localStorage, etc.
  document.querySelector('button').addEventListener('click', () => {
    console.log('Click en cliente');
  });
</script>
```

### Scripts npm en Astro

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `astro dev` | Servidor de desarrollo en `localhost:4321` |
| `build` | `astro build` | Genera el sitio en `dist/` |
| `preview` | `astro preview` | Sirve `dist/` para validar localmente |
| `astro` | `astro` | CLI general (info, check, etc.) |

### Gestores de paquetes soportados

```bash
pnpm create astro@latest    # recomendado (más rápido)
npm create astro@latest
yarn create astro
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Página mínima en Astro

```astro
---
// src/pages/index.astro
// Sin imports, sin props: página estática simple
const titulo = "Astro Campus";
const descripcion = "Portal de contenido construido con Astro.";
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>{titulo}</title>
  </head>
  <body>
    <h1>{titulo}</h1>
    <p>{descripcion}</p>
  </body>
</html>
```

### Ejemplo 2: Configuración básica `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Modo de salida (static | server | hybrid)
  output: 'static',

  // Directorio de origen
  srcDir: './src',

  // Directorio de salida del build
  outDir: './dist',

  // Directorio de archivos públicos
  publicDir: './public',

  // Puerto del servidor de desarrollo
  server: {
    port: 4321
  }
});
```

### Ejemplo 3: Variables de entorno

```
# .env
PUBLIC_SITE_NAME=Astro Campus       # accesible en cliente y servidor
SECRET_API_KEY=abc123               # solo en servidor / frontmatter
```

```astro
---
// Solo en frontmatter (servidor):
const apiKey = import.meta.env.SECRET_API_KEY;

// En templates o scripts cliente solo se pueden usar PUBLIC_*:
const siteName = import.meta.env.PUBLIC_SITE_NAME;
---
```

---

## 5. Comparaciones / Tablas

### Plantillas disponibles con `create astro`

| Plantilla | Descripción | Ideal para |
|-----------|-------------|------------|
| `basics` | Proyecto básico con ejemplos | Aprender Astro |
| `minimal` | Proyecto vacío, sin ejemplos | Proyectos desde cero |
| `blog` | Blog con colecciones y paginación | Blogs y portales |
| `portfolio` | Portafolio con proyectos | CVs y trabajos personales |
| `docs` (Starlight) | Documentación técnica | Documentación de proyectos |

### Extensiones recomendadas VS Code

| Extensión | Propósito |
|-----------|-----------|
| Astro (oficial) | Sintaxis, IntelliSense, snippets |
| Prettier | Formato automático |
| ESLint | Linting |
| Tailwind CSS IntelliSense | Autocompletado Tailwind |
| DotENV | Soporte `.env` |

---

## 6. Buenas Prácticas

- Usar `pnpm` como gestor de paquetes (más rápido y eficiente en espacio).
- Iniciar con la plantilla `minimal` para proyectos de aprendizaje controlado.
- Definir `output: 'static'` en `astro.config.mjs` hasta que el proyecto realmente requiera SSR.
- No mezclar lógica de servidor (frontmatter) con lógica de cliente (`<script>`).
- Nunca exponer claves privadas en variables `PUBLIC_*`.
- Mantener `src/pages/` solo para páginas; los componentes van en `src/components/`.

---

## 7. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Puerto 4321 ocupado | Otro proceso usa el puerto | `pnpm dev --port 4322` |
| Variables privadas undefined en cliente | `SECRET_*` no están disponibles en `<script>` | Solo usar `PUBLIC_*` en cliente |
| Archivos en `public/` referenciados con ruta relativa | La ruta raíz de `public/` es `/` | Usar `/imagen.png` no `./imagen.png` |
| `import` falla en frontmatter | Typo o ruta incorrecta | Verificar ruta relativa o alias |
| HMR no recarga | Cache del navegador | Ctrl+Shift+R para recarga forzada |

---

## 8. Relación con el Proyecto Incremental

Este módulo sienta la base de **Astro Campus**, el proyecto que construiremos progresivamente a lo largo de todos los módulos. Al finalizar este módulo, tendrás:

- Proyecto Astro creado con la plantilla `minimal`.
- Servidor de desarrollo corriendo en `localhost:4321`.
- Estructura de carpetas lista para recibir páginas, layouts y componentes.
- `astro.config.mjs` con configuración base.

Cada módulo posterior añadirá capas sobre este mismo proyecto.

---

## 9. Recursos

- [Documentación oficial de Astro](https://docs.astro.build)
- [Guía de instalación](https://docs.astro.build/es/install-and-setup/)
- [astro.config.mjs Reference](https://docs.astro.build/es/reference/configuration-reference/)
- [Variables de entorno](https://docs.astro.build/es/guides/environment-variables/)
