# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo A3: Carga de Archivos

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

La carga de archivos (file upload) es una funcionalidad esencial en aplicaciones modernas: imágenes de perfil, documentos, imágenes de producto. Este módulo cubre el flujo completo desde la selección del archivo hasta su envío al servidor, con previsualización, validación y retroalimentación de progreso.

---

## 2. Conceptos Clave

### La API de archivos del navegador

| API | Propósito |
|---|---|
| `<input type="file">` | Selector de archivos nativo |
| `File` | Objeto con metadatos (nombre, tamaño, tipo) |
| `FileList` | Colección de archivos seleccionados |
| `FileReader` | Lee el contenido del archivo como texto o base64 |
| `URL.createObjectURL()` | Crea URL temporal en memoria para previsualizar |
| `FormData` | Envía archivos como multipart/form-data |

### Diferencia: FileReader vs createObjectURL

```typescript
// ✅ Para preview de imágenes: más rápido y eficiente
const url = URL.createObjectURL(file)
// ⚠️ Recuerda liberar la memoria cuando ya no necesites la URL:
URL.revokeObjectURL(url)

// ✅ Para leer contenido (texto, JSON, CSV):
const reader = new FileReader()
reader.readAsText(file)
reader.onload = (e) => console.log(e.target?.result)

// Para base64 (enviar imagen como string):
reader.readAsDataURL(file)
```

---

## 3. Explicación Técnica Detallada

### Input de archivo y acceso a los archivos

```typescript
// Referencia al input
const inputRef = ref<HTMLInputElement | null>(null)

// Manejar el evento change
function alSeleccionarArchivo(evento: Event): void {
  const input = evento.target as HTMLInputElement
  if (!input.files?.length) return

  const archivo = input.files[0]
  procesarArchivo(archivo)
}
```

### Validación de archivo

```typescript
const MAX_MB = 2
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']

function validarArchivo(archivo: File): string | null {
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return `Tipo no permitido. Acepta: ${TIPOS_PERMITIDOS.join(', ')}`
  }
  const mb = archivo.size / (1024 * 1024)
  if (mb > MAX_MB) {
    return `El archivo pesa ${mb.toFixed(1)} MB. Máximo: ${MAX_MB} MB`
  }
  return null  // Sin error
}
```

### Previsualización con `URL.createObjectURL`

```typescript
const previewUrl = ref<string | null>(null)
const nombreArchivo = ref('')
const errorValidacion = ref<string | null>(null)

function procesarArchivo(archivo: File): void {
  errorValidacion.value = validarArchivo(archivo)
  if (errorValidacion.value) return

  // Liberar la URL anterior si existía
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)

  previewUrl.value = URL.createObjectURL(archivo)
  nombreArchivo.value = archivo.name
}

// Importante: limpiar cuando el componente se destruye
onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
```

### Envío con `FormData` y progreso

```typescript
const enviando = ref(false)
const progreso = ref(0)

async function enviarArchivo(archivo: File): Promise<void> {
  enviando.value = true
  progreso.value = 0

  const formData = new FormData()
  formData.append('imagen', archivo)
  formData.append('tipo', 'producto')

  try {
    // Con Axios (muestra progreso real):
    await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        progreso.value = Math.round((evt.loaded / (evt.total ?? 1)) * 100)
      }
    })
    progreso.value = 100
  } finally {
    enviando.value = false
  }
}
```

### Progreso simulado (cuando no tienes un servidor real)

```typescript
async function simularCarga(): Promise<void> {
  enviando.value = true
  progreso.value = 0

  for (let i = 0; i <= 100; i += 10) {
    await new Promise(r => setTimeout(r, 120))
    progreso.value = i
  }

  enviando.value = false
}
```

### Drag & Drop

```typescript
const arrastrando = ref(false)

function alArrastrarEncima(e: DragEvent): void {
  e.preventDefault()
  arrastrando.value = true
}

function alSoltar(e: DragEvent): void {
  e.preventDefault()
  arrastrando.value = false
  const archivo = e.dataTransfer?.files[0]
  if (archivo) procesarArchivo(archivo)
}
```

---

## 4. Composable `useFileUpload`

```typescript
// src/composables/useFileUpload.ts
import { ref, onUnmounted } from 'vue'

const MAX_MB = 2
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']

export function useFileUpload() {
  const archivo = ref<File | null>(null)
  const previewUrl = ref<string | null>(null)
  const error = ref<string | null>(null)
  const progreso = ref(0)
  const subiendo = ref(false)

  function seleccionar(f: File): void {
    error.value = null

    if (!TIPOS_PERMITIDOS.includes(f.type)) {
      error.value = 'Tipo de archivo no permitido'
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      error.value = `El archivo supera el tamaño máximo de ${MAX_MB} MB`
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
  }

  async function simularEnvio(): Promise<void> {
    if (!archivo.value) return
    subiendo.value = true
    progreso.value = 0
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 120))
      progreso.value = i
    }
    subiendo.value = false
  }

  onUnmounted(limpiar)

  return { archivo, previewUrl, error, progreso, subiendo, seleccionar, limpiar, simularEnvio }
}
```

---

## 5. Buenas Prácticas

- **Siempre validar en el cliente Y en el servidor**: la validación del cliente es UX, no seguridad.
- **Liberar las URLs creadas con `createObjectURL`**: evita memory leaks.
- **Dar retroalimentación de progreso**: el usuario no debe quedarse sin saber si algo está pasando.
- **Limitar tipos y tamaño explícitamente**: no confiar en el atributo `accept` del input (se puede eludir).
- **Usar `FormData` para el envío**: es el estándar para multipart/form-data.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Memory leak con `blob:` URLs | No se llama `revokeObjectURL` | Llamarlo en `onUnmounted` y al limpiar |
| El input file no dispara `change` al re-seleccionar el mismo archivo | El navegador omite el evento | Limpiar `input.value = ''` después de procesar |
| Drag & drop no funciona | Falta `e.preventDefault()` en `dragover` | Siempre prevenir el default en `dragover` |
| El archivo llega sin extensión al servidor | El servidor usa solo el nombre del campo | Incluir el `File` directamente en `FormData` |

---

## 7. Referencias

- [MDN - File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [MDN - URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN - FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Axios - Upload Progress](https://axios-http.com/docs/api_intro)
