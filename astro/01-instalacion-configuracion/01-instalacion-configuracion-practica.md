# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 01: Instalación y Configuración

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Crear el proyecto Astro base que se usará como punto de partida incremental en todos los módulos siguientes. Al terminar esta práctica, el estudiante tendrá un entorno funcional con Astro corriendo en modo desarrollo.

---

## Contexto de la Práctica

Este módulo inicia **Astro Campus**, un portal de contenido que construiremos progresivamente. Cada módulo agrega funcionalidad sobre el mismo proyecto sin romper lo anterior. Este primer módulo establece la estructura inicial, la configuración base y verifica que el entorno de desarrollo funciona correctamente.

---

## Archivos que se crean en esta práctica

```
astro-campus/
├── public/
│   └── favicon.svg
├── src/
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

Todos los archivos base están disponibles en la carpeta `files/` para referencia.

---

## Requisitos previos

- Node.js 18 o superior instalado (`node --version`)
- pnpm instalado (`pnpm --version`). Si no está: `npm install -g pnpm`
- VS Code con la extensión oficial de Astro instalada

---

## Paso 1: Verificar el entorno

**¿Qué hace este paso?** Confirma que las herramientas necesarias están disponibles antes de crear el proyecto.

Ejecutar en la terminal:

```bash
node --version   # debe ser >= 18
pnpm --version   # cualquier versión reciente
```

Si `pnpm` no está instalado:

```bash
npm install -g pnpm
```

---

## Paso 2: Crear el proyecto Astro

**¿Qué hace este paso?** El CLI de Astro genera la estructura base del proyecto con todas las dependencias necesarias.

Ejecutar el siguiente comando y responder las preguntas del asistente:

```bash
pnpm create astro@latest
```

Responder de esta manera:

| Pregunta | Respuesta |
|----------|-----------|
| Where should we create your new project? | `./astro-campus` |
| How would you like to start your new project? | Use minimal (empty) template |
| Install dependencies? | Yes |
| Initialize a new git repository? | Yes (opcional) |
| TypeScript? | Yes - strict |

> Captura pendiente: proceso de creación con el asistente interactivo.

---

## Paso 3: Entrar al proyecto y verificar

**¿Qué hace este paso?** Navega al directorio del proyecto y verifica que la instalación fue exitosa.

```bash
cd astro-campus
pnpm astro info
```

Deberías ver algo similar a:

```
Astro               v5.x.x
Node                v22.x.x
System              macOS / Windows / Linux
Package Manager     pnpm
Output              static
Adapter             None
Integrations        None
```

> Captura pendiente: salida de `pnpm astro info` en la terminal.

---

## Paso 4: Revisar la estructura inicial

**¿Qué hace este paso?** Explora los archivos creados para entender el punto de partida.

La plantilla `minimal` crea exactamente:

```
astro-campus/
├── public/
│   └── favicon.svg          # Ícono del sitio
├── src/
│   └── pages/
│       └── index.astro      # Página de inicio → ruta /
├── astro.config.mjs         # Configuración de Astro
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración TypeScript
└── pnpm-lock.yaml           # Lockfile de dependencias
```

---

## Paso 5: Revisar y actualizar `astro.config.mjs`

**¿Qué hace este paso?** Define la configuración base del proyecto. Copiar el contenido desde `files/astro.config.mjs`.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // El sitio se genera como HTML estático por defecto
  output: 'static',

  // Información del sitio (usada en SEO más adelante)
  site: 'https://astro-campus.example.com',
});
```

---

## Paso 6: Actualizar la página de inicio

**¿Qué hace este paso?** Reemplaza la página vacía generada por la plantilla con una página de inicio básica para el proyecto incremental.

Copiar desde `files/index.astro` o escribir el siguiente contenido en `src/pages/index.astro`:

```astro
---
// src/pages/index.astro
// Frontmatter: código de servidor (no llega al navegador)
const titulo = "Astro Campus";
const descripcion = "Portal de contenido construido con Astro, módulo a módulo.";
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
      <p>Módulo 01 — Instalación y Configuración completado.</p>
    </main>
  </body>
</html>
```

---

## Paso 7: Levantar el servidor de desarrollo

**¿Qué hace este paso?** Inicia el servidor local para ver el resultado en el navegador. Hot Module Replacement recarga automáticamente cuando se guarda un archivo.

```bash
pnpm dev
```

Abrir en el navegador: `http://localhost:4321`

> Captura pendiente: página de inicio de Astro Campus corriendo en `localhost:4321`.

---

## Paso 8: Ejecutar el build de producción

**¿Qué hace este paso?** Genera el sitio estático final en la carpeta `dist/` y lo previsualiza localmente.

```bash
pnpm build
pnpm preview
```

La salida del build muestra cuántas páginas se generaron y el tamaño de cada archivo.

> Captura pendiente: salida de `pnpm build` con estadísticas de páginas generadas.

---

## Validaciones esperadas

Al finalizar esta práctica debes poder confirmar:

- [ ] `node --version` retorna 18 o superior
- [ ] `pnpm --version` retorna cualquier versión válida
- [ ] La carpeta `astro-campus/` fue creada con la estructura correcta
- [ ] `pnpm astro info` muestra versión de Astro y output: static
- [ ] `pnpm dev` inicia sin errores
- [ ] `http://localhost:4321` muestra la página de inicio con el título "Astro Campus"
- [ ] `pnpm build` termina sin errores y genera `dist/`
- [ ] `pnpm preview` sirve el build correctamente

---

## Entregables

- Repositorio GitHub con el proyecto `astro-campus` en su estado inicial
- Archivo `README.md` en el repositorio indicando el propósito del proyecto
- Capturas de pantalla en `assets/`:
  1. `01-instalacion.png` — proceso de creación del proyecto
  2. `01-astro-info.png` — salida de `pnpm astro info`
  3. `01-localhost.png` — sitio corriendo en `localhost:4321`
  4. `01-build.png` — salida del build de producción

---

## Commits sugeridos

```
feat: create astro-campus project with minimal template
config: add base astro.config.mjs with static output
feat: update index.astro with initial home page
docs: add README with project purpose
```
