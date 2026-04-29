# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 03. Navegación - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Agregar navegación real al proyecto `ppw-angular-21` mediante un shell simple, nuevas páginas y rutas con parámetros para dejar el proyecto preparado para formularios y guards.

---

## 2. Contexto de la práctica

El proyecto ya tiene una HomePage y una ProfilePage. Ahora se agregará una navegación superior y una sección `students` con listado y detalle para practicar rutas estáticas y parametrizadas dentro del mismo proyecto.

---

## 3. Archivos que se van a modificar

- `src/app/app.ts`
- `src/app/app.routes.ts`
- `src/app/features/home/pages/home-page.ts`
- `src/app/features/students/pages/students-page.ts`
- `src/app/features/students/pages/student-detail-page.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/03-navegacion/files](files/README.md) queda preparada para alojar el shell y los archivos base de la feature `students`.

---

## 5. Código inicial

### 5.1 Shell principal con navegación

```ts
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <header>
      <nav>
        <a routerLink="/">Inicio</a>
        <a routerLink="/profile">Perfil</a>
        <a routerLink="/students">Estudiantes</a>
      </nav>
    </header>

    <main class="app-shell">
      <router-outlet />
    </main>
  `,
})
export class App {}
```

### 5.2 Rutas base

```ts
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'profile', component: ProfilePage },
  { path: 'students', component: StudentsPage },
  { path: 'students/:id', component: StudentDetailPage },
  { path: '**', redirectTo: '' },
];
```

---

## 6. Pasos incrementales

### Paso 1. Agregar el shell de navegación

Actualizar `app.ts` para incluir enlaces con `RouterLink`.

Explicación: se define un layout mínimo reutilizable que seguirá creciendo en módulos posteriores.

### Paso 2. Crear la página `StudentsPage`

Crear una página standalone con un listado simple de estudiantes.

```ts
readonly students = [
  { id: 1, name: 'Ana Ruiz' },
  { id: 2, name: 'Carlos Vega' },
  { id: 3, name: 'Marta León' },
];
```

Explicación: aún no se consumen datos externos; se trabaja con estado local para concentrarse en navegación.

### Paso 3. Navegar al detalle por parámetro

Dentro de la plantilla de estudiantes agregar enlaces.

```html
@for (student of students; track student.id) {
  <a [routerLink]="['/students', student.id]">{{ student.name }}</a>
}
```

Explicación: la sintaxis de array es la forma segura de construir rutas con parámetros dinámicos.

### Paso 4. Crear `StudentDetailPage`

Leer el parámetro `id` con `ActivatedRoute`.

```ts
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

private route = inject(ActivatedRoute);
readonly id = this.route.snapshot.paramMap.get('id');
```

Explicación: en esta primera versión basta con `snapshot`; más adelante se puede reaccionar a cambios de parámetros.

### Paso 5. Enlazar la HomePage con la nueva sección

Agregar un acceso visible hacia la sección de estudiantes.

Explicación: la home deja de ser una página estática y pasa a funcionar como portal de navegación interna.

### Paso 6. Verificar fallback de ruta inválida

Entrar manualmente a una ruta inexistente y confirmar la redirección.

Explicación: esto asegura navegación robusta y evita estados muertos.

---

## 7. Validaciones esperadas

- La barra de navegación aparece en todas las páginas.
- `/students` muestra el listado.
- `/students/1` carga el detalle del estudiante 1.
- Una ruta inválida redirige a `/`.
- La navegación interna no recarga toda la página.

Placeholder sugerido de captura: `assets/03-router-shell.png`

---

## 8. Entregables

- Shell principal con navegación funcional.
- Feature `students` con listado y detalle.
- Rutas estáticas y parametrizadas configuradas.
- Redirección comodín funcionando.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: agregar shell principal con routerLink"
git commit -m "feat: crear feature students con rutas parametrizadas"
git commit -m "refactor: consolidar navegación base del proyecto"
```
