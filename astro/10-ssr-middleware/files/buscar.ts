// src/pages/api/buscar.ts
// Módulo 10 — Endpoint GET de búsqueda por query param

import type { APIRoute } from 'astro';

// Datos en memoria (en producción: consultar DB)
const recursos = [
  { slug: 'intro-astro',       titulo: 'Introducción a Astro',       descripcion: 'Primeros pasos con el framework.',    categoria: 'framework' },
  { slug: 'rutas-dinamicas',   titulo: 'Rutas Dinámicas',           descripcion: 'getStaticPaths y páginas dinámicas.',  categoria: 'rutas' },
  { slug: 'css-variables',     titulo: 'CSS Custom Properties',     descripcion: 'Sistema de tokens con CSS.',          categoria: 'estilos' },
  { slug: 'content-collections', titulo: 'Content Collections',    descripcion: 'Markdown con Zod y type-safety.',     categoria: 'contenido' },
  { slug: 'ssr-middleware',    titulo: 'SSR y Middleware',          descripcion: 'Servidor, cookies y contexto.',       categoria: 'servidor' },
];

export const GET: APIRoute = ({ url }) => {
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
