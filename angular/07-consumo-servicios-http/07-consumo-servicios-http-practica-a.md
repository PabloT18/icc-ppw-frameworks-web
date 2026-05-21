# Programación y Plataformas Web

# Frameworks Web: Angular 21 + HTTP

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 07-A. Consumo de Servicios HTTP — Servicio base y primer consumo

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Crear una feature completa que consuma una API real: configurar `HttpClient`, definir interfaces, crear un servicio HTTP con manejo de errores y consumirlo desde un componente usando `rxResource`.

---

## API que se va a consumir

Se utilizará la misma API de The Simpsons usada en el curso de JavaScript:

```
https://thesimpsonsapi.com/api
```

Endpoints principales:

| Endpoint | Descripción |
|---|---|
| `GET /characters?page=1` | Lista paginada de personajes |
| `GET /characters/:id` | Detalle de un personaje |

---

## Archivos involucrados

- `src/app/app.config.ts` — registrar `HttpClient`
- `src/app/app.routes.ts` — agregar ruta `simpsons`
- `src/app/features/simpsons/models/simpsons.interface.ts` — interfaces
- `src/app/features/simpsons/services/simpsons.service.ts` — servicio HTTP
- `src/app/features/simpsons/pages/simpsons-page/` — página de listado

Archivos de referencia en [`files/`](files/README.md):
- `simpsons.interface.ts`
- `simpsons.service.ts`
- `simpsons-page.ts`
- `simpsons-page.html`

---

## Paso 1. Registrar `HttpClient` en la aplicación

Abrir `src/app/app.config.ts` y agregar `provideHttpClient(withFetch())` al array de providers:

```ts
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};
```

> Solo se hace una vez para toda la aplicación. A partir de aquí, cualquier servicio puede inyectar `HttpClient`.

---

## Paso 2. Crear la feature `simpsons`

Crear la estructura de carpetas:

```
src/app/features/simpsons/
├── models/
│   └── simpsons.interface.ts
├── services/
│   └── simpsons.service.ts
└── pages/
    └── simpsons-page/
        ├── simpsons-page.ts
        └── simpsons-page.html
```

Generar la página con CLI:

```bash
ng g c features/simpsons/pages/simpsons-page --skip-tests
```

> La carpeta `models/` y `services/` se crean manualmente. Angular CLI no genera servicios dentro de subdirectorios sin especificar la ruta completa.

---

## Paso 3. Definir las interfaces

Crear `src/app/features/simpsons/models/simpsons.interface.ts`.  
Ver contenido completo: [files/simpsons.interface.ts](files/simpsons.interface.ts)

Las interfaces principales que se necesitan:

```ts
export interface SimpsonsCharacter {
  id: number;
  name: string;
  age: number | null;
  gender: string;
  occupation: string;
  portrait_path: string;
  status: string;
  phrases: string[];
}

export interface SimpsonsResponse {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  results: SimpsonsCharacter[];
}
```

> Herramienta para generar interfaces desde JSON: [https://app.quicktype.io](https://app.quicktype.io)

---

## Paso 4. Crear el servicio HTTP

Crear `src/app/features/simpsons/services/simpsons.service.ts`.  
Ver contenido completo: [files/simpsons.service.ts](files/simpsons.service.ts)

Estructura del servicio:

```ts
@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://thesimpsonsapi.com/api';

  getCharacters(page: number = 1): Observable<SimpsonsResponse> {
    return this.http
      .get<SimpsonsResponse>(`${this.baseUrl}/characters?page=${page}`)
      .pipe(
        catchError(err =>
          throwError(() => new Error('No se pudieron cargar los personajes'))
        )
      );
  }
}
```

Lo que hace el servicio:
- Inyecta `HttpClient` con `inject()`
- Define la URL base como constante privada
- Tipa la respuesta con la interface `SimpsonsResponse`
- Captura errores con `catchError` y los propaga con un mensaje legible

---

## Paso 5. Consumir el servicio con `rxResource`

En `simpsons-page.ts`, inyectar el servicio y definir el resource:

```ts
export class SimpsonsPageComponent {
  private simpsonsService = inject(SimpsonsService);

  simpsonsResource = rxResource({
    stream: () => this.simpsonsService.getCharacters(1),
  });
}
```

Importaciones necesarias en el decorador:

```ts
imports: [RouterModule]
```

> `rxResource` viene de `@angular/core`. No requiere imports adicionales en `@Component`.

---

## Paso 6. Renderizar estados en el template

Crear `simpsons-page.html`. Ver contenido completo: [files/simpsons-page.html](files/simpsons-page.html)

Los tres estados que siempre se deben manejar:

```html
<!-- Estado de carga -->
@if (simpsonsResource.isLoading()) {
  <div class="flex justify-center items-center h-64">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>
}

<!-- Estado de error -->
@if (simpsonsResource.error()) {
  <div class="alert alert-error max-w-lg mx-auto mt-8">
    <span>Error al cargar los personajes. Intenta de nuevo.</span>
  </div>
}

<!-- Estado de datos -->
@if (simpsonsResource.hasValue()) {
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>Personaje</th>
          <th>Ocupación</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        @for (char of simpsonsResource.value()!.results; track char.id) {
          <tr class="hover">
            <td>{{ char.id }}</td>
            <td class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle w-10 h-10">
                  <img [src]="char.portrait_path" [alt]="char.name" />
                </div>
              </div>
              <span class="font-semibold">{{ char.name }}</span>
            </td>
            <td class="text-sm text-base-content/70">{{ char.occupation }}</td>
            <td>
              <span class="badge badge-sm"
                [class.badge-success]="char.status === 'Alive'"
                [class.badge-error]="char.status === 'Dead'">
                {{ char.status }}
              </span>
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
}
```

---

## Paso 7. Registrar la ruta y agregar al navbar

En `app.routes.ts`:

```ts
{
  path: 'simpsons',
  component: SimpsonsPageComponent,
},
```

En el navbar (`app-navbar.html` o el componente de navegación del proyecto), agregar el enlace:

```html
<li><a routerLink="/simpsons" routerLinkActive="active">Simpsons</a></li>
```

---

## Validaciones esperadas

- [ ] `provideHttpClient(withFetch())` está en `app.config.ts`
- [ ] Las interfaces cubren la estructura real de la respuesta de la API
- [ ] El servicio tipa la respuesta con `SimpsonsResponse`
- [ ] `rxResource` gestiona `isLoading()`, `hasValue()` y `error()`
- [ ] El template renderiza los tres estados visiblemente
- [ ] La ruta `/simpsons` es accesible desde el navbar

---

## Commits sugeridos

```bash
git commit -m "feat: registrar provideHttpClient con withFetch"
git commit -m "feat: agregar interfaces SimpsonsCharacter y SimpsonsResponse"
git commit -m "feat: crear SimpsonsService con getCharacters tipado"
git commit -m "feat: consumir simpsons API con rxResource en SimpsonsPage"
git commit -m "feat: renderizar loading error y data en simpsons-page"
```
