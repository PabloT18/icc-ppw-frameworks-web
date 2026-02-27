# Programación y Plataformas Web 

# Frameworks Web: Astro
<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">

</div>

## Práctica 2: Fundamentos 

### Autores

**Pablo Torres**  
📧 ptorresp@ups.edu.ec  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## Fundamentos de Astro

## ¿Qué es Astro?

Astro es un framework web moderno diseñado para construir sitios web rápidos y centrados en el contenido. A diferencia de los frameworks tradicionales que cargan JavaScript en el cliente, Astro renderiza tu sitio web a HTML puro en tiempo de compilación y envía cero JavaScript por defecto al navegador, cargando JavaScript solo cuando es necesario (hidratación parcial).

Astro es especialmente adecuado para blogs, sitios de documentación, portfolios, landing pages y sitios de marketing, aunque también puede manejar aplicaciones web más complejas.

## Características principales de Astro

1. **Islands Architecture (Arquitectura de Islas)**: Astro introduce el concepto de "islas" de interactividad. Puedes construir tu sitio principalmente con HTML estático y agregar componentes interactivos (islas) solo donde los necesites.

2. **Framework Agnostic**: Astro te permite usar componentes de React, Vue, Svelte, Solid, Preact, Lit y más, todos en el mismo proyecto. Puedes elegir el mejor framework para cada componente.

3. **Zero JavaScript por Defecto**: Astro renderiza tu sitio a HTML estático sin JavaScript innecesario. Solo envía JavaScript cuando un componente lo necesita explícitamente.

4. **Content Collections**: Sistema integrado para gestionar contenido Markdown y MDX con validación de esquema TypeScript y generación automática de tipos.

5. **File-Based Routing**: El enrutamiento está basado en el sistema de archivos. Cada archivo `.astro`, `.md` o `.mdx` en `src/pages/` se convierte automáticamente en una ruta.

6. **Optimización Automática**: Astro optimiza automáticamente imágenes, CSS y JavaScript, generando sitios extremadamente rápidos sin configuración adicional.

## Componentes de Astro

Los componentes Astro son archivos con extensión `.astro` y tienen una estructura única dividida en dos partes:

1. **Component Script (Frontmatter)**: Código JavaScript/TypeScript entre `---` que se ejecuta en tiempo de compilación en el servidor.

2. **Component Template**: HTML con sintaxis similar a JSX que define la estructura del componente.

Ejemplo de estructura:

```astro
---
// Component Script (se ejecuta en el servidor)
const nombre = "Astro";
const items = ["Item 1", "Item 2", "Item 3"];
---

<!-- Component Template -->
<div>
  <h1>Hola {nombre}</h1>
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
</div>

<style>
  /* Estilos con scope automático */
  h1 {
    color: blue;
  }
</style>
```

## Páginas y Enrutamiento

En Astro, las páginas se crean automáticamente según la estructura de archivos en `src/pages/`:

- `src/pages/index.astro` → `http://localhost:4321/`
- `src/pages/about.astro` → `http://localhost:4321/about`
- `src/pages/blog/post-1.md` → `http://localhost:4321/blog/post-1`

### Rutas Dinámicas

Puedes crear rutas dinámicas usando corchetes:

- `src/pages/blog/[slug].astro` → Ruta dinámica para posts
- `src/pages/[...path].astro` → Catch-all route

## Layouts

Los layouts son componentes Astro que envuelven páginas con estructura común (header, footer, etc.):

```astro
---
// src/layouts/BaseLayout.astro
const { title } = Astro.props;
---

<!DOCTYPE html>
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <header>
      <nav>...</nav>
    </header>
    <main>
      <slot /> <!-- Contenido de la página -->
    </main>
    <footer>...</footer>
  </body>
</html>
```

## Directivas de Cliente

Astro usa directivas `client:*` para controlar cuándo y cómo se hidrata JavaScript:

- `client:load` → Hidrata inmediatamente al cargar la página
- `client:idle` → Hidrata cuando el navegador está inactivo
- `client:visible` → Hidrata cuando el componente es visible
- `client:media` → Hidrata según media query
- `client:only` → Solo renderiza en el cliente (no SSR)

```astro
---
import Counter from '../components/Counter.jsx';
---

<Counter client:load />
```

## Colecciones de Contenido

Las Content Collections permiten organizar y validar contenido Markdown/MDX:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

## Integraciones

Astro soporta integraciones oficiales y de la comunidad:

```bash
# Agregar Tailwind CSS
pnpm astro add tailwind

# Agregar React
pnpm astro add react

# Agregar sitemap
pnpm astro add sitemap
```

## Comparación: Astro vs Angular

| Característica | Astro | Angular |
|----------------|-------|---------|
| **Tipo** | Framework de contenido estático | Framework SPA completo |
| **Renderizado** | SSG por defecto, SSR opcional | CSR, SSR con Angular Universal |
| **JavaScript** | Zero JS por defecto | JavaScript siempre presente |
| **Componentes** | Multi-framework | Solo Angular |
| **Enrutamiento** | Basado en archivos | Configuración explícita |
| **Mejor para** | Sitios de contenido, blogs | Aplicaciones web complejas |
| **Curva de aprendizaje** | Baja | Media-Alta |
| **Bundle size** | Muy pequeño | Más grande |

---

## Pasos Prácticos: Creando un Proyecto Astro

### 1. Crear un Nuevo Proyecto Astro

Para crear un nuevo proyecto Astro, sigue las instrucciones oficiales usando el siguiente comando en tu terminal:

```bash
pnpm create astro@latest
```

Durante la instalación, se te pedirá:

1. **Nombre del proyecto**: Si ya estás en una carpeta vacía, elige ".", si no, proporciona un nombre de carpeta.

2. **Plantilla**: Selecciona "Empty" o "Minimal" para tener un punto de partida simple.

3. **Instalación de dependencias**: Di "Sí" para instalar automáticamente (te ahorras hacer `pnpm install`).

### 2. Ejecutar el Proyecto

Una vez creado el proyecto, ejecuta:

```bash
pnpm dev
```

Si todo va bien, deberías ver una instancia del navegador en `http://localhost:4321` mostrando una página que dice "Astro".

### 3. Estructura del Proyecto

Analicemos la estructura del proyecto generado:

```
02-fundamentos-astro/
├── public/              # Recursos estáticos (copiados directamente a dist/)
│   └── favicon.svg
├── src/
│   └── pages/           # Páginas de la aplicación (enrutamiento automático)
│       └── index.astro  # Página principal (ruta /)
├── astro.config.mjs     # Configuración principal de Astro
├── tsconfig.json        # Configuración de TypeScript
├── package.json         # Dependencias y scripts
├── pnpm-lock.yaml       # Lockfile de pnpm
└── README.md
```

**Carpetas y archivos clave:**

- **`public/`**: Archivos estáticos que se copian tal cual al build (imágenes, favicon, robots.txt)
- **`src/pages/`**: Cada archivo aquí se convierte en una ruta automáticamente
- **`src/components/`**: Componentes reutilizables (se crea manualmente)
- **`src/layouts/`**: Layouts para envolver páginas (se crea manualmente)
- **`astro.config.mjs`**: Configuración de integraciones, adaptadores y opciones de build

### 4. Compilar el Proyecto

Para generar el build de producción:

```bash
pnpm build
```

Los archivos finales se generarán en la carpeta `dist/`, con un HTML estático por cada página.

**Importante**: Astro genera sitios estáticos por defecto (SSG), no es una SPA tradicional.

### 5. Configurar Prettier

Antes de continuar, configuremos Prettier para formateo automático de código.

#### Paso 5.1: Verificar la extensión de VSCode

Asegúrate de tener instalada la extensión **Prettier - Code formatter** en VSCode:

1. Abre VSCode
2. Ve a Extensiones (Ctrl/Cmd + Shift + X)
3. Busca "Prettier - Code formatter"
4. Instálala si no la tienes

#### Paso 5.2: Instalar Prettier como dependencia

```bash
pnpm install --save-dev prettier
```

#### Paso 5.3: Instalar el plugin de Prettier para Astro

```bash
pnpm install --save-dev prettier-plugin-astro
```

#### Paso 5.4: Crear archivo de configuración

Crea un archivo `.prettierrc` en la raíz del proyecto con el siguiente contenido:

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

#### Paso 5.5: Configurar VSCode

Crea o actualiza `.vscode/settings.json` en la raíz del proyecto:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**⚠️ Importante**: Debes abrir la carpeta del proyecto Astro en una nueva ventana de VSCode para que el complemento de Prettier funcione correctamente.

#### Paso 5.6: Probar Prettier

Abre el archivo `src/pages/index.astro`, modifica y desformatea el código un poco y guarda el archivo. Deberías ver que se aplica el formateo automático.




---

## Entendiendo los Componentes de Astro: Código de Servidor vs Código de Cliente

Antes de continuar con la crreación de componentes y paginas, es fundamental entender cómo Astro maneja el código que se ejecuta en el servidor y el código que se ejecuta en el navegador.

Los componentes de Astro se parecen un poco a los de Vue: HTML, lógica y estilos, todo en el mismo archivo. Pero hay una diferencia crucial: **por defecto, todo el código se ejecuta en el servidor**.

### Fences: Código que se Ejecuta en el Servidor

Los **fences** (o "vallas") son bloques de código entre `---` al inicio de un archivo `.astro`. Este código **solo se ejecuta en el servidor**, nunca en el navegador del usuario.

Agraga en `src/pages/index.astro` :

```astro
---
const title = "¡Hola Mundo desde Astro desde el servidor!";
---

<html lang="es">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>{title}</h1>
  </body>
</html>
```

El **binding** funciona exactamente igual que en React o JSX: usamos llaves `{}` para mostrar el valor de una variable.

Ejecutar el servidor de desarrollo:

```bash
pnpm dev
```

El nuevo título en el navegador. Lo interesante: **este código se ejecutó en el servidor**, no en el navegador.

### Fetching de Datos en el Servidor

Para demostrarlo más claramente, obtenemos datos de una API pública que devuelve imágenes aleatorias de perros.

Actualiza `src/pages/index.astro`:

```astro
---
const title = "¡Hola Mundo desde Astro desde el servidor!";
const imageError = "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";

// Este fetch se ejecuta EN EL SERVIDOR
const res = await fetch("https://dog.ceo/api/breeds/image/random");
const response = await res.json();
const dogImageUrl = response?.message ?? imageError;
---

<html lang="es">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>{title}</h1>
    <img src={dogImageUrl} alt="Random Dog" style="max-width: 400px; height: auto;"/>
  </body>
</html>
```

Se guarda el arcvhivo y se vera una imagen aleatoria de un perro en el navegador.

**¿Qué está pasando aquí?**

1. El `fetch` se ejecuta **en el servidor** durante el build (SSG) o en cada petición (SSR)
2. La URL de la imagen se inyecta directamente en el HTML
3. El navegador recibe HTML puro con la imagen ya resuelta
4. **No hay JavaScript ejecutándose en el navegador** para esta funcionalidad

Para comprobarlo, genera el build de producción:

```bash
pnpm build
```

En `dist/index.html` y en  la URL de la imagen del perro ya está incluida directamente en el HTML. El código del fence ya no existe — se ejecutó una única vez durante el build.

### Código en el Cliente: Scripts de Navegador

Hasta ahora, todo el código se ha ejecutado en el servidor. Pero por supuesto, también podemos ejecutar código en el navegador cuando lo necesitemos. Incluso podemos usar React, Vue o Svelte.

Un ejemplo simple con JavaScript vanilla: añadiremos un botón que obtenga y muestre una imagen aleatoria de gatos **en el cliente**.

Actualizar `src/pages/index.astro`:

```astro
---
const title = "¡Hola Mundo desde Astro!";
const imageError = "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";

// Este fetch se ejecuta EN EL SERVIDOR
const res = await fetch("https://dog.ceo/api/breeds/image/random");
const response = await res.json();
const dogImageUrl = response?.message ?? imageError;
---

<html lang="es">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>{title}</h1>
    
    <h2>Imagen de Perro (cargada en el servidor)</h2>
    <img src={dogImageUrl} alt="Random Dog" style="max-width: 400px; height: auto;"/>
    
    <h2>Imagen de Gato (cargada en el cliente)</h2>
    <div>
      <button id="cat-image-button">Obtener Imagen de Gato</button>
    </div>
    <div>
      <img id="cat-image" style="max-width: 400px; height: auto;"/>
    </div>
  </body>
</html>

<script>
  // Este código SÍ se ejecuta en el navegador
  const button = document.getElementById("cat-image-button");
  const imageEl = document.getElementById("cat-image") as HTMLImageElement;

  if (button && imageEl) {
    button.addEventListener("click", async () => {
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await res.json();
      imageEl.src = data[0].url;
    });
  }
</script>
```

Se muestran dos secciones:
- **Imagen de perro**: Ya está cargada, porque se obtuvo en el servidor
- **Imagen de gato**: Aparece solo cuando haces click en el botón, porque se ejecuta en el cliente

### Diferencias Clave: Servidor vs Cliente

| Aspecto | Código en Fence `---` | Código en `<script>` |
|---------|----------------------|----------------------|
| **Dónde se ejecuta** | Servidor | Navegador (cliente) |
| **Cuándo se ejecuta (SSG)** | Una vez durante el build | Cada vez que el usuario interactúa |
| **Cuándo se ejecuta (SSR)** | En cada petición al servidor | Cada vez que el usuario interactúa |
| **Acceso al DOM** | ❌ No | ✅ Sí |
| **Variables de entorno seguras** | ✅ Sí | ⚠️ Solo las públicas |
| **Aumenta el bundle de JS** | ❌ No | ✅ Sí |

### Depuración de Código

**Para depurar código dentro de un fence:**

1. Colocar un punto de ruptura (breakpoint) dentro del bloque `---`
2. Se abre una terminal en modo **JavaScript Debug Terminal** en VSCode
3. Ejecutar:
   ```bash
   pnpm dev
   ```
4. Cuando se ejecuta el servidor, se detendrá en el punto de ruptura

**Importante**: En modo desarrollo local, cada vez que recargues la página, el código del fence se ejecutará de nuevo. Pero en producción (SSG), se ejecuta una sola vez al construir el sitio.

**Para depurar código del navegador:**

Simplemente se usa las DevTools del navegador (F12).

### Organizando el Código: Extrayendo a Archivos Separados

Para mantener el código limpio, puedes extraer la lógica del navegador a archivos TypeScript separados.

Crea el archivo `src/pages/cat.ts`:

```typescript
async function getCatImage() {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await res.json();
  return data[0].url;
}

export const setupCatImageButton = () => {
  const button = document.getElementById("cat-image-button");
  const imageEl = document.getElementById("cat-image") as HTMLImageElement;

  if (button && imageEl) {
    button.addEventListener("click", async () => {
      const imageUrl = await getCatImage();
      imageEl.src = imageUrl;
    });
  }
};
```

Y actualizar el script en `src/pages/index.astro`:

```astro
<script>
  import { setupCatImageButton } from "./cat";
  setupCatImageButton();
</script>
```

Mucho más limpio y mantenible.

---


### 6. Crear Componentes y Páginas

#### 6.1: Crear la estructura de carpetas

```bash
mkdir -p src/components
mkdir -p src/layouts
```

#### 6.2: Crear un Layout base

Crea `src/layouts/BaseLayout.astro`:

```astro
---
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
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Inicio</a>
        <a href="/perfil">Perfil</a>
        <a href="/about">Acerca de</a>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>&copy; 2025 Mi Sitio Astro</p>
    </footer>
  </body>
</html>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  header {
    background: #1e293b;
    padding: 1rem;
  }
  
  nav {
    display: flex;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background 0.2s;
  }
  
  nav a:hover {
    background: #334155;
  }
  
  main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  footer {
    background: #f1f5f9;
    padding: 2rem;
    text-align: center;
    margin-top: 4rem;
  }
</style>
```

#### 6.3: Actualizar la página principal

Actualiza `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Inicio - Mi Sitio Astro">
  <h1>Bienvenido a Astro</h1>
  <p>
    Este es un proyecto de fundamentos de Astro. 
    Astro es un framework moderno para construir sitios web rápidos.
  </p>
  
  <section>
    <h2>Características principales</h2>
    <ul>
      <li>🏝️ Islands Architecture</li>
      <li>⚡ Zero JavaScript por defecto</li>
      <li>🧩 Multi-framework</li>
      <li>📦 Optimización automática</li>
    </ul>
  </section>
</BaseLayout>

<style>
  h1 {
    color: #2563eb;
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  section {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 8px;
    margin-top: 2rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    padding: 0.5rem 0;
    font-size: 1.1rem;
  }
</style>
```

#### 6.4: Crear la página de Perfil

Crea `src/pages/perfil.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

interface Persona {
  nombre: string;
  apellido: string;
  edad: number;
  profesion: string;
  email: string;
  hobbies: string[];
}

const miPerfil: Persona = {
  nombre: "Pablo",
  apellido: "Torres",
  edad: 30,
  profesion: "Desarrollador Web",
  email: "pablo.torres@example.com",
  hobbies: ["Programación", "Lectura", "Deportes", "Música"]
};
---

<BaseLayout 
  title="Mi Perfil" 
  description="Página de perfil personal"
>
  <article class="perfil-container">
    <div class="perfil-header">
      <div class="avatar">
        {miPerfil.nombre.charAt(0)}{miPerfil.apellido.charAt(0)}
      </div>
      <div class="perfil-info">
        <h1>{miPerfil.nombre} {miPerfil.apellido}</h1>
        <p class="profesion">{miPerfil.profesion}</p>
      </div>
    </div>

    <section class="perfil-detalles">
      <h2>Información Personal</h2>
      <dl>
        <dt>Edad:</dt>
        <dd>{miPerfil.edad} años</dd>
        
        <dt>Email:</dt>
        <dd>{miPerfil.email}</dd>
        
        <dt>Profesión:</dt>
        <dd>{miPerfil.profesion}</dd>
      </dl>
    </section>

    <section class="perfil-hobbies">
      <h2>Hobbies e Intereses</h2>
      <ul>
        {miPerfil.hobbies.map((hobby) => (
          <li>{hobby}</li>
        ))}
      </ul>
    </section>

    <section class="perfil-bio">
      <h2>Sobre mí</h2>
      <p>
        Soy un desarrollador web apasionado por crear experiencias digitales 
        increíbles. Me encanta aprender nuevas tecnologías y compartir 
        conocimientos con la comunidad.
      </p>
    </section>
  </article>
</BaseLayout>

<style>
  .perfil-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .perfil-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    margin-bottom: 2rem;
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    border: 4px solid rgba(255, 255, 255, 0.3);
  }

  .perfil-info h1 {
    margin: 0;
    font-size: 2rem;
  }

  .profesion {
    margin: 0.5rem 0 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .perfil-detalles,
  .perfil-hobbies,
  .perfil-bio {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }

  h2 {
    color: #2563eb;
    margin-top: 0;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  dl {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
  }

  dt {
    font-weight: 600;
    color: #64748b;
  }

  dd {
    margin: 0;
  }

  .perfil-hobbies ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .perfil-hobbies li {
    background: #f1f5f9;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
    font-weight: 500;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .perfil-hobbies li:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .perfil-bio p {
    line-height: 1.8;
    color: #475569;
  }
</style>
```

#### 6.5: Crear página About

Crea `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

---

<BaseLayout title="Acerca de - Mi Sitio Astro">
  <h1>Acerca de este Proyecto</h1>
  
  <section class="about-content">
    <h2>¿Qué es Astro?</h2>
    <p>
      Astro es un framework web moderno que se enfoca en velocidad y rendimiento.
      A diferencia de otros frameworks, Astro envía cero JavaScript por defecto,
      cargando solo lo necesario cuando es requerido.
    </p>

    <h2>Ventajas de Astro</h2>
    <ul>
      <li><strong>Rendimiento excepcional:</strong> HTML estático por defecto</li>
      <li><strong>Flexibilidad:</strong> Usa React, Vue, Svelte o cualquier framework</li>
      <li><strong>SEO optimizado:</strong> Renderizado del lado del servidor</li>
      <li><strong>Developer Experience:</strong> Hot module replacement y TypeScript</li>
    </ul>

    <h2>Este Proyecto</h2>
    <p>
      Este proyecto demuestra los fundamentos de Astro, incluyendo:
      componentes, layouts, páginas, enrutamiento y estilos.
    </p>
  </section>
</BaseLayout>

<style>
  .about-content {
    line-height: 1.8;
  }

  h1 {
    color: #2563eb;
    font-size: 2.5rem;
  }

  h2 {
    color: #1e293b;
    margin-top: 2rem;
  }

  ul {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 8px;
  }

  li {
    margin: 1rem 0;
  }

  strong {
    color: #2563eb;
  }
</style>
```

## Entiendo el Paso de Parámetros a Componentes en Astro

Antes de crear componentes reutilizables, es fundamental entender cómo funcionan los **props** (propiedades) en Astro. Los props son la forma de pasar datos de un componente padre a un componente hijo.

### ¿Qué son los Props?

Los **props** son parámetros que un componente recibe desde el exterior. Permiten que un componente sea reutilizable con diferentes datos. Por ejemplo, un mismo componente `Card` puede mostrar diferentes títulos y descripciones dependiendo de los props que reciba.

### Definiendo Props en Astro

En Astro, los props se definen usando TypeScript interfaces dentro del **fence** (`---`) del componente:

```astro
---
// Definición de la interfaz Props
interface Props {
  title: string;        // Prop obligatorio de tipo string
  description: string;  // Prop obligatorio de tipo string
  link?: string;        // Prop opcional (el ? indica opcional)
}

// Desestructuración de props desde Astro.props
const { title, description, link } = Astro.props;
---

<div>
  <h3>{title}</h3>
  <p>{description}</p>
  {link && <a href={link}>Ver más</a>}
</div>
```

### Explicación Detallada

#### 1. **Interface Props**

```typescript
interface Props {
  title: string;
  description: string;
  link?: string;
}
```

- **`interface Props`**: Define el "contrato" de lo que el componente espera recibir
- **`title: string`**: Prop **obligatorio** de tipo texto
- **`description: string`**: Prop **obligatorio** de tipo texto
- **`link?: string`**: Prop **opcional** (el `?` indica que puede ser `undefined`)

**¿Por qué usar TypeScript?**
- ✅ Autocomplete en el editor (IntelliSense)
- ✅ Errores en tiempo de desarrollo si faltan props
- ✅ Documentación automática del componente
- ✅ Previene errores al usar el componente

#### 2. **Desestructuración de Astro.props**

```typescript
const { title, description, link } = Astro.props;
```

- **`Astro.props`**: Objeto que contiene todos los props pasados al componente
- **Desestructuración**: Extrae las propiedades individuales del objeto
- **Equivalente a**:
  ```typescript
  const title = Astro.props.title;
  const description = Astro.props.description;
  const link = Astro.props.link;
  ```

#### 3. **Uso de Props en el Template**

```astro
<h3>{title}</h3>
<p>{description}</p>
{link && <a href={link}>Ver más</a>}
```

- **`{title}`**: Renderiza el valor del prop `title`
- **`{description}`**: Renderiza el valor del prop `description`
- **`{link && <a href={link}>Ver más</a>}`**: **Renderizado condicional**
  - Solo muestra el enlace si `link` tiene un valor
  - Si `link` es `undefined`, no renderiza nada

### Tipos de Props

#### Props Obligatorios

```typescript
interface Props {
  nombre: string;     // Debe ser provisto siempre
  edad: number;       // Debe ser provisto siempre
}
```

Si se intenta usar el componente sin estos props, TypeScript mostrará un error:

```astro
<!-- ❌ Error: falta el prop "edad" -->
<MiComponente nombre="Juan" />

<!-- ✅ Correcto -->
<MiComponente nombre="Juan" edad={25} />
```

#### Props Opcionales

```typescript
interface Props {
  nombre: string;
  email?: string;     // Puede ser omitido
  telefono?: string;  // Puede ser omitido
}
```

Se puede usar el componente con o sin estos props:

```astro
<!-- ✅ Correcto: sin props opcionales -->
<MiComponente nombre="Juan" />

<!-- ✅ Correcto: con props opcionales -->
<MiComponente nombre="Juan" email="juan@example.com" />
```

#### Props con Valores por Defecto

```typescript
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

const { title, variant = 'primary' } = Astro.props;
```

Si no se proporciona `variant`, usará `'primary'` por defecto:

```astro
<!-- variant será 'primary' automáticamente -->
<MiComponente title="Hola" />

<!-- variant será 'secondary' -->
<MiComponente title="Hola" variant="secondary" />
```

### Tipos de Datos en Props

Props pueden ser de cualquier tipo TypeScript:

```typescript
interface Props {
  // Tipos primitivos
  texto: string;
  numero: number;
  activo: boolean;
  
  // Arrays
  items: string[];
  numeros: number[];
  
  // Objetos
  usuario: {
    nombre: string;
    edad: number;
  };
  
  // Funciones (aunque raro en Astro)
  onClick?: () => void;
  
  // Uniones (valores específicos)
  tamaño: 'small' | 'medium' | 'large';
  
  // Opcionales
  descripcion?: string;
}
```

### Ejemplo Completo: Componente Card

**`src/components/Card.astro`:**

```astro
---
interface Props {
  title: string;
  description: string;
  imageSrc?: string;
  link?: string;
  variant?: 'default' | 'featured';
}

const { 
  title, 
  description, 
  imageSrc, 
  link, 
  variant = 'default' 
} = Astro.props;
---

<div class:list={['card', variant]}>
  {imageSrc && (
    <img src={imageSrc} alt={title} />
  )}
  
  <h3>{title}</h3>
  <p>{description}</p>
  
  {link && (
    <a href={link} class="card-link">
      Ver más →
    </a>
  )}
</div>

<style>
  .card {
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .card.featured {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
  }
  
  img {
    width: 100%;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
</style>
```

**Usando el componente con diferentes props:**

```astro
---
import Card from '../components/Card.astro';
---

<!-- Card básico (solo props obligatorios) -->
<Card 
  title="Mi Título"
  description="Descripción simple"
/>

<!-- Card con imagen -->
<Card 
  title="Con Imagen"
  description="Este card incluye una imagen"
  imageSrc="/imagen.jpg"
/>

<!-- Card completo (todos los props) -->
<Card 
  title="Card Destacado"
  description="Este card tiene todos los props"
  imageSrc="/featured.jpg"
  link="/detalles"
  variant="featured"
/>
```

### Comparación con Angular

| Aspecto | Angular | Astro |
|---------|---------|-------|
| **Definición** | `@Input() title: string;` | `interface Props { title: string }` |
| **Recepción** | `this.title` | `Astro.props.title` o desestructurado |
| **Ubicación** | Clase del componente | Fence `---` |
| **Validación** | Decoradores `@Input()` | TypeScript interface |
| **Opcionales** | `@Input() title?: string;` | `title?: string` en interface |

**Ejemplo equivalente:**

```typescript
// Angular
@Component({...})
export class CardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() link?: string;
}
```

```astro
// Astro
---
interface Props {
  title: string;
  description: string;
  link?: string;
}
const { title, description, link } = Astro.props;
---
```

### Mejores Prácticas

1. **Siempre define Props con interface**: Aprovecha TypeScript para validación
2. **Usa nombres descriptivos**: `title` es mejor que `t`
3. **Marca opcionales correctamente**: Usa `?` para props opcionales
4. **Proporciona valores por defecto**: Cuando tenga sentido
5. **Documenta props complejos**: Agrega comentarios JSDoc

```typescript
interface Props {
  /** Título principal del card */
  title: string;
  
  /** Descripción detallada (máximo 200 caracteres) */
  description: string;
  
  /** URL opcional para enlace externo */
  link?: string;
}
```

---

### 7. Crear un Componente Reutilizable

Ahora que entendemos cómo funcionan los props, crearemos un componente `Card` que podremos reutilizar en diferentes páginas. Este componente demostrará cómo pasar props y cómo los estilos tienen scope automático en Astro.

Crea `src/components/Card.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  link?: string;
}

const { title, description, link } = Astro.props;
---

<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>
  {link && (
    <a href={link} class="card-link">
      Ver más →
    </a>
  )}
</div>

<style>
  .card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  h3 {
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  p {
    color: #64748b;
    margin: 0 0 1rem;
  }

  .card-link {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }

  .card-link:hover {
    text-decoration: underline;
  }
</style>
```

#### 7.1: Usar el Componente Card en la Página About

Ahora actualicemos la página `about.astro` para usar nuestro componente `Card`. Esto demostrará la reutilización de componentes en Astro.

Actualiza `src/pages/about.astro`:

```astro
---
//....
import Card from '../components/Card.astro';
---
```


```html
    <h2>Características Principales</h2>
    <div class="cards-grid">
      <Card 
        title="Islands Architecture"
        description="Arquitectura de islas que permite cargar JavaScript solo donde es necesario, manteniendo el resto del sitio como HTML estático."
      />
      <Card 
        title="Zero JavaScript"
        description="Por defecto, Astro no envía JavaScript al navegador. Solo se carga cuando explícitamente lo necesitas para interactividad."
      />
      <Card 
        title="Multi-Framework"
        description="Usa React, Vue, Svelte, Solid o cualquier otro framework en el mismo proyecto. Elige el mejor para cada componente."
      />
      <Card 
        title="Optimización Automática"
        description="Astro optimiza automáticamente imágenes, CSS y JavaScript para obtener el mejor rendimiento sin configuración extra."
        link="https://docs.astro.build"
      />
    </div>
```


**¿Qué hicimos aquí?**

1. **Importamos el componente Card**: `import Card from '../components/Card.astro';`
2. **Usamos el componente múltiples veces**: Creamos 4 cards con diferentes contenidos
3. **Pasamos props**: Cada card recibe `title`, `description` y opcionalmente `link`
4. **Grid responsive**: Los cards se organizan automáticamente en columnas según el espacio disponible

Esto demuestra el poder de la **reutilización de componentes** en Astro. El mismo componente `Card` puede usarse en cualquier página con diferentes contenidos.

### 8. Verificar el Proyecto

Ejecuta el servidor de desarrollo:

```bash
pnpm dev
```

Navega a:
- `http://localhost:4321/` - Página principal
- `http://localhost:4321/perfil` - Página de perfil
- `http://localhost:4321/about` - Página about

### 9. Build de Producción

Cuando estés listo para producción:

```bash
pnpm build
pnpm preview
```

El comando `preview` te permite visualizar el build de producción localmente antes de desplegarlo.

---

## Tarea: Replicar la Práctica de Angular en Astro

### Objetivos

Replicar la misma funcionalidad que se implementó en Angular, adaptada a Astro:

1. **Crear estructura de proyecto** 
2. **Crear página de perfil** 
3. **Implementar navegación** 
4. **Aplicar estilos personalizados** 

### Entregables

Entregar las siguientes capturas de pantalla y enlaces:

1. **Captura de `astro.config.mjs`** - Configuración del proyecto
2. **Captura de `src/pages/perfil.astro`** - Código de la página de perfil
3. **Captura de `src/layouts/BaseLayout.astro`** - Código del layout base
4. **Captura de la página desplegada** - Screenshot del navegador mostrando la página funcionando
5. **Enlace a GitHub Pages** - URL del sitio desplegado
6. **Enlace al repositorio de GitHub** - URL del código fuente



### Guía de Despliegue en GitHub Pages

**📚 Documentación oficial**: [Deploy your Astro Site to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

Astro mantiene una **GitHub Action oficial** para desplegar tu proyecto a GitHub Pages con muy poca configuración. Esta es la forma recomendada de desplegar en GitHub Pages.

#### Paso 1: Configurar Astro para GitHub Pages

En `astro.config.mjs`, configura dos valores importantes:

**1. `site`**: La URL base de tu sitio de GitHub Pages

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tu-usuario.github.io',
});
```

**Ejemplo:**
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pablot18.github.io',
});
```

**2. `base`**: El nombre de tu repositorio (solo si NO es `username.github.io`)

Si tu repositorio **NO** tiene el formato especial `<username>.github.io`, debes configurar `base` con el nombre de tu repositorio:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pablot18.github.io',
  base: '/01-fundamentos-astro',
});
```

**⚠️ Importante**: El valor de `base` debe comenzar con `/` (e.g. `/mi-repo`).

**¿Cuándo usar `base`?**
- ✅ **Sí**: Si tu repositorio se llama `01-fundamentos-astro` → `base: '/01-fundamentos-astro'`
- ❌ **No**: Si tu repositorio se llama `username.github.io` → No uses `base`

#### Paso 2: Crear el Workflow de GitHub Actions

**Opción A: Usando la Acción Oficial de Astro (Recomendado)**

Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  # Ejecuta el workflow cada vez que haces push a la rama `main`
  push:
    branches: [ main ]
  # Permite ejecutar este workflow manualmente desde la pestaña Actions
  workflow_dispatch:

# Permisos necesarios para clonar el repo y crear el deployment
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout del repositorio
        uses: actions/checkout@v5
      
      - name: Instalar, construir y subir el sitio
        uses: withastro/action@v5
        # with:
          # path: . # Ubicación raíz de tu proyecto Astro (opcional)
          # node-version: 24 # Versión específica de Node (opcional, default: 22)
          # package-manager: pnpm@latest # Gestor de paquetes (opcional, se detecta automáticamente)

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy a GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Opción B: Workflow Manual Completo**

Si prefieres tener control total del proceso:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**⚠️ Importante**: La acción oficial de Astro escanea tu lockfile para detectar tu gestor de paquetes (npm, yarn, pnpm, o bun). Asegúrate de hacer commit de tu archivo `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock` o `bun.lockb`.

#### Paso 3: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: **GitHub Actions**
4. Guarda los cambios

#### Paso 4: Desplegar

```bash
git add .
git commit -m "feat: add Astro fundamentals project"
git push origin main
```

El workflow se ejecutará automáticamente y tu sitio estará disponible en:
- `https://tu-usuario.github.io/nombre-repositorio/`

#### Paso 5: Solución al Problema de Rutas con `base` Configurado

**⚠️ Problema Común**: Cuando despliegas en GitHub Pages con `base: '/nombre-repositorio'` configurado, los enlaces internos como `/perfil` intentan ir a `tu-usuario.github.io/perfil` en lugar de `tu-usuario.github.io/nombre-repositorio/perfil`, generando errores 404.

**Ejemplo del problema:**

Si tu sitio está desplegado en `https://pablot18.github.io/01-fundamentos-astro/` y usas:

```astro
<a href="/perfil">Perfil</a>
```

El navegador buscará `https://pablot18.github.io/perfil` (❌ Error 404) en lugar de `https://pablot18.github.io/01-fundamentos-astro/perfil` (✅ Correcto).

**Solución: Usar `import.meta.env.BASE_URL`**

Astro proporciona la variable `import.meta.env.BASE_URL` que automáticamente contiene el valor de `base` configurado.

En `src/layouts/BaseLayout.astro`:

```astro
---
// ...
const base = import.meta.env.BASE_URL;
---
<!-- ... -->
        <a href={base}>Inicio</a>
        <a href={`${base}perfil`}>Perfil</a>
        <a href={`${base}about`}>Acerca de</a>
    <!-- ... -->

```

**Cambios aplicados:**

1. **Obtener BASE_URL**: `const base = import.meta.env.BASE_URL;`
2. **Enlaces de navegación**: `<a href={base}>` genera `/nombre-repositorio/`
3. **Recursos estáticos**: `href={`${base}favicon.svg`}` genera `/nombre-repositorio/favicon.svg`

**Verificación local:**

Probar el build con la configuración de `base` antes de desplegar:

```bash
pnpm build
pnpm preview
```

Visitar `http://localhost:4321/nombre-repositorio/` y verificar que todas las rutas funcionan correctamente.

**📚 Más información**: [Configuring a base value - Astro Docs](https://docs.astro.build/en/reference/configuration-reference/#base)

---

## Diferencias Clave: Angular vs Astro

| Aspecto | Angular | Astro |
|---------|---------|-------|
| **Enrutamiento** | Configuración manual en `app.routes.ts` | Automático basado en archivos |
| **Componentes** | Clases TypeScript con decoradores | Archivos `.astro` con frontmatter |
| **Estilos** | Scoped por defecto | Scoped por defecto |
| **Data Binding** | Two-way binding `[(ngModel)]` | One-way, se ejecuta en build time |
| **JavaScript** | Bundle completo siempre cargado | Zero JS por defecto |
| **Templates** | HTML con directivas Angular | HTML con sintaxis JSX-like |
| **Performance** | SPA tradicional | SSG ultra-rápido |

---

## Recursos Adicionales

- **[Documentación oficial de Astro](https://docs.astro.build)**
- **[Astro Examples](https://github.com/withastro/astro/tree/main/examples)**
- **[Astro Discord Community](https://astro.build/chat)**
- **[Astro Blog Tutorial](https://docs.astro.build/en/tutorial/0-introduction/)**
