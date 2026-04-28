# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 11: Consumo de Datos y Cache con TanStack Query

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Reemplazar los custom hooks de fetch manuales por TanStack Query (anteriormente React Query). Comprender la gestion automatica de cache, estados de carga y error, refetch automatico, invalidacion de queries y el patron `useMutation` para operaciones de escritura.

---

## 2. Explicacion Conceptual

### El problema con `useEffect` + `useState` para fetch

El patron manual del modulo 6 y 7 funciona, pero tiene problemas:

- **No hay cache**: al navegar de vuelta a una pagina, los datos se vuelven a pedir
- **No hay deduplicacion**: si dos componentes piden los mismos datos al mismo tiempo, se hacen dos peticiones
- **Gestion de estado manual**: `cargando`, `error`, `datos` deben definirse y sincronizarse manualmente
- **Sin refetch automatico**: si el usuario pierde y recupera la conexion, los datos no se actualizan

TanStack Query resuelve todo esto con un sistema de cache basado en **query keys**.

### Arquitectura de TanStack Query

```
QueryClient (cache global)
├── query ['products', 30]          → datos cacheados por N minutos
├── query ['product', 42]           → dato individual cacheado
└── query ['categories']            → lista de categorias cacheada
```

Cuando un componente llama `useQuery({ queryKey: ['products', 30], ... })`, la libreria:
1. Revisa si ya tiene datos frescos en cache — si los tiene, los devuelve inmediatamente
2. Si no tiene o estan "stale" (vencidos), hace el fetch
3. Multiples componentes que pidan la misma key comparten el mismo fetch

---

## 3. Fundamento Tecnico

### Setup inicial

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos — datos "frescos" por 5 min
      retry: 2,                  // reintentar 2 veces en caso de error
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
)
```

### useQuery — consultas de lectura

```tsx
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/services/product.service'

function useProducts(limit = 30) {
  return useQuery({
    queryKey: ['products', limit],        // cache key — incluir parametros variables
    queryFn: () => getProducts(limit),    // funcion que retorna la promesa
    staleTime: 1000 * 60 * 5,            // sobrescribir el default si es necesario
  })
}
```

El hook retorna:
- `data` — los datos cuando la query tiene exito
- `isLoading` — true la primera vez que no hay cache
- `isFetching` — true cada vez que hay una peticion activa (incluso con cache)
- `isError` — true si hubo error
- `error` — el objeto de error
- `refetch` — funcion para refrescar manualmente

### staleTime vs gcTime

| Propiedad | Descripcion |
|---|---|
| `staleTime` | Tiempo que los datos se consideran "frescos". Durante este tiempo no se refetcha. Default: 0 |
| `gcTime` | Tiempo que los datos permanecen en cache aunque no haya subscriptores. Default: 5 minutos |

```tsx
// Datos que cambian poco — cachear por 10 minutos
useQuery({ queryKey: ['categories'], queryFn: getCategories, staleTime: 1000 * 60 * 10 })

// Datos que cambian frecuentemente — refetch cada vez
useQuery({ queryKey: ['notifications'], queryFn: getNotifications, staleTime: 0 })
```

### useMutation — operaciones de escritura

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nuevoProducto: Partial<Product>) =>
      fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      }).then(r => r.json()),

    onSuccess: () => {
      // Invalidar la cache de productos — fuerza un refetch
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Uso:
const { mutate, isPending } = useCreateProduct()
<button disabled={isPending} onClick={() => mutate({ title: 'Nuevo', price: 99 })}>
  {isPending ? 'Guardando...' : 'Crear producto'}
</button>
```

### Query keys como identificadores

Las query keys deben ser **unicas y descriptivas**. Se recomienda usar arrays:

```tsx
['products']                    // lista general
['products', { limit: 30 }]    // lista con params
['product', 42]                 // detalle de id 42
['products', 'search', 'phone'] // busqueda especifica
['categories']                  // categorias
```

---

## 4. DevTools de TanStack Query

```bash
pnpm add @tanstack/react-query-devtools
```

```tsx
// App.tsx o main.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Al final del arbol de la app (solo en desarrollo)
<ReactQueryDevtools initialIsOpen={false} />
```

Muestra en tiempo real: queries activas, datos cacheados, tiempo hasta que vencen, estado (fresh/stale/fetching/error).

---

## 5. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| `No QueryClient set` | Componente fuera de `QueryClientProvider` | Envolver la app en `QueryClientProvider` en `main.tsx` |
| Los datos se piden en cada navegacion | `staleTime` es 0 (default) | Configurar `staleTime` en `defaultOptions` o en cada query |
| `data` es `undefined` aunque haya datos | Desestructurar antes de que la query termine | Usar `data ?? []` o verificar `isLoading` primero |
| Mutacion no actualiza la UI | No se invalida la cache despues del exito | Llamar `queryClient.invalidateQueries` en `onSuccess` |

---

## 6. Relacion con el Proyecto Incremental

En este modulo los hooks `useProducts` y `useCategories` del modulo 7 se reemplazan con `useQuery`. La pagina de detalle del producto tambien usa `useQuery` con `['product', id]` en lugar de un `useEffect` manual. El resultado visible para el usuario: navegacion instantanea al volver a paginas ya visitadas.

> Ver solucion de referencia en: `react/solver/react-store/src/hooks/useProductsQuery.ts`

---

## 7. Referencias

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [useQuery — TanStack Query](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
- [useMutation — TanStack Query](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
- [Query Keys — TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
