# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 12: Autenticación y Protección de Rutas

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

La autenticación permite identificar a los usuarios y controlar el acceso a partes de la aplicación. En una SPA con Vue Router, esto involucra:

1. **Login**: el usuario envía credenciales y recibe un token JWT
2. **Persistencia**: el token se guarda en localStorage (o en un store con persistencia)
3. **Guards**: el router verifica si el usuario está autenticado antes de permitir el acceso a rutas privadas
4. **Logout**: se elimina el token y se redirige al login

---

## 2. Conceptos Clave

### JWT (JSON Web Token)

Un JWT es una cadena con tres partes: `header.payload.signature`. El payload contiene información del usuario (no encriptada, solo firmada):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibm9tYnJlIjoiUGFibG8iLCJpYXQiOjE1MTYyMzkwMjJ9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

El servidor genera el JWT; el cliente lo almacena y lo envía en cada petición en el header `Authorization: Bearer <token>`.

### Navigation Guards de Vue Router

Vue Router ofrece hooks para interceptar la navegación:

```typescript
// Guard global (se ejecuta antes de cada navegación)
router.beforeEach((to, from) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.estaAutenticado) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

### Metadatos de ruta (`meta`)

```typescript
{
  path: '/admin',
  name: 'admin',
  component: AdminView,
  meta: { requiresAuth: true, roles: ['admin'] }
}
```

---

## 3. Explicación

### Store de autenticación

```typescript
// src/stores/useAuthStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService, logout as logoutService } from '@/services/auth.service'
import type { Usuario } from '@/types/usuario'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  const token = ref<string | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const estaAutenticado = computed(() => !!token.value)

  async function login(email: string, password: string): Promise<boolean> {
    cargando.value = true
    error.value = null
    try {
      const resultado = await loginService(email, password)
      usuario.value = resultado.usuario
      token.value = resultado.token
      return true
    } catch (e) {
      error.value = 'Credenciales inválidas'
      return false
    } finally {
      cargando.value = false
    }
  }

  function logout(): void {
    usuario.value = null
    token.value = null
  }

  return { usuario, token, cargando, error, estaAutenticado, login, logout }
}, {
  persist: { pick: ['usuario', 'token'] }
})
```

### Servicio de autenticación simulado

```typescript
// src/services/auth.service.ts
import type { Usuario } from '@/types/usuario'

// Usuarios de prueba (en producción, llamar a la API real)
const USUARIOS_PRUEBA = [
  { id: 1, nombre: 'Admin', email: 'admin@test.com', password: '12345678', rol: 'admin' as const },
  { id: 2, nombre: 'Usuario', email: 'user@test.com', password: '12345678', rol: 'usuario' as const }
]

export async function login(
  email: string,
  password: string
): Promise<{ usuario: Omit<typeof USUARIOS_PRUEBA[0], 'password'>; token: string }> {
  // Simular latencia de red
  await new Promise(r => setTimeout(r, 600))

  const usuario = USUARIOS_PRUEBA.find(u => u.email === email && u.password === password)
  if (!usuario) throw new Error('Credenciales inválidas')

  const { password: _, ...usuarioSinPassword } = usuario
  const token = `fake-jwt-${btoa(JSON.stringify({ id: usuario.id, email: usuario.email }))}`

  return { usuario: usuarioSinPassword, token }
}
```

### Guard de navegación

```typescript
// src/router/index.ts — agregar después de definir el router

import { useAuthStore } from '@/stores/useAuthStore'

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)

  if (requiresAuth && !auth.estaAutenticado) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  // Redirigir si ya está autenticado y va al login
  if (to.name === 'login' && auth.estaAutenticado) {
    return { name: 'home' }
  }
})
```

### Interceptor Axios con token

```typescript
// src/services/api.ts
api.interceptors.request.use(config => {
  // Obtener el token del store
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)
```

---

## 4. Ejemplos de Código

### Componente `LoginView.vue`

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const intentoEnvio = ref(false)

const errores = computed(() => {
  const e: Record<string, string> = {}
  if (!form.email.includes('@')) e.email = 'Email inválido'
  if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
  return e
})

async function handleLogin() {
  intentoEnvio.value = true
  if (Object.keys(errores.value).length > 0) return

  const ok = await auth.login(form.email, form.password)
  if (ok) {
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  }
}
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Iniciar Sesión</h2>

      <div v-if="auth.error" class="alerta-error">{{ auth.error }}</div>

      <div class="campo" :class="{ error: intentoEnvio && errores.email }">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="tu@email.com" />
        <span v-if="intentoEnvio && errores.email" class="msg-error">
          {{ errores.email }}
        </span>
      </div>

      <div class="campo" :class="{ error: intentoEnvio && errores.password }">
        <label>Contraseña</label>
        <input v-model="form.password" type="password" placeholder="••••••••" />
        <span v-if="intentoEnvio && errores.password" class="msg-error">
          {{ errores.password }}
        </span>
      </div>

      <button type="submit" :disabled="auth.cargando" class="btn-login">
        {{ auth.cargando ? 'Entrando...' : 'Iniciar Sesión' }}
      </button>

      <p class="credenciales-prueba">
        Demo: admin@test.com / 12345678
      </p>
    </form>
  </div>
</template>
```

---

## 5. Buenas Prácticas

- **Nunca guardes passwords**: el cliente nunca debe almacenar contraseñas; solo tokens.
- **Tokens de corta duración + refresh tokens**: en producción, usa JWT con expiración y un refresh token para renovarlo.
- **HTTPS siempre**: los tokens en localStorage son vulnerables a XSS; usa HTTPS y CSP para mitigarlo.
- **Limpia el estado al hacer logout**: no solo el token, sino también datos del usuario en otros stores.
- **Redirect después del login**: usa `route.query.redirect` para volver a la página que el usuario intentó visitar.
- **No pongas lógica de auth en componentes**: centraliza en el store y los guards.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Guard ejecutado antes de que Pinia esté lista | `useAuthStore()` llamado fuera del contexto de Vue | Llamar el store dentro de la función del guard, no fuera |
| Loop infinito en guard | Guard redirige a la misma ruta que está protegida | Agregar condición `to.name !== 'login'` antes de redirigir |
| Token no enviado en peticiones | Interceptor no configurado o store instanciado incorrectamente | Verificar que el interceptor usa `useAuthStore()` dentro del callback |
| Estado no limpio después de logout | Otros stores tienen datos del usuario anterior | Llamar `$reset()` o limpiar manualmente en la acción `logout` |

---

## 7. Relación con el Proyecto Incremental

Se agrega autenticación simulada con un usuario de prueba. La ruta `/carrito` (o una nueva ruta `/perfil`) se protege con el guard. La NavBar muestra el nombre del usuario y un botón de logout.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/src/
├── stores/
│   └── useAuthStore.ts         ← Nuevo
├── services/
│   └── auth.service.ts         ← Nuevo
├── views/
│   └── LoginView.vue           ← Nuevo
├── types/
│   └── usuario.ts              ← Nuevo
└── router/
    └── index.ts                ← Modificado: guards + rutas protegidas
```

---

## 8. Referencias

- [Vue Router 4 - Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards)
- [Vue Router 4 - Route Meta Fields](https://router.vuejs.org/guide/advanced/meta)
- [Pinia - Acceso al store fuera de componentes](https://pinia.vuejs.org/core-concepts/outside-component-usage)
- [OWASP - Manejo seguro de sesiones](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [JWT.io - Herramienta de depuración](https://jwt.io)
