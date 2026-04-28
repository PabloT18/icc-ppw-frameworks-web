# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 5: Renderizado de Listas y Condicionales

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Dominar las tecnicas de renderizado dinamico en React: iterar colecciones con `.map()`, mostrar contenido segun condiciones con operadores ternarios y `&&`, y manejar estados vacios y de carga que mejoran la experiencia del usuario.

---

## 2. Explicacion Conceptual

### Renderizado de listas con `.map()`

En React, el JSX es simplemente una sintaxis sobre llamadas a funciones de JavaScript. Esto significa que cualquier expresion JavaScript valida puede usarse dentro de `{}`, incluyendo `.map()` para renderizar listas de componentes:

```tsx
const frutas = ['Manzana', 'Banana', 'Naranja']

// Renderiza un <li> por cada elemento del array
function ListaFrutas() {
  return (
    <ul>
      {frutas.map(fruta => (
        <li>{fruta}</li>
      ))}
    </ul>
  )
}
```

El tipo de retorno de `.map()` dentro de JSX puede ser un elemento simple, un componente, o un Fragment.

### La prop `key`

Cuando React renderiza una lista, necesita una forma de identificar cada elemento para poder actualizarla eficientemente. La prop `key` cumple esa funcion:

```tsx
// ❌ Sin key — React no puede rastrear los elementos
{productos.map(p => <ProductCard product={p} />)}

// ✅ Con key — React sabe exactamente que actualizar
{productos.map(p => <ProductCard key={p.id} product={p} />)}
```

**Reglas para `key`:**
- Debe ser unica entre los elementos hermanos (no global)
- Debe ser estable — no usar el indice del array si la lista puede reordenarse
- No se pasa como prop al componente — es solo para React internamente
- Usar el ID del dato como key cuando exista (siempre preferido)

```tsx
// ❌ Index como key — problemas al reordenar o filtrar
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ ID como key — estable y predecible
{items.map(item => <Item key={item.id} {...item} />)}
```

### Renderizado condicional

#### Operador ternario `? :`

Para mostrar uno de dos elementos segun una condicion:

```tsx
{estaLogueado
  ? <Dashboard />
  : <PantallaLogin />
}

// Inline para variaciones menores
<button className={`btn ${activo ? 'btn-primary' : 'btn-secondary'}`}>
  Accion
</button>
```

#### Operador `&&`

Para mostrar algo solo cuando una condicion es verdadera, o nada cuando es falsa:

```tsx
{mensaje && <p className="alert">{mensaje}</p>}

{lista.length > 0 && (
  <ul>
    {lista.map(item => <li key={item.id}>{item.nombre}</li>)}
  </ul>
)}
```

**Trampa con `&&` y numeros:**
```tsx
// ❌ Si lista.length es 0, renderiza el numero 0 en pantalla
{lista.length && <Lista items={lista} />}

// ✅ Convertir a booleano explicitamente
{lista.length > 0 && <Lista items={lista} />}
{!!lista.length && <Lista items={lista} />}
```

#### `if` antes del return

Para condicionales complejos, es mas limpio usar un `if` antes del JSX:

```tsx
function ProductoDetalle({ id }: { id: number | null }) {
  if (!id) {
    return <p>Selecciona un producto</p>
  }

  // El resto del componente asume que id existe
  return <div>Producto {id}</div>
}
```

### Early return pattern

Patron comun para manejar estados de carga y error de forma legible:

```tsx
function ProductList({ cargando, error, productos }: Props) {
  if (cargando) return <LoadingSpinner />
  if (error) return <ErrorMessage mensaje={error} />
  if (productos.length === 0) return <EmptyState />

  return (
    <div className="product-grid">
      {productos.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

---

## 3. Fundamento Tecnico

### Fragmentos en listas

Cuando se necesita retornar multiples elementos sin un wrapper extra, y ademas se necesita `key`, se usa `<Fragment>` en lugar de `<>`:

```tsx
import { Fragment } from 'react'

{datos.map(item => (
  <Fragment key={item.id}>
    <dt>{item.nombre}</dt>
    <dd>{item.valor}</dd>
  </Fragment>
))}
```

La sintaxis corta `<>` no acepta la prop `key`, por eso se usa `<Fragment key={...}>` explicitamente.

### Filtrar y ordenar antes de renderizar

```tsx
function ProductList({ productos, busqueda, soloDisponibles }: Props) {
  const productosVisibles = productos
    .filter(p => p.title.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => soloDisponibles ? p.stock > 0 : true)
    .sort((a, b) => a.price - b.price)

  if (productosVisibles.length === 0) return <EmptyState busqueda={busqueda} />

  return (
    <div className="grid">
      {productosVisibles.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

### Estado de carga (Loading State)

Un patron de tres estados para componentes que cargan datos:

```tsx
type LoadingState = 'idle' | 'loading' | 'success' | 'error'

function DataComponent() {
  const [estado, setEstado] = useState<LoadingState>('idle')
  const [datos, setDatos] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  // ...fetch en useEffect (modulo 6)

  if (estado === 'loading') return <LoadingSpinner />
  if (estado === 'error') return <ErrorMessage mensaje={error!} />

  return <Lista datos={datos} />
}
```

---

## 4. Ejemplos de Codigo

### Componente `EmptyState`

```tsx
interface EmptyStateProps {
  titulo?: string
  descripcion?: string
  icono?: string
}

function EmptyState({
  titulo = 'No hay elementos',
  descripcion = 'Prueba con otros filtros',
  icono = '🔍'
}: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#888' }}>
      <div style={{ fontSize: '3rem' }}>{icono}</div>
      <h3 style={{ margin: '1rem 0 0.5rem' }}>{titulo}</h3>
      <p style={{ margin: 0 }}>{descripcion}</p>
    </div>
  )
}
```

### Componente `LoadingSpinner`

```tsx
function LoadingSpinner({ mensaje = 'Cargando...' }: { mensaje?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', gap: '1rem', color: '#888' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ margin: 0 }}>{mensaje}</p>
    </div>
  )
}
```

---

## 5. Buenas Practicas

- **Usar siempre `key` en listas**: preferir IDs de datos sobre indices.
- **Extraer componentes de lista**: en lugar de poner la logica del item directamente en el `.map()`.
- **Implementar estados vacios y de carga**: la experiencia del usuario depende de manejar estos estados.
- **Filtrar antes de renderizar**: derivar la lista visible sin alterar el estado original.
- **Early return para condicionales complejos**: evita el anidamiento excesivo de ternarios.

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| Warning: "Each child in a list should have a unique key prop" | Falta la prop `key` en el .map() | Agregar `key={item.id}` al elemento raiz de cada iteracion |
| Se renderiza `0` en lugar de nada | Usar `array.length &&` con array vacio | Cambiar a `array.length > 0 &&` |
| La lista no se actualiza al filtrar | Filtrar el array de estado original | Crear una nueva variable filtrada sin mutar el estado |
| `key` debe ser unica | Usar datos duplicados o index en listas que cambian | Usar IDs de base de datos o generar UUIDs estables |

---

## 7. Relacion con el Proyecto Incremental

En este modulo se crea el componente `ProductList` que encapsula la logica de renderizado de la cuadricula. Se incluyen los estados de carga y vacio que se necesitaran en el modulo 6 cuando se conecte a la API real.

La arquitectura queda: `App` → `ProductList` → `ProductCard` → `Badge`.

> Ver solucion de referencia en: `react/solver/react-store/src/components/ProductList.tsx`

---

## 8. Referencias

- [Renderizar listas — React Docs](https://react.dev/learn/rendering-lists)
- [Renderizado condicional — React Docs](https://react.dev/learn/conditional-rendering)
- [Pensar en React — React Docs](https://react.dev/learn/thinking-in-react)
