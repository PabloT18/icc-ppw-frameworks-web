# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica A4: E-commerce — Carrito con NanoStores

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Agregar un carrito de compras a `astro-campus` usando NanoStores para compartir estado entre múltiples islas React.

---

## Archivos que se crean / modifican

```
astro-campus/
└── src/
    ├── stores/
    │   └── carrito.ts          ← NUEVO
    ├── components/
    │   ├── CartIcon.tsx         ← NUEVO (isla React en Header)
    │   ├── AddToCartButton.tsx  ← NUEVO (isla React en productos)
    │   └── CartSummary.tsx      ← NUEVO (isla React en /carrito)
    └── pages/
        ├── productos/
        │   └── [slug].astro     ← NUEVO
        └── carrito.astro        ← NUEVO
```

---

## Paso 1: Instalar NanoStores

```bash
pnpm add nanostores @nanostores/react
```

---

## Paso 2: Crear `src/stores/carrito.ts`

**¿Qué hace este paso?** Define el store compartido. Toda isla que lo importe tendrá el mismo estado reactivo.

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
  Object.values(carrito).reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  )
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

---

## Paso 3: Crear `src/components/CartIcon.tsx`

**¿Qué hace este paso?** Isla del header que muestra el número de items del carrito en tiempo real.

```tsx
// src/components/CartIcon.tsx
import { useStore } from '@nanostores/react';
import { totalItems } from '../stores/carrito';

export default function CartIcon() {
  const count = useStore(totalItems);

  return (
    <a href="/carrito" className="cart-icon" aria-label={`Carrito: ${count} items`}>
      <span>🛒</span>
      {count > 0 && (
        <span className="cart-badge" aria-hidden="true">{count}</span>
      )}
    </a>
  );
}
```

---

## Paso 4: Crear `src/components/AddToCartButton.tsx`

**¿Qué hace este paso?** Botón que agrega un producto al store del carrito.

```tsx
// src/components/AddToCartButton.tsx
import { agregarAlCarrito } from '../stores/carrito';

interface Props {
  id:     string;
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

---

## Paso 5: Crear `src/pages/carrito.astro`

**¿Qué hace este paso?** Página que muestra el contenido actual del carrito, usando una isla React.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CartSummary from '../components/CartSummary';
---

<BaseLayout titulo="Carrito" descripcion="Tu selección de productos.">
  <h1>🛒 Tu carrito</h1>
  <CartSummary client:load />
</BaseLayout>
```

---

## Paso 6: Crear `src/components/CartSummary.tsx`

```tsx
// src/components/CartSummary.tsx
import { useStore } from '@nanostores/react';
import { carritoStore, totalPrecio, eliminarDelCarrito } from '../stores/carrito';

export default function CartSummary() {
  const carrito  = useStore(carritoStore);
  const total    = useStore(totalPrecio);
  const items    = Object.values(carrito);

  if (items.length === 0) {
    return <p>Tu carrito está vacío. <a href="/productos">Ver productos</a></p>;
  }

  return (
    <div>
      <ul className="cart-list">
        {items.map(item => (
          <li key={item.id} className="cart-item">
            <span className="cart-item-nombre">{item.nombre}</span>
            <span className="cart-item-qty">× {item.cantidad}</span>
            <span className="cart-item-precio">
              ${(item.precio * item.cantidad).toFixed(2)}
            </span>
            <button onClick={() => eliminarDelCarrito(item.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p className="cart-total"><strong>Total: ${total.toFixed(2)}</strong></p>
    </div>
  );
}
```

---

## Paso 7: TODO — Completar por el estudiante

```typescript
// TODO en src/stores/carrito.ts:
// Persistir el carrito en localStorage para que no se pierda al recargar
// Pista: suscribirse al store con carritoStore.subscribe()
// y cargar el valor inicial con localStorage.getItem() en el lado cliente
```

```tsx
// TODO en CartIcon.tsx:
// Agregar animación cuando count cambia
// Pista: usar useEffect para detectar cambio y aplicar clase CSS temporalmente
```

---

## Validaciones esperadas

- [ ] El ícono del carrito en el Header muestra el número de items
- [ ] Agregar productos en `/productos` incrementa el counter del Header en tiempo real
- [ ] `/carrito` lista los productos agregados con sus cantidades
- [ ] Eliminar un item del carrito actualiza el total correctamente
- [ ] El estado es consistente entre la página de productos y la página del carrito

---

## Entregables

- `src/stores/carrito.ts` con el store y funciones helper
- `src/components/CartIcon.tsx`, `AddToCartButton.tsx`, `CartSummary.tsx`
- `src/pages/carrito.astro`
- Captura del carrito con al menos 2 productos distintos

---

## Commits sugeridos

```
feat: add nanostores cart store
feat: add CartIcon React island to Header
feat: add AddToCartButton React island
feat: add CartSummary component and /carrito page
```
