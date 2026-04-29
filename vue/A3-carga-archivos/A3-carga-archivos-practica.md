# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica A3: Carga de Archivos

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Implementar un componente de carga de imágenes con previsualización instantánea usando `URL.createObjectURL`, validación de tipo y tamaño, barra de progreso simulada, soporte drag & drop, y el composable `useFileUpload`.

---

## Contexto

Se extiende el proyecto `ppw-vue-app`. El componente de carga se integra en el panel administrativo (A2) para permitir cambiar la imagen de un producto.

---

## Archivos que se van a crear

```
ppw-vue-app/src/
├── composables/
│   └── useFileUpload.ts        ← Crear
└── components/admin/
    └── ImageUploader.vue       ← Crear
```

---

## Paso 1: Crear el composable `useFileUpload`

Crea `src/composables/useFileUpload.ts`:

```typescript
import { ref, onUnmounted } from 'vue'

const MAX_MB = 2
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']

export function useFileUpload() {
  const archivo = ref<File | null>(null)
  const previewUrl = ref<string | null>(null)
  const error = ref<string | null>(null)
  const progreso = ref(0)
  const subiendo = ref(false)
  const exitoso = ref(false)

  function seleccionar(f: File): void {
    error.value = null
    exitoso.value = false

    if (!TIPOS_PERMITIDOS.includes(f.type)) {
      error.value = `Tipo no permitido. Usa: JPG, PNG o WebP`
      return
    }

    const mb = f.size / (1024 * 1024)
    if (mb > MAX_MB) {
      error.value = `El archivo pesa ${mb.toFixed(1)} MB. Máximo permitido: ${MAX_MB} MB`
      return
    }

    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)

    archivo.value = f
    previewUrl.value = URL.createObjectURL(f)
  }

  function limpiar(): void {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    archivo.value = null
    previewUrl.value = null
    error.value = null
    progreso.value = 0
    exitoso.value = false
  }

  async function simularEnvio(): Promise<void> {
    if (!archivo.value) return
    subiendo.value = true
    progreso.value = 0
    exitoso.value = false

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 120))
      progreso.value = i
    }

    subiendo.value = false
    exitoso.value = true
  }

  onUnmounted(limpiar)

  return {
    archivo,
    previewUrl,
    error,
    progreso,
    subiendo,
    exitoso,
    seleccionar,
    limpiar,
    simularEnvio
  }
}
```

---

## Paso 2: Crear el componente `ImageUploader.vue`

Crea `src/components/admin/ImageUploader.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useFileUpload } from '@/composables/useFileUpload'

const { previewUrl, error, progreso, subiendo, exitoso, seleccionar, limpiar, simularEnvio } = useFileUpload()

const inputRef = ref<HTMLInputElement | null>(null)
const arrastrando = ref(false)

function alSeleccionar(evento: Event): void {
  const input = evento.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) seleccionar(f)
}

function alArrastrarEncima(e: DragEvent): void {
  e.preventDefault()
  arrastrando.value = true
}

function alArrastrarFuera(): void {
  arrastrando.value = false
}

function alSoltar(e: DragEvent): void {
  e.preventDefault()
  arrastrando.value = false
  const f = e.dataTransfer?.files[0]
  if (f) seleccionar(f)
}

async function subir(): Promise<void> {
  await simularEnvio()
}
</script>

<template>
  <div class="uploader">
    <h3 class="titulo">Cargar imagen del producto</h3>

    <!-- Zona de drop -->
    <div
      class="zona-drop"
      :class="{ arrastrando, 'con-preview': !!previewUrl }"
      @dragover="alArrastrarEncima"
      @dragleave="alArrastrarFuera"
      @drop="alSoltar"
      @click="inputRef?.click()"
      role="button"
      tabindex="0"
      aria-label="Seleccionar imagen"
      @keydown.enter="inputRef?.click()"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="Preview"
        class="preview-img"
      />
      <div v-else class="placeholder">
        <span class="icono">🖼️</span>
        <p class="texto-principal">Arrastra una imagen aquí</p>
        <p class="texto-secundario">o haz clic para seleccionar</p>
        <p class="restricciones">JPG, PNG, WebP · Máximo 2 MB</p>
      </div>
    </div>

    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="input-oculto"
      @change="alSeleccionar"
    />

    <!-- Error de validación -->
    <p v-if="error" class="mensaje-error" role="alert">⚠️ {{ error }}</p>

    <!-- Mensaje de éxito -->
    <p v-if="exitoso" class="mensaje-exito">✅ Imagen cargada correctamente</p>

    <!-- Barra de progreso -->
    <div v-if="subiendo || progreso > 0" class="progreso-wrapper">
      <div class="progreso-barra">
        <div
          class="progreso-relleno"
          :style="{ width: progreso + '%' }"
          role="progressbar"
          :aria-valuenow="progreso"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <span class="progreso-texto">{{ progreso }}%</span>
    </div>

    <!-- Acciones -->
    <div class="acciones" v-if="previewUrl">
      <button class="btn-limpiar" @click="limpiar" :disabled="subiendo">
        Limpiar
      </button>
      <button
        class="btn-subir"
        @click="subir"
        :disabled="subiendo || exitoso"
      >
        {{ subiendo ? 'Cargando...' : exitoso ? '¡Listo!' : 'Cargar imagen' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.uploader { max-width: 480px; }
.titulo { font-size: 1rem; color: #35495E; margin-bottom: 1rem; }

.zona-drop {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zona-drop:hover { border-color: #42B883; background: #f0faf5; }
.zona-drop.arrastrando { border-color: #42B883; background: #e8f7ef; }
.zona-drop.con-preview { padding: 0; border-style: solid; }
.zona-drop:focus-visible { outline: 2px solid #42B883; outline-offset: 2px; }

.preview-img { width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; }
.placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; }
.icono { font-size: 2.5rem; }
.texto-principal { font-size: 0.95rem; color: #35495E; font-weight: 500; }
.texto-secundario { font-size: 0.85rem; color: #777; }
.restricciones { font-size: 0.78rem; color: #bbb; }

.input-oculto { display: none; }

.mensaje-error { color: #e74c3c; font-size: 0.875rem; margin-top: 0.5rem; }
.mensaje-exito { color: #42B883; font-size: 0.875rem; margin-top: 0.5rem; }

.progreso-wrapper { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem; }
.progreso-barra { flex: 1; height: 8px; background: #eee; border-radius: 99px; overflow: hidden; }
.progreso-relleno { height: 100%; background: #42B883; border-radius: 99px; transition: width 0.12s; }
.progreso-texto { font-size: 0.8rem; color: #666; width: 36px; text-align: right; }

.acciones { display: flex; gap: 0.75rem; margin-top: 1rem; }
.btn-limpiar { padding: 0.55rem 1rem; background: white; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-size: 0.875rem; }
.btn-subir { flex: 1; padding: 0.55rem 1rem; background: #42B883; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 600; transition: background 0.15s; }
.btn-subir:hover:not(:disabled) { background: #35495E; }
.btn-subir:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
```

---

## Paso 3: Integrar el uploader en el panel administrativo

Dentro de `AdminProductos.vue`, importa y usa el componente al editar un producto:

```vue
<script setup lang="ts">
import ImageUploader from '@/components/admin/ImageUploader.vue'
</script>

<!-- Dentro del modal de edición, agrega: -->
<template>
  <!-- ... campos del formulario ... -->
  <div class="form-campo">
    <label>Imagen del producto</label>
    <ImageUploader />
  </div>
</template>
```

---

## Paso 4: Crear una vista de demostración standalone

Crea `src/views/admin/UploadDemoView.vue` para probar el componente de forma aislada:

```vue
<script setup lang="ts">
import ImageUploader from '@/components/admin/ImageUploader.vue'
</script>

<template>
  <div class="demo-wrapper">
    <h2>Demo: Carga de Imágenes</h2>
    <p class="descripcion">
      Este componente muestra previsualización inmediata usando
      <code>URL.createObjectURL()</code> y progreso simulado.
    </p>

    <ImageUploader />

    <div class="info-tecnica">
      <h4>¿Cómo funciona?</h4>
      <ul>
        <li>El usuario selecciona o arrastra una imagen</li>
        <li><code>URL.createObjectURL()</code> crea una URL temporal en memoria</li>
        <li>La imagen se muestra instantáneamente sin subir nada todavía</li>
        <li>Al hacer clic en "Cargar", se simula el envío con progreso</li>
        <li>Al desmontar el componente, la URL se libera con <code>revokeObjectURL()</code></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-wrapper { max-width: 600px; }
.demo-wrapper h2 { font-size: 1.5rem; color: #35495E; margin-bottom: 0.5rem; }
.descripcion { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
.info-tecnica { margin-top: 2rem; background: #f0faf5; border-radius: 8px; padding: 1.25rem; }
.info-tecnica h4 { color: #35495E; margin-bottom: 0.75rem; }
.info-tecnica ul { padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem; }
.info-tecnica li { font-size: 0.875rem; color: #555; }
code { background: #e8f5ee; color: #35495E; padding: 0.1em 0.3em; border-radius: 3px; font-size: 0.85em; }
</style>
```

---

## Validaciones Esperadas

- [ ] Al seleccionar un JPG/PNG/WebP válido se muestra la preview instantáneamente
- [ ] Al seleccionar un archivo de tipo incorrecto (PDF, GIF) aparece el mensaje de error
- [ ] Al seleccionar un archivo mayor a 2 MB aparece el error de tamaño
- [ ] Arrastrar y soltar una imagen en la zona también activa la preview
- [ ] El botón "Cargar" activa la barra de progreso que va de 0 a 100%
- [ ] Al hacer clic en "Limpiar" se elimina la preview y se resetea el estado
- [ ] En DevTools → Memory no quedan `blob:` URLs acumuladas tras limpiar

---

## Commits Sugeridos

```bash
git add src/composables/useFileUpload.ts
git commit -m "feat: composable useFileUpload con validación y preview (A3)"
git add src/components/admin/ImageUploader.vue src/views/admin/UploadDemoView.vue
git commit -m "feat: componente ImageUploader con drag-drop y barra de progreso"
```
