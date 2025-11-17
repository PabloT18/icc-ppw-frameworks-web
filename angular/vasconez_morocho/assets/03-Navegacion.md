# Programación y Plataformas Web 

# Frameworks Web: Angular

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## Práctica 3: Navegación en Angular

### Autores

**Leo Vásconez**  
📧 lvasconezj@est.ups.edu.ec  
💻 GitHub: [LeoFV87](https://github.com/LeoFV87)

**Michelle Morocho**  
📧 mmorochop3@est.ups.edu.ec
💻 GitHub: [Michelle97-bit](https://github.com/Michelle97-bit)

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

![Proyectos Page](capturas/componentes/proyectos-page-estructura.png)

Proyectos Page HTML

![Proyectos Page HTML](capturas/componentes/codigo-proyectos-page-html.png)

Proyectos Page TS

![Proyectos Page TS](capturas/componentes/codigo-proyectos-ts.png)

Componente add-proyecto

![Proyectos add proyecto html](capturas/componentes/proyectos-add-proyecto.png)

![Proyectos add proyecto ts](capturas/componentes/proyectos-add-proyecto-ts.png)


Componente listado-proyectos

![Proyectos listado proyectos html](capturas/componentes/proyectos-listado-html.png)

![Proyectos listado proyectos ts](capturas/componentes/proyectos-listado-ts.png)

Interfaces proyecto-int.ts

![Proyectos Interface](capturas/componentes/proyectos-interface.png)


#### 1.2 Crear ProyectosDosPage

![Proyectos Dos Page Estructura](capturas/componentes/proyectos-dos-page-estructura.png)

Proyectos Dos Page HTML

![Proyectos Dos Page HTML](capturas/componentes/proyectos-dos-html.png)

Proyectos Dos Page TS

![Proyectos Dos Page TS](capturas/componentes/proyectos-dos-ts.png)

Servicio Proyectos-service.ts

![Proyectos Dos Page Service](capturas/componentes/proyectos-dos-service.png)

#### 1.3 Crear Nav Bar

![Nav Bar HTML](capturas/instalacion/nav-bar-html.png)

![Nav Bar TS](capturas/instalacion/nav-bar-ts.png)

#### 1.4 Crear Formularios

![Formulario html](capturas/formularios/formulario-html.png)

![Formulario TS](capturas/formularios/formulario-ts.png)

### Paso 2: Configurar las Rutas

Ejemplo de como configurar rutas:

![Rutas 1](capturas/instalacion/app-routes2.png)

Copiamos lo del selector y en este caso lo agregamos al nav bar en el siguiente paso.

### Paso 3: Agregar al Navbar

![Rutas 2](capturas/instalacion/nav-bar-html.png)


### Paso 4: Crear Componentes para Proyectos y separarlos en componentes individuales

#### 4.1 Crear Componente para Agregar Proyectos

Como se vió anteriromente el componente add proyecto se encarga de agregar los proyectos

![Proyectos listado proyectos html](capturas/componentes/proyectos-listado-html.png)

![Proyectos add proyecto ts](capturas/componentes/proyectos-add-proyecto-ts.png)

#### 4.2 Crear Componente para Lista de Proyectos

Como se vió anteriormente el componente listar proyectos se encarga de listar los proyectos

![Proyectos listado proyectos html](capturas/componentes/proyectos-listado-html.png)

![Proyectos listado proyectos ts](capturas/componentes/proyectos-listado-ts.png)


### Paso 5: Implementar la Página de Proyectos

![Proyectos Page](capturas/componentes/proyectos-page.png)


### Paso 6: Implementar la Página ProyectosDos

![Proyectos Dos Page](capturas/componentes/proyectos-dos-page.png)

## �📸 Capturas de Implementación

### 1. Configuración de Rutas (app.routes.ts)

![App routes](capturas/instalacion/app-routes2.png)

### 2. Navegación con RouterLink

![App HTML](capturas/instalacion/app-html.png)

![Nav Bar](capturas/instalacion/nav-bar-ts.png)

En nav-bar.ts importamos RouterLink y Router Link Active

![Nav Bar](capturas/instalacion/nav-bar-html.png)


### 3. Componente con Navegación

A traves del componente nav-bar.ts (Barra de navegación) controlamos los demás componentes y podemos navegar alternandolos
Como pudimos apreciar en las capturas anteriores.

![Nav Bar](capturas/instalacion/nav-bar-ts.png)

### 4. Aplicación Funcionando

![Pagina Funcionando 1](capturas/instalacion/aplicacion-funcionando-1.png)

![Pagina Funcionando 2](capturas/instalacion/aplicacion-funcionando-2.png)

![Pagina Funcionando 3](capturas/componentes/proyectos-page.png)

![Pagina Funcionando 3](capturas/instalacion/aplicacion-funcionando-3.png)


## 🔗 Enlaces del Proyecto

- **Repositorio GitHub**: (https://github.com/LeoFV87/icc-ppw-fundamentos)
- **GitHub Pages**: (https://LeoFV87.github.io/icc-ppw-fundamentos/)


## 📝 Notas de Implementación

- Usé Angular 20+ con sintaxis moderna
- Implementé tanto navegación estática como dinámica
- Agregué estilos para mejorar la experiencia de usuario
- Utilicé signals para el manejo de estado moderno
- Apliqué las mejores prácticas de navegación SPA 

