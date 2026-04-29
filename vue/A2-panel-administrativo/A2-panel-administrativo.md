# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo A2: Panel Administrativo

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Un panel administrativo (dashboard) es la interfaz que permite a los administradores gestionar el contenido de una aplicación: ver, crear, editar y eliminar registros. Este módulo implementa un CRUD completo con tabla de datos, modales de formulario y confirmación de acciones destructivas.

---

## 2. Conceptos Clave

### CRUD

| Operación | HTTP | Acción en la UI |
|---|---|---|
| **C**reate | POST | Modal de creación |
| **R**ead | GET | Tabla con datos |
| **U**pdate | PUT/PATCH | Modal de edición (datos pre-cargados) |
| **D**elete | DELETE | Confirmación + eliminación |

### Modales en Vue

Un modal es un componente que se renderiza sobre el contenido principal. En Vue se implementa con `v-if` y `<Teleport>` (para evitar problemas de z-index y desbordamiento CSS):

```vue
<Teleport to="body">
  <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrar">
    <div class="modal-contenido">
      <slot />
    </div>
  </div>
</Teleport>
```

### Layout de dashboard

```vue
<!-- Layout de 2 columnas: sidebar + contenido -->
<div class="dashboard">
  <aside class="sidebar">
    <NavSidebar />
  </aside>
  <main class="contenido">
    <RouterView />
  </main>
</div>
```

---

## 3. Explicación

### Componente modal genérico

```vue
<!-- BaseModal.vue -->
<script setup lang="ts">
defineProps<{
  titulo: string
  visible: boolean
  ancho?: string
}>()

const emit = defineEmits<{ cerrar: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="titulo"
        @click.self="emit('cerrar')"
      >
        <div class="modal-box" :style="{ maxWidth: ancho ?? '500px' }">
          <header class="modal-header">
            <h2>{{ titulo }}</h2>
            <button
              class="btn-cerrar"
              @click="emit('cerrar')"
              aria-label="Cerrar modal"
            >×</button>
          </header>
          <div class="modal-body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

### Tabla de datos con acciones

```vue
<template>
  <table class="data-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Categoría</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.title }}</td>
        <td>{{ formatPrecio(item.price) }}</td>
        <td>
          <span class="badge">{{ item.category }}</span>
        </td>
        <td class="acciones">
          <button class="btn-editar" @click="abrirEditar(item)">✏️ Editar</button>
          <button class="btn-eliminar" @click="confirmarEliminar(item.id)">🗑️ Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

### Paginación del lado del cliente

```typescript
const ITEMS_POR_PAGINA = 10
const paginaActual = ref(1)

const itemsPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_POR_PAGINA
  return items.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})

const totalPaginas = computed(() =>
  Math.ceil(items.value.length / ITEMS_POR_PAGINA)
)
```

### Formulario de creación/edición reutilizable

```typescript
// El mismo formulario sirve para crear y editar
// La diferencia es si tiene datos pre-cargados
interface FormularioProducto {
  title: string
  price: number
  description: string
  category: string
}

const formularioVacio: FormularioProducto = {
  title: '', price: 0, description: '', category: ''
}

const form = reactive<FormularioProducto>({ ...formularioVacio })
const productoEditando = ref<number | null>(null)

function abrirCrear(): void {
  Object.assign(form, formularioVacio)
  productoEditando.value = null
  mostrarModal.value = true
}

function abrirEditar(producto: Product): void {
  Object.assign(form, {
    title: producto.title,
    price: producto.price,
    description: producto.description,
    category: producto.category
  })
  productoEditando.value = producto.id
  mostrarModal.value = true
}
```

### Estado optimista (Optimistic UI)

Para mejor UX, actualizamos la UI inmediatamente sin esperar la respuesta del servidor:

```typescript
async function eliminar(id: number): Promise<void> {
  // 1. Guardar una copia por si falla
  const copia = [...items.value]

  // 2. Actualizar la UI inmediatamente (optimistic)
  items.value = items.value.filter(i => i.id !== id)

  try {
    // 3. Llamar a la API
    await api.delete(`/products/${id}`)
  } catch {
    // 4. Si falla, revertir
    items.value = copia
    mostrarError('No se pudo eliminar el producto')
  }
}
```

---

## 4. Estructura del Panel

```
ppw-vue-app/src/
├── layouts/
│   ├── MainLayout.vue      ← Layout público (navbar horizontal)
│   └── AdminLayout.vue     ← Layout admin (sidebar + contenido)
├── views/
│   └── admin/
│       ├── AdminDashboard.vue   ← Vista resumen con métricas
│       └── AdminProductos.vue   ← CRUD de productos
└── components/
    └── admin/
        ├── StatsCard.vue        ← Tarjeta de métrica
        └── BaseModal.vue        ← Modal genérico
```

---

## 5. Buenas Prácticas

- **Confirmar acciones destructivas**: nunca elimines sin un modal de confirmación.
- **Estado optimista para acciones frecuentes**: mejora la percepción de velocidad.
- **Paginación del lado del cliente para datasets pequeños**: reduce complejidad.
- **Un componente modal genérico**: reutilizable para crear, editar y confirmar.
- **Acceso restringido al panel**: la ruta `/admin` debe tener `meta: { requiresAuth: true, role: 'admin' }`.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| El modal se corta por `overflow: hidden` | El contenedor padre tiene `overflow` | Usar `<Teleport to="body">` |
| El modal se cierra al hacer clic dentro | Falta `@click.self` en el overlay | Agregar `@click.self` solo en el overlay |
| La paginación no se resetea al buscar | No se resetea `paginaActual` | Agregar `@input="paginaActual = 1"` al buscador |
| Form con datos del item anterior al crear | No se limpia el `reactive` | Usar `Object.assign(form, formularioVacio)` |

---

## 7. Referencias

- [Vue 3 - Teleport](https://vuejs.org/guide/built-ins/teleport)
- [Vue 3 - Transitions](https://vuejs.org/guide/built-ins/transition)
- [ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
