---
titulo: "Rutas Dinámicas en Astro"
descripcion: "Cómo usar getStaticPaths para generar páginas desde datos."
fecha: 2024-03-22
autor: "Pablo Torres"
etiquetas: ["astro", "routing", "typescript"]
draft: false
---

## getStaticPaths

La función `getStaticPaths` le indica a Astro qué rutas debe generar.
Retorna un array de objetos `{ params, props }`.

```astro
---
export function getStaticPaths() {
  return datos.map(d => ({
    params: { slug: d.slug },
    props: { item: d },
  }));
}
---
```

## Paginación nativa

Astro incluye soporte de primera clase para paginación con `paginate()`.
El helper divide automáticamente el array y genera las rutas `/recursos/1`, `/recursos/2`, etc.
