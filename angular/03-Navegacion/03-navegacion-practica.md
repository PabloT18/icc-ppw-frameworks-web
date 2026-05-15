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

Convertir la composición local del módulo 02 en una aplicación navegable: el `AppHeaderComponent` pasa a incluir la barra de navegación, el shell raíz (`app.html`) aloja header, `<router-outlet>` y footer, y la `HomePage` muestra solo el hero con un botón de navegación programática (`goToStudentsPage`). Se agrega la feature `students` con listado y detalle dinámico.

---

## 2. Contexto de continuidad con módulo 02

Esta práctica parte del estado final del módulo 02:

- Ya existen componentes standalone reutilizables (`header` y `hero`) con `signal`, `computed`, `@if`, `@for`, `@switch`, pipes y binding.
- La app aún no está organizada por páginas navegables.
- Ahora el `AppHeaderComponent` recibe los enlaces de navegación y el shell raíz (`app.html`) se convierte en el contenedor permanente de header + footer.

> Importante: cada componente tiene sus propios archivos `.ts`, `.html` y `.css`. No se usa `template` ni `styles` inline.

---

## 3. Archivos que se van a crear o modificar

**Shell global:**
- `src/app/app.routes.ts` — configurar rutas
- `src/app/app.ts` — importar header, footer y router-outlet
- `src/app/app.html` — layout permanente
- `src/app/app.css` — estilos del contenedor principal

**Componentes globales (nivel app):**
- `src/app/components/header/header.ts` — añadir RouterLink y nav
- `src/app/components/header/header.html` — añadir `<nav>`
- `src/app/components/header/header.css` — estilos del header y nav

**Feature home:**
- `src/app/features/home/pages/home-page.ts` — página de inicio con `goToStudentsPage()`
- `src/app/features/home/pages/home-page.html` — muestra solo `<app-hero>`
- `src/app/features/home/pages/home-page.css` — estilos de la página

**Feature students:**
- `src/app/features/students/pages/students-page.ts`
- `src/app/features/students/pages/students-page.html`
- `src/app/features/students/pages/students-page.css`
- `src/app/features/students/pages/student-detail-page.ts`
- `src/app/features/students/pages/student-detail-page.html`
- `src/app/features/students/pages/student-detail-page.css`

---

## 4. Estructura esperada

```text
src/app/
  app.routes.ts
  app.ts
  app.html
  app.css
  components/              ← componentes globales usados en el shell
    header/
      header.ts
      header.html
      header.css
    footer/
      footer.ts
      footer.html
      footer.css
  features/
    home/
      components/          ← solo el hero, exclusivo de la feature home
        hero/
          hero.ts
          hero.html
          hero.css
      pages/
        home-page.ts
        home-page.html
        home-page.css
    students/
      pages/
        students-page.ts
        students-page.html
        students-page.css
        student-detail-page.ts
        student-detail-page.html
        student-detail-page.css
```

> El criterio de ubicación es el **alcance de uso**: `header` y `footer` aparecen en todas las páginas (están en el shell raíz), por eso viven en `src/app/components/`. El `hero` solo se usa en la `HomePage`, por eso vive en `features/home/components/`.

Si en el módulo 02 tus componentes quedaron en otra ruta, ajusta únicamente los imports.

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
- `AppFooter`

No se modifican en esta práctica, solo se reutilizan.

---

## 6. Pasos incrementales

### Paso 1. Configurar `app.routes.ts`

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

**¿Qué hace cada propiedad?**

| Propiedad | Descripción |
|-----------|-------------|
| `path: ''` | Ruta vacía = URL raíz `/`. Se activa cuando no hay segmento después del dominio. |
| `path: 'students'` | Se activa cuando la URL es exactamente `/students`. |
| `path: 'students/:id'` | `:id` es un segmento **dinámico** que acepta cualquier valor (`/students/1`, `/students/42`). El valor se lee en el componente con `ActivatedRoute`. |
| `path: '**'` | Comodín: captura cualquier URL no definida anteriormente. |
| `redirectTo: ''` | En lugar de renderizar un componente, redirige a la ruta raíz. |

> ⚠️ El orden importa: `**` siempre debe ir **al final** para no interceptar rutas válidas.

---

### Paso 2. Actualizar `AppHeaderComponent` con navegación

El header del módulo 02 tenía múltiples signals y controles. Para este módulo lo simplificamos: conserva solo el `brand` y añadimos un `<nav>` con dos enlaces. Lo construiremos de forma incremental, añadiendo una pieza a la vez.

---

#### Paso 2.1. Simplificar el TS y crear el HTML base

El componente queda reducido a una sola señal (`brand`) y el import de `RouterLink` para que los `<a>` naveguen sin recargar la página.

**`header.ts`**

```ts
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class AppHeaderComponent {
  readonly brand = signal('PPW Angular');
}
```

**`header.html`** — brand a la izquierda, nav a la derecha:

```html
<header class="app-header">

  <!-- Título de la app: signal brand transformado a mayúsculas con el pipe -->
  <span class="app-header__brand">{{ brand() | uppercase }}</span>

  <!--
    routerLink="/" y routerLink="/students" navegan internamente sin recargar.
    Aún no hay indicador visual de cuál está activo.
  -->
  <nav class="app-header__nav">
    <a class="nav-link" routerLink="/">Inicio</a>
    <a class="nav-link" routerLink="/students">Estudiantes</a>
  </nav>

</header>
```

Con esto los enlaces ya navegan entre rutas. El siguiente paso es aplicar los estilos para posicionar brand a la izquierda y nav a la derecha.

![alt text](assets/paso2.1.png)


---

#### Paso 2.2. Estilos del header

**`header.css`**

```css
/* Contenedor del header: fila con brand a la izquierda y nav a la derecha */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Empuja brand al extremo izquierdo, nav al derecho */
  padding: 1rem 1.5rem;
  background-color: #1a1a2e;
  color: white;
}

/* Título de la aplicación */
.app-header__brand {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;
}

/* Fila de enlaces de navegación */
.app-header__nav {
  display: flex;
  gap: 1.5rem;
}

/* Estilo base de cada enlace */
.nav-link {
  color: #ccc;
  text-decoration: none;
  font-size: 0.95rem;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent; /* Reserva espacio para el subrayado activo */
  transition: color 0.2s, border-color 0.2s;
}
.nav-link:hover { color: white; }
```

El `border-bottom: 2px solid transparent` reserva el espacio del subrayado desde el inicio, para que al activarlo no desplace el layout.

![alt text](assets/paso2.2.png)
---

#### Paso 2.3. Activar `RouterLinkActive`

Los enlaces funcionan y tienen estilos, pero no hay indicador visual de cuál está activo. `RouterLinkActive` es la directiva que añade y quita automáticamente una clase CSS cuando el `routerLink` del elemento coincide con la URL actual.

**No hace falta ninguna lógica TypeScript**: Angular observa la URL y gestiona la clase por sí solo.

**Actualizar `header.ts`** — añadir `RouterLinkActive` al array `imports`

**Actualizar `header.html`** — añadir `routerLinkActive="nav-link--active"` a los dos `<a>`:

```html
<nav class="app-header__nav">
  <a class="nav-link"
     routerLink="/"
     routerLinkActive="nav-link--active">
    Inicio
  </a>
  <a class="nav-link"
     routerLink="/students"
     routerLinkActive="nav-link--active">
    Estudiantes
  </a>
</nav>
```

Cuando la URL sea `/students`, Angular añade `nav-link--active` al `<a>` de Estudiantes y lo retira del de Inicio.

---

#### Paso 2.4. Estilo para el enlace activo

Añadir al final de **`header.css`** la clase que `RouterLinkActive` aplicará:

```css
/*
  Clase que RouterLinkActive añade cuando la ruta del enlace coincide con la URL.
  Subrayado rojo = indicador visual del enlace activo.
*/
.nav-link--active {
  color: white;
  border-bottom-color: #e74c3c; /* Activa el subrayado que estaba transparente */
  font-weight: 600;
}
```

Con `border-bottom-color` solo se cambia el color del borde que ya existía; el layout no se desplaza.


![alt text](assets/paso2.4.png)

---

#### Paso 2.5. Corregir la coincidencia del enlace de Inicio

**El problema:** `RouterLinkActive` usa coincidencia parcial por defecto. La URL `/students` contiene el prefijo `/`, así que el enlace de Inicio también aparece activo cuando se está en `/students`.

**La solución:** `[routerLinkActiveOptions]="{ exact: true }"` exige que la URL sea exactamente `/` para aplicar la clase activa.

**Actualizar solo el `<a>` de Inicio en `header.html`:**

```html
<nav class="app-header__nav">
  <!--
    [routerLinkActiveOptions]="{ exact: true }" → solo activo cuando la URL es exactamente "/".
    Sin esto, "/" estaría activo también en /students, /profile, etc.
  -->
  <a class="nav-link"
     routerLink="/"
     routerLinkActive="nav-link--active"
     [routerLinkActiveOptions]="{ exact: true }">
    Inicio
  </a>

  <!-- Estudiantes no necesita exact: "/students" no es prefijo de ninguna otra ruta. -->
  <a class="nav-link"
     routerLink="/students"
     routerLinkActive="nav-link--active">
    Estudiantes
  </a>
</nav>
```
![alt text](assets/paso2.5.png)
**Resumen de las directivas usadas en el header:**

| Directiva | Para qué sirve |
|-----------|----------------|
| `routerLink` | Navega a la ruta indicada sin recargar la página. |
| `routerLinkActive` | Añade la clase CSS cuando la ruta del enlace coincide con la URL activa. |
| `[routerLinkActiveOptions]` | Controla si la coincidencia es parcial (`exact: false`, por defecto) o exacta (`exact: true`). |

---

### Paso 3. Actualizar `app.ts` y `app.html` como shell global

El componente raíz `App` actúa como contenedor permanente de la aplicación. Aloja el header y footer globales y delega el contenido de cada ruta a `<router-outlet>`.

#### `app.ts`

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './components/header/header';
import { AppFooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'ppw-angular-21';
}
```

**¿Qué hace cada import?**
- `RouterOutlet` — Directiva que actúa como marcador de posición dinámico. Angular reemplaza su posición con el componente correspondiente a la URL activa.
- `AppHeaderComponent` — Header global con brand + nav. Al declararlo aquí, aparece en **todas** las páginas.
- `AppFooterComponent` — Footer global (reutilizado del módulo 02).

#### `app.html`

```html
<!-- Header global: visible en todas las rutas -->
<app-header />

<!-- Contenedor del contenido principal de cada página -->
<main class="app-shell">
  <!--
    router-outlet: marcador donde Angular inserta el componente
    de la ruta activa. Se reemplaza al navegar entre páginas.
  -->
  <router-outlet />
</main>

<!-- Footer global: visible en todas las rutas -->
<app-footer />
```

#### `app.css`

> Ver archivo: [files/app.css](files/app.css)

**¿Por qué este patrón?**
-  **Header y footer en el shell** garantiza que aparezcan en todas las páginas sin repetir código en cada componente de ruta.
-  **`max-width` centrado** mejora la legibilidad en pantallas anchas.
-  **`min-height`** mantiene el footer pegado al fondo aunque la página tenga poco contenido.

![alt text](assets/paso4.png)
---

### Paso 4. Crear `HomePage`

La `HomePage` es la vista de inicio. Muestra el `AppHeroComponent` del módulo 02 y un botón que navega programáticamente a la página de estudiantes usando el servicio `Router`.

#### `home-page.ts`

```ts
  // inject() inyecta el servicio Router sin necesitar el constructor
  private router = inject(Router);

  /**
   * Navega programáticamente a /students.
   * Se llama desde el template con (click)="goToStudentsPage()".
   */
  goToStudentsPage(): void {
    this.router.navigate(['/students']);
  }

```

**¿Qué hace cada parte?**

| Elemento | Descripción |
|----------|-------------|
| `inject(Router)` | Función moderna de Angular para inyectar servicios. Alternativa al constructor: `constructor(private router: Router)`. |
| `router.navigate(['/students'])` | Navegación programática. El array permite componer rutas con segmentos: `['/students', id]` produce `/students/42`. |
| `goToStudentsPage()` | Método público del componente, llamable desde el template con event binding. |

**¿Por qué `navigate()` y no `routerLink`?**
- `routerLink` es **declarativo**: se pone directamente en el template en `<a>` o `<button>`.
- `router.navigate()` es **programático**: se llama desde TypeScript cuando la navegación depende de lógica (validaciones, carga de datos, guards, etc.).
- En este caso ambas funcionarían, pero `navigate()` ilustra el patrón que se usa frecuentemente con formularios y guards.

#### `home-page.html`

```html
<section class="home-page">

  <!-- Componente hero reutilizado del módulo 02 -->
  <app-hero />

  <!-- Contenedor de acciones de la página -->
  <div class="home-page__actions">
    <!--
      (click) → event binding: cuando el usuario hace clic,
      Angular llama al método goToStudentsPage() del componente.
    -->
    <button class="btn-primary" (click)="goToStudentsPage()">
      Ver Estudiantes →
    </button>
  </div>

</section>
```

#### `home-page.css`

> Ver archivo: [files/home-page.css](files/home-page.css)

**¿Qué hace cada regla?**
- `flex-direction: column; gap: 2rem` — Apila verticalmente el hero y las acciones con espacio generoso entre ellos.
- `justify-content: center` — Centra el botón sin necesitar `margin: auto`.
- `transition: background-color 0.2s` — Suaviza el cambio de color al hacer hover.
- `#9a0024` — Variante oscura del rojo Angular para el estado hover, manteniendo identidad visual.

---

### Paso 5. Crear `StudentsPage`

Lista de estudiantes con enlaces declarativos a su detalle. Cada componente tiene su propio archivo TS, HTML y CSS.

#### `students-page.ts`

```ts

  readonly students = signal([
    { id: 1, name: 'Ana Ruiz' },
    { id: 2, name: 'Carlos Vega' },
    { id: 3, name: 'Marta León' },
  ]);

```

**¿Qué hace cada parte?**
- `RouterLink` en `imports` — Necesario para usar `[routerLink]` en los `<a>` del template.
- `signal([...])` — Array reactivo: si se actualiza (ej. tras una llamada HTTP), Angular re-renderiza la lista automáticamente.
- `readonly` — Previene que el signal sea reasignado desde fuera del componente.

#### `students-page.html`

```html
<section class="students-page">
  <h1 class="students-page__title">Estudiantes</h1>
  <p class="students-page__subtitle">Selecciona un estudiante para ver su detalle.</p>

  <ul class="students-list">

    <!--
      @for itera el signal students().
      track student.id: usa el ID como clave única para optimizar el DOM.
    -->
    @for (student of students(); track student.id) {
      <li class="students-list__item">
        <!--
          [routerLink]="['/students', student.id]" → property binding con array.
          Angular concatena los segmentos: produce /students/1, /students/2, etc.
        -->
        <a [routerLink]="['/students', student.id]">
          {{ student.name }}
        </a>
      </li>

    } @empty {
      <!-- Se renderiza automáticamente cuando students() tiene longitud 0 -->
      <li class="students-empty">No hay estudiantes disponibles.</li>
    }

  </ul>
</section>
```

#### `students-page.css`

> Ver archivo: [files/students-page.css](files/students-page.css)

**¿Qué hace cada regla clave?**
- `list-style: none; padding: 0` — Quita el bullet y el padding por defecto del `<ul>`.
- `display: block` en el `<a>` — Toda la fila del ítem es área de clic, no solo el texto.
- `transition: background 0.2s` — Animación suave al pasar el cursor.
- `.students-empty { font-style: italic }` — Distingue visualmente el mensaje vacío.

![alt text](assets/paso5.png)

---

### Paso 6. Crear `StudentDetailPage`

Vista de detalle para un estudiante concreto, identificado por el parámetro `:id` de la URL.

#### `student-detail-page.ts`

```ts
  // ActivatedRoute contiene información de la ruta activa: params, queryParams, data, etc.
  private route = inject(ActivatedRoute);

  // snapshot: estado de la ruta en el momento de creación del componente.
  // paramMap.get('id'): lee el segmento dinámico :id definido en app.routes.ts.
  readonly id = this.route.snapshot.paramMap.get('id');

```

**¿Qué hace cada parte?**

| Elemento | Descripción |
|----------|-------------|
| `inject(ActivatedRoute)` | Inyecta el servicio con los datos de la ruta activa (parámetros, query params, fragmentos). |
| `route.snapshot` | Captura el estado de la ruta en el momento de creación. Suficiente cuando el componente no necesita reaccionar a cambios de parámetros mientras está activo. |
| `.paramMap.get('id')` | Lee el valor del segmento dinámico `:id`. Si la URL es `/students/42`, retorna `'42'`. |
| `RouterLink` en `imports` | Necesario para usar `routerLink` en el enlace "Volver". |

#### `student-detail-page.html`

```html
<section class="detail-page">
  <h1 class="detail-page__title">Detalle del estudiante</h1>

  <!--
    id es una propiedad de la clase, leída con ActivatedRoute.
    {{ id }} muestra el valor del parámetro :id de la URL.
  -->
  <p class="detail-page__id">
    ID recibido por la ruta: <strong>{{ id }}</strong>
  </p>

  <!--
    routerLink="/students" → enlace de retorno al listado.
    No recarga la página: Angular intercepta el clic y navega internamente.
  -->
  <a class="btn-back" routerLink="/students">
    ← Volver al listado
  </a>
</section>
```

#### `student-detail-page.css`

> Ver archivo: [files/student-detail-page.css](files/student-detail-page.css)

**¿Qué hace cada regla clave?**
- `border-left: 4px solid #c3002f` — Acento que destaca el dato principal sin un fondo llamativo.
- `width: fit-content` — Evita que el botón (dentro de un flex container) ocupe todo el ancho.
- `transition: background, color` — "Fill effect" suave: fondo transparente → rojo sólido al hacer hover.

**¿Por qué este patrón?**
-  **`ActivatedRoute` con `snapshot`** es suficiente cuando el ID no cambia mientras el componente está activo.
-  **`routerLink` en el enlace de retorno** mantiene la navegación consistente sin recargar la página.
-  **CSS `border-left`** es una técnica común para destacar datos clave sin sobrecargar visualmente.
[text](03-navegacion-practica.md) ![text](assets/paso6.png)
---

## 7. Validaciones esperadas

- `/` renderiza `HomePage` con `AppHeroComponent` y el botón "Ver Estudiantes".
- El botón "Ver Estudiantes" llama a `goToStudentsPage()` y navega a `/students` sin recargar.
- `/students` muestra el listado de 3 estudiantes con enlaces.
- `/students/1` muestra el detalle con `ID: 1`.
- Si escribes una URL inválida, redirige a `/`.
- Header y footer aparecen en **todas** las páginas (están en el shell).
- El enlace activo en la nav tiene subrayado rojo (`nav-link--active`).

---

## 8. Entregables

1. `app.html` con shell global: `<app-header />`, `<router-outlet />`, `<app-footer />`.
2. `AppHeaderComponent` actualizado con `<nav>` y `RouterLinkActive`.
3. `HomePage` con `goToStudentsPage()` usando `Router.navigate()`.
4. `StudentsPage` con archivos TS + HTML + CSS separados.
5. `StudentDetailPage` con archivos TS + HTML + CSS separados y `ActivatedRoute`.

---

## 9. Commits sugeridos

```bash
git add .
git commit -m "END: Practica 03 - Navegacion completada"
```

