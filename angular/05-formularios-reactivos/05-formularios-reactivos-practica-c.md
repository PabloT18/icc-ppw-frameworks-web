# Programación y Plataformas Web

# Frameworks Web: Angular 21 — Formularios Reactivos - Práctica C

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 05. Formularios Reactivos - Práctica C: Formularios Dinámicos y Controles Especiales

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Construir un formulario complejo que combine:
- **FormArray** para campos dinámicos (agregar/eliminar elementos)
- **Controles especiales** (radio buttons, switches, checkboxes)
- **Reutilización de FormUtils** para validación consistente

---

## 2. Contexto de la práctica

En la práctica A se construyó un formulario de signup con validaciones custom y async.  
En la práctica B se creó un helper `FormUtils` para reutilizar la lógica de validación.

Ahora se combina todo en un formulario de **configuración de proyecto** que permite:
- Ingresar el nombre del proyecto
- Agregar lenguajes de programación dinámicamente
- Seleccionar el tipo de proyecto (frontend, backend, fullstack)
- Optar por recibir notificaciones
- Aceptar términos y condiciones

---

## 3. Archivos que se van a crear o modificar

**Nuevo componente:**
- `src/app/features/project/pages/project-config-page.ts`
- `src/app/features/project/pages/project-config-page.html`

**Reutilizar:**
- `src/app/shared/utils/form-utils.ts` (creado en práctica B)

**Actualizar:**
- `src/app/app.routes.ts` — agregar ruta `project-config`

---

## 4. Pasos incrementales

### Paso 1. Crear componente base con formulario simple

Crea el componente y define un formulario básico con solo el campo "nombre del proyecto".

**Objetivo:** establecer la estructura base antes de agregar complejidad.

#### Crear el componente

```bash
ng g c features/project/pages/project-config-page --standalone --skip-tests
```

#### `project-config-page.ts`

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'app-project-config-page',
  imports: [ReactiveFormsModule],
  templateUrl: './project-config-page.html',
  styles: ``
})
export default class ProjectConfigPage {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
  });

  onSubmit() {
    this.myForm.markAllAsTouched();
    
    if (this.myForm.invalid) return;

    console.log('Proyecto guardado:', this.myForm.value);
  }
}
```

#### `project-config-page.html`

```html
<section class="max-w-3xl mx-auto space-y-6 p-6">
  <header class="space-y-2">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Proyecto</p>
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Configuración del proyecto</h1>
  </header>

  <form [formGroup]="myForm" (ngSubmit)="onSubmit()" class="space-y-6">
    
    <!-- Nombre del proyecto -->
    <div class="space-y-2">
      <label for="nombre" class="block text-sm font-medium text-slate-700">
        Nombre del proyecto
      </label>
      <input
        id="nombre"
        type="text"
        formControlName="nombre"
        placeholder="Mi proyecto increíble"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      
      @if (formUtils.isValidField(myForm, 'nombre')) {
        <p class="text-xs text-red-600">{{ formUtils.getFieldError(myForm, 'nombre') }}</p>
      }
    </div>

    <button
      type="submit"
      class="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      [disabled]="myForm.invalid"
    >
      Guardar configuración
    </button>
  </form>
</section>
```

#### Explicación

- Formulario inicial con un solo campo
- Ya integra `FormUtils` para mostrar errores
- Tailwind para estilos responsive

---

### Paso 2. Agregar FormArray para lenguajes dinámicos

Ahora se agrega un `FormArray` para que el usuario pueda añadir y eliminar lenguajes de programación.

**Objetivo:** mostrar cómo un formulario crece dinámicamente sin perder control.

#### Actualizar `project-config-page.ts`

Agregar el `FormArray` y los métodos para manipularlo:

```ts
import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  FormArray, 
  FormControl, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'app-project-config-page',
  imports: [ReactiveFormsModule],
  templateUrl: './project-config-page.html',
  styles: ``
})
export default class ProjectConfigPage {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    lenguajes: this.fb.array(
      [
        this.fb.control('JavaScript', [Validators.required, Validators.minLength(3)]),
        this.fb.control('TypeScript', [Validators.required, Validators.minLength(3)]),
      ],
      [Validators.minLength(2)] // El array debe tener mínimo 2 lenguajes
    ),
  });

  // Control independiente para agregar nuevos lenguajes
  newLenguaje: FormControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  // Getter para acceder al FormArray
  get lenguajes(): FormArray {
    return this.myForm.get('lenguajes') as FormArray;
  }

  // Agregar lenguaje al array
  onAddLenguaje() {
    if (this.newLenguaje.invalid) return;

    this.lenguajes.push(
      this.fb.control(this.newLenguaje.value, [
        Validators.required,
        Validators.minLength(3)
      ])
    );

    this.newLenguaje.reset();
  }

  // Eliminar lenguaje del array
  onDeleteLenguaje(index: number) {
    this.lenguajes.removeAt(index);
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
    
    if (this.myForm.invalid) return;

    console.log('Proyecto guardado:', this.myForm.value);
  }
}
```

#### Explicación del código

**FormArray con valores iniciales:**

```ts
lenguajes: this.fb.array(
  [
    this.fb.control('JavaScript', [Validators.required, Validators.minLength(3)]),
    this.fb.control('TypeScript', [Validators.required, Validators.minLength(3)]),
  ],
  [Validators.minLength(2)]
)
```

- Cada elemento del array es un `FormControl` con sus propios validadores
- El array completo tiene un validador: debe contener mínimo 2 lenguajes

**Control independiente:**

```ts
newLenguaje: FormControl = this.fb.control('', [
  Validators.required,
  Validators.minLength(3)
]);
```

Este control **no forma parte del formulario principal**. Es un campo temporal para capturar el nuevo lenguaje antes de agregarlo al array.

**Getter para el FormArray:**

```ts
get lenguajes(): FormArray {
  return this.myForm.get('lenguajes') as FormArray;
}
```

Facilita el acceso desde el template sin escribir `myForm.get('lenguajes')` cada vez.

**Método para agregar:**

```ts
onAddLenguaje() {
  if (this.newLenguaje.invalid) return;
  
  this.lenguajes.push(
    this.fb.control(this.newLenguaje.value, [Validators.required, Validators.minLength(3)])
  );
  
  this.newLenguaje.reset();
}
```

1. Verifica que el nuevo valor sea válido
2. Lo agrega al FormArray
3. Limpia el campo temporal

**Método para eliminar:**

```ts
onDeleteLenguaje(index: number) {
  this.lenguajes.removeAt(index);
}
```

Elimina el elemento en la posición indicada.

---

### Paso 3. Agregar HTML para FormArray dinámico

#### Actualizar `project-config-page.html`

Agregar después del campo "nombre":

```html
    <!-- Agregar lenguaje -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-slate-700">
        Agregar lenguaje de programación
      </label>
      <div class="flex gap-2">
        <input
          type="text"
          [formControl]="newLenguaje"
          placeholder="Ej: Python, Java, Go..."
          (keydown.enter)="onAddLenguaje(); $event.preventDefault()"
          class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <button
          type="button"
          (click)="onAddLenguaje()"
          [disabled]="newLenguaje.invalid"
          class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Agregar
        </button>
      </div>
      
      @if (newLenguaje.touched && newLenguaje.invalid) {
        <p class="text-xs text-red-600">{{ formUtils.getFieldError(myForm, 'nombre') }}</p>
      }
    </div>

    <!-- Lista de lenguajes -->
    <div class="space-y-2" formArrayName="lenguajes">
      <label class="block text-sm font-medium text-slate-700">
        Lenguajes del proyecto (mínimo 2)
      </label>

      @for(control of lenguajes.controls; track control; let i = $index) {
        <div class="flex gap-2 items-start">
          <input
            [formControlName]="i"
            class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="button"
            (click)="onDeleteLenguaje(i)"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>

        @if (formUtils.isValidFieldInArray(lenguajes, i)) {
          <p class="text-xs text-red-600">{{ formUtils.getFieldErrorInArray(lenguajes, i) }}</p>
        }
      }

      @if (formUtils.isValidField(myForm, 'lenguajes')) {
        <p class="text-xs text-red-600">Debe tener al menos 2 lenguajes</p>
      }
    </div>
```

#### Explicación del HTML

**Campo para agregar:**

```html
<input
  [formControl]="newLenguaje"
  (keydown.enter)="onAddLenguaje(); $event.preventDefault()"
/>
```

- `[formControl]` vincula con el control independiente
- `(keydown.enter)` permite agregar presionando Enter
- `$event.preventDefault()` evita que se active el submit del formulario

**Lista dinámica:**

```html
<div formArrayName="lenguajes">
  @for(control of lenguajes.controls; track control; let i = $index) {
    <input [formControlName]="i" />
    <button (click)="onDeleteLenguaje(i)">Eliminar</button>
  }
</div>
```

- `formArrayName="lenguajes"` indica que los controles internos pertenecen al array
- `@for` itera sobre los controles
- `[formControlName]="i"` vincula cada input con su posición en el array

**Validación de elementos individuales:**

```html
@if (formUtils.isValidFieldInArray(lenguajes, i)) {
  <p>{{ formUtils.getFieldErrorInArray(lenguajes, i) }}</p>
}
```

Muestra el error de ese control específico usando los métodos de `FormUtils` para arrays.

**Validación del array completo:**

```html
@if (formUtils.isValidField(myForm, 'lenguajes')) {
  <p>Debe tener al menos 2 lenguajes</p>
}
```

Muestra error si el array no cumple el `Validators.minLength(2)`.

---

### Paso 4. Agregar controles especiales (radio, switch, checkbox)

Ahora se agregan los controles de selección y booleanos.

**Objetivo:** mostrar cómo manejar diferentes tipos de inputs en un mismo formulario.

#### Actualizar `project-config-page.ts`

Agregar los nuevos campos al formulario:

```ts
  myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    lenguajes: this.fb.array(
      [
        this.fb.control('JavaScript', [Validators.required, Validators.minLength(3)]),
        this.fb.control('TypeScript', [Validators.required, Validators.minLength(3)]),
      ],
      [Validators.minLength(2)]
    ),
    tipo: ['fullstack', Validators.required], // Radio buttons
    notificaciones: [true], // Switch
    terminosAceptados: [false, Validators.requiredTrue], // Checkbox obligatorio
  });
```

#### Explicación de los nuevos campos

**`tipo` (radio buttons):**

```ts
tipo: ['fullstack', Validators.required]
```

Valor inicial: `'fullstack'`. El usuario puede elegir entre: frontend, backend o fullstack.

**`notificaciones` (switch):**

```ts
notificaciones: [true]
```

Valor booleano. No es obligatorio, por defecto está activado.

**`terminosAceptados` (checkbox required):**

```ts
terminosAceptados: [false, Validators.requiredTrue]
```

`Validators.requiredTrue` exige que el valor sea `true` (checkbox marcado).

---

### Paso 5. Agregar HTML para controles especiales

#### Actualizar `project-config-page.html`

Agregar antes del botón submit:

```html
    <!-- Tipo de proyecto (Radio buttons) -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-slate-700">
        Tipo de proyecto
      </label>
      <div class="flex gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="frontend"
            formControlName="tipo"
            class="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span class="text-sm text-slate-700">Frontend</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="backend"
            formControlName="tipo"
            class="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span class="text-sm text-slate-700">Backend</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="fullstack"
            formControlName="tipo"
            class="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span class="text-sm text-slate-700">Fullstack</span>
        </label>
      </div>

      @if (formUtils.isValidField(myForm, 'tipo')) {
        <p class="text-xs text-red-600">{{ formUtils.getFieldError(myForm, 'tipo') }}</p>
      }
    </div>

    <!-- Notificaciones (Switch) -->
    <div class="flex items-center gap-3">
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          formControlName="notificaciones"
          class="sr-only peer"
        />
        <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
      </label>
      <span class="text-sm text-slate-700">Recibir notificaciones del proyecto</span>
    </div>

    <!-- Términos y condiciones (Checkbox obligatorio) -->
    <div class="space-y-2">
      <label class="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          formControlName="terminosAceptados"
          class="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />
        <span class="text-sm text-slate-700">
          Acepto los términos y condiciones del proyecto
        </span>
      </label>

      @if (formUtils.isValidField(myForm, 'terminosAceptados')) {
        <p class="text-xs text-red-600">{{ formUtils.getFieldError(myForm, 'terminosAceptados') }}</p>
      }
    </div>
```

#### Explicación de cada control

**Radio buttons:**

```html
<input type="radio" value="frontend" formControlName="tipo" />
<input type="radio" value="backend" formControlName="tipo" />
<input type="radio" value="fullstack" formControlName="tipo" />
```

- Todos comparten el mismo `formControlName="tipo"`
- Solo uno puede estar seleccionado
- El valor seleccionado se asigna al control

**Switch (checkbox estilizado):**

```html
<input type="checkbox" formControlName="notificaciones" class="sr-only peer" />
<div class="... peer-checked:bg-sky-600"></div>
```

- Funciona como checkbox normal
- Tailwind con `peer` permite estilos condicionales
- Valor booleano: `true` o `false`

**Checkbox obligatorio:**

```html
<input type="checkbox" formControlName="terminosAceptados" />
```

- Debe estar marcado (`Validators.requiredTrue`)
- Si no está marcado, el formulario es inválido

---

### Paso 6. Agregar validación personalizada para requiredTrue

FormUtils aún no maneja el error `requiredTrue`. Se debe actualizar.

#### Actualizar `form-utils.ts`

Agregar el caso en el método `getTextError()`:

```ts
  static getTextError(errors: ValidationErrors): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'requiredTrue':
          return 'Debe aceptar este campo';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;

        // ... resto de casos
      }
    }
    return null;
  }
```

---

### Paso 7. Integrar con router y navegación

#### Agregar ruta en `app.routes.ts`

```ts
{ path: 'project-config', component: ProjectConfigPage }
```

#### Agregar link en navegación

```html
<a routerLink="/project-config" class="...">Configurar Proyecto</a>
```

---

## 5. Resultado final del formulario

El formulario completo tiene:

1. **Campo texto:** nombre del proyecto
2. **FormArray dinámico:** lista de lenguajes (agregar/eliminar)
3. **Radio buttons:** tipo de proyecto (frontend/backend/fullstack)
4. **Switch:** recibir notificaciones
5. **Checkbox obligatorio:** aceptar términos

Todo validado con `FormUtils` de manera consistente.

---

## 6. Validaciones esperadas

- El formulario inicia con estado `INVALID` (términos no aceptados)
- Solo se muestran errores después de `touched` o submit
- El botón permanece deshabilitado mientras exista algún error
- Se puede agregar lenguajes presionando Enter o haciendo click
- Se puede eliminar lenguajes, pero debe quedar mínimo 2
- El formulario muestra valores por defecto coherentes

---

## 7. Entregables

- Captura del formulario vacío/inicial
- Captura mostrando todos los errores de validación
- Captura con el formulario válido y datos completos
- Captura de consola con el objeto `myForm.value` al hacer submit

---

## 8. Commit sugerido

```bash
git commit -m "feat: formulario configuración proyecto con FormArray y controles especiales"
```

---

## 9. Resumen de conceptos aplicados

| Concepto | Uso en esta práctica |
|----------|---------------------|
| **FormArray** | Lista dinámica de lenguajes |
| **FormControl independiente** | Campo temporal `newLenguaje` |
| **Getters** | Acceso simplificado al FormArray |
| **FormUtils** | Validación consistente en todos los campos |
| **Radio buttons** | Selección única de tipo de proyecto |
| **Switch** | Control booleano estilizado |
| **Checkbox required** | Aceptación obligatoria de términos |
| **@for** | Iteración moderna sobre controles |
| **@if** | Renderizado condicional de errores |

---

## 10. Próximos pasos

Con este formulario se han cubierto:
- Formularios simples (práctica A: signup)
- Reutilización de código (práctica B: FormUtils)
- Formularios complejos (práctica C: dinámicos + especiales)

El siguiente módulo explorará integración con servicios HTTP para enviar estos formularios a una API.
