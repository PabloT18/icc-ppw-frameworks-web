# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica A3: Astro DB y Server Actions

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Agregar un sistema de "likes" persistente a los recursos de `astro-campus`, usando Astro DB para la base de datos y un Server Action para el formulario.

---

## Archivos que se crean / modifican

```
astro-campus/
├── db/
│   ├── config.ts              ← NUEVO
│   └── seed.ts                ← NUEVO
└── src/
    ├── actions/
    │   └── index.ts           ← NUEVO
    └── pages/
        └── likes.astro        ← NUEVO (demo)
```

---

## Paso 1: Instalar Astro DB

```bash
pnpm astro add db
```

---

## Paso 2: Crear `db/config.ts`

**¿Qué hace este paso?** Define el schema de la tabla `Likes` en la base de datos.

```typescript
// db/config.ts
import { defineDb, defineTable, column } from 'astro:db';

const Likes = defineTable({
  columns: {
    id:    column.number({ primaryKey: true }),
    slug:  column.text({ unique: true }),
    count: column.number({ default: 0 }),
  },
});

export default defineDb({ tables: { Likes } });
```

---

## Paso 3: Crear `db/seed.ts`

**¿Qué hace este paso?** Inserta datos iniciales para que la demo funcione sin registros vacíos.

```typescript
// db/seed.ts
import { db, Likes } from 'astro:db';

export default async function seed() {
  await db.insert(Likes).values([
    { slug: 'intro-astro',     count: 12 },
    { slug: 'rutas-dinamicas', count:  8 },
    { slug: 'componentes',     count:  5 },
  ]);
}
```

---

## Paso 4: Crear `src/actions/index.ts`

**¿Qué hace este paso?** Define el Server Action `darLike` que incrementa el contador en la base de datos. Astro valida el input con Zod automáticamente.

```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, Likes, eq } from 'astro:db';

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
```

---

## Paso 5: Crear `src/pages/likes.astro`

**¿Qué hace este paso?** Página demo que muestra los likes actuales y permite dar like con un formulario que usa el Server Action.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { actions } from 'astro:actions';
import { db, Likes } from 'astro:db';

// Leer resultado del action si se envió el formulario
const result = Astro.getActionResult(actions.darLike);

// Obtener todos los recursos con sus likes
const todos = await db.select().from(Likes);
---

<BaseLayout titulo="Likes" descripcion="Sistema de likes de los recursos.">
  <h1>❤️ Likes por recurso</h1>

  {result?.error && <p class="error">Error: {result.error.message}</p>}

  <ul class="likes-list">
    {todos.map(item => (
      <li>
        <span class="slug">{item.slug}</span>
        <span class="count">{item.count} likes</span>
        <form method="POST" action={actions.darLike}>
          <input type="hidden" name="slug" value={item.slug} />
          <button type="submit">❤️ Dar like</button>
        </form>
      </li>
    ))}
  </ul>
</BaseLayout>

<style>
  .likes-list { list-style: none; padding: 0; }
  .likes-list li {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.75rem 0; border-bottom: 1px solid var(--color-border, #333);
  }
  .slug { flex: 1; font-family: monospace; }
  .count { color: var(--color-text-muted, #aaa); font-size: 0.9rem; min-width: 5rem; }
  button { background: var(--color-brand, #FF5D01); border: none; border-radius: 0.4rem; color: #fff; cursor: pointer; padding: 0.35rem 0.8rem; }
</style>
```

---

## Paso 6: TODO — Completar por el estudiante

```typescript
// TODO en src/actions/index.ts:
// Agregar un segundo action: quitarLike
// Que decremente el count pero nunca baje de 0
// Pista: Math.max(0, existing.count - 1)
```

---

## Validaciones esperadas

- [ ] La base de datos se inicializa con `pnpm astro dev`
- [ ] `/likes` muestra los tres recursos con sus contadores
- [ ] Hacer click en "Dar like" incrementa el contador y recarga la página
- [ ] El contador persiste entre recargas (se almacena en SQLite)

---

## Entregables

- `db/config.ts` con el schema de la tabla Likes
- `db/seed.ts` con datos iniciales
- `src/actions/index.ts` con el Server Action `darLike`
- `src/pages/likes.astro` funcional
- Captura de la página `/likes` con los contadores

---

## Commits sugeridos

```
feat: add Astro DB schema for Likes table
feat: seed initial likes data
feat: add darLike server action
feat: add /likes demo page
```
