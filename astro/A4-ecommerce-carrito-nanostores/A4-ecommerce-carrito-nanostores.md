# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo A4: E-commerce — Carrito con NanoStores

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Las islas de Astro son componentes independientes. Cuando necesitas que varias islas compartan estado (por ejemplo, el carrito de compras visible en el header y en la página de producto al mismo tiempo), necesitas una solución de estado compartido. **NanoStores** es la librería recomendada por Astro para esto: extremadamente liviana (~300 bytes) y compatible con React, Vue, Svelte y Solid.

---

## 2. Conceptos Clave

### NanoStores primitivos

| Primitivo | Uso | API |
|-----------|-----|-----|
| `atom` | Valor simple | `atom(inicial)`, `.get()`, `.set(valor)` |
| `map` | Objeto con claves | `map({})`, `.setKey(k, v)`, `.get()` |
| `computed` | Derivado de otro store | `computed(store, fn)` |

### Patrón carrito de compras

```
atom/map en stores/carrito.ts
         ↓
   CartIcon.tsx (React island) — muestra el count
         ↓                                ↓
   ProductCard.tsx — botón "Agregar al carrito"
```

Todas las islas que importan el mismo store comparten el mismo estado — sin `props drilling`, sin context.

---

## 3. Explicación Técnica

### Instalación

```bash
pnpm add nanostores @nanostores/react
```

### Definir el store

```typescript
// src/stores/carrito.ts
import { map, computed } from 'nanostores';

export interface ItemCarrito {
  id:       string;
  nombre:   string;
  precio:   number;
  cantidad: number;
}

export const carritoStore = map<Record<string, ItemCarrito>>({});

export const totalItems = computed(carritoStore, carrito =>
  Object.values(carrito).reduce((sum, item) => sum + item.cantidad, 0)
);

export const totalPrecio = computed(carritoStore, carrito =>
  Object.values(carrito).reduce((sum, item) => sum + item.precio * item.cantidad, 0)
);

export function agregarAlCarrito(item: Omit<ItemCarrito, 'cantidad'>) {
  const actual = carritoStore.get()[item.id];
  carritoStore.setKey(item.id, {
    ...item,
    cantidad: (actual?.cantidad ?? 0) + 1,
  });
}

export function eliminarDelCarrito(id: string) {
  const estado = { ...carritoStore.get() };
  delete estado[id];
  carritoStore.set(estado);
}
```

### Usar el store en un componente React

```tsx
// src/components/CartIcon.tsx
import { useStore } from '@nanostores/react';
import { totalItems } from '../stores/carrito';

export default function CartIcon() {
  const count = useStore(totalItems);

  return (
    <a href="/carrito" aria-label={`Ver carrito (${count} items)`}>
      🛒 {count > 0 && <span className="badge">{count}</span>}
    </a>
  );
}
```

---

## 4. Ejemplos de Código

### Botón "Agregar al carrito" en React

```tsx
// src/components/AddToCartButton.tsx
import { agregarAlCarrito } from '../stores/carrito';

interface Props {
  id: string;
  nombre: string;
  precio: number;
}

export default function AddToCartButton({ id, nombre, precio }: Props) {
  return (
    <button
      onClick={() => agregarAlCarrito({ id, nombre, precio })}
      className="btn-agregar"
    >
      Agregar al carrito
    </button>
  );
}
```

### Página de carrito en Astro

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CartSummary from '../components/CartSummary';
---

<BaseLayout titulo="Carrito de Compras">
  <h1>🛒 Tu carrito</h1>
  <CartSummary client:load />
</BaseLayout>
```

---

## 5. Buenas Prácticas

- Definir toda la lógica de mutación del store en funciones exportadas (no en los componentes).
- Usar `computed` para derivar totales — evitar calcularlos en cada render.
- Los stores de NanoStores son singletons: un solo archivo, múltiples consumidores.
- Para persistencia entre recargas, sincronizar con `localStorage` en `useEffect`.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Estado no compartido entre islas | Cada isla importa una instancia distinta | Asegurar que todas importan del mismo path |
| `useStore` no reacciona | Import de `atom` en lugar de store — o falta `client:*` | Verificar la directiva de hidratación |
| Carrito se vacía en recarga | Sin persistencia localStorage | Sincronizar en `useEffect` |
| Error de hidratación | Store initializa diferente en servidor | Inicializar con valor vacío consistente |

---

## 7. Relación con el Proyecto Incremental

En este módulo complementario, `astro-campus` añade un mini e-commerce con:

- Store de carrito con NanoStores.
- `CartIcon` en el Header como isla React.
- Páginas de productos con botón "Agregar al carrito".
- Página `/carrito` con el resumen del pedido.

---

## 8. Recursos

- [NanoStores en Astro](https://docs.astro.build/es/recipes/sharing-state-islands/)
- [NanoStores GitHub](https://github.com/nanostores/nanostores)
- [@nanostores/react](https://github.com/nanostores/react)
- [Sharing State Between Islands](https://docs.astro.build/es/recipes/sharing-state-islands/)
