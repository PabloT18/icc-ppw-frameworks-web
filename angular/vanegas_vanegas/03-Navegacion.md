# Programación y Plataformas Web 

# Frameworks Web: Angular

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## Práctica 3: Navegación en Angular

### Autores

*Miguel Ángel Vanegas*   
📧 mvanegasp@est.ups.edu.ec  
💻 GitHub: [MiguelV145](https://github.com/MiguelV145)  
*Jose Vanegas*  
📧 jvanegasp1@est.ups.edu.ec   
💻 GitHub: [josevac1](https://github.com/josevac1)

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
- Paso 1: Haces clic derecho en una carpeta específica de tu proyecto(`features`) y selecionamos la opcion `Angular Schematics: generate a file`

![paso1](/angular/vanegas_vanegas/assets/1.png)

- Paso 2: Te muesta todas las opciones que Agular crear: `Component`,`Service`, `Directive`,`Pipe`, `Guard`, ect. Pero nosotros elegimos el `component`
![paso2](/angular/vanegas_vanegas/assets/2.png)

- Paso3: Asignamos el Nombre ProyectoPage
![paso3](/angular/vanegas_vanegas/assets/3.png)

- Paso4: aqui te pregunta si necesitamos algun modulo pero por ahora ponemos el `None`
![paso4](/angular/vanegas_vanegas/assets/4.png)

- Paso5: hacemos clic en confirmar ya que confirmar ya que configuramos los que necesitamos y se nos crea el `Proyecto-Page.html` y `Proyecto-Page.ts`
![creacionpage](/angular/vanegas_vanegas/assets/proye-page6.png)


#### 1.2 Crear ProyectosDosPage

repetir los pasos de creacion de Proyecto-Page y creamos el Proyecto-dospage

![Proyecto-dospage](/angular/vanegas_vanegas/assets/proye-page7.png)


### Paso 2: Configurar las Rutas
configuracion: `app.routers.ts`

```typescript
import { Routes } from '@angular/router';
import { HomePage } from './features/homePage/homePage';
import { PerfilPage } from './features/perfilPage/perfilPage';
import { ProyectoDospage } from './features/Proyecto-dospage/Proyecto-dospage';
import { ProyectosPage } from './features/Proyectos-page/Proyectos-page';

export const routes: Routes = [
        {
            path: '',
            component: HomePage

        },


        {
            path: 'perfil',
            component: PerfilPage
        },
        {
            path: 'page',
            component: ProyectosPage
        },
        {
            path: 'dospage',
            component: ProyectoDospage
        }       
];
```

### Paso 3: Agregar al Navbar
configuracion: `nav-bar.html`
```html
    <nav>
  <a routerLink="/page" routerLinkActive="active"> Proyectos</a>
  <a routerLink="/dospage" routerLinkActive="active"> ProyectoDospage</a>

</nav>
```
### Paso 4: Crear Componentes para Proyectos y separarlos en componentes indivuduals
 creamos los componentes el de  `listado-proyecto` y `add-proyecto` dentro del la carpeta de `Proyecto-page`

![Componentes](/angular/vanegas_vanegas/assets/componentes.png)

#### 4.1 Crear Componente para Agregar Proyectos

codigo de add-proyecto.ts
```ts
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-add-proyecto',
  imports: [],
  templateUrl: './add-proyecto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProyecto { 

   name=signal ('')
  descripcion= signal('')

  proyectos= signal<Proyecto[]>([{
    id:1, nombre:'Proyecto A',
    descripcion: 'descipcion'
  }]);

  newProyecto =output <Proyecto>();
  removeProyecto=output<number>();
  
   changeName (value: string ){
    this.name.set(value)
  }

  changeDescripcion(value: string){
    this.descripcion.set(value);

  }

  dellProyecto(id: number){
    this.removeProyecto.emit(id);
  }
  addProyecto(){
    const newProyecto: Proyecto ={
      id: Math.floor(Math.random() *1000),
      nombre: this.name(),
      descripcion: this.descripcion()

    };
    this.newProyecto.emit(newProyecto);
    this.name.set('');
    this.descripcion.set('');
    
  }

}

```

codigo de add-proyecto.html
```html
<h1>Proyecto</h1>

<section>
    <div>
        <h3>Agregar proyecto</h3>
        <h4>Proyecto Agregar{{name()}}</h4>
        <input type="text" placeholder="Nombre del proyecto" [value] = "name()" (change)="changeName(txtname.value)" #txtname>
        <input type="text" placeholder="descripcion del proyecto" [value]= "descripcion()" (change)="changeDescripcion(txtdescripcion.value)" #txtdescripcion>
        <button (click)="addProyecto()">Agregar Proyecto</button>
        <button (click)="dellProyecto(1)">eliminar</button>

    </div>
</section>
```

#### 4.2 Crear Componente para Lista de Proyectos

codigo de listado-proyecto.html

```html
<h1>{{listName()}}</h1>

<ul>
    @for(proyecto of proyectos(); track $index){
        <li>{{ proyecto.nombre }} - {{ proyecto.descripcion}}</li>
    }
</ul>
```
codigo de listado-proyecto.ts
```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProyectosPage } from '../../Proyectos-page';

@Component({
  selector: 'app-listado-proyectos',
  imports: [],
  templateUrl: './listado-proyectos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListadoProyectos { 
  listName= input.required<string>();
  proyectos= input.required<Proyecto[]>();
  
}

```


### Paso 5: Implementar la Página de Proyectos

proyecto-page.html

```html
<h1>Proyecto</h1>

<section>
    <div>
        <h3>Agregar proyecto</h3>
        <h4>Proyecto Agregar{{name()}}</h4>
        <input type="text" placeholder="Nombre del proyecto" [value] = "name()" (change)="ChangeName(txtname.value)" #txtname>
        <input type="text" placeholder="descripcion del proyecto" [value]= "descripcion()" (change)="ChangeDescription(txtdescripcion.value)" #txtdescripcion>
        <button (click)="addProyecto()">Agregar Proyecto</button>
        

    </div>
    <div>
        <h3>Listado</h3>
       <!-- <ul>
            <li>Proyecto 1</li>
            <li>Proyecto 2</li>
        </ul>-->
        <ul>
        @for (proyecto of proyectos(); track $index) {
            
            <li>{{proyecto.nombre}} - {{proyecto.descripcion}}</li>
            
        }
        </ul>
    </div>
    <app-listado-proyectos listName="Lista Proyecto"  [proyectos]="proyectos()" ></app-listado-proyectos>
</section>
```
Proyecto-page.ts
```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ListadoProyectos } from './components/listado-proyectos/listado-proyectos';

@Component({
  selector: 'app-proyectos-page',
  imports: [ListadoProyectos],
  templateUrl: './Proyectos-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosPage {
  ChangeName(value: string) {
    this.name.set(value);

  } 
  ChangeDescription(value: string) {
    this.descripcion.set(value);
  } 
  addProyecto() {
    const newProyecto: Proyecto = {
      id: this.proyectos().length + 1,
      nombre: this.name(),
      descripcion: this.descripcion()
    };
    this.proyectos.set([...this.proyectos(), newProyecto]);
    this.name.set('');
    this.descripcion.set('');
  
  }
  name = signal('');
  descripcion =signal('');

  proyectos= signal<Proyecto[]>([

    {
      id:1, nombre: 'Proyecto A',
      descripcion: 'Descripcion del Proyecto A'
    },
    {
      id:2, nombre: 'Proyecto B',
      descripcion: 'Descripcion del Proyecto B'
    }
  ])
 
 
  
}
```
### Paso 6: Implementar la Página ProyectosDos

Proyecto-dospage.html
```html

<app-listado-proyectos listName="Lista deseado"  [proyectos]="ProyectosServices.Proyectos()" ></app-listado-proyectos>
<p>Aqui deberia esatr un componentes qeu agrega a un servicio</p>
<app-add-proyecto (newProyecto)="ProyectosServices.addProyecto($event)"
(removeProyecto)="ProyectosServices.deleteProyecto()" ></app-add-proyecto>

```
Proyecto-dos.ts

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProyectosServices } from './proyectos-services';
import { ListadoProyectos } from "../Proyectos-page/components/listado-proyectos/listado-proyectos";
import { AddProyecto } from '../Proyectos-page/components/add-proyecto/add-proyecto';

@Component({
  selector: 'app-proyecto-dospage',
  imports: [ListadoProyectos, AddProyecto],
  templateUrl: './Proyecto-dospage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectoDospage { 


  ProyectosServices = inject(ProyectosServices);
}

```
Proyecto-services.ts

```ts
import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProyectosServices {

 //proyectos= signal<Proyecto[]>([

   // {
      //id:1, nombre: 'Proyecto A',
      //descripcion: 'Descripcion del Proyecto A'
    //},
    //{
      //id:2, nombre: 'Proyecto B',
      //descripcion: 'Descripcion del Proyecto B'
    //}
  //])
  //addProyecto (proyecto: Proyecto){
    //this.proyectos.set([...this.proyectos(), proyecto]);
  //}
  constructor() { 
    effect (()=>{
      const data=this.Proyectos();
      console.log(data);
      console.log(JSON.stringify(data))
      localStorage.setItem(this.STORAGE_KEY,JSON.stringify(data));
    });
  }
 
   private readonly STORAGE_KEY= 'proyectosApp';

   Proyectos = signal<Proyecto[]>(this.loadProyectos())
   
  private loadProyectos():Proyecto[] {
    const data =localStorage.getItem(this.STORAGE_KEY)

    return data ? JSON.parse(data): [{
      id:1, nombre: 'Proyecto A',
      descripcion: 'Descripcion del Proyecto A'
    }];
  }

 deleteProyecto(){
  this.Proyectos.set([...this.Proyectos().slice(1)])
  } 


  addProyecto (proyecto: Proyecto){
    this.Proyectos.set([...this.Proyectos(), proyecto]);
  }
}

```


## �📸 Capturas de Implementación

### 1. Configuración de Rutas (app.routes.ts)


```Typescript
export const routes: Routes = [
        {
            path: '',
            component: HomePage

        },


        {
            path: 'perfil',
            component: PerfilPage
        },
        {
            path: 'page',
            component: ProyectosPage
        },
        {
            path: 'dospage',
            component: ProyectoDospage
        }
        
        
        
];
```

### 2. Navegación con RouterLink

```Typescript
<nav>
  <!--- <a href="/"= Home</a> 
  <a href="/perfil"> perfil</a> 
  <a href="/page "> Proyectos</a> 
  <a href="/dospage"> ProyectosDospage</a> -->
  
  <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"> Home</a>
  <a routerLink="/perfil" routerLinkActive="active"> perfil</a>
  <a routerLink="/page" routerLinkActive="active"> Proyectos</a>
  <a routerLink="/dospage" routerLinkActive="active"> ProyectoDospage</a>


</nav>
```
### 3. Componente con Navegación
Protecto-dospage.html
```Typescript
<app-listado-proyectos listName="Lista deseado"  [proyectos]="ProyectosServices.Proyectos()" ></app-listado-proyectos>
```

Proyecto-page.hmtl
```Typescript
<app-listado-proyectos listName="Lista deseado"  [proyectos]="ProyectosServices.Proyectos()" ></app-listado-proyectos>
```
### 4. Aplicación Funcionando

- HomePage
![HomePage](/angular/vanegas_vanegas/assets/HomePage.png)

- PerfilPage
![PerfilPage](/angular/vanegas_vanegas/assets/PerfilPage.png)


- ProyectoPage
![ProyectoPage](/angular/vanegas_vanegas/assets/ProyectoPage.png)


- ProyectoDosPage
![ProyectoDosPage](/angular/vanegas_vanegas/assets/ProyectoDosPage.png)



## 🔗 Enlaces del Proyecto

- **Repositorio GitHub**: 

[miguelv145](https://github.com/MiguelV145/icc-ppw-u1-01-Fundamentos)


[josevac1](https://github.com/josevac1/icc-ppw-u1-Fundamentos-Angular)
- **GitHub Pages**: 


[miguelv145](https://miguelv145.github.io/icc-ppw-u1-01-Fundamentos/)


[josevac1](https://josevac1.github.io/icc-ppw-u1-Fundamentos-Angular/)


## 📝 Notas de Implementación

- Usé Angular 20+ con sintaxis moderna
- Implementé tanto navegación estática como dinámica
- Agregué estilos para mejorar la experiencia de usuario
- Utilicé signals para el manejo de estado moderno
- Apliqué las mejores prácticas de navegación SPA 

