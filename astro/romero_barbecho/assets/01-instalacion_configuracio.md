
## Proyecto Astro 

Astro es un framework que usa ruteo automático basado en archivos. A continuación, los pasos básicos y ejemplos para documentar en tu proyecto.

### 1. Abrir VS Code

Abre la carpeta del proyecto en VS Code (ej. astro/romero_barbecho).

![imagen](astro\romero_barbecho\imagenes\primera.png)

### 2. Abrir la terminal integrada

Abre la terminal integrada en VS Code para ejecutar comandos.

![imagen](astro\romero_barbecho\imagenes\segunda.png)

### 3. Crear el proyecto Astro

Comandos típicos para crear un proyecto Astro (ejemplo genérico):

npm create astro@latest

Tras crear el proyecto instala dependencias y ejecuta el servidor de desarrollo:

![imagen](astro\romero_barbecho\imagenes\tercera.png)

### 4. Sistema de rutas (File-Based Routing)

Cada archivo `.astro` dentro de `src/pages` genera una ruta automáticamente. Ejemplos:

- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/productos/index.astro` → `/productos`
- `src/pages/productos/[id].astro` → `/productos/123` (ruta dinámica)

![imagen](astro\romero_barbecho\imagenes\cuarta.png)

## Control de versiones 

Asegúrate de trabajar en una rama y subir tus cambios:

git branch

git add .
git commit -m "creación de rutas y páginas en Astro"

git push -u origin astro-romero_barbecho

![imagen](astro\romero_barbecho\imagenes\quinta.png)


