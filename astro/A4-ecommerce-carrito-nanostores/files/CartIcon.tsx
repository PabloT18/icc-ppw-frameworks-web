// src/components/CartIcon.tsx
// A4 — Isla React: ícono de carrito con conteo reactivo

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
