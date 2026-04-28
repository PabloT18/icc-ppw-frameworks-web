# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 01. Instalación y Configuración

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Configurar un proyecto base con Angular 21 que sirva como punto de partida para todo el recorrido incremental del bloque Angular. Desde este módulo se fija la línea técnica del curso: standalone components, router moderno, tipado fuerte y una estructura de proyecto preparada para crecer sin rehacer la base en cada práctica.

---

## 2. Explicación conceptual

Angular 21 permite trabajar con una arquitectura más ligera que la clásica basada en `AppModule`. En lugar de comenzar con módulos raíz grandes, el enfoque moderno se apoya en:

- componentes standalone
- configuración centralizada con `app.config.ts`
- rutas con `provideRouter`
- servicios registrados con providers funcionales
- una estructura de features más fácil de mantener

### ¿Qué problema resuelve una buena configuración inicial?

| Sin configuración base | Con configuración base moderna |
|---|---|
| Cada práctica redefine la estructura | Todas las prácticas continúan sobre el mismo proyecto |
| Se mezclan componentes, páginas y utilidades | La estructura separa responsabilidades desde el inicio |
| Queda código legacy con `AppModule` o patrones mezclados | Se parte desde Angular 21 con standalone y providers modernos |
| Se vuelve difícil desplegar o escalar | El proyecto queda listo para navegación, formularios y servicios |

---

## 3. Fundamento técnico

### 3.1 Angular CLI como generador de la base

Angular CLI crea una base de proyecto con convenciones útiles para desarrollo, compilación y despliegue. Para este curso conviene que el proyecto nazca con routing y stylesheet consistente.

```bash
pnpm create @angular@latest
```

Si se usa `ng new`, la idea es equivalente: crear una aplicación limpia y coherente con Angular 21.

### 3.2 Standalone components

El enfoque standalone reduce fricción porque cada componente declara sus imports directamente y no depende de un módulo agregado para existir.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>Hola Angular 21</h1>`,
})
export class App {}
```

### 3.3 Configuración con `app.config.ts`

La configuración global vive en un archivo pequeño donde se registran router, cliente HTTP, animaciones o providers globales.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

### 3.4 Estructura inicial recomendada

```text
src/
  app/
    app.config.ts
    app.routes.ts
    app.ts
    core/
    shared/
    features/
      home/
        pages/
```

Esta estructura evita que el proyecto crezca de forma caótica. `core` concentra servicios transversales, `shared` reutiliza piezas comunes y `features` organiza la funcionalidad del negocio.

### 3.5 Decisiones que se fijan desde este módulo

- usar `pnpm` como gestor principal
- trabajar con standalone components
- centralizar rutas en `app.routes.ts`
- mantener tipado fuerte en TypeScript
- evitar generar código no usado solo por costumbre

---

## 4. Ejemplos de código

### Ejemplo 1: raíz mínima con router outlet

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

### Ejemplo 2: rutas iniciales

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

---

## 5. Buenas prácticas

- Define desde el inicio el nombre del proyecto guía y úsalo en todo el tutorial.
- No mezcles ejemplos viejos con `AppModule` si el curso está orientado a Angular 21.
- Crea una estructura incremental real; no reinicies el proyecto en cada módulo.
- Mantén la configuración mínima al principio y agrega providers conforme el proyecto los necesite.
- Documenta cualquier decisión global que afecte a módulos futuros.

---

## 6. Errores comunes

- Crear un proyecto nuevo en cada práctica en lugar de continuar el mismo.
- Generar componentes en cualquier carpeta sin una convención clara.
- Mezclar `href` y navegación tradicional antes de tener router configurado.
- Copiar configuración de versiones antiguas de Angular sin revisar si sigue vigente.
- No dejar listo el proyecto para crecer y luego reorganizar todo a mitad del curso.

---

## 7. Relación con el proyecto incremental

Este módulo crea la base del proyecto `ppw-angular-21`, que será extendido en todos los temas siguientes. Lo que aquí se configure debe seguir vigente cuando se agreguen navegación, formularios, estilos, servicios HTTP, autenticación y guards.

---

## 8. Referencias recomendadas

- [angular/docs/angular-deploy.md](../docs/angular-deploy.md)
- Documentación oficial de Angular: https://angular.dev
- Guía oficial de instalación: https://angular.dev/installation
