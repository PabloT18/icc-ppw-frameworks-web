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

### 3.3 FormArray

Contenedor para listas dinámicas de controles (FormControl o FormGroup).

```ts
const lenguajes = new FormArray([
  new FormControl('JavaScript'),
  new FormControl('TypeScript'),
]);
```

Permite agregar y eliminar controles dinámicamente:

```ts
// Agregar
lenguajes.push(new FormControl('Python'));

// Eliminar
lenguajes.removeAt(0);

// Acceder
lenguajes.at(0).value; // 'JavaScript'
```

Uso típico: listas de elementos que el usuario puede modificar (lenguajes, teléfonos, hobbies, tareas).

### 3.4 FormBuilder

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

#### FormBuilder con FormArray

```ts
const form = this.fb.group({
  nombre: [''],
  lenguajes: this.fb.array([
    this.fb.control('JavaScript'),
    this.fb.control('TypeScript'),
  ]),
});
```

---

## 4. Validación

### 4.1 Validadores built-in

Angular proporciona validadores comunes en la clase `Validators`:

| Validador | Uso | Retorna |
|-----------|-----|---------|
| `required` | Campo no puede estar vacío | `{ required: true }` || `requiredTrue` | Checkbox debe estar marcado (true) | `{ required: true }` || `email` | Debe ser formato email válido | `{ email: true }` |
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

#### Operadores RxJS en validadores async

**`of()`**  
Convierte un valor normal en un `Observable`:

```ts
of(null) // Observable que emite null
of(control.value) // Observable que emite el valor del control
```

Se usa porque Angular espera un resultado asíncrono, aunque la validación sea simulada.

**`pipe()`**  
Permite encadenar operaciones sobre el observable:

```ts
of(control.value).pipe(
  delay(500),
  map(...)
)
```

1. Tomar el valor actual
2. Esperar 500ms
3. Transformar el valor

**`delay(n)`**  
Simula el tiempo de respuesta de una API. Durante este tiempo, el control entra en estado `PENDING`:

```html
@if (email.status === 'PENDING') {
  <p>Verificando disponibilidad...</p>
}
```

**`map()`**  
Transforma el valor emitido por el observable:

```ts
map((email: string) => {
  return takenEmails.includes(email) 
    ? { emailTaken: true } 
    : null;
})
```

Retorna `{ emailTaken: true }` si hay error, o `null` si es válido.

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

### Métodos comunes de FormControl y FormGroup

| Método | Descripción | Uso |
|--------|-------------|-----|
| **setValue()** | Establece el valor completo del formulario | `form.setValue({ email: '...', password: '...' })` |
| **patchValue()** | Establece valores parciales | `form.patchValue({ email: '...' })` |
| **reset()** | Limpia el formulario y marca pristine/untouched | `form.reset()` |
| **markAsTouched()** | Marca el control como touched | `control.markAsTouched()` |
| **markAllAsTouched()** | Marca todos los controles como touched | `form.markAllAsTouched()` |
| **markAsDirty()** | Marca el control como modificado | `control.markAsDirty()` |
| **markAsPristine()** | Marca el control como sin modificar | `control.markAsPristine()` |
| **enable()** | Habilita el control | `control.enable()` |
| **disable()** | Deshabilita el control | `control.disable()` |
| **get()** | Obtiene un control del FormGroup | `form.get('email')` |
| **hasError()** | Verifica si existe un error específico | `control.hasError('required')` |
| **getError()** | Obtiene los detalles de un error | `control.getError('minlength')` |

### Métodos específicos de FormArray

| Método | Descripción | Uso |
|--------|-------------|-----|
| **push()** | Agrega un control al final | `array.push(new FormControl(''))` |
| **insert()** | Inserta un control en posición específica | `array.insert(1, new FormControl(''))` |
| **removeAt()** | Elimina el control en posición indicada | `array.removeAt(0)` |
| **at()** | Accede al control en posición indicada | `array.at(0)` |
| **clear()** | Elimina todos los controles | `array.clear()` |
| **length** | Número de controles en el array | `array.length` |

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

## 8. Controles especiales

### Radio buttons

Permiten selección única entre múltiples opciones:

```html
<input type="radio" value="frontend" formControlName="tipo" />
<input type="radio" value="backend" formControlName="tipo" />
<input type="radio" value="fullstack" formControlName="tipo" />
```

Todos comparten el mismo `formControlName`. El valor seleccionado se asigna al control.

### Checkbox

Control booleano (true/false):

```html
<input type="checkbox" formControlName="notificaciones" />
```

Para hacer un checkbox obligatorio:

```ts
terminosAceptados: [false, Validators.requiredTrue]
```

### Switch (checkbox estilizado)

Funciona igual que checkbox pero con diseño de palanca:

```html
<input type="checkbox" formControlName="activo" class="sr-only peer" />
<div class="... peer-checked:bg-sky-600"></div>
```

Usa clases Tailwind con `peer` para estilos condicionales.

---

## 9. Ciclo de vida del formulario

1. **Creación:** `FormBuilder.group(...)` define estructura y validadores.
2. **Inicialización:** El formulario comienza con `status = VALID` (si no hay required) o `INVALID` (si hay).
3. **Interacción:** Cada tipeo emite `valueChanges`; `touched` se pone true en blur.
4. **Validación:** Validadores síncronos corren inmediatamente; async en `PENDING`.
5. **Submit:** Se verifica `form.invalid`; si es válido, se envía `form.value`.

---

## 10. Buenas prácticas

- **Usa FormBuilder**, no `new FormControl()` manualmente.
- **Agrupa validadores por control**, no los esparza en múltiples líneas.
- **Validadores custom en funciones puras** para poder testearse.
- **Lee estado en el template con propiedades `get`** (ej: `get email() { ... }`) para no escribir `form.get('email')` en HTML.
- **Muestra errores solo después de `touched`** para no abrumar al usuario.
- **Async validators con debounce** para no ralentizar la app.

---

## 11. Errores comunes

- Olvidar que `FormBuilder` retorna `FormGroup`, no `FormControl`.
- Olvidar `ReactiveFormsModule` en `imports` del componente.
- Crear validadores con side effects (no puros).
- No diferenciar entre `valid` (válido según reglas) e `invalid` (hay errores).
- Mostrar todos los errores a la vez; abrumar es peor que informar poco.
- No hacer `markAsTouched()` al submit inválido para mostrar errores.

---

## 12. Relación con el proyecto incremental

Este módulo se compone de tres prácticas incrementales:

**Práctica A: Formulario de signup**  
Formulario con validación built-in, custom (confirmación de contraseña), y async (verificación de email).

**Práctica B: Reutilización con FormUtils**  
Creación de una clase helper que centraliza la lógica de validación para evitar código repetitivo.

**Práctica C: Formularios dinámicos y controles especiales**  
Formulario complejo con FormArray (lista dinámica de lenguajes), radio buttons, switches y checkboxes.

Cada práctica demuestra cómo los formularios reactivos escalan de simples a complejos sin perder legibilidad ni control.

---

## 13. Referencias recomendadas

- Angular Reactive Forms Docs: https://angular.io/guide/reactive-forms
- Validators Built-in: https://angular.io/api/forms/Validators
- Custom Validators: https://angular.io/guide/form-validation#custom-validators
- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
- Documentación oficial de formularios: https://angular.dev/guide/forms/reactive-forms
- RxJS Operators: https://rxjs.dev/api
