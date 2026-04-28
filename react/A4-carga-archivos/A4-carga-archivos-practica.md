# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica A4: Carga de Archivos — Componente ImageUploader

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Construir el componente `ImageUploader` con zona de drag & drop, seleccion por clic, validacion de tipo y tamano, grid de previews con boton de eliminar por imagen, y barra de progreso simulada. Integrar el componente en el panel de administracion del modulo A3.

---

## Paso 1: Crear los estilos del componente

**(copiar)**

Crear `src/components/ImageUploader.module.css`:

```css
.dropzone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  background-color: #fafafa;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dropzone:hover {
  border-color: #999;
}

.dropzoneActive {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.dropzoneError {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.hiddenInput {
  display: none;
}

.previewGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.previewItem {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
}

.previewImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.removeButton {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.removeButton:hover {
  background: rgba(220, 38, 38, 0.8);
}

.progressBar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin-top: 1rem;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.15s ease;
}

.errorMessage {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.fileInfo {
  font-size: 0.75rem;
  color: #6b7280;
}
```

**¿Que hace este archivo?**
- `.dropzone` es la zona principal — borde punteado que se activa visualmente al arrastrar
- `.dropzoneActive` se aplica mientras el usuario arrastra un archivo sobre la zona
- `.previewItem` con `aspect-ratio: 1` garantiza que las celdas del grid sean cuadradas
- `.removeButton` flota sobre la imagen en la esquina superior derecha

---

## Paso 2: Crear el componente `ImageUploader`

**(copiar)**

Crear `src/components/ImageUploader.tsx`:

```tsx
import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './ImageUploader.module.css'

interface FilePreview {
  file: File
  url: string
}

interface Props {
  maxFiles?: number
  maxSizeMB?: number
  onFilesChange?: (files: File[]) => void
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function ImageUploader({
  maxFiles = 5,
  maxSizeMB = 5,
  onFilesChange,
}: Props) {
  const [previews, setPreviews] = useState<FilePreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Limpiar URLs al desmontar
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `"${file.name}": tipo no permitido. Solo JPEG, PNG, WebP, GIF.`
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `"${file.name}": excede el tamano maximo de ${maxSizeMB}MB.`
    }
    return null
  }

  const processFiles = useCallback(
    (incoming: File[]) => {
      setError(null)

      const slots = maxFiles - previews.length
      if (slots <= 0) {
        setError(`Maximo ${maxFiles} imagen(es) permitida(s).`)
        return
      }

      const toAdd = incoming.slice(0, slots)
      const errors: string[] = []
      const valid: FilePreview[] = []

      for (const file of toAdd) {
        const err = validateFile(file)
        if (err) {
          errors.push(err)
        } else {
          valid.push({ file, url: URL.createObjectURL(file) })
        }
      }

      if (errors.length > 0) setError(errors[0])

      if (valid.length > 0) {
        setPreviews((prev) => {
          const next = [...prev, ...valid]
          onFilesChange?.(next.map((p) => p.file))
          return next
        })
      }
    },
    [previews.length, maxFiles, maxSizeMB, onFilesChange]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(Array.from(e.dataTransfer.files))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(e.target.files ?? []))
    // Resetear el input para que el mismo archivo pueda volver a seleccionarse
    e.target.value = ''
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url)
      const next = prev.filter((_, i) => i !== index)
      onFilesChange?.(next.map((p) => p.file))
      return next
    })
  }

  const simulateUpload = async () => {
    if (previews.length === 0) return
    setUploading(true)
    setProgress(0)
    for (let p = 0; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 150))
      setProgress(p)
    }
    setUploading(false)
    alert(`${previews.length} imagen(es) cargada(s) (simulado)`)
  }

  const dropzoneClass = [
    styles.dropzone,
    isDragging ? styles.dropzoneActive : '',
    error ? styles.dropzoneError : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      {/* Zona de arrastre */}
      <div
        className={dropzoneClass}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <span style={{ fontSize: '2rem' }}>📁</span>
        <p>Arrastra imagenes aqui o haz clic para seleccionar</p>
        <p className={styles.fileInfo}>
          JPEG, PNG, WebP, GIF · Max {maxSizeMB}MB por archivo · Max {maxFiles} archivos
        </p>
      </div>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        multiple
        className={styles.hiddenInput}
        onChange={handleInputChange}
      />

      {/* Mensaje de error */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Grid de previews */}
      {previews.length > 0 && (
        <>
          <div className={styles.previewGrid}>
            {previews.map((p, i) => (
              <div key={p.url} className={styles.previewItem}>
                <img
                  src={p.url}
                  alt={p.file.name}
                  className={styles.previewImage}
                />
                <button
                  className={styles.removeButton}
                  onClick={() => removePreview(i)}
                  aria-label={`Eliminar ${p.file.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Barra de progreso */}
          {uploading && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Boton de carga */}
          <button
            onClick={simulateUpload}
            disabled={uploading}
            style={{ marginTop: '1rem' }}
          >
            {uploading ? `Cargando... ${progress}%` : `Cargar ${previews.length} imagen(es)`}
          </button>
        </>
      )}
    </div>
  )
}
```

**¿Que hace este codigo?**
- `useCallback` en `processFiles` estabiliza la referencia de la funcion para evitar re-renders innecesarios del efecto de limpieza
- `e.target.value = ''` resetea el input despues de seleccionar — sin esto, seleccionar el mismo archivo dos veces seguidas no dispara `onChange`
- `URL.revokeObjectURL` se llama al eliminar cada preview individual para liberar la memoria del objeto URL
- El `useEffect` de limpieza libera todas las URLs pendientes si el componente se desmonta antes de que el usuario las elimine manualmente

---

## Paso 3: Crear una pagina de prueba

**(completar)**

Crear `src/pages/ImageUploaderPage.tsx`:

```tsx
import ImageUploader from '@/components/ImageUploader'

export default function ImageUploaderPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Carga de Imagenes</h1>

      <ImageUploader
        maxFiles={6}
        maxSizeMB={3}
        onFilesChange={(files) => {
          // TODO A4.1: Mostrar en consola el nombre y tamano de los archivos seleccionados
          // files.forEach(f => console.log(f.name, (f.size / 1024).toFixed(1) + 'KB'))
        }}
      />
    </div>
  )
}
```

Agregar la ruta en `App.tsx`:

```tsx
// TODO A4.2: Agregar la ruta /upload
// { path: 'upload', element: <ImageUploaderPage /> }
```

---

## Paso 4: Integrar en el modal de producto

**(completar)**

En `EditProductModal.tsx` del modulo A3, agregar la carga de imagen del producto:

```tsx
import ImageUploader from '@/components/ImageUploader'

// Dentro del formulario, despues del campo de descripcion:
// TODO A4.3: Agregar ImageUploader para la imagen del producto
// <label>Imagen del producto</label>
// <ImageUploader
//   maxFiles={1}
//   maxSizeMB={2}
//   onFilesChange={(files) => {
//     if (files[0]) setThumbnailFile(files[0])
//   }}
// />
```

---

## Verificacion

> Captura pendiente: zona de drag & drop con el borde azul activado mientras se arrastra un archivo. Captura del grid de previews con 3 imagenes cargadas y el boton de eliminar visible en cada una.

**Checklist:**
- [ ] El borde cambia a azul al arrastrar archivos sobre la zona
- [ ] Se muestra error si se intenta agregar un tipo de archivo no permitido (ej: .pdf)
- [ ] Se muestra error si el archivo supera el tamano maximo
- [ ] Se puede eliminar cada imagen individualmente
- [ ] No se pueden agregar mas imagenes del maximo configurado
- [ ] La barra de progreso animada aparece al hacer clic en "Cargar"
- [ ] `URL.revokeObjectURL` se llama al eliminar imagenes (verificar en profiler de memoria)

---

## Commits Sugeridos

```bash
git commit -m "feat: crear ImageUploader.module.css con estilos de dropzone"
git commit -m "feat: crear ImageUploader con drag&drop, previews y validacion"
git commit -m "feat: agregar ImageUploaderPage y ruta /upload"
git commit -m "feat: integrar ImageUploader en EditProductModal"
```
