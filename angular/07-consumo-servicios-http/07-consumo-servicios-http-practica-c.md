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

- `src/environments/environment.development.ts` — variables de desarrollo
- `src/environments/environment.ts` — variables de producción
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


Caundo usa cada una, dependiendo de la forma de ejecución.

| Comando                               | Archivo real                 |
| ------------------------------------- | ---------------------------- |
| `ng serve`                            | `environment.development.ts` |
| `ng build`                            | `environment.ts`             |
| `ng build --configuration production` | `environment.ts`             |


---

## Paso 2. Definir las variables

Editar `src/environments/environment.development.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://thesimpsonsapi.com/api',
};
```

Crear `src/environments/environment.ts`:

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



## Commits sugeridos

```bash
git commit -m "feat: registrar ruta simpsons/:id en app.routes"
```
