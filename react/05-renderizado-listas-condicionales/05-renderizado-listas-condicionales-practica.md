# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 5: Renderizado de Listas y Condicionales

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Extraer la logica de renderizado de productos hacia un componente dedicado `ProductList`, que maneje internamente los estados de lista vacia y cargando. Agregar filtros de precio y categoria a la UI.

---

## Contexto de la Practica

El proyecto esta creciendo. `App.tsx` ya tiene logica de estado, filtros y renderizado. Es hora de encapsular la responsabilidad de mostrar productos en su propio componente.

**Estado del proyecto al inicio de esta practica:**
- `src/App.tsx` con buscador y lista de productos
- `src/components/ProductCard.tsx` con boton de favorito
- `src/types/product.types.ts`

---

## Archivos que se van a crear o modificar

```
src/
├── App.tsx                                (modificado — delegar a ProductList)
└── components/
    ├── ProductList.tsx                    (nuevo — desde files/)
    ├── EmptyState.tsx                     (nuevo — desde files/)
    └── LoadingSpinner.tsx                 (nuevo — desde files/)
```

---

## Paso 1: Crear `EmptyState`

**(copiar — desde `files/EmptyState.tsx`)**

Crear `src/components/EmptyState.tsx`:

```tsx
interface EmptyStateProps {
  titulo?: string
  descripcion?: string
  icono?: string
}

function EmptyState({
  titulo = 'No hay productos',
  descripcion = 'Prueba con otros terminos de busqueda',
  icono = '🔍',
}: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '5rem 2rem',
        color: '#888',
        gridColumn: '1 / -1',
      }}
    >
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{icono}</div>
      <h3 style={{ margin: '0 0 0.5rem', color: '#444' }}>{titulo}</h3>
      <p style={{ margin: 0 }}>{descripcion}</p>
    </div>
  )
}

export default EmptyState
```

**¿Que hace este codigo?**
- `gridColumn: '1 / -1'` hace que el EmptyState ocupe todas las columnas del grid cuando esta dentro del contenedor
- Todos los props son opcionales con valores por defecto — permite reutilizarlo en distintos contextos
- El componente no tiene logica — es puramente presentacional

---

## Paso 2: Crear `LoadingSpinner`

**(copiar — desde `files/LoadingSpinner.tsx`)**

Crear `src/components/LoadingSpinner.tsx`:

```tsx
interface LoadingSpinnerProps {
  mensaje?: string
}

function LoadingSpinner({ mensaje = 'Cargando productos...' }: LoadingSpinnerProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem',
        gap: '1rem',
        color: '#888',
        gridColumn: '1 / -1',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ margin: 0 }}>{mensaje}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner
```

**¿Que hace este codigo?**
- El spinner se crea con CSS border + animacion `spin` definida dentro del componente
- Usar `<style>` dentro del componente es valido para animaciones que no se pueden definir en objetos de estilo
- En modulos futuros se puede mover la animacion a un archivo CSS global

---

## Paso 3: Crear `ProductList`

**(copiar — desde `files/ProductList.tsx`)**

Crear `src/components/ProductList.tsx`:

```tsx
import type { Product } from '@/types/product.types'
import ProductCard from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'

interface ProductListProps {
  productos: Product[]
  cargando?: boolean
  busqueda?: string
}

function ProductList({ productos, cargando = false, busqueda = '' }: ProductListProps) {
  if (cargando) {
    return <LoadingSpinner />
  }

  if (productos.length === 0) {
    return (
      <EmptyState
        titulo="Sin resultados"
        descripcion={busqueda ? `No hay productos para "${busqueda}"` : 'No hay productos disponibles'}
        icono={busqueda ? '🔍' : '📦'}
      />
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {productos.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList
```

**¿Que hace este codigo?**
- Early return pattern: primero verifica `cargando`, luego lista vacia, luego el caso normal
- La `busqueda` se pasa para personalizar el mensaje de EmptyState segun el contexto
- El grid ahora esta en `ProductList` — App solo se encarga de los filtros y el estado

---

## Paso 4: Integrar `ProductList` en `App`

**(completar)**

Modificar `src/App.tsx` para usar el nuevo componente y agregar filtro por categoria:

```tsx
import { useState } from 'react'
import ProductList from '@/components/ProductList'
import type { Product } from '@/types/product.types'

const PRODUCTOS_MOCK: Product[] = [
  // ...mismo array del modulo anterior, agregar categorias variadas
  {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    stock: 94,
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg',
    images: [],
  },
  {
    id: 2,
    title: 'Samsung Universe 9',
    description: "Samsung's new variant which goes beyond Galaxy",
    price: 1249,
    discountPercentage: 15.46,
    rating: 4.09,
    stock: 36,
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/product-images/4/thumbnail.jpg',
    images: [],
  },
  {
    id: 3,
    title: 'MacBook Pro',
    description: 'MacBook Pro 2021 with mini-LED display',
    price: 1749,
    discountPercentage: 11.02,
    rating: 4.57,
    stock: 83,
    category: 'laptops',
    thumbnail: 'https://cdn.dummyjson.com/product-images/6/thumbnail.png',
    images: [],
  },
  {
    id: 4,
    title: 'Samsung 49 inches',
    description: 'Samsung 49 inches HD Smart LED TV',
    price: 399,
    discountPercentage: 21.57,
    rating: 4.22,
    stock: 36,
    category: 'home-decoration',
    thumbnail: 'https://cdn.dummyjson.com/product-images/21/thumbnail.jpg',
    images: [],
  },
]

// Estado derivado — extraer categorias unicas del mock
const CATEGORIAS = ['todas', ...new Set(PRODUCTOS_MOCK.map(p => p.category))]

function App() {
  const [busqueda, setBusqueda] = useState('')

  // TODO 4.1: Crear estado para la categoria seleccionada, valor inicial 'todas'
  // const [categoriaActiva, setCategoriaActiva] = useState(...)

  // TODO 4.2: Filtrar productos por busqueda Y por categoria
  // Si la categoria es 'todas', no filtrar por categoria
  // const productosFiltrados = PRODUCTOS_MOCK.filter(...)

  // Solucion:
  const [categoriaActiva, setCategoriaActiva] = useState('todas')

  const productosFiltrados = PRODUCTOS_MOCK
    .filter(p => p.title.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => categoriaActiva === 'todas' || p.category === categoriaActiva)

  return (
    <div className="app">
      <header style={{ background: '#1a1a1a', color: 'white', padding: '1rem 2rem' }}>
        <h1 style={{ margin: '0 0 0.75rem' }}>ReactStore</h1>
        <input
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontSize: '1rem', width: '100%', maxWidth: '400px' }}
        />
      </header>

      <div style={{ padding: '1rem 2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #e5e7eb' }}>
        {/* TODO 4.3: Renderizar un boton por cada categoria */}
        {/* El boton activo debe tener estilo diferente (background: #2563eb, color: white) */}
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              background: categoriaActiva === cat ? '#2563eb' : 'white',
              color: categoriaActiva === cat ? 'white' : '#333',
              textTransform: 'capitalize',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <main style={{ padding: '2rem' }}>
        <ProductList
          productos={productosFiltrados}
          busqueda={busqueda}
        />
      </main>
    </div>
  )
}

export default App
```

**¿Que hace este codigo?**
- `new Set(PRODUCTOS_MOCK.map(p => p.category))` extrae categorias unicas
- Spread `['todas', ...new Set(...)]` agrega la opcion "todas" al inicio del array
- La combinacion de `.filter().filter()` encadena los dos criterios de filtrado
- `ProductList` recibe los datos ya filtrados — no sabe nada del estado de App

> Captura pendiente: barra de categorias con botones "todas", "smartphones", "laptops", "home-decoration"; uno resaltado en azul; la grilla mostrando solo los productos de esa categoria.

---

## Paso 5: Simular estado de carga

**(completar)**

Para verificar que `LoadingSpinner` funciona, simular brevemente el estado de carga:

```tsx
// En App.tsx — agregar estado de carga
const [cargando, setCargando] = useState(false)

// Agregar un boton temporal para togglear carga
<button onClick={() => setCargando(prev => !prev)}>
  {cargando ? 'Detener carga' : 'Simular carga'}
</button>

// Pasar prop a ProductList
<ProductList
  productos={productosFiltrados}
  cargando={cargando}
  busqueda={busqueda}
/>
```

> Captura pendiente: spinner centrado con el texto "Cargando productos..." mientras el estado de carga es true.

---

## Validaciones Esperadas

- [ ] `EmptyState` aparece cuando el buscador no encuentra coincidencias
- [ ] `LoadingSpinner` aparece cuando `cargando` es `true`
- [ ] Los botones de categoria filtran la lista correctamente
- [ ] El boton de categoria activa tiene estilo diferente al resto
- [ ] Combinar busqueda de texto + filtro de categoria funciona simultaneamente
- [ ] Los TODOs del paso 4 fueron completados sin ver la solucion
- [ ] No aparece el warning de "key" en la consola

---

## Entregables

- `src/components/EmptyState.tsx`
- `src/components/LoadingSpinner.tsx`
- `src/components/ProductList.tsx` con early return pattern
- `src/App.tsx` con filtros de busqueda y categoria

---

## Commits Sugeridos

```bash
git commit -m "feat: crear componentes EmptyState y LoadingSpinner"
git commit -m "feat: crear ProductList con manejo de estados de carga y vacio"
git commit -m "feat: agregar filtro de categoria en App"
```
