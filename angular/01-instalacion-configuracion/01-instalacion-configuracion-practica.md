# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 01. Instalación y Configuración - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo práctico

Crear el proyecto incremental `ppw-angular-21` con Angular 21, routing habilitado y una estructura inicial preparada para continuar el resto de módulos sin rehacer la base.

---

## 2. Contexto de la práctica

Esta práctica no es un ejercicio aislado. El proyecto que se crea aquí será el mismo que crecerá en los módulos 02, 03, 04 y posteriores. Por eso la meta no es solo “hacer que corra”, sino dejar una base limpia y mantenible.

---

## 3. Archivos que se van a modificar

- `src/app/app.config.ts`
- `src/app/app.routes.ts`
- `src/app/app.ts`
- `src/styles.css`
- `src/app/features/home/pages/home-page.ts`

---

## 4. Archivos base desde `files`

En esta fase la carpeta [angular/01-instalacion-configuracion/files](files/README.md) queda preparada para alojar los archivos base de arranque del proyecto. La práctica usa esa estructura como referencia de qué piezas deben existir.

---

## 5. Código que el estudiante debe copiar inicialmente

### 5.1 Crear el proyecto

```bash
pnpm create @angular@latest ppw-angular-21
cd ppw-angular-21
pnpm start
```

### 5.2 Estructura mínima esperada

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

## 6. Pasos incrementales

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

Explicación técnica: esta ruta base garantiza que más adelante se puedan agregar nuevas páginas sin romper el arranque inicial.

### Paso 3. Crear la página inicial

Crear `home-page.ts` como componente standalone.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <section>
      <h1>PPW Angular 21</h1>
      <p>Proyecto incremental listo para crecer.</p>
    </section>
  `,
})
export class HomePage {}
```

Explicación técnica: el curso parte desde componentes standalone para no depender de `AppModule`.

### Paso 4. Simplificar `app.ts`

Copiar una raíz mínima con `RouterOutlet`.

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="app-shell">
      <router-outlet />
    </main>
  `,
})
export class App {}
```

Explicación técnica: se deja el componente raíz lo más pequeño posible para que las páginas controlen el contenido real.

### Paso 5. Ajustar estilos globales

Agregar un estilo global mínimo en `src/styles.css`.

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
}
```

Explicación técnica: todavía no se introduce Tailwind. Aquí solo se fija una base visual neutra.

### Paso 6. Registrar la configuración global

Verificar que `app.config.ts` usa el router moderno.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

Explicación técnica: este provider se convertirá en el punto de extensión para HTTP, guards y otras capacidades futuras.

---

## 7. Validaciones esperadas

- La aplicación compila sin errores.
- La ruta `/` renderiza la página inicial.
- La ruta inexistente redirige a `/`.
- El proyecto ya tiene carpeta `features/home/pages`.
- No existe `AppModule` como eje del proyecto.

Placeholder sugerido de captura: `assets/01-app-base.png`

---

## 8. Entregables

- Proyecto `ppw-angular-21` creado y funcional.
- Estructura inicial organizada por features.
- Página `HomePage` funcionando.
- Rutas iniciales configuradas.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: inicializar proyecto base angular 21"
git commit -m "feat: configurar router y home page inicial"
git commit -m "chore: ajustar estructura base del proyecto incremental"
```
