# Programación y Plataformas Web

# Frameworks Web: Angular 21 — Formularios Reactivos - Práctica B

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 05. Formularios Reactivos - Práctica B: Reutilización de Código con FormUtils

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Construir un formulario reactivo básico (nombre, edad, correo) que demuestre el uso de validadores built-in de Angular y la reutilización de código mediante una clase utilitaria `FormUtils` para centralizar la lógica de validación y mensajes de error.

---

## 2. Contexto de la práctica

En la práctica A se construyó un formulario de signup con validaciones custom y async. Ahora se explora cómo reutilizar la lógica de validación en múltiples formularios mediante una clase helper.

El problema: cada formulario repite la misma lógica para:
- Verificar si un campo es válido
- Mostrar mensajes de error
- Traducir códigos de error (`required`, `email`, `minlength`) a mensajes legibles

La solución: crear una clase `FormUtils` que centralice esta lógica y la haga reutilizable en toda la aplicación.

---

## 3. ¿Por qué crear una clase `FormUtils` separada?

### Ventajas de centralizar la validación

**1. Reutilización y consistencia**

Todos los formularios usan los mismos mensajes de error. Si se necesita cambiar "Este campo es requerido" a "Campo obligatorio", se modifica en un solo lugar.

**2. Código más limpio**

Evita repetir bloques de `if` o `switch` en cada componente. El HTML se mantiene legible:

```html
@if(formUtils.isValidField(myForm, 'nombre')) {
  <span>{{ formUtils.getFieldError(myForm, 'nombre') }}</span>
}
```

**3. Escalabilidad**

En aplicaciones grandes con decenas de formularios, tener un helper unificado facilita el mantenimiento.

**4. Control de errores centralizado**

Si se agregan validadores custom o async, se integran fácilmente en la misma clase sin modificar todos los formularios.

---

## 4. Pasos incrementales

### Paso 1. Crear página de perfil con formulario básico

Crea `src/app/features/profile/pages/profile-page.ts` con campos básicos.

**Objetivo:** mostrar un formulario simple sin helper para evidenciar la repetición.

#### Crear el componente

```bash
ng g c features/profile/pages/profile-page --standalone --skip-tests
```

#### `profile-page.ts`

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styles: ``
})
export default class ProfilePage {
  private fb = inject(FormBuilder);

  myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    edad: [0, [Validators.required, Validators.min(18)]],
    correo: ['', [Validators.required, Validators.email]],
  });

  get nombre() { return this.myForm.get('nombre')!; }
  get edad() { return this.myForm.get('edad')!; }
  get correo() { return this.myForm.get('correo')!; }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Perfil guardado:', this.myForm.value);
  }
}
```

#### Explicación

- `FormBuilder` simplifica la creación del formulario
- Cada campo tiene validadores: `required`, `minLength`, `min`, `email`
- Los getters facilitan acceso desde el template
- `markAllAsTouched()` fuerza la visualización de errores al intentar submit

---

### Paso 2. Crear template sin helper (versión verbose)

#### `profile-page.html`

```html
<section class="max-w-2xl mx-auto space-y-6 p-6">
  <header class="space-y-2">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Perfil</p>
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Editar información personal</h1>
  </header>

  <form [formGroup]="myForm" (ngSubmit)="onSubmit()" class="space-y-4">
    
    <!-- Nombre -->
    <div class="space-y-2">
      <label for="nombre" class="block text-sm font-medium text-slate-700">Nombre completo</label>
      <input
        id="nombre"
        type="text"
        formControlName="nombre"
        placeholder="Ingrese su nombre"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      
      @if (nombre.touched && nombre.hasError('required')) {
        <p class="text-xs text-red-600">El nombre es requerido</p>
      }
      @if (nombre.touched && nombre.hasError('minlength')) {
        <p class="text-xs text-red-600">Mínimo 3 caracteres</p>
      }
    </div>

    <!-- Edad -->
    <div class="space-y-2">
      <label for="edad" class="block text-sm font-medium text-slate-700">Edad</label>
      <input
        id="edad"
        type="number"
        formControlName="edad"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      
      @if (edad.touched && edad.hasError('required')) {
        <p class="text-xs text-red-600">La edad es requerida</p>
      }
      @if (edad.touched && edad.hasError('min')) {
        <p class="text-xs text-red-600">Debe ser mayor de 18 años</p>
      }
    </div>

    <!-- Correo -->
    <div class="space-y-2">
      <label for="correo" class="block text-sm font-medium text-slate-700">Correo electrónico</label>
      <input
        id="correo"
        type="email"
        formControlName="correo"
        placeholder="ejemplo@mail.com"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      
      @if (correo.touched && correo.hasError('required')) {
        <p class="text-xs text-red-600">El correo es requerido</p>
      }
      @if (correo.touched && correo.hasError('email')) {
        <p class="text-xs text-red-600">Formato de correo inválido</p>
      }
    </div>

    <button
      type="submit"
      class="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      [disabled]="myForm.invalid"
    >
      Guardar perfil
    </button>
  </form>
</section>
```

#### Problema evidente

El código repite constantemente:

```html
@if (campo.touched && campo.hasError('tipo')) {
  <p>Mensaje de error</p>
}
```

Esto hace que el HTML sea largo, repetitivo y difícil de mantener.

---

### Paso 3. Crear clase `FormUtils`

Crea `src/app/shared/utils/form-utils.ts` para centralizar la lógica de validación.

#### `form-utils.ts`

```ts
import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {

  /**
   * Verifica si un campo es inválido y ha sido tocado
   */
  static isValidField(form: FormGroup, fieldName: string): boolean {
    const control = form.controls[fieldName];
    return !!control?.errors && control.touched;
  }

  /**
   * Obtiene el mensaje de error de un campo
   */
  static getFieldError(form: FormGroup, fieldName: string): string | null {
    const control = form.controls[fieldName];
    if (!control) return null;

    const errors = control.errors ?? {};
    return FormUtils.getTextError(errors);
  }

  /**
   * Traduce el código de error a mensaje legible
   */
  static getTextError(errors: ValidationErrors): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;

        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres`;

        case 'min':
          return `Valor mínimo: ${errors['min'].min}`;

        case 'max':
          return `Valor máximo: ${errors['max'].max}`;

        case 'email':
          return 'Formato de correo inválido';

        case 'pattern':
          return 'Formato inválido';

        case 'emailTaken':
          return 'Este correo ya está registrado';

        case 'passwordMismatch':
          return 'Las contraseñas no coinciden';

        default:
          return 'Error de validación';
      }
    }
    return null;
  }

  /**
   * Verifica si un elemento de FormArray es inválido
   */
  static isValidFieldInArray(formArray: FormArray, index: number): boolean {
    const control = formArray.controls[index];
    return !!control?.errors && control.touched;
  }

  /**
   * Obtiene el mensaje de error de un elemento de FormArray
   */
  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index]?.errors ?? {};
    return FormUtils.getTextError(errors);
  }
}
```

#### Explicación de cada método

**`isValidField(form, fieldName)`**

Retorna `true` si:
- El campo tiene errores (`!!control.errors`)
- El usuario ya interactuó con él (`control.touched`)

Esto evita mostrar errores antes de que el usuario toque el campo.

**`getFieldError(form, fieldName)`**

Obtiene los errores del campo y los traduce a mensaje legible usando `getTextError()`.

**`getTextError(errors)`**

Recibe un objeto de errores (`{ required: true }`, `{ minlength: {...} }`) y retorna el mensaje correspondiente.

Si se agregan validadores custom, solo se añade un nuevo `case` aquí.

**`isValidFieldInArray()` y `getFieldErrorInArray()`**

Versiones especializadas para `FormArray` (se usan en la práctica C).

---

### Paso 4. Refactorizar template con FormUtils

Ahora simplifica el HTML usando la clase helper.

#### Actualizar `profile-page.ts`

Agregar el helper como propiedad estática:

```ts
import { FormUtils } from '@shared/utils/form-utils';

export default class ProfilePage {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;  // <-- Agregar esta línea

  myForm: FormGroup = this.fb.group({
    // ... mismo código
  });
  // ... resto del código
}
```

#### Actualizar `profile-page.html`

Reemplazar los bloques de errores con:

```html
<section class="max-w-2xl mx-auto space-y-6 p-6">
  <header class="space-y-2">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Perfil</p>
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Editar información personal</h1>
  </header>

  <form [formGroup]="myForm" (ngSubmit)="onSubmit()" class="space-y-4">
    
    <!-- Nombre -->
    <div class="space-y-2">
      <label for="nombre" class="block text-sm font-medium text-slate-700">Nombre completo</label>
      <input
        id="nombre"
        type="text"
        formControlName="nombre"
        placeholder="Ingrese su nombre"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      
      @if (formUtils.isValidField(myForm, 'nombre')) {
        <p class="text-xs text-red-600">{{ formUtils.getFieldError(myForm, 'nombre') }}</p>
      }
    </div>

    <!-- Edad -->
    <div class="space-y-2">
      <label for="edad" class="block text-sm font-medium text-slate-700">Edad</label>
      <input
        id="edad"
        type="number"
        formControlName="edad"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      
      @if (formUtils.isValidField(myForm, 'edad')) {
        <p class="text-xs text-red-600">{{ formUtils.getFieldError(myForm, 'edad') }}</p>
      }
    </div>

    <!-- Correo -->
    <div class="space-y-2">
      <label for="correo" class="block text-sm font-medium text-slate-700">Correo electrónico</label>
      <input
        id="correo"
        type="email"
        formControlName="correo"
        placeholder="ejemplo@mail.com"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      
      @if (formUtils.isValidField(myForm, 'correo')) {
        <p class="text-xs text-red-600">{{ formUtils.getFieldError(myForm, 'correo') }}</p>
      }
    </div>

    <button
      type="submit"
      class="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      [disabled]="myForm.invalid"
    >
      Guardar perfil
    </button>
  </form>
</section>
```

#### Comparación antes y después

**Antes (sin FormUtils):**

```html
@if (nombre.touched && nombre.hasError('required')) {
  <p class="text-xs text-red-600">El nombre es requerido</p>
}
@if (nombre.touched && nombre.hasError('minlength')) {
  <p class="text-xs text-red-600">Mínimo 3 caracteres</p>
}
```

**Después (con FormUtils):**

```html
@if (formUtils.isValidField(myForm, 'nombre')) {
  <p class="text-xs text-red-600">{{ formUtils.getFieldError(myForm, 'nombre') }}</p>
}
```

El código es mucho más conciso y reutilizable.

---

### Paso 5. Agregar ruta y navegación

#### Agregar ruta en `app.routes.ts`

```ts
{ path: 'profile', component: ProfilePage }
```

#### Agregar link en el header

En el componente de navegación, agregar un enlace:

```html
<a routerLink="/profile" class="...">Perfil</a>
```

---

## 5. Beneficios de FormUtils

| Beneficio | Descripción |
|-----------|-------------|
| **Centralización** | Todos los mensajes de error en un solo lugar |
| **Reutilización** | Funciona en cualquier componente que lo importe |
| **Escalabilidad** | Fácil agregar nuevos validadores custom |
| **Legibilidad** | HTML más limpio y expresivo |
| **Mantenimiento** | Un cambio afecta toda la aplicación |
| **Testing** | Más fácil probar la lógica de validación |

---

## 6. Validaciones esperadas

- El formulario inicia con estado `INVALID` (todos los campos required)
- Los errores solo se muestran después de `touched` (blur o submit)
- El botón permanece deshabilitado mientras el formulario sea inválido
- Los mensajes de error son dinámicos según el tipo de validación
- Al submit válido, los datos se imprimen en consola

---

## 7. Entregables

- Captura del formulario vacío mostrando el estado inicial
- Captura del formulario con todos los errores visibles (después de submit)
- Captura del formulario válido antes de guardar

---

## 8. Commit sugerido

```bash
git commit -m "feat: formulario perfil con FormUtils helper"
```

---

## 9. Próximos pasos

En la práctica C se explorará cómo usar `FormUtils` con:
- Formularios dinámicos (`FormArray`)
- Controles especiales (switches, checkboxes, radios)
- Validación de elementos individuales dentro de arrays
