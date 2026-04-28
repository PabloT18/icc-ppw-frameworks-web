# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 09: Formularios y Endpoints API

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Implementar una página de contacto con formulario validado en cliente y servidor, y un endpoint API en Astro que responde con JSON.

---

## Archivos que se crean / modifican

```
astro-campus/
├── astro.config.mjs          ← MODIFICAR: cambiar a output: 'hybrid'
└── src/
    └── pages/
        ├── contacto.astro    ← NUEVO
        └── api/
            └── contact.ts   ← NUEVO
```

---

## Paso 1: Cambiar a modo híbrido

**¿Qué hace este paso?** El modo `hybrid` permite que la mayoría del sitio sea estático, pero habilita rutas SSR específicas (como los endpoints API).

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'hybrid',   // ← cambiar de 'static' a 'hybrid'
  server: { port: 4321 },
});
```

> En modo `hybrid`, las páginas son estáticas por defecto. Solo los archivos con `export const prerender = false` se renderizan en el servidor.

---

## Paso 2: Crear `src/pages/api/contact.ts`

**¿Qué hace este paso?** Crea un endpoint POST que recibe los datos del formulario, los valida y responde con JSON.

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const prerender = false; // SSR: no pre-renderizar este endpoint

export const POST: APIRoute = async ({ request }) => {
  // Leer datos del formulario
  const data = await request.formData();
  const nombre  = (data.get('nombre')  as string)?.trim() ?? '';
  const email   = (data.get('email')   as string)?.trim() ?? '';
  const mensaje = (data.get('mensaje') as string)?.trim() ?? '';

  // Validar campos requeridos
  if (!nombre || !email || !mensaje) {
    return new Response(
      JSON.stringify({ error: 'Todos los campos son requeridos.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({ error: 'El formato del email no es válido.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validar longitud mínima del mensaje
  if (mensaje.length < 10) {
    return new Response(
      JSON.stringify({ error: 'El mensaje debe tener al menos 10 caracteres.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Log del contacto (en producción: enviar email, guardar en DB, etc.)
  console.log('[API] Nuevo contacto:', {
    nombre,
    email,
    mensaje: mensaje.slice(0, 60),
  });

  return new Response(
    JSON.stringify({ ok: true, mensaje: 'Mensaje enviado. Te contactaremos pronto.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

---

## Paso 3: Crear `src/pages/contacto.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout titulo="Contacto" descripcion="Contáctanos con preguntas o sugerencias.">
  <h1>Contacto</h1>
  <p class="intro">¿Tienes preguntas o sugerencias? Escríbenos.</p>

  <form id="contact-form" novalidate class="form">
    <div class="campo">
      <label for="nombre">Nombre <span aria-hidden="true">*</span></label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        required
        autocomplete="name"
        placeholder="Tu nombre completo"
      />
      <span class="campo-error" id="err-nombre"></span>
    </div>

    <div class="campo">
      <label for="email">Email <span aria-hidden="true">*</span></label>
      <input
        type="email"
        id="email"
        name="email"
        required
        autocomplete="email"
        placeholder="tu@email.com"
      />
      <span class="campo-error" id="err-email"></span>
    </div>

    <div class="campo">
      <label for="mensaje">Mensaje <span aria-hidden="true">*</span></label>
      <textarea
        id="mensaje"
        name="mensaje"
        rows="5"
        required
        minlength="10"
        placeholder="Escribe tu mensaje aquí…"
      ></textarea>
      <span class="campo-error" id="err-mensaje"></span>
    </div>

    <div id="form-feedback" role="alert" aria-live="polite" class="feedback"></div>

    <button type="submit" id="submit-btn" class="btn-submit">
      Enviar mensaje
    </button>
  </form>
</BaseLayout>

<script>
  const form = document.querySelector<HTMLFormElement>('#contact-form')!;
  const feedback = document.querySelector<HTMLElement>('#form-feedback')!;
  const submitBtn = document.querySelector<HTMLButtonElement>('#submit-btn')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'feedback';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(form),
      });
      const json = await res.json();

      if (res.ok) {
        feedback.textContent = '✅ ' + json.mensaje;
        feedback.classList.add('exito');
        form.reset();
      } else {
        feedback.textContent = '❌ ' + json.error;
        feedback.classList.add('error');
      }
    } catch {
      feedback.textContent = '❌ Error de red. Inténtalo más tarde.';
      feedback.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje';
    }
  });
</script>

<style>
  .intro { color: var(--color-text-muted, #aaa); margin-bottom: 2rem; }
  .form { max-width: 540px; display: flex; flex-direction: column; gap: 1.25rem; }
  .campo { display: flex; flex-direction: column; gap: 0.4rem; }
  label { font-size: 0.9rem; font-weight: 600; }
  label span { color: var(--color-error, #f87171); }
  input, textarea {
    background: var(--color-bg-card, #1a1a1a);
    border: 1px solid var(--color-border, #333);
    border-radius: var(--radius-md, 0.5rem);
    color: var(--color-text, #e8e8e8);
    font-size: 1rem;
    padding: 0.6rem 0.8rem;
    transition: border-color 0.2s;
    font-family: inherit;
    width: 100%;
  }
  input:focus, textarea:focus {
    outline: none;
    border-color: var(--color-brand, #FF5D01);
  }
  .campo-error { color: var(--color-error, #f87171); font-size: 0.8rem; }
  .feedback {
    border-radius: var(--radius-md, 0.5rem);
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
  .feedback.exito { background: rgba(34, 197, 94, 0.1); color: var(--color-success, #22c55e); }
  .feedback.error { background: rgba(248, 113, 113, 0.1); color: var(--color-error, #f87171); }
  .btn-submit {
    background: var(--color-brand, #FF5D01);
    border: none;
    border-radius: var(--radius-md, 0.5rem);
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 2rem;
    transition: opacity 0.2s;
    align-self: flex-start;
  }
  .btn-submit:hover { opacity: 0.85; }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
