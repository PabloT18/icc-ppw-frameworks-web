# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 10. Guards y Seguridad de Rutas

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Proteger rutas del proyecto incremental con guards funcionales y navegación condicional basada en el estado real de autenticación ya implementado con Firebase.

---

## 2. Explicación conceptual

Los guards son una capa de control de navegación, no un sustituto de la seguridad del backend o de Firestore. Su función es decidir si una ruta puede activarse o si debe redirigirse a otro lugar.

| Sin guards | Con guards |
|---|---|
| el usuario entra a rutas sin validación de sesión | la navegación respeta autenticación o roles |
| la lógica de acceso se repite en componentes | la decisión se centraliza |
| UX inconsistente | redirecciones coherentes |

---

## 3. Fundamento técnico

### 3.1 Guards funcionales

Angular moderno favorece guards funcionales sencillos.

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
```

### 3.2 Tipos de control más útiles en este curso

- rutas públicas
- rutas protegidas por autenticación
- rutas solo para visitantes, como login

### 3.3 Navegación condicional

El navbar debe reaccionar al estado de sesión para mostrar u ocultar enlaces según corresponda.

---

## 4. Ejemplos de código

### Ejemplo 1: ruta protegida

```ts
{
  path: 'favorites',
  component: FavoritesPage,
  canActivate: [authGuard],
}
```

### Ejemplo 2: ruta solo para visitantes

```ts
{
  path: 'login',
  component: LoginPage,
  canActivate: [guestGuard],
}
```

---

## 5. Buenas prácticas

- Centraliza la lógica de acceso en guards, no en cada componente.
- Devuelve `UrlTree` cuando corresponda redirigir.
- Mantén distinción clara entre rutas públicas y protegidas.
- Sincroniza el navbar con las reglas del router.
- Recuerda que el guard mejora navegación, no seguridad de backend.

---

## 6. Errores comunes

- Proteger solo la UI pero no los datos.
- Repetir validación de sesión en muchos componentes.
- Dejar accesible la ruta de login a usuarios autenticados sin criterio.
- No explicar al usuario por qué fue redirigido.
- Mezclar autorización compleja cuando el curso aún necesita claridad de autenticación base.

---

## 7. Relación con el proyecto incremental

Este módulo consolida la navegación del proyecto: desde aquí ya no todas las rutas son iguales y el acceso depende del estado del usuario. Es el paso final antes del despliegue.

---

## 8. Referencias recomendadas

- Documentación oficial del router: https://angular.dev/guide/routing
- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
