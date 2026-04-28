// src/pages/api/auth/logout.ts
// Módulo 11 — Endpoint de logout

import type { APIRoute } from 'astro';

export const POST: APIRoute = ({ cookies, redirect }) => {
  cookies.delete('session-token', { path: '/' });
  return redirect('/login');
};
