# Programación y Plataformas Web 

# Frameworks Web: Angular

<div align="center">
  <img src="https://es.vecteezy.com/arte-vectorial/33289339-vector-un-logo-diseno-elemento-astro-logo" width="80" alt="Angular Logo">

</div>


## Practica 1: Instalación y Configuración de Astrp

### Autores

**Jordy Romero**  
📧 jormeroa5@est.ups.edu.ec
💻 GitHub: https://github.com/JordyRomeroa

**Nayely Barbecho**
📧 @est.ups.edu.ec
💻GitHub: 




## Instalación de Astro

Primero instala el **Astro** globalmente:

```bash
npm create astro@latest
```
![Instalacion Astro](astro\romero_barbecho\assets\instalacionAstro.png)

Darle nombre a un nuevo proyecto o carpeta:

![instalacion en carpeta](astro\romero_barbecho\assets\tercera.png)

Carpetas ya creadas luego de la instalacion de Astro:

![Todo lo nuevo en la instalacion](astro\romero_barbecho\assets\cuarta.png)

Ejecutar la aplicación para que sea accesible desde otras máquinas en la red local:
```bash
ng serve --host 0.0.0.0 --port 4200
```

![proyeccion del Astro](astro\romero_barbecho\assets\paginaactiva.png)

---

## Extensiones recomendadas para VSCode (Astro)

| Extensión | Función |
|----------|---------|
| [Astro VSCode](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) | Soporte oficial para Astro: autocompletado, coloreado, formateo y diagnósticos para `.astro`. |
| [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) | Autocompletado avanzado para clases de Tailwind. |
| [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) | Iconos visuales para identificar archivos y carpetas. |
| [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) | Formateador automático del código. |
| [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | Linter para mantener un estilo de código coherente. |
| [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag) | Cierre automático de etiquetas HTML. |
| [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) | Renombrado automático de etiquetas emparejadas. |
| [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) | Soporte para archivos `.env` (variables de entorno). |
| [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter) (opcional) | Inserta imports automáticamente al escribir código TypeScript. |

Hoja de Atajos – Astro CLI
Comandos básicos

```bash
npx create-astro@latest   # Crear un nuevo proyecto Astro
npm install               # Instalar dependencias
npm run dev               # Iniciar servidor de desarrollo
npm run build             # Compilar para producción
npm run preview           # Vista previa del build final
```

Creación de páginas y componentes en Astro

Astro NO crea componentes con comandos como Angular.
En Astro se crean archivos directamente:

Componentes Astro
Ruta sugerida:

src/components/NombreComponente.astro


Páginas (rutas)
Se colocan en:

src/pages/ruta.astro


Ejemplo real:
src/pages/about.astro crea automáticamente la ruta /about.

Tips importantes del proyecto Astro

Todo archivo .astro dentro de src/pages/ se convierte en una ruta.

Puedes combinar: Astro + HTML + JavaScript + React + Vue + Svelte.

Para estilos globales, crea src/styles/global.css y la importas.

Tailwind se integra al proyecto fácilmente:

```bash
npm install tailwindcss
npx tailwindcss init
```

## Astro

### Estructura creada automáticamente del proyecto

- `src/pages` → Cada archivo `.astro` dentro de esta carpeta representa una ruta/página del sitio.
- `src/components` → Componentes reutilizables (menús, cards, headers, etc.).
- `public` → Archivos estáticos (imágenes, icons, CSS global opcional).
- `astro.config.mjs` → Configuración principal del proyecto Astro.
- `package.json` → Dependencias, scripts de ejecución y configuración del proyecto.

---

### Rutas / Páginas en Astro

Los nombres de archivo en `src/pages` definen la ruta:

| Archivo                      | Ruta en el navegador |
|-----------------------------|----------------------|
| `src/pages/index.astro`     | `/`                  |
| `src/pages/perfil.astro`    | `/perfil`            |
| `src/pages/proyectos.astro` | `/proyectos`         |
| `src/pages/proyectoDos.astro` | `/proyectoDos`     |

---

### Crear un componente

Los componentes se guardan en `src/components`:

Ejemplo:

src/components/NavMenu.astro


Luego se importa en una página Astro así:

```astro
---
import NavMenu from '../components/NavMenu.astro';
---
<NavMenu />

Ejecutar el proyecto

```bash
npm run dev
```

## Resultados:

Capturas de pantalla como evidencia del proceso de instalación y configuración de **Astro**, así como explicaciones detalladas de la estructura del proyecto y páginas utilizadas en la práctica.

### 1. Instalación de Astro y creación del proyecto:

![alt text](astro\romero_barbecho\assets\instalacionAstro.png)

**Descripción de la imagen:**

En esta captura se muestra el proceso de instalación del entorno Astro y la creación del proyecto mediante el comando oficial `pnpm create astro@latest`.

- **Comando ejecutado:**
```bash
npm create astro@latest
```
###  2. Revisión de configuración de Astro:

Descripción de la imagen:

En esta captura se observa el archivo astro.config.mjs, el cual contiene la configuración principal del proyecto (integraciones, plugins, cambios de base URL, etc.)

Astro no requiere comando tipo ng version, porque no es un framework basado en CLI complejo: Astro se configura directamente vía archivos de proyecto.

###  3. Creación del proyecto Astro + Inicio del servidor:
![alt text](astro\romero_barbecho\assets\segunda.png)


```bash
npm create astro@latest
npm install
npm dev
```
![alt text](astro\romero_barbecho\assets\tercera.png)


Se eligió CSS como estilo por defecto.

No se usó SSR obligatorio: Astro es por defecto Islas de Contenido con render híbrido.


Se seleccionó TypeScript recomendado.
![alt text](astro\romero_barbecho\assets\paginaactiva.png)

###  4. Explicación de la estructura del proyecto en Astro:

![alt text](astro\romero_barbecho\assets\cuarta.png)

## Carpetas y archivos principales:

public: Archivos estáticos accesibles públicamente.

src: Carpeta del código fuente.

node_modules: Dependencias del proyecto.

pnpm-lock.yaml: Bloqueo de versiones para reproducibilidad.

astro.config.mjs: Configuración principal de Astro.

package.json: Dependencias y configuraciones del proyecto.

tsconfig.json: Configuración de TypeScript.


## Carpeta SRC
Dentro de src, encontramos:
pages: Aquí se crean las páginas .astro que representan rutas.

index.astro → /

perfil.astro → /perfil

proyectos.astro → /proyectos

components: Componentes Astro reutilizables (layouts, navs, tarjetas, etc.)
Páginas en Astro
No existe AppModule, no hay main.ts complejo.
Cada archivo .astro es una página directamente.
