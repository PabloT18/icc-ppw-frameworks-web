import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { CalendarEvent } from '@/hooks/useCalendarEvents'

const COLOR_OPTIONS = [
    { label: 'Azul', value: '#3b82f6' },
    { label: 'Verde', value: '#22c55e' },
    { label: 'Rojo', value: '#ef4444' },
    { label: 'Naranja', value: '#f97316' },
    { label: 'Morado', value: '#a855f7' },
]

interface Props {
    date: Date
    event?: CalendarEvent
    onSave: (data: Omit<CalendarEvent, 'id' | 'date'>) => void
    onDelete?: () => void
    onClose: () => void
}

export default function EventModal({ date, event, onSave, onDelete, onClose }: Props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState(COLOR_OPTIONS[0].value)

    useEffect(() => {
        if (event) {
            setTitle(event.title)
            setDescription(event.description ?? '')
            setColor(event.color ?? COLOR_OPTIONS[0].value)
        } else {
            setTitle('')
            setDescription('')
            setColor(COLOR_OPTIONS[0].value)
        }
    }, [event])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        onSave({ title: title.trim(), description: description.trim() || undefined, color })
    }

    const dateLabel = format(date, "d 'de' MMMM yyyy", { locale: es })

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>
                    {event ? 'Editar evento' : 'Nuevo evento'}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
                    {dateLabel}
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
                            Titulo *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Reunion de equipo..."
                            required
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
                            Descripcion
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detalles opcionales..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Color
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {COLOR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    title={opt.label}
                                    onClick={() => setColor(opt.value)}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: opt.value,
                                        border: color === opt.value ? '3px solid #111' : '2px solid transparent',
                                        cursor: 'pointer',
                                        outline: 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        {event && onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                style={{
                                    marginRight: 'auto',
                                    background: '#fef2f2',
                                    color: '#ef4444',
                                    border: '1px solid #fecaca',
                                    borderRadius: '6px',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Eliminar
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                            }}
                        >
                            {event ? 'Guardar cambios' : 'Crear evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
