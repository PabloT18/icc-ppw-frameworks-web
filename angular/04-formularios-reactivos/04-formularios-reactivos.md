# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 04. Formularios Reactivos

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Trabajar formularios reactivos modernos en Angular 21 usando tipado fuerte, `FormBuilder` no anulable, validadores reutilizables y una estructura que permita integrar formularios reales en el proyecto incremental sin código duplicado.

---

## 2. Explicación conceptual

Los formularios reactivos siguen siendo la mejor opción para formularios medianos o grandes porque el estado del formulario se modela desde TypeScript y no depende de lógica dispersa en la plantilla.

| Template-driven | Reactive Forms modernos |
|---|---|
| útiles para casos muy simples | recomendados para flujos reales del proyecto |
| menos control estructural | estado, validación y composición más claros |
| tipado más débil | tipado fuerte y validaciones reutilizables |
| escalan peor | escalan mejor para formularios complejos |

---

## 3. Fundamento técnico

### 3.1 Tipado fuerte en formularios

El formulario no debe modelarse como un objeto genérico. Conviene definir su estructura desde el inicio.

```ts
type StudentForm = {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number>;
};
```

### 3.2 `FormBuilder.nonNullable`

Evita que los controles trabajen con `null` cuando el flujo no lo requiere.

```ts
private fb = inject(FormBuilder);

readonly studentForm = this.fb.nonNullable.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  age: [18, [Validators.required, Validators.min(16)]],
});
```

### 3.3 Validadores reutilizables

Los validadores personalizados deben extraerse cuando la regla se repite o tiene significado del dominio.

```ts
export function onlyLettersValidator(): ValidatorFn {
  return control => {
    const value = String(control.value ?? '').trim();
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)
      ? null
      : { onlyLetters: true };
  };
}
```

### 3.4 Manejo visual de errores

El error no debe depender de expresiones repetitivas en toda la plantilla. Conviene centralizar reglas de lectura del error.

```ts
getFieldError(fieldName: 'name' | 'email' | 'age') {
  const control = this.studentForm.controls[fieldName];
  if (!control.errors || !control.touched) return null;

  if (control.errors['required']) return 'Este campo es obligatorio';
  if (control.errors['email']) return 'Correo inválido';
  if (control.errors['minlength']) return 'Mínimo 3 caracteres';
  if (control.errors['min']) return 'La edad mínima es 16';
  if (control.errors['onlyLetters']) return 'Solo se permiten letras';

  return 'Campo inválido';
}
```

### 3.5 Seguridad mínima

La validación del formulario en frontend mejora la experiencia, pero no sustituye la validación del backend. Esta nota sí es relevante aquí porque una solución correcta mitiga errores de entrada, no riesgos de confianza del lado servidor.

---

## 4. Ejemplos de código

### Ejemplo 1: formulario tipado de estudiante

```ts
readonly studentForm = this.fb.nonNullable.group({
  name: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  age: [18, [Validators.required, Validators.min(16)]],
});
```

### Ejemplo 2: control de errores con `@if`

```html
<input formControlName="email" type="email">

@if (getFieldError('email'); as errorMessage) {
  <small>{{ errorMessage }}</small>
}
```

---

## 5. Buenas prácticas

- Prefiere formularios tipados y no anulables.
- No repitas bloques de validación innecesarios por cada campo.
- Marca controles como touched al enviar formularios inválidos.
- Mantén separadas las reglas de validación del renderizado visual.
- Usa formularios reactivos para flujos que después enviarán datos a servicios.

---

## 6. Errores comunes

- Usar `any` en lugar de tipar el formulario.
- Repetir lógica de errores directamente en el template.
- Mezclar `ngModel` y Reactive Forms sin necesidad.
- Tratar `effect` o signals como reemplazo directo del estado del formulario.
- Asumir que validar en frontend es suficiente para seguridad.

---

## 7. Relación con el proyecto incremental

En este módulo se agrega una feature `students-form` o un formulario de edición dentro de `students`, de modo que el proyecto ya tenga captura de datos real antes de llegar a estilos avanzados, consumo HTTP y autenticación.

---

## 8. Referencias recomendadas

- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
- Documentación oficial de formularios: https://angular.dev/guide/forms/reactive-forms
