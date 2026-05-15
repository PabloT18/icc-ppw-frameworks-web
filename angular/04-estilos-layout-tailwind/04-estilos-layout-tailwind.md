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

Incorporar TailwindCSS al proyecto incremental para construir layout, espaciado, tipografía y responsive design sin romper la estructura Angular ya creada en los módulos anteriores.

---

## 2. Explicación conceptual

Tailwind no reemplaza Angular ni su sistema de componentes. Su función es resolver la capa visual con utilidades composables que permiten iterar rápido y mantener consistencia.

| CSS tradicional disperso | Tailwind aplicado con criterio |
|---|---|
| estilos repartidos en muchos selectores | utilidades visibles cerca del markup |
| naming de clases difícil de sostener | composición rápida y predecible |
| responsive separado y repetitivo | breakpoints integrados en la misma clase |
| riesgo de deuda visual temprana | base visual consistente para el proyecto incremental |

En este módulo el foco no es DaisyUI ni componentes predefinidos. El foco es layout: contenedores, grids, espacios, tipografía y responsive.

---

## 3. Fundamento técnico

### 3.1 Integración de Tailwind en Angular 21

Tailwind se instala una sola vez y luego actúa como base visual de todo el proyecto.

```bash
pnpm add -D tailwindcss @tailwindcss/postcss postcss
```

La configuración exacta puede variar según la versión del starter, pero el criterio del curso es el mismo: activar Tailwind en el pipeline de estilos del proyecto.

### 3.2 Utilidades fundamentales

```html
<section class="mx-auto max-w-6xl px-4 py-8">
  <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
</section>
```

### 3.3 Responsive design

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
  ...
</div>
```

### 3.4 Cuándo usar clases utilitarias y cuándo extraer componentes

Si una estructura visual se repite mucho o ya expresa una pieza funcional del dominio, conviene moverla a un componente Angular reutilizable. Si es una composición puntual de layout, se puede mantener con utilidades en la plantilla.

---

## 4. Ejemplos de código

### Ejemplo 1: shell responsive simple

```html
<section class="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[240px_1fr]">
  <aside class="rounded-2xl bg-slate-900 p-4 text-white">
    Menú lateral
  </aside>

  <div class="space-y-6">
    <header class="rounded-2xl bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold">Panel</h1>
    </header>
  </div>
</section>
```

### Ejemplo 2: cards en grid

```html
<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <article class="rounded-2xl bg-white p-5 shadow-sm">
    <p class="text-sm text-slate-500">Usuarios activos</p>
    <strong class="text-3xl">128</strong>
  </article>
</div>
```

---

## 5. Buenas prácticas

- Usa Tailwind para construir layout antes de introducir una librería de componentes.
- Mantén una jerarquía visual clara con espaciado y tipografía consistentes.
- Prefiere contenedores y grids previsibles sobre estilos improvisados en cada página.
- Aplica breakpoints con intención; no agregues variantes responsive por costumbre.
- Evita clases extremadamente largas si la estructura ya merece extraerse a componente.

---

## 6. Errores comunes

- Saltar directo a una librería visual sin dominar layout base.
- Sobrecargar una plantilla con clases sin criterio de lectura.
- Duplicar estructuras visuales sin extraer componentes.
- Usar Tailwind como reemplazo de arquitectura Angular.
- Hacer responsive solo al final del proyecto.

---

## 7. Relación con el proyecto incremental

En este módulo se estiliza el shell general y las páginas creadas en navegación y formularios. El objetivo es que el proyecto deje de verse como demo técnica y comience a comportarse como una aplicación usable.

---

## 8. Referencias recomendadas

- Documentación oficial de Tailwind: https://tailwindcss.com/docs
- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
