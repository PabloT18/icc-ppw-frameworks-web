// src/middleware.ts
// Módulo 10 — Middleware: logging + protección de rutas

import { defineMiddleware } from 'astro:middleware';

const RUTAS_PRIVADAS = ['/dashboard'];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, redirect }, next) => {
    console.log(`[${new Date().toISOString()}] ${url.pathname}`);

    const sessionId = cookies.get('session-id')?.value ?? null;
    locals.sessionId = sessionId;
    locals.autenticado = Boolean(sessionId);

    const esPrivada = RUTAS_PRIVADAS.some(r => url.pathname.startsWith(r));
    if (esPrivada && !locals.autenticado) {
      return redirect('/login');
    }

    return next();
  }
);
