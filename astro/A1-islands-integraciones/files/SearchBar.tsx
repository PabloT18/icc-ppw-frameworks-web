// src/components/SearchBar.tsx
// A1 — Isla React: barra de búsqueda interactiva

import { useState } from 'react';

interface Resultado {
    slug: string;
    titulo: string;
    categoria: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Resultado[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');

    async function buscar(q: string) {
        setQuery(q);
        if (q.length < 2) { setResults([]); setMensaje(''); return; }
        setLoading(true);
        try {
            const res = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.resultados ?? []);
            setMensaje(data.resultados?.length === 0 ? 'Sin resultados.' : '');
        } catch {
            setMensaje('Error al buscar. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="search-widget">
            <input
                type="search"
                value={query}
                onChange={e => buscar(e.target.value)}
                placeholder="Buscar recursos… (mín. 2 caracteres)"
                aria-label="Buscar recursos"
                className="search-input"
            />
            {loading && <p className="search-status">Buscando…</p>}
            {mensaje && <p className="search-status">{mensaje}</p>}
            {results.length > 0 && (
                <ul className="search-results">
                    {results.map(r => (
                        <li key={r.slug}>
                            <a href={`/recursos/${r.slug}`}>{r.titulo}</a>
                            <span className="cat">{r.categoria}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
