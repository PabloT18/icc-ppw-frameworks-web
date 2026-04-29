# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo A1: Islands Architecture e Integraciones

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

La Arquitectura de Islas (Islands Architecture) es el patrón central de Astro: el HTML se renderiza en el servidor, y solo los componentes que explícitamente lo necesitan reciben JavaScript en el cliente. El resultado son páginas ultra-rápidas donde solo las partes interactivas "se hidratan".

---

## 2. Conceptos Clave

### Directivas de cliente

| Directiva | Cuándo se hidrata | Caso de uso |
|-----------|------------------|-------------|
| `client:load` | Inmediatamente al cargar la página | Elementos críticos: menú, buscador |
| `client:idle` | Cuando el navegador está libre | Widgets secundarios |
| `client:visible` | Cuando el componente entra al viewport | Contenido "below the fold" |
| `client:only="react"` | Solo en cliente, sin SSR del componente | Componentes que usan APIs del navegador |
| `client:media="(max-width: 600px)"` | Solo cuando la media query es verdadera | Componentes móviles |

### Sin directiva = sin JavaScript

```astro
<!-- Solo HTML estático — sin JS enviado al cliente -->
<MiComponenteReact />

<!-- Con hidratación inmediata — JS se descarga y ejecuta -->
<MiComponenteReact client:load />
```

---

## 3. Explicación

### Integrar React en Astro

```bash
pnpm astro add react
```

Esto modifica `astro.config.mjs` automáticamente:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

### Componente React como isla

```tsx
// src/components/Counter.tsx
import { useState } from 'react';

interface Props {
  inicial?: number;
}

export default function Counter({ inicial = 0 }: Props) {
  const [count, setCount] = useState(inicial);

  return (
    <div className="counter">
      <button onClick={() => setCount(c => c - 1)}>−</button>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

```astro
---
// Página Astro usando el componente React
import Counter from '../components/Counter';
---

<!-- Sin JS: solo HTML renderizado -->
<Counter inicial={5} />

<!-- Con hidratación cuando sea visible -->
<Counter inicial={5} client:visible />
```

### Pasar datos del servidor a la isla

```astro
---
const recursos = await fetch('/api/recursos').then(r => r.json());
---

<!-- Props se pasan como HTML serializable -->
<MiIslaReact recursos={recursos} client:load />
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Search island con React

```tsx
// src/components/SearchBar.tsx
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscar(q: string) {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    const res = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.resultados ?? []);
    setLoading(false);
  }

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={e => { setQuery(e.target.value); buscar(e.target.value); }}
        placeholder="Buscar recursos…"
      />
      {loading && <p>Buscando…</p>}
      <ul>
        {results.map((r: { slug: string; titulo: string }) => (
          <li key={r.slug}><a href={`/recursos/${r.slug}`}>{r.titulo}</a></li>
        ))}
      </ul>
    </div>
  );
}
```

```astro
---
import SearchBar from '../components/SearchBar';
---

<!-- Se hidrata inmediatamente — el usuario puede escribir -->
<SearchBar client:load />
```

---

## 5. Buenas Prácticas

- Usar `client:load` solo para elementos críticos visibles inmediatamente.
- Preferir `client:visible` para contenido que aparece más abajo en la página.
- `client:idle` para widgets que pueden esperar (chats, recomendaciones).
- Mantener las islas pequeñas: solo el componente que necesita estado.
- No hidratar componentes puramente visuales/estáticos.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Componente React sin JS | Falta directiva `client:*` | Agregar `client:load` o similar |
| Hydration mismatch | El HTML del servidor difiere del cliente | Evitar `Date.now()` o `Math.random()` en render |
| `window is not defined` | Código del navegador ejecutado en SSR | Usar `client:only="react"` o guardar en `useEffect` |
| React no instalado | Integration faltante | `pnpm astro add react` |

---

## 7. Relación con el Proyecto Incremental

En este módulo complementario, `astro-campus` añade una barra de búsqueda interactiva como isla React, con hidratación `client:load` y comunicación con el endpoint `/api/buscar` del módulo 10.

---

## 8. Recursos

- [Islands Architecture](https://docs.astro.build/es/concepts/islands/)
- [React Integration](https://docs.astro.build/es/guides/integrations-guide/react/)
- [Directivas de cliente](https://docs.astro.build/es/reference/directives-reference/#client-directives)
- [Patrones de hidratación parcial](https://jasonformat.com/islands-architecture/)
