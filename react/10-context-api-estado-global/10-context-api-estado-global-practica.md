# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 10: Context API y Estado Global

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Crear `FavoritesContext` para eliminar el prop drilling de los favoritos. Despues de esta practica, `ProductCard` consumira el contexto directamente sin necesitar que `ProductList` ni `HomePage` pasen las props.

---

## Contexto de la Practica

Actualmente el flujo de favoritos pasa por tres niveles de props:
```
HomePage (favoritos, toggleFavorito)
  └── ProductList (favoritos, onToggleFavorito)
        └── ProductCard (isFavorite, onToggleFavorite)
```

Al finalizar esta practica:
```
FavoritesProvider (en main.tsx)
  └── HomePage — sin props de favoritos
        └── ProductList — sin props de favoritos
              └── ProductCard — usa useFavorites() directamente
```

---

## Archivos que se van a crear o modificar

```
src/
├── main.tsx                              (modificado — FavoritesProvider)
├── contexts/
│   └── FavoritesContext.tsx             (nuevo — desde files/)
├── components/
│   ├── ProductCard.tsx                  (modificado — usa useFavorites)
│   └── ProductList.tsx                  (modificado — quita props de favoritos)
└── pages/
    ├── HomePage.tsx                     (modificado — quita favoritos)
    └── FavoritesPage.tsx                (modificado — usa useFavorites)
```

---

## Paso 1: Crear `FavoritesContext`

**(copiar — desde `files/FavoritesContext.tsx`)**

Crear `src/contexts/FavoritesContext.tsx`:

```tsx
import { createContext, useContext, type ReactNode } from 'react'
import useLocalStorage from '@/hooks/useLocalStorage'

interface FavoritesContextType {
  favoritos: number[]
  toggleFavorito: (id: number) => void
  esFavorito: (id: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useLocalStorage<number[]>('react-store-favoritos', [])

  const toggleFavorito = (id: number) => {
    setFavoritos(
      favoritos.includes(id)
        ? favoritos.filter(fid => fid !== id)
        : [...favoritos, id]
    )
  }

  const esFavorito = (id: number) => favoritos.includes(id)

  return (
    <FavoritesContext.Provider value={{ favoritos, toggleFavorito, esFavorito }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de FavoritesProvider')
  return ctx
}
```

**¿Que hace este codigo?**
- `createContext<... | null>(null)` — el null inicial garantiza que si alguien usa el hook fuera del Provider, el error sea explicito
- `FavoritesProvider` encapsula el estado y las funciones — los consumidores no necesitan conocer la implementacion
- `esFavorito` es una funcion derivada — mas comodo que llamar `favoritos.includes(id)` en cada componente
- El hook `useFavorites` lanza un error descriptivo si se usa mal — facilita el debugging

---

## Paso 2: Registrar el Provider en `main.tsx`

**(copiar)**

Modificar `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>
)
```

**¿Que hace este codigo?**
- `FavoritesProvider` envuelve toda la app — cualquier componente puede acceder a `useFavorites()`
- El orden importa: `BrowserRouter` fuera, `FavoritesProvider` dentro — el contexto necesita el router disponible si usa `useNavigate` internamente (en este caso no, pero es buena practica)

---

## Paso 3: Simplificar `ProductCard`

**(completar)**

Modificar `src/components/ProductCard.tsx` para usar `useFavorites` directamente:

```tsx
import { useFavorites } from '@/contexts/FavoritesContext'
import type { Product } from '@/types/product.types'
import Badge from '@/components/Badge'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  onVerDetalle?: () => void
  // TODO 3.1: Eliminar isFavorite y onToggleFavorite de las props — ya no son necesarias
}

function ProductCard({ product, onVerDetalle }: ProductCardProps) {
  // TODO 3.2: Obtener esFavorito y toggleFavorito del contexto
  const { esFavorito, toggleFavorito } = useFavorites()
  const isFavorite = esFavorito(product.id)

  const { title, price, thumbnail, category, rating } = product

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={thumbnail} alt={title} className={styles.image} loading="lazy" />
        <button
          className={`${styles.favBtn} ${isFavorite ? styles.favBtnActive : ''}`}
          onClick={() => toggleFavorito(product.id)}
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
        {onVerDetalle && (
          <button
            onClick={onVerDetalle}
            style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #2563eb', color: '#2563eb', background: 'white', cursor: 'pointer', fontWeight: 600 }}
          >
            Ver detalles
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
```

---

## Paso 4: Simplificar `ProductList`

**(completar)**

Modificar `src/components/ProductList.tsx` para quitar las props de favoritos:

```tsx
// TODO 4.1: Eliminar favoritos y onToggleFavorito de ProductListProps
interface ProductListProps {
  productos: Product[]
  cargando?: boolean
  busqueda?: string
  onVerDetalle?: (id: number) => void
}

// TODO 4.2: En el .map(), quitar isFavorite y onToggleFavorite de ProductCard
{productos.map(product => (
  <ProductCard
    key={product.id}
    product={product}
    onVerDetalle={onVerDetalle ? () => onVerDetalle(product.id) : undefined}
  />
))}
```

---

## Paso 5: Simplificar `HomePage` y `FavoritesPage`

**(completar)**

En `HomePage.tsx`:
```tsx
// TODO 5.1: Eliminar useLocalStorage y las variables favoritos, toggleFavorito
// TODO 5.2: Quitar las props favoritos y onToggleFavorito de <ProductList>
```

En `FavoritesPage.tsx`:
```tsx
// TODO 5.3: Reemplazar useLocalStorage por useFavorites()
// import { useFavorites } from '@/contexts/FavoritesContext'
// const { favoritos, toggleFavorito } = useFavorites()
```

> Captura pendiente: abrir DevTools → Components (React DevTools). En el arbol de componentes aparece `FavoritesProvider` en la raiz. Al hacer clic en el corazon de cualquier tarjeta, el estado del contexto se actualiza en tiempo real.

---

## Validaciones Esperadas

- [ ] Al marcar un favorito en la pagina de inicio, aparece en la pagina de Favoritos sin recargar
- [ ] Los favoritos persisten despues de recargar la pagina
- [ ] `ProductList` ya no tiene props `favoritos` ni `onToggleFavorito`
- [ ] `ProductCard` ya no recibe props `isFavorite` ni `onToggleFavorite`
- [ ] El hook `useFavorites()` funciona en `ProductCard`, `FavoritesPage` y cualquier otro componente

---

## Entregables

- `src/contexts/FavoritesContext.tsx`
- `src/main.tsx` con `FavoritesProvider`
- `src/components/ProductCard.tsx` usando `useFavorites()`
- `src/components/ProductList.tsx` sin props de favoritos
- `src/pages/HomePage.tsx` y `FavoritesPage.tsx` simplificados

---

## Commits Sugeridos

```bash
git commit -m "feat: crear FavoritesContext con Provider y hook useFavorites"
git commit -m "refactor: eliminar prop drilling de favoritos en ProductList y HomePage"
git commit -m "refactor: ProductCard consume useFavorites directamente"
```
