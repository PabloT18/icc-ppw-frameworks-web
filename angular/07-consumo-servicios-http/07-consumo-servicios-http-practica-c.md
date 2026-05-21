# Programación y Plataformas Web

# Frameworks Web: Angular 21 + HTTP

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 07-C. Consumo de Servicios HTTP — Mejoras, estilos y variables de entorno

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Aplicar tres mejoras al módulo: configurar variables de entorno para separar URLs por entorno, refinar los componentes visuales con Tailwind y DaisyUI completos, y agregar una página de detalle de personaje.

---

## Prerequisito

Haber completado las prácticas 07-A y 07-B. El servicio `SimpsonsService`, el `PaginationService` y la página `SimpsonsPage` deben estar funcionando con paginación.

---

## Archivos involucrados

- `src/environments/environment.ts` — variables de desarrollo
- `src/environments/environment.prod.ts` — variables de producción
- `src/app/features/simpsons/services/simpsons.service.ts` — usar `environment.apiUrl`
- `src/app/features/simpsons/pages/simpsons-page/simpsons-page.html` — UI mejorada
- `src/app/features/simpsons/pages/simpson-detail-page/` — página de detalle (nueva)
- `src/app/app.routes.ts` — ruta de detalle

Archivos de referencia en [`files/`](files/README.md):
- `environment.ts`
- `environment.prod.ts`
- `simpson-detail-page.ts`
- `simpson-detail-page.html`
- `simpsons-page-final.html`

---

## Paso 1. Generar los archivos de variables de entorno

```bash
ng generate environments
```

Esto crea la carpeta `src/environments/` con los archivos base.

---

## Paso 2. Definir las variables

Editar `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://thesimpsonsapi.com/api',
};
```

Crear `src/environments/environment.prod.ts`:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://thesimpsonsapi.com/api',
};
```

> En proyectos reales, `apiUrl` apunta a servidores distintos por entorno. En este caso ambos usan la misma API pública, pero la estructura queda lista para cuando se necesite separar.

---

## Paso 3. Actualizar `SimpsonsService` para usar `environment`

Reemplazar la URL hardcodeada por la variable de entorno:

```ts
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;  // ← cambia esto

  // los métodos no cambian
}
```

Verificar que `ng serve` y `ng build` siguen funcionando correctamente.

---

## Paso 4. Mejorar la UI de `SimpsonsPage` con DaisyUI

Reemplazar el contenido de `simpsons-page.html` con la versión completa con estilos.  
Ver template completo: [files/simpsons-page-final.html](files/simpsons-page-final.html)

Mejoras visuales a incorporar:

**Hero de la sección:**

```html
<section class="bg-base-200 py-10 px-8">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-4xl font-extrabold tracking-tight mb-1">The Simpsons</h1>
    <p class="text-base-content/60 text-lg mb-6">
      Personajes de la serie — powered by The Simpsons API
    </p>
    <!-- controles de paginación -->
    <!-- tabla -->
  </div>
</section>
```

**Cards en lugar de tabla (alternativa):**

```html
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  @for (char of simpsonsResource.value()!.results; track char.id) {
    <a [routerLink]="['/simpsons', char.id]"
       class="card card-bordered bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer">
      <figure class="pt-6">
        <img
          [src]="char.portrait_path"
          [alt]="char.name"
          class="w-24 h-24 rounded-full object-cover ring-2 ring-primary" />
      </figure>
      <div class="card-body items-center text-center p-4">
        <h2 class="card-title text-sm">{{ char.name }}</h2>
        <p class="text-xs text-base-content/60">{{ char.occupation }}</p>
        <span class="badge badge-sm mt-1"
          [class.badge-success]="char.status === 'Alive'"
          [class.badge-error]="char.status === 'Dead'">
          {{ char.status }}
        </span>
      </div>
    </a>
  }
</div>
```

**Estado vacío:**

```html
@if (simpsonsResource.hasValue() && simpsonsResource.value()!.results.length === 0) {
  <div class="text-center py-20">
    <p class="text-2xl font-bold mb-2">Sin resultados</p>
    <p class="text-base-content/50">No se encontraron personajes para esta página.</p>
  </div>
}
```

---

## Paso 5. Crear la página de detalle `SimpsonDetailPage`

```bash
ng g c features/simpsons/pages/simpson-detail-page --skip-tests
```

En `simpson-detail-page.ts`:

```ts
export class SimpsonDetailPageComponent {
  private route = inject(ActivatedRoute);
  private simpsonsService = inject(SimpsonsService);

  character = rxResource({
    params: () => ({ id: Number(this.route.snapshot.paramMap.get('id')) }),
    stream: ({ params }) => this.simpsonsService.getCharacterById(params.id),
  });
}
```

> Requiere que `SimpsonsService` tenga un método `getCharacterById(id: number)`. Ver [files/simpsons.service.ts](files/simpsons.service.ts) para la versión completa del servicio.

Agregar el método en `SimpsonsService`:

```ts
getCharacterById(id: number): Observable<SimpsonsCharacter> {
  return this.http
    .get<SimpsonsCharacter>(`${this.baseUrl}/characters/${id}`)
    .pipe(
      catchError(() =>
        throwError(() => new Error(`Personaje ${id} no encontrado`))
      )
    );
}
```

En `simpson-detail-page.html`:

```html
<section class="bg-base-200 min-h-screen py-10 px-8">
  <div class="max-w-2xl mx-auto">

    <a routerLink="/simpsons"
       class="btn btn-ghost btn-sm mb-6">
      ← Volver al listado
    </a>

    @if (character.isLoading()) {
      <div class="flex justify-center items-center h-64">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }

    @if (character.error()) {
      <div class="alert alert-error">
        <span>No se pudo cargar el personaje.</span>
      </div>
    }

    @if (character.hasValue()) {
      <div class="card bg-base-100 shadow-xl">
        <figure class="pt-8">
          <img
            [src]="character.value()!.portrait_path"
            [alt]="character.value()!.name"
            class="w-36 h-36 rounded-full object-cover ring-4 ring-primary" />
        </figure>
        <div class="card-body items-center text-center">
          <h1 class="card-title text-2xl">{{ character.value()!.name }}</h1>
          <p class="text-base-content/60">{{ character.value()!.occupation }}</p>
          <span class="badge badge-lg mt-1"
            [class.badge-success]="character.value()!.status === 'Alive'"
            [class.badge-error]="character.value()!.status === 'Dead'">
            {{ character.value()!.status }}
          </span>
          @if (character.value()!.phrases.length > 0) {
            <div class="divider">Frases</div>
            <ul class="space-y-2 text-left w-full">
              @for (phrase of character.value()!.phrases; track $index) {
                <li class="bg-base-200 rounded-lg px-4 py-2 text-sm italic">
                  "{{ phrase }}"
                </li>
              }
            </ul>
          }
        </div>
      </div>
    }
  </div>
</section>
```

---

## Paso 6. Registrar la ruta de detalle

En `app.routes.ts`:

```ts
{
  path: 'simpsons',
  component: SimpsonsPageComponent,
},
{
  path: 'simpsons/:id',
  component: SimpsonDetailPageComponent,
},
```

Verificar que los links de la grid de cards en `SimpsonsPage` usan `[routerLink]="['/simpsons', char.id]"`.

---

## Paso 7. Revisión final de estilos en todos los componentes del módulo

Revisar que todos los componentes creados en este módulo cumplan:

- [ ] Fondo de sección: `bg-base-200` o `bg-base-100`
- [ ] Padding de sección: `py-10 px-8`
- [ ] Contenedor máximo: `max-w-5xl mx-auto` (listado) o `max-w-2xl mx-auto` (detalle)
- [ ] Spinner de carga: `loading loading-spinner loading-lg text-primary`
- [ ] Error: `alert alert-error`
- [ ] Cards con `card card-bordered bg-base-100 shadow`
- [ ] Badges de estado: `badge-success` / `badge-error` según el valor
- [ ] Paginación: `join` con `btn btn-sm`
- [ ] Botones secundarios: `btn btn-ghost btn-sm`

---

## Validaciones esperadas

- [ ] `ng serve` usa `environment.ts` sin errores
- [ ] `ng build --configuration=production` compila sin errores
- [ ] La URL de la API viene de `environment.apiUrl`
- [ ] El listado muestra cards con foto, nombre, ocupación y badge de estado
- [ ] Al hacer clic en una card navega a `/simpsons/:id`
- [ ] La página de detalle muestra loading, error y datos del personaje
- [ ] El botón "Volver" regresa al listado
- [ ] Todos los componentes usan clases de Tailwind y DaisyUI

---

## Commits sugeridos

```bash
git commit -m "feat: configurar variables de entorno con ng generate environments"
git commit -m "feat: usar environment.apiUrl en SimpsonsService"
git commit -m "feat: mejorar UI de SimpsonsPage con cards DaisyUI"
git commit -m "feat: agregar SimpsonDetailPage con rxResource y estilos completos"
git commit -m "feat: registrar ruta simpsons/:id en app.routes"
```
