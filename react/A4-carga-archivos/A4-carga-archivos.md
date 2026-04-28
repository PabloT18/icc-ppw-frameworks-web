# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Actividad 4: Carga de Archivos — File API y Drag & Drop

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo de la Actividad

Implementar un componente de carga de imagenes con soporte para seleccion por clic y arrastrar-y-soltar. Generar vistas previas (previews) sin subir al servidor. Validar tipo de archivo y tamano. Comprender la File API del navegador.

---

## 2. `input[type="file"]`

El elemento `input[type="file"]` es el punto de entrada mas simple para archivos:

```tsx
<input
  type="file"
  accept="image/*"    // solo imagenes
  multiple            // permite seleccionar varios
  onChange={handleFileChange}
/>

function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(e.target.files ?? [])
  // files es un array de objetos File
  // File tiene: name, size (bytes), type (MIME), lastModified
}
```

---

## 3. `URL.createObjectURL` — Preview Instantaneo

```ts
// Crea una URL temporal que apunta al archivo en memoria
const url = URL.createObjectURL(file)
// Retorna algo como: blob:http://localhost:5173/abc-123

// Usar la URL en una imagen
<img src={url} alt={file.name} />

// IMPORTANTE: liberar la URL cuando ya no se necesita
URL.revokeObjectURL(url)
```

`URL.createObjectURL` es la forma mas eficiente de mostrar previews — no lee el archivo completo en memoria, solo crea una referencia.

---

## 4. `FileReader` — Leer el Contenido del Archivo

```ts
const reader = new FileReader()

// readAsDataURL retorna base64 — util para guardar en localStorage o enviar como JSON
reader.readAsDataURL(file)

reader.onload = (e) => {
  const base64 = e.target?.result as string
  // "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}

reader.onerror = () => console.error('Error leyendo archivo')
```

`FileReader` es necesario cuando se necesita el contenido del archivo (base64, texto). Para solo mostrar una preview, `URL.createObjectURL` es mas eficiente.

---

## 5. Drag & Drop

```tsx
const [isDragging, setIsDragging] = useState(false)

function handleDragOver(e: React.DragEvent) {
  e.preventDefault()            // necesario para habilitar el drop
  setIsDragging(true)
}

function handleDragLeave() {
  setIsDragging(false)
}

function handleDrop(e: React.DragEvent) {
  e.preventDefault()
  setIsDragging(false)
  const files = Array.from(e.dataTransfer.files)
  processFiles(files)
}

<div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  style={{ border: isDragging ? '2px solid blue' : '2px dashed #ccc' }}
>
  Arrastra imagenes aqui
</div>
```

---

## 6. Validacion de Archivos

```ts
const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Tipo no permitido: ${file.type}. Solo JPEG, PNG, WebP y GIF.`
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximo ${MAX_SIZE_MB}MB.`
  }
  return null  // null = valido
}
```

---

## 7. Limpieza de URLs de Objeto

Las URLs creadas con `URL.createObjectURL` ocupan memoria hasta que se liberan o hasta que la pagina se cierra. En React se liberan en el cleanup de `useEffect`:

```ts
interface FilePreview {
  file: File
  url: string
}

const [previews, setPreviews] = useState<FilePreview[]>([])

// Limpiar URLs al desmontar el componente
useEffect(() => {
  return () => {
    previews.forEach(p => URL.revokeObjectURL(p.url))
  }
}, [previews])

// Al eliminar una preview individual
function removePreview(index: number) {
  const preview = previews[index]
  URL.revokeObjectURL(preview.url)
  setPreviews(prev => prev.filter((_, i) => i !== index))
}
```

---

## 8. Simular Progreso de Carga

```ts
const [progress, setProgress] = useState(0)
const [uploading, setUploading] = useState(false)

async function simulateUpload() {
  setUploading(true)
  setProgress(0)

  // Simular carga por pasos
  for (let p = 0; p <= 100; p += 10) {
    await new Promise(resolve => setTimeout(resolve, 150))
    setProgress(p)
  }

  setUploading(false)
  // En un caso real:
  // const formData = new FormData()
  // files.forEach(f => formData.append('images', f))
  // await fetch('/api/upload', { method: 'POST', body: formData })
}
```

---

## 9. Referencias

- [MDN — File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [MDN — URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN — FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [MDN — HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [MDN — FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
