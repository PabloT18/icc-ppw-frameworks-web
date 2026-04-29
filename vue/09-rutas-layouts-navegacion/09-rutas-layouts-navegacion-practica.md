# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 9: Vue Router — Rutas, Layouts y Navegación

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Convertir el proyecto de una SPA de una sola vista a una aplicación multi-página con Vue Router. Se crearán vistas separadas para el catálogo, el carrito y la página principal, unidas por un layout con barra de navegación.

---

## Contexto

El proyecto actualmente tiene todo en `App.vue`. En esta práctica se:
1. Instala Vue Router 4
2. Se organiza la estructura en `views/` y `layouts/`
3. Se migra el contenido a vistas dedicadas
4. Se agrega navegación entre páginas

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/src/
├── router/
│   └── index.ts              ← Crear
├── layouts/
│   └── MainLayout.vue        ← Crear
├── views/
│   ├── HomeView.vue           ← Crear
│   ├── ProductosView.vue      ← Crear (migrar catálogo de App.vue)
│   ├── CarritoView.vue        ← Crear (migrar carrito de App.vue)
│   └── NotFoundView.vue       ← Crear
├── components/
│   └── NavBar.vue             ← Crear
├── App.vue                    ← Simplificar
└── main.ts                    ← Agregar router
```

---

## Paso 1: Instalar Vue Router

```bash
pnpm add vue-router@4
```

Verifica en `package.json` que aparece:
```json
"vue-router": "^4.x.x"
```

---

## Paso 2: Crear el router

Crea `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'productos',
          name: 'productos',
          component: () => import('@/views/ProductosView.vue')
        },
        {
          path: 'carrito',
          name: 'carrito',
          component: () => import('@/views/CarritoView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

export default router
```

---

## Paso 3: Registrar el router en `main.ts`

```typescript
import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

---

## Paso 4: Simplificar `App.vue`

`App.vue` ahora solo es el punto de montaje del router:

```vue
<script setup lang="ts">
// App.vue ya no tiene lógica; todo está en los composables y las vistas
</script>

<template>
  <RouterView />
</template>
```

---

## Paso 5: Crear `NavBar.vue`

Crea `src/components/NavBar.vue`:

```vue
<script setup lang="ts">
import { useCarrito } from '@/composables/useCarrito'
const { cantidadItems } = useCarrito()
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="navbar-logo">
      <span class="logo-vue">Vue</span>App
    </RouterLink>

    <div class="navbar-links">
      <RouterLink to="/" :exact-active-class="'link-activo'" active-class="">
        Inicio
      </RouterLink>
      <RouterLink to="/productos" active-class="link-activo">
        Productos
      </RouterLink>
      <RouterLink to="/carrito" class="link-carrito" active-class="link-activo">
        🛒
        <span v-if="cantidadItems > 0" class="carrito-badge">
          {{ cantidadItems }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: #35495E;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.navbar-logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
}

.logo-vue {
  color: #42B883;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-links a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.navbar-links a:hover,
.navbar-links a.link-activo {
  color: #42B883;
}

.link-carrito {
  position: relative;
  font-size: 1.3rem;
}

.carrito-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  background: #42B883;
  color: white;
  font-size: 0.65rem;
  font-weight: bold;
  padding: 1px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}
</style>
```

---

## Paso 6: Crear `MainLayout.vue`

Crea `src/layouts/MainLayout.vue`:

```vue
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="layout">
    <NavBar />
    <main class="layout-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-main {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
</style>
```

---

## Paso 7: Crear las vistas

### `src/views/HomeView.vue`

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>PPW Vue App</h1>
      <p>Catálogo de productos construido con Vue 3, TypeScript y Vite.</p>
      <button class="btn-primary" @click="router.push('/productos')">
        Ver Catálogo
      </button>
    </section>

    <section class="features">
      <div class="feature">
        <span class="feature-icono">⚡</span>
        <h3>Reactividad</h3>
        <p>Estado reactivo con ref, computed y watchers.</p>
      </div>
      <div class="feature">
        <span class="feature-icono">🧩</span>
        <h3>Componentes</h3>
        <p>UI dividida en componentes reutilizables con props y emits.</p>
      </div>
      <div class="feature">
        <span class="feature-icono">🔀</span>
        <h3>Routing</h3>
        <p>Navegación SPA sin recargar la página con Vue Router.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 1rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: #35495E;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.btn-primary {
  padding: 0.75rem 2rem;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary:hover { background: #35495E; }

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.feature-icono { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
.feature h3 { color: #35495E; margin-bottom: 0.5rem; }
.feature p { color: #666; font-size: 0.9rem; }
</style>
```

### `src/views/ProductosView.vue`

Mueve el contenido del catálogo de `App.vue` a esta vista. La estructura del `<script setup>` es la misma que tenía `App.vue`, sin la sección del carrito:

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import ProductForm from '@/components/ProductForm.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useCarrito } from '@/composables/useCarrito'
import { useFiltroProductos } from '@/composables/useFiltroProductos'
import type { Product } from '@/types/product'

const cargando = ref(true)
const productos = ref<Product[]>([])
const mostrarFormulario = ref(false)
let nextId = 5

const { agregar: agregarAlCarrito } = useCarrito()
const { busqueda, soloDisponibles, productosFiltrados, historialBusquedas, registrarBusqueda, aplicarBusquedaDelHistorial } =
  useFiltroProductos(() => productos.value)

watch(busqueda, registrarBusqueda)

onMounted(() => {
  setTimeout(() => {
    productos.value = [
      { id: 1, titulo: 'Laptop Pro', descripcion: 'i7, 16GB RAM, SSD 512GB', precio: 1299.99, disponible: true },
      { id: 2, titulo: 'Monitor 4K', descripcion: '27", panel IPS, 144Hz', precio: 549.00, disponible: true },
      { id: 3, titulo: 'Teclado Mecánico', descripcion: 'Cherry MX Red, RGB', precio: 189.99, disponible: false },
      { id: 4, titulo: 'Mouse Inalámbrico', descripcion: 'DPI ajustable', precio: 45.99, disponible: true },
    ]
    cargando.value = false
  }, 800)
})

function agregarProducto(datos: Omit<Product, 'id'>): void {
  productos.value.push({ id: nextId++, ...datos })
  mostrarFormulario.value = false
}
</script>

<template>
  <div>
    <div class="seccion-header">
      <h1>Catálogo</h1>
      <button class="btn-nuevo" @click="mostrarFormulario = !mostrarFormulario">
        {{ mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Producto' }}
      </button>
    </div>

    <div class="form-container" v-show="mostrarFormulario">
      <ProductForm @guardar="agregarProducto" @cancelar="mostrarFormulario = false" />
    </div>

    <div class="filtros">
      <input v-model="busqueda" type="search" placeholder="Buscar..." class="input-busqueda" />
      <label class="filtro-label">
        <input type="checkbox" v-model="soloDisponibles" />
        Solo disponibles
      </label>
      <span class="filtro-contador">{{ productosFiltrados.length }} resultado(s)</span>
    </div>

    <div v-if="cargando" class="estado-carga">Cargando productos...</div>

    <template v-else>
      <EmptyState v-if="productosFiltrados.length === 0" mensaje="Sin resultados." icono="🔍" />
      <div v-else class="grid">
        <ProductCard
          v-for="producto in productosFiltrados"
          :key="producto.id"
          :producto="producto"
          @agregar="agregarAlCarrito"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.seccion-header h1 { color: #35495E; }
.btn-nuevo { padding: 0.5rem 1rem; background: #42B883; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
.btn-nuevo:hover { background: #35495E; }
.form-container { background: #f8f9fa; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #e0e0e0; }
.filtros { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
.input-busqueda { padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem; width: 220px; }
.input-busqueda:focus { outline: none; border-color: #42B883; }
.filtro-label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; }
.filtro-contador { color: #666; font-size: 0.875rem; }
.estado-carga { text-align: center; padding: 3rem; color: #42B883; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
</style>
```

### `src/views/CarritoView.vue`

```vue
<script setup lang="ts">
import { useCarrito } from '@/composables/useCarrito'
import EmptyState from '@/components/EmptyState.vue'
import { useRouter } from 'vue-router'

const { items, cantidadItems, subtotal, iva, total, quitar, limpiarCarrito } = useCarrito()
const router = useRouter()
</script>

<template>
  <div>
    <h1 class="titulo">Carrito de Compras</h1>

    <EmptyState
      v-if="cantidadItems === 0"
      mensaje="Tu carrito está vacío."
      icono="🛒"
    />

    <template v-else>
      <ul class="lista-carrito">
        <li v-for="item in items" :key="item.id" class="item-carrito">
          <div class="item-info">
            <span class="item-nombre">{{ item.titulo }}</span>
            <span class="item-desc">{{ item.descripcion }}</span>
          </div>
          <span class="item-precio">${{ item.precio.toFixed(2) }}</span>
          <button class="btn-quitar" @click="quitar(item.id)">✕</button>
        </li>
      </ul>

      <div class="resumen">
        <div class="linea"><span>Subtotal</span><span>${{ subtotal.toFixed(2) }}</span></div>
        <div class="linea"><span>IVA (12%)</span><span>${{ iva.toFixed(2) }}</span></div>
        <div class="linea total"><strong>Total</strong><strong>${{ total.toFixed(2) }}</strong></div>
      </div>

      <div class="acciones">
        <button class="btn-limpiar" @click="limpiarCarrito">Vaciar carrito</button>
        <button class="btn-pagar">Proceder al pago</button>
      </div>
    </template>

    <button class="btn-volver" @click="router.push('/productos')">← Seguir comprando</button>
  </div>
</template>

<style scoped>
.titulo { color: #35495E; margin-bottom: 1.5rem; }
.lista-carrito { list-style: none; padding: 0; margin-bottom: 1.5rem; }
.item-carrito { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 8px; margin-bottom: 0.75rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.item-info { flex: 1; }
.item-nombre { font-weight: 600; color: #35495E; display: block; }
.item-desc { font-size: 0.8rem; color: #999; }
.item-precio { font-weight: bold; color: #42B883; }
.btn-quitar { background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1rem; }
.resumen { background: white; border-radius: 8px; padding: 1.25rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 1rem; }
.linea { display: flex; justify-content: space-between; padding: 0.3rem 0; color: #555; }
.total { border-top: 1px solid #eee; margin-top: 0.5rem; padding-top: 0.75rem; color: #35495E; font-size: 1.05rem; }
.acciones { display: flex; gap: 1rem; justify-content: flex-end; margin-bottom: 1rem; }
.btn-limpiar { padding: 0.6rem 1rem; border: 1px solid #e74c3c; background: white; color: #e74c3c; border-radius: 4px; cursor: pointer; }
.btn-pagar { padding: 0.6rem 1.5rem; background: #42B883; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
.btn-volver { background: none; border: none; color: #42B883; cursor: pointer; font-size: 0.95rem; }
</style>
```

### `src/views/NotFoundView.vue`

```vue
<template>
  <div class="not-found">
    <span class="codigo">404</span>
    <h2>Página no encontrada</h2>
    <p>La ruta que buscas no existe.</p>
    <RouterLink to="/" class="btn-home">Volver al inicio</RouterLink>
  </div>
</template>

<style scoped>
.not-found { text-align: center; padding: 5rem 1rem; }
.codigo { font-size: 6rem; font-weight: 900; color: #42B883; display: block; }
h2 { color: #35495E; }
p { color: #666; margin-bottom: 2rem; }
.btn-home { padding: 0.6rem 1.5rem; background: #42B883; color: white; border-radius: 4px; text-decoration: none; }
</style>
```

---

## Validaciones Esperadas

- [ ] La NavBar muestra las tres rutas con el link activo resaltado
- [ ] Navegar a `/productos` muestra el catálogo
- [ ] Navegar a `/carrito` muestra el carrito (con los items persistidos)
- [ ] El badge del carrito en la NavBar se actualiza al agregar productos
- [ ] `/ruta-inexistente` muestra la página 404
- [ ] La URL cambia sin recargar la página completa

---

## Entregables

- `src/router/index.ts` con rutas anidadas y lazy loading
- `src/layouts/MainLayout.vue`
- `src/components/NavBar.vue`
- `src/views/HomeView.vue`, `ProductosView.vue`, `CarritoView.vue`, `NotFoundView.vue`
- `src/App.vue` simplificado a solo `<RouterView />`
- `src/main.ts` con `.use(router)`

---

## Commits Sugeridos

```bash
git add src/router/ src/layouts/ src/views/ src/components/NavBar.vue src/App.vue src/main.ts
git commit -m "feat: Vue Router con vistas, layouts y navegación (módulo 09)"
```
