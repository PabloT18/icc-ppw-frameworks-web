// src/stores/carrito.ts
// A4 — NanoStores: store compartido de carrito

import { computed, map } from 'nanostores';

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
