# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 02. Fundamentos de Angular - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Extender el proyecto `ppw-angular-21` para practicar componentes standalone, binding, signals, `computed`, `@if`, `@for` y `@switch` sobre una feature real y no sobre fragmentos desconectados.

---

## 2. Contexto de la práctica

Partimos del proyecto creado en el módulo 01. En esta práctica se crea una feature `profile` con una página simple que representa información personal, habilidades y proyectos. El objetivo es usar estado local moderno y renderizado declarativo.

---

## 3. Archivos que se van a modificar

- `src/app/app.routes.ts`
- `src/app/features/home/pages/home-page.ts`
- `src/app/features/profile/pages/profile-page.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/02-fundamentos-angular/files](files/README.md) queda reservada para los archivos base de esta feature. El flujo recomendado es tomar esos archivos como punto de partida y completarlos dentro del proyecto del estudiante.

---

## 5. Código inicial

### 5.1 Registrar una nueva ruta

```ts
import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page';
import { ProfilePage } from './features/profile/pages/profile-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'profile',
    component: ProfilePage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

### 5.2 Estructura base del componente

```ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  readonly firstName = signal('Juan');
  readonly lastName = signal('Pérez');
  readonly age = signal(30);
  readonly skills = signal(['Angular', 'TypeScript', 'HTML']);

  readonly fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

---

## 6. Pasos incrementales

### Paso 1. Crear la feature `profile`

Crear la estructura `features/profile/pages` y el componente `ProfilePage`.

Explicación: desde este módulo se enseña a organizar por feature y no por tipo de archivo global.

### Paso 2. Mostrar datos básicos con interpolación

Agregar en la plantilla el nombre completo y la edad.

```html
<h1>{{ fullName() }}</h1>
<p>Edad: {{ age() }}</p>
```

Explicación: la plantilla lee signals llamándolas como función.

### Paso 3. Agregar actualización de estado

Crear un botón para cambiar datos personales.

```ts
changeData() {
  this.firstName.set('Ana');
  this.lastName.set('González');
  this.age.set(22);
}
```

```html
<button type="button" (click)="changeData()">Cambiar datos</button>
```

Explicación: `set()` reemplaza el valor completo de la signal.

### Paso 4. Renderizar habilidades con `@for`

```html
@if (skills().length > 0) {
  <ul>
    @for (skill of skills(); track skill) {
      <li>{{ skill }}</li>
    }
  </ul>
} @else {
  <p>No hay habilidades registradas.</p>
}
```

Explicación: `@empty` también sería válido, pero aquí se refuerza primero la lectura combinada de `@if` y `@for`.

### Paso 5. Crear una categoría de edad con `@switch`

Agregar un `computed` o método simple para clasificar la edad.

```ts
readonly ageCategory = computed(() => {
  const value = this.age();

  if (value < 18) return 'minor';
  if (value < 30) return 'young';
  if (value < 60) return 'adult';
  return 'senior';
});
```

```html
@switch (ageCategory()) {
  @case ('minor') {
    <p>Menor de edad</p>
  }
  @case ('young') {
    <p>Joven</p>
  }
  @case ('adult') {
    <p>Adulto</p>
  }
  @default {
    <p>Senior</p>
  }
}
```

### Paso 6. Enlazar la HomePage con la nueva feature

Agregar un enlace visible desde la página inicial hacia `/profile`.

Explicación: esto prepara el terreno para el módulo 03, donde la navegación será el foco principal.

---

## 7. Validaciones esperadas

- La ruta `/profile` renderiza correctamente.
- El botón actualiza nombre y edad.
- La lista de habilidades se muestra con `@for`.
- La categoría cambia según la edad.
- No se usan `*ngIf` o `*ngFor` como enfoque principal.

Placeholder sugerido de captura: `assets/02-profile-page.png`

---

## 8. Entregables

- Feature `profile` creada.
- Uso correcto de signals y `computed`.
- Uso correcto de `@if`, `@for` y `@switch`.
- Enlace visible entre la página inicial y la nueva página.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: agregar feature profile con signals"
git commit -m "feat: usar control flow moderno en profile page"
git commit -m "refactor: organizar fundamentos por feature"
```
