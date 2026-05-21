# Programación y Plataformas Web

# Frameworks Web: Angular 21 + HTTP

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 07. Consumo de Servicios HTTP

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Frontend, Angular y Backend

### La relación entre capas

Una aplicación moderna rara vez trabaja con datos propios. La mayor parte de la información que muestra en pantalla proviene de un servidor remoto: una base de datos, un sistema de autenticación, un servicio de pagos, una API pública.

El **frontend** (Angular) es responsable de presentar esos datos al usuario, pero no de almacenarlos ni procesarlos a nivel profundo. Eso le corresponde al **backend**: un servidor construido con Node.js, Spring Boot, Django, Laravel u otro framework que expone endpoints HTTP.

```
Usuario → Angular (frontend) → API REST (backend) → Base de datos
```

La comunicación entre Angular y el backend ocurre mediante **peticiones HTTP**: el cliente solicita datos con `GET`, envía datos nuevos con `POST`, actualiza con `PUT` y elimina con `DELETE`. El servidor responde generalmente con JSON.

### Consumo de datos externos en una aplicación moderna

Cuando se trabaja con datos remotos, aparecen situaciones que no existen con datos locales:

- La respuesta tarda (latencia de red)
- La respuesta puede fallar (servidor caído, timeout, error 500)
- La respuesta puede devolver datos inválidos o vacíos
- La misma solicitud puede repetirse múltiples veces con parámetros distintos

Una aplicación bien construida contempla todos estos escenarios. No basta con "hacer un GET y mostrar los datos". Hay que manejar el estado de carga, los errores y las respuestas vacías de forma explícita.

### ¿Qué es un servicio en Angular?

Un **servicio** es una clase reutilizable que contiene lógica que no pertenece a ningún componente visual en particular. Encapsula responsabilidades transversales: comunicarse con una API, calcular un resultado, guardar información en caché o registrar eventos.

La regla es sencilla: **si la lógica no es de presentación, va en un servicio**.

Ejemplos de qué puede ser un servicio (en términos conceptuales, sin código):

| Nombre del servicio | Responsabilidad |
|---|---|
| `AuthService` | Gestionar login, logout y el token del usuario |
| `ProductService` | Obtener, filtrar y actualizar productos desde una API |
| `CartService` | Mantener el estado del carrito de compras |
| `LoggerService` | Registrar eventos o errores en un sistema de monitoreo |
| `NotificationService` | Mostrar alertas y mensajes al usuario |
| `StorageService` | Leer y escribir en `localStorage` o `sessionStorage` |
| `ThemeService` | Controlar el tema visual (claro/oscuro) de la aplicación |

### Cómo se crea un servicio

Angular CLI genera el esqueleto de un servicio con un solo comando:

```bash
ng generate service nombre-del-servicio
# o en forma corta:
ng g s nombre-del-servicio
```

El resultado es una clase decorada con `@Injectable`, lo que le indica a Angular que esta clase puede ser inyectada como dependencia en otros componentes o servicios:

```ts
@Injectable({ providedIn: 'root' })
export class MiServicio {
  // lógica aquí
}
```

`providedIn: 'root'` significa que Angular crea una sola instancia del servicio para toda la aplicación (singleton). No se necesita declararlo en ningún módulo.

### HTTP en Angular: `HttpClient`

Para realizar peticiones HTTP, Angular provee `HttpClient`, un cliente especializado que:

- Ejecuta peticiones GET, POST, PUT, DELETE
- Retorna **Observables** (flujos de datos asincrónicos de RxJS)
- Soporta tipado genérico para las respuestas
- Permite encadenar **operadores RxJS** para transformar o interceptar las respuestas

A diferencia de `fetch` nativo o `axios`, `HttpClient` está integrado con el sistema de inyección de dependencias de Angular y el pipeline de interceptores, lo que facilita agregar autenticación, logging o reintentos de forma centralizada.

### Observables y manejo asincrónico

`HttpClient` no retorna una promesa: retorna un **Observable**. Un Observable representa un flujo de datos que puede emitir cero o más valores a lo largo del tiempo y que puede fallar o completarse.

Para trabajar con ese flujo, se usa `.pipe()` junto con operadores de RxJS que permiten transformar, filtrar, manejar errores o combinar respuestas sin necesidad de anidar callbacks ni encadenar `.then()`.

---

## 2. Configuración de `HttpClient`

### Habilitar `HttpClient` en Angular

`HttpClient` no está disponible de forma global por defecto. Debe registrarse explícitamente en la configuración de la aplicación.

En Angular 17+, esto se hace en `app.config.ts` usando la función `provideHttpClient`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};
```

Con esta línea, Angular registra el servicio HTTP en toda la aplicación y cualquier componente o servicio puede inyectar `HttpClient`.

### `withFetch()`: fetch vs XHR

Angular admite dos backends para ejecutar peticiones HTTP:

| Backend | Descripción | Disponible desde |
|---|---|---|
| **XHR (por defecto)** | Usa `XMLHttpRequest`, el mecanismo clásico del navegador | Angular < 17 |
| **Fetch (`withFetch()`)** | Usa la Fetch API nativa del navegador | Angular 17+ |

**¿Por qué usar `withFetch()`?**

- La Fetch API es el estándar moderno para peticiones HTTP en navegadores
- Soporte nativo para cancelación de peticiones (`AbortController`)
- Mejor integración con Service Workers y caching nativo
- Rendimiento mejorado en navegadores modernos
- Menor tamaño de bundle final
- Soporte completo para streaming de respuestas

En Angular moderno (17+), **`withFetch()` es la opción recomendada**.

---

## 3. Operadores RxJS

### ¿Qué son los operadores RxJS?

RxJS (Reactive Extensions for JavaScript) es una librería para programación reactiva basada en Observables. Los **operadores** son funciones que transforman, filtran o combinan los valores que emite un Observable.

Se encadenan usando `.pipe()`, que toma el flujo de datos y lo pasa por cada operador en orden.

```
Observable → .pipe( operador1, operador2, operador3 ) → resultado
```

### Operadores más usados con `HttpClient`

| Operador | ¿Qué hace? | ¿Para qué se usa? |
|---|---|---|
| `map()` | Transforma el valor emitido en otro valor | Extraer una propiedad de la respuesta, convertir tipos |
| `tap()` | Ejecuta un efecto secundario sin modificar el flujo | Logs, guardar en caché, activar loading |
| `catchError()` | Captura errores y devuelve un flujo alternativo | Mostrar mensajes de error sin romper la aplicación |
| `switchMap()` | Cancela el Observable anterior y ejecuta uno nuevo | Búsquedas en tiempo real, peticiones dependientes |
| `debounceTime()` | Espera un tiempo antes de emitir | Evitar peticiones en cada keystroke |
| `distinctUntilChanged()` | Solo emite si el valor cambió respecto al anterior | Evitar peticiones duplicadas |
| `forkJoin()` | Combina múltiples Observables y emite cuando todos completan | Cargar varios recursos en paralelo |
| `throwError()` | Crea un Observable que emite un error | Reenviar errores desde `catchError` |
| `of()` | Crea un Observable con un valor fijo | Devolver valores por defecto en errores |

### ¿Cómo funcionan?

Cada operador recibe el valor que emitió el Observable anterior y puede transformarlo o reaccionar a él. La cadena completa no se ejecuta hasta que alguien se suscribe al Observable (o hasta que Angular lo resuelve mediante `resource` o `rxResource`).

```ts
// Concepto visual del flujo:
httpGet()              // emite: { data: [...], total: 10 }
  .pipe(
    map(res => res.data),     // emite: [...]
    tap(data => cache(data)), // efecto secundario, emite: [...]
    catchError(() => of([]))  // si falla, emite: []
  )
```

El componente no necesita saber cómo viene la respuesta del servidor. Solo recibe el valor ya transformado.

---

## 4. Estructura de un servicio HTTP en Angular

### Cómo estructurar un servicio

Un servicio HTTP bien estructurado tiene:

1. **Decorador `@Injectable`** con `providedIn: 'root'`
2. **`HttpClient` inyectado** mediante `inject()`
3. **URL base** como constante privada
4. **Métodos** que retornan Observables tipados
5. **Transformación de respuesta** con `map()`
6. **Manejo de errores** con `catchError()`

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { MiModelo, MiRespuesta } from '../models/mi-modelo.interface';

@Injectable({ providedIn: 'root' })
export class MiServicio {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://api.ejemplo.com';

  getItems(): Observable<MiModelo[]> {
    return this.http.get<MiRespuesta>(`${this.baseUrl}/items`).pipe(
      map(res => res.results),
      tap(items => console.log('Items cargados:', items.length)),
      catchError(err => throwError(() => new Error('No se pudieron cargar los items')))
    );
  }

  getItemById(id: number): Observable<MiModelo> {
    return this.http.get<MiModelo>(`${this.baseUrl}/items/${id}`).pipe(
      catchError(() => throwError(() => new Error(`Item ${id} no encontrado`)))
    );
  }
}
```

### `inject()` para servicios propios

El módulo 03 introdujo `inject()` para acceder al router. El mismo patrón aplica para cualquier servicio:

```ts
// En lugar de constructor(private http: HttpClient)
private http = inject(HttpClient);

// Para inyectar servicios propios en un componente:
private miServicio = inject(MiServicio);

// Para inyectar un servicio en otro servicio:
private otroServicio = inject(OtroServicio);
```

`inject()` es la forma moderna de Angular 14+ y funciona tanto en componentes como en servicios, guards e interceptores, siempre que se use dentro de un contexto de inyección.

### URL base centralizada

La URL base de la API se define como constante privada en el servicio. Esto evita repetirla en cada método y facilita el cambio cuando se migra entre entornos:

```ts
private readonly baseUrl = 'https://api.ejemplo.com/v1';
```

Más adelante (sección 8), esta URL se extrae a variables de entorno para mayor control entre desarrollo y producción.

### Separación de lógica: servicio vs componente

| El servicio se encarga de | El componente se encarga de |
|---|---|
| Construir la URL de la petición | Llamar al método del servicio |
| Tipado de la respuesta | Guardar el resultado en un signal |
| Transformar la respuesta con `map` | Renderizar los datos en el template |
| Manejar errores HTTP | Mostrar el error al usuario |
| Definir headers o params opcionales | Responder a eventos del usuario |

El componente **no debe conocer** la URL, los headers HTTP ni la estructura interna de la respuesta. Solo recibe el dato ya procesado.

### Servicio centralizado para múltiples consumos

En proyectos medianos y grandes, es común tener un servicio genérico de HTTP que centraliza la configuración base (URL, headers comunes, manejo de errores global) y del cual dependen los servicios específicos:

```
HttpClientService (genérico)
  ├── SimpsonsService → usa HttpClientService para sus endpoints
  ├── UserService    → usa HttpClientService para sus endpoints
  └── PostService    → usa HttpClientService para sus endpoints
```

Esto evita repetir configuración en cada servicio y garantiza comportamiento consistente en toda la aplicación.

---

## 5. Buenas prácticas

### Encapsular la lógica HTTP en servicios

El componente no debe contener `http.get()`, ni URLs, ni lógica de transformación. Toda esa responsabilidad pertenece al servicio.

**Por qué:** si mañana cambia la API (estructura, URL, paginación), solo se modifica el servicio. Los componentes no necesitan cambiar.

### Definir interfaces para los modelos de datos

Antes de consumir una API, se definen las interfaces TypeScript que representan la respuesta:

```ts
export interface SimpsonsCharacter {
  id: number;
  name: string;
  occupation: string;
  portrait_path: string;
}

export interface SimpsonsResponse {
  count: number;
  pages: number;
  results: SimpsonsCharacter[];
}
```

**Por qué:** el compilador detecta errores de tipo en tiempo de desarrollo. El editor ofrece autocompletado. La respuesta de la API queda documentada en código.

> Herramienta útil para generar interfaces desde JSON: [https://app.quicktype.io](https://app.quicktype.io)

### Evitar duplicidad de código

Si dos servicios hacen la misma petición con distintos parámetros, se crea un método reutilizable con parámetros opcionales:

```ts
// En lugar de getCharactersPage1() y getCharactersPage2() separados:
getCharacters(page: number = 1, limit: number = 10): Observable<SimpsonsResponse>
```

### Manejar errores con `catchError`

Cada método del servicio debe capturar errores para que el componente reciba un flujo controlado:

```ts
catchError(err => {
  console.error('Error HTTP:', err.status, err.message);
  return throwError(() => new Error('No se pudo conectar con el servidor'));
})
```

Esto evita que un error HTTP rompa la suscripción y deje el componente en un estado indefinido.

---

## 6. Consumir servicios con Signals

### `resource()` y `rxResource()`

Angular 19+ introduce dos APIs para conectar servicios HTTP con Signals, eliminando la necesidad de suscripciones manuales:

| API | Trabaja con | Cancela peticiones anteriores | Estado integrado |
|---|---|---|---|
| `resource()` | Promesas / async-await | Sí | Sí |
| `rxResource()` | Observables (RxJS) | Sí (via switchMap) | Sí |
| `toSignal()` | Observables | No | No |

Ambas APIs exponen automáticamente tres estados reactivos:

- `.value()` — el dato cuando la petición tuvo éxito
- `.isLoading()` — `true` mientras la petición está en curso
- `.error()` — el error si la petición falló
- `.hasValue()` — `true` si hay un valor disponible

### `resource()` — para servicios que retornan promesas

```ts
simpsonsResource = resource({
  params: () => ({
    page: this.paginationService.currentPage(),
  }),
  loader: async ({ params }) => {
    return await firstValueFrom(
      this.simpsonsService.getCharacters(params.page)
    );
  },
});
```

- `params()` lee signals; cuando cambian, se relanza el `loader`
- `loader` recibe los params y retorna una promesa
- Angular cancela automáticamente la petición anterior si los params cambian antes de que termine

### `rxResource()` — para servicios que retornan Observables

```ts
simpsonsResource = rxResource({
  params: () => ({
    page: this.paginationService.currentPage(),
  }),
  stream: ({ params }) => {
    return this.simpsonsService.getCharacters(params.page);
  },
});
```

- Funciona igual que `resource()` pero acepta un Observable en `stream`
- Internamente usa `switchMap`, cancelando peticiones anteriores
- Ideal cuando los servicios ya devuelven Observables (como `HttpClient`)

### Uso en el template

```html
@if (simpsonsResource.isLoading()) {
  <span class="loading loading-spinner loading-lg"></span>
}

@if (simpsonsResource.hasValue()) {
  @for (char of simpsonsResource.value()!.results; track char.id) {
    <div>{{ char.name }}</div>
  }
}

@if (simpsonsResource.error()) {
  <p class="text-error">Error al cargar los datos</p>
}
```

### ¿Cuándo usar cada uno?

| Situación | Recomendación |
|---|---|
| Servicio retorna Observable (HttpClient) | `rxResource()` |
| Servicio retorna promesa o async/await | `resource()` |
| Caso simple, sin paginación ni recarga | `toSignal()` |
| Paginación, filtros, búsqueda reactiva | `resource()` o `rxResource()` |

---

## 7. Paginación

### ¿Por qué crear un servicio de paginación?

Cuando se consumen APIs paginadas, la página actual aparece como parámetro en la URL (`?page=2`). Sin un servicio centralizado, cada componente tendría que:

- Leer el parámetro de la URL manualmente
- Convertirlo de string a número
- Sincronizarlo con la navegación
- Pasarlo a cada petición HTTP

Un `PaginationService` encapsula todo eso y expone `currentPage` como un **signal reactivo** que cualquier componente o servicio puede leer.

### Estructura del `PaginationService`

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

| Elemento | Descripción |
|---|---|
| `ActivatedRoute` | Permite acceder a los parámetros de la URL actual |
| `queryParamMap` | Observable que emite cuando los query params cambian |
| `map(...)` | Extrae y convierte el parámetro `page` a número |
| `toSignal()` | Convierte el Observable en un Signal reactivo |
| `initialValue: 1` | Valor por defecto si no hay `?page=` en la URL |

### Conversión de Observables a Signals

`toSignal()` es la función puente entre RxJS y el sistema de Signals de Angular:

```ts
import { toSignal } from '@angular/core/rxjs-interop';

const miSignal = toSignal(miObservable$, { initialValue: valorInicial });
```

Una vez convertido, `miSignal()` se comporta como cualquier otro signal: Angular lo puede leer en `computed`, `effect`, `resource` y templates.

### Uso del `PaginationService` en un componente

```ts
paginationService = inject(PaginationService);

simpsonsResource = rxResource({
  params: () => ({ page: this.paginationService.currentPage() }),
  stream: ({ params }) => this.simpsonsService.getCharacters(params.page),
});
```

Cuando el usuario navega a `?page=3`, `currentPage` cambia automáticamente → `params()` recalcula → `rxResource` lanza una nueva petición.

---

## 8. Variables de entorno en Angular

### ¿Para qué sirven?

Las variables de entorno permiten centralizar configuraciones que cambian entre entornos (desarrollo, staging, producción): URLs de APIs, claves de servicios, flags de features.

Sin variables de entorno, los equipos escriben URLs hardcodeadas en los servicios y luego las cambian manualmente antes de cada despliegue, lo que genera errores.

### Generar los archivos de entorno

```bash
ng generate environments
```

Esto crea la carpeta `src/environments/` con dos archivos:

```
src/
└── environments/
    ├── environment.ts              ← desarrollo (ng serve)
    └── environment.development.ts ← alias de desarrollo
```

### Definir las variables

```ts
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://api.desarrollo.com/v1'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.produccion.com/v1'
};
```

### Usar las variables en un servicio

```ts
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCharacters(page: number = 1): Observable<SimpsonsResponse> {
    return this.http.get<SimpsonsResponse>(`${this.baseUrl}/characters?page=${page}`);
  }
}
```

### Selección automática del entorno

Angular reemplaza automáticamente el archivo de entorno según el comando ejecutado:

| Comando | Archivo usado |
|---|---|
| `ng serve` | `environment.ts` |
| `ng build --configuration=production` | `environment.prod.ts` |

Esto se configura en `angular.json` mediante `fileReplacements` y no requiere intervención manual en el código.

---

## 9. Tabla comparativa: `resource` vs `rxResource` vs `toSignal`

| Característica | `resource()` | `rxResource()` | `toSignal()` |
|---|---|---|---|
| Tipo principal | Promesas / async-await | Observables | Observables |
| Recalcula cuando signals cambian | Sí | Sí | No (solo una vez) |
| Estados integrados (loading, error, value) | Sí | Sí | No |
| Cancela peticiones anteriores | Sí | Sí (switchMap) | No |
| Ideal para paginación reactiva | Sí | Sí | Limitado |
| Recomendado por Angular | Uso principal | Alternativa RxJS | Casos simples |

---

## 10. Referencias recomendadas

- [Observables y RxJS en Angular](../docs/angular-obserbables-rx.md)
- Documentación oficial HttpClient: https://angular.dev/guide/http
- Documentación `resource` / `rxResource`: https://angular.dev/guide/signals/resource
- RxJS operators: https://rxjs.dev/guide/operators
