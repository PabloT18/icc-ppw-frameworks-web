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

            <div className={styles.weekdays}>
                {WEEKDAYS.map((d) => (
                    <span key={d}>{d}</span>
                ))}
            </div>

            <div className={styles.grid}>
                {grid.map((day, idx) => {
                    if (!day) {
                        return <div key={`empty-${idx}`} className={`${styles.cell} ${styles.cellEmpty}`} />
                    }

                    const dayEvents = events.filter((e) => {
                        try {
                            return isSameDay(new Date(e.date + 'T00:00:00'), day)
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
