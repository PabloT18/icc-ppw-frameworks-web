# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Actividad A5: Calendario de Eventos con date-fns

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## ¿Que vamos a construir?

Un **mini calendario interactivo** integrado en ReactStore que permite:

- Navegar por meses con botones anterior/siguiente
- Ver puntos de color en los días que tienen eventos
- Seleccionar un día para ver sus eventos
- Crear, editar y eliminar eventos mediante un modal
- Persistir los eventos en `localStorage`

---

## 1. La libreria date-fns

`date-fns` es la libreria mas popular de JavaScript para manipulacion de fechas. A diferencia de `moment.js`, es **modular** (solo se importan las funciones necesarias), **inmutable** (no muta objetos Date) y tiene soporte nativo para TypeScript.

### 1.1 Instalacion

```bash
pnpm add date-fns
```

### 1.2 Funciones clave

| Funcion | Descripcion | Ejemplo |
|---|---|---|
| `format(date, pattern)` | Formatea una fecha como string | `format(new Date(), 'MMMM yyyy')` → `"July 2025"` |
| `startOfMonth(date)` | Primer día del mes | Devuelve el día 1, hora 00:00:00 |
| `endOfMonth(date)` | Ultimo día del mes | Devuelve el ultimo día, hora 23:59:59 |
| `eachDayOfMonth(date)` | Array con todos los días del mes | `[Date, Date, Date, ...]` |
| `isSameDay(a, b)` | Compara si dos fechas son el mismo día | Ignora la hora |
| `isSameMonth(a, b)` | Compara si dos fechas son del mismo mes | — |
| `addMonths(date, n)` | Suma N meses a una fecha | `addMonths(new Date(), 1)` |
| `subMonths(date, n)` | Resta N meses a una fecha | `subMonths(new Date(), 1)` |
| `getDay(date)` | Numero del día de la semana (0=Dom, 6=Sab) | `getDay(new Date('2025-07-01'))` → `2` |
| `parseISO(string)` | Convierte un string ISO a Date | `parseISO('2025-07-04')` |

### 1.3 Localizacion

date-fns incluye locales para mostrar fechas en español:

```ts
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

format(new Date(), "MMMM yyyy", { locale: es }) // "julio 2025"
```

---

## 2. Construccion de la cuadricula del calendario

Un mes puede comenzar en cualquier día de la semana. Para que la cuadricula se alinee correctamente con los encabezados (Dom, Lun, ..., Sab), hay que calcular cuantas **celdas vacías** agregar al inicio.

```
Dom  Lun  Mar  Mie  Jue  Vie  Sab
                1    2    3    4    5
 6    7    8    9   10   11   12
...
```

### Algoritmo

```ts
import { startOfMonth, endOfMonth, eachDayOfMonth, getDay } from 'date-fns'

function buildCalendarGrid(month: Date): (Date | null)[] {
  const days = eachDayOfMonth(month)
  const startPad = getDay(startOfMonth(month)) // 0-6
  const endPad = 6 - getDay(endOfMonth(month)) // rellenar al final

  return [
    ...Array(startPad).fill(null),   // celdas vacias al inicio
    ...days,
    ...Array(endPad).fill(null),     // celdas vacias al final
  ]
}
```

La cuadricula resultante siempre tiene un numero de celdas multiplo de 7, lo que permite renderizarla en una grilla CSS de 7 columnas:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
```

---

## 3. Modelo de datos del evento

```ts
export interface CalendarEvent {
  id: string          // crypto.randomUUID()
  date: string        // ISO 8601: "2025-07-04"
  title: string
  description?: string
  color?: string      // hex: "#3b82f6"
}
```

Los eventos se guardan en `localStorage` serializados como JSON. La clave es `react-store-events`.

### Formato de fecha en los eventos

Se usa string ISO (`"2025-07-04"`) en lugar de `Date` para facilitar la serializacion y comparacion. Al comparar con fechas de la cuadricula se usa `isSameDay(parseISO(event.date), dayDate)`.

---

## 4. Hook `useCalendarEvents`

El hook centraliza el estado de eventos y expone operaciones CRUD. Utiliza `localStorage` directamente (sin libreria de persistencia como Zustand/persist) para reforzar el patron manual.

```
useCalendarEvents(selectedDate: Date)
  ├── state: events (CalendarEvent[])
  ├── eventsForDate(date) → CalendarEvent[]
  ├── addEvent(data) → void
  ├── updateEvent(id, data) → void
  └── deleteEvent(id) → void
```

El hook lee `localStorage` solo en la inicializacion (`useState(() => {...})`) para evitar lecturas repetidas en cada render.

---

## 5. Componente `MiniCalendar`

```
MiniCalendar
├── Header: "< Julio 2025 >"
├── Weekday labels: Dom Lun Mar Mie Jue Vie Sab
└── Grid de días
    ├── DayCell (null → celda vacía)
    └── DayCell (Date)
        ├── numero del día
        ├── puntos de color (uno por evento)
        └── highlight si es selectedDay
```

**Props:**
```ts
interface Props {
  selectedDate: Date
  events: CalendarEvent[]
  onSelectDate: (date: Date) => void
}
```

El componente no gestiona estado propio de navegacion de mes — ese estado lo maneja el padre (`CalendarPage`).

---

## 6. Componente `EventModal`

Modal para crear o editar un evento. Recibe el evento a editar (o `null` para crear uno nuevo).

```
EventModal
├── Header: "Nuevo evento — 4 de julio" | "Editar evento"
├── Campo: titulo (requerido)
├── Campo: descripcion (opcional)
├── Selector de color (5 opciones)
├── Boton guardar
└── Boton eliminar (solo si es edicion)
```

**Props:**
```ts
interface Props {
  date: Date
  event?: CalendarEvent        // si viene → modo edicion
  onSave: (data: Omit<CalendarEvent, 'id' | 'date'>) => void
  onDelete?: () => void
  onClose: () => void
}
```

---

## 7. Comparacion con otras soluciones de calendario

| Aspecto | Implementacion manual + date-fns | FullCalendar | react-big-calendar |
|---|---|---|---|
| Tamano bundle | ~15KB (date-fns tree-shaken) | ~200KB | ~80KB |
| Personalizacion | Total control | Limitada por API | Moderada |
| Curva de aprendizaje | Alta (hay que construir todo) | Baja | Media |
| Casos de uso | Calendarios simples embebidos | Apps de agenda completas | Eventos multi-hora |

---

## 8. Buenas practicas

- Siempre usar `parseISO` para convertir strings a `Date` antes de comparar — nunca confiar en `new Date(string)` directamente (comportamiento inconsistente entre navegadores con formatos no-ISO)
- Usar `crypto.randomUUID()` para generar IDs (disponible en todos los navegadores modernos)
- El `cleanup` del modal (al cerrar sin guardar) debe resetear el estado del formulario — se logra con un `useEffect` que depende de `event`
- Separar la logica de negocio (hook) de la presentacion (componentes) facilita el testing unitario del hook con `renderHook`
