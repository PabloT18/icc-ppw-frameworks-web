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

Extender el proyecto `ppw-angular-21` para practicar creacion y composicion de componentes standalone reutilizables usando una sola ruta inicial. Se aplicaran signals, `computed`, `@if` y `@for` sin entrar aun en navegacion multipagina.

---

## 2. Contexto de la práctica

Partimos del proyecto limpio creado en el modulo 01, que ya incluye el router base configurado. En este modulo trabajamos con **una sola ruta inicial** (`/`) y construimos una pantalla compuesta por componentes reutilizables:

- `AppHeaderComponent`
- `AppHeroComponent`

No se crea `ProfilePage`, no se agregan rutas adicionales y no se trabaja navegacion avanzada.

---

## 3. Archivos que se van a modificar

- `src/app/app.routes.ts`
- `src/app/app.ts`
- `src/app/app.html`
- `src/app/components/app-header/header.ts`
- `src/app/components/app-header/header.html`
- `src/app/components/app-header/header.css`
- `src/app/components/app-hero/hero.ts`
- `src/app/components/app-hero/hero.html`
- `src/app/components/app-hero/hero.css`

---

## 4. Archivos base desde `files`

La carpeta [angular/02-fundamentos-angular/files](files/README.md) queda reservada para los archivos base de esta feature. El flujo recomendado es tomar esos archivos como punto de partida y completarlos dentro del proyecto del estudiante.

Estructura objetivo para esta practica:

```text
src/app/
  components/
    header/
      app-header.ts
      app-header.html
      app-header.css
    hero/
      app-hero.ts
      app-hero.html
      app-hero.css

```

---

## 5. Código inicial


### 5.1Verificar `app.ts`

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'ppw-angular-21';
}
```

### 5.3 Verificar `app.html`

```html
<main class="app-shell">
  <router-outlet />
</main>
```

---

## 6. Pasos incrementales

### Paso 1. Crear `AppHeaderComponent` standalone

Crear `src/app/features/home/components/header/header.ts`:

```ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class AppHeaderComponent {
  readonly brand = signal('PPW Angular 21');
  readonly showInfo = signal(false);
  readonly toggleLabel = computed(() => (this.showInfo() ? 'Ocultar info' : 'Mostrar info'));

  toggleInfo(): void {
    this.showInfo.update((value) => !value);
  }

  changeBrand(): void {
    this.brand.update((b) => b + '!');
  }

  resetBrand(): void {
    this.brand.set('PPW Angular 21');
  }
}
```

Explicacion del estado en `AppHeaderComponent`:

- `brand` es una `signal` con el titulo del encabezado. Se lee en la plantilla como `brand()`.
- `showInfo` es una `signal<boolean>` que controla si se muestra o no el texto informativo.
- `toggleLabel` es un `computed` derivado de `showInfo`; cambia automaticamente entre "Mostrar info" y "Ocultar info" sin escribir logica duplicada en el HTML.
- `toggleInfo()` usa `update()` para invertir el valor actual de `showInfo` (`true`/`false`) en cada clic.
- `changeBrand()` usa `update()` para modificar el valor actual de `brand` concatenando un carácter.
- `resetBrand()` usa `set()` para restaurar `brand` a su valor inicial directamente, sin depender del valor previo.

Crear `src/app/features/home/components/header/header.html`:

```html
<header class="header">
  <h1>{{ brand() | uppercase }}</h1>
  <div class="actions">
    <button type="button" (click)="toggleInfo()">
      {{ toggleLabel() }}
    </button>
    <button type="button" (click)="changeBrand()">Modificar título</button>
    <button type="button" (click)="resetBrand()" [disabled]="brand() === 'PPW Angular 21'">
      Restaurar título
    </button>
  </div>

  @if (showInfo()) {
    <p>Curso PPW - Angular 21 (Standalone)</p>
  }
</header>
```

Crear `src/app/features/home/components/header/header.css`:

```css
.header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

button {
  width: fit-content;
}
```

Explicacion: en este componente se practican `signal`, `computed`, `@if`, `update()`, `set()`, property binding `[disabled]` y el pipe `uppercase`.

### Paso 2. Crear `AppHeroComponent` standalone

Crear `src/app/features/home/components/hero/hero.ts`:

```ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class AppHeroComponent {
  readonly title = signal('Componentes Standalone Reutilizables');
  readonly topics = signal(['signals', 'computed', '@if', '@for', '@switch', 'pipes']);
  readonly subtitle = computed(() => `Temas activos: ${this.topics().length}`);
  readonly viewMode = signal<'lista' | 'resumen'>('lista');

  toggleMode(): void {
    this.viewMode.update((m) => (m === 'lista' ? 'resumen' : 'lista'));
  }
}
```

Crear `src/app/features/home/components/hero/hero.html`:

```html
<section class="hero">
  <h2>{{ title() | uppercase }}</h2>
  <p>{{ subtitle() }}</p>

  <button type="button" (click)="toggleMode()">Vista: {{ viewMode() }}</button>

  @switch (viewMode()) {
    @case ('lista') {
      <ul>
        @for (item of topics(); track item) {
          <li>{{ item }}</li>
        } @empty {
          <p>No hay temas registrados.</p>
        }
      </ul>
    }
    @case ('resumen') {
      <p>Total de temas: <strong>{{ topics().length }}</strong></p>
    }
  }
</section>
```

Explicacion: en este componente se practican `signal`, `computed`, `@for` con `@empty`, `@switch` y el pipe `uppercase`.

Crear `src/app/features/home/components/hero/hero.css`:

```css
.hero {
  border: 1px solid #d7deea;
  border-radius: 0.75rem;
  padding: 1rem;
  background: #ffffff;
}

ul {
  margin: 0.75rem 0 0;
}
```



### Paso 4. Renderizar usando el router existente

Verificar que:

- `app.routes.ts` mantiene la ruta inicial por defecto (sin navegacion multipagina)
- `app.ts` mantiene `RouterOutlet` en `imports`
- `app.html` renderiza `<router-outlet />`

Explicacion: se usa router, pero sin navegacion multipagina.

---

### Paso 5. Usar los componentes creados en `app.ts` y `app.html`

En este modulo, para practicar composicion directa de componentes standalone, vamos a renderizar `AppHeaderComponent` y `AppHeroComponent` desde la raiz.

Actualizar `src/app/app.ts`:

```ts
import { Component } from '@angular/core';
import { AppHeaderComponent } from './components/app-header/header';
import { AppHeroComponent } from './components/app-hero/hero';

@Component({
  selector: 'app-root',
  imports: [AppHeaderComponent, AppHeroComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'ppw-angular-21';
}
```

Explicacion de `app.ts`:

- Se importan los dos componentes standalone creados en pasos anteriores.
- En `imports` del decorador se registran para poder usarlos en la plantilla de `App`.
- Ya no necesitamos `RouterOutlet` para esta practica puntual de composicion.

Actualizar `src/app/app.html`:

```html
<main class="app-shell">
  <app-header />
  <router-outlet />
  <app-hero />
</main>
```

Probar tambien


```html
  <app-header />
  <main class="app-shell">
    <router-outlet />
  </main>
  <app-hero />
```

Explicacion de `app.html`:

- `<app-header />` renderiza el encabezado con `signal`, `computed` y `@if`.
- `<app-hero />` renderiza la seccion principal con `signal`, `computed` y `@for`.
- Esta composicion permite validar los fundamentos sin introducir navegacion avanzada todavia.

---

## 7. Entregables

1. Crear componente `app-footer`
2. Agregar el componente a la pagina
3. Usar 5 pipes en este componente.

---

## 8. Entregables

- Captura de pagina principal desplegada donde se visualice los componentes

---

## 9. Commits sugeridos

```bash
git commit -m "feat: crear componentes standalone header y hero"
git commit -m "Add: Practica 02 - Fundamentos Angular completado"
```
