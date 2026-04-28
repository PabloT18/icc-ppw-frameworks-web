# Programación y Plataformas Web

# Frameworks Web: Angular 21 + UX

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 08. Mejoras Visuales y Usabilidad

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Refinar la experiencia de uso del proyecto incremental agregando estados visuales, feedback de navegación, mejoras de accesibilidad y componentes de soporte como paginación, empty state, skeletons y mensajes de error más claros.

---

## 2. Explicación conceptual

Una interfaz no mejora solo porque “se vea más bonita”. Mejora cuando comunica mejor el estado del sistema y reduce fricción para la persona usuaria.

| UI incompleta | UI usable |
|---|---|
| carga silenciosa | feedback visual de loading |
| errores ambiguos | mensajes claros y accionables |
| páginas vacías sin contexto | empty states explicativos |
| navegación sin pista visual | ruta activa y jerarquía clara |

Este módulo se conecta directamente con las heurísticas de usabilidad, aunque todavía sigue dentro del proyecto principal.

---

## 3. Fundamento técnico

### 3.1 Estados visuales del sistema

Toda pantalla que consume datos debería contemplar al menos:

- loading
- success
- empty
- error

### 3.2 Feedback de navegación

`routerLinkActive` permite señalar la ruta actual y mejorar orientación.

```html
<a routerLink="/students" routerLinkActive="btn-primary">Estudiantes</a>
```

### 3.3 Componentes de soporte

El proyecto puede mejorar mucho con piezas pequeñas reutilizables:

- pagination component
- skeleton block
- empty state card
- error banner

### 3.4 Relación con heurísticas

Las mejoras visuales deben responder a criterios concretos como:

- visibilidad del estado del sistema
- consistencia
- prevención de errores
- reconocimiento antes que recuerdo

---

## 4. Ejemplos de código

### Ejemplo 1: banner de error

```html
<div class="alert alert-error">
  <span>No se pudieron cargar los datos.</span>
</div>
```

### Ejemplo 2: empty state

```html
<section class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
  <h2 class="text-lg font-semibold">Sin resultados</h2>
  <p class="text-slate-500">Prueba otro criterio o vuelve más tarde.</p>
</section>
```

---

## 5. Buenas prácticas

- No diseñes solo para el estado exitoso.
- Resalta visualmente la ruta activa.
- Usa mensajes claros y breves.
- Da contexto cuando una lista esté vacía.
- Introduce paginación o filtros solo si realmente ayudan a la tarea.

---

## 6. Errores comunes

- Tratar loading y error como detalles opcionales.
- Agregar animaciones o adornos sin mejorar comprensión.
- Esconder acciones importantes en layouts confusos.
- No revisar contraste o legibilidad del tema seleccionado.
- Duplicar lógica de estados en varias páginas sin reutilización.

---

## 7. Relación con el proyecto incremental

Este módulo pule las features existentes, sobre todo la vista conectada a API. También deja una base de UX más sólida para cuando la aplicación tenga autenticación y rutas protegidas.

---

## 8. Referencias recomendadas

- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
- [angular/docs/angular-obserbables-rx.md](../docs/angular-obserbables-rx.md)
