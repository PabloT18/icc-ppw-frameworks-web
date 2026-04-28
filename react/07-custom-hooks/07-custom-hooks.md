# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 7: Custom Hooks

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Refactorizar la logica de estado y efectos que se repite en los componentes hacia **custom hooks** reutilizables. Un hook personalizado encapsula la logica de interaccion con el estado, los efectos y los servicios, dejando los componentes limpios y enfocados en el renderizado.

---

## 2. Explicacion Conceptual

### Que es un custom hook?

Un **custom hook** es una funcion de JavaScript cuyo nombre empieza con `use` y que puede llamar a otros hooks internamente. No son una API especial de React — son simplemente una convencion para extraer logica reutilizable.

```tsx
// Un custom hook reutiliza la logica de carga de datos
function useProducts() {
  const [productos, setProductos] = useState<Product[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await getProducts()
        setProductos(datos.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  return { productos, cargando, error }
}

// El componente queda limpio — sin logica de fetch
function ProductList() {
  const { productos, cargando, error } = useProducts()

  if (cargando) return <LoadingSpinner />
  if (error) return <p>{error}</p>
  return <div>{productos.map(p => <ProductCard key={p.id} product={p} />)}</div>
}
```

### Por que crear custom hooks?

| Problema | Solucion con custom hook |
|---|---|
| Logica de fetch duplicada en multiples componentes | `useFetch` o `useProducts` reutilizable |
| Componentes con 100+ lineas de logica | Extraer la logica, el componente queda de 20 lineas |
| Dificil de testear la logica de negocio | Los hooks pueden testearse con `renderHook` |
| Cambiar la fuente de datos requiere tocar cada componente | Cambiar solo el hook |

### Reglas de los custom hooks

1. El nombre **debe** empezar con `use` — es como React identifica que es un hook y aplica las reglas
2. Pueden llamar a otros hooks (useState, useEffect, useCallback, etc.)
3. No pueden llamarse condicionalmente dentro del hook — las mismas reglas de hooks aplican
4. Retornan lo que el componente necesita: valores, funciones, o ambos

### Tipos de retorno comunes

```tsx
// Retornar un objeto — mas legible cuando hay multiples valores
function useCounter(inicial = 0) {
  const [cuenta, setCuenta] = useState(inicial)
  return {
    cuenta,
    incrementar: () => setCuenta(prev => prev + 1),
    decrementar: () => setCuenta(prev => prev - 1),
    reiniciar: () => setCuenta(inicial),
  }
}

// Retornar una tupla — cuando el orden importa (similar a useState)
function useToggle(inicial = false): [boolean, () => void] {
  const [valor, setValor] = useState(inicial)
  return [valor, () => setValor(prev => !prev)]
}
```

---

## 3. Fundamento Tecnico

### Hook generico de fetch con AbortController

```tsx
// src/hooks/useFetch.ts
function useFetch<T>(url: string) {
  const [datos, setDatos] = useState<T | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const cargar = async () => {
      try {
        setCargando(true)
        setError(null)
        const resp = await fetch(url, { signal: controller.signal })

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

        const json = await resp.json()
        setDatos(json)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [url])

  return { datos, cargando, error }
}
```

### Hook especifico del dominio

Los hooks especificos del dominio son mas expresivos y encapsulan logica de negocio:

```tsx
// src/hooks/useProducts.ts
function useProducts(limit = 20) {
  const [productos, setProductos] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)
      const datos = await getProducts(limit)
      setProductos(datos.products)
      setTotal(datos.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setCargando(false)
    }
  }, [limit])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { productos, total, cargando, error, recargar: cargar }
}
```

### `useCallback` — memorizar funciones

`useCallback` evita que una funcion se recree en cada render. Es util cuando la funcion se pasa como prop o es dependencia de un `useEffect`:

```tsx
// Sin useCallback — nueva referencia en cada render
const buscar = async (q: string) => {
  const datos = await searchProducts(q)
  setProductos(datos.products)
}

// Con useCallback — misma referencia si las dependencias no cambian
const buscar = useCallback(async (q: string) => {
  const datos = await searchProducts(q)
  setProductos(datos.products)
}, []) // Sin dependencias — la funcion nunca cambia
```

### Separacion de archivos — convencion

```
src/
└── hooks/
    ├── useProducts.ts      — carga y filtrado de productos
    ├── useCategories.ts    — carga de categorias
    ├── useFavorites.ts     — logica de favoritos
    └── useLocalStorage.ts  — persistencia en localStorage
```

---

## 4. Ejemplos de Codigo

### `useLocalStorage` — persistencia sin Backend

```tsx
function useLocalStorage<T>(key: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : valorInicial
    } catch {
      return valorInicial
    }
  })

  const guardar = useCallback((nuevoValor: T) => {
    setValor(nuevoValor)
    localStorage.setItem(key, JSON.stringify(nuevoValor))
  }, [key])

  return [valor, guardar] as const
}

// Uso:
const [favoritos, setFavoritos] = useLocalStorage<number[]>('favoritos', [])
```

---

## 5. Buenas Practicas

- **Un archivo por hook**: `useProducts.ts`, no mezclar varios hooks en un archivo.
- **Nombres descriptivos**: `useProducts`, `useFavorites`, no `useData` o `useHook`.
- **Retornar objetos con nombre** (no tuplas) cuando hay mas de 2 valores — facilita la lectura.
- **No abusar de custom hooks**: extraer logica de 3+ lineas repetidas, no cada `useState` individual.
- **Documentar el contrato del hook**: que recibe y que retorna.

---

## 6. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| `Invalid hook call` | El nombre no empieza con `use` o se llama en un contexto no-hook | Verificar el nombre y que se llame desde un componente |
| El efecto se ejecuta en loop | `useCallback` sin dependencias correctas | Revisar las dependencias del `useCallback` que se usa como dep del `useEffect` |
| Datos compartidos entre instancias | El hook tiene estado que no deberia ser compartido | Cada llamada al hook crea su propio estado — es correcto por diseno |

---

## 7. Relacion con el Proyecto Incremental

En este modulo se extraen `useProducts` y `useCategories` de `App.tsx`. El componente queda con solo logica de UI (filtrado local, estado de busqueda). En el modulo 10 (TanStack Query) los hooks se simplifican drasticamente al delegar el cache y el estado de carga a la libreria.

> Ver solucion de referencia en: `react/solver/react-store/src/hooks/useProducts.ts`

---

## 8. Referencias

- [Reutilizar logica con custom hooks — React Docs](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [useCallback — React Docs](https://react.dev/reference/react/useCallback)
- [Guia de custom hooks — React Docs](https://react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)
