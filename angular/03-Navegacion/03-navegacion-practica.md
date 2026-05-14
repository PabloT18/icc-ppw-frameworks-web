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

Convertir la composición local del módulo 02 en una navegación real por rutas, reutilizando los componentes ya creados (`AppHeaderComponent` y `AppHeroComponent`) dentro de una `HomePage` y agregando la feature `students` con parámetro dinámico.

---

## 2. Contexto de continuidad con módulo 02

Esta práctica parte del estado final del módulo 02:

- Ya existen componentes standalone reutilizables (`header` y `hero`) con `signal`, `computed`, `@if`, `@for`, `@switch`, pipes y binding.
- La app aún no está organizada por páginas navegables.
- Ahora moveremos esa UI a una página de inicio enrutable (`HomePage`) y activaremos navegación con Router.

> Importante: esta práctica no requiere rehacer los componentes del módulo 02; se reutilizan tal como quedaron.

---

## 3. Archivos que se van a crear o modificar

- `src/app/app.routes.ts` (configurar rutas)
- `src/app/app.ts` (usar `RouterLink` y `RouterOutlet`)
- `src/app/app.html` (shell de navegación)
- `src/app/features/home/pages/home-page.ts` (crear página de inicio reutilizando header/hero)
- `src/app/features/home/pages/home-page.html` (plantilla de inicio)
- `src/app/features/students/pages/students-page.ts` (crear listado)
- `src/app/features/students/pages/student-detail-page.ts` (crear detalle dinámico)

---

## 4. Estructura esperada

```text
src/app/
  app.routes.ts
  app.ts
  app.html
  features/
    home/
      pages/
        home-page.ts
        home-page.html
    students/
      pages/
        students-page.ts
        student-detail-page.ts
```

Si en el módulo 02 tus componentes `header` y `hero` quedaron en otra ruta, ajusta únicamente los imports de `home-page.ts`.

---

## 5. Estado base recomendado antes de empezar

### 5.1 Verificar `app.config.ts`

Debe conservar el router registrado:

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

### 5.2 Verificar que tus componentes de módulo 02 existan

- `AppHeaderComponent`
- `AppHeroComponent`

No se modifican en esta práctica, solo se reutilizan.

---

## 6. Pasos incrementales

### Paso 1. Crear/actualizar `app.routes.ts`

```ts
import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page';
import { StudentsPage } from './features/students/pages/students-page';
import { StudentDetailPage } from './features/students/pages/student-detail-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'students', component: StudentsPage },
  { path: 'students/:id', component: StudentDetailPage },
  { path: '**', redirectTo: '' },
];
```

Explicación:

- `''` apunta a la página principal.
- `students` muestra un listado.
- `students/:id` reutiliza una vista para cualquier estudiante.
- `**` evita rutas rotas y redirige al inicio.

### Paso 2. Crear `HomePage` reutilizando componentes del módulo 02

Crear `src/app/features/home/pages/home-page.ts`:

```ts
import { Component } from '@angular/core';
import { AppHeaderComponent } from '../components/header/header';
import { AppHeroComponent } from '../components/hero/hero';

@Component({
  selector: 'app-home-page',
  imports: [AppHeaderComponent, AppHeroComponent],
  templateUrl: './home-page.html',
})
export class HomePage {}
```

Crear `src/app/features/home/pages/home-page.html`:

```html
<section class="home-page">
  <app-header />
  <app-hero />
</section>
```

Explicación:

- El contenido que antes estaba montado en la raíz de la app ahora vive dentro de una página enrutable.
- Esto mantiene la continuidad del módulo 02 sin perder lo construido.

### Paso 3. Crear `StudentsPage`

Crear `src/app/features/students/pages/students-page.ts`:

```ts
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students-page',
  imports: [RouterLink],
  template: `
    <section>
      <h1>Estudiantes</h1>
      <p>Selecciona un estudiante para ver su detalle.</p>

      <ul>
        @for (student of students(); track student.id) {
          <li>
            <a [routerLink]="['/students', student.id]">
              {{ student.name }}
            </a>
          </li>
        } @empty {
          <li>No hay estudiantes disponibles.</li>
        }
      </ul>
    </section>
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

Explicación:

- Se mantiene la sintaxis de control de flujo moderna (`@for`, `@empty`).
- Se usa `[routerLink]` con sintaxis array para componer ruta + parámetro dinámico.

### Paso 4. Crear `StudentDetailPage`

Crear `src/app/features/students/pages/student-detail-page.ts`:

```ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-detail-page',
  imports: [RouterLink],
  template: `
    <section>
      <h1>Detalle del estudiante</h1>
      <p>ID recibido por la ruta: <strong>{{ id }}</strong></p>

      <a routerLink="/students">Volver al listado</a>
    </section>
  `,
})
export class StudentDetailPage {
  private route = inject(ActivatedRoute);
  readonly id = this.route.snapshot.paramMap.get('id');
}
```

Explicación:

- `ActivatedRoute` permite leer parámetros definidos en `app.routes.ts`.
- `snapshot.paramMap.get('id')` obtiene el valor de `:id`.

### Paso 5. Actualizar `app.ts` como shell de navegación

Actualizar `src/app/app.ts`:

```ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'ppw-angular-21';
}
```

### Paso 6. Actualizar `app.html`

```html
<header class="app-nav">
  <nav>
    <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
    <a routerLink="/students" routerLinkActive="active">Estudiantes</a>
  </nav>
</header>

<main class="app-shell">
  <router-outlet />
</main>
```

Explicación:

- `routerLink` cambia de vista sin recarga.
- `routerLinkActive` permite identificar visualmente la opción activa.
- `<router-outlet />` renderiza la página actual.

---

## 7. Validaciones esperadas

- `/` renderiza `HomePage` con los componentes del módulo 02 (`header` y `hero`).
- `/students` muestra el listado.
- `/students/1` muestra detalle con `id = 1`.
- Si escribes una URL inválida, redirige a `/`.
- La navegación ocurre sin recarga completa del navegador.

---

## 8. Entregables

1. Router funcional con `HomePage`, `StudentsPage` y `StudentDetailPage`.
2. `HomePage` reutilizando componentes creados en módulo 02.
3. Ruta dinámica funcionando con `ActivatedRoute`.
4. Shell de navegación con `routerLink` y `routerLinkActive`.

---

## 9. Commits sugeridos

```bash
git add .
git commit -m "feat: configurar rutas base para navegacion"

git add .
git commit -m "feat: crear home-page reutilizando componentes del modulo 02"

git add .
git commit -m "feat: agregar feature students con ruta parametrica"

git add .
git commit -m "END: Practica 03 - Navegacion completada"
```
