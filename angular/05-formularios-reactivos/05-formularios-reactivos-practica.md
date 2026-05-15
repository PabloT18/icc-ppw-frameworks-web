# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 04. Formularios Reactivos - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Agregar al proyecto `ppw-angular-21` un formulario reactivo moderno para registrar estudiantes, con tipado fuerte, validaciones reutilizables y mensajes de error claros.

---

## 2. Contexto de la práctica

El proyecto ya navega entre varias páginas. Ahora se incorporará una página de formulario dentro de la feature `students` para capturar datos. Este mismo patrón servirá más adelante para operaciones de edición, integración HTTP y flujos autenticados.

---

## 3. Archivos que se van a modificar

- `src/app/app.routes.ts`
- `src/app/features/students/pages/students-form-page.ts`
- `src/app/features/students/validators/only-letters.validator.ts`
- `src/app/features/students/pages/students-page.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/04-formularios-reactivos/files](files/README.md) queda preparada para alojar el componente base del formulario y el validador reutilizable del módulo.

---

## 5. Código inicial

### 5.1 Ruta del formulario

```ts
{ path: 'students/new', component: StudentsFormPage }
```

### 5.2 Estructura base del formulario

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-students-form-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './students-form-page.html',
})
export class StudentsFormPage {
  private fb = inject(FormBuilder);

  readonly studentForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    age: [18, [Validators.required, Validators.min(16)]],
  });
}
```

---

## 6. Pasos incrementales

### Paso 1. Crear la nueva página del formulario

Crear `StudentsFormPage` como componente standalone y registrarlo en las rutas.

Explicación: el formulario ya vive en una ruta real del proyecto, no en un ejemplo aislado.

### Paso 2. Construir el `FormGroup` con `nonNullable`

Copiar la estructura base y verificar que los controles no trabajen con `null`.

Explicación: este cambio reduce errores de tipado y hace más predecible el manejo del formulario.

### Paso 3. Crear el template con `formControlName`

```html
<form [formGroup]="studentForm" (ngSubmit)="save()">
  <label>
    Nombre
    <input formControlName="name" type="text">
  </label>

  <label>
    Correo
    <input formControlName="email" type="email">
  </label>

  <label>
    Edad
    <input formControlName="age" type="number">
  </label>

  <button type="submit">Guardar</button>
</form>
```

Explicación: el template solo enlaza controles; la estructura y validación viven en TypeScript.

### Paso 4. Mostrar errores con una función auxiliar

Agregar una función para devolver mensajes por campo y mostrarla con `@if`.

```html
@if (getFieldError('name'); as errorMessage) {
  <small>{{ errorMessage }}</small>
}
```

Explicación: este patrón reduce duplicación y mejora mantenibilidad.

### Paso 5. Agregar un validador reutilizable

Crear `only-letters.validator.ts` y aplicarlo al campo nombre.

Explicación: cuando una regla tiene semántica propia, debe salir del componente.

### Paso 6. Implementar `save()`

```ts
save() {
  if (this.studentForm.invalid) {
    this.studentForm.markAllAsTouched();
    return;
  }

  console.log(this.studentForm.getRawValue());
  this.studentForm.reset({
    name: '',
    email: '',
    age: 18,
  });
}
```

Explicación: `getRawValue()` devuelve el modelo tipado completo del formulario.

### Paso 7. Agregar acceso desde la lista de estudiantes

Incluir un enlace o botón visible hacia `/students/new`.

Explicación: el formulario se integra al flujo de navegación ya existente.

---

## 7. Validaciones esperadas

- El formulario carga en `/students/new`.
- El envío inválido muestra errores sin romper la página.
- El correo exige formato válido.
- El nombre no acepta entradas inválidas según el validador definido.
- Al guardar correctamente, el formulario se reinicia.

Placeholder sugerido de captura: `assets/04-students-form.png`

---

## 8. Entregables

- Página de formulario creada e integrada a rutas.
- Formulario tipado con `nonNullable`.
- Validaciones síncronas visibles en UI.
- Validador reutilizable implementado.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: agregar formulario reactivo tipado para estudiantes"
git commit -m "feat: extraer validador reutilizable del nombre"
git commit -m "refactor: centralizar mensajes de error del formulario"
```
