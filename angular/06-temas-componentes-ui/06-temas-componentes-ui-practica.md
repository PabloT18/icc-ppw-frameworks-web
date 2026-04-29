# Programación y Plataformas Web

# Frameworks Web: Angular 21 + TailwindCSS

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="TailwindCSS Logo">
</div>

## 06. Temas y Componentes UI - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo

Incorporar DaisyUI o una capa equivalente de componentes visuales para construir navbar, footer y cards reutilizables dentro del proyecto `ppw-angular-21`.

---

## 2. Contexto de la práctica

El proyecto ya tiene layout base con Tailwind. Ahora se agregará un sistema visual reutilizable para dejar la aplicación lista para estados de datos, consumo HTTP y navegación más rica.

---

## 3. Archivos que se van a modificar

- `src/styles.css`
- `src/index.html`
- `src/app/app.ts`
- `src/app/shared/components/app-navbar/app-navbar.ts`
- `src/app/shared/components/app-footer/app-footer.ts`
- `src/app/shared/components/dashboard-card/dashboard-card.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/06-temas-componentes-ui/files](files/README.md) queda lista para almacenar el navbar, footer y card base del sistema visual.

---

## 5. Código inicial

### 5.1 Activar DaisyUI

```css
@import "tailwindcss";
@plugin "daisyui";
```

### 5.2 Definir tema en `index.html`

```html
<html lang="es" data-theme="cupcake">
```

---

## 6. Pasos incrementales

### Paso 1. Instalar DaisyUI

Agregar DaisyUI al proyecto.

Explicación: la librería se apoya en Tailwind, por lo que se monta encima de la base visual ya creada.

### Paso 2. Crear `AppNavbar`

Construir un navbar reusable con enlaces a Home, Profile, Students y Formulario.

Explicación: el navbar deja de ser HTML incrustado y se convierte en componente compartido.

### Paso 3. Crear `AppFooter`

Agregar un footer simple con información del proyecto y del curso.

Explicación: el footer consolida el layout general y evita duplicación.

### Paso 4. Crear `DashboardCard`

Definir una card reusable para accesos rápidos o métricas simples.

Explicación: es el primer componente visual genérico del proyecto y servirá después para estados de dashboard o resumen.

### Paso 5. Integrar componentes al shell

Actualizar `app.ts` para mostrar navbar y footer alrededor del `router-outlet`.

Explicación: el shell se convierte en layout de aplicación, no solo en contenedor visual.

### Paso 6. Aplicar componentes visuales en Home

Usar `DashboardCard` o componentes DaisyUI para mejorar los accesos principales.

Explicación: la HomePage se transforma en interfaz de entrada coherente al sistema visual.

---

## 7. Validaciones esperadas

- El tema visual se aplica correctamente.
- El navbar y footer aparecen en todas las páginas.
- Home muestra cards o bloques visuales reutilizables.
- La navegación visual es coherente entre móvil y desktop.

Placeholder sugerido de captura: `assets/06-navbar-theme.png`

---

## 8. Entregables

- DaisyUI o capa de tema equivalente integrada.
- Navbar reutilizable funcionando.
- Footer reutilizable funcionando.
- Card compartida aplicada al menos en Home.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: integrar daisyui y tema base del proyecto"
git commit -m "feat: crear navbar y footer reutilizables"
git commit -m "feat: agregar dashboard cards compartidas"
```
