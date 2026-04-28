import { isSameDay, parseISO } from 'date-fns'
import { useCallback, useState } from 'react'

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
