// src/content/config.ts
// Módulo 06 — Definición de Content Collections

import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string().optional(),
    fecha: z.coerce.date(),
    autor: z.string().default('Pablo Torres'),
    etiquetas: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
