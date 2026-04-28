# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 6: Efectos y Consumo de APIs con useEffect

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Conectar el proyecto a una API REST real usando el hook `useEffect` junto con la Fetch API. Comprender el ciclo de vida de los efectos, manejar correctamente los estados de carga y error, y organizar el codigo de red en servicios separados.

---

## 2. Explicacion Conceptual

### Que es un efecto?

Un **efecto** en React es cualquier operacion que interactua con el "mundo exterior" al componente: llamadas a APIs, suscripciones a eventos del DOM, timers, etc. React separa la logica de renderizado (pura) de los efectos (impuros).

El hook `useEffect` ejecuta una funcion **despues** de que el componente se renderiza:

```tsx
useEffect(() => {
  // Este codigo se ejecuta despues del render
  document.title = 'Nueva pagina'
}, []) // Array de dependencias
```

### Anatomia de `useEffect`

```tsx
useEffect(
  () => {
    // 1. El efecto: codigo que se ejecuta
    const resultado = hacerAlgo()

    // 2. Funcion de limpieza (opcional): se ejecuta antes del siguiente efecto
    //    y cuando el componente se desmonta
    return () => {
      limpiarAlgo(resultado)
    }
  },
  [dep1, dep2] // 3. Array de dependencias: cuando re-ejecutar el efecto
)
```

### El array de dependencias

Controla **cuando** se vuelve a ejecutar el efecto:

| Array | Comportamiento |
|---|---|
| Sin segundo argumento | Se ejecuta en cada render |
| `[]` (vacio) | Solo al montar el componente (equivale a componentDidMount) |
| `[valor]` | Cada vez que `valor` cambia |
| `[a, b]` | Cada vez que `a` o `b` cambian |

```tsx
// Una vez al montar — ideal para cargar datos iniciales
useEffect(() => {
  fetchProductos()
}, [])

// Cada vez que cambia el id
useEffect(() => {
  fetchProducto(id)
}, [id])

// En cada render — raramente util
useEffect(() => {
  console.log('Renderizado')
})
```

### Fetch de datos con useEffect

El patron estandar para cargar datos de una API:

```tsx
function ProductList() {
  const [productos, setProductos] = useState<Product[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        setError(null)

        const respuesta = await fetch('https://dummyjson.com/products?limit=20')

        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
        }

        const datos = await respuesta.json()
        setProductos(datos.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  if (cargando) return <LoadingSpinner />
  if (error) return <p>Error: {error}</p>

  return <div>{productos.map(p => <ProductCard key={p.id} product={p} />)}</div>
}
```

### Por que no usar `async` directamente en `useEffect`?

```tsx
// ❌ useEffect no puede ser async — React espera que retorne
//    una funcion de limpieza o undefined, no una Promise
useEffect(async () => {
  const datos = await fetch(url)
}, [])

// ✅ Definir la funcion async dentro y llamarla inmediatamente
useEffect(() => {
  const cargar = async () => {
    const datos = await fetch(url)
    // ...
  }
  cargar()
}, [])
```

---

## 3. Fundamento Tecnico

### Variables de entorno en Vite

Las variables de entorno en Vite siguen el prefijo `VITE_` para ser expuestas al cliente:

```bash
# .env
VITE_API_URL=https://dummyjson.com
```

```tsx
// Acceso en el codigo
const API_URL = import.meta.env.VITE_API_URL
```

El objeto `import.meta.env` es inyectado por Vite en tiempo de build. Variables sin prefijo `VITE_` no estan disponibles en el cliente (son privadas del servidor de build).

### Organizacion del codigo de red — servicios

Separar el codigo de fetch en un archivo de servicio evita duplicacion y centraliza la logica de API:

```tsx
// src/services/product.service.ts
const API_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export async function getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
  const respuesta = await fetch(`${API_URL}/products?limit=${limit}&skip=${skip}`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener productos: ${respuesta.status}`)
  }

  return respuesta.json()
}

export async function getProductById(id: number): Promise<Product> {
  const respuesta = await fetch(`${API_URL}/products/${id}`)

  if (!respuesta.ok) {
    throw new Error(`Producto ${id} no encontrado`)
  }

  return respuesta.json()
}
```

### Limpieza de efectos (cleanup)

Cuando un componente se desmonta mientras una peticion esta en curso, puede intentar actualizar el estado de un componente que ya no existe — causando un memory leak. La solucion es usar `AbortController`:

```tsx
useEffect(() => {
  const controller = new AbortController()

  const cargar = async () => {
    try {
      const resp = await fetch(url, { signal: controller.signal })
      const datos = await resp.json()
      setDatos(datos)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return // La peticion fue cancelada intencionalmente, no es un error
      }
      setError('Error al cargar datos')
    }
  }

  cargar()

  return () => controller.abort() // Limpieza: cancelar la peticion
}, [url])
```

---

## 4. Ejemplos de Codigo

### Busqueda con debounce simple

```tsx
function useDatosConBusqueda(busqueda: string) {
  const [datos, setDatos] = useState<Product[]>([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!busqueda) return

    const timer = setTimeout(async () => {
      setCargando(true)
      const resp = await fetch(`https://dummyjson.com/products/search?q=${busqueda}`)
      const json = await resp.json()
      setDatos(json.products)
      setCargando(false)
    }, 300) // Esperar 300ms desde el ultimo keystroke

    return () => clearTimeout(timer) // Limpiar si busqueda cambia antes de 300ms
  }, [busqueda])

  return { datos, cargando }
}
```

---

## 5. Buenas Practicas

- **Centralizar el codigo de fetch en servicios**: `src/services/` — no mezclar logica de red con componentes.
- **Manejar siempre los tres estados**: cargando, error y exito.
- **Verificar `response.ok`**: `fetch` no lanza error en respuestas 4xx/5xx, solo en errores de red.
- **Usar `AbortController` para peticiones cancelables**: especialmente en efectos con dependencias.
- **No olvidar el array de dependencias**: omitirlo causa loops infinitos si el efecto actualiza estado.

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| Loop infinito de renders | El efecto actualiza un estado que es dependencia del efecto | Revisar el array de dependencias |
| `fetch` no lanza error con 404 | `fetch` solo rechaza en errores de red, no HTTP | Verificar `response.ok` antes de leer el cuerpo |
| Warning de memory leak | Actualizar estado despues de desmontar | Usar `AbortController` y verificar si el componente sigue montado |
| Variables de entorno `undefined` | Usar `process.env` en lugar de `import.meta.env` | Cambiar a `import.meta.env.VITE_*` |

---

## 7. Relacion con el Proyecto Incremental

Este es el modulo donde ReactStore se conecta a datos reales por primera vez. Se crea `product.service.ts` y los componentes dejan de usar datos mock. La estructura de estados (cargando/error/exito) definida aqui se usara en los modulos 8 (React Query) y 10 (Context) para mejorarla.

> Ver solucion de referencia en: `react/solver/react-store/src/services/product.service.ts`

---

## 8. La API DummyJSON

La API base es `https://dummyjson.com`. Endpoints relevantes para el proyecto:

| Endpoint | Descripcion |
|---|---|
| `GET /products?limit=20&skip=0` | Lista de productos con paginacion |
| `GET /products/{id}` | Detalle de un producto |
| `GET /products/search?q=phone` | Busqueda por texto |
| `GET /products/categories` | Lista de categorias |
| `GET /products/category/{cat}` | Productos por categoria |

No requiere API Key ni autenticacion para los endpoints de productos.

---

## 9. Referencias

- [useEffect — React Docs](https://react.dev/reference/react/useEffect)
- [Sincronizar con efectos — React Docs](https://react.dev/learn/synchronizing-with-effects)
- [No necesitas un efecto — React Docs](https://react.dev/learn/you-might-not-need-an-effect)
- [Fetch API — MDN](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [DummyJSON API Docs](https://dummyjson.com/docs)
