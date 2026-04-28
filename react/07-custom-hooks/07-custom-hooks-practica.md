# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 7: Custom Hooks

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Extraer la logica de fetch de `App.tsx` hacia hooks dedicados `useProducts` y `useCategories`. Crear adicionalmente un hook `useLocalStorage` para persistir los favoritos del usuario entre recargas. Al finalizar, `App.tsx` sera drasticamente mas simple.

---

## Contexto de la Practica

`App.tsx` actualmente tiene: dos `useEffect`, cuatro `useState`, logica de filtrado y el JSX. Eso es demasiado para un solo componente. Los custom hooks resuelven esto.

**Estado del proyecto al inicio de esta practica:**
- `src/App.tsx` con useEffect y lógica de fetch directa
- `src/services/product.service.ts`
- Favoritos son estado local en `ProductCard` (se pierden al recargar)

---

## Archivos que se van a crear o modificar

```
src/
├── App.tsx                              (simplificado — usa hooks)
├── components/
│   └── ProductCard.tsx                  (modificado — recibe isFavorite y onToggle)
└── hooks/
    ├── useProducts.ts                   (nuevo — desde files/)
    ├── useCategories.ts                 (nuevo — desde files/)
    └── useLocalStorage.ts               (nuevo — desde files/)
```

---

## Paso 1: Crear `useLocalStorage`

**(copiar — desde `files/useLocalStorage.ts`)**

Crear `src/hooks/useLocalStorage.ts`:

```ts
import { useState, useCallback } from 'react'

function useLocalStorage<T>(key: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : valorInicial
    } catch {
      return valorInicial
    }
  })

  const guardar = useCallback(
    (nuevoValor: T) => {
      setValor(nuevoValor)
      localStorage.setItem(key, JSON.stringify(nuevoValor))
    },
    [key]
  )

  return [valor, guardar] as const
}

export default useLocalStorage
```

**¿Que hace este codigo?**
- El inicializador de `useState` es una funcion `() => { ... }` — esto evita que `localStorage.getItem` se llame en cada render; solo se ejecuta una vez al montar
- `JSON.parse` puede fallar si el valor guardado es invalido — el `try/catch` protege contra esto
- `as const` en el return infiere la tupla `[T, (val: T) => void]` correctamente en lugar de un array generico
- El `useCallback` con `[key]` garantiza que `guardar` no cambia de referencia si la key no cambia

---

## Paso 2: Crear `useProducts`

**(copiar — desde `files/useProducts.ts`)**

Crear `src/hooks/useProducts.ts`:

```ts
import { useState, useEffect } from 'react'
import { getProducts } from '@/services/product.service'
import type { Product } from '@/types/product.types'

interface UseProductsReturn {
  productos: Product[]
  total: number
  cargando: boolean
  error: string | null
}

function useProducts(limit = 30): UseProductsReturn {
  const [productos, setProductos] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const cargar = async () => {
      try {
        setCargando(true)
        setError(null)
        const datos = await getProducts(limit)
        setProductos(datos.products)
        setTotal(datos.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos')
      } finally {
        setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [limit])

  return { productos, total, cargando, error }
}

export default useProducts
```

**¿Que hace este codigo?**
- El `AbortController` cancela la peticion si el componente se desmonta o `limit` cambia antes de que termine
- `UseProductsReturn` tipifica el valor de retorno — hace que el IDE muestre autocompletado correcto
- El efecto depende de `limit` — si el componente padre cambia el `limit`, el hook recarga automaticamente

---

## Paso 3: Crear `useCategories`

**(copiar — desde `files/useCategories.ts`)**

Crear `src/hooks/useCategories.ts`:

```ts
import { useState, useEffect } from 'react'
import { getCategories } from '@/services/product.service'

function useCategories() {
  const [categorias, setCategorias] = useState<string[]>(['todas'])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getCategories()
      .then(cats => setCategorias(['todas', ...cats]))
      .catch(() => setCategorias(['todas']))
      .finally(() => setCargando(false))
  }, [])

  return { categorias, cargando }
}

export default useCategories
```

**¿Que hace este codigo?**
- Usa el encadenamiento `.then().catch().finally()` — alternativa valida a `async/await` para efectos simples
- Si la API falla, se retorna solo `['todas']` — el usuario puede buscar sin filtros
- `cargando` permite ocultar los botones de categoria mientras se cargan

---

## Paso 4: Elevar estado de favoritos a `App`

**(completar)**

Actualmente cada `ProductCard` tiene su propio estado de favorito. Al recargar se pierde. Vamos a:
1. Eliminar el estado local de favorito en `ProductCard`
2. Recibir el estado y el toggleo via props
3. Gestionar favoritos en `App` con `useLocalStorage`

Modificar `src/components/ProductCard.tsx`:

```tsx
import type { Product } from '@/types/product.types'
import Badge from '@/components/Badge'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  // TODO 4.1: Agregar dos props nuevas:
  // isFavorite: boolean
  // onToggleFavorite: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}

function ProductCard({ product, isFavorite, onToggleFavorite }: ProductCardProps) {
  const { title, price, thumbnail, category, rating } = product

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={thumbnail} alt={title} className={styles.image} loading="lazy" />
        <button
          className={`${styles.favBtn} ${isFavorite ? styles.favBtnActive : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>${price.toFixed(2)}</p>
        <div className={styles.footer}>
          <Badge texto={category} tipo="categoria" />
          <span className={styles.rating}>★ {rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
```

**¿Que hace este codigo?**
- `isFavorite` y `onToggleFavorite` vienen del padre — `ProductCard` ya no gestiona estado propio de favorito
- Este patron se llama "elevar el estado" (lifting state up) — el padre controla, el hijo renderiza
- En el modulo 10 (Context API) el estado de favoritos se hara global para no tener que pasarlo por props

---

## Paso 5: Simplificar `App.tsx`

**(copiar)**

Reemplazar `src/App.tsx` usando los nuevos hooks:

```tsx
import { useState } from 'react'
import useProducts from '@/hooks/useProducts'
import useCategories from '@/hooks/useCategories'
import useLocalStorage from '@/hooks/useLocalStorage'
import ProductList from '@/components/ProductList'

function App() {
  const { productos, cargando, error } = useProducts(30)
  const { categorias } = useCategories()
  const [favoritos, setFavoritos] = useLocalStorage<number[]>('react-store-favoritos', [])
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('todas')

  const toggleFavorito = (id: number) => {
    setFavoritos(
      favoritos.includes(id)
        ? favoritos.filter(fid => fid !== id)
        : [...favoritos, id]
    )
  }

  const productosFiltrados = productos
    .filter(p => p.title.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => categoriaActiva === 'todas' || p.category === categoriaActiva)

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )
  }

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
        {categorias.map(cat => (
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
          cargando={cargando}
          busqueda={busqueda}
          favoritos={favoritos}
          onToggleFavorito={toggleFavorito}
        />
      </main>
    </div>
  )
}

export default App
```

**¿Que hace este codigo?**
- `useProducts`, `useCategories` y `useLocalStorage` encapsulan toda la logica de datos
- `toggleFavorito` es una funcion simple: si el id esta, lo quita; si no, lo agrega
- Los favoritos se persisten en `localStorage` bajo la clave `react-store-favoritos`

---

## Paso 6: Actualizar `ProductList` para pasar favoritos

**(completar)**

`ProductList` necesita recibir y propagar los favoritos a cada `ProductCard`:

```tsx
// TODO 6.1: Agregar las props favoritos y onToggleFavorito a ProductListProps
// Modificar el .map() para pasar isFavorite y onToggleFavorite a ProductCard
interface ProductListProps {
  productos: Product[]
  cargando?: boolean
  busqueda?: string
  favoritos: number[]
  onToggleFavorito: (id: number) => void
}

// En el .map():
{productos.map(product => (
  <ProductCard
    key={product.id}
    product={product}
    isFavorite={favoritos.includes(product.id)}
    onToggleFavorite={() => onToggleFavorito(product.id)}
  />
))}
```

> Captura pendiente: al hacer click en el corazon, la tarjeta mantiene el estado de favorito despues de recargar la pagina.

---

## Validaciones Esperadas

- [ ] Los favoritos persisten despues de recargar la pagina (verificar en DevTools → Application → Local Storage)
- [ ] `App.tsx` ya no tiene `useEffect` directamente — la logica esta en los hooks
- [ ] El buscador y los filtros siguen funcionando igual que antes
- [ ] El contador de lineas de `App.tsx` es considerablemente menor al del modulo 6
- [ ] No hay `useState` de `productos` ni `categorias` en `App` — vienen de los hooks

---

## Entregables

- `src/hooks/useProducts.ts`
- `src/hooks/useCategories.ts`
- `src/hooks/useLocalStorage.ts`
- `src/components/ProductCard.tsx` actualizado con props elevadas
- `src/components/ProductList.tsx` propagando favoritos
- `src/App.tsx` simplificado

---

## Commits Sugeridos

```bash
git commit -m "feat: crear hooks useProducts, useCategories y useLocalStorage"
git commit -m "refactor: elevar estado de favoritos a App con useLocalStorage"
git commit -m "refactor: simplificar App usando custom hooks"
```
