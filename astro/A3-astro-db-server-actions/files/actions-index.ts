// src/actions/index.ts
// A3 — Server Action: darLike

import { defineAction } from 'astro:actions';
import { db, eq, Likes } from 'astro:db';
import { z } from 'astro:schema';

export const server = {
  darLike: defineAction({
    accept: 'form',
    input: z.object({ slug: z.string().min(1) }),
    async handler({ slug }) {
      const [existing] = await db
        .select()
        .from(Likes)
        .where(eq(Likes.slug, slug));

      if (existing) {
        const nuevoConteo = existing.count + 1;
        await db
          .update(Likes)
          .set({ count: nuevoConteo })
          .where(eq(Likes.slug, slug));
        return { count: nuevoConteo };
      } else {
        await db.insert(Likes).values({ slug, count: 1 });
        return { count: 1 };
      }
    },
  }),
};
