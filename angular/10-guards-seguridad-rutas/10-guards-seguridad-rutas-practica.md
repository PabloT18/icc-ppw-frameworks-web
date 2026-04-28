# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 10. Guards y Seguridad de Rutas - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo práctico

Aplicar guards funcionales al proyecto `ppw-angular-21` para proteger rutas privadas, controlar el acceso a login y sincronizar la navegación con el estado real de sesión.

---

## 2. Contexto de la práctica

El proyecto ya tiene autenticación con Firebase. Ahora se usarán guards para controlar qué rutas pueden verse según el estado de sesión. El objetivo es evitar tanto acceso indebido como una experiencia incoherente de navegación.

---

## 3. Archivos que se van a modificar

- `src/app/app.routes.ts`
- `src/app/core/guards/auth.guard.ts`
- `src/app/core/guards/guest.guard.ts`
- `src/app/shared/components/app-navbar/app-navbar.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/10-guards-seguridad-rutas/files](files/README.md) queda lista para almacenar los guards funcionales y fragmentos de rutas protegidas del módulo.

---

## 5. Código que el estudiante debe copiar inicialmente

### 5.1 Auth guard funcional

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
```

### 5.2 Ruta protegida

```ts
{ path: 'favorites', component: FavoritesPage, canActivate: [authGuard] }
```

---

## 6. Pasos incrementales

### Paso 1. Crear `authGuard`

Implementar el guard que protege rutas privadas.

Explicación técnica: el guard evita repetir validación de sesión dentro de cada página.

### Paso 2. Crear `guestGuard`

Proteger la ruta de login para que un usuario autenticado no vuelva a entrar a ella innecesariamente.

Explicación técnica: así se controla tanto el acceso privado como el acceso para visitantes.

### Paso 3. Actualizar rutas

Aplicar guards a rutas como favoritos, formulario privado o panel personal.

Explicación técnica: la estructura de rutas del proyecto ya expresa reglas reales de acceso.

### Paso 4. Ajustar navbar

Mostrar enlaces distintos según haya sesión activa o no.

Explicación técnica: la navegación visible debe coincidir con las reglas del router.

### Paso 5. Probar redirecciones

Intentar entrar a rutas privadas sin autenticación y verificar redirección a login.

Explicación técnica: no basta con configurar guards; hay que validar el flujo real.

---

## 7. Validaciones esperadas

- Un usuario no autenticado no puede abrir rutas privadas.
- Un usuario autenticado no vuelve a ver login como ruta normal.
- El navbar cambia según el estado de sesión.
- Las redirecciones son coherentes y previsibles.

Placeholder sugerido de captura: `assets/10-guard-redirect.png`

---

## 8. Entregables

- `authGuard` funcional.
- `guestGuard` funcional.
- Rutas privadas protegidas.
- Navegación condicional sincronizada con sesión.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: crear auth guard funcional"
git commit -m "feat: agregar guest guard y proteger login"
git commit -m "refactor: sincronizar navbar con rutas protegidas"
```
