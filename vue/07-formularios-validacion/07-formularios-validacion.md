# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 7: Formularios y Validación

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Los formularios son el mecanismo principal para capturar datos del usuario. Vue simplifica el manejo de formularios con `v-model`, que crea un **binding bidireccional** entre un input y una variable reactiva: cuando el usuario escribe, el ref se actualiza; cuando el ref cambia, el input se actualiza.

Combinado con validación reactiva (también usando `computed`), se puede construir formularios robustos sin necesidad de librerías externas en casos simples.

---

## 2. Conceptos Clave

### `v-model`: binding bidireccional

`v-model` es la abreviatura de `:value="campo"` + `@input="campo = $event.target.value"`:

```html
<!-- Equivalentes -->
<input :value="nombre" @input="nombre = $event.target.value" />
<input v-model="nombre" />
```

`v-model` se adapta automáticamente al tipo de elemento:

| Elemento | Propiedad sincronizada | Evento escuchado |
|---|---|---|
| `<input type="text">` | `value` | `input` |
| `<input type="checkbox">` | `checked` | `change` |
| `<input type="radio">` | `checked` | `change` |
| `<select>` | `value` | `change` |
| `<textarea>` | `value` | `input` |

### Modificadores de `v-model`

```html
<!-- .trim: elimina espacios al inicio y final -->
<input v-model.trim="nombre" />

<!-- .number: convierte el valor a número -->
<input v-model.number="edad" type="number" />

<!-- .lazy: sincroniza en "change" (al perder foco), no en "input" -->
<input v-model.lazy="email" />
```

### `v-model` en componentes personalizados

Los componentes pueden exponer `v-model` mediante `defineModel` (Vue 3.4+):

```vue
<!-- BaseInput.vue -->
<script setup lang="ts">
const model = defineModel<string>()
</script>
<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

```vue
<!-- Padre -->
<BaseInput v-model="nombre" />
```

---

## 3. Explicación

### Formularios con `reactive`

Para formularios con múltiples campos, es conveniente agrupar el estado en un objeto `reactive`:

```typescript
import { reactive } from 'vue'

const form = reactive({
  nombre: '',
  email: '',
  mensaje: '',
  aceptaTerminos: false
})
```

Y usar `v-model` con acceso a propiedades del objeto:

```html
<input v-model.trim="form.nombre" />
<input v-model="form.email" />
<textarea v-model="form.mensaje"></textarea>
<input type="checkbox" v-model="form.aceptaTerminos" />
```

### Validación reactiva con `computed`

```typescript
import { reactive, computed } from 'vue'

const form = reactive({ nombre: '', email: '', password: '' })

const errores = computed(() => {
  const e: Record<string, string> = {}

  if (!form.nombre.trim()) {
    e.nombre = 'El nombre es requerido'
  } else if (form.nombre.trim().length < 2) {
    e.nombre = 'El nombre debe tener al menos 2 caracteres'
  }

  if (!form.email.trim()) {
    e.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    e.email = 'El email no es válido'
  }

  if (!form.password) {
    e.password = 'La contraseña es requerida'
  } else if (form.password.length < 8) {
    e.password = 'Mínimo 8 caracteres'
  }

  return e
})

const formularioValido = computed(() =>
  Object.keys(errores.value).length === 0
)
```

### Manejo del submit

```typescript
const enviando = ref(false)
const enviado = ref(false)

async function enviarFormulario(): Promise<void> {
  if (!formularioValido.value) return

  enviando.value = true
  try {
    // Llamada a API (módulo 11)
    await new Promise(r => setTimeout(r, 1000))
    enviado.value = true
    limpiarFormulario()
  } finally {
    enviando.value = false
  }
}

function limpiarFormulario(): void {
  form.nombre = ''
  form.email = ''
  form.password = ''
}
```

### Mostrar errores con feedback visual

El patrón estándar es mostrar errores solo después del primer intento de submit (o al perder el foco del campo):

```typescript
const intentoEnvio = ref(false)
```

```html
<form @submit.prevent="handleSubmit">
  <div class="campo" :class="{ 'campo-error': intentoEnvio && errores.nombre }">
    <label for="nombre">Nombre</label>
    <input id="nombre" v-model.trim="form.nombre" type="text" />
    <span v-if="intentoEnvio && errores.nombre" class="mensaje-error">
      {{ errores.nombre }}
    </span>
  </div>
</form>
```

```typescript
function handleSubmit(): void {
  intentoEnvio.value = true
  if (!formularioValido.value) return
  enviarFormulario()
}
```

---

## 4. Ejemplos de Código

### Formulario de contacto completo

```vue
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'

const form = reactive({
  nombre: '',
  email: '',
  asunto: '',
  mensaje: ''
})

const intentoEnvio = ref(false)
const enviando = ref(false)
const enviado = ref(false)

const errores = computed(() => {
  const e: Record<string, string> = {}
  if (!form.nombre.trim()) e.nombre = 'Requerido'
  if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email inválido'
  if (!form.asunto) e.asunto = 'Selecciona un asunto'
  if (form.mensaje.trim().length < 10) e.mensaje = 'Mínimo 10 caracteres'
  return e
})

const valido = computed(() => Object.keys(errores.value).length === 0)

async function enviar() {
  intentoEnvio.value = true
  if (!valido.value) return
  enviando.value = true
  await new Promise(r => setTimeout(r, 800))
  enviado.value = true
  enviando.value = false
}
</script>

<template>
  <div v-if="enviado" class="exito">¡Mensaje enviado correctamente!</div>

  <form v-else @submit.prevent="enviar" class="formulario">
    <div class="campo" :class="{ error: intentoEnvio && errores.nombre }">
      <label>Nombre</label>
      <input v-model.trim="form.nombre" type="text" placeholder="Tu nombre" />
      <span class="error-msg" v-if="intentoEnvio && errores.nombre">
        {{ errores.nombre }}
      </span>
    </div>

    <div class="campo" :class="{ error: intentoEnvio && errores.email }">
      <label>Email</label>
      <input v-model="form.email" type="email" placeholder="tu@email.com" />
      <span class="error-msg" v-if="intentoEnvio && errores.email">
        {{ errores.email }}
      </span>
    </div>

    <div class="campo">
      <label>Asunto</label>
      <select v-model="form.asunto">
        <option value="">Selecciona...</option>
        <option value="consulta">Consulta</option>
        <option value="soporte">Soporte</option>
        <option value="otro">Otro</option>
      </select>
    </div>

    <div class="campo">
      <label>Mensaje</label>
      <textarea v-model="form.mensaje" rows="4" placeholder="Tu mensaje..."></textarea>
    </div>

    <button type="submit" :disabled="enviando">
      {{ enviando ? 'Enviando...' : 'Enviar mensaje' }}
    </button>
  </form>
</template>
```

---

## 5. Buenas Prácticas

- **Agrupa el estado del formulario en `reactive`**: más limpio que múltiples refs separados.
- **Muestra errores solo después del primer submit**: no frustrar al usuario mientras escribe.
- **Deshabilita el botón durante el envío**: evita submits dobles.
- **Limpia el formulario después de un envío exitoso**: resetea el estado y `intentoEnvio`.
- **Usa `.trim` en campos de texto**: elimina espacios accidentales.
- **Usa `.number` en campos numéricos**: evita recibir strings donde esperabas números.
- **No implementes validación solo en frontend**: el backend debe validar también.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| `v-model` no funciona en `<select>` | Olvidar el `value` en `<option>` | Agregar `:value` o `value` a cada `<option>` |
| El formulario hace reload | Sin `@submit.prevent` | Usar `@submit.prevent="handler"` |
| Errores se muestran antes de que el usuario interactúe | Sin `intentoEnvio` | Condicionar con `intentoEnvio && errores.campo` |
| Datos como string cuando se esperan números | `v-model` sin `.number` en inputs numéricos | Usar `v-model.number` |
| Formulario no se limpia después del submit | Olvidar resetear el objeto `reactive` | Asignar `form.campo = ''` o usar `Object.assign` |

---

## 7. Relación con el Proyecto Incremental

En este módulo se agrega un formulario de "Agregar producto" al catálogo. El usuario puede ingresar un nuevo producto y aparecerá en el catálogo con validación completa.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── components/
│   ├── ProductCard.vue
│   ├── BaseCard.vue
│   ├── EmptyState.vue
│   └── ProductForm.vue    ← Nuevo: formulario para agregar productos
└── App.vue
```

---

## 8. Referencias

- [Vue 3 - Binding de formularios](https://vuejs.org/guide/essentials/forms)
- [Vue 3 - `v-model` en componentes](https://vuejs.org/guide/components/v-model)
- [Vue 3 - `defineModel`](https://vuejs.org/api/sfc-script-setup#definemodel)
- [Vue 3 - Modificadores de `v-model`](https://vuejs.org/guide/essentials/forms#modifiers)
