# Programación y Plataformas Web

# Frameworks Web: Angular 21 + Firebase

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="80" alt="Firebase Logo">
</div>

## 08. Firebase y Autenticación — Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Integrar Firebase Authentication y Firestore al proyecto `ppw-angular-21` para permitir login, logout y persistencia de personajes favoritos por usuario.

---

## Archivos involucrados

- `src/app/app.config.ts` — agregar providers de Firebase
- `src/app/app.routes.ts` — agregar ruta `/auth`
- `src/app/core/services/auth.service.ts` — encapsular login/logout/estado
- `src/app/core/services/favorites.service.ts` — persistencia en Firestore
- `src/app/features/auth/pages/auth-page/` — pantalla de login y registro
- `src/app/components/app-header/header.html` — navbar reactivo al estado de sesion

---

## Paso 1. Crear el proyecto en Firebase Console

1. Ir a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click en **Agregar proyecto** y darle nombre (por ejemplo `ppw-angular-21`).
3. En el dashboard, click en el icono **Web** (`</>`) y registrar la app.
4. Copiar el objeto `firebaseConfig` que aparece (lo necesitamos en el siguiente paso).

---

## Paso 2. Habilitar Authentication y Firestore

En Firebase Console:

1. **Authentication** → Get started → Sign-in method → habilitar **Email/Password**.
2. **Firestore Database** → Create database → seleccionar **modo de prueba** → elegir ubicacion.
3. En la pestaña **Rules** de Firestore, dejar por ahora las reglas de desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TEMPORAL - solo para desarrollo. Cambiar antes de produccion.
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

> Solo usuarios autenticados pueden leer o escribir. No deja acceso anonimo.

---

## Paso 3. Instalar AngularFire

En la terminal del proyecto:

```bash
pnpm add firebase@latest @angular/fire@latest
```

Puede tener una salida similar a:

```bash
pablo@CV1PTORRESP 03-ui-componentes-estilos % pnpm add @angular/fire firebase
Downloading firebase@12.6.0: 6.06 MB/6.06 MB, done
Downloading @firebase/firestore@4.9.2: 5.84 MB/5.84 MB, done
 WARN  3 deprecated subdependencies found: glob@7.2.3, inflight@1.0.6, rimraf@3.0.2
Packages: +36
++++++++++++++++++++++++++++++++++++
Progress: resolved 746, reused 607, downloaded 33, added 36, done
 WARN  Issues with peer dependencies found
.
└─┬ @angular/platform-browser-dynamic 20.3.15
  ├── ✕ unmet peer @angular/core@20.3.15: found 20.3.13
  ├── ✕ unmet peer @angular/common@20.3.15: found 20.3.13
  ├── ✕ unmet peer @angular/compiler@20.3.15: found 20.3.13
  └── ✕ unmet peer @angular/platform-browser@20.3.15: found 20.3.13

dependencies:
+ firebase 12.6.0

╭ Warning ────────────────────────────────────────────────────────────────────────────────╮
│                                                                                         │
│   Ignored build scripts: @firebase/util.                                                │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed to run         │
│   scripts.                                                                              │
│                                                                                         │
╰─────────────────────────────────────────────────────────────────────────────────────────╯

Done in 7.4s using pnpm v10.19.0
```


Si aparece un aviso de `pnpm approve-builds`, ejecutar:

```bash
pnpm approve-builds
```

Seleccionar `@firebase/util` con `space` y confirmar con `y`.

```bash
pablo@CV1PTORRESP 03-ui-componentes-estilos % pnpm approve-builds
✔ Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection) · @firebase/util

✔ The next packages will now be built: @firebase/util.
Do you approve? (y/N) · true
enode_modules/.pnpm/@firebase+util@1.13.0/node_modules/@firebase/util: Running postinstall script...
nnode_modules/.pnpm/@firebase+util@1.13.0/node_modules/@firebase/util: Running postinstall node_modules/.pnpm/@firebase+util@1.12.1/node_modules/@firebase/util: Running postinstall script, done in 211ms
```

Luego ejecutar el asistente de configuracion:

```bash
pnpm ng add @angular/fire
```

Durante el asistente:
- Autenticarse con Google si lo pide.
- Seleccionar las features: **Authentication** y **Firestore**.
- Seleccionar el proyecto Firebase creado.
- Seleccionar la app web registrada.

---

## Paso 4. Verificar y completar `app.config.ts`

El asistente debio haber modificado `app.config.ts`. Verificar que quede asi:

```ts

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';



// Configuracion generada por Firebase Console al registrar la app.
const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
  storageBucket: 'TU_PROYECTO.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:xxxxxxxxxxxxxxxxxx',
};

export const appConfig: ApplicationConfig = {
  providers: [
    /// otros providers 
    // Firebase: inicializa la conexion con el proyecto.
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    // Auth: registra el servicio de autenticacion en el inyector global.
    provideAuth(() => getAuth()),
    // Firestore: registra la base de datos en el inyector global.
    provideFirestore(() => getFirestore()),
  ],
};
```

---

## Paso 5. Crear `AuthService`

Crear el servicio manualmente en `src/app/core/services/auth.service.ts`:

```bash
ng g s core/services/auth --skip-tests
```

Implementacion de `auth.service.ts`:

```ts

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  // authState emite null cuando no hay sesion, o el objeto User cuando hay sesion.
  // toSignal convierte el Observable en un signal reactivo para usar en templates.
  currentUser = toSignal(authState(this.auth));

  // signInWithEmailAndPassword devuelve una Promise.
  // from() la convierte en Observable para poder encadenar operadores RxJS o usar con rxResource.
  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Igual que login, se convierte la Promise a Observable.
  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }

  // Acceso rapido al uid del usuario actual (null si no esta autenticado).
  get uid(): string | null {
    return this.currentUser()?.uid ?? null;
  }
}
```

Puntos clave del servicio:
- `currentUser` es un signal: el template puede leerlo directamente con `authService.currentUser()`.
- Ningun componente llama directamente a Firebase; todo pasa por este servicio.
- `from()` convierte Promises de Firebase en Observables.

---

## Paso 6. Crear la pagina de autenticacion (`auth-page`)

Esta pagina unifica login y registro en un solo componente. Un signal controla cual modo se muestra. Despues de cualquier accion exitosa se navega a home (`/`).

Generar el componente:

```bash
ng g c features/auth/pages/auth-page --skip-tests
```

Implementacion de `auth-page.ts`:

```ts
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // true = mostrar login, false = mostrar registro.
  isLogin = signal(true);

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  // Un solo formulario sirve para ambos modos.
  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Alterna entre modo login y registro, limpiando errores previos.
  toggleMode() {
    this.isLogin.update((v) => !v);
    this.errorMessage.set(null);
    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { email, password } = this.authForm.value;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Seleccionamos la accion segun el modo activo.
    const action$ = this.isLogin()
      ? this.authService.login(email!, password!)
      : this.authService.register(email!, password!);

    action$.subscribe({
      next: () => {
        // Tanto login como registro navegan a home al completarse.
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage.set(
          this.isLogin()
            ? 'Correo o contrasena incorrectos.'
            : 'No se pudo crear la cuenta. El correo puede estar en uso.'
        );
        this.isLoading.set(false);
      },
    });
  }
```

Implementacion de `auth-page.html`:

```html
<section class="flex min-h-[80vh] items-center justify-center">
  <div class="card w-full max-w-sm border border-base-300 bg-base-100 shadow-sm">
    <div class="card-body gap-4">

      <!-- El titulo cambia segun el modo activo. -->
      <h2 class="text-2xl font-black tracking-tight">
        @if (isLogin()) { Iniciar sesion } @else { Crear cuenta }
      </h2>

      <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-4">

        <div class="form-control">
          <label class="label" for="email">
            <span class="label-text">Correo electronico</span>
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="usuario@ejemplo.com"
            class="input input-bordered w-full"
            [class.input-error]="authForm.get('email')?.invalid && authForm.get('email')?.touched"
          />
        </div>

        <div class="form-control">
          <label class="label" for="password">
            <span class="label-text">Contrasena</span>
          </label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="••••••"
            class="input input-bordered w-full"
            [class.input-error]="authForm.get('password')?.invalid && authForm.get('password')?.touched"
          />
        </div>

        <!-- Error de Firebase mapeado a mensaje legible. -->
        @if (errorMessage()) {
          <div class="alert alert-error py-2 text-sm">
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <button
          type="submit"
          class="btn btn-primary w-full"
          [disabled]="authForm.invalid || isLoading()"
        >
          @if (isLoading()) {
            <span class="loading loading-spinner loading-sm"></span>
          } @else if (isLogin()) {
            Ingresar
          } @else {
            Registrarse
          }
        </button>
      </form>

      <!-- Enlace para alternar entre login y registro. -->
      <p class="text-center text-sm text-base-content/60">
        @if (isLogin()) {
          ¿No tienes cuenta?
          <button class="link link-primary" (click)="toggleMode()">Registrate aqui</button>
        } @else {
          ¿Ya tienes cuenta?
          <button class="link link-primary" (click)="toggleMode()">Inicia sesion</button>
        }
      </p>

    </div>
  </div>
</section>
```

---

## Paso 7. Agregar la ruta `/auth` en `app.routes.ts`

En `app.routes.ts`, agregar la ruta antes del wildcard:

```ts
import { AuthPageComponent } from './features/auth/pages/auth-page/auth-page';

// ... resto de rutas existentes
{ path: 'auth', component: AuthPageComponent },
{ path: '**', redirectTo: '' },
```




---

## Paso 8. Actualizar el header segun el estado de sesion

En `app-header/header.ts`, impoartar el servicio.


```ts
import { AuthService } from '../../core/services/auth.service';
```

Inyectar `AuthService` y exponer `currentUser`:

```ts

  private authService = inject(AuthService);
  private router = inject(Router);

  // El signal del servicio: null = no autenticado, User = autenticado.
  currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout().subscribe(() => {
      // Redirige al login despues de cerrar sesion.
      this.router.navigate(['/login']);
    });
  }

```

En `header.html`, agregar el bloque condicional de sesion. Agrega esto dentro de `navbar-end`:

```html
<div class="navbar-end gap-2">
  @if (currentUser()) {
    <!-- Usuario autenticado: mostrar email y boton de logout. -->
    <span class="hidden text-sm text-base-content/60 lg:block">
      {{ currentUser()!.email }}
    </span>

    <button class="btn btn-ghost btn-sm" (click)="logout()">
      Cerrar sesion
    </button>
  } @else {
    <!-- Sin sesion: navega a la pagina unificada de auth. -->
    <a class="btn btn-primary btn-sm" routerLink="/auth">
      Iniciar sesion
    </a>
  }
</div>
```

---

## Paso 9. Crear `FavoritesService`

Crear el servicio:

```bash
ng g s core/services/favorites --skip-tests
```

Implementacion de `favorites.service.ts`:

```ts
// Modelo del documento en Firestore.
export interface Favorite {
  userId: string;
  characterId: number;
  addedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private firestore = inject(Firestore);

  // El id del documento combina userId + characterId para que sea unico por usuario.
  addFavorite(userId: string, characterId: number): Promise<void> {
    const ref = doc(this.firestore, `favorites/${userId}-${characterId}`);
    return setDoc(ref, {
      userId,
      characterId,
      addedAt: new Date(),
    });
  }

  // Elimina el favorito del documento correspondiente.
  removeFavorite(userId: string, characterId: number): Promise<void> {
    const ref = doc(this.firestore, `favorites/${userId}-${characterId}`);
    return deleteDoc(ref);
  }

  // Devuelve un Observable con los favoritos del usuario.
  // collectionData convierte el query de Firestore en un stream reactivo.
  getFavoritesByUser(userId: string): Observable<Favorite[]> {
    const favRef = collection(this.firestore, 'favorites');
    const q = query(favRef, where('userId', '==', userId));
    return collectionData(q) as Observable<Favorite[]>;
  }
}
```

---

## Paso 10. Agregar boton de favorito en el detalle de personaje

En `simpson-detail-page.ts`, inyectar `AuthService` y `FavoritesService`:

```ts
  // authService como publico para poder leerlo en el template con authService.currentUser().
  authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);

  // Signal local: refleja inmediatamente si el personaje es favorito sin esperar Firestore.
  isFavorite = signal(false);

  // Alterna entre guardar y eliminar segun el estado actual del signal.
  toggleFavorite() {
    const uid = this.authService.uid;
    if (!uid) return; // No hace nada si no hay sesion activa.

    if (this.isFavorite()) {
      // Si ya es favorito, lo eliminamos de Firestore.
      this.favoritesService.removeFavorite(uid, this.characterId).then(() => {
        this.isFavorite.set(false);
      });
    } else {
      // Si no es favorito, lo guardamos en Firestore.
      this.favoritesService.addFavorite(uid, this.characterId).then(() => {
        this.isFavorite.set(true);
      });
    }
  }
```

En `simpson-detail-page.html`, agregar el boton de favorito dentro del detalle:

```html
@if (authService.currentUser()) {
  <!-- Solo visible para usuarios autenticados. -->
  <button
    class="btn btn-outline btn-sm"
    [class.btn-warning]="isFavorite()"
    (click)="toggleFavorite()"
  >
    @if (isFavorite()) {
      ★ Guardado en favoritos
    } @else {
      ☆ Agregar a favoritos
    }
  </button>
} @else {
  <!-- Invita al usuario anonimo a autenticarse. -->
  <a class="btn btn-ghost btn-sm" routerLink="/auth">
    Inicia sesion para guardar favoritos
  </a>
}
```


---

## Commits sugeridos graduales

```bash
git commit -m "feat: instalar y configurar firebase y angularfire"
git commit -m "feat: crear AuthService con login logout y estado de sesion"
git commit -m "feat: agregar LoginPage con formulario reactivo"
git commit -m "feat: agregar ruta /login en app.routes"
git commit -m "feat: actualizar header con estado de sesion"
git commit -m "feat: crear FavoritesService con persistencia en Firestore"
git commit -m "feat: agregar boton de favorito en detalle de personaje"
```
