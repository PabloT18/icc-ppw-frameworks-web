// src/pages/api/contact.ts
// Módulo 09 — Endpoint POST para formulario de contacto

import type { APIRoute } from 'astro';

export const prerender = false; // SSR: no pre-renderizar este endpoint

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();

  const nombre  = (data.get('nombre')  as string | null)?.trim() ?? '';
  const email   = (data.get('email')   as string | null)?.trim() ?? '';
  const mensaje = (data.get('mensaje') as string | null)?.trim() ?? '';

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

  // Validar longitud del mensaje
  if (mensaje.length < 10) {
    return new Response(
      JSON.stringify({ error: 'El mensaje debe tener al menos 10 caracteres.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // En producción: enviar email (Resend, Nodemailer), guardar en DB, etc.
  console.log('[API] Contacto recibido:', {
    nombre,
    email,
    preview: mensaje.slice(0, 80),
  });

  return new Response(
    JSON.stringify({ ok: true, mensaje: 'Mensaje enviado. Te contactaremos pronto.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
