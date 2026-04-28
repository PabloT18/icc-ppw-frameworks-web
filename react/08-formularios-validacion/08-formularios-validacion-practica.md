# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 8: Formularios y Validacion

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Construir un panel de filtros avanzados con formulario controlado para ReactStore: rango de precio (min/max), rating minimo y ordenamiento. Implementar validacion de los rangos antes de aplicar los filtros.

---

## Contexto de la Practica

El proyecto tiene filtro de texto y categorias. Este modulo agrega filtros mas complejos con un formulario completo: inputs numericos, range sliders y selects, con validacion de los valores antes de aplicarlos.

**Estado del proyecto al inicio de esta practica:**
- `src/App.tsx` con hooks de productos y categorias
- Filtro por busqueda y categoria funcionando

---

## Archivos que se van a crear o modificar

```
src/
├── App.tsx                              (modificado — integrar FilterPanel)
└── components/
    ├── FilterPanel.tsx                  (nuevo — desde files/)
    └── FilterPanel.module.css           (nuevo — desde files/)
```

---

## Paso 1: Definir el tipo de filtros

**(copiar)**

Agregar a `src/types/product.types.ts` el tipo de filtros:

```ts
export interface ProductFilters {
  precioMin: number
  precioMax: number
  ratingMin: number
  ordenar: 'precio-asc' | 'precio-desc' | 'rating-desc' | 'nombre-asc'
}

export const FILTROS_INICIALES: ProductFilters = {
  precioMin: 0,
  precioMax: 10000,
  ratingMin: 0,
  ordenar: 'nombre-asc',
}
```

---

## Paso 2: Crear `FilterPanel.module.css`

**(copiar — desde `files/FilterPanel.module.css`)**

Crear `src/components/FilterPanel.module.css`:

```css
.panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.titulo {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: #111;
}

.grupo {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
}

.fila {
  display: flex;
  gap: 0.5rem;
}

.input {
  width: 100%;
  padding: 0.4rem 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
}

.inputError {
  border-color: #dc2626;
}

.error {
  font-size: 0.78rem;
  color: #dc2626;
}

.select {
  width: 100%;
  padding: 0.4rem 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

.range {
  width: 100%;
  accent-color: #2563eb;
}

.rangeLabel {
  font-size: 0.8rem;
  color: #666;
  text-align: right;
}

.botones {
  display: flex;
  gap: 0.5rem;
}

.btnAplicar {
  flex: 1;
  padding: 0.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}

.btnLimpiar {
  padding: 0.5rem 1rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}
```

---

## Paso 3: Crear `FilterPanel`

**(copiar — desde `files/FilterPanel.tsx`)**

Crear `src/components/FilterPanel.tsx`:

```tsx
import { useState } from 'react'
import type { ProductFilters } from '@/types/product.types'
import { FILTROS_INICIALES } from '@/types/product.types'
import styles from './FilterPanel.module.css'

interface FilterPanelProps {
  filtros: ProductFilters
  onAplicar: (filtros: ProductFilters) => void
}

function FilterPanel({ filtros, onAplicar }: FilterPanelProps) {
  const [form, setForm] = useState<ProductFilters>(filtros)
  const [errors, setErrors] = useState<{ precioMin?: string; precioMax?: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const esNumerico = ['precioMin', 'precioMax', 'ratingMin'].includes(name)
    setForm(prev => ({ ...prev, [name]: esNumerico ? Number(value) : value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const validar = (): boolean => {
    const nuevosErrors: typeof errors = {}

    if (form.precioMin < 0) {
      nuevosErrors.precioMin = 'El precio minimo no puede ser negativo'
    }
    if (form.precioMax < form.precioMin) {
      nuevosErrors.precioMax = 'El precio maximo debe ser mayor al minimo'
    }

    setErrors(nuevosErrors)
    return Object.keys(nuevosErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validar()) {
      onAplicar(form)
    }
  }

  const handleLimpiar = () => {
    setForm(FILTROS_INICIALES)
    setErrors({})
    onAplicar(FILTROS_INICIALES)
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <h3 className={styles.titulo}>Filtros</h3>

      <div className={styles.grupo}>
        <label className={styles.label}>Rango de precio</label>
        <div className={styles.fila}>
          <div style={{ flex: 1 }}>
            <input
              type="number"
              name="precioMin"
              value={form.precioMin}
              onChange={handleChange}
              placeholder="Min"
              className={`${styles.input} ${errors.precioMin ? styles.inputError : ''}`}
              min={0}
            />
            {errors.precioMin && <span className={styles.error}>{errors.precioMin}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="number"
              name="precioMax"
              value={form.precioMax}
              onChange={handleChange}
              placeholder="Max"
              className={`${styles.input} ${errors.precioMax ? styles.inputError : ''}`}
              min={0}
            />
            {errors.precioMax && <span className={styles.error}>{errors.precioMax}</span>}
          </div>
        </div>
      </div>

      <div className={styles.grupo}>
        <label className={styles.label}>Rating minimo: {form.ratingMin.toFixed(1)}</label>
        <input
          type="range"
          name="ratingMin"
          value={form.ratingMin}
          onChange={handleChange}
          min={0}
          max={5}
          step={0.5}
          className={styles.range}
        />
        <div className={styles.fila} style={{ justifyContent: 'space-between' }}>
          <span className={styles.rangeLabel}>0</span>
          <span className={styles.rangeLabel}>5</span>
        </div>
      </div>

      <div className={styles.grupo}>
        <label className={styles.label} htmlFor="ordenar">Ordenar por</label>
        <select
          id="ordenar"
          name="ordenar"
          value={form.ordenar}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="nombre-asc">Nombre A-Z</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="rating-desc">Mejor valorados</option>
        </select>
      </div>

      <div className={styles.botones}>
        <button type="button" className={styles.btnLimpiar} onClick={handleLimpiar}>
          Limpiar
        </button>
        <button type="submit" className={styles.btnAplicar}>
          Aplicar filtros
        </button>
      </div>
    </form>
  )
}

export default FilterPanel
```

**¿Que hace este codigo?**
- `useState(filtros)` — el form usa los filtros actuales como estado inicial
- Handler generico `handleChange` — determina si el valor es numerico y convierte con `Number()`
- `validar()` retorna `boolean` — en `handleSubmit` solo llama a `onAplicar` si no hay errores
- `onAplicar(FILTROS_INICIALES)` en limpiar — tambien notifica al padre para actualizar la lista

---

## Paso 4: Integrar `FilterPanel` en `App`

**(completar)**

Modificar `src/App.tsx` para usar el panel de filtros en una barra lateral:

```tsx
import { useState } from 'react'
import useProducts from '@/hooks/useProducts'
import useCategories from '@/hooks/useCategories'
import useLocalStorage from '@/hooks/useLocalStorage'
import ProductList from '@/components/ProductList'
import FilterPanel from '@/components/FilterPanel'
import type { ProductFilters } from '@/types/product.types'
import { FILTROS_INICIALES } from '@/types/product.types'

function App() {
  const { productos, cargando, error } = useProducts(100) // mas productos para filtrar
  const { categorias } = useCategories()
  const [favoritos, setFavoritos] = useLocalStorage<number[]>('react-store-favoritos', [])
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('todas')

  // TODO 4.1: Crear estado para los filtros usando FILTROS_INICIALES como valor inicial
  const [filtros, setFiltros] = useState<ProductFilters>(FILTROS_INICIALES)

  const toggleFavorito = (id: number) => {
    setFavoritos(favoritos.includes(id) ? favoritos.filter(fid => fid !== id) : [...favoritos, id])
  }

  // TODO 4.2: Aplicar todos los filtros al array de productos
  // Filtros a aplicar: busqueda de texto, categoria, precio min/max, rating min, ordenamiento
  const productosFiltrados = productos
    .filter(p => p.title.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => categoriaActiva === 'todas' || p.category === categoriaActiva)
    .filter(p => p.price >= filtros.precioMin && p.price <= filtros.precioMax)
    .filter(p => p.rating >= filtros.ratingMin)
    .sort((a, b) => {
      if (filtros.ordenar === 'precio-asc') return a.price - b.price
      if (filtros.ordenar === 'precio-desc') return b.price - a.price
      if (filtros.ordenar === 'rating-desc') return b.rating - a.rating
      return a.title.localeCompare(b.title)
    })

  if (error) return <p>Error: {error}</p>

  return (
    <div>
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

      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'flex-start' }}>
        <aside style={{ width: '260px', flexShrink: 0 }}>
          <FilterPanel filtros={filtros} onAplicar={setFiltros} />
        </aside>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                style={{
                  padding: '0.35rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  background: categoriaActiva === cat ? '#2563eb' : 'white',
                  color: categoriaActiva === cat ? 'white' : '#333',
                  textTransform: 'capitalize',
                  fontSize: '0.85rem',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <ProductList
            productos={productosFiltrados}
            cargando={cargando}
            busqueda={busqueda}
            favoritos={favoritos}
            onToggleFavorito={toggleFavorito}
          />
        </div>
      </div>
    </div>
  )
}

export default App
```

> Captura pendiente: layout con barra lateral izquierda con el panel de filtros y la grilla de productos a la derecha; al ingresar un precio max de 100 solo se muestran productos menores a $100.

---

## Validaciones Esperadas

- [ ] El panel de filtros aparece en la barra lateral
- [ ] Introducir precio minimo mayor al maximo muestra el mensaje de error en el campo "Max"
- [ ] Introducir precio negativo muestra error en el campo "Min"
- [ ] Al hacer click en "Aplicar filtros", la grilla se actualiza
- [ ] Al hacer click en "Limpiar", los filtros se reinician y la grilla muestra todos los productos
- [ ] El slider de rating filtra productos con valoracion menor al minimo seleccionado
- [ ] El select de ordenamiento reordena la grilla visualmente
- [ ] Los errores desaparecen al corregir el valor del campo

---

## Entregables

- `src/types/product.types.ts` actualizado con `ProductFilters` y `FILTROS_INICIALES`
- `src/components/FilterPanel.tsx` con formulario controlado y validacion
- `src/components/FilterPanel.module.css`
- `src/App.tsx` con layout de barra lateral y filtros aplicados

---

## Commits Sugeridos

```bash
git commit -m "feat: definir tipo ProductFilters y constante FILTROS_INICIALES"
git commit -m "feat: crear componente FilterPanel con validacion de precio"
git commit -m "feat: integrar FilterPanel en App con layout de dos columnas"
```
