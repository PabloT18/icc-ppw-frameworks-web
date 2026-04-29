# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg" width="80" alt="Nuxt Logo">
</div>

## Módulo A5: Proyecto Full-Stack con Nuxt

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Nuxt 3 no es solo un meta-framework para el frontend: incluye **Nitro**, un motor de servidor integrado que permite construir APIs REST directamente dentro del mismo proyecto. Esto elimina la necesidad de un backend separado para aplicaciones de complejidad media, permite compartir tipos TypeScript entre cliente y servidor, y simplifica el despliegue.

---

## 2. Conceptos Clave

### Nitro como servidor backend

Nitro es el motor de servidor de Nuxt 3. Detecta automáticamente los archivos en `server/` y los expone como endpoints HTTP:

| Directorio | Propósito |
|---|---|
| `server/api/` | Rutas bajo `/api/**` |
| `server/routes/` | Rutas arbitrarias sin prefijo `/api` |
| `server/middleware/` | Middleware global que se ejecuta en cada request |
| `server/utils/` | Utilidades auto-importadas en todo el servidor |
| `server/plugins/` | Plugins del servidor (inicialización) |

### Convención de nombres de archivos

Nitro usa el nombre del archivo para determinar el método HTTP:

```
server/api/notas/
├── index.get.ts      →  GET    /api/notas
├── index.post.ts     →  POST   /api/notas
├── [id].get.ts       →  GET    /api/notas/:id
├── [id].patch.ts     →  PATCH  /api/notas/:id
└── [id].delete.ts    →  DELETE /api/notas/:id
```

### Almacenamiento con `useStorage`

Nitro incluye un sistema de almacenamiento en capas. Para desarrollo, se puede usar memoria RAM o el sistema de archivos:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    storage: {
      data: { driver: 'memory' }
      // En producción: { driver: 'fs', base: './data' }
    }
  }
})
```

```typescript
// En un handler de servidor:
const storage = useStorage('data')
await storage.setItem('notas', [...])
const notas = await storage.getItem<Nota[]>('notas') ?? []
```

---

## 3. Handlers de Servidor

### `defineEventHandler`

Todos los endpoints usan `defineEventHandler`. Nitro infiere el tipo de respuesta automáticamente:

```typescript
export default defineEventHandler(async (event) => {
  // Leer query params
  const query = getQuery(event)

  // Leer el body (solo en POST/PATCH/PUT)
  const body = await readBody(event)

  // Leer un parámetro de ruta (ej: [id].get.ts)
  const id = getRouterParam(event, 'id')

  // Cambiar el status code de la respuesta
  setResponseStatus(event, 201)

  // Lanzar error HTTP
  throw createError({ statusCode: 404, message: 'No encontrado' })

  return { dato: 'valor' }  // Serializado como JSON automáticamente
})
```

### CRUD completo de notas

**GET /api/notas** — Obtener todas:

```typescript
// server/api/notas/index.get.ts
export default defineEventHandler(async () => {
  const storage = useStorage('data')
  const notas = await storage.getItem<Nota[]>('notas') ?? []
  return notas.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})
```

**POST /api/notas** — Crear:

```typescript
// server/api/notas/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody<Pick<Nota, 'titulo' | 'contenido'>>(event)

  if (!body.titulo?.trim()) {
    throw createError({ statusCode: 400, message: 'El título es obligatorio' })
  }

  const storage = useStorage('data')
  const notas = await storage.getItem<Nota[]>('notas') ?? []

  const nueva: Nota = {
    id: Date.now(),
    titulo: body.titulo.trim(),
    contenido: body.contenido?.trim() ?? '',
    completada: false,
    createdAt: new Date().toISOString()
  }

  notas.push(nueva)
  await storage.setItem('notas', notas)
  setResponseStatus(event, 201)
  return nueva
})
```

**PATCH /api/notas/:id** — Actualizar:

```typescript
// server/api/notas/[id].patch.ts
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<Partial<Nota>>(event)

  const storage = useStorage('data')
  const notas = await storage.getItem<Nota[]>('notas') ?? []

  const idx = notas.findIndex(n => n.id === id)
  if (idx === -1) throw createError({ statusCode: 404, message: 'Nota no encontrada' })

  notas[idx] = { ...notas[idx], ...body, id }
  await storage.setItem('notas', notas)
  return notas[idx]
})
```

**DELETE /api/notas/:id** — Eliminar:

```typescript
// server/api/notas/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  const storage = useStorage('data')
  const notas = await storage.getItem<Nota[]>('notas') ?? []

  const nuevas = notas.filter(n => n.id !== id)
  if (nuevas.length === notas.length) {
    throw createError({ statusCode: 404, message: 'Nota no encontrada' })
  }

  await storage.setItem('notas', nuevas)
  return { mensaje: 'Nota eliminada', id }
})
```

---

## 4. Consumo desde el cliente

Nuxt 3 proporciona composables isomórficos para consumir la API:

### `useFetch` — para cargar datos al montar la página

```typescript
// Carga automática con SSR + hydration
const { data: notas, refresh, pending } = await useFetch<Nota[]>('/api/notas')
```

### `$fetch` — para mutaciones (crear, actualizar, eliminar)

```typescript
// Mutación manual (no hace SSR)
await $fetch('/api/notas', {
  method: 'POST',
  body: { titulo: 'Nueva nota', contenido: 'Contenido...' }
})

// Después de la mutación, refrescar los datos:
await refresh()
```

### Diferencia clave

| | `useFetch` | `$fetch` |
|---|---|---|
| SSR | ✅ Sí | ❌ No |
| Reactivo | ✅ Sí | ❌ No |
| Uso típico | Cargar datos al renderizar | Mutaciones (crear/editar/borrar) |
| Re-fetch | `await refresh()` | Llamar manualmente |

---

## 5. Middleware de servidor

```typescript
// server/middleware/logger.ts
export default defineEventHandler((event) => {
  const method = event.method
  const url = event.path
  console.log(`[${new Date().toISOString()}] ${method} ${url}`)
  // No devolver nada = continúa al siguiente handler
})
```

---

## 6. Buenas Prácticas

- **Compartir tipos entre cliente y servidor**: define tus interfaces en `types/` en la raíz del proyecto, Nuxt los auto-importa.
- **Usar `useStorage` solo para datos simples y efímeros en desarrollo**: en producción usa una base de datos real.
- **Siempre validar el body en el servidor**: aunque el cliente envíe datos correctos, el servidor debe validarlos independientemente.
- **`$fetch` para mutaciones, `useFetch` para lecturas**: respetar este patrón mantiene el código predecible.
- **Nitro auto-importa** `useStorage`, `defineEventHandler`, `createError`, etc. — no necesitas importarlos manualmente.

---

## 7. Cuándo usar Nuxt full-stack vs backend separado

| Criterio | Nuxt full-stack | Backend separado |
|---|---|---|
| Equipo pequeño, MVP | ✅ Ideal | ❌ Overkill |
| Lógica de negocio compleja | ❌ Limita | ✅ Mejor |
| Múltiples clientes (móvil, web) | ❌ Acoplado | ✅ Mejor |
| Despliegue simplificado | ✅ Un solo deploy | ❌ Dos deploys |
| Escalabilidad independiente | ❌ | ✅ |

---

## 8. Referencias

- [Nuxt 3 - Server Engine (Nitro)](https://nuxt.com/docs/guide/concepts/server-engine)
- [Nitro - useStorage](https://nitro.unjs.io/guide/storage)
- [Nuxt 3 - useFetch](https://nuxt.com/docs/api/composables/use-fetch)
- [Nuxt 3 - $fetch](https://nuxt.com/docs/api/utils/dollarfetch)
- [Nitro - Event Handlers](https://nitro.unjs.io/guide/routing)
