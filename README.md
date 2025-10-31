

## Manual de Trabajo en GitHub 

![alt text](.core/assets/ups-icc.png)


**Asignatura:** Programación y Plataformas Web

**Tema:** Frameworks Web (Angular, React, Vue, Astro, etc.)

---

## Descripción general del proyecto

Este repositorio compartido está diseñado para que todos los estudiantes documenten sus avances prácticos sobre los frameworks web asignados.

El trabajo se estructura en torno a **un flujo común de aprendizaje con Angular** —dirigido por el docente— y la **replicación de cada práctica en el framework asignado** (React, Vue, Astro, etc.).

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
 
   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80"  alt="Vue Logo"  />

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">

   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg" width="80" alt="Astro Logo">
  


</div>


Cada pareja o grupo de estudiantes contará con **una carpeta propia** dentro del framework que le corresponde y también una carpeta dentro de **/angular**, donde replicará los mismos ejercicios vistos en clase.

El objetivo es que cada grupo:

1. Comprenda los conceptos comunes aplicados en Angular (ejemplo principal de clase).
2. Replique la práctica en su framework asignado, documentando paso a paso cada avance con capturas, comandos y explicaciones en archivos `.md`.
3. Mantenga el orden del repositorio sin modificar el trabajo de otros grupos.

---

## 📂 Estructura del Repositorio

El repositorio tendrá la siguiente organización:

```
/angular
   ├── docente
      ├── 01_instalacion.md
      ├── 02_navegacion_forms.md
   ├── perez_torres
      ├── 01_instalacion.md
      ├── 02_navegacion_forms.md
/react
   ├── perez_torres
      ├── 01_instalacion.md
      ├── 02_navegacion_forms.md
/vue
   ├── perez_torres
      ├── 01_instalacion.md
      ├── 02_navegacion_forms.md
/astro
   ├── perez_torres
      ├── 01_instalacion.md
      ├── 02_navegacion_forms.md
README.md
```

* La carpeta **`/angular/docente`** contendrá las guías oficiales vistas en clase.
* Cada pareja tendrá su **carpeta personal (por apellidos)** dentro de **/angular** y dentro de **su framework asignado**.
* En cada una deberá replicar las secciones trabajadas (instalación, componentes, formularios, etc.).



---

## 🛠️ Pasos para trabajar

### 1. Clonar el repositorio

Descargar el repositorio localmente:

```bash
git clone https://github.com/usuario/repositorio-frameworks.git
```

Entrar al proyecto:

```bash
cd repositorio-frameworks
```

---

### 2. Crear una rama personal

Cada pareja trabajará en una rama con el nombre del framework y apellidos:

```bash
git checkout -b vue-apellido1-apellido2
```

Ejemplo:

```bash
git checkout -b react-perez_torres
```

---

### 3. Editar SOLO su carpeta y archivos

Cada grupo debe **editar únicamente los archivos de su propia carpeta** tanto en:

* `/angular/nombre_apellido1_apellido2/`
* y en `/framework_asignado/nombre_apellido1_apellido2/`

En cada archivo `.md` deberán incluir:

* Capturas de pantalla del proceso.
* Explicaciones de instalación, componentes, formularios, y otros temas vistos.
* Comparaciones con Angular cuando corresponda.

Ejemplo:

```markdown
# 01 - Instalación de Vue
1. Ejecutamos: `npm init vue@latest`
2. Creamos el proyecto con las opciones por defecto.
3. Captura: ![Instalación Vue](img/vue-instalacion.png)

# 02 - Navegación y Formularios
Creamos el archivo `router/index.js` con las rutas principales.
```

---

### 4. Guardar cambios y hacer commit

```bash
git add vue/perez_torres/01_instalacion.md
git commit -m "Avance 1: instalación y componentes básicos en Vue"
```

Los mensajes de commit serán indicados en clase.

---

### 5. Sincronizar antes de subir

Antes de subir cambios, siempre sincronizar con la rama principal:

```bash
git pull origin main
```

Si surgen conflictos:

* Resolver solo los que afecten a sus propios archivos.
* No modificar carpetas ni archivos de otros compañeros.

---

### 6. Subir los cambios a su rama

```bash
git push origin vue-apellido1-apellido2
```

---

### 7. Crear un Pull Request (PR)

Cuando se haya comletado un avance importante (sera indicado en clases), crear un PR. 
En GitHub:

1. Ir al repositorio.
2. Seleccionar la rama creada (`vue-nombre1-nombre2`).
3. Hacer clic en **"New Pull Request"**.
4. Solicitar merge hacia `main`.

* Luego revisaré y aprobará el PR colocando la calificación

---

## Reglas Importantes

* **No trabajar en la rama `main`.**
* **No editar archivos ajenos ni el `README.md` principal.**
* Los commits deben ser **claros, breves y coherentes**.
* **Subir avances al final de cada clase.**
* Verificar que los archivos `.md` contengan texto ordenado, imágenes visibles y descripciones comprensibles.



## GIST de ayuda

* [Conceptos clave de Programación Web](https://gist.github.com/PabloT18/d06b0843d8659dcf990d2c2b902231a9)


* [VS Code](https://gist.github.com/PabloT18/683e6d950b240f9620a98903cf92e87a)

* [Git y GitHub](https://gist.github.com/PabloT18/96343b6be1b5cfe237fe53e48eeeb6ef)

* [Node y PNPM](https://gist.github.com/PabloT18/8c0728e24b14c1c63a879b819f628299)

* [Angular](https://gist.github.com/PabloT18/efa4daa60d4782967187ce34cfe5771a)