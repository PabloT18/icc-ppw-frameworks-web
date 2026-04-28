# Programación y Plataformas Web 

# Frameworks Web: Angular

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">

</div>


## 2 Fundamentos 

### Autores

**Pablo Torres**

[ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)

[pabloa_ec@hotmail.com](mailto:pabloa_ec@hotmail.com)

GitHub: [PabloT18](https://github.com/PabloT18)








## Fundamentos de Angular

## ¿Qué es Angular?

Angular es un framework de desarrollo web de código abierto mantenido por Google, diseñado para construir aplicaciones web modernas basadas en componentes. Está orientado principalmente a la capa de presentación dentro de una arquitectura cliente-servidor y facilita la construcción de interfaces dinámicas que consumen servicios y APIs REST.

Angular utiliza TypeScript como lenguaje principal y proporciona una estructura completa que incluye:

- Sistema de componentes reutilizables
- Inyección de dependencias
- Enrutamiento
- Manejo de formularios
- Comunicación con servicios HTTP
- Herramientas de compilación y optimización

En sus versiones actuales, Angular incorpora mejoras como:

- Componentes Standalone
- Sistema de reactividad basado en Signals
- Nueva sintaxis declarativa de control de flujo (@if, @for, @switch)
- Optimización avanzada de renderizado

Angular no solo permite desarrollar Single Page Applications (SPA), sino también aplicaciones con renderizado del lado del servidor (SSR) y arquitecturas híbridas.



## Características principales de Angular 21

1. **Componentes**: Angular utiliza una arquitectura basada en componentes, donde cada componente representa una parte reutilizable de la interfaz de usuario con su propia lógica y estilo.

2. **Signals (Señales)**: Sistema de reactividad que notifica automáticamente cambios en los datos, actualizando la interfaz sin necesidad de detectores de cambios manuales.

3. **Directivas Modernas**: Nueva sintaxis de control de flujo (@if, @for, @switch) que es más declarativa y eficiente que las directivas estructurales tradicionales.

4. **Inyección de Dependencias**: Sistema que facilita la gestión y reutilización de servicios y componentes en toda la aplicación.

5. **Ruteo**: Sistema de enrutamiento que permite la navegación entre diferentes vistas y componentes dentro de una aplicación de una sola página.

6. **Angular CLI**: Herramienta de línea de comandos que facilita la creación, construcción y mantenimiento de proyectos Angular.

## Elementos Fundamentales de Angular

| Elemento | Descripción | Archivo típico |
|----------|-------------|----------------|
| **Componentes** | Bloques principales de la interfaz. Cada vista o sección visual se define en un componente. | `nombre-componente.ts` |
| **Templates (HTML)** | Define la estructura visual (etiquetas, textos, bindings, directivas). | `nombre-componente.html` |
| **Estilos (SCSS/CSS)** | Define los estilos aplicados al componente. Se pueden aplicar local o globalmente. | `nombre-componente.scss` |
| **Servicios (Services)** | Contienen lógica reutilizable o comunicación con APIs. Se inyectan en componentes. | `nombre.service.ts` |
| **Pipes** | Transforman datos en las vistas (por ejemplo, fechas o mayúsculas). | `nombre.pipe.ts` |
| **Interfaces** | Definen la forma (estructura) de los datos para mantener tipado fuerte. | `nombre.interface.ts` |

## Tipos de Estructura de Componentes

Angular 21 organiza los componentes en diferentes tipos según su propósito:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Page (Página)** | Un componente principal que representa una vista completa (por ejemplo, Home, Login, Dashboard). | `home-page.ts` |
| **Layout** | Contenedor que organiza la estructura general de la aplicación (por ejemplo, con header, sidebar, footer). | `main-layout.ts` |
| **Component** | Parte reutilizable dentro de una página o layout (botón, tarjeta, lista, etc.). | `card-user.ts` |

> **Nota**: Todos son componentes técnicamente. La diferencia es conceptual y organizativa. Un proyecto Angular moderno combina layouts, pages y componentes reutilizables, todos interconectados.

## Rutas

Angular utiliza un sistema de enrutamiento para gestionar la navegación entre diferentes vistas y componentes. Las rutas se definen en el archivo `app.routes.ts` y permiten cargar componentes específicos en función de la URL solicitada.

**Ejemplo de configuración de rutas:**

```typescript
import { Routes } from '@angular/router';
import { HomePageComponent } from './home/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  // {
  //   path: 'perfil',
  //   component: PerfilPageComponent
  // },
  {
    path: '**',
    redirectTo: ''
  }
];
```

## Directivas en Angular 21

Las directivas forman parte del mecanismo declarativo de la capa de presentación y permiten que Angular gestione el DOM de manera reactiva sin manipulación directa manual.

Las directivas son clases que permiten extender el comportamiento del DOM en Angular. Se aplican mediante selectores y permiten modificar estructura, estilo o comportamiento de los elementos HTML.


### Tipos de Directivas

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Estructurales** | Alteran la estructura del DOM (añaden o quitan elementos). | `@if`, `@for`, `@switch` |
| **De atributo** | Cambian la apariencia o comportamiento de un elemento existente. | `[ngClass]`, `[ngStyle]`, `[class]`, `[style]` |
| **Componentes** | Directivas con una plantilla y lógica asociada. | Cualquier `@Component({...})` |

### Control Flow Moderno con @ (Angular 21)

Angular 21 introduce una nueva sintaxis de control de flujo más declarativa y eficiente:

#### @if (Condicionales)

Reemplaza el antiguo `*ngIf` con una sintaxis más clara:

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
- `@if (condición) { ... }` - Renderiza el bloque si la condición es verdadera
- `@else if (condición) { ... }` - Condición alternativa
- `@else { ... }` - Bloque por defecto

#### @for (Iteración)

Reemplaza el antiguo `*ngFor` con mejor rendimiento:

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
- `@for (item of lista; track identificador) { ... }` - Itera sobre la lista
- `track` - Obligatorio, identifica cada elemento de manera única (mejora rendimiento)
- `@empty { ... }` - Se muestra cuando la lista está vacía

**Variables disponibles en @for:**
```html
@for (item of items(); track item.id; let idx = $index, let first = $first) {
  <p>{{ idx }}: {{ item.name }} {{ first ? '(primero)' : '' }}</p>
}
```

Variables: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`

#### @switch (Selección múltiple)

Reemplaza el antiguo `*ngSwitch`:

```html
@switch (userRole()) {
  @case ('admin') {
    <admin-dashboard></admin-dashboard>
  }
  @case ('user') {
    <user-dashboard></user-dashboard>
  }
  @case ('guest') {
    <guest-view></guest-view>
  }
  @default {
    <p>Rol no reconocido</p>
  }
}
```

**Sintaxis:**
- `@switch (expresión) { ... }` - Evalúa la expresión
- `@case (valor) { ... }` - Bloque para cada caso
- `@default { ... }` - Bloque por defecto

## Pipes

Los pipes en Angular son funciones que transforman los datos antes de mostrarlos en la vista. Se utilizan para formatear, filtrar o transformar valores en plantillas HTML de manera sencilla y reutilizable.

**Ejemplos de uso:**

Modificar el texto a mayúsculas:
```html
{{ 'texto de ejemplo' | uppercase }}
<!-- Resultado: TEXTO DE EJEMPLO -->
```

Formatear fechas:
```html
{{ fechaNacimiento | date:'dd/MM/yyyy' }}
```

Formatear números:
```html
{{ precio | currency:'USD' }}
```

Encadenar múltiples pipes:
```html
{{ nombre() | uppercase | slice:0:10 }}
```

## Componentes de Angular

Los componentes son la piedra angular de cualquier aplicación Angular. Cada componente consta de tres partes principales:

1. **Clase del Componente (TypeScript)**: Define la lógica y el comportamiento del componente.
2. **Plantilla HTML**: Define la estructura y el diseño de la interfaz de usuario del componente.
3. **Estilos (CSS/SCSS)**: Define la apariencia visual del componente, puede ser SCSS o cualquier otro preprocesador compatible.

### Cómo crear un componente

Para crear un componente en Angular, utilizamos Angular CLI con el comando `ng generate component` (o su forma corta `ng g c`):

```bash
# Crear un componente básico
ng generate component home/pages/home-page

# Forma corta
ng g c home/pages/home-page

# Si quieres un componente sin carpeta
ng g c perfil/pages/perfil-page --flat
```

Este comando genera automáticamente:
- `home-page.component.ts` - Clase del componente
- `home-page.component.html` - Plantilla HTML
- `home-page.component.scss` - Estilos
- `home-page.component.spec.ts` - Archivo de pruebas

### Configuración del Componente: @Component()

El decorador `@Component()` transforma una clase de TypeScript en un componente de Angular. Este decorador define cómo Angular debe comportarse con el componente.

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  // Lógica del componente
}
```

#### Propiedades del @Component

| Propiedad | Descripción |
|-----------|-------------|
| `selector` | Nombre con el que el componente se usa en HTML (por ejemplo `<app-home-page>`). Es como una etiqueta HTML personalizada. |
| `standalone` | En Angular 21, los componentes son standalone por defecto (no requieren módulos). |
| `imports` | Indica qué otros componentes, directivas o pipes puede usar este componente. |
| `templateUrl` | Ruta del archivo HTML asociado que define la estructura visual. |
| `template` | Permite definir HTML inline directamente (alternativa a templateUrl). |
| `styleUrl` | Ruta del archivo SCSS o CSS con los estilos (Angular 21 usa singular). |
| `styleUrls` | Array de rutas de estilos (versiones anteriores). |
| `changeDetection` | Controla cómo Angular detecta los cambios. `OnPush` mejora el rendimiento. |

#### selector: El identificador del componente

```typescript
selector: 'app-home-page'
```

Esto permite usar el componente en HTML:

```html
<app-home-page></app-home-page>
```

Es como decirle a Angular: *"Cada vez que veas `<app-home-page>`, renderiza el HTML y la lógica definidos en el componente HomePage."*

#### changeDetection: Optimización de rendimiento

```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```

- **OnPush**: Actualiza la vista solo cuando cambian las entradas (`@Input()`) o señales reactivas (`signal()`).
- **Ventajas**: Evita renders innecesarios, ideal para aplicaciones grandes o con muchos componentes.
- **Cuándo usar**: Siempre que uses signals, ya que se complementan perfectamente.


## Signals: Reactividad Moderna en Angular 21

### ¿Qué son las Signals?

Un **signal** es una variable reactiva que guarda un valor y notifica automáticamente a Angular cuando ese valor cambia, haciendo que la interfaz se actualice sin necesidad de usar Observable, Subject ni ChangeDetectorRef.

**Ventajas de usar Signals:**

1. **Simplicidad**: Más fácil de entender y usar que RxJS en muchos casos
2. **Rendimiento**: Angular solo actualiza lo que realmente cambió (renderizado granular)
3. **Menos código**: No necesitas subscribe/unsubscribe
4. **Type-safe**: TypeScript infiere los tipos automáticamente
5. **Debugging más fácil**: El flujo de datos es más claro y predecible
6. **Integración perfecta con OnPush**: Actualiza automáticamente la vista

### Cómo crear Signals

Para crear un signal, importamos la función `signal` y la usamos para crear una variable reactiva:

```typescript
import { signal } from '@angular/core';

export class MiComponente {
  // Signal de tipo string
  title = signal('ICC PPW');
  
  // Signal de tipo number
  contador = signal(0);
  
  // Signal de tipo boolean
  isVisible = signal(true);
  
  // Signal con array
  usuarios = signal([
    { id: 1, nombre: 'Juan' },
    { id: 2, nombre: 'María' }
  ]);
  
  // Signal con objeto
  perfil = signal({
    nombre: 'Carlos',
    email: 'carlos@example.com'
  });
}
```

#### Anatomía de un Signal

```typescript
title = signal('ICC PPW');
```

Cuando se define:
- `signal()` crea un contenedor reactivo que guarda el valor `'ICC PPW'`.
- **Para leer su valor**, se usa con paréntesis: `title()` porque no es una simple variable, sino una función reactiva que devuelve su valor actual.
- Si cambia el valor, **Angular redibuja automáticamente** las partes de la vista que dependen de esa señal.

### Cómo usar Signals en HTML (Interpolación)

Las dobles llaves `{{ }}` representan la **interpolación** en Angular. Sirven para mostrar valores dinámicos de TypeScript dentro del HTML.

**Piensa que `{{ }}` son ventanas hacia tu código TypeScript.**

```html
<h1>{{ title() }}</h1>
```

**Desglose:**

| Parte | Función | Resultado |
|-------|---------|-----------|
| `{{ }}` | Interpolación Angular → muestra datos dinámicos | - |
| `title()` | Llama al signal y devuelve su valor actual | `'ICC PPW'` |
| **Resultado final** | Angular renderiza el texto en pantalla | `<h1>ICC PPW</h1>` |

**Más ejemplos de interpolación:**

```html
<!-- Signals simples -->
<p>Title: {{ title() }}</p>
<p>Contador: {{ contador() }}</p>

<!-- Expresiones -->
<p>{{ contador() > 10 ? 'Mayor de 10' : 'Menor de 10' }}</p>

<!-- Operaciones -->
<p>El próximo numero es {{ contador() + 1 }} </p>

<!-- Pipes combinados con signals -->
<p>{{ title() | uppercase }}</p>
```

### Métodos para modificar Signals

Angular proporciona tres métodos principales para actualizar signals:

#### 1. set(newValue) - Reemplazar completamente

Reemplaza completamente el valor anterior por uno nuevo. No depende del valor previo.

```typescript
// Definir el signal
title = signal('ICC PPW');

// Usar set para cambiar el valor
changeTitle(): void {
  this.title.set('Programación y Plataformas Web');
}
```

**Cuándo usarlo:**
- Cuando quieres asignar un valor nuevo directamente, sin importar el anterior.
- Es el equivalente a una asignación directa, como `title = 'nuevo valor'`, pero en modo reactivo.

**Más ejemplos:**

```typescript
name = signal('Juan');
age = signal(30);
isActive = signal(false);

// Cambiar valores
this.name.set('Ana');
this.age.set(25);
this.isActive.set(true);
```

#### 2. update(callback) - Modificar basado en el valor actual

Actualiza el valor basándose en el valor actual. Recibe una función callback que recibe el valor actual y devuelve el nuevo valor.

```typescript
title = signal('ICC PPW');

// Agregar texto al valor existente
appendToTitle(): void {
  this.title.update(value => value + ' - 2025');
  // Resultado: 'ICC PPW - 2025'
}

contador = signal(0);

// Incrementar valor
incrementar(): void {
  this.contador.update(value => value + 1);
}

// Decrementar
decrementar(): void {
  this.contador.update(value => value - 1);
}
```

**Cuándo usarlo:**
- Cuando quieres modificar el valor existente (no reemplazarlo).
- Ideal para concatenar, incrementar, o realizar transformaciones sobre el valor actual.

**Ejemplos avanzados:**

```typescript
// Duplicar un número
numero = signal(5);
duplicar(): void {
  this.numero.update(n => n * 2); // 5 → 10
}

// Agregar prefijo
nombre = signal('Torres');
agregarPrefijo(): void {
  this.nombre.update(n => 'Sr. ' + n); // 'Torres' → 'Sr. Torres'
}
```

#### 3. mutate(mutator) - Modificar estructuras complejas

Permite modificar directamente estructuras complejas o mutables, como arrays u objetos, sin reemplazar todo el valor.

```typescript
usuarios = signal([
  { id: 1, nombre: 'Juan' },
  { id: 2, nombre: 'María' }
]);

// Agregar un nuevo usuario
agregarUsuario(): void {
  this.usuarios.mutate(lista => lista.push({ id: 3, nombre: 'Sofía' }));
}

// Modificar un usuario existente
modificarUsuario(): void {
  this.usuarios.mutate(lista => {
    const usuario = lista.find(u => u.id === 1);
    if (usuario) {
      usuario.nombre = 'Juan Carlos';
    }
  });
}

// Eliminar un usuario
eliminarUsuario(id: number): void {
  this.usuarios.mutate(lista => {
    const index = lista.findIndex(u => u.id === id);
    if (index !== -1) {
      lista.splice(index, 1);
    }
  });
}
```

**Cuándo usarlo:**
- Cuando trabajas con listas, objetos o estructuras grandes.
- Evita crear copias nuevas de los datos (mayor eficiencia).
- Perfecto para operaciones de array como push, splice, etc.

**Comparación con update:**

```typescript
// Con update (crea nueva copia)
this.usuarios.update(lista => [...lista, { id: 3, nombre: 'Sofía' }]);

// Con mutate (modifica directamente, más eficiente)
this.usuarios.mutate(lista => lista.push({ id: 3, nombre: 'Sofía' }));
```

### Resumen de Signals

```typescript
// CREAR
miSignal = signal(valorInicial);

// LEER
const valor = miSignal();  // En TypeScript
{{ miSignal() }}           // En HTML

// MODIFICAR
miSignal.set(nuevoValor);              // Reemplazar
miSignal.update(val => val + 1);       // Modificar basado en actual
miSignal.mutate(obj => obj.prop = 5);  // Mutar estructuras complejas
```


## Aplicación Práctica - Paso a Paso

En esta sección realizaremos un ejercicio guiado para aplicar los conceptos aprendidos. Crearemos un componente **HomePage** simple que muestra el título de nuestra aplicación usando Signals.

### Paso 1: Crear el componente HomePage

Utilizamos Angular CLI para generar el componente:

```bash
# Crear el componente HomePage
ng generate component home/pages/home-page

# O usar la forma corta
ng g c home/pages/home-page
```

Este comando genera automáticamente:
- `home-page.component.ts` - Clase del componente
- `home-page.component.html` - Plantilla HTML
- `home-page.component.scss` - Estilos
- `home-page.component.spec.ts` - Archivo de pruebas

![Estructura de componente generado](assets/06_componente-p2.png)

### Paso 2: Implementar el Signal en el componente

En el archivo `home-page.component.ts`, creamos un signal para el título:

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  // Signal para el título de la aplicación
  title = signal('ICC PPW');
}
```

### Paso 3: Crear la plantilla HTML

En el archivo `home-page.component.html`, creamos la estructura visual:

```html
<section class="home">
  <h1>{{ title() }}</h1>
  <p>Esta es la vista inicial de la aplicación</p>
</section>
```

### Paso 4: Agregar estilos

En el archivo `home-page.component.scss`, agregamos los estilos:

```scss
.home {
  text-align: center;
  color: #1a2372;
  padding: 2rem;
}
```

### Paso 5: Agregar HomePage en app.component.html

En el archivo `app.component.html` del proyecto, agregamos el componente HomePage:

```html
<app-home-page></app-home-page>
```

### Paso 6: Configurar rutas

En el archivo `app.routes.ts` agregar la ruta de HomePage a la raiz y su redireccionamiento de cualotro otro ruta a `/`.

```typescript
//imports
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




> Recuarda realizar las importaciones necesarias.


### Paso 7: Verificar funcionamiento

1. **Iniciar el servidor de desarrollo:**
   ```bash
   ng serve
   ```

2. **Abrir el navegador en:** `http://localhost:4200`

3. **Verificar que se muestra:**
   - El título "ICC PPW" en el centro
   - El texto "Esta es la vista inicial de la aplicación"
   - Los estilos aplicados correctamente (texto centrado y color azul)

### Paso 8: Agregar métodos para manipular el Signal

Ahora vamos a expandir la funcionalidad del componente agregando métodos que manipulen el signal `title` usando `set()` y `update()`.

**En el archivo `home-page.component.ts`, agregar los siguientes métodos:**

```typescript
  // Signal para el título de la aplicación
  title = signal('ICC PPW');

  // Método que usa set() - Reemplaza completamente el valor
  changeTitle(): void {
    this.title.set('Programación y Plataformas Web');
  }

  // Método que usa update() - Modifica el valor actual
  appendToTitle(): void {
    this.title.update(value => value + ' - 2025');
  }

  // Método que restaura el valor inicial
  resetTitle(): void {
    this.title.set('ICC PPW');
  }

  // Método que devuelve el título en mayúsculas (función computada)
  getTitleUpperCase(): string {
    return this.title().toUpperCase();
  }

```

**Explicación de los métodos:**

- **`changeTitle()`**: Usa `set()` para reemplazar completamente el valor del signal
- **`appendToTitle()`**: Usa `update()` para agregar texto al valor actual del signal
- **`resetTitle()`**: Usa `set()` para restaurar el valor inicial
- **`getTitleUpperCase()`**: Función que retorna el título en mayúsculas

### Paso 9: Actualizar el HTML con botones interactivos

**En el archivo `home-page.component.html`, actualizar con:**

```html
<section class="home">
  <h1>{{ title() }}</h1>
  <p>Esta es la vista inicial de la aplicación</p>

  <!-- Mostrar el título en mayúsculas usando la función -->
  <p><strong>En mayúsculas:</strong> {{ getTitleUpperCase() }}</p>

  <!-- Botones para manipular el signal -->
  <div class="buttons">
    <button (click)="changeTitle()">Cambiar Título</button>
    <button (click)="appendToTitle()">Agregar Año</button>
    <button (click)="resetTitle()">Restaurar</button>
  </div>
</section>
```

**Explicación del HTML:**

- `{{ title() }}` - Muestra el valor actual del signal
- `{{ getTitleUpperCase() }}` - Muestra el resultado de la función computada
- `(click)="changeTitle()"` - Event binding que ejecuta el método al hacer clic
- Los tres botones permiten interactuar con el signal de diferentes formas

### Paso 11: Verificar la interactividad

1. **Guardar todos los archivos** (el servidor en desarrollo recargará automáticamente)

2. **En el navegador, probar los botones:**
   - Clic en **"Cambiar Título"** → El título cambia a "Programación y Plataformas Web"
   - Clic en **"Agregar Año"** → Se agrega " - 2025" al título actual
   - Clic en **"Restaurar"** → El título vuelve a "ICC PPW"

3. **Observar que:**
   - El título en mayúsculas se actualiza automáticamente
   - Los cambios son instantáneos gracias a la reactividad de los signals
   - No necesitamos código adicional para actualizar la vista

## Aplicación Práctica - Autónoma

Ahora que has completado el ejercicio guiado, es momento de aplicar los conocimientos de forma autónoma. 

**Ver instrucciones completas en:** [02-fundamentos-practica.md](./02-fundamentos-practica.md)

En esta práctica autónoma deberás:

1. Crear un nuevo componente `PerfilPage`
2. Configurar la ruta para navegación
3. Implementar múltiples signals (name, lastName, age)
4. Crear métodos para manipular las signals
5. Mostrar datos usando interpolación y pipes
6. Aplicar directivas de control de flujo (@if)

Esta práctica te permitirá consolidar los conceptos de:
- Creación de componentes
- Uso de Signals (set, update)
- Interpolación y pipes
- Rutas en Angular
- Manejo de eventos

## Resultados y Evidencias

### Estructura del Proyecto 

Para este curso trabajaremos con **un único proyecto de Angular** donde realizaremos todas las prácticas (práctica 01, 02, 03, 04, etc.). Dentro del proyecto Angular, crearemos una carpeta especial para documentar las evidencias.

Esta estructura sera explicada solo en este archivo `02-fundamentos.md`, para los siguientes solo se indicara los entrgables. 

**Estructura del proyecto:**

```
mi-proyecto-angular/
├── src/
│   ├── app/
│   │   ├── home/
│   │   ├── perfil/
│   │   └── ...
├── evidencias/
│   ├── assets/
│   │   ├── 02-captura-routes.png
│   │   ├── 02-captura-component.png
│   │   ├── 02-captura-html.png
│   │   ├── 02-captura-demo.png
│   │   └── ...
│   ├── 02-fundamentos-nombre-apellido.md
│   ├── 03-navegacion-nombre-apellido.md
│   └── ...
├── README.md
└── package.json
```

#### Formato del Archivo de Evidencias

**Nombre del archivo:** `02-fundamentos-nombre-apellido.md`

**Ubicación:** `evidencias/02-fundamentos-nombre-apellido.md`

**Ejemplo:** `evidencias/02-fundamentos-pablo-torres.md`

**Contenido del archivo:**

```markdown
# Práctica 02: Fundamentos de Angular

## Datos del Estudiante
- **Nombre:** [Tu nombre completo]
- **Curso:** [Tu curso]
- **Fecha:** [Fecha de entrega]

---

## 1. Captura app.routes.ts
![Configuración de rutas](assets/02-captura-routes.png)

**Descripción:** Configuración de las rutas del proyecto con los componentes HomePage y PerfilPage.

---

## 2. Captura perfil-page.component.ts
![Implementación del componente](assets/02-captura-component.png)

**Descripción:** Implementación de signals, métodos changeData(), resetData() y changeAge().

---

## 3. Captura perfil-page.component.html
![Plantilla HTML](assets/02-captura-html.png)

**Descripción:** Plantilla HTML con interpolación, pipes y directivas @if.

---

## 4. Captura de la aplicación funcionando
![Aplicación desplegada](assets/02-captura-demo.png)

**Descripción:** Aplicación funcionando en el navegador mostrando la página de perfil con los datos.

---

## 5. Conclusiones

[Aquí debe agregar conslusiones, dificultad encontrada o mejora implementada]
```

#### Qué subir al AVAC

Para completar la entrega de la práctica 02-fundamentos, debes subir al AVAC **DOS elementos**:

1. **Link al repositorio remoto de GitHub**
   - URL del repositorio de tu proyecto de Angular
   - Ejemplo: `https://github.com/tu-usuario/mi-proyecto-angular`
   - Asegúrate de que el repositorio sea **público**

2. **Archivo Markdown de evidencias convertido a PDF**
   - El archivo `02-fundamentos-nombre-apellido.pdf` 
   - Descárgalo desde tu repositorio o súbelo directamente desde tu carpeta local, trasnformado a PDF (extención de VSCode)
   - Este archivo debe contener todas las capturas y enlaces

#### README del Proyecto

El archivo `README.md` en la raíz de tu proyecto debe incluir:

```markdown
# Mi Proyecto Angular - ICC PPW

## Descripción
Proyecto de prácticas del curso de Programación y Plataformas Web usando Angular 21.



## Aplicación Desplegada

**Ver aplicación en GitHub Pages:** [https://tu-usuario.github.io/mi-proyecto-angular/](https://tu-usuario.github.io/mi-proyecto-angular/)

## Evidencias

Las evidencias de cada práctica se encuentran en la carpeta [`evidencias/`](./evidencias/)

## Tecnologías
- Angular 21
- TypeScript
- SCSS
- GitHub Pages

## Instalación

\```bash
pnpm install
\```

## Ejecutar en desarrollo

\```bash
ng serve
\```

## Autor
[Tu nombre]
```



### Evidencias Requeridas para esta Práctica


1. **`app.routes.ts`** - Configuración de rutas del proyecto
2. **`perfil-page.component.ts`** - Implementación de signals y métodos
3. **`perfil-page.component.html`** - Plantilla HTML del componente
4. **Página desplegada** - Aplicación funcionando en el navegador (navegando a /perfil)
5. Conclusiones: 


## Recursos Adicionales

- [Documentación oficial de Angular](https://angular.dev)
- [Guía de Signals](https://angular.dev/guide/signals)
- [Control Flow Syntax](https://angular.dev/guide/templates/control-flow)
- [Angular CLI Commands](https://angular.dev/cli) 

