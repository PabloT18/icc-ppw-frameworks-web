# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg" width="80" alt="Nuxt Logo">
</div>

## Práctica A5: Proyecto Full-Stack con Nuxt

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Construir una aplicación de notas full-stack usando Nuxt 3 con Nitro como backend. Se implementará un CRUD completo con persistencia en memoria, API REST en `server/api/`, y la UI consumiendo la API con `useFetch` y `$fetch`.

---

## Contexto

Se crea un nuevo proyecto `ppw-nuxt-fullstack`. Toda la lógica de backend vive en `server/api/notas/`. Los datos persisten en memoria durante el ciclo de vida del servidor (se reinician al reiniciar el servidor).

---

## Archivos que se van a crear

```
ppw-nuxt-fullstack/
├── nuxt.config.ts
├── types/
│   └── nota.ts
├── server/
│   └── api/
│       └── notas/
│           ├── index.get.ts
│           ├── index.post.ts
│           ├── [id].patch.ts
│           └── [id].delete.ts
└── pages/
    └── index.vue
```

---

## Paso 1: Crear el proyecto

```bash
pnpm dlx nuxi@latest init ppw-nuxt-fullstack
cd ppw-nuxt-fullstack
pnpm install
```

---

## Paso 2: Configurar Nuxt con almacenamiento Nitro

Edita `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: { strict: true },
  nitro: {
    storage: {
      data: { driver: 'memory' }
    }
  }
})
```

---

## Paso 3: Definir el tipo `Nota`

Crea `types/nota.ts`:

```typescript
export interface Nota {
  id: number
  titulo: string
  contenido: string
  completada: boolean
  createdAt: string
}
```

---

## Paso 4: Crear los handlers de la API

### `server/api/notas/index.get.ts` — Listar notas

```typescript
import type { Nota } from '~/types/nota'

export default defineEventHandler(async () => {
  const storage = useStorage('data')
  const notas = await storage.getItem<Nota[]>('notas') ?? []
  return notas.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})
```

### `server/api/notas/index.post.ts` — Crear nota

```typescript
import type { Nota } from '~/types/nota'

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

### `server/api/notas/[id].patch.ts` — Actualizar nota

```typescript
import type { Nota } from '~/types/nota'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<Partial<Omit<Nota, 'id' | 'createdAt'>>>(event)

  const storage = useStorage('data')
  const notas = await storage.getItem<Nota[]>('notas') ?? []

  const idx = notas.findIndex(n => n.id === id)
  if (idx === -1) {
    throw createError({ statusCode: 404, message: 'Nota no encontrada' })
  }

  notas[idx] = { ...notas[idx], ...body, id }
  await storage.setItem('notas', notas)
  return notas[idx]
})
```

### `server/api/notas/[id].delete.ts` — Eliminar nota

```typescript
import type { Nota } from '~/types/nota'

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

## Paso 5: Crear la página principal `pages/index.vue`

```vue
<script setup lang="ts">
import type { Nota } from '~/types/nota'

// Cargar notas con SSR
const { data: notas, refresh, pending } = await useFetch<Nota[]>('/api/notas')

// Estado del formulario
const titulo = ref('')
const contenido = ref('')
const error = ref('')
const guardando = ref(false)

// Estado de edición inline
const editandoId = ref<number | null>(null)
const editTitulo = ref('')
const editContenido = ref('')

// Estadísticas
const total = computed(() => notas.value?.length ?? 0)
const completadas = computed(() => notas.value?.filter(n => n.completada).length ?? 0)
const pendientes = computed(() => total.value - completadas.value)

// Crear nota
async function crearNota(): Promise<void> {
  if (!titulo.value.trim()) {
    error.value = 'El título es obligatorio'
    return
  }
  error.value = ''
  guardando.value = true

  try {
    await $fetch('/api/notas', {
      method: 'POST',
      body: { titulo: titulo.value, contenido: contenido.value }
    })
    titulo.value = ''
    contenido.value = ''
    await refresh()
  } catch (e: unknown) {
    error.value = 'No se pudo crear la nota'
  } finally {
    guardando.value = false
  }
}

// Alternar estado completada
async function toggleCompletada(nota: Nota): Promise<void> {
  await $fetch(`/api/notas/${nota.id}`, {
    method: 'PATCH',
    body: { completada: !nota.completada }
  })
  await refresh()
}

// Abrir edición inline
function iniciarEdicion(nota: Nota): void {
  editandoId.value = nota.id
  editTitulo.value = nota.titulo
  editContenido.value = nota.contenido
}

// Guardar edición inline
async function guardarEdicion(id: number): Promise<void> {
  if (!editTitulo.value.trim()) return
  await $fetch(`/api/notas/${id}`, {
    method: 'PATCH',
    body: { titulo: editTitulo.value.trim(), contenido: editContenido.value.trim() }
  })
  editandoId.value = null
  await refresh()
}

// Eliminar nota
async function eliminarNota(id: number): Promise<void> {
  if (!confirm('¿Eliminar esta nota?')) return
  await $fetch(`/api/notas/${id}`, { method: 'DELETE' })
  await refresh()
}

// Formatear fecha
function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'short', timeStyle: 'short'
  }).format(new Date(iso))
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">📝 Mis Notas</h1>
      <p class="app-subtitle">Full-Stack con Nuxt 3 + Nitro</p>
    </header>

    <!-- Stats -->
    <div class="stats-bar">
      <div class="stat">
        <span class="stat-num">{{ total }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat">
        <span class="stat-num completadas">{{ completadas }}</span>
        <span class="stat-label">Completadas</span>
      </div>
      <div class="stat">
        <span class="stat-num pendientes">{{ pendientes }}</span>
        <span class="stat-label">Pendientes</span>
      </div>
    </div>

    <!-- Formulario de creación -->
    <section class="seccion-crear">
      <h2 class="seccion-titulo">Nueva nota</h2>
      <div class="form-grupo">
        <input
          v-model="titulo"
          type="text"
          placeholder="Título de la nota"
          class="input-titulo"
          @keydown.enter="crearNota"
          :disabled="guardando"
        />
        <textarea
          v-model="contenido"
          placeholder="Contenido (opcional)"
          rows="2"
          class="input-contenido"
          :disabled="guardando"
        ></textarea>
        <p v-if="error" class="form-error" role="alert">⚠️ {{ error }}</p>
        <button class="btn-crear" @click="crearNota" :disabled="guardando">
          {{ guardando ? 'Guardando...' : '+ Agregar nota' }}
        </button>
      </div>
    </section>

    <!-- Lista de notas -->
    <section class="seccion-lista">
      <div v-if="pending" class="estado-carga">Cargando notas...</div>

      <div v-else-if="!notas?.length" class="estado-vacio">
        <p>No hay notas todavía. ¡Crea la primera!</p>
      </div>

      <div v-else class="lista-notas">
        <article
          v-for="nota in notas"
          :key="nota.id"
          class="tarjeta-nota"
          :class="{ completada: nota.completada }"
        >
          <!-- Modo visualización -->
          <template v-if="editandoId !== nota.id">
            <div class="nota-contenido">
              <label class="check-label">
                <input
                  type="checkbox"
                  :checked="nota.completada"
                  @change="toggleCompletada(nota)"
                  class="check-input"
                />
                <span class="nota-titulo" :class="{ tachado: nota.completada }">
                  {{ nota.titulo }}
                </span>
              </label>
              <p v-if="nota.contenido" class="nota-texto">{{ nota.contenido }}</p>
              <time class="nota-fecha">{{ formatFecha(nota.createdAt) }}</time>
            </div>
            <div class="nota-acciones">
              <button class="btn-editar" @click="iniciarEdicion(nota)" title="Editar">✏️</button>
              <button class="btn-eliminar" @click="eliminarNota(nota.id)" title="Eliminar">🗑️</button>
            </div>
          </template>

          <!-- Modo edición inline -->
          <template v-else>
            <div class="edicion-form">
              <input v-model="editTitulo" class="input-edit-titulo" type="text" />
              <textarea v-model="editContenido" class="input-edit-contenido" rows="2"></textarea>
              <div class="edicion-acciones">
                <button class="btn-cancelar-edit" @click="editandoId = null">Cancelar</button>
                <button class="btn-guardar-edit" @click="guardarEdicion(nota.id)">Guardar</button>
              </div>
            </div>
          </template>
        </article>
      </div>
    </section>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #f0f4f8; color: #333; }
</style>

<style scoped>
.app { max-width: 680px; margin: 0 auto; padding: 2rem 1rem; }

.app-header { text-align: center; margin-bottom: 1.5rem; }
.app-title { font-size: 2rem; color: #35495E; }
.app-subtitle { color: #888; font-size: 0.9rem; margin-top: 0.25rem; }

.stats-bar { display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
.stat { background: white; border-radius: 10px; padding: 0.75rem 1.5rem; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.stat-num { display: block; font-size: 1.75rem; font-weight: 700; color: #35495E; }
.stat-num.completadas { color: #42B883; }
.stat-num.pendientes { color: #f39c12; }
.stat-label { font-size: 0.75rem; color: #999; text-transform: uppercase; }

.seccion-crear { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.seccion-titulo { font-size: 1rem; color: #35495E; margin-bottom: 1rem; }

.form-grupo { display: flex; flex-direction: column; gap: 0.5rem; }
.input-titulo, .input-contenido {
  padding: 0.65rem 0.85rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.15s;
}
.input-titulo:focus, .input-contenido:focus { outline: none; border-color: #42B883; }
.input-contenido { resize: vertical; }
.form-error { color: #e74c3c; font-size: 0.85rem; }

.btn-crear {
  align-self: flex-end;
  padding: 0.6rem 1.5rem;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.15s;
}
.btn-crear:hover:not(:disabled) { background: #35495E; }
.btn-crear:disabled { opacity: 0.5; cursor: not-allowed; }

.seccion-lista { }
.estado-carga, .estado-vacio { text-align: center; padding: 3rem; color: #999; }

.lista-notas { display: flex; flex-direction: column; gap: 0.75rem; }

.tarjeta-nota {
  background: white;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  transition: opacity 0.2s;
}
.tarjeta-nota.completada { opacity: 0.6; }

.nota-contenido { flex: 1; }
.check-label { display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer; }
.check-input { width: 16px; height: 16px; cursor: pointer; accent-color: #42B883; flex-shrink: 0; margin-top: 2px; }
.nota-titulo { font-size: 0.95rem; font-weight: 600; color: #35495E; line-height: 1.4; }
.nota-titulo.tachado { text-decoration: line-through; color: #aaa; }
.nota-texto { font-size: 0.85rem; color: #666; margin-top: 0.35rem; padding-left: 1.4rem; }
.nota-fecha { display: block; font-size: 0.75rem; color: #bbb; margin-top: 0.5rem; padding-left: 1.4rem; }

.nota-acciones { display: flex; gap: 0.25rem; flex-shrink: 0; }
.btn-editar, .btn-eliminar { background: none; border: none; padding: 0.3rem 0.4rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
.btn-editar:hover { background: #e8f5ee; }
.btn-eliminar:hover { background: #ffeaea; }

.edicion-form { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.input-edit-titulo, .input-edit-contenido {
  padding: 0.5rem 0.65rem;
  border: 1px solid #42B883;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
}
.input-edit-contenido { resize: vertical; }
.edicion-acciones { display: flex; gap: 0.5rem; justify-content: flex-end; }
.btn-cancelar-edit { padding: 0.4rem 0.85rem; background: white; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-size: 0.8rem; }
.btn-guardar-edit { padding: 0.4rem 0.85rem; background: #42B883; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
</style>
```

---

## Validaciones Esperadas

- [ ] `pnpm dev` inicia el servidor en `http://localhost:3000`
- [ ] `GET /api/notas` retorna un array (inicialmente vacío)
- [ ] Crear una nota retorna status 201 y aparece en la lista
- [ ] Marcar una nota como completada la tachao y reduce el contador de pendientes
- [ ] Editar una nota actualiza su título y contenido en la lista
- [ ] Eliminar una nota la quita de la lista
- [ ] Al crear sin título aparece el error de validación (400 del servidor)
- [ ] Las notas persisten mientras el servidor no se reinicie

---

## Commits Sugeridos

```bash
git add types/ nuxt.config.ts
git commit -m "feat: tipos y configuración de storage Nitro (A5)"
git add server/
git commit -m "feat: API REST CRUD de notas con Nitro (A5)"
git add pages/
git commit -m "feat: página de notas con useFetch y $fetch (A5)"
```
