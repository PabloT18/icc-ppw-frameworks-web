# Programación y Plataformas Web

# Frameworks Web: Angular 21 + TailwindCSS

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="TailwindCSS Logo">
</div>

## 06. Temas y Componentes UI

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Agregar un sistema visual más rico al proyecto incremental usando temas y componentes UI reutilizables, sin perder la base de layout construida con Tailwind en el módulo anterior.

---

## 2. Explicación conceptual

Después de dominar layout y responsive, conviene pasar a una segunda capa: sistema visual consistente. Aquí entran temas, componentes predefinidos y piezas reutilizables como navbar, cards, drawer, tablas y badges.

| Solo Tailwind base | Tailwind + sistema de componentes |
|---|---|
| mayor control manual | mayor velocidad para construir UI repetible |
| cada componente visual se arma desde cero | existen patrones visuales listos para reutilizar |
| útil para estructura | útil para consistencia y productividad |

Este módulo puede apoyarse en DaisyUI porque ya existe material previo y encaja bien con la secuencia del curso.

---

## 3. Fundamento técnico

### 3.1 DaisyUI como capa de componentes

```bash
pnpm add -D daisyui@latest
```

```css
@import "tailwindcss";
@plugin "daisyui";
```

### 3.2 Temas visuales

```html
<html data-theme="cupcake"></html>
```

Un tema define colores y estilos base. La ventaja pedagógica es que el estudiante puede experimentar consistencia visual sin escribir una paleta completa desde cero.

### 3.3 Componentes reutilizables

Los componentes UI del curso deben montarse como componentes Angular, no como HTML duplicado en muchas páginas. Ejemplos naturales:

- navbar principal
- footer
- stat card
- empty state card
- table wrapper

---

## 4. Ejemplos de código

### Ejemplo 1: navbar con DaisyUI

```html
<div class="navbar rounded-2xl bg-base-100 shadow-sm">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">PPW Angular</a>
  </div>
  <div class="flex-none gap-2">
    <a class="btn btn-ghost">Inicio</a>
    <a class="btn btn-primary">Estudiantes</a>
  </div>
</div>
```

### Ejemplo 2: tarjeta reutilizable

```html
<article class="card bg-base-100 shadow-sm">
  <div class="card-body">
    <h2 class="card-title">Perfil</h2>
    <p>Gestiona datos y habilidades del usuario.</p>
  </div>
</article>
```

---

## 5. Buenas prácticas

- Introduce componentes UI solo después de tener buen layout base.
- Evita mezclar demasiadas librerías visuales en el mismo proyecto.
- Reutiliza componentes Angular para piezas repetidas del sistema visual.
- Mantén una separación clara entre estructura, tema y datos.
- Si usas temas, documenta cuál es el tema por defecto y por qué.

---

## 6. Errores comunes

- Usar DaisyUI como sustituto de arquitectura de componentes.
- Duplicar navbar y footer en varias páginas.
- Introducir demasiados estilos ad hoc encima del sistema visual.
- Confundir componente visual con componente de dominio.
- Cambiar de tema sin revisar contraste y legibilidad.

---

## 7. Relación con el proyecto incremental

Este módulo convierte el shell y las páginas del proyecto en una interfaz más coherente. Además deja listas piezas reutilizables que luego servirán para consumo HTTP, autenticación y guards.

---

## 8. Referencias recomendadas

- Documentación oficial DaisyUI: https://daisyui.com
- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
