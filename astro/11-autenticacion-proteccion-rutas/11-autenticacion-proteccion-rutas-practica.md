# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 11: Autenticación y Protección de Rutas

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Implementar un sistema de autenticación basado en cookies de sesión, con formulario de login, endpoints de auth y una página protegida de dashboard.

---

## Archivos que se crean / modifican

```
astro-campus/
├── .env.example                        ← NUEVO
├── src/
│   ├── middleware.ts                   ← MODIFICAR: agregar auth
│   └── pages/
│       ├── login.astro                 ← NUEVO
│       ├── dashboard.astro             ← NUEVO
│       └── api/
│           └── auth/
│               ├── login.ts           ← NUEVO
│               └── logout.ts          ← NUEVO
```

---

## Paso 1: Crear `.env.example`

**¿Qué hace este paso?** Documenta las variables de entorno necesarias sin exponer valores reales.

```bash
# .env.example — copiar a .env y completar los valores
ADMIN_USER=admin
ADMIN_PASSWORD=cambiar-esta-contrasena
SESSION_SECRET=cadena-aleatoria-muy-larga-min-32-chars
```

Crear también el `.env` real (NO versionar en git):

```bash
cp .env.example .env
# Editar .env con valores reales
```

---

## Paso 2: Actualizar `src/middleware.ts`

**¿Qué hace este paso?** Añade validación de sesión real usando la variable de entorno `SESSION_SECRET`.

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

const RUTAS_PRIVADAS = ['/dashboard'];
const RUTAS_AUTH    = ['/login'];  // No redirigir si ya va al login

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, redirect }, next) => {
    console.log(`[${new Date().toISOString()}] ${url.pathname}`);

    const sessionToken = cookies.get('session-token')?.value ?? null;
    const SESSION_SECRET = import.meta.env.SESSION_SECRET ?? 'dev-insecure-secret';
    
    locals.autenticado = sessionToken === SESSION_SECRET;
    locals.sessionId   = sessionToken;

    // Proteger rutas privadas
    const esPrivada = RUTAS_PRIVADAS.some(r => url.pathname.startsWith(r));
    if (esPrivada && !locals.autenticado) {
      return redirect('/login?next=' + encodeURIComponent(url.pathname));
    }

    // Redirigir a dashboard si ya está autenticado y va al login
    if (RUTAS_AUTH.includes(url.pathname) && locals.autenticado) {
      return redirect('/dashboard');
    }

    return next();
  }
);
```

---

## Paso 3: Crear `src/pages/api/auth/login.ts`

```typescript
// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const data = await request.formData();
  const usuario    = (data.get('usuario')    as string | null)?.trim() ?? '';
  const contrasena = (data.get('contrasena') as string | null)?.trim() ?? '';

  const USUARIO_VALIDO  = import.meta.env.ADMIN_USER     ?? 'admin';
  const PASS_VALIDA     = import.meta.env.ADMIN_PASSWORD ?? 'admin123';
  const SESSION_SECRET  = import.meta.env.SESSION_SECRET ?? 'dev-insecure-secret';

  if (usuario !== USUARIO_VALIDO || contrasena !== PASS_VALIDA) {
    return redirect('/login?error=credenciales');
  }

  cookies.set('session-token', SESSION_SECRET, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 horas
  });

  const next = new URL(request.url).searchParams.get('next') ?? '/dashboard';
  return redirect(next);
};
```

---

## Paso 4: Crear `src/pages/api/auth/logout.ts`

```typescript
// src/pages/api/auth/logout.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = ({ cookies, redirect }) => {
  cookies.delete('session-token', { path: '/' });
  return redirect('/login');
};
```

---

## Paso 5: Crear `src/pages/login.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
const error = Astro.url.searchParams.get('error');
---

<BaseLayout titulo="Iniciar sesión">
  <h1>Iniciar sesión</h1>

  {error === 'credenciales' && (
    <p class="alerta-error" role="alert">Usuario o contraseña incorrectos.</p>
  )}

  <form method="POST" action="/api/auth/login" class="form-login">
    <label for="usuario">Usuario</label>
    <input type="text" id="usuario" name="usuario" required autocomplete="username" />

    <label for="contrasena">Contraseña</label>
    <input type="password" id="contrasena" name="contrasena" required autocomplete="current-password" />

    <button type="submit" class="btn-submit">Entrar</button>
  </form>
</BaseLayout>

<style>
  .alerta-error {
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid var(--color-error, #f87171);
    border-radius: var(--radius-md, 0.5rem);
    color: var(--color-error, #f87171);
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
  }
  .form-login { display: flex; flex-direction: column; gap: 0.75rem; max-width: 360px; }
  label { font-size: 0.9rem; font-weight: 600; }
  input {
    background: var(--color-bg-card, #1a1a1a);
    border: 1px solid var(--color-border, #333);
    border-radius: var(--radius-md, 0.5rem);
    color: var(--color-text, #e8e8e8);
    font-size: 1rem;
    padding: 0.6rem 0.8rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  input:focus { outline: none; border-color: var(--color-brand, #FF5D01); }
  .btn-submit {
    background: var(--color-brand, #FF5D01);
    border: none;
    border-radius: var(--radius-md, 0.5rem);
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem;
    transition: opacity 0.2s;
    margin-top: 0.5rem;
  }
  .btn-submit:hover { opacity: 0.85; }
</style>
```

---

## Paso 6: Crear `src/pages/dashboard.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

// Verificación adicional (el middleware ya redirige, esto es defensa en profundidad)
if (!Astro.locals.autenticado) {
  return Astro.redirect('/login');
}
---

<BaseLayout titulo="Dashboard">
  <h1>Panel de administración</h1>
  <p class="bienvenida">Sesión activa. Bienvenido.</p>

  <ul class="acciones">
    <li><a href="/recursos/1">Ver recursos</a></li>
    <li><a href="/blog">Ver blog</a></li>
    <li><a href="/contacto">Ver formulario de contacto</a></li>
  </ul>

  <form method="POST" action="/api/auth/logout" style="margin-top: 2rem;">
    <button type="submit" class="btn-logout">Cerrar sesión</button>
  </form>
</BaseLayout>

<style>
  .bienvenida { color: var(--color-text-muted, #aaa); margin-bottom: 1.5rem; }
  .acciones { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .acciones a { color: var(--color-brand, #FF5D01); text-decoration: none; }
  .acciones a:hover { text-decoration: underline; }
  .btn-logout {
    background: none;
    border: 1px solid var(--color-error, #f87171);
    border-radius: var(--radius-md, 0.5rem);
    color: var(--color-error, #f87171);
    cursor: pointer;
    font-size: 0.95rem;
    padding: 0.5rem 1.25rem;
    transition: background 0.2s;
  }
  .btn-logout:hover { background: var(--color-error, #f87171); color: #fff; }
</style>
```

---

## Paso 7: TODO — Completar por el estudiante

```typescript
// TODO: En src/pages/api/auth/login.ts:
// Implementar rate limiting básico:
// - Llevar un contador de intentos fallidos por IP en memoria (Map)
// - Bloquear por 1 minuto si hay más de 5 intentos fallidos
// - Retornar error 429 Too Many Requests en ese caso
```

---

## Validaciones esperadas

- [ ] `/dashboard` sin cookie redirige a `/login`
- [ ] Login con credenciales incorrectas muestra mensaje de error
- [ ] Login correcto establece cookie y redirige a `/dashboard`
- [ ] `/dashboard` muestra contenido cuando la sesión es válida
- [ ] "Cerrar sesión" elimina la cookie y redirige a `/login`
- [ ] Al volver a `/login` con sesión activa, redirige a `/dashboard`

---

## Entregables

- `.env.example` con las variables documentadas
- `middleware.ts` actualizado con validación de sesión
- `login.astro`, `dashboard.astro`
- `api/auth/login.ts`, `api/auth/logout.ts`
- Capturas: flujo completo (login → dashboard → logout)

---

## Commits sugeridos

```
feat: add .env.example with required environment variables
feat: add /login page and auth endpoints
feat: add /dashboard protected page
feat: update middleware with session validation
```
