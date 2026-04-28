# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 6: Efectos y Consumo de APIs con useEffect

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Conectar ReactStore a la API real de DummyJSON. Reemplazar los datos mock con datos reales, organizar el codigo de fetch en un servicio, y manejar correctamente los estados de carga y error en los componentes.

---

## Contexto de la Practica

Este modulo es el punto de inflexion del proyecto: dejar los datos hardcoded y consumir una API real. Los componentes `LoadingSpinner` y `EmptyState` del modulo anterior cobran su pleno sentido aqui.

**Estado del proyecto al inicio de esta practica:**
- `src/components/ProductList.tsx` con early return para cargando/vacio
- `src/components/LoadingSpinner.tsx` y `EmptyState.tsx`
- `src/App.tsx` con array mock de productos

---

## Archivos que se van a crear o modificar

```
react-store/
├── .env                                    (nuevo — variables de entorno)
├── src/
│   ├── App.tsx                             (modificado — usar servicio)
│   ├── types/
│   │   └── product.types.ts                (modificado — agregar ProductsResponse)
│   └── services/
│       └── product.service.ts              (nuevo — desde files/)
```

---

## Paso 1: Crear el archivo `.env`

**(copiar)**

En la raiz del proyecto `react-store/`, crear el archivo `.env`:

```bash
VITE_API_URL=https://dummyjson.com
```

**¿Que hace este codigo?**
- Vite inyecta las variables con prefijo `VITE_` en el codigo del cliente
- El archivo `.env` no se sube al repositorio — agregar `.env` al `.gitignore`
- Si la variable no esta definida, el codigo del servicio usara un valor por defecto

---

## Paso 2: Actualizar `.gitignore`

**(verificar)**

Verificar que `.gitignore` incluye `.env`. Vite lo agrega automaticamente al crear el proyecto con el template. Si no esta presente, agregar la linea:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

---

## Paso 3: Ampliar los tipos

**(copiar)**

Modificar `src/types/product.types.ts` para agregar el tipo de respuesta de la API:

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

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}
```

**¿Que hace este codigo?**
- `ProductsResponse` representa el sobre (wrapper) que DummyJSON retorna: `{ products: [...], total: 100, skip: 0, limit: 20 }`
- Tiparlo explicitamente permite que TypeScript valide que se accede al campo correcto (`datos.products`, no `datos`)

---

## Paso 4: Crear el servicio de productos

**(copiar — desde `files/product.service.ts`)**

Crear `src/services/product.service.ts`:

```ts
import type { Product, ProductsResponse } from '@/types/product.types'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

export async function getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
  const respuesta = await fetch(
    `${API_URL}/products?limit=${limit}&skip=${skip}`
  )

  if (!respuesta.ok) {
    throw new Error(`Error al obtener productos: ${respuesta.status} ${respuesta.statusText}`)
  }

  return respuesta.json()
}

export async function getProductById(id: number): Promise<Product> {
  const respuesta = await fetch(`${API_URL}/products/${id}`)

  if (!respuesta.ok) {
    throw new Error(`Producto ${id} no encontrado: ${respuesta.status}`)
  }

  return respuesta.json()
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const respuesta = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}`
  )

  if (!respuesta.ok) {
    throw new Error(`Error al buscar "${query}": ${respuesta.status}`)
  }

  return respuesta.json()
}

export async function getCategories(): Promise<string[]> {
  const respuesta = await fetch(`${API_URL}/products/categories`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener categorias: ${respuesta.status}`)
  }

  const categorias: Array<{ slug: string; name: string; url: string }> = await respuesta.json()
  return categorias.map(c => c.slug)
}
```

**¿Que hace este codigo?**
- `import.meta.env.VITE_API_URL` — forma correcta de acceder a variables de entorno en Vite
- `?? 'https://dummyjson.com'` — valor de respaldo si la variable no esta definida
- `respuesta.ok` verifica que el codigo HTTP sea 2xx — `fetch` no lanza por si solo en 4xx/5xx
- `encodeURIComponent(query)` previene inyeccion en la URL si la busqueda tiene caracteres especiales
- Las categorias de DummyJSON v2 vienen como objetos `{ slug, name, url }`, por eso se extrae solo el `slug`

---

## Paso 5: Conectar `App` con datos reales

**(completar)**

Reemplazar el contenido de `src/App.tsx` para usar el servicio:

```tsx
import { useState, useEffect } from 'react'
import ProductList from '@/components/ProductList'
import { getProducts, getCategories } from '@/services/product.service'
import type { Product } from '@/types/product.types'

function App() {
  const [productos, setProductos] = useState<Product[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('todas')

  // TODO 5.1: Usar useEffect para llamar a getProducts() al montar el componente
  // Recuerda: manejar cargando, error, y el array de dependencias vacio
  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        setError(null)

        // TODO 5.2: Llamar a getProducts() y guardar los productos en el estado
        // const datos = await getProducts()
        // setProductos(...)
        const datos = await getProducts(30)
        setProductos(datos.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos')
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [])

  // TODO 5.3: Agregar un segundo useEffect para cargar las categorias
  useEffect(() => {
    getCategories()
      .then(cats => setCategorias(['todas', ...cats]))
      .catch(() => setCategorias(['todas']))
  }, [])

  // Estado derivado — filtrar productos sin nuevo useState
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

      {categorias.length > 1 && (
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
      )}

      <main style={{ padding: '2rem' }}>
        <ProductList
          productos={productosFiltrados}
          cargando={cargando}
          busqueda={busqueda}
        />
      </main>
    </div>
  )
}

export default App
```

**¿Que hace este codigo?**
- `useEffect(() => { ... }, [])` con array vacio se ejecuta una sola vez al montar
- El patron `try/catch/finally` garantiza que `setCargando(false)` se llame incluso si hay error
- `getCategories` tiene su propio `useEffect` independiente — las dos peticiones corren en paralelo
- El filtrado es estado derivado calculado en cada render sin nuevo `useState`

> Captura pendiente: la grilla con productos reales de DummyJSON (miniaturas con fondos blancos, titulos en ingles, precios en dolares).

---

## Paso 6: Verificar en DevTools

**(verificar)**

Abrir DevTools (F12) → pestaña Network:

1. Recargar la pagina
2. Verificar que aparece la peticion a `dummyjson.com/products?limit=30`
3. Ver que el codigo de respuesta es `200`
4. Revisar la respuesta JSON — el array `products` dentro del objeto

> Captura pendiente: DevTools Network mostrando la peticion GET a DummyJSON con status 200 y la respuesta JSON expandida.

---

## Validaciones Esperadas

- [ ] Al cargar la app, aparece el spinner por un momento antes de los productos
- [ ] Se muestran 30 productos reales de DummyJSON
- [ ] Las categorias se cargan dinamicamente desde la API
- [ ] El buscador funciona sobre los datos reales
- [ ] El filtro de categoria funciona con las categorias reales
- [ ] Si se desconecta internet y se recarga, aparece el mensaje de error con boton "Reintentar"
- [ ] No hay datos mock en el codigo

---

## Entregables

- `.env` con `VITE_API_URL`
- `src/types/product.types.ts` con `ProductsResponse`
- `src/services/product.service.ts` con funciones de fetch
- `src/App.tsx` usando `useEffect` y el servicio

---

## Commits Sugeridos

```bash
git commit -m "chore: agregar variable de entorno VITE_API_URL"
git commit -m "feat: crear servicio product.service.ts con funciones de fetch"
git commit -m "feat: conectar App a DummyJSON con useEffect"
```
