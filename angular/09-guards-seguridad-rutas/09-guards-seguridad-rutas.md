# Programación y Plataformas Web

# Frameworks Web: Angular 21 + Firebase

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="80" alt="Firebase Logo">
</div>

## 09. Guards y Seguridad de Rutas

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Aplicar control de navegacion basado en el estado real de sesion (Firebase) para que:

- usuarios no autenticados sean redirigidos automaticamente a `/auth`
- usuarios autenticados puedan navegar a las rutas privadas
- la UI y el Router queden sincronizados con la misma regla de acceso

Este modulo se apoya directamente en lo construido en 07 (rutas/HTTP/detalle) y 08 (AuthService + sesion real).

---

## 2. Contexto del proyecto incremental

Estado al cerrar modulo 08:

- existe `AuthService` con `currentUser` como signal reactivo
- existe ruta de autenticacion unificada: `{ path: 'auth', component: AuthPageComponent }`
- existe wildcard: `{ path: '**', redirectTo: '' }`
- el header ya puede reaccionar a sesion para mostrar login/logout

Problema que resuelve este modulo:

Sin guards, un usuario anonimo puede intentar abrir rutas privadas escribiendo la URL manualmente. La interfaz puede ocultar botones, pero el acceso por URL sigue posible si no se controla en el Router.

---

## 3. Autenticacion, autorizacion y alcance del guard

| Capa | Que controla | Ejemplo en este proyecto |
|---|---|---|
| **Guard de Angular** | Navegacion en frontend | Redirigir a `/auth` si no hay sesion |
| **Reglas de Firestore** | Acceso real a datos | Permitir favoritos solo al propietario |

Conclusiones clave:

- El guard mejora UX y consistencia de navegacion.
- El guard NO reemplaza seguridad de backend/Firestore.
- Se necesitan ambas capas para una aplicacion robusta.

---

## 4. Fundamento tecnico

### 4.1 Guard funcional `authGuard`

Permite activar una ruta solo cuando hay usuario autenticado.

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser()
    ? true
    : router.createUrlTree(['/auth']);
};
```

Por que `UrlTree` y no `navigate(...)`:

- `createUrlTree` es el patron recomendado en guards.
- Evita efectos secundarios innecesarios.
- Permite que el Router resuelva la redireccion en el mismo flujo de evaluacion.

### 4.2 Guard funcional `guestGuard`

Bloquea el acceso a `/auth` cuando ya existe sesion activa.

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser()
    ? router.createUrlTree(['/'])
    : true;
};
```

Resultado UX:

- si no hay sesion: puede entrar a `/auth`
- si hay sesion: `/auth` redirige a home

### 4.3 Politica de rutas del curso

Una politica simple y clara para este punto del curso:

- Publicas: home (`''`) y auth (`'auth'`)
- Privadas: rutas de trabajo del usuario (por ejemplo favoritos, detalle privado, panel)

Ejemplo de configuracion:

```ts
// ... resto de rutas existentes
{ path: 'auth', component: AuthPageComponent, canActivate: [guestGuard] },

{ path: 'favorites', component: FavoritesPageComponent, canActivate: [authGuard] },
{ path: 'simpsons/:id', component: SimpsonDetailPageComponent, canActivate: [authGuard] },

{ path: '**', redirectTo: '' },
```

Si quieres que TODO excepto `/auth` sea privado, basta con aplicar `authGuard` al resto de rutas.

---

## 5. Sincronizacion con UI (navbar/header)

El navbar debe reflejar exactamente la misma regla del Router.

Ejemplo conceptual:

- `currentUser() === null`:
  - mostrar boton "Iniciar sesion" -> `/auth`
  - ocultar enlaces privados
- `currentUser() !== null`:
  - mostrar email/uid y boton "Cerrar sesion"
  - mostrar enlaces privados

Esto evita incoherencias como "enlace visible pero ruta bloqueada" o "ruta visible pero enlace oculto".

---

## 6. Buenas practicas

- Centralizar acceso en guards, no en cada componente.
- Usar `currentUser()` del `AuthService` como unica fuente de verdad de sesion.
- Redirigir a `/auth` para no autenticados en rutas privadas.
- Proteger tambien `/auth` con `guestGuard` para usuarios logueados.
- Mantener rutas publicas/privadas explicitas y faciles de leer.
- Conservar wildcard al final: `{ path: '**', redirectTo: '' }`.

---

## 7. Errores comunes

- Seguir usando `/login` cuando el proyecto ya migró a `/auth`.
- Usar `isAuthenticated()` en ejemplos cuando el servicio real expone `currentUser()`.
- Hacer redireccion en componentes en vez de centralizarla en guards.
- Proteger solo menu visual y olvidar proteccion de ruta real.
- Asumir que guard de Angular reemplaza reglas de Firestore.

---

## 8. Relacion con modulos 07 y 08

Integracion directa:

- 07 aporta rutas funcionales (`simpsons`, `simpsons/:id`) y flujo de navegacion real.
- 08 aporta autenticacion real (`AuthService`, `/auth`, sesion reactiva).
- 09 consolida ambos: navegacion condicionada por sesion con redireccion automatica.

Es el cierre natural antes de deploy, porque define que partes de la app son realmente publicas y cuales requieren identidad.

---

## 9. Referencias

- Angular Router guards: https://angular.dev/guide/routing/route-guards
- Firebase Auth Web: https://firebase.google.com/docs/auth/web/start
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
