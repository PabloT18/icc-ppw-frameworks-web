# Programacion y Plataformas Web

# Angular para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## Modulo 1: Instalacion y Configuracion del Entorno

### Autores

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Configurar el entorno de desarrollo necesario para trabajar con Angular, crear un proyecto con Angular CLI usando TypeScript, entender la estructura inicial generada y dejar el proyecto listo para comenzar el desarrollo incremental que se construira a lo largo de todos los modulos.

---

## 2. Explicacion Conceptual

### Que es Angular?

Angular es un **framework completo para construir aplicaciones web**. Fue creado por Google en 2016 (version 2, reescritura total del antiguo AngularJS) y es actualmente uno de los frameworks mas utilizados en entornos enterprise.

A diferencia de React o Vue, Angular es un framework opinionated: incluye todo lo que necesitas desde el inicio (router, cliente HTTP, formularios, inyeccion de dependencias, herramientas de testing) sin necesidad de elegir bibliotecas externas.

### Por que usar Angular?

| Caracteristica | Descripcion |
|---|---|
| Framework completo | Incluye router, HttpClient, formularios reactivos y DI sin configuracion extra |
| TypeScript nativo | El proyecto se genera directamente en TypeScript; no es opcional |
| Angular CLI | Generador de codigo que crea componentes, servicios, guards, pipes con un comando |
| Arquitectura escalable | Convenciones claras para proyectos grandes con muchos modulos y equipos |
| Demanda laboral | Muy usado en proyectos enterprise, bancos, gobiernos y grandes empresas |
| Standalone components | Desde Angular 17+, cada componente puede existir sin un NgModule padre |

### Angular vs otros frameworks

| Aspecto | Vanilla JS | React | Angular | Vue | Astro |
|---|---|---|---|---|---|
| Tipo | Lenguaje | Biblioteca de UI | Framework completo | Framework progresivo | Framework multi-renderizado |
| Curva de aprendizaje | Baja (base) | Media | Alta | Media-baja | Media |
| Estructura del proyecto | Manual | Flexible | Opinionated (convenciones fuertes) | Semi-opinionado | Semi-opinionado |
| Manejo del DOM | Manual | Virtual DOM | Change Detection + Signals | Virtual DOM | Islas de interactividad |
| Estado | Manual | Hooks (useState) | Signals / RxJS | ref / reactive | useState (islands) |
| Rutas | Manual | React Router (externa) | Angular Router (incluida) | Vue Router (incluida) | Sistema de archivos |
| Formularios | Manual | Bibliotecas externas | Reactive Forms (incluido) | VeeValidate (externa) | Limitado |
| Cliente HTTP | Manual | fetch / axios (externos) | HttpClient (incluido) | axios (externo) | fetch nativo |
| Recomendado para | Aprender fundamentos | SPAs y apps dinamicas | Proyectos enterprise | Apps medianas a grandes | Sitios con contenido estatico |

### Que es Angular CLI?

**Angular CLI** (`@angular/cli`) es la herramienta de linea de comandos oficial de Angular. Sus responsabilidades principales son:

- **Crear proyectos**: genera la estructura inicial con todas las configuraciones correctas
- **Generar piezas**: crea componentes, servicios, guards, pipes, modulos con `ng generate`
- **Servir en desarrollo**: levanta un servidor con recarga automatica (`ng serve`)
- **Construir para produccion**: compila, minifica y optimiza la aplicacion (`ng build`)
- **Ejecutar tests**: corre pruebas unitarias y e2e

### Evolucion de Angular: de NgModule a Standalone

Antes de Angular 14, todo componente debia pertenecer a un `NgModule`. Esto generaba boilerplate innecesario en proyectos pequenos.

| Enfoque | Descripcion | Recomendado |
|---|---|---|
| NgModule (clasico) | Componentes agrupados en modulos; cada modulo declara sus imports | No (legacy) |
| Standalone (moderno) | Cada componente declara sus propios imports directamente | Si (Angular 17+) |

Desde Angular 17 el modo standalone es el default. En este curso usamos Angular 21 con standalone desde el inicio.

### Por que pnpm?

**pnpm** es un gestor de paquetes alternativo a npm y yarn. Sus ventajas:

- Instala mas rapido que npm
- Usa un almacen global de paquetes (no duplica en `node_modules`)
- Ahorra espacio en disco cuando hay multiples proyectos
- Comandos compatibles con npm (`pnpm add`, `pnpm install`, `pnpm run dev`)

---

## 3. Fundamento Tecnico

### Herramientas necesarias

| Herramienta | Version recomendada | Verificar con |
|---|---|---|
| Node.js | >= 18.x LTS | `node --version` |
| pnpm | >= 9.x | `pnpm --version` |
| Angular CLI | >= 21.x | `ng version` |
| Git | Cualquier version reciente | `git --version` |
| VS Code | Ultima version estable | — |

### Instalar Angular CLI globalmente

```bash
pnpm add -g @angular/cli
```

Verificar la instalacion:

```bash
ng version
```

### Crear proyecto con Angular CLI

```bash
ng new ppw-angular-21 --routing --style=scss --ssr=false
cd ppw-angular-21
pnpm install
```

Los argumentos significan:

- `ppw-angular-21` → nombre del proyecto y carpeta creada
- `--routing` → genera `app.routes.ts` con el router configurado desde el inicio
- `--style=scss` → usa SCSS como preprocesador de estilos
- `--ssr=false` → desactiva Server-Side Rendering (no necesario para este curso)

Despues de crear el proyecto, instalar dependencias con pnpm:

```bash
pnpm install
```

### Estructura inicial del proyecto

```
ppw-angular-21/
├── public/                    # Archivos estaticos servidos directamente
│   └── favicon.ico
├── src/                       # Codigo fuente
│   ├── app/
│   │   ├── app.config.ts      # Configuracion global (providers, router, HTTP)
│   │   ├── app.routes.ts      # Definicion de rutas de la aplicacion
│   │   ├── app.ts             # Componente raiz
│   │   └── app.html           # Template del componente raiz
│   ├── index.html             # HTML principal (unico en una SPA)
│   ├── main.ts                # Punto de entrada de la aplicacion
│   └── styles.scss            # Estilos globales
├── .editorconfig
├── .gitignore
├── angular.json               # Configuracion del workspace de Angular CLI
├── package.json               # Dependencias y scripts
├── tsconfig.app.json          # Configuracion TypeScript para la app
├── tsconfig.json              # Configuracion TypeScript base
└── tsconfig.spec.json         # Configuracion TypeScript para tests
```

### El archivo `main.ts`

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

- `bootstrapApplication`: arranca la aplicacion standalone sin un NgModule raiz
- `App`: componente raiz que contendra toda la aplicacion
- `appConfig`: objeto de configuracion con todos los providers globales

### El archivo `app.config.ts`

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

Este archivo reemplaza el rol del `AppModule` de versiones antiguas. Aqui se registran todos los providers globales:

| Provider | Funcion |
|---|---|
| `provideZoneChangeDetection` | Optimiza la deteccion de cambios con coalescencia de eventos |
| `provideRouter(routes)` | Registra el router con las rutas definidas en `app.routes.ts` |
| `provideHttpClient()` | Se agregara cuando se necesite consumir APIs REST |
| `provideAnimations()` | Se agregara cuando se usen animaciones de Angular Material |

### El archivo `app.routes.ts`

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [];
```

Aqui se definen todas las rutas de la aplicacion. Se expandira en el modulo de navegacion.

### El componente raiz `app.ts`

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

- `standalone: true` ya no es necesario escribirlo en Angular 19+; los componentes son standalone por default
- `imports: [RouterOutlet]` declara que este componente usa el outlet del router
- `selector: 'app-root'` coincide con `<app-root>` en `index.html`

### Scripts disponibles (`package.json`)

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  }
}
```

| Script | Comando | Descripcion |
|---|---|---|
| Desarrollo | `pnpm start` o `pnpm ng serve` | Levanta el servidor en `http://localhost:4200` con recarga automatica |
| Build | `pnpm build` | Compila y genera `/dist` para produccion |
| Watch | `pnpm watch` | Recompila al guardar cambios (modo desarrollo continuo) |
| Test | `pnpm test` | Ejecuta pruebas unitarias con Karma y Jasmine |

### Configuracion del workspace (`angular.json`)

El archivo `angular.json` controla como Angular CLI construye, sirve y prueba la aplicacion. Las claves mas importantes:

| Clave | Descripcion |
|---|---|
| `projects.[nombre].architect.build` | Configuracion del build de produccion (presupuestos de tamano, assets) |
| `projects.[nombre].architect.serve` | Configuracion del servidor de desarrollo (puerto, proxy) |
| `projects.[nombre].architect.test` | Configuracion del runner de tests |
| `budgets` | Limites de tamano del bundle; alerta si el build los supera |

### Estructura recomendada para el proyecto incremental

Una vez creado el proyecto, organizar `src/app/` de la siguiente forma antes de comenzar el modulo 2:

```
src/
  app/
    app.config.ts
    app.routes.ts
    app.ts
    app.html
    app.scss
    core/               # Servicios transversales (auth, interceptors, guards globales)
    shared/             # Componentes, pipes y directivas reutilizables
    features/           # Funcionalidad de negocio organizada por feature
      home/
        pages/
          home-page.ts
```

Esta separacion evita que el proyecto crezca de forma caotica y es la convencion mas usada en proyectos Angular reales.

---

## 4. Buenas Practicas

- **Usar Angular CLI para todo**: no crear archivos de componentes a mano; usar `ng generate component` para mantener consistencia.
- **No volver a `NgModule`**: el modo standalone es el estandar desde Angular 17. No mezclar ambos enfoques en el mismo proyecto.
- **Mantener `app.config.ts` limpio**: agregar providers solo cuando se necesiten; no registrar todo desde el inicio.
- **Usar SCSS**: permite variables, anidamiento y mixins que CSS plano no ofrece.
- **Commitear el boilerplate antes de modificar**: el primer commit debe ser el proyecto limpio generado por CLI.
- **Un solo proyecto incremental**: no crear un proyecto nuevo para cada practica; continuar siempre el mismo.
- **Tipado fuerte siempre**: evitar `any`; definir interfaces para todos los datos del dominio.

---

## 5. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| `command not found: ng` | Angular CLI no instalado globalmente | `pnpm add -g @angular/cli` |
| `command not found: pnpm` | pnpm no instalado | `npm install -g pnpm` |
| Puerto 4200 ocupado | Otro proceso usa el puerto | `pnpm ng serve --port 4201` |
| `Cannot find module '@angular/core'` | Dependencias no instaladas | `pnpm install` dentro de la carpeta del proyecto |
| Componente no se muestra | No se agrego al `imports` del componente padre | Agregar el componente al array `imports` del padre |
| Error de version de Node | Node demasiado antiguo | Instalar Node >= 18 LTS desde nodejs.org |
| `NG0100: ExpressionChangedAfterItHasBeenCheckedError` | Mutacion del estado en un ciclo de deteccion de cambios | Mover la logica a `ngOnInit` o usar `signal()` |

---

## 6. Relacion con el Proyecto Incremental

Este modulo establece la base del proyecto **ppw-angular-21** que se construira durante todos los modulos. Al finalizar este modulo, el proyecto tiene:

- Estructura de carpetas inicial con `core/`, `shared/` y `features/`
- Servidor de desarrollo funcionando en `localhost:4200`
- TypeScript configurado
- Router registrado en `app.config.ts`
- Boilerplate limpio listo para el modulo 2

Cada modulo posterior agrega funcionalidad a este mismo proyecto sin crear uno nuevo.

> Ver solucion de referencia en: `angular/solver/ppw-angular-21/`

---

## 7. Parte Practica

> Ver guia de practica en: `01-instalacion-configuracion-practica.md`

[Ir a la guia de practica del modulo](./01-instalacion-configuracion-practica.md)

---

## 8. Referencias

- [Documentacion oficial de Angular](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [Guia oficial de instalacion](https://angular.dev/installation)
- [Standalone components en Angular](https://angular.dev/guide/components)
- [Sitio oficial de pnpm](https://pnpm.io)
