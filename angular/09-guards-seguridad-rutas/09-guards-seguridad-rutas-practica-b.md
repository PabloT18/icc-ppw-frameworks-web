# Programacion y Plataformas Web

# Frameworks Web: Angular 21 + Firebase

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="80" alt="Firebase Logo">
</div>

## 09-B. Guards y Seguridad de Rutas - Estado async + Roles Firebase

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Extender la practica 09 para cubrir dos problemas reales:

1. Evitar decisiones de guard prematuras cuando la sesion aun se esta cargando.
2. Proteger rutas por rol usando configuracion de roles en Firebase.

Regla del modulo 09-B:

- Si no hay sesion: redirigir a `/auth`.
- Si hay sesion y rol `admin`: puede abrir `/simpsons` y `/simpsons/:id`.
- Si hay sesion y rol `user`: no puede abrir esas dos rutas (si puede el resto de rutas autenticadas).

---

## 2. Contexto del problema

En apps reales, el estado de autenticacion no siempre esta disponible en el primer ciclo de render. Si un guard solo mira un valor sin esperar la emision real, puede redirigir mal y generar parpadeos o bloqueos falsos.

Por eso, en esta practica los guards deben decidir usando el stream real de Firebase (`authState`) y no asumir que el estado ya esta listo.

---

## 3. Archivos involucrados

- `src/app/core/services/auth.service.ts`
- `src/app/core/guards/auth.guard.ts`
- `src/app/core/guards/guest.guard.ts`
- `src/app/core/guards/admin.guard.ts` (nuevo)
- `src/app/app.routes.ts`
- Configuracion de roles en Firebase (custom claims)

---

## 4. Paso 1 - Ajustar `AuthService` para estados async

Implementacion base recomendada:

```ts
import { Injectable, inject } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  // Tres estados:
  // undefined -> sesion aun cargando
  // null      -> no autenticado
  // User      -> autenticado
  user = toSignal<User | null | undefined>(authState(this.auth), {
    initialValue: undefined,
  });
}
```

Interpretacion correcta de estados:

- `undefined`: no decidir aun con lectura sincronica.
- `null`: visitante.
- `User`: autenticado.

---

## 5. Paso 2 - `guestGuard` basado en `authState`

Usar stream real para evitar decisiones antes de tiempo:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map(user => (user ? router.createUrlTree(['/']) : true))
  );
};
```

Comportamiento:

- Si ya hay sesion -> no entra a `/auth`, redirige a `/`.
- Si no hay sesion -> permite entrar a `/auth`.

---

## 6. Paso 3 - `authGuard` basado en `authState`

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map(user => (user ? true : router.createUrlTree(['/auth'])))
  );
};
```

Comportamiento:

- Sesion valida -> permite ruta protegida.
- Sin sesion -> redirige a `/auth`.

---

## 7. Paso 4 - Configurar roles en Firebase (solo Firebase)

### 7.1 Estrategia recomendada: Custom Claims

Configurar roles en Firebase Auth mediante custom claims (`admin`, `user`).

Ejemplo con Firebase Admin SDK (script backend o Cloud Function de administrador):

```ts
import * as admin from 'firebase-admin';

admin.initializeApp();

async function setAdminRole(uid: string) {
  await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
}

async function setUserRole(uid: string) {
  await admin.auth().setCustomUserClaims(uid, { role: 'user' });
}
```

Importante:

- Los claims se asignan en Firebase (backend), nunca desde frontend.
- Tras cambiar claims, el usuario debe refrescar token (re-login o refresh) para recibir el nuevo rol.

### 7.2 Regla de datos en Firestore (opcional recomendado)

Si tambien quieres alinear acceso a datos por rol en Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /simpsons/{docId} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

Nota: esto protege datos. La navegacion se protege con guards.

---

## 8. Paso 5 - Crear `adminGuard` para rutas de Simpsons

Generar guard:

```bash
ng g guard core/guards/admin --functional --skip-tests
```

Implementacion sugerida:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { from, map, of, switchMap, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    switchMap(user => {
      if (!user) return of(router.createUrlTree(['/auth']));

      return from(user.getIdTokenResult()).pipe(
        map(token => {
          const role = token.claims['role'];
          return role === 'admin' ? true : router.createUrlTree(['/']);
        })
      );
    })
  );
};
```

Comportamiento final de `adminGuard`:

- no autenticado -> `/auth`
- autenticado con `role=admin` -> permite
- autenticado con `role=user` -> redirige a `/`

---

## 9. Paso 6 - Aplicar guards en rutas

Ejemplo de politica completa:

```ts
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },

  // solo visitantes
  { path: 'auth', component: AuthPageComponent, canActivate: [guestGuard] },

  // rutas autenticadas generales
  { path: 'favorites', component: FavoritesPageComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },

  // solo admins
  { path: 'simpsons', component: SimpsonsPageComponent, canActivate: [adminGuard] },
  { path: 'simpsons/:id', component: SimpsonDetailPageComponent, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' },
];
```

Con esta politica:

- usuario `user` no entra a rutas de Simpsons
- usuario `admin` si entra
- resto de rutas autenticadas siguen disponibles para ambos roles

---

## 10. Paso 7 - Ajustar UI segun rol

Aunque el guard ya protege, la UI debe ser coherente:

- Ocultar enlaces de Simpsons cuando rol != admin.
- Mostrar enlaces solo cuando rol == admin.

Esto mejora UX, pero la seguridad real sigue en guard + Firebase.

---

## 11. Validaciones obligatorias

1. Visitante abre `/simpsons` -> redirige a `/auth`.
2. Usuario `user` autenticado abre `/simpsons` -> redirige a `/`.
3. Usuario `admin` abre `/simpsons` y `/simpsons/:id` -> acceso permitido.
4. Usuario autenticado abre `/auth` -> redirige a `/`.
5. Wildcard mantiene comportamiento normal al final.

---

## 12. Errores comunes

- Evaluar solo `currentUser()` sin considerar estado async inicial.
- Asignar roles desde frontend (incorrecto).
- No refrescar token despues de cambiar custom claims.
- Proteger solo el menu y olvidar guard de ruta.
- Mezclar rutas antiguas `/login` con ruta actual `/auth`.

---

## 13. Entregables

- `AuthService` con estado de sesion async bien definido.
- `authGuard` y `guestGuard` basados en `authState(...).pipe(take(1))`.
- `adminGuard` por custom claim `role`.
- Rutas `/simpsons` y `/simpsons/:id` solo para admins.
- Configuracion de roles hecha en Firebase.

---

## 14. Commits sugeridos

```bash
git commit -m "feat: migrar guards a authState async con take(1)"
git commit -m "feat: crear adminGuard basado en custom claims de Firebase"
git commit -m "feat: restringir rutas simpsons a rol admin y mantener /auth con guestGuard"
```
