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

## 1. Objetivo del tema

Conectar el proyecto incremental con una API real mediante `HttpClient`, servicios con `inject`, tipado fuerte, manejo explícito de loading, error y estado vacío.

---

## 2. Explicación conceptual

En Angular, consumir una API no consiste solo en “hacer un GET”. También implica modelar datos, encapsular acceso remoto, manejar fallos y renderizar estados de interfaz coherentes.

| Consumo improvisado | Consumo robusto |
|---|---|
| lógica HTTP dentro del componente | lógica encapsulada en servicios |
| respuestas sin tipado claro | modelos o interfaces definidos |
| sin manejo de estado | loading, error y empty state explícitos |
| errores visibles solo en consola | errores integrados en la UI |

---

## 3. Fundamento técnico

### 3.1 Registrar `HttpClient`

```ts
import { provideHttpClient, withFetch } from '@angular/common/http';

providers: [
  provideRouter(routes),
  provideHttpClient(withFetch()),
]
```

### 3.2 Servicio con `inject`

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://thesimpsonsapi.com/api';
}
```

### 3.3 Tipado y RxJS

```ts
getCharacters(page: number) {
  return this.http.get<SimpsonsResponse>(`${this.apiUrl}/characters?page=${page}`);
}
```

```ts
pipe(
  catchError(() => throwError(() => new Error('No se pudieron cargar los personajes')))
)
```

### 3.4 Estados de interfaz

Un consumo bien enseñado debe considerar al menos cuatro estados:

- idle
- loading
- success
- error

Si el resultado válido puede ser vacío, también debe contemplarse `empty`.

---

## 4. Ejemplos de código

### Ejemplo 1: servicio HTTP tipado

```ts
readonly characters$ = this.simpsonsService.getCharacters(1);
```

### Ejemplo 2: renderizado con estados

```html
@if (isLoading()) {
  <p>Cargando...</p>
} @else if (errorMessage()) {
  <p>{{ errorMessage() }}</p>
} @else {
  @for (character of characters(); track character.id) {
    <article>{{ character.name }}</article>
  }
}
```

---

## 5. Buenas prácticas

- Mantén la lógica HTTP fuera del componente.
- Tipa la respuesta de la API.
- Modela errores de red y errores de respuesta separadamente cuando haga falta.
- No uses `subscribe()` en cualquier lugar si puedes mantener un flujo más declarativo.
- Integra el resultado remoto a una UI con estados claros.

---

## 6. Errores comunes

- Hacer llamadas HTTP directamente en la plantilla.
- Renderizar datos sin contemplar loading o error.
- Dejar el tipo de respuesta como `any`.
- Acoplar el componente a URLs hardcodeadas repetidas.
- Tratar RxJS como ruido en lugar de usarlo para modelar flujos correctamente.

---

## 7. Relación con el proyecto incremental

Este módulo agrega la primera fuente de datos remota real al proyecto. A partir de aquí ya existen estados visuales que luego podrán mejorarse en el módulo 08 y protegerse en módulos posteriores.

---

## 8. Referencias recomendadas

- [angular/docs/angular-obserbables-rx.md](../docs/angular-obserbables-rx.md)
- Documentación oficial HttpClient: https://angular.dev/guide/http
