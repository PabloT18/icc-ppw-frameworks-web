// src/pages/api/auth/login.ts
// Módulo 11 — Endpoint de login con cookie de sesión

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const data = await request.formData();
  const usuario    = (data.get('usuario')    as string | null)?.trim() ?? '';
  const contrasena = (data.get('contrasena') as string | null)?.trim() ?? '';

  const USUARIO_VALIDO = import.meta.env.ADMIN_USER     ?? 'admin';
  const PASS_VALIDA    = import.meta.env.ADMIN_PASSWORD ?? 'admin123';
  const SESSION_SECRET = import.meta.env.SESSION_SECRET ?? 'dev-insecure-secret';

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
