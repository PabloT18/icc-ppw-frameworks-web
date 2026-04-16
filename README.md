

## Manual de Trabajo en GitHub 

![alt text](.core/assets/ups-icc.png)

**Asignatura:** Programación y Plataformas Web

**Tema:** Frameworks Web (Angular, React, Vue, Astro, etc.)

---

## Descripción general del proyecto

Este repositorio contiene material conceptual y guías prácticas sobre frameworks web modernos (Javascript, Angular, React, Vue, Astro, etc.) para el curso de Programación y Plataformas Web.

<div align="center">


  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="80" alt="Javascript Logo">


  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
 
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80"  alt="Vue Logo"  />

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">

   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg" width="80" alt="Astro Logo">
</div>

El repositorio incluye:

1. Material conceptual organizado por framework y tema
2. Guías paso a paso para cada práctica
3. Instrucciones para que los estudiantes creen sus proyectos independientes

---

## Estructura del Repositorio

El repositorio está organizado de la siguiente manera:

```
/angular
   ├── 01-instalacion-configuracion/
   │   └── 01-instalacion-configuracion.md
   ├── 02-fundamentos/
   │   ├── 02-fundamentos.md
   │   └── 02-fundamentos-practica.md
   ├── 03-navegacion/
   │   └── 03-navegacion.md
   ├── 04-formularios/
   │   └── 04-formularios.md
   └── ...
/react
   ├── 01-instalacion-configuracion/
   │   └── 01-instalacion-configuracion.md
   ├── 02-fundamentos/
   │   └── 02-fundamentos.md
   └── ...
/vue
   ├── 01-instalacion-configuracion/
   │   └── 01-instalacion-configuracion.md
   ├── 02-fundamentos/
   │   └── 02-fundamentos.md
   └── ...
/astro
   ├── 01-instalacion-configuracion/
   │   └── 01-instalacion-configuracion.md
   ├── 02-fundamentos/
   │   └── 02-fundamentos.md
   └── ...
/docs
   ├── angular-deploy.md
   ├── angular-observables-rx.md
   └── ...
README.md
```

Cada carpeta de framework contiene:
- Material conceptual organizado por temas
- Guías de prácticas paso a paso
- Recursos y assets de apoyo

---

## Pasos para trabajar

### 1. Clonar el repositorio de material

Descargar el repositorio con el material del curso:

```bash
git clone https://github.com/PabloT18/icc-ppw-frameworks-web.git
```

Este repositorio contiene únicamente **material de referencia y guías** para seguir las prácticas.

---

### 2. Crear tu propio proyecto

Cada estudiante debe crear **su propio proyecto independiente** en el framework asignado o de preferencia.

#### Para Angular:
```bash
ng new mi-proyecto-angular
cd mi-proyecto-angular
```

#### Para React:
```bash
npx create-react-app mi-proyecto-react
cd mi-proyecto-react
```

#### Para Vue:
```bash
npm init vue@latest mi-proyecto-vue
cd mi-proyecto-vue
```

#### Para Astro:
```bash
npm create astro@latest mi-proyecto-astro
cd mi-proyecto-astro
```

---


### 3. Crear repositorio propio en GitHub

Cada estudiante debe crear su propio repositorio en GitHub para su proyecto:

1. Ir a [GitHub](https://github.com) y crear un nuevo repositorio
2. Nombrarlo como: `icc-p68-ppw-[framework]`
3. Hacer que el repositorio sea **público**
4. Subir tu proyecto:

```bash
git init
git add .
git commit -m "init: Angular Project"
git remote add origin https://github.com/tu-usuario/mi-proyecto-[framework]-ppw.git
git branch -M main
git push -u origin main
```

---

### 4. Guardar cambios y hacer commits

A medida que avances con las prácticas, guarda tus cambios con commits descriptivos:

Para inicio de la practica 

```bash
git add .
git commit -m "feat: Práctica 02 - Fundamentos completada"
git push origin main
```

Para cambios de actualización o adición 


```bash
git add .

git commit -m "add: Práctica 02 - se agrego el modulo usuarios"

o

git commit -m "upd: Práctica 02 - se actulizo el hombe page"

git push origin main
```


Para finalizar la práctica 
```bash
git add .
git commit -m "END: Práctica 02 - Fundamentos completada"
git push origin main
```

**Directrices para Commits**

Es fundamental seguir ciertas directrices al realizar commits para asegurar la claridad y organización del trabajo.

Referencia: [Directrices para Commits](.core/docs/commit-guidelines.md)

---

### 5. README del proyecto del estudiante

El archivo `README.md` en la raíz de tu proyecto debe incluir:

```markdown
# Mi Proyecto [Framework] - ICC PPW

## Descripción
Proyecto de prácticas del curso de Programación y Plataformas Web usando [Framework].

## Prácticas Realizadas
- Práctica 01: Instalación y Configuración
- Práctica 02: Fundamentos
- Práctica 03: Navegación
- Práctica 04: Formularios
- ... (agregar según vayas completando)

## Aplicación Desplegada

**Ver aplicación:** [URL de tu aplicación desplegada]

Ejemplo para GitHub Pages: [https://tu-usuario.github.io/mi-proyecto-[framework]-ppw/](https://tu-usuario.github.io/mi-proyecto-[framework]-ppw/)

## Evidencias

Las evidencias de cada práctica se encuentran en la carpeta [`evidencias/`](./evidencias/)

## Tecnologías
- [Framework] [versión]
- [Lenguaje] (TypeScript, JavaScript, etc.)
- [Otras tecnologías usadas]

## Instalación

\```bash
# Instalar dependencias
npm install
# o
pnpm install
\```

## Ejecutar en desarrollo

\```bash
# Para Angular
ng serve

# Para React
npm start

# Para Vue
npm run dev

# Para Astro
npm run dev
\```

## Autor
[Tu nombre completo]
[Tu correo institucional]
```

---


### 6. Estructura del proyecto del estudiante

Para este curso trabajaremos con **un único proyecto por framework** donde realizarás todas las prácticas (práctica 01, 02, 03, 04, etc.). Dentro del proyecto, crearás una carpeta especial para documentar las evidencias.

**Estructura recomendada del proyecto:**

```
mi-proyecto-[framework]/
├── src/
│   ├── app/ 
│   │   ├── home/ (components/, pages/, según el framework)
│   │   ├── perfil/ (components/, pages/, según el framework)
│   │   └── ...
├── evidencias/
│   ├── assets/
│   │   ├── 01-captura-instalacion.png
│   │   ├── 02-captura-routes.png
│   │   ├── 02-captura-component.png
│   │   ├── 03-captura-navegacion.png
│   │   └── ...
│   ├── 01-instalacion-nombre-apellido.md
│   ├── 02-fundamentos-nombre-apellido.md
│   ├── 03-navegacion-nombre-apellido.md
│   └── ...
├── README.md
└── package.json
```

#### Formato del Archivo de Evidencias

**Nombre del archivo:** `[numero]-[tema]-nombre-apellido.md`

**Ubicación:** `evidencias/[numero]-[tema]-nombre-apellido.md`

**Ejemplo:** `evidencias/02-fundamentos-pablo-torres.md`

**Contenido del archivo:**

```markdown
# Práctica [Numero]: [Título de la Práctica]

## Datos del Estudiante
- **Nombre:** [Tu nombre completo]
- **Curso:** [Tu curso]
- **Fecha:** [Fecha de entrega]

---

## 1. [Título de la sección]
![Descripción de la captura](assets/02-captura-ejemplo.png)

**Descripción:** [Explicar qué muestra esta captura]

---

## 2. [Siguiente sección]
![Descripción de la captura](assets/02-captura-ejemplo-2.png)

**Descripción:** [Explicar qué muestra esta captura]

---

## 3. Captura de la aplicación funcionando
![Aplicación desplegada](assets/02-captura-demo.png)

**Descripción:** Aplicación funcionando en el navegador.

---

## 4. Conclusiones

[Aquí debes agregar conclusiones, dificultades encontradas o mejoras implementadas]
```

---


### 7. Qué entregar en el AVAC

Para completar la entrega de cada práctica, debes subir al AVAC **DOS elementos**:

1. **Link al repositorio remoto de GitHub**
   - URL del repositorio de tu proyecto
   - Ejemplo: `https://github.com/tu-usuario/icc-ppw-[framewor]-[nombre]`
   - Asegúrate de que el repositorio sea **público**

2. **Archivo Markdown de evidencias convertido a PDF**
   - El archivo `[numero]-[tema]-nombre-apellido.pdf` 
   - Genera el PDF desde tu archivo Markdown usando una extensión de VS Code o herramienta de tu preferencia
   - Este archivo debe contener todas las capturas y descripciones

---

## Reglas Importantes

- **Cada estudiante trabaja en su propio repositorio personal**
- El repositorio del curso es solo **material de referencia**
- Los commits deben ser **claros, breves y coherentes**
- **Subir avances regularmente** a tu repositorio personal
- Verificar que los archivos `.md` contengan texto ordenado, imágenes visibles y descripciones comprensibles
- El repositorio personal debe ser **público** para poder compartir el enlace
- Mantener organizada la carpeta `evidencias/` con todas las capturas y archivos

---

## GIST de ayuda

* [Conceptos clave de Programación Web](https://gist.github.com/PabloT18/d06b0843d8659dcf990d2c2b902231a9)


* [VS Code](https://gist.github.com/PabloT18/683e6d950b240f9620a98903cf92e87a)

* [Git y GitHub](https://gist.github.com/PabloT18/96343b6be1b5cfe237fe53e48eeeb6ef)

* [Node y PNPM](https://gist.github.com/PabloT18/8c0728e24b14c1c63a879b819f628299)

* [Angular](https://gist.github.com/PabloT18/efa4daa60d4782967187ce34cfe5771a)