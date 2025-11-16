# Programación y Plataformas Web  

# Frameworks Web: Astro  

<div align="center">
  <img src="https://astro.build/assets/press/astro-icon-light.png" width="80" alt="Astro Logo">
</div>

## Práctica 1: Instalación y Configuración de Astro

### Autor  

**Álvarez y Villa**  

---

## Instalación de Astro

Astro es un **framework moderno** para crear sitios web rápidos, centrado en el rendimiento y la simplicidad. Permite combinar tecnologías como **HTML, Markdown, JavaScript y componentes de frameworks** (React, Vue, Svelte, etc.) en un mismo proyecto.

---

### 1️⃣ Instalación del proyecto Astro

Primero instalamos Astro usando el comando:

```bash
npm create astro@latest
## Este comando inicia el asistente interactivo para crear un nuevo proyecto Astro. 
```

Durante la instalación se nos pedirá:

1. Nombre del proyecto (por ejemplo: astro-proyecto).

2. Seleccionar una plantilla base (por ejemplo: Minimal o Blog).

3. Elegir el gestor de paquetes (recomendado: pnpm o npm).

4. Confirmar si se desea instalar dependencias automáticamente (Yes).

2️⃣ Ejecución del servidor de desarrollo

Una vez creado el proyecto, ingresamos al directorio y ejecutamos el servidor local:

```bash
cd astro-proyecto
npm run dev
```
💡 Esto abrirá el sitio en el navegador

3️⃣ Estructura del proyecto Astro

Astro crea una estructura simple y ordenada desde el inicio:

```bash
📁 astro-proyecto
├── 📁 public            # Archivos estáticos (imágenes, fuentes, etc.)
├── 📁 src
│   ├── 📁 components    # Componentes reutilizables (Astro, React, etc.)
│   ├── 📁 layouts       # Plantillas para páginas
│   ├── 📁 pages         # Rutas y páginas del sitio
│   └── 📄 env.d.ts      # Tipado para TypeScript
├── 📄 astro.config.mjs  # Configuración principal del proyecto Astro
├── 📄 package.json      # Dependencias y scripts del proyecto
├── 📄 tsconfig.json     # Configuración de TypeScript
└── 📄 README.md         # Documentación del proyecto
```
4️⃣ Archivos principales

1. src/pages/index.astro → Página principal del sitio.

2. src/components/ → Carpeta para los componentes reutilizables.

3. astro.config.mjs → Archivo de configuración de Astro.

4. package.json → Contiene scripts y dependencias.

5. public/ → Carpeta pública para recursos estáticos (imágenes, íconos, etc.).

5️⃣ Comandos básicos de Astro

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Genera la versión de producción del sitio
npm run preview  # Previsualiza el sitio generado
```
---

## Extensiones recomendadas para VSCode (Astro)

Estas extensiones potencian el desarrollo con Astro:

* **[Astro VSCode Extension] – Autocompletado, coloreado de sintaxis y soporte oficial de Astro.**
* **[Prettier] - Code Formatter – Formateo automático del código.**

* **[Tailwind CSS IntelliSense] – Autocompletado y ayuda visual para clases de Tailwind.**

* **[Icon Fonts] – Mejora visual de los archivos en el explorador.**

* **[Markdown Preview Enhanced] – Vista previa en vivo de archivos .md.**

---
8️⃣ Resultados

Con el comando que estaba al inicio saldria la creacion de Astro y colocamos el nombre del Proyecto-

![alt text](<Imagen de WhatsApp 2025-11-06 a las 19.16.56_0c7f0569.jpg>)

Aqui nos hace una pregunta donde ponemos YES para el repositorio del Git

![alt text](<captura 2.jpg>)

Ponemos YES para instalar todas las dependencias de Astro

![alt text](<Imagen de WhatsApp 2025-11-06 a las 23.02.42_2121a504.jpg>)
 
 Como resultado tenemos ya lo que seria de Astro.

![alt text](<Imagen de WhatsApp 2025-11-06 a las 23.02.42_95f83196.jpg>)

CONCLUSION

Astro permite desarrollar sitios web con gran velocidad, simplicidad y rendimiento.
Su enfoque “Zero JavaScript by default” lo hace ideal para proyectos estáticos modernos, integrando fácilmente tecnologías como React, Vue, Svelte o Tailwind CSS.