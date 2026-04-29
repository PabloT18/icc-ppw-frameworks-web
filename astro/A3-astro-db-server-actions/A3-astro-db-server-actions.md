# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo A3: Astro DB y Server Actions

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Astro DB es la solución de base de datos integrada en Astro: un wrapper sobre libSQL (fork de SQLite compatible con Turso) que funciona sin configurar un servidor de base de datos externo. Los Server Actions permiten ejecutar lógica del servidor directamente desde formularios sin necesitar un endpoint HTTP explícito.

---

## 2. Conceptos Clave

### Astro DB

- Basado en **libSQL** — SQLite embebido, sin servidor externo en desarrollo.
- En producción: conecta a **Turso** (libSQL en la nube) o similar.
- Schema definido en `db/config.ts`, datos iniciales en `db/seed.ts`.
- Las tablas se acceden con el ORM integrado: `db.select()`, `db.insert()`, `db.update()`.

### Server Actions

- Definidos en `src/actions/index.ts` con `defineAction`.
- Validación automática de inputs con Zod.
- Llamados desde formularios o fetch: `actions.nombre()`.
- Ejecutan exclusivamente en el servidor — no se expone código privado.

---

## 3. Explicación

### Configurar Astro DB

```bash
pnpm astro add db
```

### `db/config.ts` — Definición del schema

```typescript
import { defineDb, defineTable, column } from 'astro:db';

const Likes = defineTable({
  columns: {
    id:     column.number({ primaryKey: true }),
    slug:   column.text({ unique: true }),
    count:  column.number({ default: 0 }),
  },
});

export default defineDb({ tables: { Likes } });
```

### `db/seed.ts` — Datos iniciales

```typescript
import { db, Likes } from 'astro:db';

export default async function seed() {
  await db.insert(Likes).values([
    { slug: 'intro-astro',     count: 12 },
    { slug: 'rutas-dinamicas', count: 8  },
  ]);
}
```

### `src/actions/index.ts` — Server Actions

```typescript
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db, Likes, eq } from 'astro:db';

export const server = {
  darLike: defineAction({
    input: z.object({ slug: z.string().min(1) }),
    async handler({ slug }) {
      const [existing] = await db
        .select()
        .from(Likes)
        .where(eq(Likes.slug, slug));

      if (existing) {
        await db
          .update(Likes)
          .set({ count: existing.count + 1 })
          .where(eq(Likes.slug, slug));
        return { count: existing.count + 1 };
      } else {
        await db.insert(Likes).values({ slug, count: 1 });
        return { count: 1 };
      }
    },
  }),
};
```

---

## 4. Ejemplos de Código

### Página con likes usando Server Action

```astro
---
import { actions } from 'astro:actions';
import { db, Likes, eq } from 'astro:db';

const slug = 'intro-astro';
const [recurso] = await db.select().from(Likes).where(eq(Likes.slug, slug));
const likes = recurso?.count ?? 0;

const result = Astro.getActionResult(actions.darLike);
const likesDespues = result?.data?.count ?? likes;
---

<form method="POST" action={actions.darLike}>
  <input type="hidden" name="slug" value={slug} />
  <button type="submit">❤️ Me gusta ({likesDespues})</button>
</form>
```

---

## 5. Buenas Prácticas

- Definir todos los tipos en `db/config.ts` — evitar hardcodear columnas.
- Usar `seed.ts` para datos de prueba — no mezclar con la lógica del schema.
- Los Server Actions validan con Zod automáticamente — no duplicar validaciones.
- En producción, configurar `ASTRO_DB_REMOTE_URL` y `ASTRO_DB_APP_TOKEN` para Turso.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `astro:db` no encontrado | Integration no instalada | `pnpm astro add db` |
| Cambios de schema no reflejados | Falta reiniciar dev | `pnpm astro dev` desde cero |
| Seed no ejecuta | Olvidar exportar default | `export default async function seed()` |
| Action retorna error sin mensaje | Zod falló | Revisar la `input` del action |

---

## 7. Relación con el Proyecto Incremental

En este módulo complementario, `astro-campus` añade un sistema de "likes" para los recursos, usando Astro DB para persistencia y un Server Action para el formulario de like.

---

## 8. Recursos

- [Astro DB](https://docs.astro.build/es/guides/astro-db/)
- [Server Actions](https://docs.astro.build/es/guides/actions/)
- [Turso](https://turso.tech/)
- [libSQL](https://github.com/libsql/libsql)
