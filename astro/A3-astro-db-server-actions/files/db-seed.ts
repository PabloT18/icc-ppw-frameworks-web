// db/seed.ts
// A3 — Datos iniciales para la tabla Likes

import { db, Likes } from 'astro:db';

export default async function seed() {
  await db.insert(Likes).values([
    { slug: 'intro-astro',     count: 12 },
    { slug: 'rutas-dinamicas', count:  8 },
    { slug: 'componentes',     count:  5 },
  ]);
}
