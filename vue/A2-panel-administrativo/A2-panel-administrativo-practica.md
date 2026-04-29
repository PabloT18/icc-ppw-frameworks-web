# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica A2: Panel Administrativo

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Práctico

Construir un panel administrativo con layout de sidebar, tabla de productos con paginación, y operaciones CRUD usando modales. Los datos provienen de la FakeStore API; las operaciones de escritura (crear/editar/eliminar) se simulan localmente sin persistencia real.

---

## Contexto

Se extiende el proyecto `ppw-vue-app` con un área `/admin` protegida por el guard de autenticación y con rol `admin`. El `MainLayout` existente se mantiene para el área pública.

---

## Archivos que se van a crear

```
ppw-vue-app/src/
├── layouts/
│   └── AdminLayout.vue              ← Crear
├── components/admin/
│   ├── BaseModal.vue                ← Crear
│   └── ConfirmDialog.vue            ← Crear
└── views/admin/
    ├── AdminDashboard.vue           ← Crear
    └── AdminProductos.vue           ← Crear
```

---

## Paso 1: Crear `AdminLayout.vue`

Crea `src/layouts/AdminLayout.vue`:

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { usuario } = storeToRefs(auth)
const router = useRouter()

function cerrarSesion() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-wrapper">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="verde">Vue</span>Admin
      </div>
      <nav class="sidebar-nav">
        <RouterLink to="/admin" :exact-active-class="'activo'" class="nav-item">
          📊 Dashboard
        </RouterLink>
        <RouterLink to="/admin/productos" active-class="activo" class="nav-item">
          📦 Productos
        </RouterLink>
        <RouterLink to="/" class="nav-item">
          🏠 Ir a la tienda
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="usuario-info">
          <span class="usuario-nombre">{{ usuario?.nombre }}</span>
          <span class="usuario-rol">{{ usuario?.rol }}</span>
        </div>
        <button class="btn-salir" @click="cerrarSesion">Salir</button>
      </div>
    </aside>

    <div class="admin-contenido">
      <header class="admin-header">
        <slot name="header">
          <h1>Panel Administrativo</h1>
        </slot>
      </header>
      <main class="admin-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper { display: flex; min-height: 100vh; }

.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #35495E;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  flex-shrink: 0;
}

.sidebar-logo { font-size: 1.25rem; font-weight: 700; margin-bottom: 2rem; text-align: center; }
.verde { color: #42B883; }

.sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
.nav-item {
  display: block;
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover, .nav-item.activo {
  background: rgba(66, 184, 131, 0.2);
  color: #42B883;
}

.sidebar-footer { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; }
.usuario-info { display: flex; flex-direction: column; margin-bottom: 0.75rem; }
.usuario-nombre { font-size: 0.875rem; font-weight: 600; }
.usuario-rol { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
.btn-salir {
  width: 100%; padding: 0.5rem;
  background: rgba(255,255,255,0.1);
  color: white; border: none; border-radius: 5px;
  cursor: pointer; font-size: 0.875rem;
  transition: background 0.15s;
}
.btn-salir:hover { background: rgba(255,255,255,0.2); }

.admin-contenido { flex: 1; display: flex; flex-direction: column; background: #f5f5f5; }
.admin-header { background: white; padding: 1rem 1.5rem; border-bottom: 1px solid #eee; }
.admin-header h1 { font-size: 1.25rem; color: #35495E; }
.admin-main { padding: 1.5rem; }
</style>
```

---

## Paso 2: Crear `BaseModal.vue`

Crea `src/components/admin/BaseModal.vue`:

```vue
<script setup lang="ts">
defineProps<{ titulo: string; visible: boolean; ancho?: string }>()
const emit = defineEmits<{ cerrar: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="overlay"
        role="dialog"
        aria-modal="true"
        @click.self="emit('cerrar')"
      >
        <div class="modal-box" :style="{ maxWidth: ancho || '520px' }">
          <header class="modal-header">
            <h3>{{ titulo }}</h3>
            <button class="btn-x" @click="emit('cerrar')" aria-label="Cerrar">×</button>
          </header>
          <div class="modal-body"><slot /></div>
          <footer v-if="$slots.footer" class="modal-footer"><slot name="footer" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.modal-box {
  background: white; border-radius: 10px;
  width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid #eee; }
.modal-header h3 { font-size: 1rem; color: #35495E; }
.btn-x { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999; line-height: 1; }
.modal-body { padding: 1.25rem; }
.modal-footer { padding: 1rem 1.25rem; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 0.75rem; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box { transform: scale(0.95); }
</style>
```

---

## Paso 3: Crear `AdminProductos.vue`

Crea `src/views/admin/AdminProductos.vue`:

```vue
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import BaseModal from '@/components/admin/BaseModal.vue'
import { getProductos } from '@/services/productos.service'
import { formatPrecio } from '@/utils/formatters'
import type { Product } from '@/types/product'

// Estado
const productos = ref<Product[]>([])
const cargando = ref(true)
const busqueda = ref('')
const paginaActual = ref(1)
const POR_PAGINA = 8

// Modal
const modalVisible = ref(false)
const modalEliminar = ref(false)
const idEliminar = ref<number | null>(null)
const modoEditar = ref(false)

const form = reactive({ title: '', price: 0, category: '', description: '' })

// Carga inicial
onMounted(async () => {
  productos.value = await getProductos()
  cargando.value = false
})

// Filtrado y paginación
const productosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase()
  return productos.value.filter(p =>
    p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  )
})

const totalPaginas = computed(() => Math.ceil(productosFiltrados.value.length / POR_PAGINA))

const productosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * POR_PAGINA
  return productosFiltrados.value.slice(inicio, inicio + POR_PAGINA)
})

// Acciones CRUD
function abrirCrear(): void {
  Object.assign(form, { title: '', price: 0, category: '', description: '' })
  modoEditar.value = false
  modalVisible.value = true
}

function abrirEditar(p: Product): void {
  Object.assign(form, { title: p.title, price: p.price, category: p.category, description: p.description })
  modoEditar.value = true
  modalVisible.value = true
}

function guardar(): void {
  // Simulado: en producción se llamaría a la API
  if (modoEditar.value) {
    alert(`Producto actualizado (simulado): ${form.title}`)
  } else {
    alert(`Producto creado (simulado): ${form.title}`)
  }
  modalVisible.value = false
}

function confirmarEliminar(id: number): void {
  idEliminar.value = id
  modalEliminar.value = true
}

function ejecutarEliminar(): void {
  if (idEliminar.value !== null) {
    productos.value = productos.value.filter(p => p.id !== idEliminar.value)
  }
  modalEliminar.value = false
  idEliminar.value = null
}
</script>

<template>
  <div>
    <div class="toolbar">
      <input v-model="busqueda" placeholder="Buscar productos..." class="input-busqueda" @input="paginaActual = 1" />
      <button class="btn-crear" @click="abrirCrear">+ Nuevo Producto</button>
    </div>

    <div v-if="cargando" class="cargando">Cargando...</div>

    <table v-else class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Rating</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in productosPaginados" :key="p.id">
          <td class="td-id">{{ p.id }}</td>
          <td class="td-titulo">{{ p.title.slice(0, 45) }}{{ p.title.length > 45 ? '...' : '' }}</td>
          <td class="td-precio">{{ formatPrecio(p.price) }}</td>
          <td><span class="badge">{{ p.category }}</span></td>
          <td>⭐ {{ p.rating.rate }}</td>
          <td class="td-acciones">
            <button class="btn-edit" @click="abrirEditar(p)">✏️</button>
            <button class="btn-del" @click="confirmarEliminar(p.id)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="paginacion" v-if="totalPaginas > 1">
      <button :disabled="paginaActual === 1" @click="paginaActual--">‹</button>
      <button
        v-for="p in totalPaginas" :key="p"
        :class="{ activo: p === paginaActual }"
        @click="paginaActual = p"
      >{{ p }}</button>
      <button :disabled="paginaActual === totalPaginas" @click="paginaActual++">›</button>
    </div>

    <!-- Modal crear/editar -->
    <BaseModal
      :titulo="modoEditar ? 'Editar Producto' : 'Nuevo Producto'"
      :visible="modalVisible"
      @cerrar="modalVisible = false"
    >
      <div class="form-campo">
        <label>Título</label>
        <input v-model="form.title" type="text" />
      </div>
      <div class="form-campo">
        <label>Precio</label>
        <input v-model.number="form.price" type="number" min="0" step="0.01" />
      </div>
      <div class="form-campo">
        <label>Categoría</label>
        <input v-model="form.category" type="text" />
      </div>
      <div class="form-campo">
        <label>Descripción</label>
        <textarea v-model="form.description" rows="3"></textarea>
      </div>
      <template #footer>
        <button class="btn-cancelar" @click="modalVisible = false">Cancelar</button>
        <button class="btn-guardar" @click="guardar">Guardar</button>
      </template>
    </BaseModal>

    <!-- Modal confirmación eliminar -->
    <BaseModal titulo="Confirmar eliminación" :visible="modalEliminar" @cerrar="modalEliminar = false">
      <p>¿Estás seguro de que deseas eliminar el producto #{{ idEliminar }}?</p>
      <p style="color:#e74c3c; font-size:0.875rem; margin-top:0.5rem;">Esta acción no se puede deshacer.</p>
      <template #footer>
        <button class="btn-cancelar" @click="modalEliminar = false">Cancelar</button>
        <button class="btn-eliminar-confirm" @click="ejecutarEliminar">Eliminar</button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.toolbar { display: flex; gap: 1rem; margin-bottom: 1rem; }
.input-busqueda { flex: 1; padding: 0.6rem 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; }
.btn-crear { padding: 0.6rem 1.25rem; background: #42B883; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
.cargando { text-align: center; padding: 3rem; color: #666; }
.tabla { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.07); }
.tabla th { background: #35495E; color: white; padding: 0.75rem; text-align: left; font-size: 0.85rem; }
.tabla td { padding: 0.7rem; border-bottom: 1px solid #f0f0f0; font-size: 0.875rem; }
.tabla tr:hover td { background: #f9f9f9; }
.td-id { color: #999; width: 50px; }
.td-titulo { max-width: 280px; }
.td-precio { font-weight: 600; color: #42B883; }
.td-acciones { white-space: nowrap; }
.badge { background: #e8f5ee; color: #42B883; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.78rem; }
.btn-edit, .btn-del { border: none; background: none; cursor: pointer; padding: 0.3rem 0.4rem; border-radius: 4px; font-size: 0.9rem; }
.btn-edit:hover { background: #e8f5ee; }
.btn-del:hover { background: #ffeaea; }

.paginacion { display: flex; gap: 0.35rem; justify-content: center; margin-top: 1rem; }
.paginacion button { padding: 0.4rem 0.7rem; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 0.875rem; }
.paginacion button.activo { background: #42B883; color: white; border-color: #42B883; }
.paginacion button:disabled { opacity: 0.4; cursor: not-allowed; }

.form-campo { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.75rem; }
.form-campo label { font-size: 0.85rem; font-weight: 600; color: #555; }
.form-campo input, .form-campo textarea { padding: 0.55rem 0.7rem; border: 1px solid #ddd; border-radius: 5px; font-size: 0.9rem; }
.form-campo textarea { resize: vertical; }

.btn-cancelar { padding: 0.55rem 1rem; background: white; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; }
.btn-guardar { padding: 0.55rem 1.25rem; background: #42B883; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; }
.btn-eliminar-confirm { padding: 0.55rem 1.25rem; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; }
</style>
```

---

## Paso 4: Agregar las rutas de administración al router

En `src/router/index.ts`, agrega las rutas de admin:

```typescript
{
  path: '/admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboard.vue') },
    { path: 'productos', name: 'admin-productos', component: () => import('@/views/admin/AdminProductos.vue') }
  ]
}
```

---

## Validaciones Esperadas

- [ ] Acceder a `/admin` sin sesión redirige a `/login`
- [ ] El sidebar muestra el nombre y rol del usuario autenticado
- [ ] La tabla muestra los productos de la API
- [ ] El buscador filtra por título y categoría en tiempo real
- [ ] La paginación funciona (8 productos por página)
- [ ] El modal de crear se abre vacío; el de editar con datos pre-cargados
- [ ] El modal de eliminar muestra el ID del producto y requiere confirmación
- [ ] Después de eliminar, el producto desaparece de la tabla

---

## Commits Sugeridos

```bash
git add src/layouts/AdminLayout.vue src/components/admin/
git commit -m "feat: layout de administración con sidebar (A2)"
git add src/views/admin/ src/router/index.ts
git commit -m "feat: CRUD de productos en panel administrativo con tabla y modales"
```
