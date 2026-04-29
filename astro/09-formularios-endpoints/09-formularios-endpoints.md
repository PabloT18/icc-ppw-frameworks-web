# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 09: Formularios y Endpoints API

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Los formularios son el principal mecanismo de entrada de datos del usuario en la web. Astro permite manejar formularios de dos maneras: enviando datos a un **endpoint** propio (`src/pages/api/`) o usando servicios externos. Los endpoints son archivos TypeScript que exportan funciones `GET`, `POST`, `PUT`, `DELETE` y responden con objetos `Response`.

> **Importante:** Los endpoints API con POST requieren SSR (`output: 'server'` o `'hybrid'`). En un proyecto estático, se pueden simular con servicios de terceros (Netlify Forms, Formspree, etc.) o habilitar el modo híbrido.

---

## 2. Conceptos Clave

### Endpoints en Astro

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const nombre = data.get('nombre') as string;
  const email  = data.get('email')  as string;

  // Validar
  if (!nombre || !email) {
    return new Response(
      JSON.stringify({ error: 'Campos requeridos faltantes' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Procesar (guardar en DB, enviar email, etc.)
  console.log('[API] Contacto recibido:', { nombre, email });

  return new Response(
    JSON.stringify({ ok: true, mensaje: 'Mensaje enviado correctamente' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

### `APIRoute` y tipos

```typescript
import type { APIRoute, APIContext } from 'astro';

// APIContext tiene: request, params, locals, cookies, redirect, url
export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q') ?? '';
  return new Response(JSON.stringify({ query: q }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Envío de formulario con JavaScript

```typescript
// src/scripts/contact-form.ts
const form = document.querySelector<HTMLFormElement>('#contact-form');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const res = await fetch('/api/contact', { method: 'POST', body: data });
  const json = await res.json();
  // Mostrar resultado al usuario
});
```

---

## 3. Explicación

### Activar modo híbrido para endpoints con POST

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'hybrid',  // Estático por defecto, con islas SSR
});
```

En el endpoint:

```typescript
// src/pages/api/contact.ts
export const prerender = false; // Este endpoint es SSR

export const POST: APIRoute = async ({ request }) => { ... };
```

### Validación robusta en el servidor

```typescript
function validarContacto(nombre: string, email: string, mensaje: string): string | null {
  if (!nombre.trim()) return 'El nombre es requerido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido';
  if (mensaje.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
  return null; // null = válido
}
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Formulario de contacto completo

```astro
---
// src/pages/contacto.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout titulo="Contacto">
  <h1>Contacto</h1>

  <form id="contact-form" novalidate>
    <div class="campo">
      <label for="nombre">Nombre</label>
      <input type="text" id="nombre" name="nombre" required autocomplete="name" />
    </div>
    <div class="campo">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autocomplete="email" />
    </div>
    <div class="campo">
      <label for="mensaje">Mensaje</label>
      <textarea id="mensaje" name="mensaje" rows="5" required></textarea>
    </div>
    <div id="form-feedback" role="alert" aria-live="polite"></div>
    <button type="submit" id="submit-btn">Enviar</button>
  </form>
</BaseLayout>

<script>
  const form = document.querySelector<HTMLFormElement>('#contact-form')!;
  const feedback = document.querySelector<HTMLElement>('#form-feedback')!;
  const submitBtn = document.querySelector<HTMLButtonElement>('#submit-btn')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
    feedback.textContent = '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(form),
      });
      const json = await res.json();

      if (res.ok) {
        feedback.textContent = '✅ ' + json.mensaje;
        feedback.className = 'exito';
        form.reset();
      } else {
        feedback.textContent = '❌ ' + json.error;
        feedback.className = 'error';
      }
    } catch {
      feedback.textContent = '❌ Error de red. Inténtalo más tarde.';
      feedback.className = 'error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar';
    }
  });
</script>
```

### Ejemplo 2: Endpoint de contacto

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const nombre  = (data.get('nombre')  as string)?.trim();
  const email   = (data.get('email')   as string)?.trim();
  const mensaje = (data.get('mensaje') as string)?.trim();

  // Validación
  if (!nombre || !email || !mensaje) {
    return new Response(
      JSON.stringify({ error: 'Todos los campos son requeridos.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: 'El formato del email no es válido.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Aquí iría: guardar en DB, enviar email (Resend, Nodemailer, etc.)
  console.log('[API] Contacto:', { nombre, email, mensaje: mensaje.slice(0, 50) });

  return new Response(
    JSON.stringify({ ok: true, mensaje: 'Mensaje enviado. Te contactaremos pronto.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

---

## 5. Buenas Prácticas

- Validar siempre los datos en el servidor, aunque el cliente también valide.
- Usar `novalidate` en el `<form>` para controlar la UX de validación desde JavaScript.
- Nunca retornar mensajes de error con información interna (stack traces, rutas de archivos).
- Usar `Content-Type: application/json` en todas las respuestas de la API.
- Agregar `role="alert"` y `aria-live="polite"` al elemento de feedback para accesibilidad.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 405 Method Not Allowed | Endpoint sin `export const prerender = false` | Agregar la directiva de SSR |
| 404 en `/api/contact` | Archivo no en `src/pages/api/` | Verificar la ruta del archivo |
| `request.formData()` vacío | Fetch sin `body: new FormData(form)` | Asegurarse de pasar FormData |
| CORS en producción | Endpoint sin headers CORS | Agregar `Access-Control-Allow-Origin` |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` añade:

- Página `/contacto` con formulario completo.
- Endpoint `/api/contact` con validación.
- Feedback visual de éxito/error para el usuario.

---

## 8. Recursos

- [Endpoints en Astro](https://docs.astro.build/es/guides/endpoints/)
- [APIRoute type reference](https://docs.astro.build/es/reference/api-reference/#endpoint-context)
- [Modo híbrido](https://docs.astro.build/es/guides/server-side-rendering/)
