# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 11: Autenticación y Protección de Rutas

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

La autenticación es uno de los requisitos más comunes en aplicaciones web. Astro permite implementar autenticación basada en cookies de sesión usando SSR + middleware. No se necesita ninguna librería externa — solo cookies seguras y lógica en el servidor.

> **Nota de seguridad:** Este módulo implementa autenticación simplificada con contraseña fija para fines pedagógicos. En producción, usar hashing (bcrypt/argon2) y base de datos real.

---

## 2. Conceptos Clave

### Flujo de autenticación con cookies

```
1. Usuario llena formulario /login (usuario + contraseña)
2. POST /api/auth/login valida credenciales
3. Si válido: establece cookie httpOnly session-token=<valor>
4. Redirect a /dashboard
5. Middleware verifica cookie en cada request a rutas privadas
6. POST /api/auth/logout elimina la cookie → redirect a /
```

### Cookie de sesión segura

```typescript
Astro.cookies.set('session-token', tokenGenerado, {
  httpOnly: true,    // No accesible por JavaScript del cliente
  secure: true,      // Solo en HTTPS (usar false en desarrollo)
  sameSite: 'lax',   // Protección CSRF básica
  path: '/',         // Disponible en todo el sitio
  maxAge: 60 * 60 * 24 * 7, // 7 días
});
```

### Verificar autenticación en middleware

```typescript
export const onRequest = defineMiddleware(({ cookies, url, redirect, locals }, next) => {
  const token = cookies.get('session-token')?.value;
  locals.autenticado = token === import.meta.env.SESSION_SECRET;

  const rutasPrivadas = ['/dashboard', '/admin'];
  if (rutasPrivadas.some(r => url.pathname.startsWith(r)) && !locals.autenticado) {
    return redirect('/login');
  }

  return next();
});
```

---

## 3. Explicación

### Generación de token de sesión

En producción, el token debe ser un UUID aleatorio almacenado en base de datos. Para simplificar:

```typescript
import { randomBytes } from 'node:crypto';

function generarToken(): string {
  return randomBytes(32).toString('hex');
}
```

### Variables de entorno para credenciales

```bash
# .env (NO versionar en git)
ADMIN_PASSWORD=mi-contrasena-secreta
SESSION_SECRET=clave-secreta-muy-larga-para-firmar
```

```typescript
// Acceso en código servidor
const PASSWORD_CORRECTA = import.meta.env.ADMIN_PASSWORD;
```

---

## 4. Ejemplos de Código

### Endpoint de login

```typescript
// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const data = await request.formData();
  const usuario    = (data.get('usuario')    as string)?.trim();
  const contrasena = (data.get('contrasena') as string)?.trim();

  const USUARIO_VALIDO = import.meta.env.ADMIN_USER     ?? 'admin';
  const PASS_VALIDA    = import.meta.env.ADMIN_PASSWORD ?? 'admin123';

  if (usuario !== USUARIO_VALIDO || contrasena !== PASS_VALIDA) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/login?error=credenciales' },
    });
  }

  cookies.set('session-token', import.meta.env.SESSION_SECRET ?? 'dev-token', {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return new Response(null, {
    status: 303,
    headers: { Location: '/dashboard' },
  });
};
```

### Página protegida

```astro
---
// src/pages/dashboard.astro
import BaseLayout from '../layouts/BaseLayout.astro';

// Verificación adicional a nivel de página (el middleware ya protege)
if (!Astro.locals.autenticado) {
  return Astro.redirect('/login');
}
---

<BaseLayout titulo="Dashboard">
  <h1>Panel de administración</h1>
  <p>Solo usuarios autenticados pueden ver esta página.</p>
  <form method="POST" action="/api/auth/logout">
    <button type="submit">Cerrar sesión</button>
  </form>
</BaseLayout>
```

---

## 5. Buenas Prácticas

- Nunca guardar contraseñas en texto plano — siempre hashear con bcrypt o Argon2.
- El token de sesión debe ser aleatorio y largo (32+ bytes).
- Usar `import.meta.env.PROD` para aplicar `secure: true` solo en producción.
- El middleware verifica la sesión, pero las páginas pueden tener verificación adicional.
- Invalidar tokens en el servidor al hacer logout, no solo eliminar la cookie.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Redirect loop en login | Middleware protege `/login` | Excluir rutas públicas en el middleware |
| Cookie no se guarda | Enviando `secure: true` en HTTP local | Usar `secure: import.meta.env.PROD` |
| 405 en endpoint POST | Falta `export const prerender = false` | Agregar la directiva |
| `locals` undefined | Tipos no declarados | Declarar `App.Locals` en `env.d.ts` |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` añade:

- Página `/login` con formulario de acceso.
- Endpoint `/api/auth/login` y `/api/auth/logout`.
- Middleware que protege `/dashboard`.
- Página `/dashboard` de solo acceso autenticado.
- `.env.example` con las variables necesarias.

---

## 8. Recursos

- [Autenticación en Astro](https://docs.astro.build/es/guides/authentication/)
- [Middleware](https://docs.astro.build/es/guides/middleware/)
- [Variables de entorno](https://docs.astro.build/es/guides/environment-variables/)
- [node:crypto](https://nodejs.org/api/crypto.html)
