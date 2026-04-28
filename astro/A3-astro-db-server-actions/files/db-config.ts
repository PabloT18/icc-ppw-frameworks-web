// db/config.ts
// A3 — Schema de Astro DB

import { column, defineDb, defineTable } from 'astro:db';

const Likes = defineTable({
  columns: {
    id:    column.number({ primaryKey: true }),
    slug:  column.text({ unique: true }),
    count: column.number({ default: 0 }),
  },
});

export default defineDb({ tables: { Likes } });
