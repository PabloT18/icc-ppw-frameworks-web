# Programación y Plataformas Web 

# Frameworks Web: Angular

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## Práctica 3: Navegación en Angular

### Autores


*Valeria Mantilla*
📧 [amantillac3@est.ups.edu.ec](mailto:amantillac3@est.ups.edu.ec)
💻 GitHub: [Alanissette16](https://github.com/Alanissette16)

*Claudia Quevedo*
📧 [cquevedor@ups.edu.ec](mailto:cquevedor@ups.edu.ec)
💻 GitHub: [clcmono](https://github.com/clcmono)

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
}

@for (producto of productos; track producto.id) {
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
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
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
  styles: [`
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
  `]
})
export class AppComponent {
  title = 'navegacion-ejemplo';
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

| Aspecto | Sintaxis String | Sintaxis Array |
|---------|----------------|----------------|
| **Formato** | `routerLink="/ruta"` | `[routerLink]="['/ruta']"` |
| **Parámetros** | ❌ No soporta | ✅ `['/ruta', parametro]` |
| **Variables** | ❌ Solo texto fijo | ✅ Puede usar variables |
| **Complejidad** | Simple | Más flexible |

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
  <a routerLink="/" 
     routerLinkActive="active" 
     [routerLinkActiveOptions]="{exact: true}">
    Inicio
  </a>
  
  <a routerLink="/productos" 
     routerLinkActive="active">
    Productos
  </a>
  
  <a routerLink="/contacto" 
     routerLinkActive="active">
    Contacto
  </a>
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
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ejemplo',
  template: `
    <button (click)="irAProductos()">Ver Productos</button>
    <button (click)="irAProducto(123)">Ver Producto 123</button>
  `
})
export class EjemploComponent {
  private router = inject(Router);
  
  irAProductos() {
    this.router.navigate(['/productos']);
  }
  
  irAProducto(id: number) {
    this.router.navigate(['/producto', id]);
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
#### 1.1 Crear ProyectosPage

```typescript
@Component({
  selector: 'app-proyectos-page',
  imports: [ListadoProyecto],
  templateUrl: './ProyectosPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```
* Este componente representa la página principal de proyectos. 
Importa el listado de proyectos y renderiza su contenido en la plantilla.

#### 1.2 Crear ProyectosDosPage
```typescript
@Component({
  selector: 'app-proyecto-dos-page',
  imports: [ListadoProyecto,AddProyecto],
  templateUrl: './ProyectoDosPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```
* Esta página carga tanto el listado como el formulario de agregar proyectos, conectados a un servicio para gestionar la información.

### Paso 2: Configurar las Rutas
```typescript
import { Routes } from '@angular/router';
import { FormularioPage } from './features/formularioPage/formularioPage';
import { HomePage } from './features/homePage/homePage';
import { PerfilPage } from './features/perfilPage/perfilPage';
import { ProyectoDosPage } from './features/ProyectoDosPage/ProyectoDosPage';
import { ProyectosPage } from './features/ProyectosPage/ProyectosPage';

export const routes: Routes = [
    {
        path: "",
        component: HomePage
        
    }
    ,
    {
        path: 'perfil',
        component: PerfilPage
    },

    {
        path:'proyectos',
        component: ProyectosPage
    },
    
    {
        path:'proyectos-dos',
        component: ProyectoDosPage
    },
    
    {
        path:'formulario',
        component: FormularioPage
    }

];
```
```typeScript
export const routes: Routes = [...]
```
* Este archivo define las rutas de la aplicación.
Cada objeto indica qué componente se muestra según la URL (ejemplo: /perfil, /proyectos).

### Paso 3: Agregar al Navbar
```html
<nav>
    
    <a 
    routerLink="" 
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
    >Home</a>
    <a 
    [routerLink]="['/perfil']" 
    routerLinkActive="active"
    >Perfil</a>

    <a 
    routerLink="proyectos"
    routerLinkActive="active"
    >Proyectos</a>

    <a routerLink="proyectos-dos"
    routerLinkActive="active"
    >ProyectosDos</a>

    <a routerLink="formulario"
    routerLinkActive="active"
    >Formulario</a>
    
</nav>
```
```typescript
styles: [`
     nav {
        background-color: #ad46f1ff;
        padding: 1rem;
      }
      a {
        color: white;
        margin-right: 1rem;
        text-decoration: none;
      }
      a.active{
        color:yellow;
        text-decoration: underline;
      }
      a:hover {
        text-decoration: underline;
      }
  `],
```
```html
<nav> ... </nav>
```
* Este menú permite navegar entre las diferentes páginas usando routerLink sin recargar la aplicación.
routerLinkActive aplica estilos al enlace que está activo.

### Paso 4: Crear Componentes para Proyectos y separarlos en componentes indivuduals
#### 4.1 Crear Componente para Agregar Proyectos
```html
<div>
<h3>Agregar proyecto</h3>
<h4>Proyecto a Agregar: {{ name() }}</h4>

<input
  type="text"
  placeholder="Nombre del proyecto"
  [value]="name()"
  (change)="changeName(txtName.value)"
  #txtName
/>
<input
  type="text"
  placeholder="Descripcion del proyecto"
  [value]="description()"
  (change)="changeDescription(txtName.value)"
  #txtDescription
/>
<button (click)="addProyecto()">Agregar</button>
<button (click)="dellProyecto(1)">Eliminar</button>
</div>
```
* Formulario sencillo con campos para nombre y descripción, más botones para agregar o eliminar un proyecto.

```typescript
@Component({
  selector: 'add-proyecto',
  imports: [],
  templateUrl: './add-proyecto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class AddProyecto {
  

  newProyecto = output<Proyecto>();
  removeProyecto = output<number>();
  name = signal('');
  description = signal('');

  dellProyecto(id: number){
    this.removeProyecto.emit(id);
  }
  
  changeName(value: string) {
  this.name.set(value);
  }

  changeDescription(value: string) {
  this.description.set(value);
  }

  addProyecto(){
    const newProyecto: Proyecto = {
      id: Math.floor(Math.random() * 1000),
      nombre: this.name(),
      descripcion: this.description()
    };
    this.newProyecto.emit(newProyecto);
    this.name.set('');
    this.description.set('');
  }

}
```
- Maneja los campos mediante signals.
- Emite eventos al padre para agregar o eliminar proyectos.
- Genera un ID aleatorio al crear un nuevo proyecto.

#### 4.2 Crear Componente para Lista de Proyectos
```typescript
@Component({
  selector: 'listado-proyecto',
  imports: [],
  templateUrl: './listado-proyecto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListadoProyecto { 

  listName = input.required<string>();
  proyectos = input.required<Proyecto[]>();
}
```
* Lista los proyectos recibidos como inputs.
```html
<h1>{{listName()}}</h1>
<ul>
    @for (proyecto of proyectos(); track $index) {
    <li>{{proyecto.nombre}} - {{proyecto.descripcion}} </li>
}
</ul>
```
- Recibe el nombre del listado y el arreglo de proyectos.
- Solo muestra datos, no los modifica.
### Paso 5: Implementar la Página de Proyectos
```html
<section>
    <div>
        <h3>Agregar proyecto</h3>
        <h4>Proyecto a Agregar: {{name()}}</h4>

        <input 
        type="text"
        placeholder="Nombre del proyecto"
        [value]="name()"
        (change)="changeName(txtName.value)"
        #txtName
        >
        <input
        type="text"
        placeholder="Descripcion del proyecto"
        [value]="description()"
        (change)="changeDescription(txtName.value)"
        #txtDescription
        >
        <button (click)="addProyecto()">Agregar</button>
    </div>
    <div>
        <h3>Listado</h3>
        <ul>
            <li>Proyecto 1</li>
        </ul>

        @for (proyecto of proyectos(); track $index) {
            <li>{{proyecto.nombre}} - {{proyecto.descripcion}} </li>
        }
    </div>
    <listado-proyecto
        listName="Listado de proyectos" 
        [proyectos]="proyectos()"
    > </listado-proyecto>
</section>
```
* Contiene el formulario para agregar proyectos y el listado donde se muestran.
```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ListadoProyecto } from './components/listado-proyecto/listado-proyecto';

@Component({
  selector: 'app-proyectos-page',
  imports: [ListadoProyecto],
  templateUrl: './ProyectosPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProyectosPage {
  name = signal('');
  description = signal('');

  proyectos = signal<Proyecto[]>([
    {
      id: 1, nombre: 'Proyecto A',
      descripcion: 'Descripción'
    },
  ])

  changeName(value: string) {
  this.name.set(value);
  }

  changeDescription(value: string) {
  this.description.set(value);
  }

  addProyecto(){
    const newProyecto: Proyecto = {
      id: this.proyectos().length + 1,
      nombre: this.name(),
      descripcion: this.description()
    };
    this.proyectos.set([...this.proyectos(), newProyecto]);
    this.name.set('');
    this.description.set(''); 
  }
  
}
```
- Maneja el estado local de la página con signals.
- Agrega nuevos proyectos al arreglo y actualiza la vista.
### Paso 6: Implementar la Página ProyectosDos
```html
<listado-proyecto
        listName="Listado de proyectos desde Service" 
        [proyectos]="proyectosService.proyectos()"
></listado-proyecto>

<p>Aqui deberia estar un componente que agrege al servicio</p>
<add-proyecto 
(newProyecto)="proyectosService.addProyecto($event)"
(removeProyecto)="proyectosService.delFirstProyecto()"
></add-proyecto>
```
* Muestra el listado y el componente de agregar proyecto, pero esta vez conectados a un servicio.
```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddProyecto } from '../ProyectosPage/components/listado-proyecto/add-proyecto/add-proyecto';
import { ListadoProyecto } from '../ProyectosPage/components/listado-proyecto/listado-proyecto';
import { ProyectosService } from './services/proyectos-service';

@Component({
  selector: 'app-proyecto-dos-page',
  imports: [ListadoProyecto,AddProyecto],
  templateUrl: './ProyectoDosPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProyectoDosPage { 

  proyectosService = inject(ProyectosService);
}
```
- Inyecta el servicio para centralizar la información.
- Permite agregar y eliminar proyectos desde el servicio.
## �📸 Capturas de Implementación

### 1. Configuración de Rutas (app.routes.ts)
*[Insertar código del archivo app.routes.ts mostrando la configuración de rutas]*
![Conf de app.routes.ts](image-1.png)

* Muestra cómo configurar las rutas en Angular para navegar entre las diferentes páginas de la aplicación.
### 2. Navegación con RouterLink
*[Insertar código del template HTML mostrando ambos tipos de sintaxis de routerLink]*
![routerLink](image-2.png)

* Se muestra cómo usar las directivas routerLink y routerLinkActive para navegar entre las páginas de la aplicación sin recargar la página completa.

### 3. Componente con Navegación
*[Insertar código del código TypeScript del componente con navegación]*
![nav-bar.ts](image-3.png)

* Componente que incluye navegación mediante routerLink

### 4. Aplicación Funcionando
*[Insertar captura de la aplicación en el navegador mostrando la navegación entre diferentes vistas]*
![Home](image-5.png)
![Perfil](image-6.png)
![Proyectos](image-7.png)
![ProyectosDos](image-8.png)

## 🔗 Enlaces del Proyecto

- **Repositorio GitHub**:
- [[Alanissette16](https://github.com/Alanissette16/icc-ppw-u2-01_fundamentos.git)]

- [[clcmono](https://github.com/clcmono/icc-ppw-u1-01-Fundamentos-Angular.git)]

- **GitHub Pages**:
- [[Enlace GitHubPages Alanissette16](https://alanissette16.github.io/icc-ppw-u2-01_fundamentos/)]

- [[Enlace GitHubPages clcmono](https://clcmono.github.io/icc-ppw-u1-01-Fundamentos-Angular/)]


## 📝 Notas de Implementación

- Usé Angular 20+ con sintaxis moderna
- Implementé tanto navegación estática como dinámica
- Agregué estilos para mejorar la experiencia de usuario
- Utilicé signals para el manejo de estado moderno
- Apliqué las mejores prácticas de navegación SPA 

