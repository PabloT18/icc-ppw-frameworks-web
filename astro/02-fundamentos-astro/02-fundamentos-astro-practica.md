# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 02: Fundamentos de Astro

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Dominar la estructura básica de los archivos `.astro`: frontmatter, template, estilos y props. Al finalizar, el proyecto `astro-campus` contará con dos páginas funcionales y un componente reutilizable.

---

## Contexto de la Práctica

Continuamos sobre `astro-campus`. En este módulo ampliamos el proyecto con:
1. Una página `about.astro`.
2. Un componente `RecursoCard.astro` con props tipados.
3. Integración del componente en la página de inicio.

---

## Archivos que se modifican / crean

```
astro-campus/
└── src/
    ├── components/
    │   └── RecursoCard.astro    ← NUEVO
    └── pages/
        ├── index.astro          ← MODIFICADO
        └── about.astro          ← NUEVO
```

Los archivos finales están en `files/` para referencia.

---

## Paso 1: Crear el componente `RecursoCard.astro`

**¿Qué hace este paso?** Crea el primer componente reutilizable del proyecto. Un "card" que muestra un recurso con título, URL y descripción opcional.

Crear la carpeta `src/components/` y el archivo `RecursoCard.astro`:

```astro
---
interface Props {
  titulo: string;
  url: string;
  descripcion?: string;
}

const { titulo, url, descripcion = "Sin descripción" } = Astro.props;
---

<div class="card">
  <h3><a href={url} target="_blank" rel="noopener">{titulo}</a></h3>
  <p>{descripcion}</p>
</div>

<style>
  .card {
    border: 1px solid #333;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #1a1a1a;
  }
  a {
    color: #FF5D01;
    text-decoration: none;
  }
  a:hover { text-decoration: underline; }
  p { color: #aaa; font-size: 0.9rem; margin: 0.5rem 0 0; }
</style>
```

Verificar que no hay errores: `pnpm astro check`.

---

## Paso 2: Actualizar `index.astro` con el componente

**¿Qué hace este paso?** Importa `RecursoCard` y lo usa para mostrar una lista de recursos. Practica el flujo import → uso con props.

Actualizar `src/pages/index.astro`:

```astro
---
import RecursoCard from '../components/RecursoCard.astro';

const titulo = "Astro Campus";
const descripcion = "Portal de contenido construido con Astro, módulo a módulo.";

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
  {
    titulo: "Can I use",
    url: "https://caniuse.com/",
    descripcion: "Compatibilidad de APIs web en navegadores.",
  },
];
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{titulo}</title>
  </head>
  <body>
    <main>
      <h1>{titulo}</h1>
      <p>{descripcion}</p>

      <section>
        <h2>Recursos</h2>
        {recursos.map(r => (
          <RecursoCard titulo={r.titulo} url={r.url} descripcion={r.descripcion} />
        ))}
      </section>

      <nav>
        <a href="/about">Acerca del proyecto →</a>
      </nav>
    </main>
  </body>
</html>

<style is:global>
  body {
    font-family: system-ui, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: #0f0f0f;
    color: #e8e8e8;
  }
  h1 { color: #FF5D01; }
  a { color: #FF5D01; }
</style>
```

---

## Paso 3: Crear `about.astro`

**¿Qué hace este paso?** Agrega una segunda página al proyecto. Valida que Astro genera la ruta `/about` automáticamente solo por la existencia del archivo.

Crear `src/pages/about.astro`:

```astro
---
const titulo = "Acerca de Astro Campus";
const descripcion = "Proyecto incremental para aprender Astro en el contexto del curso PPW.";
const equipo = [
  { nombre: "Pablo Torres", rol: "Docente", github: "PabloT18" },
];
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{titulo}</title>
  </head>
  <body>
    <main>
      <h1>{titulo}</h1>
      <p>{descripcion}</p>

      <h2>Equipo</h2>
      <ul>
        {equipo.map(p => (
          <li>
            <strong>{p.nombre}</strong> — {p.rol}
            {" · "}
            <a href={`https://github.com/${p.github}`} target="_blank" rel="noopener">
              GitHub
            </a>
          </li>
        ))}
      </ul>

      <nav>
        <a href="/">← Inicio</a>
      </nav>
    </main>
  </body>
</html>

<style is:global>
  body {
    font-family: system-ui, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: #0f0f0f;
    color: #e8e8e8;
  }
  h1 { color: #FF5D01; }
  a { color: #FF5D01; }
  li { margin-bottom: 0.5rem; }
</style>
```

---

## Paso 4: Completar el fragmento con renderizado condicional

**¿Qué hace este paso?** Practica la renderización condicional en Astro usando expresiones `&&` y el operador ternario.

En `about.astro`, agrega debajo de la lista del equipo:

```astro
---
// Añadir esta variable al frontmatter existente:
const modoProduccion = import.meta.env.PROD;
---
```

Y en el template, debajo de `<nav>`:

```astro
{modoProduccion && (
  <p style="color: #22c55e; font-size: 0.8rem;">
    Versión de producción activa.
  </p>
)}
{!modoProduccion && (
  <p style="color: #f59e0b; font-size: 0.8rem;">
    Modo desarrollo — usa <code>pnpm build</code> para producción.
  </p>
)}
```

---

## Paso 5: TODO — Completar por el estudiante

El siguiente fragmento está incompleto. El estudiante debe rellenarlo según las instrucciones:

```astro
---
// TODO: Importar RecursoCard desde la ruta correcta
// import ___ from '___';

// TODO: Definir un arreglo llamado "herramientas" con al menos 3 objetos
// Cada objeto debe tener: titulo (string), url (string), descripcion (string)
const herramientas = [
  // TODO: completar aquí
];

const mostrarHerramientas = herramientas.length > 0;
---

<section>
  <h2>Herramientas</h2>

  {/* TODO: Renderizar condicionalmente solo si mostrarHerramientas es true */}
  {___ && (
    <div>
      {/* TODO: Usar .map() para renderizar un RecursoCard por cada herramienta */}
      {herramientas.map(___ => (
        <RecursoCard titulo={___} url={___} descripcion={___} />
      ))}
    </div>
  )}

  {/* TODO: Mostrar un mensaje alternativo si no hay herramientas */}
  {!mostrarHerramientas && <p>No hay herramientas disponibles.</p>}
</section>
```

---

## Validaciones esperadas

- [ ] `src/components/RecursoCard.astro` existe con props tipados
- [ ] `http://localhost:4321` muestra la lista de recursos usando `RecursoCard`
- [ ] `http://localhost:4321/about` carga correctamente (sin 404)
- [ ] `pnpm astro check` no reporta errores de TypeScript
- [ ] Los estilos del card aplican solo al componente (no a toda la página)
- [ ] El mensaje de modo desarrollo/producción se muestra correctamente

---

## Entregables

- `src/components/RecursoCard.astro` con props tipados
- `src/pages/index.astro` actualizado con lista de recursos
- `src/pages/about.astro` con información del proyecto y equipo
- Captura de `http://localhost:4321` con los cards renderizados
- Captura de `http://localhost:4321/about`

---

## Commits sugeridos

```
feat: add RecursoCard component with typed props
feat: update index.astro with resource list using RecursoCard
feat: add about.astro page with team info
feat: add conditional rendering for environment mode
```
