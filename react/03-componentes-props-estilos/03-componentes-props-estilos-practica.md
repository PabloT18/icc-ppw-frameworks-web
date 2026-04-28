# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 3: Componentes, Props y Estilos

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Crear los componentes base del proyecto ReactStore: `Badge` y `ProductCard`, con props tipadas en TypeScript y estilos aplicados con CSS Modules. Al finalizar, la aplicacion mostrara tarjetas de productos estaticas con datos simulados.

---

## Contexto de la Practica

Continuamos sobre el proyecto `react-store`. En este modulo se crea la pieza visual central: la tarjeta de producto (`ProductCard`). Los datos todavia son estaticos (hardcoded) — en el modulo 6 se conectaran a la API real.

**Estado del proyecto al inicio de esta practica:**
- `src/App.tsx` — con `HelloWorld` y `StatusBanner`
- `src/components/HelloWorld.tsx`
- `src/components/StatusBanner.tsx`

---

## Archivos que se van a crear o modificar

```
src/
├── App.tsx                                    (modificado)
├── types/
│   └── product.types.ts                       (nuevo)
└── components/
    ├── Badge.tsx                              (nuevo — desde files/)
    ├── ProductCard.tsx                        (nuevo — desde files/)
    └── ProductCard.module.css                 (nuevo — desde files/)
```

---

## Paso 1: Definir los tipos del proyecto

**(copiar)**

Crear la carpeta `src/types/` y el archivo `src/types/product.types.ts`:

```ts
export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  category: string
  thumbnail: string
  images: string[]
}
```

**¿Que hace este codigo?**
- Define la interfaz `Product` que describe la forma de los datos que llegaran desde DummyJSON
- `export` la hace disponible para importar en cualquier componente
- Tener los tipos centralizados en `src/types/` evita duplicarlos en cada archivo
- En modulos futuros esta interfaz se usara en los servicios de API y los hooks

---

## Paso 2: Crear el componente `Badge`

**(copiar — desde `files/Badge.tsx`)**

Crear `src/components/Badge.tsx`:

```tsx
interface BadgeProps {
  texto: string
  tipo?: 'categoria' | 'oferta' | 'agotado'
}

function Badge({ texto, tipo = 'categoria' }: BadgeProps) {
  const estilosBase: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  }

  const coloresPorTipo = {
    categoria: { background: '#e8f4fd', color: '#1e6eb0' },
    oferta: { background: '#fde8e8', color: '#b01e1e' },
    agotado: { background: '#f0f0f0', color: '#666' },
  }

  return (
    <span style={{ ...estilosBase, ...coloresPorTipo[tipo] }}>
      {texto}
    </span>
  )
}

export default Badge
```

**¿Que hace este codigo?**
- `BadgeProps` define dos props: `texto` (requerida) y `tipo` (opcional con valor por defecto)
- `tipo = 'categoria'` en la desestructuracion asigna el valor por defecto
- `React.CSSProperties` es el tipo TypeScript para estilos en linea — da autocompletado de propiedades CSS
- El spread `{ ...estilosBase, ...coloresPorTipo[tipo] }` combina los estilos base con los del tipo especifico

---

## Paso 3: Crear los estilos de `ProductCard`

**(copiar — desde `files/ProductCard.module.css`)**

Crear `src/components/ProductCard.module.css`:

```css
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.rating {
  font-size: 0.85rem;
  color: #f59e0b;
}
```

---

## Paso 4: Crear el componente `ProductCard`

**(copiar — desde `files/ProductCard.tsx`)**

Crear `src/components/ProductCard.tsx`:

```tsx
import type { Product } from '@/types/product.types'
import Badge from '@/components/Badge'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { title, price, thumbnail, category, rating } = product

  return (
    <article className={styles.card}>
      <img
        src={thumbnail}
        alt={title}
        className={styles.image}
        loading="lazy"
      />
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
- `import type { Product }` — importa solo el tipo, no ejecuta ningun codigo en runtime
- La prop `product` recibe el objeto completo y se desestructura internamente
- `<article>` es semanticamente correcto para una tarjeta de contenido independiente
- `loading="lazy"` es atributo HTML nativo para diferir la carga de imagenes fuera del viewport
- `styles.card` accede a la clase `.card` del CSS Module con nombre de clase unico generado automaticamente

---

## Paso 5: Mostrar productos en `App`

**(completar)**

Modificar `src/App.tsx` para mostrar un conjunto de productos estaticos usando `ProductCard`:

```tsx
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/types/product.types'

// TODO 5.1: Definir un array de productos de prueba con al menos 3 productos
// Cada producto debe tener: id, title, description, price, discountPercentage,
// rating, stock, category, thumbnail, images
// const PRODUCTOS_MOCK: Product[] = [...]

// Solucion:
const PRODUCTOS_MOCK: Product[] = [
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
    title: 'iPhone X',
    description: 'SIM-Free, Model A19211 6.5-inch Super Retina HD display',
    price: 899,
    discountPercentage: 17.94,
    rating: 4.44,
    stock: 34,
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/product-images/3/thumbnail.jpg',
    images: [],
  },
  {
    id: 3,
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
]

function App() {
  return (
    <div className="app">
      <header style={{ background: '#1a1a1a', color: 'white', padding: '1rem 2rem' }}>
        <h1>ReactStore</h1>
      </header>
      <main style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {/* TODO 5.2: Renderizar cada producto usando el componente ProductCard */}
        {/* Pista: usar .map() sobre PRODUCTOS_MOCK */}
        {/* <ProductCard key={...} product={...} /> */}
        {PRODUCTOS_MOCK.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </main>
    </div>
  )
}

export default App
```

**¿Que hace este codigo?**
- `PRODUCTOS_MOCK` es un array tipado como `Product[]` con datos de prueba
- `.map()` itera el array y retorna un componente por cada elemento
- `key={product.id}` es obligatorio cuando se generan elementos en un bucle — React lo usa para identificar cada elemento en el Virtual DOM
- El layout de cuadricula se logra con CSS Grid directo en el estilo en linea (en modulos futuros se movera a una clase CSS)

> Captura pendiente: grilla de 3 tarjetas de producto con imagen, titulo, precio, categoria y rating.

---

## Validaciones Esperadas

- [ ] `Badge` muestra el nombre de la categoria con fondo azul claro
- [ ] `ProductCard` muestra imagen, titulo (recortado en 2 lineas), precio y rating
- [ ] Al hacer hover sobre una tarjeta, aparece una sombra y sube ligeramente
- [ ] No hay errores de TypeScript ni de ESLint
- [ ] En DevTools, las clases CSS de los elementos tienen nombres generados como `ProductCard_card__xxxxx`

---

## Entregables

- `src/types/product.types.ts` con la interfaz `Product`
- `src/components/Badge.tsx` con props tipadas
- `src/components/ProductCard.tsx` con CSS Modules
- `src/components/ProductCard.module.css` con estilos de la tarjeta
- `src/App.tsx` mostrando 3 tarjetas de productos en una grilla

---

## Commits Sugeridos

```bash
git commit -m "feat: definir interfaz Product en types"
git commit -m "feat: crear componente Badge con variantes de tipo"
git commit -m "feat: crear componente ProductCard con CSS Modules"
git commit -m "feat: mostrar productos mock en App con ProductCard"
```
