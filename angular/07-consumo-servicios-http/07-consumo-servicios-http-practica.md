# Programación y Plataformas Web

# Frameworks Web: Angular 21 + HTTP

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 07. Consumo de Servicios HTTP - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Conectar el proyecto `ppw-angular-21` a una API pública para listar personajes, agregando un servicio HTTP robusto, tipado fuerte y estados de carga, error y vacío.

---

## 2. Contexto de la práctica

El proyecto ya tiene UI base y sistema visual. Ahora se agregará una feature `simpsons` o equivalente, que servirá como caso real para consumo remoto y posteriormente para mejoras de UX, Firebase y guards.

---

## 3. Archivos que se van a modificar

- `src/app/app.config.ts`
- `src/app/app.routes.ts`
- `src/app/features/simpsons/services/simpsons.service.ts`
- `src/app/features/simpsons/pages/simpsons-page.ts`
- `src/app/features/simpsons/models/simpsons.interface.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/07-consumo-servicios-http/files](files/README.md) queda lista para guardar el servicio, modelos y página base de este módulo.

---

## 5. Código inicial

### 5.1 Registrar `HttpClient`

```ts
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};
```

### 5.2 Crear un modelo base

```ts
export interface SimpsonsCharacter {
  id: number;
  name: string;
  image: string;
}

export interface SimpsonsResponse {
  results: SimpsonsCharacter[];
  totalDocs: number;
  totalPages: number;
}
```

---

## 6. Pasos incrementales

### Paso 1. Crear la feature `simpsons`

Agregar modelos, servicio y página para aislar el acceso remoto de otras features.

Explicación: se conserva la organización por feature incluso cuando aparece la capa HTTP.

### Paso 2. Implementar el servicio

Crear `SimpsonsService` con `inject(HttpClient)` y un método `getCharacters(page: number)`.

Explicación: la URL base y el acceso remoto quedan encapsulados.

### Paso 3. Crear la página consumidora

Definir un estado mínimo para loading, error y personajes.

Explicación: no se enseña solo la petición, sino el comportamiento completo de la pantalla.

### Paso 4. Renderizar loading y error

```html
@if (isLoading()) {
  <p>Cargando personajes...</p>
} @else if (errorMessage()) {
  <p>{{ errorMessage() }}</p>
}
```

Explicación: el usuario no debe depender de la consola para entender fallos.

### Paso 5. Renderizar datos en cards o tabla

Mostrar personajes usando `@for` y componentes visuales creados en módulos previos.

Explicación: el consumo HTTP se integra con la UI ya existente, no vive aislado.

### Paso 6. Agregar ruta y acceso desde el navbar

Incluir la nueva vista dentro del flujo principal del proyecto.

Explicación: desde aquí la aplicación ya tiene una sección alimentada por datos remotos.

---

## 7. Validaciones esperadas

- La ruta nueva carga personajes desde la API.
- El estado loading aparece antes de renderizar datos.
- Si la petición falla, la UI muestra error visible.
- La lista se renderiza sin usar `any`.
- El navbar permite llegar a la nueva vista.

Placeholder sugerido de captura: `assets/07-simpsons-api.png`

---

## 8. Entregables

- Servicio HTTP funcional.
- Modelos tipados para la respuesta.
- Página conectada a API pública.
- Estados de carga y error visibles en UI.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: registrar httpclient con withFetch"
git commit -m "feat: agregar feature simpsons con servicio tipado"
git commit -m "feat: renderizar estados loading error y data"
```
