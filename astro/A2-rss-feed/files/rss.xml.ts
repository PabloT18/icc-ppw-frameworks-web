// src/pages/rss.xml.ts
// A2 — Feed RSS del blog

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const ordenados = posts.sort(
    (a, b) => b.data.fecha.getTime() - a.data.fecha.getTime()
  );

  return rss({
    title: 'Astro Campus Blog',
    description: 'Recursos y tutoriales de programación web moderna.',
    site: context.site!.toString(),
    items: ordenados.map(post => ({
      title: post.data.titulo,
      description: post.data.descripcion,
      pubDate: post.data.fecha,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>es-ec</language>',
  });
}
