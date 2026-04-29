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

Crear el proyecto incremental `ppw-angular-21` con Angular 21, routing habilitado y una estructura inicial preparada para continuar el resto de módulos sin rehacer la base.

---

## Contexto de la práctica

Esta práctica no es un ejercicio aislado. El proyecto que se crea aquí será el mismo que crecerá en los módulos 02, 03, 04 y posteriores. Por eso la meta no es solo “hacer que corra”, sino dejar una base limpia y mantenible.

---

## Archivos que se van a modificar

- `src/app/app.config.ts`
- `src/app/app.routes.ts`
- `src/app/app.ts`
- `src/styles.css`
- `src/app/features/home/pages/home-page.ts`

---

## Archivos base desde `files`

En esta fase la carpeta [angular/01-instalacion-configuracion/files](files/README.md) queda preparada para alojar los archivos base de arranque del proyecto. La práctica usa esa estructura como referencia de qué piezas deben existir.

---

## Código inicial

### Crear el proyecto

```bash
ng new ppw-angular-21 --routing --style=scss --ssr=false
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
    app.ts
    features/
      home/
        pages/
          home-page.ts
```

---

## Pasos incrementales

### Paso 1. Verificar versión y arranque

Comprueba que Angular CLI y el proyecto se ejecutan correctamente.

```bash
ng version
pnpm start
```

Validación técnica: el navegador debe abrir la aplicación sin errores de compilación.

### Paso 2. Configurar `app.routes.ts`

Copiar una configuración mínima de rutas.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  template: `
    <section>
      <h1>PPW Angular 21</h1>
      <p>Proyecto incremental listo para crecer.</p>
    </section>
  `,
})
export class HomePage {}
```

La separacion en `features/` evita que el proyecto crezca de forma caotica. Cada modulo futuro agregara su propia carpeta dentro de `features/`.

---

## Paso 6: Configurar `app.routes.ts`

**Que hace este paso?** Define la ruta inicial que conecta la URL raiz `/` con `HomePage`. Esta configuracion se expandira en el modulo de navegacion.

Reemplazar el contenido de `src/app/app.routes.ts`:

```ts
import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

La ruta `**` redirige cualquier URL desconocida a la pagina de inicio, evitando pantallas en blanco.

---

## Paso 7: Simplificar `app.ts`

**Que hace este paso?** Deja el componente raiz lo mas pequeno posible. Las paginas son las que controlan el contenido real.

Reemplazar el contenido de `src/app/app.ts`:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'ppw-angular-21';
}
```

Reemplazar el contenido de `src/app/app.html`:

```html
<main class="app-shell">
  <router-outlet />
</main>
```

`RouterOutlet` es el punto donde Angular renderiza el componente que corresponde a la ruta activa.

---

## Paso 8: Ajustar estilos globales

**Que hace este paso?** Establece una base visual neutra para toda la aplicacion. Tailwind se incorporara en el modulo de estilos.

Reemplazar el contenido de `src/styles.scss`:

```scss
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
}
```

---

## Paso 9: Verificar `app.config.ts`

**Que hace este paso?** Confirma que la configuracion global incluye `provideZoneChangeDetection`, que es la version generada por Angular CLI 21 y que se usara como punto de extension para modulos futuros.

Verificar que `src/app/app.config.ts` tenga este contenido:

```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
```

En modulos siguientes se agregaran `provideHttpClient()` y otros providers en este mismo array.

---

## Paso 10: Verificar el resultado final

**Que hace este paso?** Confirma que todos los cambios funcionan juntos antes de hacer el commit.

```bash
pnpm start
```

Abrir en el navegador: `http://localhost:4200`

La pagina de bienvenida de Angular debe haber sido reemplazada por el contenido de `HomePage`.

![Pagina HomePage funcionando en localhost:4200](assets/01-home-page.png)

---

## Validaciones esperadas

- [ ] `node --version` retorna 18 o superior
- [ ] `pnpm --version` retorna cualquier version valida
- [ ] `ng version` muestra Angular CLI >= 21
- [ ] La carpeta `ppw-angular-21/` fue creada con la estructura correcta
- [ ] `pnpm start` inicia sin errores de compilacion
- [ ] `http://localhost:4200` muestra el contenido de `HomePage` (no la pagina de bienvenida de Angular)
- [ ] La ruta `/` renderiza el titulo "PPW Angular 21"
- [ ] Una ruta inexistente redirige a `/`
- [ ] No existe `AppModule` en el proyecto

---

## Entregables

- Repositorio GitHub con el proyecto `ppw-angular-21` en su estado inicial
- Archivo `README.md` en el repositorio indicando el proposito del proyecto
- Capturas de pantalla en `evidencias/assets/`:
  1. `01-ng-version.png` — salida de `ng version` en la terminal
  2. `01-ng-new.png` — proceso de creacion del proyecto con Angular CLI
  3. `01-app-inicio.png` — pagina de bienvenida de Angular antes de modificar
  4. `01-home-page.png` — `HomePage` funcionando en `localhost:4200`

---

## Commits sugeridos

```bash
git add .
git commit -m "feat: inicializar proyecto base ppw-angular-21"

git add .
git commit -m "feat: crear estructura de features y home-page inicial"

git add .
git commit -m "feat: configurar router con ruta raiz y wildcard"

git add .
git commit -m "END: Practica 01 - Instalacion y Configuracion completada"
```
