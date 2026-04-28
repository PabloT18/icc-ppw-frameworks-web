// src/middleware.ts
// Módulo 11 — Middleware con autenticación por cookie de sesión

import { defineMiddleware } from 'astro:middleware';

const RUTAS_PRIVADAS = ['/dashboard'];
const RUTAS_AUTH    = ['/login'];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, redirect }, next) => {
    console.log(`[${new Date().toISOString()}] ${url.pathname}`);

    const sessionToken   = cookies.get('session-token')?.value ?? null;
    const SESSION_SECRET = import.meta.env.SESSION_SECRET ?? 'dev-insecure-secret';

    locals.autenticado = sessionToken === SESSION_SECRET;
    locals.sessionId   = sessionToken;

    const esPrivada = RUTAS_PRIVADAS.some(r => url.pathname.startsWith(r));
    if (esPrivada && !locals.autenticado) {
      return redirect('/login?next=' + encodeURIComponent(url.pathname));
    }

    if (RUTAS_AUTH.includes(url.pathname) && locals.autenticado) {
      return redirect('/dashboard');
    }

    return next();
  }
);
