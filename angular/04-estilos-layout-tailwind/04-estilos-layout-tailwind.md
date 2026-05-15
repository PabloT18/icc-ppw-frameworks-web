# Programación y Plataformas Web

# Frameworks Web: Angular 21 + TailwindCSS

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="TailwindCSS Logo">
</div>

## 05. Estilos y Layout con Tailwind

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Incorporar TailwindCSS al proyecto incremental para construir layout, espaciado, tipografía, cards y responsive design sin romper la arquitectura Angular ya creada en los módulos anteriores.

---

## 2. Qué resuelve Tailwind

Tailwind no reemplaza Angular ni su sistema de componentes. Resuelve la capa visual con utilidades pequeñas y combinables que se leen directamente en el markup.

| CSS tradicional disperso | Tailwind aplicado con criterio |
|---|---|
| estilos repartidos en muchos selectores | utilidades visibles cerca del HTML |
| naming de clases difícil de sostener | composición rápida y predecible |
| responsive separado y repetitivo | breakpoints integrados en la misma clase |
| deuda visual difícil de rastrear | base visual consistente y reutilizable |

En este módulo el foco no es introducir una librería de componentes visuales. El foco es layout: contenedores, grids, cards, espacios, jerarquía tipográfica y responsive.

---

## 3. Configuración base de Tailwind en Angular 21

### 3.1 Instalación Tailwind CSS

Instalacion con `pnpm`

```bash
pnpm install tailwindcss @tailwindcss/postcss postcss --force
```

Configure PostCSS Plugins. Create a .postcssrc.json file in the root of your project and add the @tailwindcss/postcss plugin to your PostCSS configuration.

```
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```


Import Tailwind CSS. Agregar @import to ./src/styles.css que impoarta Tailwind CSS.

```ts
@import "tailwindcss";
```

Agregar la extension en VsCode

https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss

Agrega `Prettier PLugin` para una mejor distribucion de los atributos 

A Prettier v3+ plugin for Tailwind CSS v3.0+ that automatically sorts classes based on our recommended class order.

https://github.com/tailwindlabs/prettier-plugin-tailwindcss

### 3.2 Entrada global de estilos

La configuración mínima vive en `src/styles.css`:

```css
@import "tailwindcss";

@layer base {
  body {
    @apply bg-slate-100 text-slate-900 antialiased;
  }
}
```

### 3.3 Tokens y tema

Tailwind v4 permite definir tokens desde CSS con `@theme`:

```css
@theme {
  --color-brand: #0f4c81;
  --color-brand-strong: #0b3a66;
  --breakpoint-xs: 30rem;
  --breakpoint-3xl: 120rem;
}
```

No es obligatorio tocar todos los tokens. Solo se personalizan cuando el proyecto necesita un sistema visual propio.

### 3.4 Cómo leer la configuración

| Pieza | Qué hace |
|---|---|
| `@import "tailwindcss"` | Activa el sistema de utilidades. |
| `@layer base` | Ajusta estilos globales de arranque. |
| `@theme` | Permite declarar colores, breakpoints y otros tokens. |
| `@apply` | Reutiliza utilidades dentro de CSS cuando hay un ajuste global pequeño. |

---

## 4. Utilidades fundamentales

Tailwind se compone de utilidades atómicas que se pueden combinar para construir una UI completa sin escribir selectores nuevos.

| Grupo | Utilidades comunes | Uso |
|---|---|---|
| Layout | `container`, `mx-auto`, `max-w-*`, `min-h-screen` | Centrar y limitar el ancho |
| Espaciado | `p-*`, `px-*`, `py-*`, `gap-*`, `space-y-*` | Separar bloques y contenido |
| Flex/Grid | `flex`, `grid`, `items-center`, `justify-between`, `grid-cols-*` | Distribuir elementos |
| Tipografía | `text-*`, `font-*`, `tracking-*`, `leading-*` | Jerarquía visual |
| Color | `bg-*`, `text-*`, `border-*` | Superficies y contraste |
| Elevación | `shadow-*`, `ring-*`, `rounded-*` | Cards y contenedores |

### Ejemplo de composición

```html
<section class="mx-auto max-w-6xl px-4 py-8">
  <h1 class="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
</section>
```

La lectura es directa: ancho máximo, centrado, padding, título destacado y color de texto.

---

## 5. Responsive design y breakpoints

Tailwind trabaja con un enfoque mobile-first: las utilidades sin prefijo aplican al tamaño base y luego se sobreescriben con prefijos responsive.

| Breakpoint | Ancho mínimo aproximado | Prefijo |
|---|---|---|
| `sm` | 40rem / 640px | `sm:` |
| `md` | 48rem / 768px | `md:` |
| `lg` | 64rem / 1024px | `lg:` |
| `xl` | 80rem / 1280px | `xl:` |
| `2xl` | 96rem / 1536px | `2xl:` |

### Ejemplo responsive

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
  ...
</div>
```

### Qué significa realmente

- En móvil hay una sola columna.
- En pantallas medianas se pasa a dos columnas.
- En pantallas anchas el grid crece a cuatro columnas.

### Variantes comunes

| Variante | Uso |
|---|---|
| `hover:` | Cambia el estilo al pasar el mouse |
| `focus:` | Ajustes de accesibilidad al enfocar |
| `active:` | Estado mientras se presiona |
| `disabled:` | Estado cuando un control no puede usarse |
| `md:` / `lg:` | Cambios por tamaño de pantalla |

---

## 6. Tipos de layout que sí vale la pena practicar

### 6.1 Shell global

Sirve para envolver header, contenido y footer en una sola estructura estable, manteniendo el patrón ya trabajado en navegación.

```html
<app-header />

<main class="app-shell bg-slate-100">
  <router-outlet />
</main>

<app-footer />
```

### 6.2 Dashboard con sidebar

Útil cuando hay navegación lateral, contenido principal y un contexto visual amplio.

```html
<section class="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
  <aside class="rounded-2xl bg-slate-900 p-4 text-white">Sidebar</aside>
  <div class="space-y-4">Contenido principal</div>
</section>
```

### 6.3 Grid de cards

Ideal para métricas, accesos rápidos o resúmenes.

```html
<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <article class="rounded-2xl bg-white p-5 shadow-sm">Card</article>
</div>
```

### 6.4 Layout con scroll horizontal

Sirve para galerías o listas que no deben romperse en móviles.

```html
<div class="flex gap-4 overflow-x-auto pb-2">
  <article class="min-w-[18rem] shrink-0 rounded-2xl bg-white p-4">Card</article>
</div>
```

---

## 7. Cards: la pieza visual que rellena los layouts

Las cards permiten ver cómo se comporta un layout con contenido real. En este módulo se usan para probar estructura, espaciado y responsividad.

### Anatomía de una card

- Título visible con buena jerarquía.
- Texto de apoyo o descripción.
- Superficie diferenciada con `bg-white`, `rounded-*`, `shadow-*` o `ring-*`.
- Tamaño consistente entre cards hermanas.

### Ejemplo de card

```html
<article class="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
  <p class="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">Card 01</p>
  <h3 class="mt-2 text-lg font-semibold text-slate-900">Usuarios activos</h3>
  <p class="mt-2 text-sm leading-6 text-slate-600">Indicador rápido de actividad del sistema.</p>
</article>
```

Las cards no son solo decoración: son el “relleno” que hace visible si un layout funciona o no.

---

## 8. Relación con el proyecto incremental

En este módulo se estilizan el shell general y las páginas creadas en navegación y formularios. Además, se agrega una nueva página de layouts para comparar patrones visuales y comprobar cómo responden los cards en distintos breakpoints.

La práctica debe ayudar a pasar de una aplicación funcional a una aplicación que también se percibe coherente, legible y escalable.

---

## 9. Buenas prácticas

- Usar Tailwind para construir layout antes de introducir CSS personalizado.
- Mantener una jerarquía visual clara con espaciado y tipografía consistentes.
- Preferir contenedores, grids y flexbox previsibles sobre estilos improvisados en cada página.
- Aplicar breakpoints con intención; no agregar variantes responsive por costumbre.
- Extraer un componente Angular cuando una composición se repite como pieza funcional del dominio.

---

## 10. Errores comunes

- Saltar directo a una librería visual sin dominar el layout base.
- Sobrecargar una plantilla con demasiadas utilidades sin orden de lectura.
- Duplicar estructuras visuales sin un criterio de reutilización.
- Usar Tailwind como reemplazo de la arquitectura Angular.
- Hacer responsive solo al final del proyecto.

---

## 11. Referencias recomendadas

- Documentación oficial de Tailwind: https://tailwindcss.com/docs
- Breakpoints responsivos: https://tailwindcss.com/docs/responsive-design
- Sistema de utilidades: https://tailwindcss.com/docs/utility-first
- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
