# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 8: Formularios y Validacion

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Construir formularios controlados en React con validacion en tiempo real. Comprender la diferencia entre componentes controlados y no controlados, implementar validaciones sin librerias externas, y manejar el ciclo completo de un formulario: entrada, validacion, envio y respuesta.

---

## 2. Explicacion Conceptual

### Componentes controlados

En React, los formularios pueden manejarse de dos formas. La forma recomendada es el **componente controlado**, donde React es la fuente de verdad del valor del campo:

```tsx
function FormularioControlado() {
  const [nombre, setNombre] = useState('')

  return (
    <input
      value={nombre}          // React controla el valor
      onChange={e => setNombre(e.target.value)}  // actualiza el estado
    />
  )
}
```

En un componente **no controlado**, el DOM mantiene el valor y se accede con `ref`:

```tsx
function FormularioNoControlado() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    console.log(inputRef.current?.value) // leer del DOM
  }

  return <input ref={inputRef} />
}
```

Se prefieren los **controlados** porque:
- El estado del formulario es siempre accesible en React
- Permite validacion en tiempo real
- Facilita transformar o restringir la entrada (ej: solo mayusculas)

### Estado de un formulario completo

```tsx
interface FormState {
  nombre: string
  email: string
  mensaje: string
}

interface FormErrors {
  nombre?: string
  email?: string
  mensaje?: string
}

function Formulario() {
  const [form, setForm] = useState<FormState>({ nombre: '', email: '', mensaje: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    // Limpiar error del campo al escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // ...
}
```

### Validacion manual

```tsx
function validarFormulario(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es requerido'
  } else if (form.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres'
  }

  if (!form.email.trim()) {
    errors.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'El email no tiene un formato valido'
  }

  if (!form.mensaje.trim()) {
    errors.mensaje = 'El mensaje es requerido'
  } else if (form.mensaje.trim().length < 10) {
    errors.mensaje = 'El mensaje debe tener al menos 10 caracteres'
  }

  return errors
}
```

### Manejo del envio

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault() // Evitar recarga de la pagina

  const erroresValidacion = validarFormulario(form)
  if (Object.keys(erroresValidacion).length > 0) {
    setErrors(erroresValidacion)
    return // No enviar si hay errores
  }

  setEnviando(true)
  try {
    await enviarFormulario(form) // llamada a la API
    setExito(true)
    setForm({ nombre: '', email: '', mensaje: '' }) // limpiar formulario
  } catch (err) {
    setErrors({ nombre: 'Error al enviar. Intenta de nuevo.' })
  } finally {
    setEnviando(false)
  }
}
```

---

## 3. Fundamento Tecnico

### Input helper generico

Para evitar repetir el `onChange` en cada campo, se puede crear un handler generico que use el atributo `name`:

```tsx
// El atributo 'name' del input debe coincidir con la clave del estado
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
}

// Uso en cada campo:
<input name="nombre" value={form.nombre} onChange={handleChange} />
<input name="email" value={form.email} onChange={handleChange} />
<textarea name="mensaje" value={form.mensaje} onChange={handleChange} />
```

### Validacion por campo al perder el foco (onBlur)

```tsx
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  const { name } = e.target
  const erroresActuales = validarFormulario(form)
  if (erroresActuales[name as keyof FormErrors]) {
    setErrors(prev => ({ ...prev, [name]: erroresActuales[name as keyof FormErrors] }))
  }
}
```

### Checkboxes y radios

```tsx
// Checkbox — usar `checked` en lugar de `value`
<input
  type="checkbox"
  name="aceptaTerminos"
  checked={form.aceptaTerminos}
  onChange={e => setForm(prev => ({ ...prev, aceptaTerminos: e.target.checked }))}
/>

// Radio group
<input
  type="radio"
  name="metodoEnvio"
  value="express"
  checked={form.metodoEnvio === 'express'}
  onChange={handleChange}
/>
```

---

## 4. Ejemplos de Codigo

### Componente de campo con error integrado

```tsx
interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function FormField({ label, name, type = 'text', value, error, onChange }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label htmlFor={name} style={{ fontWeight: 500, fontSize: '0.9rem' }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        style={{
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          border: error ? '1.5px solid #dc2626' : '1.5px solid #e5e7eb',
          fontSize: '1rem',
        }}
      />
      {error && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{error}</span>}
    </div>
  )
}
```

---

## 5. Buenas Practicas

- **Usar `e.preventDefault()` en `onSubmit`**: evita la recarga de pagina.
- **Validar en `onSubmit`, no solo en `onChange`**: para no molestar al usuario mientras escribe.
- **Mostrar errores despues de que el usuario toca el campo** (`onBlur`): mejor UX que mostrarlos de inmediato.
- **Deshabilitar el boton de envio mientras `enviando` es true**: evita dobles envios.
- **Usar `htmlFor` en `<label>` apuntando al `id` del input**: accesibilidad y clic para enfocar el campo.

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| El formulario recarga la pagina al enviar | Olvidar `e.preventDefault()` | Agregar `e.preventDefault()` al inicio de `handleSubmit` |
| Warning "A component is changing an uncontrolled input to controlled" | El valor inicial es `undefined` en lugar de `''` | Inicializar el estado con strings vacios |
| Los checkboxes no responden al click | Usar `value` en lugar de `checked` | Usar `checked={form.campo}` y `e.target.checked` |

---

## 7. Relacion con el Proyecto Incremental

En este modulo se construye un formulario de **filtros avanzados** para ReactStore: rango de precio, rating minimo y categoria. Es un ejemplo practico de formulario sin envio a servidor. Adicionalmente, los conceptos aplican directamente al formulario de login del modulo 13.

> Ver solucion de referencia en: `react/solver/react-store/src/components/FilterPanel.tsx`

---

## 8. Referencias

- [Formularios — React Docs](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
- [Reaccionar a inputs con estado — React Docs](https://react.dev/learn/reacting-to-input-with-state)
- [useRef — React Docs](https://react.dev/reference/react/useRef)
