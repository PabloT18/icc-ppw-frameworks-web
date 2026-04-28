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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

            <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                multiple
                className={styles.hiddenInput}
                onChange={handleInputChange}
            />

            {error && <p className={styles.errorMessage}>{error}</p>}

            {previews.length > 0 && (
                <>
                    <div className={styles.previewGrid}>
                        {previews.map((p, i) => (
                            <div key={p.url} className={styles.previewItem}>
                                <img src={p.url} alt={p.file.name} className={styles.previewImage} />
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

                    {uploading && (
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                        </div>
                    )}

                    <button onClick={simulateUpload} disabled={uploading} style={{ marginTop: '1rem' }}>
                        {uploading ? `Cargando... ${progress}%` : `Cargar ${previews.length} imagen(es)`}
                    </button>
                </>
            )}
        </div>
    )
}
