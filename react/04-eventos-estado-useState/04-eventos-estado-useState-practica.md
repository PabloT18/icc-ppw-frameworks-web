# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 4: Eventos y Estado con useState

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Agregar interactividad real a los componentes del proyecto. Se construye un contador como ejercicio basico de `useState`, luego se agrega un boton de favorito con estado a `ProductCard`, y finalmente se crea un buscador simple que filtra los productos del mock por nombre.

---

## Contexto de la Practica

Continuamos sobre el proyecto `react-store`. Los componentes del modulo anterior son estaticos — no responden al usuario. En esta practica aprenden a manejar eventos y a actualizar la UI mediante `useState`.

**Estado del proyecto al inicio de esta practica:**
- `src/components/Badge.tsx`
- `src/components/ProductCard.tsx` + `ProductCard.module.css`
- `src/types/product.types.ts`
- `src/App.tsx` con lista de productos mock

---

## Archivos que se van a crear o modificar

```
src/
├── App.tsx                              (modificado — agregar buscador)
└── components/
    ├── Counter.tsx                      (nuevo — desde files/)
    ├── ProductCard.tsx                  (modificado — agregar favorito)
    └── ProductCard.module.css           (modificado — estilo boton favorito)
```

---

## Paso 1: Explorar el estado sin `useState`

**(verificar)**

Antes de usar `useState`, verificar el comportamiento sin estado. En `src/components/Counter.tsx` que se creara en el siguiente paso, primero intentar con variable normal:

```tsx
// Esto NO funciona — solo para entender por que necesitamos useState
function ContadorRoto() {
  let cuenta = 0

  return (
    <div>
      <p>Cuenta: {cuenta}</p>
      <button onClick={() => { cuenta++ ; console.log(cuenta) }}>
        Incrementar
      </button>
    </div>
  )
}
```

Abrir DevTools (F12), ver la consola — el valor sube en consola pero la UI no se actualiza.

**¿Que hace este codigo?**
- La variable `cuenta` cambia en memoria, pero React no sabe que debe re-renderizar
- React solo re-renderiza cuando el **estado** cambia, no variables locales
- Este es el problema que `useState` resuelve

---

## Paso 2: Crear `Counter` con `useState`

**(copiar — desde `files/Counter.tsx`)**

Crear `src/components/Counter.tsx`:

```tsx
import { useState } from 'react'

interface CounterProps {
  inicial?: number
  paso?: number
}

function Counter({ inicial = 0, paso = 1 }: CounterProps) {
  const [cuenta, setCuenta] = useState(inicial)

  const incrementar = () => setCuenta(prev => prev + paso)
  const decrementar = () => setCuenta(prev => prev - paso)
  const reiniciar = () => setCuenta(inicial)

  return (
    <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'inline-block' }}>
      <p style={{ fontSize: '3rem', fontWeight: 700, margin: 0, color: cuenta < 0 ? '#dc2626' : '#111' }}>
        {cuenta}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button onClick={decrementar}>-</button>
        <button onClick={reiniciar} style={{ background: '#6b7280', color: 'white' }}>Reset</button>
        <button onClick={incrementar}>+</button>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
        Paso: {paso}
      </p>
    </div>
  )
}

export default Counter
```

**¿Que hace este codigo?**
- `useState(inicial)` inicializa el estado con el valor de la prop `inicial`
- `prev => prev + paso` — forma funcional, garantiza usar el valor mas reciente del estado
- El color del numero cambia a rojo cuando es negativo — estado derivado con operador ternario
- Cada instancia de `Counter` tiene su propio estado independiente

---

## Paso 3: Probar `Counter` en `App`

**(completar)**

Modificar temporalmente `src/App.tsx` para mostrar el contador:

```tsx
import Counter from '@/components/Counter'

// Dentro del JSX de App, agregar antes de la grilla de productos:
// TODO 3.1: Agregar dos instancias de Counter con diferentes props
// Primera: paso por defecto (paso=1)
// Segunda: con paso=5
{/* 
  <Counter />
  <Counter inicial={10} paso={5} />
*/}
```

Verificar que cada contador funciona de forma independiente — incrementar uno no afecta al otro.

> Captura pendiente: dos contadores lado a lado con valores diferentes, boton - Reset +.

---

## Paso 4: Agregar favorito a `ProductCard`

**(copiar — reemplazar `ProductCard.tsx` existente)**

Modificar `src/components/ProductCard.tsx` para incluir el boton de favorito:

```tsx
import { useState } from 'react'
import type { Product } from '@/types/product.types'
import Badge from '@/components/Badge'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { title, price, thumbnail, category, rating } = product
  const [esFavorito, setEsFavorito] = useState(false)

  const toggleFavorito = () => setEsFavorito(prev => !prev)

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={thumbnail}
          alt={title}
          className={styles.image}
          loading="lazy"
        />
        <button
          className={`${styles.favBtn} ${esFavorito ? styles.favBtnActive : ''}`}
          onClick={toggleFavorito}
          aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {esFavorito ? '❤️' : '🤍'}
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
- `useState(false)` — el estado inicial es "no favorito"
- `toggleFavorito` — usa la forma funcional `prev => !prev` para alternar el booleano
- `aria-label` cambia segun el estado — accesibilidad para lectores de pantalla
- Las clases CSS se combinan con template literals: la clase `favBtnActive` se agrega cuando `esFavorito` es `true`

---

## Paso 5: Estilos del boton de favorito

**(copiar — agregar a `ProductCard.module.css`)**

Agregar al final de `src/components/ProductCard.module.css`:

```css
.imageContainer {
  position: relative;
}

.favBtn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s ease;
}

.favBtn:hover {
  transform: scale(1.15);
}

.favBtnActive {
  background: #fff0f0;
}
```

> Captura pendiente: tarjeta de producto con el corazon blanco en la esquina superior derecha de la imagen, y al hacer click cambia a rojo.

---

## Paso 6: Buscador de productos en `App`

**(completar)**

Modificar `src/App.tsx` para filtrar productos segun una busqueda:

```tsx
import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/types/product.types'

const PRODUCTOS_MOCK: Product[] = [/* ...igual que modulo anterior... */]

function App() {
  // TODO 6.1: Crear estado para la busqueda (string, valor inicial '')
  // const [busqueda, setBusqueda] = useState(...)

  // TODO 6.2: Filtrar productos por titulo segun la busqueda
  // El filtro debe ser case-insensitive
  // const productosFiltrados = PRODUCTOS_MOCK.filter(p => ...)

  // Solucion:
  const [busqueda, setBusqueda] = useState('')

  const productosFiltrados = PRODUCTOS_MOCK.filter(p =>
    p.title.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="app">
      <header style={{ background: '#1a1a1a', color: 'white', padding: '1rem 2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>ReactStore</h1>
        <input
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontSize: '1rem', flex: 1, maxWidth: '400px' }}
        />
      </header>
      <main style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {productosFiltrados.length > 0
          ? productosFiltrados.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          : <p>No se encontraron productos para "{busqueda}"</p>
        }
      </main>
    </div>
  )
}

export default App
```

**¿Que hace este codigo?**
- `busqueda` es el estado del input controlado — React es la fuente de verdad
- `productosFiltrados` es **estado derivado**: se recalcula en cada render sin necesitar su propio `useState`
- `e.target.value` obtiene el valor actual del input en cada cambio
- El operador ternario muestra la grilla o un mensaje de "no encontrado"

> Captura pendiente: buscador con texto "Samsung" mostrando solo la tarjeta de Samsung Universe 9.

---

## Validaciones Esperadas

- [ ] El contador incrementa, decrementa y se reinicia correctamente
- [ ] Cada instancia del contador es independiente
- [ ] El numero del contador se muestra en rojo cuando es negativo
- [ ] El boton de favorito alterna entre ❤️ y 🤍 al hacer click
- [ ] El boton de favorito es independiente por cada tarjeta
- [ ] El buscador filtra en tiempo real sin hacer click en un boton
- [ ] El buscador es case-insensitive (escribir "iphone" encuentra "iPhone 9")
- [ ] Se muestra mensaje cuando no hay resultados

---

## Entregables

- `src/components/Counter.tsx` con estado, incremento, decremento y reinicio
- `src/components/ProductCard.tsx` con boton de favorito funcional
- `src/components/ProductCard.module.css` con estilos del boton
- `src/App.tsx` con buscador filtrado en tiempo real

---

## Commits Sugeridos

```bash
git commit -m "feat: crear componente Counter con useState"
git commit -m "feat: agregar boton de favorito a ProductCard"
git commit -m "feat: implementar buscador de productos en App"
```
