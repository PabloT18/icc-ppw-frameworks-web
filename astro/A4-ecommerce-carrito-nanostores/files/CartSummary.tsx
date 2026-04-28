// src/components/CartSummary.tsx
// A4 — Isla React: resumen completo del carrito

import { useStore } from '@nanostores/react';
import { carritoStore, totalPrecio, eliminarDelCarrito } from '../stores/carrito';

export default function CartSummary() {
    const carrito = useStore(carritoStore);
    const total = useStore(totalPrecio);
    const items = Object.values(carrito);

    if (items.length === 0) {
        return (
            <p>
                Tu carrito está vacío.{' '}
                <a href="/productos">Ver productos</a>
            </p>
        );
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
                        <button
                            onClick={() => eliminarDelCarrito(item.id)}
                            aria-label={`Eliminar ${item.nombre}`}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
            <p className="cart-total">
                <strong>Total: ${total.toFixed(2)}</strong>
            </p>
        </div>
    );
}
