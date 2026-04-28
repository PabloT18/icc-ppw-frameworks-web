# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 3: Componentes, Props y Estilos

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Crear componentes reutilizables que acepten datos externos mediante **props**, componer componentes entre si, aplicar estilos con CSS tradicional y CSS Modules, y organizar visualmente el proyecto con separacion de responsabilidades.

---

## 2. Explicacion Conceptual

### Que son las Props?

**Props** (propiedades) son la forma en que un componente padre pasa datos a un componente hijo. Son analogas a los atributos HTML: al igual que `<img src="foto.jpg" alt="Foto">` le pasa datos al elemento `img`, un componente React recibe props como argumentos.

```tsx
// El padre pasa datos como atributos
<ProductCard nombre="Laptop Gaming" precio={899.99} imagen="laptop.jpg" />

// El hijo los recibe como objeto en el parametro
function ProductCard(props) {
  return <h3>{props.nombre}</h3>
}
```

Las props son **de solo lectura** — un componente hijo nunca debe modificar las props que recibe. Si el componente necesita cambiar datos, usa estado interno (`useState`, modulo 4).

### Props tipadas con TypeScript

Con TypeScript, se define una interfaz o tipo para las props del componente. Esto agrega autocompletado en el IDE y detecta errores en tiempo de compilacion:

```tsx
// Definir el tipo de las props
interface ProductCardProps {
  nombre: string
  precio: number
  imagen: string
  disponible?: boolean  // el ? lo hace opcional
}

// Componente con props tipadas
function ProductCard({ nombre, precio, imagen, disponible = true }: ProductCardProps) {
  return (
    <div>
      <img src={imagen} alt={nombre} />
      <h3>{nombre}</h3>
      <p>${precio.toFixed(2)}</p>
    </div>
  )
}
```

### Desestructuracion de props

En lugar de usar `props.nombre`, `props.precio`, etc., se desestructura directamente en el parametro:

```tsx
// Sin desestructurar — verboso
function ProductCard(props: ProductCardProps) {
  return <h3>{props.nombre} - ${props.precio}</h3>
}

// Con desestructuracion — limpio y directo
function ProductCard({ nombre, precio }: ProductCardProps) {
  return <h3>{nombre} - ${precio}</h3>
}

// Con valor por defecto
function ProductCard({ nombre, precio, disponible = true }: ProductCardProps) {
  // ...
}
```

### Composicion de componentes

La composicion es el patron fundamental de React: los componentes grandes se construyen ensamblando componentes mas pequenos:

```tsx
// Componente pequeño — atomico
function Badge({ texto, tipo }: { texto: string; tipo: 'nuevo' | 'oferta' | 'agotado' }) {
  return <span className={`badge badge--${tipo}`}>{texto}</span>
}

// Componente compuesto — usa Badge
function ProductCard({ nombre, precio, esNuevo }: ProductCardProps) {
  return (
    <article className="product-card">
      {esNuevo && <Badge texto="Nuevo" tipo="nuevo" />}
      <h3>{nombre}</h3>
      <p>${precio}</p>
    </article>
  )
}

// Componente de lista — usa ProductCard
function ProductList({ productos }: { productos: Producto[] }) {
  return (
    <div className="product-list">
      {productos.map(p => (
        <ProductCard key={p.id} nombre={p.nombre} precio={p.precio} esNuevo={p.nuevo} />
      ))}
    </div>
  )
}
```

### La prop especial `children`

`children` es una prop especial que contiene el JSX que se pasa entre las etiquetas de apertura y cierre de un componente:

```tsx
interface CardProps {
  titulo: string
  children: React.ReactNode
}

function Card({ titulo, children }: CardProps) {
  return (
    <div className="card">
      <h2 className="card__title">{titulo}</h2>
      <div className="card__body">{children}</div>
    </div>
  )
}

// Uso — el contenido entre las etiquetas es children
<Card titulo="Mi tarjeta">
  <p>Este parrafo es children</p>
  <button>Accion</button>
</Card>
```

---

## 3. Fundamento Tecnico

### CSS tradicional en React

Cada componente puede importar su propio archivo CSS:

```tsx
import './ProductCard.css'

function ProductCard({ nombre }: { nombre: string }) {
  return <div className="product-card">{nombre}</div>
}
```

```css
/* ProductCard.css */
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}
```

**Limitacion**: los estilos de CSS tradicional son **globales**. Si dos componentes usan la misma clase `.product-card`, los estilos se solapan. Para evitar esto existen CSS Modules.

### CSS Modules

CSS Modules genera nombres de clase unicos automaticamente, garantizando que los estilos de un componente no afecten a otros:

```tsx
// Importacion con nombre (no con *)
import styles from './ProductCard.module.css'

function ProductCard({ nombre }: { nombre: string }) {
  // La clase se accede como propiedad del objeto styles
  return <div className={styles.card}>{nombre}</div>
}
```

```css
/* ProductCard.module.css */
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}
```

El compilador genera un nombre unico como `ProductCard_card__xK3mP` — el `.card` local nunca colisiona con otros archivos.

**Combinar clases con CSS Modules:**

```tsx
// Con template literals
<div className={`${styles.card} ${esDestacado ? styles.cardFeatured : ''}`}>

// Con la libreria clsx (recomendada para casos complejos)
import clsx from 'clsx'
<div className={clsx(styles.card, { [styles.cardFeatured]: esDestacado })}>
```

### Organizacion de archivos por componente

Convencion recomendada — un directorio por componente cuando tiene muchos archivos asociados:

```
src/
└── components/
    ├── ProductCard/
    │   ├── ProductCard.tsx
    │   ├── ProductCard.module.css
    │   └── index.ts        (re-exportacion opcional)
    └── Badge/
        ├── Badge.tsx
        └── Badge.module.css
```

Para proyectos de aprendizaje es aceptable poner los archivos directamente en `components/` sin subcarpetas.

---

## 4. Ejemplos de Codigo

### Componente con multiples props y valor por defecto

```tsx
interface BadgeProps {
  texto: string
  tipo?: 'nuevo' | 'oferta' | 'agotado'
}

function Badge({ texto, tipo = 'nuevo' }: BadgeProps) {
  const colores = {
    nuevo: '#2563eb',
    oferta: '#dc2626',
    agotado: '#6b7280',
  }

  return (
    <span
      style={{
        background: colores[tipo],
        color: 'white',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {texto}
    </span>
  )
}
```

### Componente con children y forwarding de clase

```tsx
interface SectionProps {
  titulo: string
  className?: string
  children: React.ReactNode
}

function Section({ titulo, className = '', children }: SectionProps) {
  return (
    <section className={`section ${className}`}>
      <h2 className="section__title">{titulo}</h2>
      <div className="section__content">{children}</div>
    </section>
  )
}
```

---

## 5. Buenas Practicas

- **Tipar siempre las props en TypeScript**: evita errores silenciosos y mejora el autocompletado.
- **Usar CSS Modules para componentes reutilizables**: evita colisiones de nombres a medida que el proyecto crece.
- **Mantener los componentes pequeños y enfocados**: si un componente hace demasiado, dividirlo.
- **Props opcionales con `?` y valor por defecto**: hace los componentes mas flexibles sin sacrificar seguridad de tipos.
- **No mutar las props**: si se necesita derivar un valor de una prop, calcularlo con una variable local dentro del componente.

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| `Cannot read properties of undefined` | Prop requerida no fue pasada | Agregar `?` para hacerla opcional o asegurarse de pasarla |
| Los estilos de un componente afectan a otro | Usar CSS global con nombres repetidos | Migrar a CSS Modules o namespaces en los nombres de clase |
| `Type 'X' is not assignable to type 'Y'` | La prop recibe un tipo incorrecto | Revisar la interfaz y el valor que se esta pasando |
| Children no aparece en pantalla | Se olvido incluir `{children}` en el JSX | Agregar `{children}` donde debe renderizarse |

---

## 7. Relacion con el Proyecto Incremental

En este modulo se crea **`ProductCard`**, el componente central de ReactStore. Se construye con:
- Props tipadas: `id`, `title`, `price`, `thumbnail`, `category`
- Badge para mostrar la categoria
- CSS Modules para los estilos

Este componente se usara y evolucionara en todos los modulos siguientes:
- Modulo 4: agregar boton de favorito con estado
- Modulo 5: usarlo en listas con `.map()`
- Modulo 6: recibirlo con datos reales de la API
- Modulo 11: optimizarlo con `React.memo`

> Ver solucion de referencia en: `react/solver/react-store/src/components/ProductCard.tsx`

---

## 8. Notas de Accesibilidad

- Usar `<article>` en lugar de `<div>` para tarjetas de contenido independiente
- Incluir `alt` en todas las imagenes
- Usar `<button>` para acciones, no `<div onClick>`
- El texto del boton debe ser descriptivo: `"Agregar al carrito"` no `"Click aqui"`

---

## 9. Referencias

- [Pasar props a un componente — React Docs](https://react.dev/learn/passing-props-to-a-component)
- [CSS Modules — Vite Docs](https://vite.dev/guide/features#css-modules)
- [TypeScript en React](https://react.dev/learn/typescript)
- [Composicion vs Herencia — React Docs](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
