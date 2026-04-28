# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 10: SSR y Middleware

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Configurar `astro-campus` en modo SSR completo con adaptador Node.js, implementar middleware de logging y protección, y crear un endpoint de búsqueda con query params.

---

## Archivos que se crean / modifican

```
astro-campus/
├── astro.config.mjs              ← MODIFICAR: output 'server' + adapter node
├── src/
│   ├── env.d.ts                  ← MODIFICAR: declarar App.Locals
│   ├── middleware.ts             ← NUEVO
│   └── pages/
│       └── api/
│           └── buscar.ts        ← NUEVO
```

---

## Paso 1: Instalar el adaptador Node.js

**¿Qué hace este paso?** El adaptador permite que Astro genere un servidor Node.js estándar en lugar de archivos HTML estáticos.

```bash
pnpm astro add node
```

El comando modifica `astro.config.mjs` automáticamente. Verifica que quede así:

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

---

## Paso 2: Declarar tipos de `locals` en `src/env.d.ts`

**¿Qué hace este paso?** TypeScript necesita conocer las propiedades disponibles en `Astro.locals` para dar autocompletado y verificar tipos.

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    sessionId: string | null;
    autenticado: boolean;
  }
}
```

---

## Paso 3: Crear `src/middleware.ts`

**¿Qué hace este paso?** El middleware se ejecuta antes de cada request. Aquí: registra la URL, inicializa `locals`, y protege rutas futuras.

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, redirect }, next) => {
    // Log de la petición
    console.log(`[${new Date().toISOString()}] ${url.pathname}`);

    // Leer cookie de sesión
    const sessionId = cookies.get('session-id')?.value ?? null;
    locals.sessionId = sessionId;
    locals.autenticado = Boolean(sessionId);

    // Rutas que requieren autenticación (expandir en M11)
    const rutasPrivadas = ['/dashboard'];
    const esPrivada = rutasPrivadas.some(r => url.pathname.startsWith(r));

    if (esPrivada && !locals.autenticado) {
      return redirect('/login');
    }

    return next();
  }
);
```

---

## Paso 4: Crear `src/pages/api/buscar.ts`

**¿Qué hace este paso?** Implementa un endpoint GET que acepta un query param `?q=` y retorna resultados filtrados en JSON.

```typescript
// src/pages/api/buscar.ts
import type { APIRoute } from 'astro';
import { recursos } from '../../data/recursos';

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') ?? '').toLowerCase().trim();

  if (q.length < 2) {
    return new Response(
      JSON.stringify({ error: 'La búsqueda debe tener al menos 2 caracteres.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const resultados = recursos.filter(r =>
    r.titulo.toLowerCase().includes(q) ||
    r.descripcion.toLowerCase().includes(q) ||
    r.categoria.toLowerCase().includes(q)
  );

  return new Response(
    JSON.stringify({ q, total: resultados.length, resultados }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
```

---

## Paso 5: TODO — Completar por el estudiante

```typescript
// TODO en src/middleware.ts:
// Agregar logging de tiempo de respuesta:
// - Registrar `Date.now()` antes de llamar a `next()`
// - Registrar la diferencia al final (en ms)
```

```typescript
// TODO en src/pages/api/buscar.ts:
// Agregar soporte de filtro por categoría:
// - Leer URL param `?categoria=` además de `?q=`
// - Filtrar por categoría si se proporciona
// - Retornar las categorías únicas disponibles en la respuesta
```

---

## Validaciones esperadas

- [ ] `pnpm dev` inicia sin errores con el adaptador Node
- [ ] El middleware registra cada URL en consola
- [ ] `GET /api/buscar?q=css` retorna recursos relacionados con CSS
- [ ] `GET /api/buscar?q=x` retorna error 400 (muy corta)
- [ ] `/dashboard` redirige a `/login` (sin cookie de sesión)

---

## Entregables

- `astro.config.mjs` con adapter Node y output server
- `src/middleware.ts` con logging y protección de rutas
- `src/pages/api/buscar.ts` funcional
- Capturas: resultado de `/api/buscar?q=js` en el navegador

---

## Commits sugeridos

```
feat: switch to SSR server mode with @astrojs/node adapter
feat: add middleware for logging and route protection
feat: add /api/buscar endpoint with query param filtering
```
