# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica A1: Islands Architecture e Integraciones

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Integrar React en `astro-campus` y crear una barra de búsqueda interactiva como isla que se comunica con el endpoint `/api/buscar`.

---

## Archivos que se crean / modifican

```
astro-campus/
├── astro.config.mjs           ← MODIFICAR: agregar integration React
└── src/
    ├── components/
    │   └── SearchBar.tsx      ← NUEVO (isla React)
    └── pages/
        └── buscar.astro       ← NUEVO (página de búsqueda)
```

---

## Paso 1: Instalar la integración React

```bash
pnpm astro add react
```

Verificar que `astro.config.mjs` quedó actualizado:

```javascript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  server: { port: 4321 },
});
```

---

## Paso 2: Crear `src/components/SearchBar.tsx`

**¿Qué hace este paso?** Crea el componente React con estado local. Llama al endpoint `/api/buscar` mientras el usuario escribe.

```tsx
// src/components/SearchBar.tsx
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
    if (q.length < 2) {
      setResults([]);
      setMensaje('');
      return;
    }
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
```

---

## Paso 3: Crear `src/pages/buscar.astro`

**¿Qué hace este paso?** Crea una página que embebe la isla de búsqueda con `client:load`.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SearchBar from '../components/SearchBar';
---

<BaseLayout titulo="Buscar" descripcion="Busca entre todos los recursos del campus.">
  <h1>Buscar recursos</h1>
  <p class="intro">Escribe para filtrar los recursos disponibles en tiempo real.</p>

  <SearchBar client:load />
</BaseLayout>

<style is:global>
  .search-widget { max-width: 540px; }
  .search-input {
    background: var(--color-bg-card, #1a1a1a);
    border: 1px solid var(--color-border, #333);
    border-radius: var(--radius-md, 0.5rem);
    color: var(--color-text, #e8e8e8);
    font-size: 1rem;
    padding: 0.6rem 0.8rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .search-input:focus { outline: none; border-color: var(--color-brand, #FF5D01); }
  .search-status { color: var(--color-text-muted, #aaa); font-size: 0.9rem; margin-top: 0.5rem; }
  .search-results { list-style: none; padding: 0; margin-top: 0.75rem; }
  .search-results li {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.6rem 0; border-bottom: 1px solid var(--color-border, #333);
  }
  .search-results a { color: var(--color-text, #e8e8e8); text-decoration: none; flex: 1; }
  .search-results a:hover { color: var(--color-brand, #FF5D01); }
  .cat { font-size: 0.75rem; color: var(--color-text-muted, #aaa); }
</style>
```

---

## Paso 4: TODO — Completar por el estudiante

```tsx
// TODO en SearchBar.tsx:
// Agregar debounce de 300ms para no hacer fetch en cada tecla
// Pista: usar useEffect + setTimeout + clearTimeout
```

```astro
---
// TODO en Header.astro:
// Agregar enlace "Buscar" en la navegación
// O integrar SearchBar directamente en el Header como client:idle
---
```

---

## Validaciones esperadas

- [ ] `pnpm astro add react` completa sin errores
- [ ] La página `/buscar` carga con el input de búsqueda
- [ ] Al escribir 2+ caracteres, se muestran resultados dinámicamente
- [ ] Al escribir 1 carácter, la lista se vacía
- [ ] Los resultados son enlaces a las páginas correctas

---

## Entregables

- `src/components/SearchBar.tsx` funcional
- `src/pages/buscar.astro` con la isla integrada
- `astro.config.mjs` con la integración React
- Captura de la página `/buscar` con resultados visibles

---

## Commits sugeridos

```
feat: add @astrojs/react integration
feat: create SearchBar React island component
feat: add /buscar page with React island (client:load)
```
