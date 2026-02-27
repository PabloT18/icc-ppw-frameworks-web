# Programación y Plataformas Web 

# Frameworks Web: Angular

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>


## 2 Fundamentos - Práctica Autónoma 02.01

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)



## Instrucciones - Parte 1: Configuración Básica

### 1. Crear el componente PerfilPage

Crear el componente de Angular `PerfilPage` usando Angular CLI en la ubicación: `perfil/pages/perfil-page`

### 2. Configurar la ruta

Agregar la ruta para el componente `PerfilPage` en el archivo `app.routes.ts`:

```typescript
export const routes: Routes = [
  // ... ruta de home
  {
    path: 'perfil',
    component: PerfilPageComponent
  },
  // ... ruta de redirección
];
```

**Importante:** La ruta debe ser `'perfil'` sin el `/` al inicio.

---

## Instrucciones - Parte 2: Signals y Métodos Básicos

### 3. Crear signals para datos personales

En `perfil-page.component.ts`, crear tres signals:

**Valores iniciales:**
- `name` → 'Juan'
- `lastName` → 'Pérez'
- `age` → 30

### 4. Método getFullName()

Crear un método que retorne la concatenación del nombre y apellido.

**Resultado esperado:** 
```
getFullName() => 'Juan Pérez'
```

### 5. Método changeData()

Implementar el método que cambie todos los datos personales a:

**Nuevos valores:**
- name → 'Ana'
- lastName → 'Gonzales'
- age → 25

Este método debe asignarse al evento click de un botón en el HTML.

### 6. Método resetData()

Implementar el método que restaure los valores iniciales. 

**Sugerencia:** Guardar los valores iniciales en constantes privadas de la clase.

Este método debe asignarse al evento click de un botón en el HTML.


### 7. Método changeAge()

Implementar el método que cambie la edad a 18.

**Resultado esperado:**
```
changeAge() => age = 18
```

Este método debe asignarse al evento click de un botón en el HTML.

### 8. Mostrar nombre completo en mayúsculas

En el HTML, mostrar el `name` y `lastName` en un solo campo en mayúsculas **sin crear una nueva señal**.

**Pista:** Usar el pipe `uppercase` y concatenación con `+`

---

## Instrucciones - Parte 3: Signals con Arrays

### 9. Crear signal con array de habilidades

Agregar un nuevo signal que contenga un array de habilidades técnicas:

**Valores iniciales:**
```
skills => ['Angular', 'TypeScript', 'HTML']
```

### 10. Método addSkill()

Crear un método que agregue una nueva habilidad al array usando `mutate()`.

**Parámetro:** `skill: string`

**Validación:** Verificar que el string no esté vacío antes de agregar.

### 11. Método removeSkill()

Crear un método que elimine una habilidad por su índice usando `mutate()`.

**Parámetro:** `index: number`

### 12. Mostrar lista de habilidades con @for

En el HTML, mostrar la lista de habilidades usando la directiva `@for`:

**Requisitos:**
- Usar `track $index`
- Mostrar el número de posición y el nombre de la habilidad
- Botón para eliminar cada habilidad
- Usar `@empty` para mostrar mensaje cuando no hay habilidades

### 13. Contador de habilidades

Crear un método que retorne el total de habilidades.

**Resultado esperado:**
```
getSkillsCount() => número total de habilidades
```

---

## Instrucciones - Parte 4: Signals con Arrays de Objetos

### 14. Crear interface y signal de proyectos

**Interface Project:**
- id: number
- name: string
- year: number
- completed: boolean

**Signal projects con valores iniciales:**
```
[
  { id: 1, name: 'Portfolio Web', year: 2024, completed: true },
  { id: 2, name: 'E-commerce App', year: 2025, completed: false }
]
```

### 15. Método addProject()

Crear un método que agregue un nuevo proyecto al array usando `mutate()`.

**Parámetro:** `project: Project`

### 16. Método toggleProjectStatus()

Crear un método que cambie el estado `completed` de un proyecto.

**Parámetro:** `id: number`

**Lógica:** Buscar el proyecto por id y cambiar su estado a lo contrario de su valor actual.

### 17. Mostrar proyectos con @for y @if

En el HTML, mostrar los proyectos:

**Requisitos:**
- Usar `@for` con `track project.id`
- Mostrar nombre y año del proyecto
- Usar `@if` para mostrar badge diferente según estado (completado o en progreso)
- Botón para cambiar el estado
- Usar `@empty` para manejar lista vacía

### 18. Filtrar proyectos completados

Crear un método que retorne solo los proyectos con `completed: true`.

**Resultado esperado:**
```
getCompletedProjects() => Project[] (solo completados)
```

Mostrar en el HTML la cantidad de proyectos completados.

---

## Instrucciones - Parte 5: Directivas Condicionales

### 19. Validación de edad con @if

En el HTML, usar `@if` para mostrar diferentes mensajes según la edad:

**Condiciones:**
- Si edad >= 18: Mostrar "Mayor de edad"
- Si edad < 18: Mostrar "Menor de edad"

### 20. Clasificación por edad con @switch

Crear un método que clasifique por rango de edad:

**Resultado esperado:**
```
getAgeCategory() => 'menor' | 'joven' | 'adulto' | 'senior'
```

**Rangos:**
- menor: < 18
- joven: 18-29
- adulto: 30-59
- senior: >= 60

En el HTML, usar `@switch` para mostrar la categoría correspondiente con un mensaje descriptivo.

---

## Estructura del HTML

El archivo `perfil-page.component.html` debe incluir las siguientes secciones:

1. **Sección de datos personales:**
   - Mostrar name, lastName, nombre completo
   - Nombre en mayúsculas (con pipe)
   - Edad
   - Botones: Cambiar Datos, Cambiar Edad, Restaurar

2. **Validación de edad:**
   - Usar @if para mayor/menor de edad

3. **Categoría por edad:**
   - Usar @switch para mostrar categoría

4. **Sección de habilidades:**
   - Contador total
   - Lista con @for
   - Botón para agregar habilidad

5. **Sección de proyectos:**
   - Contador de completados
   - Lista con @for
   - Badges según estado con @if
   - Botón para cambiar estado

---

## Resumen de Conceptos a Aplicar

1. Signals básicos (string, number)
2. Signals con arrays (string[])
3. Signals con arrays de objetos (Project[])
4. Métodos con `set()`
5. Métodos con `mutate()`
6. Interpolación `{{ }}`
7. Pipes `| uppercase`
8. Event binding `(click)`
9. Directiva `@if` con `@else`
10. Directiva `@for` con `track` y `@empty`
11. Directiva `@switch` con `@case` y `@default`
12. Métodos de filtrado de arrays



