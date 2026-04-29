# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 12: Autenticación y Protección de Rutas

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Práctico

Implementar autenticación simulada con un formulario de login, un store de autenticación con persistencia, y guards en Vue Router para proteger la vista del carrito. Al finalizar, solo los usuarios autenticados podrán acceder al carrito.

---

## Contexto

Se implementa autenticación simulada (sin backend real). Los módulos posteriores pueden conectar el mismo flujo a una API real. El sistema usa:
- Pinia store con persistencia para el token
- Navigation guard global en Vue Router
- Servicio de autenticación simulado con usuarios de prueba

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/src/
├── types/
│   └── usuario.ts              ← Crear
├── stores/
│   └── useAuthStore.ts         ← Crear
├── services/
│   └── auth.service.ts         ← Crear
├── views/
│   └── LoginView.vue           ← Crear
├── components/
│   └── NavBar.vue              ← Modificar: mostrar usuario + logout
└── router/
    └── index.ts                ← Modificar: agregar login, guard y meta
```

---

## Paso 1: Crear el tipo `Usuario`

Crea `src/types/usuario.ts`:

```typescript
export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: 'admin' | 'usuario'
}
```

---

## Paso 2: Crear el servicio de autenticación

Crea `src/services/auth.service.ts`:

```typescript
import type { Usuario } from '@/types/usuario'

interface LoginResult {
  usuario: Usuario
  token: string
}

const USUARIOS_PRUEBA: Array<Usuario & { password: string }> = [
  { id: 1, nombre: 'Admin PPW', email: 'admin@test.com', password: '12345678', rol: 'admin' },
  { id: 2, nombre: 'Estudiante', email: 'user@test.com', password: '12345678', rol: 'usuario' }
]

export async function loginRequest(email: string, password: string): Promise<LoginResult> {
  await new Promise(r => setTimeout(r, 600))

  const encontrado = USUARIOS_PRUEBA.find(u => u.email === email && u.password === password)
  if (!encontrado) throw new Error('Credenciales inválidas')

  const { password: _, ...usuario } = encontrado
  // Token simulado: en producción, lo genera el servidor
  const token = `fake-jwt.${btoa(JSON.stringify({ id: usuario.id, email: usuario.email }))}.firma`

  return { usuario, token }
}
```

---

## Paso 3: Crear `useAuthStore`

Crea `src/stores/useAuthStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginRequest } from '@/services/auth.service'
import type { Usuario } from '@/types/usuario'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  const token = ref<string | null>(null)
  const cargando = ref(false)
  const errorLogin = ref<string | null>(null)

  const estaAutenticado = computed(() => !!token.value)

  async function login(email: string, password: string): Promise<boolean> {
    cargando.value = true
    errorLogin.value = null
    try {
      const resultado = await loginRequest(email, password)
      usuario.value = resultado.usuario
      token.value = resultado.token
      return true
    } catch {
      errorLogin.value = 'Email o contraseña incorrectos'
      return false
    } finally {
      cargando.value = false
    }
  }

  function logout(): void {
    usuario.value = null
    token.value = null
  }

  return { usuario, token, cargando, errorLogin, estaAutenticado, login, logout }
}, {
  persist: {
    key: 'ppw-auth',
    pick: ['usuario', 'token']
  }
})
```

---

## Paso 4: Crear `LoginView.vue`

Crea `src/views/LoginView.vue`:

```vue
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const intentoEnvio = ref(false)

const errores = computed(() => {
  const e: Record<string, string> = {}
  if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email inválido'
  if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
  return e
})

const formularioValido = computed(() => Object.keys(errores.value).length === 0)

async function handleLogin() {
  intentoEnvio.value = true
  if (!formularioValido.value) return

  const ok = await auth.login(form.email, form.password)
  if (ok) {
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  }
}
</script>

<template>
  <div class="login-page">
    <form @submit.prevent="handleLogin" class="login-card" novalidate>
      <div class="login-logo">
        <span class="verde">Vue</span>App
      </div>

      <h2 class="login-titulo">Iniciar sesión</h2>

      <div v-if="auth.errorLogin" class="alerta-error">
        {{ auth.errorLogin }}
      </div>

      <div class="campo" :class="{ 'campo-error': intentoEnvio && errores.email }">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="tu@email.com"
          autocomplete="email"
        />
        <span v-if="intentoEnvio && errores.email" class="error-msg">
          {{ errores.email }}
        </span>
      </div>

      <div class="campo" :class="{ 'campo-error': intentoEnvio && errores.password }">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
        />
        <span v-if="intentoEnvio && errores.password" class="error-msg">
          {{ errores.password }}
        </span>
      </div>

      <button type="submit" class="btn-login" :disabled="auth.cargando">
        {{ auth.cargando ? 'Entrando...' : 'Iniciar sesión' }}
      </button>

      <div class="demo-credenciales">
        <strong>Cuentas de prueba:</strong>
        <code>admin@test.com / 12345678</code>
        <code>user@test.com / 12345678</code>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-logo {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: #35495E;
}

.verde { color: #42B883; }

.login-titulo {
  text-align: center;
  color: #35495E;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.alerta-error {
  background: #ffeaea;
  color: #e74c3c;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
}

.campo { display: flex; flex-direction: column; gap: 0.3rem; }
.campo label { font-size: 0.875rem; font-weight: 600; color: #555; }
.campo input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}
.campo input:focus { outline: none; border-color: #42B883; }
.campo-error input { border-color: #e74c3c; }
.error-msg { font-size: 0.8rem; color: #e74c3c; }

.btn-login {
  padding: 0.75rem;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.btn-login:hover:not(:disabled) { background: #35495E; }
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

.demo-credenciales {
  font-size: 0.8rem;
  color: #888;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.demo-credenciales code {
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.78rem;
}
</style>
```

---

## Paso 5: Agregar la ruta de login y el guard al router

Actualiza `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'productos', name: 'productos', component: () => import('@/views/ProductosView.vue') },
        {
          path: 'carrito',
          name: 'carrito',
          component: () => import('@/views/CarritoView.vue'),
          meta: { requiresAuth: true }   // ← Ruta protegida
        }
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') }
  ]
})

// Guard global
router.beforeEach(to => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)

  if (requiresAuth && !auth.estaAutenticado) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.estaAutenticado) {
    return { name: 'home' }
  }
})

export default router
```

---

## Paso 6: Actualizar `NavBar.vue` con estado de autenticación

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCarritoStore } from '@/stores/useCarritoStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const { cantidadItems } = storeToRefs(useCarritoStore())
const auth = useAuthStore()
const { estaAutenticado, usuario } = storeToRefs(auth)
const router = useRouter()

function cerrarSesion() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="navbar-logo">
      <span class="logo-vue">Vue</span>App
    </RouterLink>

    <div class="navbar-links">
      <RouterLink to="/" active-class="" :exact-active-class="'link-activo'">Inicio</RouterLink>
      <RouterLink to="/productos" active-class="link-activo">Productos</RouterLink>
      <RouterLink to="/carrito" class="link-carrito" active-class="link-activo">
        🛒
        <span v-if="cantidadItems > 0" class="carrito-badge">{{ cantidadItems }}</span>
      </RouterLink>

      <template v-if="estaAutenticado">
        <span class="usuario-nombre">{{ usuario?.nombre }}</span>
        <button class="btn-logout" @click="cerrarSesion">Salir</button>
      </template>
      <RouterLink v-else to="/login" active-class="link-activo">Login</RouterLink>
    </div>
  </nav>
</template>
```

---

## Validaciones Esperadas

- [ ] Al acceder a `/carrito` sin estar autenticado, redirige a `/login?redirect=/carrito`
- [ ] Después del login, redirige al carrito correctamente
- [ ] La NavBar muestra el nombre del usuario cuando está autenticado
- [ ] Al hacer logout, redirige a `/login` y el estado se limpia
- [ ] Credenciales incorrectas muestran el mensaje de error en el formulario
- [ ] Recargar la página mantiene la sesión (persistencia en localStorage)

---

## Entregables

- `src/types/usuario.ts`
- `src/stores/useAuthStore.ts`
- `src/services/auth.service.ts`
- `src/views/LoginView.vue`
- `src/router/index.ts` con guard y meta
- `src/components/NavBar.vue` con estado de auth

---

## Commits Sugeridos

```bash
git add src/types/usuario.ts src/stores/useAuthStore.ts src/services/auth.service.ts
git commit -m "feat: store de autenticación con login simulado (módulo 12)"
git add src/views/LoginView.vue src/router/index.ts src/components/NavBar.vue
git commit -m "feat: login view, guard de rutas y navbar con estado de auth"
```
