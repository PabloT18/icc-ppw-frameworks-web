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

## 1. Objetivo del tema

Comprender los fundamentos que sostienen el proyecto incremental en Angular 21: componentes standalone, templates, binding, signals, `computed`, `effect` cuando sea necesario y control flow moderno con `@if`, `@for` y `@switch`.

---

## 2. Explicación conceptual

Angular ya no se enseña correctamente si se lo presenta solo como “HTML + TypeScript”. El marco conceptual real combina reactividad, composición y una forma disciplinada de organizar la UI.

### Fundamentos esenciales

| Elemento | Rol pedagógico | Ejemplo |
|---|---|---|
| Componente standalone | Unidad base de UI | `@Component({ standalone: true })` |
| Template | Vista declarativa | `{{ nombre() }}` |
| Signal | Estado reactivo local | `signal('Pablo')` |
| Computed | Valor derivado | `computed(() => nombre().toUpperCase())` |
| Effect | Reacción a cambios con efecto lateral | sincronizar logs, analytics o persistencia puntual |
| Control flow moderno | Renderizado condicional e iterativo | `@if`, `@for`, `@switch` |

### Antes y ahora

| Enfoque antiguo | Enfoque Angular 21 |
|---|---|
| `AppModule` como pieza central | bootstrap ligero con standalone |
| `*ngIf` y `*ngFor` como camino principal | `@if` y `@for` como sintaxis recomendada |
| estado disperso y menos explícito | signals y valores derivados claros |
| lógica de UI escondida en métodos genéricos | estado declarativo y composición más legible |

---

## 3. Fundamento técnico

### 3.1 Signals

Una signal representa un valor reactivo que Angular puede observar y usar para refrescar la interfaz.

```ts
import { signal } from '@angular/core';

readonly name = signal('Juan');
```

Para leer una signal se llama como función.

```html
<p>{{ name() }}</p>
```

### 3.2 Computed

`computed` evita repetir lógica derivada en métodos de plantilla.

```ts
import { computed } from '@angular/core';

readonly fullName = computed(() => `${this.name()} ${this.lastName()}`);
```

### 3.3 Effect

`effect` no reemplaza a `computed`. Se usa cuando hay un efecto lateral real.

```ts
import { effect } from '@angular/core';

constructor() {
  effect(() => {
    console.log('Nombre actualizado:', this.fullName());
  });
}
```

Si no hay efecto lateral, no debe usarse.

### 3.4 Control flow moderno

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

### 3.5 Binding esencial

- interpolación: `{{ value }}`
- property binding: `[disabled]="form.invalid"`
- event binding: `(click)="save()"`

---

## 4. Ejemplos de código

### Ejemplo 1: perfil básico con signals

```ts
readonly firstName = signal('Ana');
readonly lastName = signal('Torres');
readonly fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

changeName() {
  this.firstName.set('María');
}
```

### Ejemplo 2: renderizado con `@switch`

```html
@switch (role()) {
  @case ('admin') {
    <p>Acceso administrativo</p>
  }
  @case ('student') {
    <p>Acceso de estudiante</p>
  }
  @default {
    <p>Rol no definido</p>
  }
}
```

---

## 5. Buenas prácticas

- Usa signals para estado local simple y explícito.
- Usa `computed` para valores derivados, no métodos repetidos en la plantilla.
- Usa `effect` solo cuando haya un efecto lateral real.
- Prefiere `@for` con `track` correcto; evita iteraciones sin identidad clara.
- Mantén la lógica de UI cerca de la feature que la usa.

---

## 6. Errores comunes

- Usar `effect` como sustituto de toda la lógica reactiva.
- Escribir métodos costosos en plantilla cuando basta con `computed`.
- Iterar con `@for` sin `track` estable.
- Mezclar ejemplos legacy y modernos en el mismo módulo.
- Enseñar signals como reemplazo universal de formularios, router y HTTP.

---

## 7. Relación con el proyecto incremental

En este módulo se amplía la `HomePage` y se crea una segunda página simple para practicar estado local, renderizado declarativo y estructura de feature. El objetivo no es llenar el proyecto de componentes, sino establecer una base clara para navegación y formularios.

---

## 8. Referencias recomendadas

- [angular/docs/angular-obserbables-rx.md](../docs/angular-obserbables-rx.md)
- Documentación oficial de signals: https://angular.dev/guide/signals
