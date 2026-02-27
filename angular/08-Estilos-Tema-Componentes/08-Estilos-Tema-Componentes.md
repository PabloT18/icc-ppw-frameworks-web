Perfecto. Antes de pasar a crear el documento del **Ejercicio 08 – Componentes predefinidos con DaisyUI**, resumamos la estructura que tendrá, siguiendo el mismo formato institucional que tus documentos anteriores:

---

# Programación y Plataformas Web

## Frameworks Web: Angular + TailwindCSS

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="TailwindCSS Logo"/>
</div>

## Práctica 8: Componentes predefinidos y DaisyUI

### Autor

**Pablo Torres**

📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)

📧 [pabloa_ec@hotmail.com](mailto:pabloa_ec@hotmail.com)

💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

# Introducción a los Componentes Predefinidos

En muchos proyectos de Angular + TailwindCSS, se busca acelerar el desarrollo visual sin perder consistencia en el diseño.
Para eso existen **librerías de componentes predefinidos**, que ofrecen botones, tarjetas, tablas, menús o barras de navegación ya estilizados, listos para integrar en el proyecto.

---

## 1. Librerías más utilizadas

| Librería        | Descripción                                                                         | Enfoque principal          |
| --------------- | ----------------------------------------------------------------------------------- | -------------------------- |
| **DaisyUI**     | Extensión oficial de TailwindCSS con componentes listos y personalizables por tema. | Diseño rápido y adaptable. |
| **Flowbite**    | Componentes basados en Tailwind con interacción (JavaScript).                       | Dashboards y formularios.  |
| **Headless UI** | Componentes accesibles sin estilos predefinidos.                                    | Control total del estilo.  |
| **Preline UI**  | Librería moderna basada en Tailwind + AlpineJS.                                     | Interfaces empresariales.  |

Entre ellas, **DaisyUI** es la más completa y nativa de TailwindCSS.

---

## 2. Instalación de DaisyUI

Desde la raíz del proyecto Angular:

```bash
pnpm add -D daisyui@latest
```

En el archivo `src/styles.css`:

```css
@import "tailwindcss";
@plugin "daisyui";
```

Para aplicar temas predefinidos:

```css
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, cupcake;
}
```

Y en el archivo `index.html` define el tema por defecto:

```html
<html data-theme="cupcake"></html>
```

**Referencia oficial:**
[https://daisyui.com/docs/themes/](https://daisyui.com/docs/themes/)

---

## 3. Uso de componentes de DaisyUI

DaisyUI permite usar clases listas como `btn`, `card`, `navbar`, `drawer`, `footer`, etc.
No requieren JavaScript adicional, ya que funcionan con utilidades CSS y HTML estándar.

---


# PARTE PRÁCTICA

* Hacer que daisyui-page sea la principal la que paunta a `/`.
* Para cada componente a continuación crear un componente independiente. 


## PASO 1. Crear un nuevo componente de demostración



```bash
ng g c features/daisyui-page --standalone --skip-tests
```

Código base:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daisyui-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daisyui-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaisyuiPageComponent {}
```

---


## PASO 2. Crear un Navbar con Drawer lateral

El siguiente ejemplo combina una **navbar** para escritorio y un **drawer lateral** para dispositivos móviles.

```html
<div class="drawer">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <div class="navbar bg-base-300 w-full">
      <div class="flex-none lg:hidden">
        <label for="my-drawer-2" aria-label="open sidebar" class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               class="inline-block h-6 w-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div class="mx-2 flex-1 px-2 font-bold">Navbar Title</div>
      <div class="hidden flex-none lg:block">
        <ul class="menu menu-horizontal">
          <li><a>Inicio</a></li>
          <li><a>Componentes</a></li>
          <li><a>Contacto</a></li>
        </ul>
      </div>
    </div>
    <main class="p-6">Contenido principal aquí</main>
  </div>

  <div class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 min-h-full w-80 p-4">
      <li><a>Dashboard</a></li>
      <li><a>Configuración</a></li>
      <li><a>Ayuda</a></li>
    </ul>
  </div>
</div>
```

**Explicación breve:**

* `.drawer` crea una estructura adaptable.
* `.navbar` maneja la parte superior.
* `.menu-horizontal` y `.menu` ajustan la navegación según el dispositivo.
* El menú lateral aparece solo en móvil (gracias a `lg:hidden`).

---

## PASO 3. Agregar un Footer moderno

```html
<footer class="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
  <nav class="grid grid-flow-col gap-4">
    <a class="link link-hover">About</a>
    <a class="link link-hover">Contact</a>
    <a class="link link-hover">Jobs</a>
  </nav>
  <aside>
    <p>Copyright © 2025 - All rights reserved</p>
  </aside>
</footer>
```

---

## PASO 4. Agregar componente de código simulado

```html
<div class="mockup-code w-full">
  <pre data-prefix="1"><code>pnpm add daisyui</code></pre>
  <pre data-prefix="2"><code>configurando...</code></pre>
  <pre data-prefix="3" class="bg-warning text-warning-content"><code>¡Listo!</code></pre>
</div>
```

Este componente sirve para mostrar **comandos de instalación o ejemplos de código**.

---

## PASO 5. Mostrar datos en tabla y tarjeta

### Tabla:

```html
<div class="overflow-x-auto">
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Cargo</th>
        <th>Color Favorito</th>
      </tr>
    </thead>
    <tbody>
      <tr><th>1</th><td>Cy Ganderton</td><td>QA Specialist</td><td>Azul</td></tr>
      <tr><th>2</th><td>Hart Hagerty</td><td>Tech Support</td><td>Púrpura</td></tr>
      <tr><th>3</th><td>Brice Swyre</td><td>Accountant</td><td>Rojo</td></tr>
    </tbody>
  </table>
</div>
```

### Card:

```html
<div class="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Producto</h2>
    <p>Ejemplo de tarjeta con imagen, título y acción.</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Ver más</button>
    </div>
  </div>
</div>
```

---

## PASO 6. Responsividad Condicional

Para mostrar un componente solo en móvil y ocultarlo en pantallas grandes:

```html
<section class="flex flex-col items-center justify-center p-6 gap-6">

  <!-- Versión móvil -->
  <div class="card bg-base-100 w-80 shadow-md block lg:hidden">
    <figure>
      <img
        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        alt="Producto móvil" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">Producto Móvil</h2>
      <p>Versión compacta ideal para pantallas pequeñas, con enfoque visual.</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary btn-sm">Ver más</button>
      </div>
    </div>
  </div>

  <!-- Versión escritorio -->
  <div class="hidden lg:flex bg-base-100 shadow-lg rounded-lg w-full max-w-4xl p-6 items-center gap-6">
    <img
      class="w-40 rounded-lg"
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Producto Desktop" />
    <div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">Producto Versión Escritorio</h2>
      <p class="text-gray-600 mb-4">En pantallas grandes se utiliza una disposición horizontal con más espacio para detalles y acciones secundarias.</p>
      <button class="btn btn-primary">Comprar Ahora</button>
    </div>
  </div>

</section>

```


### Explicación

| Elemento / Clase              | Función                    | Descripción                                                                   |
| ----------------------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `.block.lg:hidden`            | Mostrar solo en móvil      | El card vertical se ve en dispositivos pequeños; se oculta en `lg` (≥1024px). |
| `.hidden.lg:flex`             | Mostrar solo en escritorio | Muestra el formato horizontal cuando la pantalla es grande.                   |
| `.card.bg-base-100.shadow-md` | Componente DaisyUI         | Proporciona el estilo estándar de tarjeta.                                    |
| `.max-w-4xl`                  | Controla el ancho máximo   | Limita el tamaño en pantallas amplias para mantener una lectura equilibrada.  |
| `.gap-6.items-center`         | Alineación flexible        | Centra el contenido y separa la imagen del texto.                             |

---

### ¿Por qué se usan **cards** en diseño móvil?

Las **cards** (tarjetas) son ideales para dispositivos móviles porque:

1. **Aprovechan mejor el espacio vertical.**
   El formato apilado facilita el desplazamiento (scroll) y evita la sobrecarga visual.
2. **Enfocan la atención.**
   Cada card contiene una sola idea o elemento (imagen, texto, botón), lo que mejora la usabilidad.
3. **Son táctilmente accesibles.**
   Su estructura rectangular con bordes y sombra facilita la interacción con los dedos.
4. **Mantienen coherencia visual.**
   En pantallas pequeñas, las cards ofrecen una disposición clara y repetible.

En cambio, en pantallas grandes se prefiere una **disposición horizontal** que aprovecha el ancho, permite incluir más información y mejora la experiencia de escritorio

---

## Resultados esperados

1. Navbar con Drawer funcional y responsivo.
2. Footer con enlaces e íconos.
3. Mockup de código funcional.
4. Tabla y tarjetas estilizadas.
5. Comportamiento adaptable según tamaño de pantalla.



