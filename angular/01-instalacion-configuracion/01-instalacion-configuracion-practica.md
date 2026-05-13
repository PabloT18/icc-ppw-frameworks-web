# Programacion y Plataformas Web

# Angular para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## Modulo 1: Instalacion y Configuracion del Entorno - Practica

### Autores

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Crear el proyecto incremental `ppw-angular-21` con Angular 21, setup inicial limpio y estructura de carpetas preparada para crecer en módulos posteriores **sin configurar rutas ni navegación**.

---

## Contexto de la práctica

Esta práctica no es un ejercicio aislado. El proyecto que se crea aquí será el mismo que crecerá en los módulos 02, 03, 04 y posteriores. En este módulo **solo hacemos el setup base**; la navegación y rutas vienen en el módulo 03.

---

## Archivos que se van a modificar

- `src/app/app.config.ts`
- `src/app/app.ts`
- `src/app/app.html`
- `src/styles.css`


---

## Código inicial

### Crear el proyecto

```bash
ng new ppw-angular-21 --routing --style=css --ssr=false
cd ppw-angular-21
pnpm install
pnpm start
```


### Estructura mínima esperada

```text
src/
  app/
    app.config.ts
    app.routes.ts
    app.css
    app.ts
    app.html
  index.html
  main.ts
  styles.css
```

---

## Pasos incrementales

### Paso 1. Verificar versión y arranque

Comprueba que Angular CLI y el proyecto se ejecutan correctamente.

```bash
ng version
ng serve -o
```

Validación técnica: el navegador debe abrir la aplicación sin errores de compilación.

### Paso 2: Limpiar la plantilla por defecto

Angular CLI genera un `app.html` con mucho contenido de demostración. Reemplazar con una estructura mínima:

```html
<main class="app-shell">
  <router-outlet />
</main>
```

**Que hace esto**: `<router-outlet>` es el placeholder donde Angular renderizará componentes cuando el router esté configurado. Por ahora está vacío, pero está listo para cuando se implemente navegación.

---



## Paso 3: Verificar el componente raiz en `app.ts`

**Que hace este paso?** Confirmar que `app.ts` viene con `RouterOutlet` importado y queda listo para renderizar rutas en modulos posteriores.

Verificar que `src/app/app.ts` tenga esta estructura (viene generada por defecto):

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'ppw-angular-21';
}
```

**Por qué importa `RouterOutlet`?** Aunque ahora no se use para navegación, `RouterOutlet` es el mecanismo que Angular usará más adelante para renderizar diferentes componentes. Importarlo desde el inicio garantiza que el proyecto está listo.

---

## Paso 4: Ajustar estilos globales

**Que hace este paso?** Establece una base visual neutra para toda la aplicacion. Tailwind se incorporara en el modulo de estilos.

En Angular, `src/styles.css` aplica estilos globales a toda la app (no solo a un componente). Por eso aqui definimos selectores base:

Reemplazar el contenido de `src/styles.css`:

```css
:root {
  font-family: Inter, system-ui, sans-serif;
  color: #172033;
  background: #f5f7fb;
}

body {
  margin: 0;
}

.app-shell {
  min-height: 100vh;
  padding: 2rem;
}
```

### Como funciona cada estilo

- `:root`
  Es el elemento raiz del documento HTML (`<html>`). Lo usamos para definir estilos base compartidos en toda la aplicacion, como tipografia, color de texto y color de fondo global.

- `body`
  Es el contenedor principal visible de la pagina. Con `margin: 0` quitamos el margen por defecto del navegador para que el layout no tenga espacios no controlados.

- `.app-shell`
  Es la clase del contenedor principal en `app.html`.
  - `min-height: 100vh` hace que ocupe al menos toda la altura de la ventana.
  - `padding: 2rem` agrega espacio interno para que el contenido no quede pegado a los bordes.

---

## Paso 5: Verificar `app.config.ts`

**Que hace este paso?** Confirma que la configuración global está en su estado por defecto, lista para extensión en futuros módulos.

Verificar que `src/app/app.config.ts` tenga este contenido (generado por CLI):

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
```

**Nota**: Este es el estado por defecto que genera Angular CLI. El archivo `app.routes.ts` existe pero está vacío. Esto no genera errores; simplemente significa que no hay rutas configuradas aún.

---

## Paso 6: Verificar el resultado final

**Que hace este paso?** Confirma que todos los cambios funcionan juntos antes de hacer el commit.

```bash
ng serve -o
```

Abrir en el navegador: `http://localhost:4200`

Debe renderizar `<router-outlet />` sin errores (está vacío porque no hay rutas, pero no hay errores de compilación).

---

## Validaciones esperadas

- [ ] `node --version` retorna 18 o superior
- [ ] `pnpm --version` retorna cualquier version valida
- [ ] `ng version` muestra Angular CLI >= 21
- [ ] La carpeta `ppw-angular-21/` fue creada con la estructura correcta
- [ ] `pnpm start` inicia sin errores de compilacion
- [ ] `http://localhost:4200` carga sin errores (aunque esté vacío en navegador)
- [ ] `app.config.ts` importa `provideRouter(routes)` por defecto
- [ ] `app.routes.ts` existe pero está vacío (`export const routes: Routes = []`)
- [ ] No existe `AppModule` en el proyecto

---

## Entregables

- Repositorio GitHub con el proyecto `ppw-angular-21` en estado limpio
- Archivo `README.md` indicando el propósito del proyecto
- Capturas de pantalla en `evidencias/assets/`:
  1. `01-ng-version.png` — salida de `ng version` en terminal
  2. `01-ng-new.png` — proceso de creación del proyecto
  3. `01-proyecto-limpio.png` — navegador con `http://localhost:4200` vacío pero sin errores

---

## Commits sugeridos

```bash
git add .
git commit -m "feat: inicializar proyecto base ppw-angular-21"

git add .
git commit -m "feat: limpiar template default y dejar estructura mínima"

git add .
git commit -m "feat: configurar estilos globales"

git add .
git commit -m "END: Practica 01 - Setup inicial completado"
```
