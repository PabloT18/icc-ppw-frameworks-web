# Programación y Plataformas Web

# Frameworks Web: Angular 21 + UX

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 08. Mejoras Visuales y Usabilidad - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo práctico

Mejorar la experiencia de navegación y de consumo de datos del proyecto `ppw-angular-21` incorporando feedback visual, estados vacíos, error banners y paginación reutilizable.

---

## 2. Contexto de la práctica

El proyecto ya consume una API y tiene sistema visual. Ahora se busca que la aplicación comunique mejor su estado al usuario. Esta práctica aplica mejoras sobre navbar, página de personajes y componentes compartidos.

---

## 3. Archivos que se van a modificar

- `src/app/shared/components/app-navbar/app-navbar.ts`
- `src/app/shared/components/pagination/pagination.ts`
- `src/app/shared/components/empty-state/empty-state.ts`
- `src/app/shared/components/error-banner/error-banner.ts`
- `src/app/features/simpsons/pages/simpsons-page.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/08-mejoras-visuales-usabilidad/files](files/README.md) queda lista para guardar los componentes reutilizables de soporte UX de este módulo.

---

## 5. Código que el estudiante debe copiar inicialmente

### 5.1 Resaltado de ruta activa

```html
<a routerLink="/simpsons" routerLinkActive="btn-primary">Simpsons</a>
```

### 5.2 Base del componente de paginación

```ts
import { computed, input } from '@angular/core';

pages = input(0);
currentPage = input(1);

readonly pageList = computed(() => Array.from({ length: this.pages() }, (_, index) => index + 1));
```

---

## 6. Pasos incrementales

### Paso 1. Mejorar el navbar con feedback de ruta activa

Aplicar `routerLinkActive` a los enlaces principales.

Explicación técnica: la navegación deja de ser solo funcional y pasa a comunicar ubicación actual.

### Paso 2. Crear `ErrorBanner`

Construir un componente visual simple para errores reutilizables.

Explicación técnica: así los errores dejan de resolverse con bloques repetidos en cada página.

### Paso 3. Crear `EmptyState`

Diseñar un componente para listas sin resultados.

Explicación técnica: una lista vacía sin contexto suele percibirse como falla, no como estado válido.

### Paso 4. Crear `Pagination`

Agregar un componente que reciba total de páginas y página actual.

Explicación técnica: la paginación se encapsula como comportamiento compartido y prepara futuras mejoras con query params.

### Paso 5. Integrar estados en `SimpsonsPage`

Mostrar loading, error, empty state y lista de resultados usando los componentes creados.

Explicación técnica: se centraliza la UX de datos remotos.

### Paso 6. Revisar consistencia visual y usabilidad

Comprobar que mensajes, espaciado y acciones sean coherentes con el sistema visual ya definido.

Explicación técnica: una mejora UX no debe romper consistencia previa.

---

## 7. Validaciones esperadas

- El navbar resalta la ruta activa.
- Los errores remotos se muestran con un componente visible.
- Si no hay resultados, la UI muestra empty state.
- La paginación renderiza correctamente el número de páginas.
- La pantalla de personajes comunica mejor el estado del sistema.

Placeholder sugerido de captura: `assets/08-empty-error-pagination.png`

---

## 8. Entregables

- Navbar con ruta activa visible.
- Componentes `ErrorBanner`, `EmptyState` y `Pagination`.
- SimpsonsPage mejorada con estados completos.
- UX visual coherente en navegación y datos remotos.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: resaltar ruta activa en navbar"
git commit -m "feat: crear componentes ux de error empty y pagination"
git commit -m "refactor: integrar estados visuales en simpsons page"
```
