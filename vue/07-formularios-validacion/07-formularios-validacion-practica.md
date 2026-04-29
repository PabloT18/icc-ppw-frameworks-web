# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 7: Formularios y Validación

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Práctico

Crear un formulario para agregar productos al catálogo con validación reactiva, feedback visual y manejo del submit. Al finalizar, el usuario podrá agregar nuevos productos que aparecerán en la grilla del catálogo.

---

## Contexto

El catálogo actualmente muestra productos cargados en `onMounted`. En esta práctica se crea un componente `ProductForm.vue` con formulario, validación y comunicación al padre mediante emit.

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/src/
├── components/
│   └── ProductForm.vue    ← Crear
└── App.vue                ← Modificar: mostrar/ocultar formulario, agregar productos
```

---

## Paso 1: Crear `ProductForm.vue`

Crea `src/components/ProductForm.vue`:

```vue
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import type { Product } from '@/types/product'

const emit = defineEmits<{
  guardar: [producto: Omit<Product, 'id'>]
  cancelar: []
}>()

const form = reactive({
  titulo: '',
  descripcion: '',
  precio: '',
  disponible: true
})

const intentoEnvio = ref(false)

const errores = computed(() => {
  const e: Record<string, string> = {}

  if (!form.titulo.trim()) {
    e.titulo = 'El título es requerido'
  } else if (form.titulo.trim().length < 3) {
    e.titulo = 'Mínimo 3 caracteres'
  }

  if (!form.descripcion.trim()) {
    e.descripcion = 'La descripción es requerida'
  }

  const precioNum = parseFloat(form.precio)
  if (!form.precio) {
    e.precio = 'El precio es requerido'
  } else if (isNaN(precioNum) || precioNum <= 0) {
    e.precio = 'El precio debe ser un número positivo'
  }

  return e
})

const formularioValido = computed(() =>
  Object.keys(errores.value).length === 0
)

function handleSubmit(): void {
  intentoEnvio.value = true
  if (!formularioValido.value) return

  emit('guardar', {
    titulo: form.titulo.trim(),
    descripcion: form.descripcion.trim(),
    precio: parseFloat(form.precio),
    disponible: form.disponible
  })

  // Limpiar formulario después de guardar
  form.titulo = ''
  form.descripcion = ''
  form.precio = ''
  form.disponible = true
  intentoEnvio.value = false
}

function handleCancelar(): void {
  emit('cancelar')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="product-form" novalidate>
    <h3 class="form-titulo">Nuevo Producto</h3>

    <!-- Título -->
    <div class="campo" :class="{ 'campo-error': intentoEnvio && errores.titulo }">
      <label for="titulo">Título *</label>
      <input
        id="titulo"
        v-model.trim="form.titulo"
        type="text"
        placeholder="Nombre del producto"
      />
      <span class="error-msg" v-if="intentoEnvio && errores.titulo">
        {{ errores.titulo }}
      </span>
    </div>

    <!-- Descripción -->
    <div class="campo" :class="{ 'campo-error': intentoEnvio && errores.descripcion }">
      <label for="descripcion">Descripción *</label>
      <textarea
        id="descripcion"
        v-model.trim="form.descripcion"
        rows="2"
        placeholder="Breve descripción del producto"
      ></textarea>
      <span class="error-msg" v-if="intentoEnvio && errores.descripcion">
        {{ errores.descripcion }}
      </span>
    </div>

    <!-- Precio -->
    <div class="campo" :class="{ 'campo-error': intentoEnvio && errores.precio }">
      <label for="precio">Precio (USD) *</label>
      <input
        id="precio"
        v-model="form.precio"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0.00"
      />
      <span class="error-msg" v-if="intentoEnvio && errores.precio">
        {{ errores.precio }}
      </span>
    </div>

    <!-- Disponible -->
    <div class="campo campo-check">
      <label>
        <input type="checkbox" v-model="form.disponible" />
        Disponible en stock
      </label>
    </div>

    <!-- Acciones -->
    <div class="form-acciones">
      <button type="button" class="btn-cancelar" @click="handleCancelar">
        Cancelar
      </button>
      <button type="submit" class="btn-guardar">
        Agregar Producto
      </button>
    </div>
  </form>
</template>

<style scoped>
.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-titulo {
  color: #35495E;
  margin: 0 0 0.5rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.campo label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
}

.campo input,
.campo textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.campo input:focus,
.campo textarea:focus {
  outline: none;
  border-color: #42B883;
}

.campo-error input,
.campo-error textarea {
  border-color: #e74c3c;
}

.error-msg {
  font-size: 0.8rem;
  color: #e74c3c;
}

.campo-check {
  flex-direction: row;
  align-items: center;
}

.campo-check label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-acciones {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn-cancelar {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancelar:hover {
  background: #f5f5f5;
}

.btn-guardar {
  padding: 0.5rem 1.25rem;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-guardar:hover {
  background: #35495E;
}
</style>
```

**Puntos clave de este componente:**
- `Omit<Product, 'id'>`: el formulario no genera el `id`; el padre lo asigna
- `novalidate` en el `<form>`: desactiva la validación del navegador para controlar la nuestra
- `intentoEnvio` evita mostrar errores antes de que el usuario toque el formulario

---

## Paso 2: Integrar `ProductForm` en `App.vue`

En `src/App.vue`, importa el componente y agrega la lógica para mostrar/ocultar el formulario:

```typescript
import ProductForm from '@/components/ProductForm.vue'

// Control de visibilidad del formulario
const mostrarFormulario = ref(false)

// ID autoincremental para nuevos productos
let nextId = 5

function agregarProducto(datos: Omit<Product, 'id'>): void {
  productos.value.push({ id: nextId++, ...datos })
  mostrarFormulario.value = false
}
```

En el template, agrega el botón y el formulario en la sección del catálogo:

```html
<section class="seccion">
  <div class="seccion-header">
    <h2>Catálogo</h2>
    <button class="btn-nuevo" @click="mostrarFormulario = !mostrarFormulario">
      {{ mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Producto' }}
    </button>
  </div>

  <!-- Formulario (toggle con v-show para mantener estado al ocultar) -->
  <div class="form-container" v-show="mostrarFormulario">
    <ProductForm
      @guardar="agregarProducto"
      @cancelar="mostrarFormulario = false"
    />
  </div>

  <!-- Filtros y grid... (código del módulo anterior) -->
</section>
```

Estilos adicionales:

```css
.seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-nuevo {
  padding: 0.5rem 1rem;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-nuevo:hover {
  background: #35495E;
}

.form-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
}
```

---

## Paso 3: Verificar el flujo completo

El flujo debe ser:

1. Usuario hace clic en "**+ Nuevo Producto**" → aparece el formulario
2. Usuario deja campos vacíos y hace clic en "**Agregar Producto**" → aparecen los errores
3. Usuario completa el formulario correctamente → producto se agrega al array
4. El formulario se oculta y el nuevo producto aparece en el grid
5. El botón muestra "**✕ Cancelar**" mientras el formulario está abierto

> Captura pendiente: formulario abierto con campos llenos y el nuevo producto ya visible en la grilla de fondo.

---

## Validaciones Esperadas

- [ ] El formulario solo muestra errores después de hacer clic en "Agregar"
- [ ] Los tres campos requeridos tienen validación visible
- [ ] El precio acepta decimales y rechaza valores negativos
- [ ] Un nuevo producto aparece en el catálogo inmediatamente al guardarlo
- [ ] El formulario se resetea después de guardar exitosamente
- [ ] El botón "Cancelar" cierra el formulario sin guardar
- [ ] `v-show` mantiene el estado del formulario al ocultarlo (no se pierde lo escrito si el usuario usa "Cancelar" y vuelve a abrir)

---

## Entregables

- `src/components/ProductForm.vue` con validación reactiva completa
- `src/App.vue` actualizado con integración del formulario

---

## Commits Sugeridos

```bash
git add src/components/ProductForm.vue
git commit -m "feat: formulario ProductForm con validación reactiva (módulo 07)"
git add src/App.vue
git commit -m "feat: integrar ProductForm en App.vue con toggle de visibilidad"
```
