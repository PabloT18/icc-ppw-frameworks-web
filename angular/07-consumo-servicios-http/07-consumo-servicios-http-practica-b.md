# Programación y Plataformas Web

# Frameworks Web: Angular 21 + HTTP

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 07-B. Consumo de Servicios HTTP — Paginación reactiva

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Crear un `PaginationService` totalmente reutilizable que lea el parámetro `?page=` de la URL y lo exponga como signal reactivo. Usarlo con `rxResource` para que el listado de personajes se actualice automáticamente cuando la página cambia.

---

## Prerequisito

Haber completado la práctica 07-A: el servicio `SimpsonsService` y la página `SimpsonsPage` deben estar funcionando.

---

## Archivos involucrados

- `src/app/shared/services/pagination.service.ts` — nuevo servicio de paginación
- `src/app/features/simpsons/pages/simpsons-page/simpsons-page.ts` — actualizar para usar paginación
- `src/app/features/simpsons/pages/simpsons-page/simpsons-page.html` — agregar controles de paginación

Archivos de referencia en [`files/`](files/README.md):
- `pagination.service.ts`
- `simpsons-page-paginated.ts`
- `simpsons-page-paginated.html`

---

## Paso 1. Crear el `PaginationService`

Crear la carpeta `src/app/shared/services/` y dentro el archivo `pagination.service.ts`.  
Ver contenido completo: [files/pagination.service.ts](files/pagination.service.ts)

```ts
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private activatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => Number(params.get('page') ?? '1'))
    ),
    { initialValue: 1 }
  );
}
```

**¿Por qué va en `shared/services/`?**

El `PaginationService` no pertenece a ninguna feature específica. Es infraestructura reutilizable que cualquier feature puede usar. Colocarlo en `shared/` lo hace accesible desde `simpsons`, `users`, `posts` o cualquier feature futura.

**¿Cómo funciona?**

1. `ActivatedRoute` emite cada vez que cambia la URL
2. `queryParamMap` lee los parámetros de query (`?page=2`)
3. `map(...)` extrae el valor de `page` y lo convierte a número
4. `toSignal()` convierte el Observable en un signal reactivo con valor inicial `1`

---

## Paso 2. Actualizar `SimpsonsService` para aceptar opciones de paginación

En `simpsons.service.ts`, agregar una interface `Options` y un segundo método:

```ts
export interface Options {
  page?: number;
  limit?: number;
}
```

Agregar el método al servicio:

```ts
getCharactersOptions(options: Options = {}): Observable<SimpsonsResponse> {
  const { page = 1, limit = 10 } = options;
  return this.http
    .get<SimpsonsResponse>(
      `${this.baseUrl}/characters?page=${page}&limit=${limit}`
    )
    .pipe(
      catchError(() =>
        throwError(() => new Error('No se pudieron cargar los personajes'))
      )
    );
}
```

> El método original `getCharacters(page)` se mantiene. Se agrega `getCharactersOptions` como alternativa más flexible.

---

## Paso 3. Actualizar `SimpsonsPage` para usar paginación

En `simpsons-page.ts`, inyectar `PaginationService` y conectarlo con `rxResource`:

```ts
export class SimpsonsPageComponent {
  private simpsonsService = inject(SimpsonsService);
  paginationService = inject(PaginationService);  // público: el template lo usa

  readonly charactersPerPage = signal(10);

  simpsonsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage(),
      limit: this.charactersPerPage(),
    }),
    stream: ({ params }) =>
      this.simpsonsService.getCharactersOptions({
        page: params.page,
        limit: params.limit,
      }),
  });
}
```

Lo que ocurre aquí:
- `params()` lee `currentPage()` y `charactersPerPage()` — ambos son signals
- Cuando cualquiera de ellos cambia, `rxResource` cancela la petición anterior y lanza una nueva
- El componente nunca necesita suscribirse manualmente

---

## Paso 4. Agregar controles de navegación de páginas en el template

En `simpsons-page.html`, agregar los controles antes o después de la tabla.  
Ver template completo: [files/simpsons-page-paginated.html](files/simpsons-page-paginated.html)

```html
@if (simpsonsResource.hasValue()) {
  <!-- Controles de paginación -->
  <div class="flex items-center justify-between gap-4 mb-6">
    <span class="text-sm text-base-content/60">
      Página {{ paginationService.currentPage() }}
      de {{ simpsonsResource.value()!.pages }}
    </span>
    <div class="join">
      <a
        class="join-item btn btn-sm"
        [class.btn-disabled]="paginationService.currentPage() <= 1"
        [routerLink]="[]"
        [queryParams]="{ page: paginationService.currentPage() - 1 }">
        «
      </a>
      <button class="join-item btn btn-sm btn-active">
        {{ paginationService.currentPage() }}
      </button>
      <a
        class="join-item btn btn-sm"
        [class.btn-disabled]="paginationService.currentPage() >= simpsonsResource.value()!.pages"
        [routerLink]="[]"
        [queryParams]="{ page: paginationService.currentPage() + 1 }">
        »
      </a>
    </div>
  </div>
}
```

**¿Cómo funciona la navegación?**

Los botones de paginación son links (`<a routerLink>`) que actualizan el query param `?page=N` en la URL sin recargar la página. Esto dispara el Observable de `ActivatedRoute` → actualiza `currentPage()` → `rxResource` lanza nueva petición → la tabla se actualiza.

No se necesita ningún método `cambiarPagina()` en el componente.

---

## Paso 5. Agregar `RouterModule` en imports

El template usa `routerLink` y `queryParams`. El componente debe importar `RouterModule`:

```ts
@Component({
  selector: 'app-simpsons-page',
  templateUrl: './simpsons-page.html',
  imports: [RouterModule],
})
```


---

## Commits sugeridos

```bash

git commit -m "feat: agregar controles de navegacion de paginas en simpsons-page"
```
