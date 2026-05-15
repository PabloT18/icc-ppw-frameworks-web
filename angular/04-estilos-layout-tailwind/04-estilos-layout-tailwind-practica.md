# Programación y Plataformas Web

# Frameworks Web: Angular 21 + TailwindCSS

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="TailwindCSS Logo">
</div>

## 05. Estilos y Layout con Tailwind - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Aplicar TailwindCSS al proyecto `ppw-angular-21` para construir un shell responsive, tarjetas base y una estructura visual coherente en Home, Profile y Students.

---

## 2. Contexto de la práctica

El proyecto ya tiene rutas y formularios. Ahora necesita una base visual consistente. En esta fase todavía no se usan componentes visuales predefinidos; se trabaja el layout desde utilidades Tailwind.

---

## 3. Archivos que se van a modificar

- `src/styles.css`
- `src/app/app.ts`
- `src/app/features/home/pages/home-page.ts`
- `src/app/features/profile/pages/profile-page.ts`
- `src/app/features/students/pages/students-page.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/05-estilos-layout-tailwind/files](files/README.md) queda lista para guardar fragmentos base del shell, layout y cards de este módulo.

---

## 5. Código inicial

### 5.1 Activar estilos globales base

```css
@import "tailwindcss";

body {
  @apply bg-slate-100 text-slate-900;
}
```

### 5.2 Construir un contenedor principal

```html
<main class="min-h-screen bg-slate-100">
  <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
    <router-outlet />
  </div>
</main>
```

---

## 6. Pasos incrementales

### Paso 1. Configurar Tailwind en el proyecto

Instalar y dejar operativo Tailwind en `styles.css`.

Explicación: este cambio afecta todo el proyecto, por eso se hace antes de seguir componiendo vistas.

### Paso 2. Estilizar el shell principal

Convertir el `app.ts` en un contenedor central con padding, ancho máximo y fondo general.

Explicación: el shell deja de ser solo un punto de montaje y empieza a controlar experiencia visual global.

### Paso 3. Rehacer la HomePage como panel simple

Usar grid y cards para mostrar accesos rápidos a Profile, Students y Formulario.

Explicación: la HomePage pasa a ser dashboard de navegación útil.

### Paso 4. Estilizar ProfilePage

Organizar datos personales y habilidades en bloques con cards y espaciado consistente.

Explicación: se demuestra cómo usar Tailwind para mejorar legibilidad sin crear CSS pesado.

### Paso 5. Estilizar StudentsPage

Maquetar el listado con grid o stack responsivo y separar visualmente acciones principales.

Explicación: el layout debe responder tanto en móvil como en escritorio.

### Paso 6. Revisar breakpoints

Probar que al menos Home y Students cambian de disposición entre móvil y pantallas medianas.

Explicación: no basta con “verse bien” en una resolución fija.

---

## 7. Validaciones esperadas

- El proyecto ya usa Tailwind correctamente.
- Las páginas principales tienen layout consistente.
- El shell no se desborda en móvil.
- Existe jerarquía visual clara en títulos, bloques y acciones.

Placeholder sugerido de captura: `assets/05-layout-dashboard.png`

---

## 8. Entregables

- Tailwind integrado al proyecto.
- Shell general estilizado.
- Home, Profile y Students con layout base consistente.
- Responsive mínimo probado en móvil y desktop.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: integrar tailwind al proyecto incremental"
git commit -m "feat: construir shell responsive y cards base"
git commit -m "style: unificar layout de home profile y students"
```
