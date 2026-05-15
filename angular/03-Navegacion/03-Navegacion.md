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

`routerLink` es la directiva de Angular que intercepta el clic en un enlace y navega internamente sin recargar la página. Para que funcione debe declararse en el array `imports` del componente que lo usa.

```ts
imports: [RouterLink]
```

---

### Sintaxis directa (string)

```html
<a routerLink="/students">Estudiantes</a>
<a routerLink="/">Inicio</a>
```

Se usa cuando la ruta es un literal conocido en tiempo de escritura. Angular asigna el string como destino del enlace directamente.

**Características:**
- No necesita corchetes `[]` porque no es una expresión TypeScript, es un valor estático.
- Equivale a un `href` de HTML, pero sin recargar la página.
- Siempre usa rutas absolutas desde la raíz con `/`.

| Sintaxis | Resultado |
|----------|----------|
| `routerLink="/students"` | Navega a `/students` |
| `routerLink="/"` | Navega a la raíz `/` |

---

### Sintaxis con binding (array)

```html
<a [routerLink]="['/students', student.id]">Ver detalle</a>
```

Se usa cuando la ruta contiene segmentos dinámicos (variables) o se construye en tiempo de ejecución. Los corchetes `[]` indican que el valor es una expresión TypeScript evaluada, no un string literal.

**Cómo se interpreta el array:**

Angular concatena los segmentos del array para formar la URL final:

| Array | URL generada |
|-------|--------------|
| `['/students']` | `/students` |
| `['/students', 1]` | `/students/1` |
| `['/students', student.id]` | `/students/42` (si `student.id === 42`) |
| `['/users', userId, 'profile']` | `/users/5/profile` |

**Comparación entre ambas sintaxis:**

| Aspecto | `routerLink="/ruta"` | `[routerLink]="['/ruta', id]"` |
|---------|----------------------|--------------------------------|
| Tipo de valor | String estático | Expresión TypeScript |
| Rutas dinámicas | ❌ No | ✅ Sí |
| Requiere `[]` | No | Sí |
| Uso típico | Barra de navegación | Listados, botones con ID |

---

### routerLinkActive

`routerLinkActive` observa la URL activa y añade automáticamente la clase CSS indicada al elemento cuando su `routerLink` coincide con la URL actual.

```html
<a routerLink="/students" routerLinkActive="nav-link--active">Estudiantes</a>
```

Cuando la URL es `/students`, Angular añade la clase `nav-link--active` al `<a>`. Cuando la URL cambia a otra cosa, la elimina.

**No hay que escribir ninguna lógica TypeScript**: `routerLinkActive` detecta el cambio de URL automáticamente.

**El problema de la coincidencia parcial:**

Por defecto, `routerLinkActive` usa coincidencia parcial: un enlace con `routerLink="/"` estaría activo en **todas** las rutas porque `/` está contenida en `/students`, `/profile`, etc.

```html
<!--  Sin exact: el enlace de Inicio estará activo en todas las rutas -->
<a routerLink="/" routerLinkActive="active">Inicio</a>

<!--  Con exact: solo activo cuando la URL es exactamente / -->
<a routerLink="/"
   routerLinkActive="active"
   [routerLinkActiveOptions]="{ exact: true }">
  Inicio
</a>
```

**`[routerLinkActiveOptions]`:**

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `exact: true` | boolean | La URL debe coincidir exactamente, no solo como prefijo. Necesario para rutas raíz (`/`). |
| `exact: false` | boolean | (Por defecto) Activo si la URL empieza con el path del enlace. |

**Ejemplo completo de barra de navegación:**

```html
<nav>
  <a
    routerLink="/"
    routerLinkActive="nav-link--active"
    [routerLinkActiveOptions]="{ exact: true }">
    Inicio
  </a>
  <a
    routerLink="/students"
    routerLinkActive="nav-link--active">
    Estudiantes
  </a>
</nav>
```

```css
/* La clase añadida por routerLinkActive puede tener cualquier nombre */
.nav-link--active {
  color: white;
  border-bottom: 2px solid #c3002f;
  font-weight: 600;
}
```

**Para que `routerLinkActive` funcione**, debe declararse en `imports`:

```ts
imports: [RouterLink, RouterLinkActive]
```

---

## 9. Parámetros de ruta y ActivatedRoute

Los parámetros de ruta permiten reutilizar un mismo componente para distintas entidades. En lugar de crear una ruta por cada estudiante, se define una sola ruta con un segmento dinámico (`:id`) y Angular pasa el valor concreto al componente cuando se navega a ella.

### Definir un parámetro en la ruta

Un parámetro se declara con `:` seguido del nombre que se le quiere dar:

```ts
{ path: 'students/:id', component: StudentDetailPage }
```

| Parte | Significado |
|-------|-------------|
| `students/` | Segmento fijo de la URL |
| `:id` | Segmento dinámico: acepta cualquier valor (`1`, `42`, `'abc'`) |

Ejemplos de URLs que activan esta ruta:

| URL | Valor de `:id` |
|-----|----------------|
| `/students/1` | `'1'` |
| `/students/42` | `'42'` |
| `/students/ana-ruiz` | `'ana-ruiz'` |

> ⚠️ El valor siempre llega como **string**, incluso si el segmento parece un número. Convertir con `Number(id)` o `parseInt(id)` si se necesita operar aritméticamente.

---

### ActivatedRoute: leer el parámetro en el componente

`ActivatedRoute` es el servicio de Angular que expone toda la información de la ruta activa: parámetros, query params, fragmentos, datos estáticos, etc.

```ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-detail-page',
  templateUrl: './student-detail-page.html',
})
export class StudentDetailPage {
  private route = inject(ActivatedRoute);

  // snapshot: estado de la ruta en el momento de creación del componente.
  // paramMap: mapa de parámetros de la ruta.
  // .get('id'): lee el valor del parámetro cuyo nombre coincide con ':id' en app.routes.ts.
  readonly id = this.route.snapshot.paramMap.get('id'); // string | null
}
```

**Propiedades de `ActivatedRoute` más usadas:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `snapshot.paramMap` | `ParamMap` | Mapa de parámetros de la ruta en el momento de creación |
| `snapshot.queryParamMap` | `ParamMap` | Mapa de query params (`?clave=valor`) |
| `snapshot.fragment` | `string \| null` | Fragmento de la URL (`#seccion`) |
| `snapshot.data` | `object` | Datos estáticos definidos en `data: {}` de la ruta |

**Métodos de `ParamMap`:**

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `.get('nombre')` | `string \| null` | Valor del parámetro o `null` si no existe |
| `.has('nombre')` | `boolean` | `true` si el parámetro existe en la URL |
| `.getAll('nombre')` | `string[]` | Todos los valores (útil con query params multivaluados) |

---

### Ejemplo completo: pasar y leer un ID

**En la ruta del listado** (usando binding array para incluir el ID):

```html
<!-- students-page.html -->
@for (student of students(); track student.id) {
  <li>
    <a [routerLink]="['/students', student.id]">{{ student.name }}</a>
  </li>
}
```

**En el componente de detalle** (leyendo el ID con `ActivatedRoute`):

```ts
export class StudentDetailPage {
  private route = inject(ActivatedRoute);

  readonly id = this.route.snapshot.paramMap.get('id'); // '1', '2', etc.
}
```

```html
<!-- student-detail-page.html -->
<p>Estudiante con ID: <strong>{{ id }}</strong></p>
```

**Flujo completo:**

```
/students/42
    ↓
Angular busca en routes: { path: 'students/:id' }
    ↓
Instancia StudentDetailPage
    ↓
ActivatedRoute.snapshot.paramMap.get('id') → '42'
```

---

### `snapshot` vs observable de params

| Enfoque | Cuándo usarlo |
|---------|---------------|
| `snapshot.paramMap.get('id')` | El componente se destruye y se recrea al navegar entre IDs (caso más común en páginas de detalle). |
| `route.paramMap` (Observable) | El componente se **reutiliza** sin destruirse al cambiar el parámetro (rutas anidadas complejas). |

En páginas de detalle simples como `StudentDetailPage`, `snapshot` es siempre suficiente.

---

## 10. Navegación programática con Router

`routerLink` es declarativo: se escribe en el HTML y Angular navega cuando el usuario hace clic. La navegación **programática** en cambio se dispara desde TypeScript, cuando la ruta de destino depende de lógica del componente.

**Casos típicos donde se usa `Router.navigate()`:**
- Redirigir tras enviar un formulario con éxito.
- Navegar solo si el usuario cumple una condición (validación, rol, etc.).
- Navegar después de una operación asíncrona (carga de datos, login, etc.).
- Componer la ruta destino con valores calculados en TypeScript.

### `inject()` — inyección funcional de servicios

`inject()` es la función moderna de Angular para obtener una instancia de un servicio dentro de la clase de un componente, sin necesidad de declarar un constructor:

```ts
// Forma moderna (Angular 14+)
private router = inject(Router);

// Forma clásica equivalente
constructor(private router: Router) {}
```

Ambas formas producen el mismo resultado. `inject()` es preferida en proyectos actuales porque:
- No requiere constructor cuando el componente no necesita inicialización adicional.
- Es más legible cuando se inyectan varios servicios.
- Funciona fuera del constructor en contextos de inicialización de propiedades.

### Uso de `Router.navigate()`

```ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-example',
  templateUrl: './example.html',
})
export class ExampleComponent {
  private router = inject(Router);

  // Navega a /students
  goToStudents(): void {
    this.router.navigate(['/students']);
  }

  // Navega a /students/42 (ruta con parámetro)
  goToDetail(id: number): void {
    this.router.navigate(['/students', id]);
  }
}
```

`navigate()` recibe el mismo tipo de array que `[routerLink]`: los segmentos se concatenan para formar la URL final.

| Array en `navigate()` | URL resultante |
|-----------------------|----------------|
| `['/students']` | `/students` |
| `['/students', 42]` | `/students/42` |
| `['/students', id, 'edit']` | `/students/5/edit` |

### ¿Qué más puede hacer el servicio `Router`?

Además de `navigate()`, el servicio `Router` expone otras capacidades útiles:

| Miembro | Descripción |
|---------|-------------|
| `router.navigate([...])` | Navega a una ruta por array de segmentos. |
| `router.navigateByUrl('/ruta')` | Navega a una URL completa como string. |
| `router.url` | Propiedad que retorna la URL activa en ese momento. |
| `router.events` | Observable que emite eventos del ciclo de navegación (`NavigationStart`, `NavigationEnd`, etc.). Útil para mostrar loaders globales. |

> En módulos posteriores (guards, formularios) se usará `router.navigate()` con frecuencia para controlar el flujo de la aplicación desde TypeScript.

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
