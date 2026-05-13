# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 02. Fundamentos de Angular

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. ¿Qué es Angular?

Angular es un framework de desarrollo web de código abierto mantenido por Google, diseñado para construir aplicaciones web modernas basadas en componentes. Está orientado principalmente a la capa de presentación dentro de una arquitectura cliente-servidor y facilita la construcción de interfaces dinámicas que consumen servicios y APIs REST.

Angular utiliza TypeScript como lenguaje principal y proporciona una estructura completa que incluye:

- Sistema de componentes reutilizables
- Inyección de dependencias
- Enrutamiento
- Manejo de formularios
- Comunicación con servicios HTTP
- Herramientas de compilación y optimización

Angular permite desarrollar tanto Single Page Applications (SPA) como aplicaciones con renderizado del lado del servidor (SSR) y arquitecturas híbridas.

---

## 2. Características principales de Angular 21

1. **Componentes**: Arquitectura basada en componentes donde cada uno representa una parte reutilizable de la interfaz con su propia lógica y estilo.

2. **Signals**: Sistema de reactividad que notifica automáticamente los cambios en los datos, actualizando la interfaz sin detectores de cambios manuales.

3. **Control de flujo moderno**: Nueva sintaxis declarativa (`@if`, `@for`, `@switch`) más legible y eficiente que las directivas estructurales tradicionales.

4. **Inyección de dependencias**: Sistema que facilita la gestión y reutilización de servicios en toda la aplicación.

5. **Enrutamiento**: Sistema que permite la navegación entre diferentes vistas según la URL solicitada.

6. **Angular CLI**: Herramienta de línea de comandos para crear, construir y mantener proyectos Angular de manera consistente.

| Característica | Enfoque en Angular 21 |
|---|---|
| Componentes | Standalone por defecto (sin NgModule) |
| Reactividad | Signals (`signal`, `computed`, `effect`) |
| Control de flujo | `@if`, `@for`, `@switch` |
| Router | `provideRouter(routes)` en `app.config.ts` |
| Estilos | CSS / SCSS por componente |

---

## 3. Elementos Fundamentales de Angular

| Elemento | Descripción | Archivo típico |
|----------|-------------|----------------|
| **Componentes** | Bloques principales de la interfaz. Cada vista o sección visual se define en un componente. | `nombre.ts` |
| **Templates (HTML)** | Define la estructura visual: etiquetas, textos, bindings y directivas. | `nombre.html` |
| **Estilos (CSS)** | Define los estilos aplicados al componente, con alcance local. | `nombre.css` |
| **Servicios** | Contienen lógica reutilizable o comunicación con APIs. Se inyectan en componentes. | `nombre.service.ts` |
| **Pipes** | Transforman datos en las vistas (fechas, mayúsculas, moneda, etc.). | `nombre.pipe.ts` |
| **Interfaces** | Definen la estructura de los datos para mantener tipado fuerte. | `nombre.interface.ts` |

---

## 4. Tipos de Componentes

Angular organiza los componentes en diferentes tipos según su propósito dentro de la arquitectura:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Page** | Componente principal que representa una vista completa, asociado directamente a una ruta. | `home-page.ts` |
| **Layout** | Contenedor que organiza la estructura general de la aplicación (header, sidebar, footer). | `main-layout.ts` |
| **Component** | Parte reutilizable dentro de una página o layout (botón, tarjeta, lista, etc.). | `card-user.ts` |

> Todos son componentes técnicamente. La diferencia es conceptual y organizativa: un proyecto Angular moderno combina layouts, pages y componentes reutilizables interconectados.

---

## 5. Componentes

### ¿Qué es un componente?

Un **componente** en Angular es la unidad fundamental de construcción de la interfaz. Cada componente encapsula tres partes:

1. **Clase TypeScript**: Define la lógica, el estado y el comportamiento del componente.
2. **Plantilla HTML**: Define la estructura y el diseño visual que se renderiza en el navegador.
3. **Estilos CSS**: Define la apariencia visual del componente con alcance local (no afecta a otros componentes).

Un componente se declara con el decorador `@Component`, que conecta la clase con su plantilla y sus estilos, y define su **selector**: la etiqueta HTML personalizada con la que se usa.

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePageComponent {
  title = signal('Angular 21');
}
```

```html
<!-- home-page.html -->
<h1>{{ title() }}</h1>
```

---

### Creación de componentes con Angular CLI

Angular CLI genera automáticamente todos los archivos de un componente. El comando es `ng generate component` en su forma larga, o `ng g c` en su forma corta:

**Forma larga:**

```bash
ng generate component features/home/pages/home-page
ng generate component features/home/components/header
ng generate component features/home/components/hero
```

**Forma corta:**

```bash
ng g c features/home/pages/home-page
ng g c features/home/components/header
ng g c features/home/components/hero
```

**Opciones útiles:**

| Opción | Descripción |
|--------|-------------|
| `--skip-tests` | No genera el archivo `.spec.ts` de pruebas |
| `--flat` | No crea subcarpeta; coloca los archivos en el directorio indicado |
| `--inline-template` | Define el HTML inline dentro de la clase (sin archivo separado) |
| `--inline-style` | Define los estilos inline dentro de la clase (sin archivo separado) |

```bash
# Ejemplo con opciones
ng g c features/home/pages/home-page --skip-tests
```

El comando genera automáticamente los siguientes archivos:

```
home-page/
├── home-page.ts          ← Clase del componente
├── home-page.html        ← Plantilla HTML
├── home-page.css         ← Estilos
└── home-page.spec.ts     ← Pruebas (omitido con --skip-tests)
```

---

### El decorador @Component

El decorador `@Component` transforma una clase TypeScript en un componente Angular y define su comportamiento:

```typescript
import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../components/header/header';
import { HeroComponent } from '../components/hero/hero';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  imports: [HeaderComponent, HeroComponent]
})
export class HomePageComponent {
  title = signal('Angular 21');
}
```

#### Propiedades del @Component

| Propiedad | Descripción |
|-----------|-------------|
| `selector` | Etiqueta HTML personalizada con la que se usa el componente en otros templates. Ejemplo: `<app-home-page>`. |
| `templateUrl` | Ruta del archivo HTML que define la estructura visual del componente. |
| `template` | Permite definir el HTML inline, como alternativa a `templateUrl`. |
| `styleUrl` | Ruta del archivo CSS con los estilos del componente. |
| `styleUrls` | Array de rutas de estilos (cuando se usan múltiples archivos). |
| `imports` | Lista de componentes, directivas o pipes que este componente necesita en su template. |

#### El selector

```typescript
selector: 'app-home-page'
```

Permite usar el componente en otros templates como una etiqueta HTML personalizada:

```html
<app-home-page></app-home-page>
```

Cuando Angular encuentra esa etiqueta, renderiza el template y ejecuta la lógica definidos en el componente.

#### La propiedad imports

Para usar otros componentes, directivas o pipes dentro del template, deben declararse en `imports`:

```typescript
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  imports: [HeaderComponent, HeroComponent]
})
export class HomePageComponent { }
```

```html
<!-- home-page.html -->
<app-header></app-header>
<app-hero></app-hero>
```

---

## 6. El archivo app.routes.ts

Cuando se crea un proyecto Angular con soporte de enrutamiento, el CLI genera automáticamente el archivo `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [];
```

### Anatomía del archivo

#### Importación de `Routes`

```typescript
import { Routes } from '@angular/router';
```

`Routes` es un tipo (alias de TypeScript) que representa un array de objetos de configuración de ruta. Viene del paquete `@angular/router`, el módulo oficial de enrutamiento de Angular.

#### La constante `routes`

```typescript
export const routes: Routes = [];
```

| Parte | Descripción |
|-------|-------------|
| `export` | Permite que otros archivos (como `app.config.ts`) importen esta constante |
| `const routes` | Nombre de la constante que contiene la configuración de rutas |
| `: Routes` | Tipado: indica que es un array de objetos `Route` |
| `= []` | Comienza vacío; aquí se definen las rutas de la aplicación |

#### Cómo se registra en la aplicación

El array `routes` se pasa a `provideRouter()` dentro de `app.config.ts`, lo que registra el sistema de enrutamiento en toda la aplicación:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

#### Estructura de un objeto de ruta

Cada entrada del array `routes` es un objeto con al menos dos propiedades:

```typescript
{
  path: 'ruta-en-url',
  component: ComponenteAMostrar
}
```

| Propiedad | Descripción |
|-----------|-------------|
| `path` | Fragmento de URL que activa esta ruta. `''` representa la raíz (`/`). |
| `component` | Componente que Angular renderiza cuando la URL coincide con `path`. |
| `redirectTo` | En lugar de renderizar un componente, redirige a otra ruta. |
| `children` | Array de rutas hijas (rutas anidadas). |

#### Ejemplo con rutas definidas

```typescript
import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

- `path: ''` → coincide con la URL raíz (`http://localhost:4200/`)
- `path: '**'` → comodín que captura cualquier URL no definida y redirige a la raíz

#### El `router-outlet`

Para que Angular sepa dónde insertar el componente activo, el template raíz debe incluir la directiva `<router-outlet>`:

```html
<!-- app.html -->
<router-outlet></router-outlet>
```

`<router-outlet>` actúa como un marcador de posición dinámico: Angular reemplaza su contenido con el componente que corresponde a la URL actual.

**Flujo completo:**

1. El navegador accede a una URL (ej. `http://localhost:4200/`)
2. Angular lee `routes` y busca el `path` que coincide
3. Instancia el componente asociado a esa ruta
4. Lo inserta en el `<router-outlet>` del template raíz

---

## 7. Directivas y Control de Flujo

Las directivas permiten que Angular gestione el DOM de manera reactiva sin manipulación directa. En Angular 21, el control de flujo se expresa con una sintaxis declarativa basada en `@`.

### Tipos de directivas

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Estructurales** | Alteran la estructura del DOM, añadiendo o eliminando elementos. | `@if`, `@for`, `@switch` |
| **De atributo** | Modifican la apariencia o el comportamiento de elementos existentes. | `[ngClass]`, `[ngStyle]`, `[class]`, `[style]` |
| **Componentes** | Directivas con template y lógica asociada. | Cualquier `@Component({...})` |

---

### @if — Renderizado condicional

```html
@if (isLoggedIn()) {
  <p>Bienvenido, {{ username() }}</p>
} @else if (isGuest()) {
  <p>Eres un invitado</p>
} @else {
  <p>Por favor, inicia sesión</p>
}
```

**Sintaxis:**

| Bloque | Descripción |
|--------|-------------|
| `@if (condición) { ... }` | Renderiza el bloque si la condición es verdadera |
| `@else if (condición) { ... }` | Condición alternativa |
| `@else { ... }` | Bloque por defecto si ninguna condición se cumple |

---

### @for — Iteración sobre listas

```html
@for (usuario of usuarios(); track usuario.id) {
  <div class="card">
    <h3>{{ usuario.nombre }}</h3>
    <p>{{ usuario.email }}</p>
  </div>
} @empty {
  <p>No hay usuarios disponibles</p>
}
```

**Sintaxis:**

| Bloque | Descripción |
|--------|-------------|
| `@for (item of lista; track id) { ... }` | Itera sobre los elementos de la lista |
| `track` | **Obligatorio.** Identifica cada elemento de forma única para optimizar el renderizado |
| `@empty { ... }` | Se muestra cuando la lista está vacía |

**Variables de contexto disponibles en `@for`:**

| Variable | Descripción |
|----------|-------------|
| `$index` | Índice del elemento actual (comienza en 0) |
| `$first` | `true` si es el primer elemento |
| `$last` | `true` si es el último elemento |
| `$even` | `true` si el índice es par |
| `$odd` | `true` si el índice es impar |
| `$count` | Total de elementos en la lista |

```html
@for (item of items(); track item.id; let i = $index, let first = $first) {
  <p>{{ i }}: {{ item.name }} {{ first ? '(primero)' : '' }}</p>
}
```

---

### @switch — Selección por casos

```html
@switch (userRole()) {
  @case ('admin') {
    <admin-dashboard></admin-dashboard>
  }
  @case ('user') {
    <user-dashboard></user-dashboard>
  }
  @default {
    <p>Rol no reconocido</p>
  }
}
```

**Sintaxis:**

| Bloque | Descripción |
|--------|-------------|
| `@switch (expresión) { ... }` | Evalúa la expresión |
| `@case (valor) { ... }` | Bloque para un valor específico |
| `@default { ... }` | Bloque si ningún caso coincide |

`@switch` es preferible a múltiples `@if` encadenados cuando los estados son finitos y mutuamente excluyentes.

---

## 8. Pipes

Los **pipes** son funciones que transforman datos directamente en los templates, sin modificar el valor original en la clase. Se aplican con el operador `|`:

```html
{{ valor | nombrePipe }}
{{ valor | nombrePipe:argumento1:argumento2 }}
```

### Pipes integrados en Angular

| Pipe | Descripción | Ejemplo | Resultado |
|------|-------------|---------|-----------|
| `uppercase` | Convierte texto a mayúsculas | `{{ 'hola' | uppercase }}` | `HOLA` |
| `lowercase` | Convierte texto a minúsculas | `{{ 'HOLA' | lowercase }}` | `hola` |
| `date` | Formatea fechas | `{{ fecha | date:'dd/MM/yyyy' }}` | `13/05/2026` |
| `currency` | Formatea moneda | `{{ 1500 | currency:'USD' }}` | `$1,500.00` |
| `number` | Formatea números decimales | `{{ 3.14159 | number:'1.2-2' }}` | `3.14` |
| `percent` | Formatea porcentajes | `{{ 0.85 | percent }}` | `85%` |
| `slice` | Extrae una porción de string o array | `{{ 'Angular 21' | slice:0:7 }}` | `Angular` |
| `json` | Serializa un objeto a JSON (útil en depuración) | `{{ objeto | json }}` | `{"id":1,...}` |

### Ejemplos de uso

**Texto:**

```html
<p>{{ 'texto de ejemplo' | uppercase }}</p>
<!-- Resultado: TEXTO DE EJEMPLO -->

<p>{{ nombre() | lowercase }}</p>
```

**Fechas:**

```html
<p>{{ fechaNacimiento | date:'dd/MM/yyyy' }}</p>
<p>{{ fechaNacimiento | date:'long' }}</p>
```

**Moneda y números:**

```html
<p>{{ precio | currency:'USD' }}</p>
<p>{{ valor | number:'1.2-2' }}</p>
```

### Encadenamiento de pipes

Los pipes pueden encadenarse con múltiples operadores `|`. Angular aplica cada transformación de izquierda a derecha:

```html
{{ nombre() | uppercase | slice:0:10 }}
```

### Pipes con signals

Los pipes se integran directamente con signals:

```html
<p>{{ title() | uppercase }}</p>
<p>{{ precio() | currency:'USD' }}</p>
<p>{{ fechaActual() | date:'dd/MM/yyyy' }}</p>
```

---

## 9. Binding

El binding conecta la clase TypeScript con el template HTML. Existen cuatro tipos:

| Tipo | Sintaxis | Dirección | Descripción | Ejemplo |
|------|----------|-----------|-------------|---------|
| **Interpolación** | `{{ expresión }}` | TS → HTML | Inserta el valor de una expresión en el HTML | `{{ title() }}` |
| **Property binding** | `[propiedad]="valor"` | TS → HTML | Asigna un valor a una propiedad de un elemento | `[disabled]="isLoading()"` |
| **Event binding** | `(evento)="handler()"` | HTML → TS | Escucha un evento del DOM y ejecuta un método | `(click)="save()"` |
| **Two-way binding** | `[(ngModel)]="campo"` | TS ↔ HTML | Enlace bidireccional (usado en formularios) | `[(ngModel)]="name"` |

---

## 10. Signals

### ¿Qué son los Signals?

Un **signal** es un contenedor reactivo que guarda un valor y notifica automáticamente a Angular cuando ese valor cambia, provocando que la vista se actualice sin necesidad de `Observable`, `Subject` ni `ChangeDetectorRef`.

```typescript
import { signal } from '@angular/core';

export class MiComponente {
  title = signal('Angular 21');
  contador = signal(0);
  isVisible = signal(true);
}
```

**Para leer** el valor de un signal se invoca como función:

```html
<h1>{{ title() }}</h1>
```

```typescript
const valor = this.title(); // en TypeScript
```

### Crear signals

```typescript
// Tipos primitivos
nombre = signal('Juan');
edad = signal(30);
activo = signal(false);

// Array
usuarios = signal([
  { id: 1, nombre: 'Juan' },
  { id: 2, nombre: 'María' }
]);

// Objeto
perfil = signal({
  nombre: 'Carlos',
  email: 'carlos@example.com'
});
```

### Métodos para modificar signals

#### set(nuevoValor) — Reemplazar el valor

Reemplaza completamente el valor actual por uno nuevo, sin depender del valor anterior:

```typescript
nombre = signal('Juan');

cambiarNombre(): void {
  this.nombre.set('Ana');
}
```

**Cuándo usarlo:** cuando se quiere asignar un valor nuevo directamente.

#### update(fn) — Modificar basado en el valor actual

Actualiza el valor a partir del valor actual mediante una función callback:

```typescript
contador = signal(0);

incrementar(): void {
  this.contador.update(valor => valor + 1);
}

titulo = signal('Angular');

agregarVersion(): void {
  this.titulo.update(t => t + ' 21');
  // 'Angular' → 'Angular 21'
}
```

**Cuándo usarlo:** cuando el nuevo valor depende del valor anterior (incrementar, concatenar, transformar).

```typescript
// Más ejemplos
numero = signal(5);
duplicar(): void {
  this.numero.update(n => n * 2); // 5 → 10
}

lista = signal<string[]>([]);
agregarItem(item: string): void {
  this.lista.update(l => [...l, item]);
}
```

### Resumen de signals

```typescript
// CREAR
miSignal = signal(valorInicial);

// LEER
const valor = miSignal();    // en TypeScript
{{ miSignal() }}             // en HTML

// MODIFICAR
miSignal.set(nuevoValor);              // Reemplazar completamente
miSignal.update(val => val + 1);       // Modificar basado en el valor actual
```

---

## 11. computed — Valores derivados

`computed` crea un signal de solo lectura cuyo valor se recalcula automáticamente cuando cambian los signals de los que depende:

```typescript
import { signal, computed } from '@angular/core';

nombre = signal('Juan');
apellido = signal('Torres');

readonly nombreCompleto = computed(() => `${this.nombre()} ${this.apellido()}`);
```

```html
<p>{{ nombreCompleto() }}</p>
```

`computed` debe usarse para valores derivados puros, sin efectos secundarios. Evita duplicar lógica en métodos del template.

---

## 12. effect — Reaccionar a cambios

`effect` ejecuta una función cada vez que cambia alguno de los signals que lee. Se usa únicamente cuando existe un efecto lateral real (logs, analytics, sincronización con localStorage, etc.):

```typescript
import { effect } from '@angular/core';

constructor() {
  effect(() => {
    console.log('Nombre actualizado:', this.nombreCompleto());
  });
}
```

> Si no hay un efecto lateral real, usar `computed` en su lugar. `effect` no es un sustituto de la lógica reactiva general.

---

## 13. Buenas prácticas

- Usar `signal` para estado local simple y explícito.
- Usar `computed` para valores derivados; evitar métodos costosos en el template.
- Usar `effect` solo cuando haya un efecto lateral real.
- Incluir siempre `track` en `@for` con un identificador estable (como el `id`).
- Preferir `@switch` cuando los estados son finitos y excluyentes.
- Declarar signals como `readonly` en la clase para evitar reasignaciones accidentales fuera del componente.
- No omitir `@empty` en `@for` cuando la lista puede estar vacía.

---

## 14. Errores comunes

- Usar `effect` como sustituto de toda la lógica reactiva.
- Escribir métodos costosos en el template cuando basta un `computed`.
- Iterar con `@for` sin `track` estable.
- Encadenar múltiples `@if` cuando un `@switch` sería más claro.
- Olvidar declarar componentes usados en el template dentro de `imports`.

---

## 15. Referencias

- Documentación oficial de Angular: https://angular.dev
- Guía de Signals: https://angular.dev/guide/signals
- Control Flow moderno: https://angular.dev/guide/templates/control-flow
- Pipes integrados: https://angular.dev/guide/templates/pipes
- Angular CLI: https://angular.dev/tools/cli
