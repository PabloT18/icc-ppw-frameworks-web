# Programación y Plataformas Web

# Frameworks Web: Angular 21 + Firebase

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="80" alt="Firebase Logo">
</div>

## 09. Guards y Seguridad de Rutas - Practica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Extender el proyecto que ya tiene AuthService (modulo 08) para:

- redirigir automaticamente a `/auth` cuando no hay sesion
- bloquear `/auth` cuando el usuario ya esta autenticado
- proteger rutas privadas del proyecto incremental (07 + 08)

---

## 2. Precondiciones (estado esperado de 07 y 08)

Antes de empezar, verifica:

- existe `AuthService` con `currentUser` (signal)
- existe ruta `{ path: 'auth', component: AuthPageComponent }`
- existe wildcard `{ path: '**', redirectTo: '' }`
- navbar/header ya reacciona basico a sesion
- rutas de Simpsons del modulo 07 ya funcionan

Snippet de referencia del enrutamiento base actual:

```ts
// ... resto de rutas existentes
{ path: 'auth', component: AuthPageComponent },
{ path: '**', redirectTo: '' },
```

---

## 3. Archivos involucrados

- `src/app/app.routes.ts`
- `src/app/core/guards/auth.guard.ts`
- `src/app/core/guards/guest.guard.ts`
- `src/app/core/services/auth.service.ts` (solo referencia, no necesariamente cambios)
- `src/app/components/app-header/header.ts`
- `src/app/components/app-header/header.html`

---

## 4. Paso 1 - Crear `auth.guard.ts`

Generar guard funcional:

```bash
ng g guard core/guards/auth --functional --skip-tests
```

Implementacion recomendada:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si hay usuario autenticado, permite navegar.
  // Si no hay sesion, redirige a /auth.
  return authService.currentUser()
    ? true
    : router.createUrlTree(['/auth']);
};
```

Explicacion:

- reutiliza la misma fuente de verdad de sesion del modulo 08 (`currentUser()`)
- centraliza la regla de acceso a rutas privadas
- evita repetir validaciones de sesion por componente

---

## 5. Paso 2 - Crear `guest.guard.ts`

Generar guard funcional:

```bash
ng g guard core/guards/guest --functional --skip-tests
```

Implementacion recomendada:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya hay sesion, no tiene sentido volver a /auth.
  return authService.currentUser()
    ? router.createUrlTree(['/'])
    : true;
};
```

Explicacion:

- mantiene limpia la experiencia de usuario autenticado
- evita mostrar login/registro cuando ya existe sesion activa

---

## 6. Paso 3 - Actualizar `app.routes.ts`

Aplicar guards usando la politica del curso:

- home publica (`''`)
- auth solo para visitantes (`guestGuard`)
- rutas privadas con `authGuard`

Ejemplo de configuracion:

```ts
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },

  // Solo visitantes
  { path: 'auth', component: AuthPageComponent, canActivate: [guestGuard] },

  // Privadas
  { path: 'favorites', component: FavoritesPageComponent, canActivate: [authGuard] },
  { path: 'simpsons/:id', component: SimpsonDetailPageComponent, canActivate: [authGuard] },

  // ... resto de rutas existentes
  { path: '**', redirectTo: '' },
];
```

Nota:

- si quieres endurecer acceso, puedes proteger tambien `simpsons` (listado)
- si `simpsons` debe ser publico para demo, deja solo el detalle y favoritos privados

---

## 7. Paso 4 - Sincronizar header con los guards

La UI debe seguir la misma logica de acceso que el Router.

En `header.ts`, usar el signal del servicio:

```ts
private authService = inject(AuthService);
currentUser = this.authService.currentUser;
```

En `header.html`:

- sin sesion: mostrar boton a `/auth`
- con sesion: mostrar email + boton logout + enlaces privados

Esto evita inconsistencias de navegacion y reduce friccion para el usuario.

---

## 8. Paso 5 - Pruebas funcionales obligatorias

Checklist minimo:

1. Usuario anonimo abre ruta privada (`/favorites` o `/simpsons/5`) -> redirige a `/auth`.
2. Usuario anonimo abre `/auth` -> entra normalmente.
3. Usuario autenticado abre `/auth` -> redirige a `/`.
4. Usuario autenticado abre rutas privadas -> acceso permitido.
5. Logout desde header -> bloquea privadas en siguiente navegacion.

---

## 9. Validaciones de calidad

- No hay comprobaciones duplicadas de sesion en cada pagina.
- Todos los redirects de acceso viven en guards.
- No quedan referencias antiguas a `/login`.
- `AuthService.currentUser()` es la base de todas las decisiones de acceso.
- Wildcard se mantiene al final del arreglo de rutas.

Placeholder sugerido de evidencia: `assets/09-guard-redirect.png`

---

## 10. Errores comunes (y como evitarlos)

- Error: proteger solo botones visuales.
  - Solucion: proteger la ruta con `canActivate`.
- Error: mezclar `/login` y `/auth`.
  - Solucion: estandarizar todo en `/auth`.
- Error: redirigir con `router.navigate` desde componentes para acceso.
  - Solucion: mover logica de acceso a guards.
- Error: olvidar `guestGuard`.
  - Solucion: bloquear `/auth` cuando hay sesion.

---

## 11. Entregables

- `authGuard` funcional y operativo.
- `guestGuard` funcional y operativo.
- Rutas privadas protegidas con `canActivate`.
- Ruta `/auth` protegida para invitados.
- Header/navbar sincronizado con estado de sesion.

---

## 12. Commits sugeridos

```bash
git commit -m "feat: crear authGuard y redirigir anonimos a /auth"
git commit -m "feat: crear guestGuard y bloquear /auth para usuarios autenticados"
git commit -m "refactor: proteger rutas privadas y sincronizar header con guards"
```
