#  Proyecto Astro

---

##  Instalación del Proyecto Astro

### 1️ Abrir Visual Studio Code
Abre la carpeta donde trabajarás tu proyecto Astro.

![imagen](astro\romero_barbecho\imagenes\primera.png)

---

### 2️ Abrir la terminal integrada


![imagen](astro\romero_barbecho\imagenes\segunda.png)

---

### 3️ Crear el proyecto Astro
Aqui instalaremos las dependencias necesarias para nuestro proyecto.

![imagen](astro\romero_barbecho\imagenes\tercera.png)



### 4 Ya creado todo incluido rutas
Estructura de Rutas en Astro (File-Based Routing)
Astro utiliza un sistema de ruteo automático basado en archivos, lo que significa que cada archivo .astro dentro de la carpeta src/pages corresponde a una ruta en el sitio web.

No necesitas crear ni registrar rutas manualmente.

![imagen](astro\romero_barbecho\imagenes\cuarta.png)

Ejemplo de estructura de carpetas

src/
 └─ pages/
      ├─ index.astro          →   /
      ├─ about.astro          →   /about
      └─ productos/
            ├─ index.astro    →   /productos
            └─ [id].astro     →   /productos/101
```
IMAGEN AQUÍ (captura de VS Code mostrando la estructura de carpetas)

Ejemplo de una página simple
Archivo: src/pages/about.astro

```astro
<h1>About Page</h1>
<p>Esta es una página normal en Astro.</p>
```
Ruta generada automáticamente:

```bash
/about
```
Ejemplo de una ruta dinámica
Archivo: src/pages/productos/[id].astro

```astro
---
const { id } = Astro.params;
---
<h1>Producto ID: {id}</h1>
```
Ruta generada automáticamente:

```bash
/productos/123
```
Conclusión del sistema de rutas
| Framework | Sistema de Rutas |
|---|---|
| Angular | router.module (manual) |
| React | react-router-dom (manual) |
| Vue | vue-router (manual) |
| Astro | ✅ Rutas automáticas por archivos |

Control de Versiones con Git
Asegúrate de estar en tu rama de trabajo (por ejemplo astro-romero_barbecho):

```bash
git branch
```
Si ya estás en la rama correcta, realiza los siguientes pasos para guardar tus cambios:

```bash
git add .
git commit -m "creación de rutas y páginas en Astro"
git push -u origin astro-romero_barbecho
```
IMAGEN AQUÍ (terminal mostrando los comandos ejecutados con éxito)

Nota final
Este proyecto está desarrollado con Astro, un framework moderno que permite crear sitios rápidos, optimizados y con ruteo automático.
Cada archivo .astro dentro de src/pages se convierte automáticamente en una ruta accesible desde el navegador, simplificando la estructura del proyecto.

IMAGEN AQUÍ (pantallazo final del proyecto funcionando en el navegador)

---

##  Descripción del Proyecto y Objetivos

Este proyecto tiene como objetivo principal la implementación y documentación de un sitio web utilizando el framework Astro. Se detallan los pasos para la instalación, configuración y desarrollo de páginas, aprovechando el sistema de ruteo basado en archivos de Astro.

### Objetivos:
*   **Instalación y Configuración:** Documentar el proceso de creación de un nuevo proyecto Astro, incluyendo la configuración inicial y la ejecución del servidor de desarrollo.
*   **Sistema de Rutas:** Explicar y ejemplificar el funcionamiento del ruteo automático basado en archivos de Astro, incluyendo rutas estáticas y dinámicas.
*   **Control de Versiones:** Integrar y documentar el uso de Git para el control de versiones del proyecto.
*   **Buenas Prácticas:** Fomentar el uso de frameworks modernos y eficientes como Astro para el desarrollo web.
