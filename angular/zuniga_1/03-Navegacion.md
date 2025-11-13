# Programación y Plataformas Web

## Frameworks Web: Angular

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">

</div>

## Practica 2: Fundamentos

### Autores

**Geovanni Zúñiga**
📧 gzunigag@est.ups.edu.ec  
💻 GitHub: [Geovanni](https://github.com/nnyez)

---

## 🧭 Navegación en Angular

La navegación en Angular es fundamentalmente diferente a la navegación tradicional en HTML. Mientras que en HTML usamos etiquetas `<a href="">`, en Angular utilizamos la directiva `routerLink` para crear aplicaciones de una sola página (SPA) que no requieren recargar la página completa.

## 🔄 ¿Por qué NO usar `href` tradicional?

### ❌ Navegación Tradicional con `href`:

```html
<!-- Esto RECARGA toda la página -->
<a href="/perfil">Ir al Perfil</a>
<a href="/productos">Ver Productos</a>
```

**Problemas:**

- ✗ Recarga completa de la página
- ✗ Pérdida del estado de la aplicación
- ✗ Mayor tiempo de carga
- ✗ Experiencia de usuario interrumpida

### ✅ Navegación con `routerLink`:

```html
<!-- Esto SOLO cambia el contenido, sin recargar -->
<a routerLink="/perfil">Ir al Perfil</a>
<a routerLink="/productos">Ver Productos</a>
```

**Ventajas:**

- ✓ Navegación instantánea
- ✓ Preserva el estado de la aplicación
- ✓ Mejor experiencia de usuario
- ✓ Aplicación de una sola página (SPA)

## 📚 ¿Qué son las Directivas?

Las **directivas** son instrucciones especiales que le dicen a Angular cómo modificar el DOM (Document Object Model). En Angular existen tres tipos:

### 1. **Directivas de Componente**

```typescript
@Component({
  selector: 'app-home'  // Esta es una directiva de componente
})
```

### 2. **Directivas Estructurales** (Angular 20+)

```html
<!-- Control Flow moderno -->
@if (usuario) {
<p>Bienvenido {{ usuario.nombre }}</p>
} @for (producto of productos; track producto.id) {
<div>{{ producto.nombre }}</div>
}
```

### 3. **Directivas de Atributo**

```html
<!-- routerLink es una directiva de atributo -->
<a routerLink="/inicio">Inicio</a>
<div [ngClass]="{'activo': isActive}">Contenido</div>
```

## 🔗 RouterLink: Tipos de Sintaxis

Angular ofrece dos formas principales de usar `routerLink`:

### 1. **Sintaxis de String Simple**

```html
<a routerLink="/">Home</a>
<a routerLink="/productos">Productos</a>
<a routerLink="/contacto">Contacto</a>
```

**Características:**

- ✓ Sintaxis más simple
- ✓ Ideal para rutas estáticas
- ✓ Fácil de leer y escribir

### 2. **Sintaxis de Array (Binding)**

```html
<a [routerLink]="['/perfil']">Perfil</a>
<a [routerLink]="['/usuario', usuarioId]">Ver Usuario</a>
<a [routerLink]="['/productos', 'categoria', categoriaId]">Categoría</a>
```

**Características:**

- ✓ Permite pasar parámetros dinámicos
- ✓ Más flexible para rutas complejas
- ✓ Ideal para rutas con variables

## 💡 Ejemplos Prácticos

### Ejemplo 1: Navegación Básica

```typescript
// app.component.ts
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav>
      <h2>Mi Aplicación Angular</h2>
      <ul>
        <li><a routerLink="/">🏠 Inicio</a></li>
        <li><a routerLink="/productos">📦 Productos</a></li>
        <li><a routerLink="/contacto">📞 Contacto</a></li>
      </ul>
    </nav>

    <!-- Aquí se renderizan los componentes según la ruta -->
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      nav {
        background: #f0f0f0;
        padding: 1rem;
        margin-bottom: 2rem;
      }

      ul {
        list-style: none;
        display: flex;
        gap: 1rem;
      }

      a {
        text-decoration: none;
        color: #007bff;
        padding: 0.5rem 1rem;
        border-radius: 4px;
      }

      a:hover {
        background: #e9ecef;
      }
    `,
  ],
})
export class AppComponent {
  title = "navegacion-ejemplo";
}
```

### Ejemplo 2: Navegación con Parámetros

```typescript
// productos.component.ts
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <h2>Lista de Productos</h2>

    @for (producto of productos(); track producto.id) {
      <div class="producto-card">
        <h3>{{ producto.nombre }}</h3>
        <p>{{ producto.descripcion }}</p>
        <p><strong>Precio: ${{ producto.precio }}</strong></p>

        <!-- Navegación con parámetros usando sintaxis de array -->
        <a [routerLink]="['/producto', producto.id]">
          👁️ Ver Detalles
        </a>
      </div>
    }
  `,
  styles: [`
    .producto-card {
      border: 1px solid #dee2e6;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
    }

    .producto-card a {
      background: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      margin-top: 0.5rem;
    }

    .producto-card a:hover {
      background: #0056b3;
    }
  `]
})
export class ProductosComponent {
  productos = signal([
    { id: 1, nombre: 'Laptop', descripcion: 'Laptop Gaming', precio: 1200 },
    { id: 2, nombre: 'Mouse', descripcion: 'Mouse Inalámbrico', precio: 25 },
    { id: 3, nombre: 'Teclado', descripcion: 'Teclado Mecánico', precio: 80 }
  ]);
}
```

## 🎯 Diferencias Clave: String vs Array

| Aspecto         | Sintaxis String      | Sintaxis Array             |
| --------------- | -------------------- | -------------------------- |
| **Formato**     | `routerLink="/ruta"` | `[routerLink]="['/ruta']"` |
| **Parámetros**  | ❌ No soporta        | ✅ `['/ruta', parametro]`  |
| **Variables**   | ❌ Solo texto fijo   | ✅ Puede usar variables    |
| **Complejidad** | Simple               | Más flexible               |

### Ejemplos Comparativos:

```html
<!-- ✅ String: Ideal para rutas fijas -->
<a routerLink="/">Inicio</a>
<a routerLink="/productos">Productos</a>
<a routerLink="/contacto">Contacto</a>

<!-- ✅ Array: Ideal para rutas dinámicas -->
<a [routerLink]="['/perfil']">Mi Perfil</a>
<a [routerLink]="['/usuario', usuario.id]">Ver Usuario: {{ usuario.nombre }}</a>
<a [routerLink]="['/producto', producto.id, 'reviews']">Reviews del Producto</a>

<!-- 🔍 Ejemplo con múltiples parámetros -->
<a [routerLink]="['/categoria', categoria.id, 'producto', producto.id]">
  Ver Producto en Categoría
</a>
```

## 🚀 RouterLink Activo

Para destacar el enlace activo, Angular proporciona `routerLinkActive`:

```html
<nav>
  <a
    routerLink="/"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{exact: true}"
  >
    Inicio
  </a>

  <a routerLink="/productos" routerLinkActive="active"> Productos </a>

  <a routerLink="/contacto" routerLinkActive="active"> Contacto </a>
</nav>

<style>
  .active {
    background-color: #007bff;
    color: white;
    font-weight: bold;
  }
</style>
```

## 📱 Navegación Programática

También podemos navegar desde el código TypeScript:

```typescript
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-ejemplo",
  template: `
    <button (click)="irAProductos()">Ver Productos</button>
    <button (click)="irAProducto(123)">Ver Producto 123</button>
  `,
})
export class EjemploComponent {
  private router = inject(Router);

  irAProductos() {
    this.router.navigate(["/productos"]);
  }

  irAProducto(id: number) {
    this.router.navigate(["/producto", id]);
  }
}
```

## 🎓 Resumen

1. **RouterLink** es una directiva de Angular que permite navegación SPA
2. **No usar `href`** porque recarga la página completa
3. **Sintaxis String**: Simple, para rutas fijas (`routerLink="/inicio"`)
4. **Sintaxis Array**: Flexible, para rutas con parámetros (`[routerLink]="['/perfil']"`)
5. **RouterLinkActive**: Para destacar enlaces activos
6. **Navegación programática**: Usando el servicio Router

La navegación en Angular es mucho más eficiente y proporciona una mejor experiencia de usuario comparada con la navegación tradicional HTML.

## �️ Implementación Práctica

Sigue estos pasos para implementar la navegación en tu proyecto Angular:

### Paso 1: Crear las Páginas Principales

Los componentes pueden crearse mediante el comando: `ng generate component <component-name>`.

#### 1.1 Crear ProyectosPage

```typescript
  @Component({
  selector: 'app-proyectos-page',
  imports: [ListadoProyectos],
  templateUrl: './ProyectosPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

#### 1.2 Crear ProyectosDosPage

```typescript
@Component({
  selector: 'app-trabajos',
  imports: [ListadoProyectos, ListManager],
  templateUrl: './Trabajos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

### Paso 2: Configurar las Rutas

```typescript
export const routes: Routes = [
  {
    path: "",
    component: HomePage,
  },
  {
    path: "perfil",
    component: PerfilPage,
  },
  {
    path: "trabajos",
    component: Trabajos,
  },
  {
    path: "proyectos",
    component: ProyectosPage,
  },
];
```

El atributo `path` identificara cada componente a donde queramos navegar.

### Paso 3: Agregar al Navbar

Se crea un componente nuevo, `Navbar` que contendra todas las rutas a las que queremos navegar. Esta a su vez estara siempre disponible en la parte superior aun si se navega a otra pagina.

Mediante el uso del comando `ng generate component Navbar`

```html
<nav>
  <a
    routerLink="/"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
    >Home</a
  >
  <a routerLink="/perfil" routerLinkActive="active">Perfil</a>
  <a routerLink="/trabajos" routerLinkActive="active">Trabajos</a>
  <a routerLink="/proyectos" routerLinkActive="active">Proyectos</a>
</nav>
```

```css
nav {
  background-color: blueviolet;
  padding: 1rem;
}

a {
  color: white;
  margin-right: 1rem;
  text-decoration: none;
}

a:hover {
  color: yellow;
  cursor: pointer;
  transition: color 120ms ease-in-out;
}

a.active {
  color: aqua;
}
```

El `Navbar` se debe incluir en el archivo `app.html`, encima del `router-outlet`.

```html
<app-navbar /> <router-outlet />
```

### Paso 4: Crear Componentes para Proyectos y separarlos en componentes individuales

Separar por componentes permite reutilizarlos en distintos apartados.

#### 4.1 Crear Componente para Agregar Proyectos

Utilizamos `ng generate component administrador-proyectos`.

```html
<div>
  <h3>Agregar Proyecto</h3>
  <h4>Proyecto a agregar {{ name() }}</h4>
  <input
    type="text"
    name="Nombre del proyectos"
    [value]="name()"
    (change)="changeName(txtName.value)"
    #txtName
  />
  <input
    type="text"
    name="Descripcion del proyectos"
    [value]="description()"
    (change)="changeDescription(txtDescrip.value)"
    #txtDescrip
  />

  <button (click)="addValue()">Agregar</button>
  <button (click)="removeValue()">Remover</button>
</div>
```

```typescript
@Component({
  selector: "app-list-manager",
  imports: [],
  templateUrl: "./administrador-proyectos.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministradorProyectos {
  changeName(value: string) {
    this.name.set(value);
  }
  changeDescription(value: string) {
    this.description.set(value);
  }
  name = signal("");
  description = signal("");

  addValue() {
    const newProyecto: ProyectoInterface = {
      id: 0,
      description: this.name(),
      name: this.description(),
    };

    this.name.set("");
    this.description.set("");
  }

  removeValue() {
    this.removeListener.emit(this.name());
  }
}
```

#### 4.2 Crear Componente para Lista de Proyectos

Utilizamos `ng generate component List  listado-proyectos`

```html
<div>
  <div>
    <h3>Listado <u>{{ listName() }}</u></h3>
    <ul>
      @for (proyecto of list(); track $index) {
      <li>
        {{ proyecto.id }} - {{ proyecto.name }} - {{ proyecto.description }}
      </li>
      }
    </ul>
  </div>
</div>
```

```typescript
@Component({
  selector: 'app-listado-proyectos',
  imports: [],
  templateUrl: './listado-proyectos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

### Paso 5: Implementar la Página de Proyectos

Esta pagina solo contiene el componente de `listado-proyectos`, demostrando como utilizar mas componentes y cual es su diferencia.

```html
<section>
  <div>
    <h3>Agregar Proyecto</h3>
    <h4>Proyecto a agregar {{ name() }}</h4>
    <input
      type="text"
      name="Nombre del proyectos"
      [value]="name()"
      (change)="changeName(txtName.value)"
      #txtName
    />
    <input
      type="text"
      name="Descripcion del proyectos"
      [value]="description()"
      (change)="changeDescription(txtDescrip.value)"
      #txtDescrip
    />

    <button (click)="addValue()">Agregar</button>
  </div>
  <div>
    <div>
      <h3>Listado</h3>

      <ul>
        @for (proyecto of proyectos(); track $index) {
        <li>
          {{ proyecto.id }} - {{ proyecto.name }} - {{ proyecto.description }}
        </li>
        }
      </ul>
    </div>
  </div>
  <!-- Componente ListadoProyectos -->
  <app-listado-proyectos listName="Proyectos" [list]="proyectos()" />
</section>
```

```typescript
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ListadoProyectos } from "./components/listado-proyectos/listado-proyectos";

@Component({
  selector: "app-proyectos-page",
  imports: [ListadoProyectos],
  templateUrl: "./ProyectosPage.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosPage {
  changeName(value: string) {
    this.name.set(value);
  }
  changeDescription(value: string) {
    this.description.set(value);
  }
  name = signal("");
  description = signal("");

  addValue() {
    const newPoryecto: ProyectoInterface = {
      id: this.proyectos().length + 1,
      description: this.name(),
      name: this.name(),
    };
    this.proyectos.set([...this.proyectos(), newPoryecto]);
    this.name.set("");
    this.description.set("");
  }

  proyectos = signal<ProyectoInterface[]>([
    {
      id: 1,
      description: "Sistema de gestión de inventario",
      name: "InventoryPro",
    },
    {
      id: 2,
      description: "Aplicación de comercio electrónico",
      name: "EasyShop",
    },
    {
      id: 3,
      description: "Plataforma de aprendizaje en línea",
      name: "LearnHub",
    },
    {
      id: 4,
      description: "Sistema de reservas hoteleras",
      name: "HotelBook",
    },
    {
      id: 5,
      description: "Aplicación de gestión de tareas",
      name: "TaskMaster",
    },
  ]);
}
```

### Paso 6: Implementar la Página ProyectosDos

Para esta pagina utilizamos un `Servicio` creado con el comando: `ng generate service CUSTOM_NAME`. Los servicios nos ayudan a compartir codigo de negocios o para acceder a datos guardados. Estos pueden ser utilizados por cualquier componente que necesite acceder al mismo.

```typescript
@Injectable({
  providedIn: "root",
})
export class ProyectosService {
  constructor() {
    effect(() => {
      const value = this.proyectos();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
    });
  }

  private readonly STORAGE_KEY = "proyectosApp";

  addValue(newProyecto: ProyectoInterface) {
    newProyecto.id = this.proyectos().length + 1;
    this.proyectos.set([...this.proyectos(), newProyecto]);
    console.log(this.proyectos.length);
  }

  removeValue() {
    this.proyectos.set(this.proyectos().slice(1));
  }

  proyectos = signal<ProyectoInterface[]>(this.loadProyectos());

  private loadProyectos(): ProyectoInterface[] {
    const value = localStorage.getItem(this.STORAGE_KEY);
    return value
      ? JSON.parse(value)
      : [
          {
            id: 1,
            description: "Sistema de gestión de inventario",
            name: "InventoryPro",
          },
          {
            id: 2,
            description: "Aplicación de comercio electrónico",
            name: "EasyShop",
          },
          {
            id: 3,
            description: "Plataforma de aprendizaje en línea",
            name: "LearnHub",
          },
          {
            id: 4,
            description: "Sistema de reservas hoteleras",
            name: "HotelBook",
          },
          {
            id: 5,
            description: "Aplicación de gestión de tareas",
            name: "TaskMaster",
          },
        ];
  }
}
```

Este servicio ademas tiene acceso al `localStorage` permitiendo guardar datos en el cache del navegador. El codigo es similar al `ProyectosPage`. Pero esta separacion permite que cualquier componente tenga acceso a la misma informacion.

## �📸 Capturas de Implementación

### 1. Configuración de Rutas (app.routes.ts)

![rutas](assets/navegacion/routes.png)

```typescript
import { Routes } from "@angular/router";
import { HomePage } from "./features/homePage/homePage";
import { PerfilPage } from "./features/perfilPage/perfilPage";
import { Trabajos } from "./features/Trabajos/Trabajos";
import { ProyectosPage } from "./features/ProyectosPage/ProyectosPage";

export const routes: Routes = [
  {
    path: "",
    component: HomePage,
  },
  {
    path: "perfil",
    component: PerfilPage,
  },
  {
    path: "trabajos",
    component: Trabajos,
  },
  {
    path: "proyectos",
    component: ProyectosPage,
  },
];
```

### 2. Navegación con RouterLink

![navegacion](assets/navegacion/navegacion-router.png)
```html
<a
  roauterLink="/"
  routerLinkActive="active"
  [routerLinkActiveOptions]="{ exact: true }"
  >Home</a
>
<a routerLink="/perfil" routerLinkActive="active">Perfil</a>
<a routerLink="/trabajos" routerLinkActive="active">Trabajos</a>
<a [routerLink]="['/proyectos']" routerLinkActive="active">Proyectos</a>
```

### 3. Componente con Navegación

![codigo navegacion](assets/navegacion/navegacion-code.png)

```html
<nav>
  <a
    routerLink="/"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
    >Home</a
  >
  <a routerLink="/perfil" routerLinkActive="active">Perfil</a>
  <a routerLink="/trabajos" routerLinkActive="active">Trabajos</a>
  <a [routerLink]="['/proyectos']" routerLinkActive="active">Proyectos</a>
</nav>
```

### 4. Aplicación Funcionando

![navegacion web 1](assets/navegacion/navegacion-server1.png)
![navegacion web 2](assets/navegacion/navegacion-server2.png)

## 🔗 Enlaces del Proyecto

- **Repositorio GitHub**: [https://github.com/nnyez/icc-ppw-u1-01-Fundamentos]
- **GitHub Pages**: [https://nnyez.github.io/icc-ppw-u1-01-Fundamentos/]

## 📝 Notas de Implementación

- Usé Angular 20+ con sintaxis moderna
- Implementé tanto navegación estática como dinámica
- Agregué estilos para mejorar la experiencia de usuario
- Utilicé signals para el manejo de estado moderno
- Apliqué las mejores prácticas de navegación SPA
