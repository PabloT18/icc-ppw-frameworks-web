# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 08: Interactividad y localStorage

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Implementar un sistema de recursos favoritos persistente usando `localStorage` y scripts de cliente en Astro, sin necesidad de un framework de UI.

---

## Archivos que se crean / modifican

```
astro-campus/
└── src/
    ├── components/
    │   └── FavButton.astro        ← NUEVO
    ├── pages/
    │   └── favoritos.astro        ← NUEVO
    └── (RecursoCard.astro)        ← MODIFICAR: añadir FavButton
```

---

## Paso 1: Crear `src/components/FavButton.astro`

**¿Qué hace este paso?** Crea un botón reutilizable que toggle el estado de favorito en localStorage. El HTML viene del servidor; el JavaScript actualiza la UI en el cliente.

```astro
---
interface Props {
  slug: string;
}
const { slug } = Astro.props;
---

<button
  class="fav-btn"
  data-slug={slug}
  aria-label="Agregar a favoritos"
  title="Agregar a favoritos"
>
  ☆
</button>

<script>
  // Seleccionar todos los botones de favoritos en la página
  const btns = document.querySelectorAll<HTMLButtonElement>('.fav-btn');
  const STORAGE_KEY = 'campus-favoritos';

  function getFavs(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  function updateBtn(btn: HTMLButtonElement, esFav: boolean) {
    btn.textContent = esFav ? '★' : '☆';
    btn.setAttribute('aria-label', esFav ? 'Quitar de favoritos' : 'Agregar a favoritos');
    btn.classList.toggle('activo', esFav);
  }

  btns.forEach(btn => {
    const slug = btn.dataset.slug!;

    // Estado inicial
    updateBtn(btn, getFavs().includes(slug));

    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Evitar que el clic se propague a links padres
      const favs = getFavs();
      const idx = favs.indexOf(slug);
      if (idx === -1) favs.push(slug); else favs.splice(idx, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
      updateBtn(btn, idx === -1);
    });
  });
</script>

<style>
  .fav-btn {
    background: none;
    border: 1px solid var(--color-border, #333);
    border-radius: var(--radius-sm, 0.25rem);
    color: var(--color-text-muted, #aaa);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0.25rem 0.5rem;
    transition: color 0.2s, border-color 0.2s;
    line-height: 1;
  }
  .fav-btn:hover { border-color: var(--color-brand, #FF5D01); color: var(--color-brand, #FF5D01); }
  .fav-btn.activo { color: #f59e0b; border-color: #f59e0b; }
</style>
```

---

## Paso 2: Crear `src/pages/favoritos.astro`

**¿Qué hace este paso?** Muestra los recursos marcados como favoritos. Como los datos están en `localStorage` (cliente), la página se renderiza vacía en el servidor y se puebla con JavaScript.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { recursos } from '../data/recursos';
---

<BaseLayout titulo="Mis Favoritos">
  <h1>Mis Favoritos</h1>
  <p class="subtitulo">Recursos que marcaste como favoritos.</p>

  <div id="favoritos-container">
    <p id="cargando">Cargando favoritos…</p>
  </div>

  <p id="sin-favoritos" class="oculto">
    Aún no tienes favoritos. Visita <a href="/recursos/1">Recursos</a> y marca algunos.
  </p>
</BaseLayout>

<script define:vars={{ recursos }}>
  const STORAGE_KEY = 'campus-favoritos';
  const container = document.querySelector('#favoritos-container');
  const sinFav = document.querySelector('#sin-favoritos');

  function getFavs() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
    catch { return []; }
  }

  function render() {
    const favSlugs = getFavs();
    const favRecursos = recursos.filter(r => favSlugs.includes(r.slug));

    if (!container || !sinFav) return;

    if (favRecursos.length === 0) {
      container.innerHTML = '';
      sinFav.classList.remove('oculto');
      return;
    }

    sinFav.classList.add('oculto');
    container.innerHTML = `
      <ul class="fav-lista">
        ${favRecursos.map(r => `
          <li class="fav-item">
            <a href="/recursos/${r.slug}">${r.titulo}</a>
            <span class="cat">${r.categoria}</span>
            <button class="quitar-btn" data-slug="${r.slug}">Quitar ✕</button>
          </li>
        `).join('')}
      </ul>
    `;

    // Agregar listeners a los botones "Quitar"
    container.querySelectorAll('.quitar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.dataset.slug;
        const favs = getFavs().filter(s => s !== slug);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
        render();
      });
    });
  }

  render();
</script>

<style is:global>
  .oculto { display: none; }
  .fav-lista { list-style: none; padding: 0; }
  .fav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border, #333);
  }
  .fav-item a { flex: 1; color: var(--color-text, #e8e8e8); text-decoration: none; }
  .fav-item a:hover { color: var(--color-brand, #FF5D01); }
  .cat { font-size: 0.8rem; color: var(--color-text-muted, #aaa); }
  .quitar-btn {
    background: none;
    border: 1px solid var(--color-error, #f87171);
    color: var(--color-error, #f87171);
    border-radius: var(--radius-sm, 0.25rem);
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
  }
  .quitar-btn:hover { background: var(--color-error, #f87171); color: #fff; }
</style>
```

---

## Paso 3: TODO — Completar por el estudiante

```astro
---
// TODO en src/components/RecursoCard.astro:
// Importar FavButton y agregarlo a la tarjeta
// El slug del recurso debe pasarse al FavButton
// Posicionarlo en la esquina superior derecha de la card
---
```

```javascript
// TODO en src/pages/favoritos.astro (script):
// Mostrar el total de favoritos en el título (ej: "Mis Favoritos (3)")
// Actualizar el título dinámicamente cuando se agrega/quita un favorito
```

---

## Validaciones esperadas

- [ ] El botón ★/☆ aparece en cada `RecursoCard`
- [ ] Al hacer clic, el ícono cambia entre ☆ y ★
- [ ] Al recargar la página, el estado de los favoritos se mantiene
- [ ] `/favoritos` muestra los recursos marcados correctamente
- [ ] El botón "Quitar" elimina el recurso de la lista y de localStorage
- [ ] En modo privado/incógnito, empieza sin favoritos

---

## Entregables

- `src/components/FavButton.astro` funcional
- `src/pages/favoritos.astro` mostrando favoritos desde localStorage
- `RecursoCard.astro` con FavButton integrado
- Capturas: estado con favoritos y estado vacío

---

## Commits sugeridos

```
feat: add FavButton component with localStorage toggle
feat: add /favoritos page with dynamic rendering
feat: integrate FavButton into RecursoCard
```
