# Estructura de Archivos HTML - ICC PPW Frameworks Web

## Descripción

Este directorio contiene las páginas HTML del sitio web institucional para el curso de Programación y Plataformas Web de la Universidad Politécnica Salesiana.

## Archivos Principales

### Páginas HTML

- **index.html** - Página principal con enlaces a todos los frameworks
- **javascript.html** - Material y prácticas de JavaScript
- **angular.html** - Material y prácticas de Angular
- **react.html** - Proyectos de estudiantes en React
- **vue.html** - Proyectos de estudiantes en Vue
- **astro.html** - Material y prácticas de Astro
- **renderizado.html** - Comparativa de tipos de renderizado web

### Estilos

- **styles/institutional.css** - Hoja de estilos institucional compartida por todas las páginas
  - Colores institucionales (azul #003772, amarillo #FCC000)
  - Componentes reutilizables (cards, badges, secciones, etc.)
  - Tipografía y espaciado consistente

### Scripts

- **scripts/content-data.js** - Datos centralizados para facilitar actualizaciones
  - Estructura de módulos por framework
  - Enlaces y recursos
  - Funciones auxiliares para generación dinámica de contenido

## Diseño y Lineamientos

### Paleta de Colores Institucional

```css
--color-primary: #003772;      /* Azul institucional */
--color-primary-soft: #07508E; /* Azul suave */
--color-accent: #FCC000;       /* Amarillo UPS */
--color-bg: #F7F9FC;           /* Fondo general */
--color-surface: #FFFFFF;      /* Superficie de cards */
--color-border: #E3E8EF;       /* Bordes */
```

### Estructura de una Página

Cada página de framework sigue esta estructura:

1. **Header Hero** - Con logo del framework y título
2. **Sección de Material** - Grid de cards con contenido teórico/práctico
3. **Sección de Características** - Resaltando características del framework
4. **Sección de Recursos** - Enlaces externos útiles
5. **Footer** - Información institucional

### Componentes Reutilizables

- `.hero` - Encabezado principal con gradiente institucional
- `.section` - Contenedor de sección con fondo blanco
- `.card-grid` - Grid responsive para cards
- `.card` - Tarjeta de contenido
- `.content-item` - Card con borde de color del framework
- `.badge` - Etiqueta de tipo (teoría/práctica)
- `.callout` - Bloque destacado con borde amarillo

## Colores por Framework

Cada framework mantiene su identidad visual mediante:

- **JavaScript**: #F7DF1E (amarillo)
- **Angular**: #DD0031 (rojo)
- **React**: #61DAFB (azul claro)
- **Vue**: #42B883 (verde)
- **Astro**: #FF5D01 (naranja)

Los colores se aplican en:
- Borde izquierdo de `.content-item`
- Fondo de `.content-link`
- Sombra del logo en `.hero img`

## Cómo Actualizar Contenido

### Método 1: Editar HTML Directamente

Edita el archivo HTML correspondiente, manteniendo la estructura de cards existente.

### Método 2: Usar Datos Centralizados (Futuro)

El archivo `scripts/content-data.js` contiene la estructura de datos que puede usarse para generar contenido dinámicamente. Para implementar:

1. Agrega el script a la página HTML
2. Usa las funciones `generateModulesHTML()` y `generateResourcesHTML()`
3. Actualiza solo el archivo JS cuando cambies contenido

## Lineamientos de Estilo

### Texto

- Sin emojis (enfoque formal/académico)
- Títulos claros y descriptivos
- Descripciones concisas

### Imágenes

- Logos de frameworks desde CDN devicons
- Tamaño estándar: 100px x 100px en hero
- Aplicar `filter: drop-shadow()` con color del framework

### Enlaces

- Usar clase `.content-link` para botones de acción
- Color primario del framework
- Transición suave en hover

## Mantenimiento

Para agregar nuevo contenido:

1. Identifica la sección correspondiente
2. Duplica un `.card` existente
3. Actualiza el contenido (título, descripción, enlaces)
4. Verifica que los enlaces sean correctos
5. Mantén la consistencia de badges (teoría/práctica)

## Notas

- Todos los archivos usan `<link rel="stylesheet" href="styles/institutional.css">`
- Los estilos específicos del framework van en un `<style>` interno
- El layout principal es institucional, el contenido usa colores del framework
- Responsive por defecto con grid de cards
