# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 02: Fundamentos de Astro

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Los fundamentos de Astro giran en torno a tres ideas centrales: **componentes `.astro`**, **frontmatter de servidor** y **renderizado estático**. Antes de agregar layouts, rutas dinámicas o colecciones de contenido, el estudiante necesita dominar cómo Astro transforma archivos `.astro` en HTML limpio.

Este módulo cubre la unidad mínima de Astro: una página con variables, expresiones y estilos, construida sobre el proyecto `astro-campus` creado en el módulo anterior.

---

## 2. Conceptos Clave

### ¿Qué es Astro exactamente?

Astro es un **compilador de sitios web** que convierte componentes `.astro` (y opcionalmente React, Vue, Svelte) en HTML estático optimizado. La diferencia fundamental con los SPA frameworks:

| Aspecto | React / Vue / Angular | Astro |
|---------|:---:|:---:|
| Cuándo se ejecuta el JS de componentes | Navegador (runtime) | Servidor / Build time |
| JS enviado al navegador | Todo el framework | Solo lo declarado en `<script>` |
| SEO por defecto | Necesita SSR extra | Excelente (HTML puro) |
| Estado global del cliente | SÍ (store, contexto) | No (excepto con islands) |
| Hidratación | Total | Parcial (por isla) |

### Frontmatter: la puerta al servidor

El frontmatter en Astro es la sección entre `---`. Todo lo que escribas ahí se ejecuta en Node.js durante el build (o en el servidor si usas SSR). **Nunca llega al navegador**.

```astro
---
// Aquí puedes:
import Componente from '../components/Componente.astro';
import { obtenerDatos } from '../utils/datos';

const datos = await obtenerDatos();         // fetch, DB, filesystem
const fecha = new Date().toLocaleDateString('es-EC');
const estaActivo = true;
---
```

### Expresiones en el template

El template de Astro es HTML con expresiones JavaScript delimitadas por `{}`:

```astro
---
const nombre = "Estudiante";
const activo = true;
const items = ["HTML", "CSS", "JavaScript"];
---

<p>Hola, {nombre}</p>
<p>Estado: {activo ? "Activo" : "Inactivo"}</p>

<ul>
  {items.map(item => <li>{item}</li>)}
</ul>

{activo && <span class="badge">En línea</span>}
```

---

## 3. Explicación

### Estilos en Astro

Astro tiene tres formas de aplicar estilos:

**1. Estilos scoped (por defecto en `<style>`):**

```astro
<style>
  /* Solo afecta a este componente */
  h1 { color: #FF5D01; }
  p  { line-height: 1.6; }
</style>
```

Astro agrega un atributo hash automáticamente: `h1[data-astro-cid-xxx]` para evitar colisiones.

**2. Estilos globales:**

```astro
<style is:global>
  /* Afecta a todo el documento */
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; }
</style>
```

**3. Hoja de estilos global importada:**

```astro
---
import '../styles/global.css';
---
```

### Variables CSS desde el frontmatter

```astro
---
const colorPrimario = '#FF5D01';
---

<div style={`--color: ${colorPrimario}`}>
  <p>Texto con color de variable</p>
</div>

<style>
  p { color: var(--color); }
</style>
```

### Páginas vs Componentes

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `index.astro` | `src/pages/` | Genera la ruta `/` |
| `about.astro` | `src/pages/` | Genera la ruta `/about` |
| `Card.astro` | `src/components/` | Componente reutilizable, no genera ruta |
| `BaseLayout.astro` | `src/layouts/` | Layout compartido, no genera ruta |

Solo los archivos en `src/pages/` generan rutas. Los demás son componentes privados.

### Importar y usar componentes

```astro
---
// Importar siempre con import en frontmatter
import Card from '../components/Card.astro';
---

<Card titulo="Recurso 1" descripcion="Descripción del recurso" />
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Página con variables y expresiones

```astro
---
// src/pages/index.astro
const titulo = "Astro Campus";
const version = "1.0";
const recursos = [
  { id: 1, nombre: "Astro Docs", url: "https://docs.astro.build" },
  { id: 2, nombre: "MDN Web Docs", url: "https://developer.mozilla.org" },
];
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>{titulo} v{version}</title>
  </head>
  <body>
    <h1>{titulo}</h1>
    <ul>
      {recursos.map(r => (
        <li><a href={r.url}>{r.nombre}</a></li>
      ))}
    </ul>
  </body>
</html>
```

### Ejemplo 2: Componente con props

```astro
---
// src/components/RecursoCard.astro
// Props declaradas con la interfaz Props
interface Props {
  titulo: string;
  url: string;
  descripcion?: string;   // opcional
}

const { titulo, url, descripcion = "Sin descripción" } = Astro.props;
---

<div class="card">
  <h3><a href={url}>{titulo}</a></h3>
  <p>{descripcion}</p>
</div>

<style>
  .card {
    border: 1px solid #333;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  a { color: #FF5D01; text-decoration: none; }
  p { color: #aaa; font-size: 0.9rem; }
</style>
```

Uso del componente:

```astro
---
import RecursoCard from '../components/RecursoCard.astro';
---

<RecursoCard
  titulo="Astro Docs"
  url="https://docs.astro.build"
  descripcion="Documentación oficial de Astro"
/>
```

### Ejemplo 3: Página `about.astro`

```astro
---
// src/pages/about.astro
const equipo = [
  { nombre: "Pablo Torres", rol: "Docente" },
];
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Acerca de — Astro Campus</title>
  </head>
  <body>
    <h1>Acerca del proyecto</h1>
    <p>Astro Campus es un proyecto incremental para aprender Astro.</p>
    <ul>
      {equipo.map(p => (
        <li>{p.nombre} — {p.rol}</li>
      ))}
    </ul>
    <a href="/">← Inicio</a>
  </body>
</html>
```

---

## 5. Buenas Prácticas

- Declarar los props con `interface Props` para obtener tipado en TypeScript.
- Nombrar los componentes con PascalCase: `RecursoCard.astro`, `HeroSection.astro`.
- Nombrar las páginas con kebab-case: `sobre-nosotros.astro`, `contacto.astro`.
- Mantener la lógica compleja fuera del frontmatter en archivos `utils/` o `lib/`.
- Preferir estilos scoped sobre globales; usar globales solo para resets y tokens CSS.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot read property of undefined` | Prop requerida no pasada | Declarar como opcional con `?` o validar |
| Estilos que no aplican | Scoped vs global mal configurado | Verificar si se necesita `is:global` |
| Componente no renderiza | Olvidó importarlo en frontmatter | Agregar `import` correspondiente |
| `{variable}` muestra `[object Object]` | Se pasó un objeto en lugar de una propiedad | Usar `variable.propiedad` |

---

## 7. Relación con el Proyecto Incremental

En este módulo, **Astro Campus** pasa de tener solo una página de inicio a tener:

- Página `index.astro` con listado de módulos disponibles.
- Página `about.astro` con información del proyecto.
- Componente `RecursoCard.astro` reutilizable.

El siguiente módulo (M03) agregará un layout común que envuelva ambas páginas.

---

## 8. Recursos

- [Sintaxis de componentes Astro](https://docs.astro.build/es/basics/astro-components/)
- [Props y tipado](https://docs.astro.build/es/guides/typescript/)
- [Estilos y CSS en Astro](https://docs.astro.build/es/guides/styling/)
- [Páginas en Astro](https://docs.astro.build/es/basics/astro-pages/)
