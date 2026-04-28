# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 08: Interactividad y localStorage

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Astro genera HTML estático por defecto, pero los sitios reales necesitan interactividad: toggles, formularios dinámicos, estado persistente. El tag `<script>` de Astro permite añadir JavaScript del lado del cliente de forma controlada y organizada, sin necesidad de un framework completo.

Este módulo cubre scripting del lado del cliente en Astro, manejo de eventos DOM, localStorage para persistencia de estado simple, y la integración del script con el HTML renderizado por el servidor.

---

## 2. Conceptos Clave

### `<script>` en Astro

```astro
<script>
  // Este código se ejecuta en el navegador
  // Astro lo procesa con Vite (TypeScript, imports, tree-shaking)
  const btn = document.querySelector('#mi-btn');
  btn?.addEventListener('click', () => console.log('clic'));
</script>
```

#### Diferencias con `<script>` HTML normal

| Aspecto | `<script>` en Astro | `<script>` HTML |
|---------|:---:|:---:|
| Procesado por Vite | Sí | No |
| TypeScript | Sí | No |
| Imports ES | Sí | No |
| Se bundlea | Sí (una vez por página) | Por cada uso |
| Scoped | No (es global) | No |

#### Directiva `is:inline`

```astro
<script is:inline>
  // No procesado por Vite, emitido tal cual
  // Útil para código que debe ejecutarse inmediatamente (ej: leer localStorage antes del render)
  document.documentElement.dataset.theme = localStorage.getItem('theme') ?? 'dark';
</script>
```

### localStorage

```javascript
// Guardar
localStorage.setItem('clave', JSON.stringify(valor));

// Leer
const valor = JSON.parse(localStorage.getItem('clave') ?? 'null');

// Eliminar
localStorage.removeItem('clave');

// Verificar existencia
const existe = localStorage.getItem('clave') !== null;
```

---

## 3. Explicación Técnica

### Patrón: selector seguro con TypeScript

```typescript
// En un <script> de Astro con TypeScript
const btn = document.querySelector<HTMLButtonElement>('#favorito-btn');
if (!btn) throw new Error('Botón de favoritos no encontrado');

btn.addEventListener('click', () => {
  const slug = btn.dataset.slug ?? '';
  toggleFavorito(slug);
});
```

### Patrón: favoritos en localStorage

```typescript
const STORAGE_KEY = 'campus-favoritos';

function getFavoritos(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function toggleFavorito(slug: string): boolean {
  const favs = getFavoritos();
  const idx = favs.indexOf(slug);
  if (idx === -1) {
    favs.push(slug);
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  return idx === -1; // true si se agregó, false si se eliminó
}
```

### Patrón: sincronizar UI con estado

```astro
---
// El componente recibe los datos del servidor
const { slug, titulo } = Astro.props;
---

<button id="fav-btn" data-slug={slug} class="btn-fav" aria-label="Agregar a favoritos">
  ☆
</button>

<script>
  // El script actualiza la UI basándose en localStorage
  const btn = document.querySelector<HTMLButtonElement>('[data-slug]');
  if (btn) {
    const slug = btn.dataset.slug!;
    const favs: string[] = JSON.parse(localStorage.getItem('campus-favoritos') ?? '[]');
    
    const update = () => {
      const esFav = favs.includes(slug);
      btn.textContent = esFav ? '★' : '☆';
      btn.setAttribute('aria-label', esFav ? 'Quitar de favoritos' : 'Agregar a favoritos');
      btn.classList.toggle('activo', esFav);
    };

    update(); // Estado inicial
    
    btn.addEventListener('click', () => {
      const idx = favs.indexOf(slug);
      if (idx === -1) favs.push(slug); else favs.splice(idx, 1);
      localStorage.setItem('campus-favoritos', JSON.stringify(favs));
      update();
    });
  }
</script>
```

---

## 4. Ejemplos de Código

### Ejemplo 1: Contador con localStorage

```astro
---
// src/components/ContadorVisitas.astro
---
<div class="contador">
  <span>Visitas a esta página:</span>
  <strong id="visitas">0</strong>
</div>

<script>
  const el = document.querySelector<HTMLElement>('#visitas');
  if (el) {
    const key = `visitas-${window.location.pathname}`;
    const actual = parseInt(localStorage.getItem(key) ?? '0') + 1;
    localStorage.setItem(key, String(actual));
    el.textContent = String(actual);
  }
</script>
```

### Ejemplo 2: Toggle de tema

```astro
---
// src/components/ThemeToggle.astro
---
<button id="theme-btn" aria-label="Cambiar tema">🌙</button>

<script is:inline>
  // is:inline para que se ejecute antes del render
  const btn = document.querySelector('#theme-btn');
  const html = document.documentElement;
  const stored = localStorage.getItem('theme') ?? 'dark';
  html.dataset.theme = stored;
  if (btn) btn.textContent = stored === 'dark' ? '🌙' : '☀️';

  btn?.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '🌙' : '☀️';
  });
</script>
```

---

## 5. Buenas Prácticas

- Usar `querySelector<TipoHTMLElement>` para tipado seguro en scripts TypeScript.
- Envolver `JSON.parse` de localStorage en `try/catch` — puede haber datos corruptos.
- Inicializar la UI desde localStorage **antes** del primer render visible (usar `is:inline` para evitar el parpadeo).
- Usar `data-*` attributes para pasar datos del servidor al script del cliente.
- Limpiar event listeners en componentes que se renderizan múltiples veces (o usar `{ once: true }`).

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `localStorage is not defined` | Script ejecutándose en SSR | Envolver en `if (typeof localStorage !== 'undefined')` |
| UI no se actualiza al navegar | Sin View Transitions | Usar `document.addEventListener('astro:page-load', ...)` |
| Scripts duplicados | El script está dentro de un loop | Mover el `<script>` al layout, pasar datos via `data-*` |
| Estado perdido en build | localStorage no existe en Node | Nunca leer localStorage en el frontmatter |

---

## 7. Relación con el Proyecto Incremental

En este módulo, `astro-campus` añade:

- Sistema de favoritos persistente en localStorage.
- Botón ★/☆ en cada `RecursoCard`.
- Página `/favoritos` que lista los recursos guardados.
- Contador de visitas por página.

---

## 8. Recursos

- [Scripts en Astro](https://docs.astro.build/es/guides/client-side-scripts/)
- [MDN localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [Directivas de script en Astro](https://docs.astro.build/es/reference/directives-reference/#script-directives)
