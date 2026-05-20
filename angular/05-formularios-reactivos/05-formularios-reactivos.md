# Programación y Plataformas Web

# Frameworks Web: Angular 21 — Formularios Reactivos

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 05. Formularios Reactivos

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Dominar la construcción de formularios con Angular Reactive Forms: desde `FormControl` simple hasta `FormGroup` complejo, validación (built-in, custom, async), estado de forma y manejo de errores. La idea central: separar la **lógica del formulario** (TypeScript) de la **presentación** (template con Tailwind).

---

## 2. ¿Por qué "Reactivos"?

### Template-driven vs. Reactive

| Aspecto | Template-driven | Reactive |
|--------|---|---|
| **Lógica** | Esparcida en el template con directivas | Centralizada en el componente TypeScript |
| **Testing** | Difícil; requiere renderizar el DOM | Fácil; se prueba la lógica sin template |
| **Cambios dinámicos** | Complicados; necesitan `*ngIf` anidados | Naturales; se construyen en el código |
| **Validación** | Atributos HTML (required, email, etc.) | Código TypeScript (validadores) |
| **Control fino** | Limitado | Total |
| **Escalabilidad** | Tiende a crecer desordenadamente | Se mantiene estructurado |

**En este módulo: solo Reactive Forms.** Son la base moderna de formularios en Angular.

---

## 3. Conceptos clave

### 3.1 FormControl

El bloque más pequeño: un único input controlado.

```ts
const emailControl = new FormControl('');
```

Propiedades clave de un `FormControl`:
- **value:** el valor actual del input
- **status:** `VALID`, `INVALID`, `PENDING`, `DISABLED`
- **valid / invalid:** booleanos; true si el control es válido/inválido
- **touched / untouched:** true si el usuario interactuó (blur) con el input
- **dirty / pristine:** true si el usuario cambió el valor
- **errors:** objeto con errores de validación (ej: `{ required: true }`)
- **valueChanges:** observable que emite cada cambio de valor
- **statusChanges:** observable que emite cada cambio de estado

### 3.2 FormGroup

Contenedor de múltiples `FormControl`.

```ts
const form = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});
```

Un `FormGroup` es válido solo si **todos sus controles son válidos**. Si un control es inválido, toda la forma es inválida.

### 3.3 FormBuilder

Forma abreviada (y recomendada) de construir formularios sin repetir `new FormControl()`.

```ts
const form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required],
});
```

La sintaxis `['', [Validators.required]]` es: `[initialValue, validators, asyncValidators]`.

La sintaxis `this.fb.nonNullable.group(...)` evita que los valores sean `null` por defecto (más seguro).

---

## 4. Validación

### 4.1 Validadores built-in

Angular proporciona validadores comunes en la clase `Validators`:

| Validador | Uso | Retorna |
|-----------|-----|---------|
| `required` | Campo no puede estar vacío | `{ required: true }` |
| `email` | Debe ser formato email válido | `{ email: true }` |
| `minLength(n)` | Mínimo de n caracteres | `{ minlength: { requiredLength: n, actualLength: m } }` |
| `maxLength(n)` | Máximo de n caracteres | `{ maxlength: { requiredLength: n, actualLength: m } }` |
| `pattern(regex)` | Debe coincidir con la expresión regular | `{ pattern: { requiredPattern: '...', actualValue: '...' } }` |
| `min(n)` | Valor numérico >= n | `{ min: { min: n, actual: m } }` |
| `max(n)` | Valor numérico <= n | `{ max: { max: n, actual: m } }` |

### 4.2 Validadores custom (síncronos)

Se escriben como funciones puras que reciben un `AbstractControl` y retornan `ValidationErrors | null`.

```ts
export function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');

  if (!password || !confirmPassword) return null;
  if (!password.value || !confirmPassword.value) return null;

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
}
```

Se aplica al `FormGroup` en la opción `validators`:

```ts
const form = this.fb.group(
  {
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  },
  { validators: passwordMatchValidator }
);
```

### 4.3 Validadores async

Se usan cuando la validación requiere una llamada HTTP (ej: verificar si un email ya existe).

```ts
export function emailUniqueValidator(): AsyncValidator {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return of(control.value).pipe(
      delay(500),
      map(email => {
        const takenEmails = ['user@example.com', 'admin@example.com'];
        return takenEmails.includes(email) ? { emailTaken: true } : null;
      })
    );
  };
}
```

Se pasan como tercer argumento en `FormBuilder`:

```ts
email: ['', [Validators.required, Validators.email], [emailUniqueValidator()]]
```

Mientras valida async, el `status` es `PENDING`.

---

## 5. Estado del formulario

| Propiedad | Significado | Uso |
|-----------|-------------|-----|
| **valid / invalid** | ¿Es válido el formulario? | Habilitar/deshabilitar botón submit |
| **pristine / dirty** | ¿El usuario modificó algo? | Mostrar "Cambios sin guardar" |
| **touched / untouched** | ¿El usuario interactuó (blur)? | Mostrar mensajes de error solo después de tocar |
| **enabled / disabled** | ¿El control acepta entrada? | Deshabilitar campo temporalmente |
| **errors** | Objeto con errores actuales | Renderizar mensajes personalizados |
| **valueChanges** | Observable de cambios de valor | Reaccionar a cambios (ej: guardar automático) |
| **statusChanges** | Observable de cambios de estado | Reaccionar a validación async en progreso |

---

## 6. Manejo de errores display-friendly

### Función helper para obtener mensaje de error

```ts
getErrorMessage(control: FormControl, fieldName: string): string | null {
  if (control.hasError('required')) return `${fieldName} es requerido`;
  if (control.hasError('email')) return `${fieldName} debe ser válido`;
  if (control.hasError('minlength')) {
    const { requiredLength } = control.getError('minlength');
    return `${fieldName} debe tener al menos ${requiredLength} caracteres`;
  }
  if (control.hasError('pattern')) return `${fieldName} tiene formato inválido`;
  return null;
}
```

### Template con mensajes dinámicos

```html
@if (email.touched) {
  <p class="error-text">{{ getErrorMessage(email, 'Email') }}</p>
}
```

---

## 7. Patrón típico de formulario reactivo

```ts
// 1. Inyectar FormBuilder
private fb = inject(FormBuilder);

// 2. Crear el formulario
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});

// 3. Getters para acceso desde template
get email() { return this.form.get('email')!; }
get password() { return this.form.get('password')!; }

// 4. Método para manejar submit
onSubmit() {
  if (this.form.invalid) return;
  console.log(this.form.value); // { email: '...', password: '...' }
}
```

---

## 8. Ciclo de vida del formulario

1. **Creación:** `FormBuilder.group(...)` define estructura y validadores.
2. **Inicialización:** El formulario comienza con `status = VALID` (si no hay required) o `INVALID` (si hay).
3. **Interacción:** Cada tipeo emite `valueChanges`; `touched` se pone true en blur.
4. **Validación:** Validadores síncronos corren inmediatamente; async en `PENDING`.
5. **Submit:** Se verifica `form.invalid`; si es válido, se envía `form.value`.

---

## 9. Buenas prácticas

- **Usa FormBuilder**, no `new FormControl()` manualmente.
- **Agrupa validadores por control**, no los esparza en múltiples líneas.
- **Validadores custom en funciones puras** para poder testearse.
- **Lee estado en el template con propiedades `get`** (ej: `get email() { ... }`) para no escribir `form.get('email')` en HTML.
- **Muestra errores solo después de `touched`** para no abrumar al usuario.
- **Async validators con debounce** para no ralentizar la app.

---

## 10. Errores comunes

- Olvidar que `FormBuilder` retorna `FormGroup`, no `FormControl`.
- Olvidar `ReactiveFormsModule` en `imports` del componente.
- Crear validadores con side effects (no puros).
- No diferenciar entre `valid` (válido según reglas) e `invalid` (hay errores).
- Mostrar todos los errores a la vez; abrumar es peor que informar poco.
- No hacer `markAsTouched()` al submit inválido para mostrar errores.

---

## 11. Relación con el proyecto incremental

En este módulo se construye una página de sign-up con formulario reactivo. El formulario tiene validación built-in, custom (confirmación de contraseña), y async (verificación de email). Se integra con el router y se demuestra cómo un formulario reactivo escala desde 1 control a N controles sin perder legibilidad.

---

## 12. Referencias recomendadas

- Angular Reactive Forms Docs: https://angular.io/guide/reactive-forms
- Validators Built-in: https://angular.io/api/forms/Validators
- Custom Validators: https://angular.io/guide/form-validation#custom-validators
- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)

---

## 8. Referencias recomendadas

- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
- Documentación oficial de formularios: https://angular.dev/guide/forms/reactive-forms
