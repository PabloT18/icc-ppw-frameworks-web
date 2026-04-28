# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Actividad A5: Calendario de Eventos — Practica

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Construir un mini calendario mensual integrado en ReactStore con navegacion por meses, indicadores de eventos en los días y un modal para crear, editar y eliminar eventos persistidos en `localStorage`.

---

## Paso 1: Instalar date-fns

**(copiar)**

```bash
pnpm add date-fns
```

Verificar en `package.json` que aparece `date-fns` en `dependencies`.

---

## Paso 2: Crear el hook `useCalendarEvents`

**(copiar)**

Crear `src/hooks/useCalendarEvents.ts`:

```ts
import { useState, useCallback } from 'react'
import { isSameDay, parseISO } from 'date-fns'

export interface CalendarEvent {
  id: string
  date: string        // ISO 8601: "2025-07-04"
  title: string
  description?: string
  color?: string
}

const STORAGE_KEY = 'react-store-events'

function loadEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CalendarEvent[]) : []
  } catch {
    return []
  }
}

function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents())

  const eventsForDate = useCallback(
    (date: Date): CalendarEvent[] =>
      events.filter((e) => isSameDay(parseISO(e.date), date)),
    [events]
  )

  const addEvent = useCallback(
    (date: Date, data: Omit<CalendarEvent, 'id' | 'date'>) => {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        date: date.toISOString().split('T')[0],
        ...data,
      }
      setEvents((prev) => {
        const next = [...prev, newEvent]
        saveEvents(next)
        return next
      })
    },
    []
  )

  const updateEvent = useCallback(
    (id: string, data: Partial<Omit<CalendarEvent, 'id' | 'date'>>) => {
      setEvents((prev) => {
        const next = prev.map((e) => (e.id === id ? { ...e, ...data } : e))
        saveEvents(next)
        return next
      })
    },
    []
  )

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== id)
      saveEvents(next)
      return next
    })
  }, [])

  return { events, eventsForDate, addEvent, updateEvent, deleteEvent }
}
```

**¿Que hace este codigo?**
- `useState(() => loadEvents())` — la funcion de inicializacion lazy solo se ejecuta una vez; evita leer `localStorage` en cada render
- `isSameDay(parseISO(e.date), date)` — compara dos fechas ignorando la hora; `parseISO` convierte el string `"2025-07-04"` a un objeto `Date`
- `crypto.randomUUID()` — genera un UUID v4 unico sin dependencias adicionales
- `date.toISOString().split('T')[0]` — extrae solo la parte de fecha del string ISO, ej: `"2025-07-04"`
- Cada mutacion llama a `saveEvents` dentro del `setEvents` callback para garantizar que lo que se persiste es el estado actualizado

---

## Paso 3: Crear los estilos del calendario

**(copiar)**

Crear `src/components/MiniCalendar.module.css`:

```css
.wrapper {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 360px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.monthLabel {
  font-weight: 600;
  font-size: 1rem;
  text-transform: capitalize;
}

.navButton {
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navButton:hover {
  background: #f3f4f6;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  position: relative;
  transition: background 0.15s;
}

.cell:hover {
  background: #f3f4f6;
}

.cellEmpty {
  cursor: default;
}

.cellEmpty:hover {
  background: none;
}

.cellToday {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.cellSelected {
  background: #3b82f6 !important;
  color: white !important;
}

.dots {
  display: flex;
  gap: 2px;
  position: absolute;
  bottom: 4px;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
```

---

## Paso 4: Crear el componente `MiniCalendar`

**(copiar)**

Crear `src/components/MiniCalendar.tsx`:

```tsx
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfMonth,
  isSameDay,
  isSameMonth,
  isToday,
  getDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { CalendarEvent } from '@/hooks/useCalendarEvents'
import styles from './MiniCalendar.module.css'

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

interface Props {
  currentMonth: Date
  selectedDate: Date
  events: CalendarEvent[]
  onSelectDate: (date: Date) => void
  onMonthChange: (date: Date) => void
}

function buildGrid(month: Date): (Date | null)[] {
  const days = eachDayOfMonth(month)
  const startPad = getDay(startOfMonth(month))
  const endPad = 6 - getDay(endOfMonth(month))
  return [
    ...Array<null>(startPad).fill(null),
    ...days,
    ...Array<null>(endPad).fill(null),
  ]
}

export default function MiniCalendar({
  currentMonth,
  selectedDate,
  events,
  onSelectDate,
  onMonthChange,
}: Props) {
  const grid = buildGrid(currentMonth)
  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: es })

  return (
    <div className={styles.wrapper}>
      {/* Encabezado de navegacion */}
      <div className={styles.header}>
        <button
          className={styles.navButton}
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <span className={styles.monthLabel}>{monthLabel}</span>
        <button
          className={styles.navButton}
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      {/* Encabezados de día de semana */}
      <div className={styles.weekdays}>
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Cuadricula de días */}
      <div className={styles.grid}>
        {grid.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className={`${styles.cell} ${styles.cellEmpty}`} />
          }

          const dayEvents = events.filter((e) => {
            try {
              const d = new Date(e.date + 'T00:00:00')
              return isSameDay(d, day)
            } catch {
              return false
            }
          })

          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          const cellClass = [
            styles.cell,
            isSelected ? styles.cellSelected : '',
            !isSelected && isToday(day) ? styles.cellToday : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={day.toISOString()}
              className={cellClass}
              onClick={() => onSelectDate(day)}
              style={{ opacity: isCurrentMonth ? 1 : 0.3 }}
            >
              {format(day, 'd')}
              {dayEvents.length > 0 && (
                <div className={styles.dots}>
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={styles.dot}
                      style={{ background: e.color ?? '#3b82f6' }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

**¿Que hace este codigo?**
- `buildGrid` construye un array de 28-42 elementos (multiplo de 7): `null` para celdas vacías al inicio/fin, y `Date` para cada día del mes
- `isSameDay(d, day)` compara solo la parte de fecha, ignorando la hora
- Se muestran hasta 3 puntos de color por día — si hay mas de 3 eventos se truncan para no desbordarse
- `opacity: 0.3` para días fuera del mes actual — esto puede suceder si se muestran semanas incompletas al inicio/fin

---

## Paso 5: Crear el componente `EventModal`

**(copiar)**

Crear `src/components/EventModal.tsx`:

```tsx
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

  // Rellenar el formulario cuando se edita un evento existente
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
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
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
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical', boxSizing: 'border-box' }}
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
```

**¿Que hace este codigo?**
- El `useEffect` que depende de `event` resetea el formulario correctamente tanto al abrir para edicion como al limpiar despues de cerrar
- `e.stopPropagation()` en el contenedor interior evita que el clic dentro del modal propague al overlay y cierre el modal inadvertidamente
- `required` en el input de titulo previene el envio del formulario si esta vacío (validacion nativa del navegador)
- El boton de eliminar solo aparece si se pasan ambas props `event` y `onDelete`

---

## Paso 6: Crear `EventsList`

**(copiar)**

Crear `src/components/EventsList.tsx`:

```tsx
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { CalendarEvent } from '@/hooks/useCalendarEvents'

interface Props {
  date: Date
  events: CalendarEvent[]
  onEdit: (event: CalendarEvent) => void
  onAdd: () => void
}

export default function EventsList({ date, events, onEdit, onAdd }: Props) {
  const dateLabel = format(date, "EEEE d 'de' MMMM", { locale: es })

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{dateLabel}</h3>
        <button
          onClick={onAdd}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem 0.9rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          + Nuevo evento
        </button>
      </div>

      {events.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          No hay eventos para este día. Haz clic en "+ Nuevo evento" para agregar uno.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {events.map((event) => (
            <li
              key={event.id}
              onClick={() => onEdit(event)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
            >
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: event.color ?? '#3b82f6',
                  flexShrink: 0,
                  marginTop: '3px',
                }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{event.title}</p>
                {event.description && (
                  <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.8rem' }}>
                    {event.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## Paso 7: Crear la pagina `CalendarPage`

**(completar)**

Crear `src/pages/CalendarPage.tsx`:

```tsx
import { useState } from 'react'
import MiniCalendar from '@/components/MiniCalendar'
import EventsList from '@/components/EventsList'
import EventModal from '@/components/EventModal'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import type { CalendarEvent } from '@/hooks/useCalendarEvents'

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined)

  const { events, eventsForDate, addEvent, updateEvent, deleteEvent } = useCalendarEvents()

  const dayEvents = eventsForDate(selectedDate)

  const handleAddEvent = () => {
    setEditingEvent(undefined)
    setModalOpen(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setModalOpen(true)
  }

  const handleSave = (data: Omit<CalendarEvent, 'id' | 'date'>) => {
    // TODO A5.1: Si hay editingEvent → llamar updateEvent, si no → llamar addEvent
    // if (editingEvent) {
    //   updateEvent(editingEvent.id, data)
    // } else {
    //   addEvent(selectedDate, data)
    // }
    setModalOpen(false)
    setEditingEvent(undefined)
  }

  const handleDelete = () => {
    // TODO A5.2: Llamar deleteEvent con editingEvent.id y cerrar el modal
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Calendario</h1>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <MiniCalendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          events={events}
          onSelectDate={setSelectedDate}
          onMonthChange={setCurrentMonth}
        />
        <div style={{ flex: 1, minWidth: '240px' }}>
          <EventsList
            date={selectedDate}
            events={dayEvents}
            onEdit={handleEditEvent}
            onAdd={handleAddEvent}
          />
        </div>
      </div>

      {modalOpen && (
        <EventModal
          date={selectedDate}
          event={editingEvent}
          onSave={handleSave}
          onDelete={editingEvent ? handleDelete : undefined}
          onClose={() => {
            setModalOpen(false)
            setEditingEvent(undefined)
          }}
        />
      )}
    </div>
  )
}
```

**¿Que hace este codigo?**
- `editingEvent: undefined` representa "modo crear" y `editingEvent: CalendarEvent` representa "modo editar"
- `eventsForDate(selectedDate)` recalcula los eventos del día seleccionado cada vez que cambia `selectedDate` o el array `events`
- Pasar `onDelete={editingEvent ? handleDelete : undefined}` al modal hace que el boton de eliminar solo aparezca en modo edicion

---

## Paso 8: Agregar la ruta en `App.tsx`

**(completar)**

En el archivo de rutas agregar:

```tsx
// TODO A5.3: Importar CalendarPage y agregar la ruta /calendar
// import CalendarPage from '@/pages/CalendarPage'
// { path: 'calendar', element: <CalendarPage /> }
```

---

## Verificacion

> Captura pendiente: calendario del mes actual con puntos de colores en los días que tienen eventos y un día seleccionado resaltado en azul.

> Captura pendiente: modal abierto con el formulario de nuevo evento mostrando los 5 selectores de color.

> Captura pendiente: lista de eventos del día seleccionado con los círculos de color a la izquierda de cada título.

**Checklist:**
- [ ] El calendario muestra el mes actual con todos los días correctamente alineados
- [ ] Los botones `‹` y `›` navegan entre meses
- [ ] Al hacer clic en un día, la lista de eventos se actualiza
- [ ] Se puede crear un nuevo evento con título, descripción y color
- [ ] El evento creado aparece como un punto de color en el día correspondiente
- [ ] Se puede hacer clic en un evento de la lista para editarlo
- [ ] Se puede eliminar un evento desde el modal de edicion
- [ ] Los eventos persisten al recargar la pagina (localStorage)

---

## Commits Sugeridos

```bash
pnpm add date-fns
git commit -m "chore: instalar date-fns"
git commit -m "feat: crear hook useCalendarEvents con persistencia en localStorage"
git commit -m "feat: crear MiniCalendar con navegacion mensual y puntos de eventos"
git commit -m "feat: crear EventModal con formulario y selector de color"
git commit -m "feat: crear EventsList y CalendarPage"
git commit -m "feat: agregar ruta /calendar en App.tsx"
```
