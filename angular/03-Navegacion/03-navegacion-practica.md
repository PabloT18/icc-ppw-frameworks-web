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

Transformar el proyecto `ppw-angular-21` para agregar navegación real mediante routing, parámetros dinámicos y un shell de navegación que prepara el proyecto para formularios y guards.

---

## 2. Contexto de la práctica

Hasta el módulo 02, el proyecto solo tenía la página ProfilePage sin navegación. En este módulo:
- Creamos `HomePage` (que ya no se crea en módulo 01)
- Creamos `StudentsPage` con listado y `StudentDetailPage` con parámetro dinámico
- Configuramos el router para cambiar entre estas páginas sin recargar
- Agregamos un shell de navegación superior

---

## 3. Archivos que se van a modificar

- `src/app/app.routes.ts` (crear y configurar rutas)
- `src/app/app.config.ts` (verificar que `provideRouter` está configurado)
- `src/app/app.ts` (actualizar para usar `RouterOutlet`)
- `src/app/app.html` (agregar header con navegación)
- `src/app/features/home/pages/home-page.ts` (crear componente)
- `src/app/features/students/pages/students-page.ts` (crear componente)
- `src/app/features/students/pages/student-detail-page.ts` (crear componente)

---

## 4. Archivos base desde `files`

La carpeta [angular/03-navegacion/files](files/README.md) queda preparada para alojar el shell y los archivos base de la feature `students`.

---

## 5. Código inicial

### 5.1 Crear `app.routes.ts`

En `src/app/app.routes.ts` (archivo nuevo):

```ts
import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page';
import { ProfilePage } from './features/profile/pages/profile-page';
import { StudentsPage } from './features/students/pages/students-page';
import { StudentDetailPage } from './features/students/pages/student-detail-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'profile', component: ProfilePage },
  { path: 'students', component: StudentsPage },
  { path: 'students/:id', component: StudentDetailPage },
  { path: '**', redirectTo: '' },
];
```

### 5.2 Actualizar `app.config.ts`

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
```

### 5.3 Actualizar `app.ts` con navegación

```ts
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'ppw-angular-21';
}
```

### 5.4 Actualizar `app.html` con barra de navegación

```html
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
```

---

## 6. Pasos incrementales

### Paso 1. Crear `app.routes.ts`

Este es el primer archivo que necesita el router. Define todas las rutas de la aplicación: HomePage, ProfilePage, StudentsPage, y el detalle de estudiante con parámetro dinámico `:id`.

Explicación: el comodín `**` redirige cualquier ruta inválida a `/` para mantener la navegación robusta.

### Paso 2. Agregar `provideRouter` en `app.config.ts`

Actualizar el provider de configuración global para incluir el router con las rutas del paso anterior.

Explicación: esto es lo que hace que Angular reconozca las rutas y sea capaz de cambiar componentes al navegar.

### Paso 3. Reemplazar `ProfilePage` con `RouterOutlet` en `app.ts`

Ahora `app.ts` no renderiza una página fija, sino que deja que el router elija qué componente mostrar según la URL.

Explicación: `RouterOutlet` es el placeholder donde el router renderiza el componente correcto.

### Paso 4. Agregar el shell de navegación en `app.html`

Crear un `<header>` con `<nav>` y enlaces usando `routerLink`.

Explicación: `routerLink` es la forma Angular de navegar sin recargar la página; es lo equivalente a `<a href>` pero reactivo.

### Paso 5. Crear `HomePage`

Crear en `src/app/features/home/pages/home-page.ts` el componente de inicio (no se creó en módulo 01):

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <section>
      <h1>PPW Angular 21</h1>
      <p>Proyecto incremental con navegación funcional.</p>
    </section>
  `,
})
export class HomePage {}
```

### Paso 6. Crear `StudentsPage`

Crear en `src/app/features/students/pages/students-page.ts` una página con listado de estudiantes:

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Estudiantes</h1>
    <ul>
      @for (student of students(); track student.id) {
        <li>
          <a [routerLink]="['/students', student.id]">{{ student.name }}</a>
        </li>
      }
    </ul>
  `,
})
export class StudentsPage {
  readonly students = signal([
    { id: 1, name: 'Ana Ruiz' },
    { id: 2, name: 'Carlos Vega' },
    { id: 3, name: 'Marta León' },
  ]);
}
```

### Paso 7. Crear `StudentDetailPage`

Crear en `src/app/features/students/pages/student-detail-page.ts` una página que lea el parámetro `:id`:

```ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-detail-page',
  standalone: true,
  template: `
    <h1>Detalle del Estudiante</h1>
    <p>ID: {{ id }}</p>
  `,
})
export class StudentDetailPage {
  private route = inject(ActivatedRoute);
  readonly id = this.route.snapshot.paramMap.get('id');
}
```

### Paso 8. Verificar navegación completa

Comprobar que:
- Los enlaces de la barra de navegación cambian de página sin recargar.
- `/students` muestra el listado.
- `/students/1` carga el detalle del estudiante 1.
- Una ruta inválida redirige a `/`.

---

## 7. Validaciones esperadas

- La barra de navegación aparece en todas las páginas.
- `/` muestra HomePage.
- `/profile` muestra ProfilePage.
- `/students` muestra el listado de estudiantes.
- `/students/1` carga el detalle del estudiante 1.
- Una ruta inválida redirige a `/`.
- La navegación interna no recarga toda la página.

---

## 8. Entregables

- `app.routes.ts` completamente configurado con todas las rutas.
- `app.config.ts` actualizacdo con `provideRouter(routes)`.
- Shell principal en `app.ts` y `app.html` con navegación funcional.
- Feature `students` con listado y detalle parametrizado.
- Redirección comodín (`**` → `/`) funcionando.

---

## 9. Commits sugeridos

```bash
git add .
git commit -m "feat: crear app.routes.ts con rutas base"

git add .
git commit -m "feat: agregar shell con navegación usando RouterLink"

git add .
git commit -m "feat: crear feature students con rutas parametrizadas"

git add .
git commit -m "END: Practica 03 - Navegación y Router completados"
```
