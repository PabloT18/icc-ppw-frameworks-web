# Programación y Plataformas Web 

# Frameworks Web: Angular

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## Práctica 3: Navegación en Angular

### Autores

**Nayeli Barbecho y Jordy Romero**  

💻 GitHub: [Nayeli Barbecho y Jordy Romero](https://github.com/Nayelic98/icc-ppw-u1-practicaWebGrupal.git)







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
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ListadoProyectos } from './components/listado-proyectos/listado-proyectos';

@Component({
  selector: 'app-proyecto-page',
  imports: [ListadoProyectos],
  templateUrl: './proyecto-page.html',
  styleUrl: './proyecto-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectoPage {

  name = signal('');
  description= signal('');

  proyectos= signal<Proyecto[]>([
    {id: 1, nombre: 'Proyecto 1', 
    descripcion: 'Descripción del Proyecto 1'},
  ]);

changeName(value: string){
  this.name.set(value);
}
changeDescription(value: string){
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
dellFirstproyecto(){
  this.proyectos.set(this.proyectos().slice(1));  
}

}
```
#### 1.2 Crear ProyectosDosPage
```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProyectosServiceTs } from './services/proyectos-service.ts';
import { ListadoProyectos } from "../proyecto-page/components/listado-proyectos/listado-proyectos";
import { AddProyecto } from '../proyecto-page/components/listado-proyectos/add-proyecto/add-proyecto.js';

@Component({
  selector: 'app-proyectos-dos-page',
  imports: [ListadoProyectos, AddProyecto],
  templateUrl: './proyectos-dos-page.html',
  styleUrl: './proyectos-dos-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosDosPage {
  proyectosService= inject(ProyectosServiceTs);
 }

```

### Paso 2: Configurar las Rutas
```typescript

import { Routes } from '@angular/router';
import { HomePages } from './features/HomePages/HomePages';
import { PerfilPages } from './features/PerfilPages/PerfilPages';
import { ProyectoPage } from './features/proyecto-page/proyecto-page';
import { ProyectosDosPage } from './features/proyectos-dos-page/proyectos-dos-page';
import { FormularioPage } from './features/FormularioPage/FormularioPage';
export const routes: Routes = [
  { path: '', component: HomePages, title: 'Home' },
  { path: 'perfil', component: PerfilPages, title: 'PerfilPages' },
  { path: 'proyecto', component: ProyectoPage, title: 'Proyecto' },
  { path: 'proyectodos', component: ProyectosDosPage, title: 'ProyectoDosPage' },
  { path: 'formulario', component: FormularioPage, title: 'formulario' },
  { path: '**', redirectTo: '' }
];

```
### Paso 3: Agregar al Navbar
```typescript
<nav>
    <!--a href="/">Home</!--a>
    <a-- href="/perfil">About</a-->
    <a routerLink="" routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
    >Home </a> 
    <a routerLink="/perfil"
    routerLinkActive="active">Perfil</a>
    <a routerLink="/proyecto"
    routerLinkActive="active">Proyecto</a>
    <a routerLink="/proyectodos"
    routerLinkActive="active">Proyecto dos</a>
    <a routerLink="/formulario"
    routerLinkActive="active">Formularios</a>

</nav>
```
### Paso 4: Crear Componentes para Proyectos y separarlos en componentes indivuduals

#### 4.1 Crear Componente para Agregar Proyectos
```typescript
import { ChangeDetectionStrategy, Component, output,signal} from '@angular/core';

@Component({
  selector: 'add-proyecto',
  imports: [],
  templateUrl: './add-proyecto.html',
  styleUrl: './add-proyecto.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProyecto {
  name = signal('');
  description= signal('');
  newProyecto= output<Proyecto>();
  removeProyecto= output<number>();
 
  addProyecto(){
    const newProyecto: Proyecto = {
      id:Math.floor (Math.random()*100),
      nombre: this.name(),
      descripcion: this.description()
    };
    this.newProyecto.emit(newProyecto);
    this.name.set('');
    this.description.set('');
  }
  changeName(value: string){
  this.name.set(value);
}
dellFirstproyecto(id:number){
  this.removeProyecto.emit(id);
}
changeDescription(value: string){
  this.description.set(value);
}
 }

```
#### 4.2 Crear Componente para Lista de Proyectos
```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'listado-proyectos',
  imports: [],
  templateUrl: './listado-proyectos.html',
  styleUrl: './listado-proyectos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListadoProyectos {
  listName = input.required<string>();
  proyectos = input.required<Proyecto[]>();
 }

```

### Paso 5: Implementar la Página de Proyectos
```typescript
<h1>Proyectos Page Works!</h1>
<section>
  <div>
    <h3>Lista de Proyectos</h3>
    <h4>Proyecto Agregar {{name()}}</h4>

    <input 
      type="text" 
      placeholder="Nombre del proyecto"
      [value]="name()"
      (change)="changeName(txtName.value)"
      #txtName
    >

    <input 
      type="text" 
      placeholder="Descripción del proyecto"
      [value]="description()"
      (change)="changeDescription(txtdescription.value)"
      #txtdescription
    >

    <button (click)="addProyecto()">Agregar Proyecto</button>
    
  </div>

  <div>
    <h3>Listado</h3>
    <ul>
      @for(proyecto of proyectos(); track $index) {
        <li>{{proyecto.nombre}} - {{proyecto.descripcion}}</li>
      }
    </ul>
  </div>


  <listado-proyectos 
    listName="'Listado de Proyectos'" 
    [proyectos]="proyectos()">
  </listado-proyectos>
</section>

```
### Paso 6: Implementar la Página ProyectosDos
```typescript
<listado-proyectos 
    listName="Listado de Proyectos" 
    [proyectos]="proyectosService.proyectos()">
</listado-proyectos>    
<p>Aqui debe estar un componente que agregue al servicio</p>
<add-proyecto
    (newProyecto)="proyectosService.addProyecto($event)" 
    (removeProyecto)="proyectosService.dellFirstproyecto()">


</add-proyecto>

```

## �📸 Capturas de Implementación

### 1. Configuración de Rutas (app.routes.ts)
Captura de `app.routes.ts`  
![Captura de app.routes.ts](src/app/assets/07_app_routers.png)

---

### 2. Navegación con RouterLink (`nav-bar.html`)
![Captura de nav-bar.html](src/app/assets/08_nav_bar.png)

---

### 3. Componente con Navegación (`nav-bar.ts`)
![Captura del nav-bar.ts](src/app/assets/11_nav_bar_ts.png)

---

### 4. Aplicación Funcionando

![Captura de proyecto_page](src/app/assets/09_parte1_funcionamiento.png)

![Captura de nav-bar.html](src/app/assets/10_parte2_funcionamiento.png)

## 🔗 Enlaces del Proyecto

- **Repositorio GitHub**: [[Enlace al repositorio](https://github.com/Nayelic98/icc-ppw-u1-practicaWebGrupal.git)]
- **GitHub Pages**: [\[Enlace a la aplicación desplegada\]](https://nayelic98.github.io/icc-ppw-u1-practicaWebGrupal/)


## 📝 Notas de Implementación

- Usé Angular 20+ con sintaxis moderna
- Implementé tanto navegación estática como dinámica
- Agregué estilos para mejorar la experiencia de usuario
- Utilicé signals para el manejo de estado moderno
- Apliqué las mejores prácticas de navegación SPA 

