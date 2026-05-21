# Programación y Plataformas Web

# Frameworks Web: Angular 21 + TailwindCSS

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="TailwindCSS Logo">
</div>

## 06. Temas y Componentes UI

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Diseñar una capa visual consistente y escalable sobre el proyecto incremental: tema global, componentes reutilizables (navbar, header, footer, cards), variantes visuales (glass/gradient) y una página catálogo de componentes responsive.

---

## 2. Enfoque conceptual

En el módulo anterior resolvimos estructura y layout. En este módulo resolvemos **sistema visual**. Un sistema visual no es solo "que se vea bonito": define reglas de composición para mantener consistencia entre pantallas.

| Enfoque suelto | Enfoque de sistema |
|---|---|
| cada pantalla se estiliza diferente | mismas reglas de espaciado, color y tipografía |
| componentes duplicados | componentes reutilizables con variantes |
| difícil mantener coherencia | fácil escalar nuevos módulos |
| cambios visuales costosos | cambios globales con bajo costo |

La combinación Tailwind + DaisyUI permite velocidad de implementación sin perder arquitectura basada en componentes Angular.

---

## 3. Fundamento técnico

### 3.1 DaisyUI como capa semántica sobre Tailwind

```bash
pnpm add -D daisyui@latest
```

```css
@import "tailwindcss";
@plugin "daisyui";
```

DaisyUI aporta clases de componentes (`btn`, `navbar`, `card`, `badge`) y temas listos para acelerar desarrollo.

### 3.2 Tema global y tokens visuales

```html
<html lang="es" data-theme="cupcake">
```

Cambiar `data-theme` modifica colores base y jerarquías visuales sin reescribir toda la UI.

Buena práctica: definir un tema por defecto del curso y, si se habilita cambio de tema, documentar contraste y legibilidad en todos los estados (normal, hover, disabled, focus).

### 3.3 Componentes visuales vs. componentes de dominio

- **Visuales:** `AppNavbar`, `AppFooter`, `GlassCard`, `StatChip`.
- **Dominio:** `StudentsPage`, `ProfilePage`, `SignupPage`.

Regla: un componente visual no debería conocer lógica de negocio. Solo recibe inputs y emite eventos.

### 3.4 Variantes visuales modernas: glass + gradients

Las variantes visuales enriquecen la percepción sin romper estructura:

- **Glass:** `bg-white/10`, `backdrop-blur-xl`, `border-white/20`.
- **Gradient surfaces:** `bg-gradient-to-br`, `from-sky-500`, `via-cyan-400`, `to-indigo-500`.

No deben aplicarse en exceso. Se recomienda concentrarlas en bloques de alto valor (hero, CTA, card destacada).

### 3.5 Distribución responsive por zonas

Una sola página puede combinar varias distribuciones:

- Zona 1: hero 1 columna móvil / 2 columnas desktop.
- Zona 2: grid de cards 1-2-3 columnas (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`).
- Zona 3: bloques asimétricos (`lg:grid-cols-[2fr_1fr]`).

Esto permite enseñar diseño adaptable real, no solo "stack vertical".

---

## 4. Ejemplos de código

### Ejemplo 1: navbar reutilizable

```html
<nav class="navbar rounded-2xl border border-base-200 bg-base-100/90 px-4 shadow-sm backdrop-blur">
  <div class="flex-1">
    <a class="text-lg font-black tracking-tight">PPW Angular</a>
  </div>
  <div class="hidden gap-2 md:flex">
    <a class="btn btn-ghost btn-sm">Inicio</a>
    <a class="btn btn-ghost btn-sm">Profile</a>
    <a class="btn btn-primary btn-sm">Componentes</a>
  </div>
</nav>
```

### Ejemplo 2: card glass reutilizable

```html
<article class="rounded-2xl border border-white/30 bg-white/10 p-5 shadow-lg backdrop-blur-xl">
  <h3 class="text-lg font-bold text-slate-900">Glass Card</h3>
  <p class="mt-2 text-sm text-slate-700">Ideal para resúmenes, métricas y accesos rápidos.</p>
</article>
```

### Ejemplo 3: bloque gradiente

```html
<section class="rounded-3xl bg-linner-to-br from-sky-500 via-cyan-400 to-indigo-500 p-6 text-white shadow-xl">
  <p class="text-xs font-semibold uppercase tracking-[0.25em]">UI System</p>
  <h2 class="mt-2 text-2xl font-black">Componentes consistentes</h2>
  <p class="mt-2 text-sm text-white/90">La misma base visual en todas las páginas.</p>
</section>
```

---

## 5. Buenas prácticas

- Definir el tema en un solo lugar y no mezclar múltiples bibliotecas de componentes.
- Reutilizar navbar, header y footer como componentes compartidos.
- Mantener variantes visuales como props o clases composables, no duplicar HTML.
- Usar contrastes accesibles en texto sobre gradientes y superficies glass.
- Conservar jerarquía tipográfica consistente entre páginas.
- Usar breakpoints intencionales: móvil primero, luego enriquecer para `md`, `lg`, `xl`.
- Evitar animaciones excesivas; priorizar claridad de navegación y foco.

---

## 6. Errores comunes

- Tratar DaisyUI como reemplazo de arquitectura Angular.
- Duplicar navbar/footer/header en cada page en vez de usar el shell.
- Usar glass/gradients en todos los bloques y saturar visualmente la interfaz.
- Cambiar tema sin revisar estados hover/focus/disabled.
- Crear componentes visuales acoplados a datos de una sola página.
- Ignorar accesibilidad de contraste y navegación por teclado.

---

## 7. Relación con el proyecto incremental

Este módulo deja al proyecto con identidad visual real: componentes compartidos robustos y una página de catálogo UI para pruebas rápidas. Esta base acelera los módulos de consumo HTTP, autenticación y guards porque la capa visual ya está resuelta y estandarizada.

---

## 8. Referencias recomendadas

- Documentación oficial DaisyUI: https://daisyui.com
- Documentación TailwindCSS: https://tailwindcss.com/docs
- Accesibilidad contraste (WCAG): https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
