# Programación y Plataformas Web

## Frameworks Web: Angular - Guards y Seguridad de Rutas

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## Práctica 12: Protección de Rutas y Guards en Angular

### Autor


**Alexander Chuquipoma**  
📧 [achuquipoma@est.ups.edu.ec](mailto:achuquipoma@est.ups.edu.ec)  
💻 GitHub: [AlexChuquipoma](https://github.com/AlexChuquipoma)

**Juan Fernandez**  
📧 jfernandezl6@est.ups.edu.ec  
💻 GitHub: [Juan0Fernandedez](https://github.com/Juan0Fernandez)

---

## Introducción

En esta práctica se implementará un sistema completo de **protección de rutas** utilizando **Guards** de Angular. Los guards son servicios especializados que controlan el acceso a las rutas de la aplicación, permitiendo implementar lógica de seguridad, autenticación y autorización.

### Objetivos

- Comprender qué son los Guards y cómo funcionan
- Implementar Guards de autenticación
- Proteger rutas según el estado de autenticación del usuario
- Configurar navegación condicional en el Navbar
- Implementar logout y manejo de sesiones

---

## Conceptos Fundamentales

### 1. ¿Qué son los Guards?

Los **Guards** son servicios de Angular que implementan lógica de control de acceso a las rutas. Actúan como "guardianes" que deciden si una navegación puede proceder o debe ser bloqueada/redirigida.

**Analogía del mundo real:**
- Un guard es como un guardia de seguridad en un edificio
- Verifica tus credenciales antes de dejarte entrar
- Puede redirigirte a otra área si no tienes permisos
- Mantiene registro de quién entra y sale

### 2. Tipos de Guards en Angular

| Guard | Descripción | Uso Común |
|-------|-------------|-----------|
| **CanActivate** | Controla si una ruta puede ser activada | Verificar autenticación antes de mostrar una página |
| **CanActivateChild** | Controla acceso a rutas hijas | Proteger secciones completas con sub-rutas |
| **CanDeactivate** | Controla si se puede salir de una ruta | Prevenir pérdida de datos en formularios sin guardar |
| **CanLoad** | Controla si un módulo lazy-loaded puede cargarse | Optimizar carga inicial, solo cargar módulos autorizados |
| **CanMatch** | Controla si una ruta puede coincidir | Rutas dinámicas basadas en condiciones |

### 3. ¿Por qué proteger rutas?

#### Seguridad

```
❌ Sin protección:
Usuario → /admin → Acceso directo a panel de administración

✅ Con protección:
Usuario → /admin → Guard verifica permisos → ✓ Permite o ❌ Redirige a login
```

#### Experiencia de Usuario

```
❌ Sin guards:
Usuario no autenticado → Ve página → Error al cargar datos → Confusión

✅ Con guards:
Usuario no autenticado → Guard redirige a login → Mensaje claro → Inicia sesión
```

#### Organización del Código

```typescript
// ❌ Sin guards: Lógica de autenticación en cada componente
export class SimpsonsPage {
  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    // ... resto del código
  }
}

// ✅ Con guards: Lógica centralizada
// El componente solo se preocupa de su funcionalidad
export class SimpsonsPage {
  ngOnInit() {
    this.loadData();
  }
}
```

### 4. Ciclo de Vida de la Navegación con Guards

```
Usuario hace click en link/botón
          ↓
Angular inicia navegación
          ↓
Ejecuta Guards (en orden)
          ↓
    ¿Guard retorna true?
       /              \
     Sí               No
      ↓                ↓
Navega a la ruta    Cancela navegación
                         ↓
                  Ejecuta redirección (si hay)
```

### 5. Estrategias de Protección

#### Estrategia 1: Protección por Autenticación

```
Rutas Públicas           Rutas Protegidas
- /login                 - /simpsons  ← authGuard
- /register              - /estilos   ← authGuard
- /home                  - /perfil    ← authGuard
```

#### Estrategia 2: Protección por Roles

```
Todos los usuarios       Solo Admin
- /simpsons              - /admin/usuarios  ← adminGuard
- /estilos               - /admin/reportes  ← adminGuard
```

#### Estrategia 3: Protección Mixta

```
                    ┌─────────────────┐
                    │  Rutas Públicas │
                    │  - /login       │
                    │  - /register    │
                    └─────────────────┘
                            ↓
                    ┌─────────────────┐
                    │  authGuard      │
                    │  ¿Autenticado?  │
                    └─────────────────┘
                     /              \
                   Sí               No → Redirige a /login
                    ↓
            ┌──────────────────┐
            │  Rutas de Usuario│
            │  - /simpsons     │
            │  - /estilos      │
            └──────────────────┘
                    ↓
            ┌──────────────────┐
            │  roleGuard       │
            │  ¿Es admin?      │
            └──────────────────┘
             /              \
           Sí               No → Error 403
            ↓
    ┌──────────────────┐
    │  Rutas de Admin  │
    │  - /admin        │
    └──────────────────┘
```

---

## Parte Practica

## Parte 1: Comprender y Crear Guards de Autenticación

### Paso 1: Configuración Inicial de Rutas

Antes de crear los guards, estableceremos la estructura de rutas de la aplicación.

**Actualizar `src/app/app.routes.ts`:**

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/daisyui-page/daisyui-page').then(m => m.DaisyuiPage)
  },
  {
    path: 'estilos',
    loadComponent: () => import('./features/estilos-page/estilos-page').then(m => m.EstilosPage)
  },
  {
    path: 'simpsons',
    loadComponent: () => import('./features/simpsons/pages/simpsons-page/simpsons-page').then(m => m.SimpsonsPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
```

**Estructura de navegación:**
- `/` → Redirige a `/home`
- `/home` → Página pública (sin protección)
- `/estilos` → Requiere autenticación (protegida)
- `/simpsons` → Requiere autenticación (protegida)
- `/login` y `/register` → Solo accesibles si NO estás autenticado

### Paso 2: Generar el Auth Guard

```bash
ng generate guard core/guards/auth
```

**Salida esperada:**
```
? Which type of guard would you like to create? (Use arrow keys)
❯ CanActivate
  CanActivateChild
  CanDeactivate
  CanMatch
```

**Seleccionar:** `CanActivate`

**Archivo creado:** `src/app/core/guards/auth.guard.ts`

### Paso 3: Implementar el Auth Guard

**`src/app/core/guards/auth.guard.ts`:**

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth.service';

/**
 * Guard que protege rutas requiriendo autenticación
 * 
 * Funcionalidad:
 * - Si el usuario está autenticado → Permite el acceso
 * - Si no está autenticado → Redirige a /login
 * - Guarda la URL intentada para redirigir después del login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si hay un usuario autenticado
  if (authService.isAuthenticated()) {
    console.log(' authGuard: Usuario autenticado, permitiendo acceso');
    return true;
  }

  console.log(' authGuard: Usuario no autenticado, redirigiendo a login');
  
  // Guardar la URL intentada para redirigir después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};
```

**Análisis del código:**

1. **`inject(AuthService)`**: Inyecta el servicio de autenticación
2. **`authService.isAuthenticated()`**: Verifica si hay usuario autenticado
3. **`return true`**: Permite la navegación
4. **`return false`**: Cancela la navegación
5. **`queryParams: { returnUrl: state.url }`**: Guarda la URL intentada

**Flujo de ejecución:**

```
Usuario intenta acceder a /simpsons
         ↓
authGuard se ejecuta
         ↓
¿Usuario autenticado?
    /           \
  Sí            No
   ↓             ↓
return true    Navega a /login?returnUrl=/simpsons
   ↓             ↓
Muestra         Usuario inicia sesión
/simpsons          ↓
                Redirige a /simpsons (desde returnUrl)
```

### Paso 4: Generar el Public Guard

```bash
ng generate guard core/guards/public
```

**Seleccionar:** `CanActivate`

### Paso 5: Implementar el Public Guard

**`src/app/core/guards/public.guard.ts`:**

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth.service';

/**
 * Guard que protege rutas públicas (login/register)
 * 
 * Funcionalidad:
 * - Si el usuario NO está autenticado → Permite el acceso
 * - Si está autenticado → Redirige a /home
 * 
 * Evita que usuarios autenticados vean páginas de login/register
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si NO está autenticado, puede acceder a rutas públicas
  if (!authService.isAuthenticated()) {
    console.log('✅ publicGuard: Usuario no autenticado, mostrando página pública');
    return true;
  }

  console.log('❌ publicGuard: Usuario ya autenticado, redirigiendo a home');
  
  // Si ya está autenticado, redirigir a home
  router.navigate(['/home']);
  return false;
};
```

**¿Por qué necesitamos publicGuard?**

```
Sin publicGuard:
Usuario autenticado → Puede ver /login → Confuso (ya está dentro)

Con publicGuard:
Usuario autenticado → Intenta ir a /login → Redirige a /home → UX coherente
```

### Paso 6: Aplicar Guards a las Rutas

**Actualizar `src/app/app.routes.ts`:**

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage),
    canActivate: [publicGuard] // Solo si NO está autenticado
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage),
    canActivate: [publicGuard] // Solo si NO está autenticado
  },
  {
    path: 'home',
    loadComponent: () => import('./features/daisyui-page/daisyui-page').then(m => m.DaisyuiPage)
    // SIN guard: Accesible para todos
  },
  {
    path: 'estilos',
    loadComponent: () => import('./features/estilos-page/estilos-page').then(m => m.EstilosPage),
    canActivate: [authGuard] // Requiere autenticación
  },
  {
    path: 'simpsons',
    loadComponent: () => import('./features/simpsons/pages/simpsons-page/simpsons-page').then(m => m.SimpsonsPage),
    canActivate: [authGuard] // Requiere autenticación
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
```

**Resumen de protecciones:**

| Ruta | Guard | Condición |
|------|-------|-----------|
| `/login` | publicGuard | Solo si NO está autenticado |
| `/register` | publicGuard | Solo si NO está autenticado |
| `/home` | Ninguno | Acceso público |
| `/estilos` | authGuard | Solo si está autenticado |
| `/simpsons` | authGuard | Solo si está autenticado |

### Paso 7: Actualizar Login y Register para navegar a /home

**Modificar `src/app/features/auth/pages/login-page/login-page.ts`:**

```typescript
onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading.set(true);
  this.errorMessage.set(null);

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: () => {
      this.loading.set(false);
      // Cambio: Navegar a /home en lugar de /simpsons
      this.router.navigate(['/home']);
    },
    error: (error) => {
      this.loading.set(false);
      this.errorMessage.set(this.getErrorMessage(error.code));
    }
  });
}
```

**Modificar `src/app/features/auth/pages/register-page/register-page.ts`:**

```typescript
onSubmit() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  this.loading.set(true);
  this.errorMessage.set(null);

  const { email, password } = this.registerForm.value;

  this.authService.register(email, password).subscribe({
    next: () => {
      this.loading.set(false);
      // Cambio: Navegar a /home en lugar de /simpsons
      this.router.navigate(['/home']);
    },
    error: (error) => {
      this.loading.set(false);
      this.errorMessage.set(this.getErrorMessage(error.code));
    }
  });
}
```

---

## Parte 2: Configurar Navbar con Lógica Condicional

El Navbar debe adaptar su comportamiento según el estado de autenticación:

**Estados del Navbar:**

| Estado | Botón Estilos | Botón Simpsons | Acción |
|--------|---------------|----------------|--------|
| **No autenticado** | Deshabilitado | Oculto | Mostrar botón "Iniciar Sesión" |
| **Autenticado** | Habilitado | Visible | Mostrar email del usuario |

### Paso 1: Actualizar NavbarDrawer Component (TypeScript)

**`src/app/shared/components/navbar-drawer/navbar-drawer.ts`:**

```typescript
// .....
export class NavbarDrawerComponent {
 /// ,,,, codigio anteiror 

  // Signal que se actualiza automáticamente cuando cambia el usuario
  currentUser = this.authService.currentUser;

  /**
   * Navega a la página de login
   */
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    if (confirm('¿Cerrar sesión?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al cerrar sesión:', error);
          alert('Error al cerrar sesión');
        }
      });
    }
  }
}
```

### Paso 2: Actualizar NavbarDrawer Component (HTML)

**`src/app/shared/components/navbar-drawer/navbar-drawer.html`:**

```html
<div class="drawer">
    <input
        id="my-drawer-2"
        type="checkbox"
        class="drawer-toggle"
    />

    <div class="drawer-content flex flex-col">
        <!-- Navbar Desktop/Mobile -->
        <div class="navbar bg-base-300 w-full">
            <!-- Botón hamburguesa (solo móvil) -->
            <div class="flex-none lg:hidden">
                <label
                    for="my-drawer-2"
                    aria-label="open sidebar"
                    class="btn btn-square btn-ghost"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="inline-block h-6 w-6 stroke-current"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                    </svg>
                </label>
            </div>

            <!-- Área de usuario/login -->
            <div class="mx-2 flex-1">
                <div class="flex justify-start">
                    <!-- Mostrar botón login si NO está autenticado -->
                    @if (!isAuthenticated()) {
                        <button
                            (click)="navigateToLogin()"
                            class="btn btn-primary"
                        >
                             Iniciar Sesión
                        </button>
                    }

                    <!-- Mostrar email si está autenticado -->
                    @if (isAuthenticated() && currentUser()) {
                        <div class="flex items-center gap-2">
                            <div class="avatar placeholder">
                                <div class="bg-primary text-primary-content w-10 rounded-full">
                                    <span class="text-sm">{{ currentUser()?.email?.charAt(0) }}</span>
                                </div>
                            </div>
                            <span class="text-sm font-medium hidden sm:inline">{{ currentUser()?.email }}</span>
                        </div>
                    }
                </div>
            </div>

            <!-- Menú de navegación (solo desktop) -->
            <div class="hidden flex-none lg:block">
                <ul class="menu menu-horizontal">
                    <!-- Botón Estilos -->
                    <li>
                        @if (isAuthenticated()) {
                            <!-- Habilitado si está autenticado -->
                            <a
                                routerLink="/estilos"
                                routerLinkActive="bg-primary text-primary-content"
                            >
                                 Estilos
                            </a>
                        } @else {
                            <!-- Deshabilitado si NO está autenticado -->
                            <a class="btn-disabled opacity-50 cursor-not-allowed">
                                 Estilos 🔒
                            </a>
                        }
                    </li>

                    <!-- Botón Simpsons - Solo visible si está autenticado -->
                    @if (isAuthenticated()) {
                        <li>
                            <a
                                routerLink="/simpsons"
                                routerLinkActive="bg-primary text-primary-content"
                            >
                                 Simpsons
                            </a>
                        </li>
                    }

                    <!-- Botón Home -->
                    <li>
                        <a
                            routerLink="/home"
                            routerLinkActive="bg-primary text-primary-content"

                        >
                             Home
                        </a>
                    </li>
                </ul>

                <!-- Theme Switcher -->
                <app-theme-switcher></app-theme-switcher>
            </div>
        </div>


    </div>

    <!-- Drawer Sidebar (móvil) -->
    <div class="drawer-side">
        <label
            for="my-drawer-2"
            aria-label="close sidebar"
            class="drawer-overlay"
        ></label>
        
        <div class="flex flex-col justify-between h-full bg-base-200 w-80">
            <!-- Menú principal -->
            <ul class="menu bg-base-200 min-h-full w-80 p-4">
                <!-- Botón Estilos -->
                <li>
                    @if (isAuthenticated()) {
                        <a
                            routerLink="/estilos"
                            routerLinkActive="bg-primary text-primary-content"
                        >
                            Estilos
                        </a>
                    } @else {
                        <a class="btn-disabled opacity-50 cursor-not-allowed">
                             Estilos 🔒
                        </a>
                    }
                </li>

                <!-- Botón Simpsons - Solo visible si está autenticado -->
                @if (isAuthenticated()) {
                    <li>
                        <a
                            routerLink="/simpsons"
                            routerLinkActive="bg-primary text-primary-content"
                        >
                            Simpsons
                        </a>
                    </li>
                }

                <!-- Botón Home -->
                <li>
                    <a
                        routerLink="/home"
                        routerLinkActive="bg-primary text-primary-content"
                    >
                         Home
                    </a>
                </li>
            </ul>

            <!-- Sección inferior -->
            <div class="mt-auto p-4 border-t border-base-300">
                <app-theme-switcher></app-theme-switcher>
            </div>
        </div>
    </div>
</div>
```

**Explicación del código HTML:**

1. **`@if (!isAuthenticated())`**: Muestra botón "Iniciar Sesión" solo si NO está autenticado
2. **`@if (isAuthenticated() && currentUser())`**: Muestra avatar y email si está autenticado
3. **Botón Estilos con dos estados:**
   - Autenticado: Link normal y habilitado
   - No autenticado: Clase `btn-disabled` + icono de candado
4. **Botón Simpsons con `@if`**: Solo aparece si está autenticado
5. **Mismo comportamiento en drawer móvil**

---

Sesion sin inicio de sesion de un usuario 

![alt text](assets/29-firebase-p12.png)

Estado de iniciado sesión

![alt text](assets/30-firebase-p12.png)

## Parte 3: Agregar Funcionalidad de Logout


En esta parte una ves despues de arreglar la parte viuals del boton de logout.
### Paso 1: Agregar Menú Desplegable de Usuario (Desktop)

**Actualizar sección del navbar en `navbar-drawer.html`:**

```html
<!-- Área de usuario/login -->
<div class="mx-2 flex-1">
    <div class="flex justify-start">
        <!-- Mostrar botón login si NO está autenticado -->
        @if (!isAuthenticated()) {
            <button
                (click)="navigateToLogin()"
                class="btn btn-primary"
            >
                🔐 Iniciar Sesión
            </button>
        }

        <!-- Mostrar dropdown de usuario si está autenticado -->
        @if (isAuthenticated() && currentUser()) {
            <div class="dropdown dropdown-end">
                <!-- Avatar con trigger -->
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                        <span class="text-lg font-bold">
                            {{ currentUser()?.email?.charAt(0).toUpperCase() }}
                        </span>
                    </div>
                </label>

                <!-- Menú desplegable -->
                <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-56">
                    <!-- Email del usuario -->
                    <li class="menu-title">
                        <span class="text-xs">{{ currentUser()?.email }}</span>
                    </li>
                    
                    <div class="divider my-0"></div>
                    
                    <!-- Botón de logout -->
                    <li>
                        <button 
                            (click)="logout()"
                            class="text-error hover:bg-error hover:text-error-content"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>
        }
    </div>
</div>
```

### Paso 2: Agregar Logout en Drawer Móvil

**Actualizar sección inferior del drawer en `navbar-drawer.html`:**

```html
<!-- Sección inferior del drawer -->
<div class="mt-auto p-4 border-t border-base-300 space-y-3">
    <!-- Información de usuario si está autenticado -->
    @if (isAuthenticated() && currentUser()) {
        <div class="flex items-center gap-3 p-3 bg-base-300 rounded-lg">
            <div class="avatar placeholder">
                <div class="bg-primary text-primary-content w-10 rounded-full">
                    <span class="text-sm font-bold">
                        {{ currentUser()?.email?.charAt(0).toUpperCase() }}
                    </span>
                </div>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">
                    {{ currentUser()?.email }}
                </p>
            </div>
        </div>

        <!-- Botón de logout -->
        <button
            (click)="logout()"
            class="btn btn-error btn-sm w-full"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
        </button>
    }

    <!-- Theme Switcher -->
    <app-theme-switcher></app-theme-switcher>
</div>
```

---

## Parte 4: Probar el Sistema Completo

### Checklist de Pruebas

#### 1. Navegación sin Autenticación

- [ ] **Acceder a `/`** → Redirige a `/home` ✅
- [ ] **Click en "Estilos"** → Botón deshabilitado, no navega ✅
- [ ] **Botón "Simpsons"** → No visible ✅
- [ ] **Acceder directamente a `/estilos`** → Redirige a `/login` ✅
- [ ] **Acceder directamente a `/simpsons`** → Redirige a `/login` ✅
- [ ] **Mostrar botón "Iniciar Sesión"** → Visible ✅

#### 2. Proceso de Login

- [ ] **Click en "Iniciar Sesión"** → Navega a `/login` ✅
- [ ] **Llenar formulario y login** → Navega a `/home` ✅
- [ ] **Navbar muestra email** → Avatar con inicial visible ✅
- [ ] **Botón "Estilos" habilitado** → Permite navegación ✅
- [ ] **Botón "Simpsons" visible** → Permite navegación ✅

#### 3. Navegación Autenticado

- [ ] **Click en "Estilos"** → Navega correctamente ✅
- [ ] **Click en "Simpsons"** → Navega correctamente ✅
- [ ] **Intentar ir a `/login`** → Redirige a `/home` ✅
- [ ] **Intentar ir a `/register`** → Redirige a `/home` ✅

#### 4. Logout

- [ ] **Click en avatar** → Muestra menú desplegable ✅
- [ ] **Click en "Cerrar Sesión"** → Muestra confirmación ✅
- [ ] **Confirmar logout** → Navega a `/login` ✅
- [ ] **Botón "Estilos" deshabilitado** → Después de logout ✅
- [ ] **Botón "Simpsons" oculto** → Después de logout ✅

#### 5. Responsive (Móvil)

- [ ] **Abrir drawer móvil** → Menú lateral aparece ✅
- [ ] **Botones con mismo comportamiento** → Igual que desktop ✅
- [ ] **Información de usuario** → Visible en drawer si autenticado ✅
- [ ] **Botón logout en drawer** → Funcional ✅

### Casos de Prueba Detallados

#### Caso 1: Usuario No Autenticado Intenta Acceder a Ruta Protegida

**Pasos:**
1. Abrir navegador en modo incógnito
2. Ir a `http://localhost:4200/simpsons`

**Resultado Esperado:**
```
1. authGuard detecta: Usuario no autenticado
2. Guarda returnUrl: /simpsons
3. Redirige a: /login?returnUrl=/simpsons
4. Muestra página de login
```

**Verificar:**
- URL contiene `?returnUrl=/simpsons`
- Página de login se muestra
- No hay errores en consola

#### Caso 2: Usuario Se Autentica y Usa returnUrl

**Pasos:**
1. Desde la URL `/login?returnUrl=/simpsons`
2. Iniciar sesión correctamente

**Resultado Esperado:**
```
1. Login exitoso
2. Navega a /home (navegación del componente)
3. Usuario puede ir manualmente a /simpsons
4. authGuard permite acceso
```

**Verificar:**
- Redirección funciona
- authGuard no bloquea
- Datos de favoritos cargan correctamente

#### Caso 3: Usuario Autenticado Intenta Acceder a Login

**Pasos:**
1. Con sesión activa
2. Navegar a `/login`

**Resultado Esperado:**
```
1. publicGuard detecta: Usuario autenticado
2. Redirige a: /home
3. No muestra página de login
```

**Verificar:**
- Redirección inmediata
- No flicker de página de login

---

## Parte 5: Mejoras Adicionales y Optimizaciones Opcionales

### 1. Manejo de returnUrl en Login

**Actualizar `login-page.ts` para usar returnUrl:**

```typescript
import { ActivatedRoute } from '@angular/router';

export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Agregar

  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  private returnUrl: string = '/home'; // Default

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Obtener returnUrl de los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        // Usar returnUrl en lugar de ruta fija
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(this.getErrorMessage(error.code));
      }
    });
  }
}
```

### 2. Indicador de Carga en Logout

**Agregar loading state en `navbar-drawer.ts`:**

```typescript
export class NavbarDrawerComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  loggingOut = signal(false); // Agregar

  logout() {
    if (confirm('¿Cerrar sesión?')) {
      this.loggingOut.set(true);
      
      this.authService.logout().subscribe({
        next: () => {
          this.loggingOut.set(false);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loggingOut.set(false);
          console.error('Error al cerrar sesión:', error);
          alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
        }
      });
    }
  }
}
```

**Actualizar botón de logout en HTML:**

```html
<button
    (click)="logout()"
    [disabled]="loggingOut()"
    class="text-error hover:bg-error hover:text-error-content"
>
    @if (loggingOut()) {
        <span class="loading loading-spinner loading-xs"></span>
        Cerrando sesión...
    } @else {
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar Sesión
    }
</button>
```

### 3. Modal de Confirmación Personalizado

En lugar de `confirm()` nativo, crear un modal de DaisyUI.

**Agregar en `navbar-drawer.html`:**

```html
<!-- Modal de confirmación de logout -->
<dialog id="logout_modal" class="modal">
    <div class="modal-box">
        <h3 class="font-bold text-lg">Cerrar Sesión</h3>
        <p class="py-4">¿Estás seguro de que deseas cerrar sesión?</p>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-ghost">Cancelar</button>
            </form>
            <button 
                class="btn btn-error"
                (click)="confirmLogout()"
            >
                Sí, cerrar sesión
            </button>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
```

**Actualizar métodos en `navbar-drawer.ts`:**

```typescript
openLogoutModal() {
  const modal = document.getElementById('logout_modal') as HTMLDialogElement;
  modal?.showModal();
}

confirmLogout() {
  const modal = document.getElementById('logout_modal') as HTMLDialogElement;
  modal?.close();
  
  this.loggingOut.set(true);
  
  this.authService.logout().subscribe({
    next: () => {
      this.loggingOut.set(false);
      this.router.navigate(['/login']);
    },
    error: (error) => {
      this.loggingOut.set(false);
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión');
    }
  });
}

// Cambiar logout() para usar el modal
logout() {
  this.openLogoutModal();
}
```

### 4. Toast Notifications para Logout

**Instalar ngx-toastr (si no lo tienes):**

```bash
npm install ngx-toastr @angular/animations
```

**Configurar en `app.config.ts`:**

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ]
};
```

**Usar en `navbar-drawer.ts`:**

```typescript
import { ToastrService } from 'ngx-toastr';

export class NavbarDrawerComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService); // Agregar

  confirmLogout() {
    const modal = document.getElementById('logout_modal') as HTMLDialogElement;
    modal?.close();
    
    this.loggingOut.set(true);
    
    this.authService.logout().subscribe({
      next: () => {
        this.loggingOut.set(false);
        this.toastr.success('Sesión cerrada correctamente', 'Hasta pronto!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loggingOut.set(false);
        console.error('Error al cerrar sesión:', error);
        this.toastr.error('No se pudo cerrar la sesión', 'Error');
      }
    });
  }
}
```

### 5. Indicador Visual de Ruta Protegida

Agregar un icono de candado en botones protegidos cuando no estás autenticado:

```html
<!-- Botón Estilos con indicador -->
<li>
    @if (isAuthenticated()) {
        <a
            routerLink="/estilos"
            routerLinkActive="bg-primary text-primary-content"
        >
            🎨 Estilos
        </a>
    } @else {
        <a 
            class="btn-disabled opacity-50 cursor-not-allowed tooltip tooltip-bottom"
            data-tip="Inicia sesión para acceder"
        >
            🎨 Estilos 
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </a>
    }
</li>
```

---

## Preguntas Frecuentes

### 1. ¿Por qué usar Guards en lugar de verificar en el componente?

**Sin Guards (❌ Código duplicado):**
```typescript
// En cada componente
export class SimpsonsPage {
  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadData();
  }
}
```

**Con Guards (✅ Centralizado):**
```typescript
// En las rutas (una sola vez)
{
  path: 'simpsons',
  component: SimpsonsPage,
  canActivate: [authGuard]
}

// Componente limpio
export class SimpsonsPage {
  ngOnInit() {
    this.loadData();
  }
}
```

### 2. ¿Los Guards protegen realmente mi aplicación?

**⚠️ Importante:**
- Guards protegen la **navegación** en el cliente
- NO protegen el **backend** ni los **datos**
- Siempre implementar seguridad en el servidor

**Arquitectura completa:**
```
Frontend (Angular)          Backend (Firebase)
├── Guards                  ├── Security Rules
│   └── authGuard           │   └── Verificar auth.uid
├── Validación UI           ├── Validar estructura
└── UX coherente            └── Control de acceso
```

### 3. ¿Puedo tener múltiples Guards en una ruta?

**Sí, se ejecutan en orden:**

```typescript
{
  path: 'admin',
  component: AdminPage,
  canActivate: [authGuard, adminGuard]
  // 1. authGuard: ¿Está autenticado?
  // 2. adminGuard: ¿Es admin?
}
```

### 4. ¿Cómo depurar Guards que no funcionan?

**Agregar logs:**

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ authGuard ejecutándose');
  console.log('Usuario actual:', authService.currentUser());
  console.log('¿Autenticado?:', authService.isAuthenticated());
  console.log('Ruta solicitada:', state.url);

  if (authService.isAuthenticated()) {
    console.log('✅ Acceso permitido');
    return true;
  }

  console.log('❌ Acceso denegado, redirigiendo a login');
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};
```

### 5. ¿Cómo implemento Guards con roles de usuario?

**Paso 1: Extender la interfaz de usuario:**

```typescript
// src/app/core/interfaces/user-profile.interface.ts
export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  displayName?: string;
}
```

**Paso 2: Actualizar AuthService:**

```typescript
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  
  currentUser = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);

  constructor() {
    this.user$.subscribe(async user => {
      this.currentUser.set(user);
      
      if (user) {
        // Cargar perfil del usuario desde Firestore
        const profileDoc = await getDoc(
          doc(this.firestore, 'users', user.uid)
        );
        
        if (profileDoc.exists()) {
          this.userProfile.set(profileDoc.data() as UserProfile);
        }
      } else {
        this.userProfile.set(null);
      }
    });
  }

  hasRole(role: string): boolean {
    const profile = this.userProfile();
    return profile?.role === role;
  }
}
```

**Paso 3: Crear Guard de Rol:**

```bash
ng generate guard core/guards/admin
```

```typescript
// src/app/core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primero verificar autenticación
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Luego verificar rol
  if (authService.hasRole('admin')) {
    console.log('✅ adminGuard: Usuario es admin, permitiendo acceso');
    return true;
  }

  console.log('❌ adminGuard: Usuario no es admin, acceso denegado');
  router.navigate(['/forbidden']); // Página de error 403
  return false;
};
```

**Paso 4: Aplicar en rutas:**

```typescript
{
  path: 'admin',
  loadComponent: () => import('./features/admin/admin-page').then(m => m.AdminPage),
  canActivate: [authGuard, adminGuard] // Ambos guards
}
```

**Paso 5: Crear documento de usuario en Firestore al registrarse:**

```typescript
// En register-page.ts
onSubmit() {
  const { email, password } = this.registerForm.value;

  this.authService.register(email, password).subscribe({
    next: async (userCredential) => {
      // Crear documento de perfil en Firestore
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        role: 'user', // Rol por defecto
        displayName: userCredential.user.displayName || ''
      };

      await setDoc(
        doc(this.firestore, 'users', userCredential.user.uid),
        userProfile
      );

      this.router.navigate(['/home']);
    },
    error: (error) => {
      this.errorMessage.set(this.getErrorMessage(error.code));
    }
  });
}
```

**Paso 6: Configurar reglas de Firestore:**

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de usuarios
    match /users/{userId} {
      // Usuarios pueden leer su propio perfil
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Solo admins pueden actualizar roles
      allow update: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // El sistema crea perfiles al registrarse
      allow create: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Paso 7: Mostrar contenido condicional en UI:**

```html
<!-- navbar-drawer.html -->
@if (authService.hasRole('admin')) {
    <li>
        <a routerLink="/admin">
            👑 Panel Admin
        </a>
    </li>
}
```

---

## Recursos Adicionales

- **[Angular Guards Documentation](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)**
- **[Firebase Security Rules](https://firebase.google.com/docs/rules)**
- **[RxJS Operators](https://rxjs.dev/guide/operators)**
- **[DaisyUI Components](https://daisyui.com/components/)**

---

## Conclusión

En esta práctica se ha implementado:

Guards de autenticación para proteger rutas  
Lógica condicional en Navbar según estado de autenticación  
Funcionalidad de logout con confirmación  
Navegación responsive con mismo comportamiento  
Manejo de returnUrl para UX fluida  
Implementación opcional de roles de usuario  

Este sistema de protección de rutas es fundamental para cualquier aplicación que requiera autenticación y control de acceso, proporcionando una base sólida para implementar seguridad en aplicaciones Angular modernas.
