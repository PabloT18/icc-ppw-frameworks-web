# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 10: SSR y Middleware

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Hasta ahora, `astro-campus` ha sido un sitio completamente estático. El Server-Side Rendering (SSR) permite generar páginas en tiempo real en el servidor, habilitando capacidades como leer cookies, sesiones de usuario, rutas dinámicas desde bases de datos y lógica personalizada por petición.

El **middleware** de Astro es una función que se ejecuta antes de cada request, ideal para validar autenticación, registrar logs, o inyectar datos en `locals`.

---

## 2. Conceptos Clave

### Modos de output en Astro

| Modo | Descripción |
|------|-------------|
| `static` | Todo es HTML pre-generado. Sin servidor en producción. |
| `hybrid` | Estático por defecto, con rutas SSR marcadas explícitamente. |
| `server` | Todo es SSR. Requiere adapter (Node.js, Netlify, Cloudflare). |

### Adaptadores

```bash
# Node.js (self-hosted)
pnpm astro add node

# Netlify
pnpm astro add netlify

# Cloudflare Workers
pnpm astro add cloudflare
```

### `Astro.locals`

```typescript
// src/middleware.ts — agregar datos al context
export function onRequest({ locals, request }, next) {
  locals.usuario = { nombre: 'Ana', rol: 'admin' };
  return next();
}

// src/pages/dashboard.astro — leer en la página
const { usuario } = Astro.locals;
```

### Cookies en SSR

```typescript
// Leer
const sesion = Astro.cookies.get('session-id')?.value;

// Escribir
Astro.cookies.set('session-id', tokenValue, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24, // 24 horas en segundos
});

// Eliminar
Astro.cookies.delete('session-id', { path: '/' });
```

---

## 3. Explicación

### Configurar SSR con modo `server`

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: 4321 },
});
```

### Middleware (`src/middleware.ts`)

```typescript
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ locals, cookies, url, redirect }, next) => {
  // Log de cada petición
  console.log(`[${new Date().toISOString()}] ${url.pathname}`);

  // Leer cookie de sesión
  const sessionId = cookies.get('session-id')?.value;
  locals.sessionId = sessionId ?? null;
  locals.autenticado = Boolean(sessionId);

  // Proteger rutas privadas
  const rutasPrivadas = ['/dashboard', '/admin'];
  const esPrivada = rutasPrivadas.some(r => url.pathname.startsWith(r));
  if (esPrivada && !locals.autenticado) {
    return redirect('/login?next=' + url.pathname);
  }

  return next();
});
```

### Declarar tipos de `locals`

```typescript
// src/env.d.ts (o src/types.d.ts)
declare namespace App {
  interface Locals {
    sessionId: string | null;
    autenticado: boolean;
  }
}
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Página con datos de cookies

```astro
---
// src/pages/perfil.astro
// export const prerender = false; // En modo hybrid

const sessionId = Astro.cookies.get('session-id')?.value;

if (!sessionId) {
  return Astro.redirect('/login');
}

// En producción: buscar el usuario en DB usando sessionId
const usuario = { nombre: 'Ana García', email: 'ana@ejemplo.com' };
---

<BaseLayout titulo="Mi Perfil">
  <h1>Hola, {usuario.nombre}</h1>
  <p>Email: {usuario.email}</p>
  <a href="/api/logout">Cerrar sesión</a>
</BaseLayout>
```

### Ejemplo 2: Endpoint de query param dinámico

```typescript
// src/pages/api/buscar.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.toLowerCase() ?? '';
  
  // Simulación de búsqueda
  const resultados = [
    { titulo: 'Astro Docs', slug: 'astro-docs' },
    { titulo: 'MDN Web', slug: 'mdn-web' },
  ].filter(r => r.titulo.toLowerCase().includes(query));

  return new Response(JSON.stringify({ resultados, query }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

---

## 5. Buenas Prácticas

- Siempre usar `httpOnly: true` en cookies de sesión para prevenir XSS.
- Usar `secure: true` en producción (HTTPS obligatorio).
- No guardar datos sensibles en cookies — solo IDs de sesión.
- Usar `defineMiddleware` para tipado correcto del contexto.
- Declarar los tipos de `App.Locals` para TypeScript en `src/env.d.ts`.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Astro.cookies` undefined | Página en modo estático | Agregar `export const prerender = false` |
| Adapter no encontrado | Paquete no instalado | `pnpm astro add node` (o netlify/cloudflare) |
| Middleware no se ejecuta | Archivo en lugar incorrecto | Debe estar en `src/middleware.ts` |
| `locals` sin tipos | Falta declaración en `env.d.ts` | Declarar `App.Locals` |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` cambia a modo `server` con adaptador Node.js. Se añade:

- Middleware de logging y protección de rutas.
- Tipos de `locals` en `env.d.ts`.
- Endpoint de búsqueda `/api/buscar?q=` con query params dinámicos.

---

## 8. Recursos

- [SSR en Astro](https://docs.astro.build/es/guides/server-side-rendering/)
- [Middleware de Astro](https://docs.astro.build/es/guides/middleware/)
- [Cookies API](https://docs.astro.build/es/reference/api-reference/#cookies)
- [Adapter Node.js](https://docs.astro.build/es/guides/integrations-guide/node/)
