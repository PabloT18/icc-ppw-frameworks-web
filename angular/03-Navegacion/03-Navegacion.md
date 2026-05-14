# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 03. Navegación

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. ¿Qué es la navegación en Angular?

La navegación en Angular es el mecanismo que permite cambiar de vista según la URL sin recargar toda la página. En lugar de cargar un documento HTML distinto por cada clic, Angular mantiene una sola aplicación activa (SPA) y renderiza componentes diferentes dentro de una zona dinámica de la interfaz.

Esto permite:

- Transiciones de vista más rápidas
- Mejor continuidad del estado en frontend
- Arquitecturas modulares por features
- Escalabilidad hacia guards, lazy loading y layouts anidados

---

## 2. Características principales del Router en Angular 21

1. **Registro declarativo de rutas**: se define un arreglo tipado `Routes` en `app.routes.ts`.
2. **Integración global por providers**: se habilita con `provideRouter(routes)` en `app.config.ts`.
3. **Renderizado dinámico**: `<router-outlet>` inserta el componente activo según la URL.
4. **Navegación declarativa**: `routerLink` permite cambiar de ruta desde templates.
5. **Navegación programática**: `Router.navigate()` permite navegar desde TypeScript.
6. **Soporte de rutas dinámicas**: parámetros como `students/:id` reutilizan una misma vista con datos distintos.

| Característica | Enfoque en Angular 21 |
|---|---|
| Definición de rutas | `export const routes: Routes = [...]` |
| Registro global | `provideRouter(routes)` |
| Render de vistas | `<router-outlet />` |
| Links internos | `routerLink` |
| Params dinámicos | `:id`, `:slug`, etc. |
| Fallback | ruta comodín `**` |

---

## 3. Conceptos fundamentales del router

| Concepto | Descripción | Ejemplo |
|---|---|---|
| **Ruta** | Regla que asocia un `path` con un componente | `{ path: 'students', component: StudentsPage }` |
| **Ruta raíz** | URL base de la aplicación (`/`) | `{ path: '', component: HomePage }` |
| **Ruta dinámica** | Ruta con parámetro | `{ path: 'students/:id', component: StudentDetailPage }` |
| **Redirección** | Reenvía una ruta a otra | `{ path: '**', redirectTo: '' }` |
| **RouterOutlet** | Placeholder donde se renderiza la vista activa | `<router-outlet />` |
| **RouterLink** | Directiva para navegar sin recargar | `<a routerLink="/students">Estudiantes</a>` |

---

## 4. Estructura de archivos para navegación

En un proyecto Angular moderno, la navegación mínima involucra estos archivos:

- `app.routes.ts`: declara rutas.
- `app.config.ts`: registra router globalmente.
- `app.ts`: importa directivas de navegación para la plantilla raíz.
- `app.html`: incluye barra de navegación y `<router-outlet />`.
- `features/**/pages/*.ts`: componentes de página asociados a rutas.

---

## 5. El archivo app.routes.ts en navegación real

`app.routes.ts` concentra el mapa de vistas de la aplicación:

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

### Qué representa cada ruta

| Ruta | Significado |
|---|---|
| `''` | Página de inicio |
| `'students'` | Listado de estudiantes |
| `'students/:id'` | Detalle de estudiante según parámetro |
| `'**'` | Captura rutas inválidas y redirige |

---

## 6. Registro global con provideRouter

El arreglo de rutas no funciona por sí solo: debe registrarse en `app.config.ts`.

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

Sin `provideRouter(routes)`, Angular no interpreta cambios de URL ni renderiza rutas.

---

## 7. RouterOutlet: punto de renderizado dinámico

`<router-outlet />` define la zona donde se muestra el componente activo.

```html
<header>
  <nav>
    <a routerLink="/">Inicio</a>
    <a routerLink="/students">Estudiantes</a>
  </nav>
</header>

<main class="app-shell">
  <router-outlet />
</main>
```

Flujo:

1. Cambia la URL (clic o navegación programática).
2. Router compara la URL con `routes`.
3. Encuentra coincidencia y crea el componente.
4. Inserta ese componente dentro de `<router-outlet />`.

---

## 8. RouterLink y tipos de navegación en templates

### Sintaxis directa (string)

```html
<a routerLink="/students">Estudiantes</a>
```

Útil para rutas fijas.

### Sintaxis con binding (array)

```html
<a [routerLink]="['/students', student.id]">Ver detalle</a>
```

Útil para rutas dinámicas, composición con variables y mayor control.

### routerLinkActive

Permite marcar visualmente la opción activa:

```html
<a routerLink="/students" routerLinkActive="active">Estudiantes</a>
```

---

## 9. Parámetros de ruta y ActivatedRoute

Los parámetros permiten reutilizar una misma página para múltiples entidades.

Ruta:

```ts
{ path: 'students/:id', component: StudentDetailPage }
```

Lectura del parámetro en el componente:

```ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-detail-page',
  template: `<p>ID: {{ id }}</p>`,
})
export class StudentDetailPage {
  private route = inject(ActivatedRoute);
  readonly id = this.route.snapshot.paramMap.get('id');
}
```

---

## 10. Navegación programática con Router

Cuando la navegación depende de lógica TypeScript (validaciones, acciones, flujos), se usa `Router`:

```ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-example',
  template: `<button (click)="goToStudents()">Ir a estudiantes</button>`,
})
export class ExampleComponent {
  private router = inject(Router);

  goToStudents(): void {
    this.router.navigate(['/students']);
  }
}
```

---

## 11. Buenas prácticas

- Diseñar rutas por features (`home`, `students`, `profile`, etc.).
- Mantener `path` claros, cortos y consistentes.
- Usar siempre ruta comodín (`**`) para URLs inválidas.
- Preferir `routerLink` sobre `href` para rutas internas.
- Evitar lógica compleja de navegación en templates; moverla a TypeScript.
- Mantener una página de inicio simple como punto de entrada estable.

---

## 12. Errores comunes

- Intentar navegar con `href` y recargar toda la SPA.
- Olvidar `provideRouter(routes)` en `app.config.ts`.
- No colocar `<router-outlet />` en la plantilla raíz.
- Declarar rutas sin fallback y dejar URLs inválidas sin manejo.
- Mezclar rutas de páginas y componentes UI sin criterio de arquitectura.

---

## 13. Relación con el proyecto incremental

Este módulo transforma los fundamentos del módulo 02 (componentes, signals, control de flujo y binding) en una aplicación con múltiples vistas navegables. La navegación es la base para módulos posteriores donde se trabajará formularios, servicios HTTP, guards y autenticación.

---

## 14. Referencias

- Documentación oficial del Router: https://angular.dev/guide/routing
- Definir rutas: https://angular.dev/guide/routing/define-routes
- RouterLink: https://angular.dev/guide/routing/navigate-to-routes
- Leer parámetros de ruta: https://angular.dev/guide/routing/read-route-state
- RouterOutlet: https://angular.dev/api/router/RouterOutlet
