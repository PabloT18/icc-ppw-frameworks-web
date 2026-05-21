# Programación y Plataformas Web

## Frameworks Web: Angular + TailwindCSS

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="TailwindCSS Logo"/>
</div>

## Práctica 9: Consumo de Componentes y Servicios

### Autor

**Pablo Torres**

📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)

📧 [pabloa_ec@hotmail.com](mailto:pabloa_ec@hotmail.com)

💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

# Introducción al consumo de servicios (APIs)

En una aplicación moderna, la mayoría de los datos no están definidos localmente, sino que se obtienen desde servidores remotos mediante **APIs REST**.
El consumo de estas APIs permite conectar el **front-end (Angular)** con un **back-end** (como Spring Boot, Node.js o Django).

En Angular, este proceso se gestiona mediante:

* **Servicios (`@Injectable`)** → encapsulan la lógica de comunicación con el servidor.
* **`HttpClient`** → ejecuta las peticiones HTTP (`GET`, `POST`, `PUT`, `DELETE`).
* **`Observables`** → manejan flujos de datos asincrónicos.
* **Operadores de RxJS (`map`, `tap`, `catchError`, etc.)** → transforman o gestionan las respuestas del servidor.

---

## Conceptos Fundamentales


Aquí tienes una explicación clara y lista para incluir en tu documentación sobre **cómo habilitar `HttpClient` con `fetch()` en Angular 20+**:

---

### Configuración de `HttpClient` con `fetch()` en Angular 20+

Para consumir servicios externos (APIs REST) en Angular, se requiere habilitar el **cliente HTTP**.
En las versiones modernas (Angular 17 en adelante), este cliente se configura desde el archivo `app.config.ts` usando el nuevo sistema de **ApplicationConfig**.

---

#### Importar los módulos necesarios

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
```

---

####  Registrar el cliente HTTP en los proveedores

Agrega `provideHttpClient(withFetch())` dentro del arreglo de `providers`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()), // habilita HttpClient usando la API Fetch
  ],
};
```

---

#### ¿Por qué usar `withFetch()`?

Angular permite usar dos backends para las peticiones HTTP:

| Backend                   | Descripción breve                                                               | Recomendado para                     |
| ------------------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| **XHR (por defecto)**     | Usa `XMLHttpRequest` tradicional. Menos eficiente.                              | Aplicaciones antiguas.               |
| **Fetch (`withFetch()`)** | Usa la **Fetch API nativa** del navegador. Soporta streams, abortos y promesas. | Aplicaciones modernas (Angular 17+). |

El método `withFetch()` indica que el `HttpClient` debe usar internamente la **Fetch API**, lo cual ofrece:

* **Mayor rendimiento** en navegadores modernos.
* **Soporte nativo** para `async/await`.
* **Menor peso en el bundle final**.
* **Mejor manejo de errores y cabeceras HTTP**.

---





| Concepto            | Descripción                                                                      | Ejemplo                                                 |
| ------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Servicio**        | Clase reutilizable que contiene la lógica de negocio o comunicación con una API. | `@Injectable({ providedIn: 'root' })`                   |
| **HttpClient**      | Módulo de Angular que permite enviar peticiones HTTP.                            | `this.http.get('https://api.com')`                      |
| **Observable**      | Flujo de datos que se puede suscribir y transformar.                             | `http.get().pipe(map(...))`                             |
| **Pipe**            | Método que encadena operadores sobre el flujo.                                   | `.pipe(map(), tap(), catchError())`                     |
| **Operadores RxJS** | Funciones que transforman o controlan el flujo.                                  | `map`, `tap`, `delay`, `catchError`, `of`, `throwError` |

---

## Estructura de un servicio en Angular

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://api.ejemplo.com';

  getData(query: string): Observable<any> {
    return this.http.get(`${this.API_URL}/data/${query}`).pipe(
      tap(() => console.log('Petición enviada')),
      map(response => response),
      catchError(error => {
        console.error('Error al obtener datos', error);
        return throwError(() => new Error('Error en la petición HTTP'));
      })
    );
  }
}
```

---

### Descripción de los elementos principales

| Elemento                              | Explicación                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| `@Injectable({ providedIn: 'root' })` | Hace que el servicio esté disponible en toda la aplicación (inyección global).  |
| `HttpClient`                          | Clase que permite ejecutar peticiones HTTP (`get`, `post`, `put`, `delete`).    |
| `API_URL`                             | Define la URL base del servidor o API que se va a consumir.                     |
| `.get()`                              | Ejecuta una petición HTTP GET.                                                  |
| `.pipe()`                             | Permite encadenar operadores RxJS para transformar o interceptar la respuesta.  |
| `tap()`                               | Ejecuta una acción secundaria, como registrar información o almacenar en caché. |
| `map()`                               | Transforma la respuesta antes de devolverla al componente.                      |
| `catchError()`                        | Captura y maneja errores HTTP sin romper la aplicación.                         |
| `throwError()`                        | Genera un flujo alternativo de error.                                           |

---

## Tipos de peticiones HTTP

| Método     | Descripción                       | Ejemplo                             |
| ---------- | --------------------------------- | ----------------------------------- |
| **GET**    | Obtiene información del servidor. | `this.http.get('/users')`           |
| **POST**   | Envía datos nuevos al servidor.   | `this.http.post('/users', newUser)` |
| **PUT**    | Actualiza un recurso existente.   | `this.http.put('/users/1', user)`   |
| **DELETE** | Elimina un recurso.               | `this.http.delete('/users/1')`      |

---

## Manejo de errores

Es importante capturar errores de red o del servidor para mantener una buena experiencia de usuario.

```typescript
catchError(error => {
  console.error('Error en la petición', error);
  return of([]); // Devuelve un array vacío como valor por defecto
})
```

Esto evita que el flujo Observable se interrumpa y permite al componente continuar funcionando.

---

## Operadores RxJS más comunes

| Operador       | Descripción                                      | Ejemplo                                     |
| -------------- | ------------------------------------------------ | ------------------------------------------- |
| `map()`        | Transforma los datos recibidos.                  | `map(response => response.data)`            |
| `tap()`        | Ejecuta un efecto secundario (log, cache, etc.). | `tap(() => console.log('Recibido'))`        |
| `catchError()` | Captura errores y devuelve un flujo alternativo. | `catchError(() => of([]))`                  |
| `delay()`      | Retrasa la emisión de datos.                     | `delay(1000)`                               |
| `of()`         | Crea un Observable con un valor fijo.            | `of(['dato1', 'dato2'])`                    |
| `throwError()` | Crea un flujo de error.                          | `throwError(() => new Error('Error HTTP'))` |

---

## Variables de entorno en Angular

Las **variables de entorno** se utilizan para centralizar configuraciones (por ejemplo, URLs de APIs, claves o banderas de entorno) y evitar escribir valores fijos en el código.

Creamos los archivos con 
```bash
ng generate environments
```


### Archivos comunes

| Archivo               | Propósito                                |
| --------------------- | ---------------------------------------- |
| `environment.ts`      | Configuración del entorno de desarrollo. |
| `environment.prod.ts` | Configuración del entorno de producción. |

### Ejemplo de configuración

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://api.devserver.com'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.productionserver.com'
};
```

### Uso dentro de un servicio

```typescript
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  getData(): Observable<any> {
    return this.http.get(`${this.API_URL}/data`).pipe(
      tap(() => console.log('Cargando datos desde', this.API_URL))
    );
  }
}
```

Esto permite cambiar automáticamente el origen de los datos según el entorno (`dev`, `test`, `prod`) sin modificar el código fuente.

Para **crear variables de entorno** en un proyecto Angular (por ejemplo, para configurar URLs como la de la API de *The Simpsons*), sigue estos pasos:

---

### **1. Ubicación de los archivos**


Angular crea por defecto dos archivos de entorno en la carpeta `src/environments/`:

```
src/
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

### **2. Definir las variables**

Edita cada archivo según el entorno (desarrollo o producción):

**`environment.ts` (para desarrollo)**

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://thesimpsonsapi.com/api'
};
```

**`environment.prod.ts` (para producción)**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://thesimpsonsapi.com/api'
};
```

---

### **3. Usar la variable en un servicio**

Importa el archivo `environment` y usa la variable:

```typescript
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCharacters() {
    return this.http.get(`${this.API_URL}/characters`);
  }
}
```

---

### **4. Angular selecciona automáticamente el entorno**

Cuando compilas el proyecto:

* `ng serve` → usa `environment.ts`
* `ng build --configuration=production` → usa `environment.prod.ts`

Esto se controla en `angular.json` dentro de `"fileReplacements"`, por ejemplo:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```



---

## Mejores prácticas para consumo de servicios

1. **Centralizar la URL base** en un archivo `environment.ts`.
2. **Encapsular la lógica HTTP** dentro del servicio, nunca en los componentes.
3. **Definir interfaces** para los modelos de datos (`User`, `Country`, `Product`, etc.).
4. **Evitar duplicación** creando métodos genéricos para peticiones repetidas.
5. **Usar `catchError()`** para capturar y manejar errores de forma controlada.
6. **Implementar caché local** (`Map`, `localStorage`) cuando el recurso no cambia con frecuencia.
7. **Combinar Observables con Signals** mediante `rxResource()` o `toSignal()` en Angular 20+ para flujo reactivo.

---

## Consumo profesional con Signals (Angular 20+)

En Angular 20+, podemos usar **Signals** y **`rxResource()`** para conectar servicios HTTP con un flujo reactivo sin suscripciones manuales.

### Ejemplo con `rxResource()`

```typescript
noticiasResource = rxResource({
  request: () => ({
    page: this.paginationService.currentPage() - 1,
    limit: this.noticiasPerPage(),
  }),
  loader: ({ request }) => {
    return this.noticiasService.getNoticiasUser({
      offset: request.page * 10,
      limit: request.limit,
    });
  },
});
```

### Ventajas de `rxResource()`

* Sin necesidad de suscribirse o desuscribirse manualmente.
* Reactividad automática ante cambios de señales.
* Ideal para consumo de APIs con paginación o filtros.
* Compatible con Angular Signals y RxJS.

---

## Conclusiones

1. Angular proporciona una arquitectura sólida para el consumo de APIs REST.
2. Los servicios deben manejar la comunicación y la transformación de datos, no los componentes.
3. RxJS permite flujos de datos eficientes, transformaciones y manejo de errores.
4. Las variables de entorno facilitan la gestión de configuraciones seguras y escalables.
5. Con Angular 20+, el uso de `Signals` y `rxResource()` moderniza el enfoque tradicional, brindando una reactividad más limpia y controlada.



# Práctica 9: Consumo de Servicios con API – The Simpsons API

## 1. Configuración del entorno

### Variables de entorno

Agrega la URL base de la API en los archivos `environment.ts` y `environment.prod.ts`:

```typescript
// environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://thesimpsonsapi.com/api'
};

// environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'https://thesimpsonsapi.com/api'
};
```





---

## 2. Creación del servicio `SimpsonsService`


```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  getCharacters(page: number = 1): Observable<SimpsonsResponse> {
    return this.http.get<SimpsonsResponse>(`${this.API_URL}/characters?page=${page}`).pipe(
      map(res => res),
      catchError(err => {
        console.error('Error al obtener personajes', err);
        return of({ count: 0, next: null, prev: null, pages: 0, results: [] });
      })
    );
  }

  getCharacterById(id: number): Observable<SimpsonsCharacterDetail | null> {
    return this.http.get<SimpsonsCharacterDetail>(`${this.API_URL}/characters/${id}`).pipe(
      catchError(err => {
        console.error('Personaje no encontrado', err);
        return of(null);
      })
    );
  }
}
```

> 🧩 **TIP:** Para generar interfaces automáticamente a partir de JSON, se puede usar la herramienta [https://app.quicktype.io](https://app.quicktype.io) o el comando VS Code “Paste JSON as Types”.

Creamos la interface SimpsonsResponse, SimpsonsCharacter, SimpsonsCharacterDetail
```typescript
export interface SimpsonsResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: SimpsonsCharacter[];
}
________



export interface SimpsonsCharacter {
  id: number;
  age: number | null;
  birthdate: string | null;
  gender: string;
  name: string;
  occupation: string;
  portrait_path: string;
  phrases: string[];
  status: string;
}

________

export interface SimpsonsCharacterDetail extends SimpsonsCharacter {
  description: string;
  first_appearance_ep: {
    id: number;
    name: string;
    airdate: string;
    description: string;
    image_path: string;
  };
}
```

---

## 3. Servicio de paginación `PaginationService`
En las aplicaciones que consumen APIs con resultados paginados, es común que cada petición incluya los parámetros page (número de página) y limit (cantidad de registros por página).
Para manejar esto de forma reactiva y sin lógica repetida, se puede crear un servicio que escuche los cambios en la URL y actualice la página actual automáticamente.

```typescript
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private activatedRoute = inject(ActivatedRoute);

  // Convierte los parámetros de la URL (?page=2) en una señal reactiva
  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      map((page) => (isNaN(page) ? 1 : page))
    ),
    { initialValue: 1 }
  );
}
```

| Elemento                       | Descripción                                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `ActivatedRoute`               | Permite acceder a los parámetros de la ruta actual (por ejemplo, `?page=2`).                             |
| `toSignal()`                   | Convierte el flujo del observable en una **Signal** reactiva que Angular puede detectar automáticamente. |
| `queryParamMap.pipe(map(...))` | Extrae y transforma el parámetro `page` desde la URL.                                                    |
| `initialValue: 1`              | Indica que, si no existe parámetro en la URL, se usará la página 1 por defecto.                          |

De esta forma, cuando el usuario cambia de página (por ejemplo, ?page=3), Angular detecta el cambio y actualiza automáticamente la señal currentPage, sin necesidad de recargar el componente.


---

## 4. Página principal `SimpsonsPage`

Generar el componente:

```bash
ng g c features/simpsons-page --standalone --skip-tests
```

```typescript

import { map } from 'rxjs';


export class SimpsonsPageComponent {
  private simpsonsService = inject(SimpsonsService);
  paginationService = inject(PaginationService);

  simpsonsResource = toSignal(
    this.simpsonsService.getCharacters(this.paginationService.currentPage()).pipe(
      map(res => res)
    ),
    { initialValue: null }
  );

  /// VERISION REACTIVA con recursos
 simpsonsResource = resource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.charactersPerPage(),
    }),
    loader: async ({ params }) => {
      return this.simpsonsService.getCharactersOptions({
        offset: params.page,
        limit: params.limit,
      });
    },
  });

  /// VERSIUON CON RXRESOURCE
  simpsonsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.charactersPerPage(),
    }),
    stream: ({params}) => {
      return this.simpsonsService.getCharactersOptions({
        offset: params.page,
        limit: params.limit,
      });
    },
  });


}
```

### 3. Versión **toSignal + pipe**

#### La forma manual y clásica

Aquí mismo se gestiona:

* Observables
* Estados de carga
* Errores
* Transformaciones

No se tiene estados como `isLoading()` o `error()`.

#### ✔ Ejemplo

```ts
simpsonsResource = toSignal(
  this.simpsonsService.getCharacters(this.paginationService.currentPage()).pipe(
    map(res => res)
  ),
  { initialValue: null }
);
```

#### ✔ Explicación

* `toSignal()` convierte un observable a una señal.
* **No actualiza automáticamente** cuando cambian los parámetros.
* No maneja estados de carga.
* No cancela peticiones automáticamente.

#### ✔ Cuándo usarlo

* Cuando necesitas convertir un observable simple a señal.
* Para casos extremadamente simples.
* Cuando no necesitas paginación ni recarga reactiva.

### 2. Versión **Resource**


#### Maneja promesas de forma automática

`resource()` es la nueva API principal en Angular 20 para cargar datos asíncronos usando señales.
Está diseñado para trabajar con **promesas**, no con observables.

#### ✔ Cómo funciona

`resource()` hace tres cosas automáticamente:

1. Lee señales dentro de `params` → recalcula el parámetro.
2. Llama al `loader` cuando los parámetros cambian.
3. Expone estados reactivos:

   * `value()`
   * `isLoading()`
   * `error()`

Es como un `computed()` + un `effect()` + manejo de carga integrada.

---

#### ✔ Ejemplo aplicado a `SimpsonsPage`

```ts
simpsonsResource = resource({
  params: () => ({
    page: this.paginationService.currentPage() - 1,
    limit: this.charactersPerPage(),
  }),
  loader: async ({ params }) => {
    return this.simpsonsService.getCharactersOptions({
      offset: params.page,
      limit: params.limit,
    });
  },
});
```

#### ✔ Explicación

* `params()` se ejecuta cada vez que cambian:

  * `currentPage()`
  * `charactersPerPage()`

* El `loader` recibe `{ params }` y **retorna una promesa** del servicio.

* La vista puede usar:

```html
@if(impsonsResource.isLoading()){
  <div >Cargando...</div>
}
@if(impsonsResource.value()){
  <div >{{ data | json }</div>
}

@if(impsonsResource.error()){
  <div >Error: {{ err }}</div>
}

```

#### ✔ Cuándo usar `resource`

* Cuando tu servicio devuelve promesas o usas async/await.
* Para lógica de paginación, filtros, sort, búsqueda.
* Para reemplazar un efecto manual que reactualiza datos.

---

### 3. Versión **rxResource**

#### Ideal para trabajar con **Observables** (RxJS)

`rxResource()` funciona parecido a `resource()`, pero:

* Trabaja con **observables**
* Usa `stream` (antes era `request` + `loader` en Angular 17–19)

#### ✔ Ejemplo

```ts
simpsonsResource = rxResource({
  params: () => ({
    page: this.paginationService.currentPage() - 1,
    limit: this.charactersPerPage(),
  }),
  stream: ({ params }) => {
    return this.simpsonsService.getCharactersOptions({
      offset: params.page,
      limit: params.limit,
    });
  },
});
```

#### ✔ Explicación

* Reacciona cuando `params()` cambia.
* Ejecuta un observable retornado por el servicio.
* Mantiene estados `.value()`, `.isLoading()`, `.error()`

#### ✔ Cuándo usar rxResource

* Cuando tus servicios ya trabajan con RxJS (observables).
* Cuando vas a combinar operadores (switchMap, catchError, etc.).
* Cuando necesitas cancelar peticiones anteriores (stream ya usa switchMap internamente).




---

### 4. Tabla comparativa completa

| Característica                                 | `resource()`             | `rxResource()`   | `toSignal()`                             |
| ---------------------------------------------- | ------------------------ | ---------------- | ---------------------------------------- |
| Tipo principal                                 | Promesas (async/await)   | Observables      | Observables                              |
| API reactiva                                   | Sí                       | Sí               | Parcial                                  |
| Recalcula con señales                          | Sí                       | Sí               | No (solo una vez)                        |
| Estados integrados (loading, error, value)     | Sí                       | Sí               | No                                       |
| Cancela peticiones anteriores                  | Sí (loader)              | Sí (switchMap)   | No                                       |
| Soporta paginación reactiva                    | Perfecto                 | Perfecto         | Limitado                                 |
| Manejo intuitivo                               | Muy alto                 | Alto             | Medio                                    |
| Ideal para                                     | Apps modernas Angular 20 | Apps con RxJS    | Casos simples                            |
| Facilidad para combinar filtrados y parámetros | Muy fácil                | Muy fácil        | Manual                                   |
| Quién lo recomienda Angular                    | Uso principal            | Alternativa RxJS | No recomendado para peticiones complejas |

---


### HTML: `simpsons-page.html`

```html
<section class="p-8">
  <h1 class="text-3xl font-bold mb-2 text-center">The Simpsons API</h1>
  <h2 class="text-lg text-center mb-6">Listado de personajes</h2>

  <!-- Spinner de carga -->
  @if (!simpsonsResource()) {
  <div class="flex justify-center items-center h-64">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
  }

  <!-- Tabla de personajes -->
  @if (simpsonsResource()) {
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Ocupación</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (personaje of simpsonsResource()?.results ?? []; track personaje.id) {
        <tr>
          <td>{{ personaje.id }}</td>
          <td>{{ personaje.name }}</td>
          <td>{{ personaje.occupation }}</td>
          <td>
            <span class="badge badge-{{ personaje.status === 'Alive' ? 'success' : 'error' }}">
              {{ personaje.status }}
            </span>
          </td>
          <td>
            <a [routerLink]="['/simpsons', personaje.id]" class="btn btn-sm btn-primary">
              Ver Detalle
            </a>
          </td>
        </tr>
        }
      </tbody>
    </table>
  </div>
  }
</section>
```

---

Version Resource o rxResource
```html
<section class="p-8">
    <h1 class="text-3xl font-bold mb-2 text-center">The Simpsons API</h1>
    <h2 class="text-lg text-center mb-6">Listado de personajes</h2>

    <!-- Spinner de carga -->
    @if (simpsonsResource.isLoading()) {
    <div class="flex justify-center items-center h-64">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
    }

    <!-- Paginación y controles -->
    @if (simpsonsResource.hasValue()) {
    <div class="flex gap-2 items-center h-20 mb-4">

        <select
            class="select select-bordered w-32"
            (change)="charactersPerPage.set(+selectPerPage.value)"
            #selectPerPage
        >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
        <app-pagination
            [pages]="simpsonsResource.hasValue()? simpsonsResource.value().pages : 0"
            [currentPage]="paginationService.currentPage()"
        />

        <div class="flex flex-1"></div>
    </div>
    }

    <!-- Tabla de personajes -->
    @if (simpsonsResource.hasValue()) {
    <div class="overflow-x-auto">
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Ocupación</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @for (personaje of simpsonsResource.value().results; track personaje.id) {
                <tr>
                    <td>{{ personaje.id }}</td>
                    <td>{{ personaje.name }}</td>
                    <td>{{ personaje.occupation }}</td>
                    <td>
                        <span class="badge badge-{{ personaje.status === 'Alive' ? 'success' : 'error' }}">
                            {{ personaje.status }}
                        </span>
                    </td>
                    <td>
                        <a
                            [routerLink]="['/simpsons', personaje.id]"
                            class="btn btn-sm btn-primary"
                        >
                            Ver Detalle
                        </a>
                    </td>
                </tr>
                }
            </tbody>
        </table>
    </div>
    }
</section>
```


Para mayor infromacion sobre cual escojer ver el archivo

[Angular Obserbables porque es recomdable por los expertos](../../docs/angular-obserbables-rx.md)

### Modificar el `SimpsonsService` agregar el siguiente metodo:

```typescript
getCharactersOptions(options: Options): Observable<SimpsonsResponse> {
    return this.http.get<SimpsonsResponse>(`${this.API_URL}/characters?page=${options.offset}`).pipe(
      delay(3500),
      map(res => res),
      catchError(err => {
        console.error('Error al obtener personajes', err);
        return of({ count: 0, next: null, prev: null, pages: 0, results: [] });
      })
    );
  }
```


### Crear la interface Options

```typescript
export interface Options {
    limit?: number;
    offset?: number;
}
```


## 5. Página de detalle `SimpsonDetailPage`

```bash
ng g c features/simpson-detail-page --standalone --skip-tests
```

```typescript

@Component({
  selector: 'app-simpson-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './simpson-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpsonDetailPageComponent {
  private route = inject(ActivatedRoute);
  private service = inject(SimpsonsService);

  personaje = toSignal(
    this.route.paramMap.pipe(
      map(params => +params.get('id')!),
      switchMap(id => this.service.getCharacterById(id))
    ),
    { initialValue: null }
  );
}
```

---

### HTML: `simpson-detail-page.html`

```html
<section class="p-8">
  @if (!personaje()) {
  <div class="flex justify-center items-center h-64">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
  }

  @if (personaje()) {
  <div class="card bg-base-100 shadow-xl p-6 max-w-4xl mx-auto">
    <figure>
      <img
        [src]="`https://cdn.thesimpsonsapi.com/500/character/6.webp`"
        [alt]="personaje()?.name"
        class="w-48 rounded-lg"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-2xl font-bold">{{ personaje()?.name }}</h2>
      <p class="text-gray-600 mb-2">{{ personaje()?.occupation }}</p>
      <p class="text-sm text-gray-500 mb-4">Estado: {{ personaje()?.status }}</p>
      <p class="mb-4">{{ personaje()?.description }}</p>
      <div>
        <h3 class="font-semibold">Frases destacadas:</h3>
        <ul class="list-disc pl-6">
          @for (frase of personaje()?.phrases ?? []; track frase) {
          <li>{{ frase }}</li>
          }
        </ul>
      </div>
    </div>
  </div>
  }
</section>
```

---

## 6. Navegación desde el Navbar

En el componente del **Navbar** agrega:

```html
<li><a routerLink="/simpsons">Simpsons</a></li>
```

Y configura la ruta en tu archivo de rutas:

```typescript
{
  path: 'simpsons',
  component: SimpsonsPageComponent,
},
{
  path: 'simpsons/:id',
  component: SimpsonDetailPageComponent,
}
```


