# Programación y Plataformas Web
## Frameworks Web: Angular

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

# Práctica 1: Instalación y Configuración de Angular
## Autores 

**Alex Guaman**\
**Daniel Guanga**

# Instalación de Angular CLI

La forma recomendada para iniciar proyectos en Angular es usando **Angular CLI**.

## Crear un nuevo proyecto Angular

```bash
npm install -g @angular/cli
ng new mi-app-angular
```

Durante la creación del proyecto, selecciona las siguientes opciones:

- **CSS**: o el preprocesador de tu preferencia (SCSS recomendado)
- **SSR**: Colcar no (n)
- **zoneless**: Colocar no (n)
- **AI tools**: No usar ninugno (none)
![alt text]({A8E9B111-3F1C-4F20-9C87-01C84F05C5F5}.png)

Luego entra al proyecto e instala dependencias (si no lo hizo automáticamente):

```bash
cd mi-app-angular
pnpm install
```
![alt text]({51FD82A8-E009-47F0-A1B7-B2A82985CE92}.png)

## Correr en desarrollo

```bash
ng serve -o
```

## Servir en la red local

```bash
ng serve --host 0.0.0.0 --port 4200
```
![alt text]({8D2F6714-D17F-4346-AFC5-DE145AD547B1}.png)

## Compilar para producción

```bash
ng build
```
![alt text]({750DDEE8-A5DE-43FB-9CD1-F5411E5A74F2}.png)

# Extensiones recomendadas para VS Code (Angular)

Estas extensiones potencian el desarrollo con Angular:

- [**Angular Language Service**](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
  — IntelliSense y autocompletado para Angular.

- [**Angular Snippets (Version 16)**](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)
  — Fragmentos de código para componentes, módulos, servicios, etc.

- [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  — Linter para mantener un código limpio y consistente.

- [**Prettier - Code Formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  — Formateo automático de código.

- [**Material Icon Theme**](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
  — Iconos visuales para los archivos Angular.

- [**Auto Import**](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport)
  — Importación automática de módulos y componentes.

# Hoja de atajos — Angular CLI

## Comandos básicos

```bash
ng new mi-app-angular         # Crear un nuevo proyecto Angular
ng serve -o                   # Iniciar servidor y abrir navegador
ng build                      # Compilar para producción
ng generate component nombre  # Crear un nuevo componente
ng generate service nombre    # Crear un nuevo servicio
ng test                       # Ejecutar pruebas unitarias
```

## Parámetros útiles

- `--routing` → Incluye el módulo de enrutamiento.
- `--style=scss` → Usa SCSS como preprocesador.
- `--standalone` → Crea componentes independientes (Angular moderno).

## Estructura creada automáticamente (Angular CLI)

- `src/` → Código fuente.
- `src/app/` → Componentes, módulos, servicios, rutas.
- `src/main.ts` → Punto de entrada.
- `src/index.html` → HTML principal.
- `angular.json` → Configuración del proyecto Angular.
- `package.json` → Dependencias y scripts.
- `tsconfig.json` → Configuración de TypeScript.

# Nuestro Proyecto de Angular

```html
<h1>Home</h1>
<router-outlet></router-outlet>
```

```html
<h1>Home Page</h1>
<h2>Fundamentos</h2>
<p>homePage works!</p>
<h1>Contador:</h1> <h1>{{ counter }}</h1>
<h1>Contador:</h1> <h1>{{ counterSignal() }}</h1>
<button (click)="changeValue(1)">Incrementar</button>
<button (click)="changeValue(-1)">Decrementar</button>
<button (click)="resetValue(0)">Reiniciar</button>
```

```html
<h1>{{ name() }}</h1>

<dl>
  <td>Nombre:</td>
  <dd>{{ name() }}</dd>

  <td>Apellido:</td>
  <dd>{{ lastName() }}</dd>

  <td>Edad:</td>
  <dd>{{ age() }}</dd>

  <td>Nombre Completo:</td>
  <dd>{{ getFullName() }}</dd>

  <td>Nombre y Apellido (Mayúsculas):</td>
  <!-- TODO: Mostrar name() y lastName() en mayúsculas sin crear nueva señal -->
  <dd>{{ (name() + ' ' + lastName()).toUpperCase() }}</dd>
</dl>

<button (click)="changeData()">
  Cambiar datos
</button>

<button (click)="changeAge()">
  Cambiar edad
</button>

<button (click)="resetData()">
  Reset
</button>
```

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './homePage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  constructor() {
    setInterval(() => {
      console.log('*');
      this.counterSignal.update((v) => v + 1);
    },1000);
  }

  counter = 0;
  counterSignal = signal(0);


  changeValue(value: number) {
    this.counter += value;
    this.counterSignal.update((Current) => Current + value);
  }

  resetValue(value: number) {
    this.counter = value;
    this.counterSignal.set(value);
  }

}
```

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  templateUrl: './perfilPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilPage {
  name = signal('Juan');
  lastName = signal('Pérez');
  age = signal(30);

  getFullName(): string {
    return `${this.name()} ${this.lastName()} con edad ${this.age()} años`;
  }

  changeData(): void {
    this.name.set('Ana');
    this.lastName.set('Gonzales');
    this.age.set(25);
  }

  changeAge(): void {
    this.age.set(18);
  }

  resetData(): void {
    this.name.set('Juan');
    this.lastName.set('Pérez');
    this.age.set(30);
  }
}
```
# Routes
```typescript
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomePage } from './features/homePage/homePage';
import { PerfilPage } from './features/perfilPage/perfilPage';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'perfil',
    component: PerfilPage
  },
];
```

# Resultados

![alt text]({3354025A-0657-4DCF-938B-37C2D14CE2EA}.png)

![alt text]({74A1D1D9-3489-4966-A1FD-892EA6A0AE78}.png)

![alt text]({77B9DD73-8BC9-4471-AE83-21B55C1381AC}.png)

---

📄 **Autor:** Guaman Guanga  
📅 **Framework documentado:** Angular  
🔧 **Propósito:** Documentación de instalación, configuración y estructura del framework Angular.
