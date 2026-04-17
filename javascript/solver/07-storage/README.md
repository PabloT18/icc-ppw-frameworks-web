# Práctica 07 - Web Storage (Solución)

## Objetivo Pedagógico

Esta práctica está **enfocada en enseñar Web Storage (localStorage)** de forma clara y directa, evitando complejidad innecesaria.

## Estructura Simplificada

```
07-storage/
├── index.html                 # HTML simple con formulario y lista
├── css/styles.css             # Estilos básicos
└── js/
    ├── storage.js             # Servicio de Storage (CRUD)
    └── app.js                 # Lógica principal con createElement
```

**NO incluimos:**
- ❌ components.js (construcción directa en app.js)
- ❌ Filtros complejos
- ❌ Import/Export JSON
- ❌ Estadísticas detalladas
- ❌ Edición inline
- ❌ Múltiples temas

## ¿Qué SÍ incluimos?

### 1. storage.js - Servicio de Storage
Patrón de servicio que encapsula operaciones CRUD:
- getAll() - Leer todas las tareas
- guardar(tareas) - Guardar array completo
- crear(texto) - Crear nueva tarea
- toggleCompletada(id) - Cambiar estado
- eliminar(id) - Eliminar una tarea
- limpiarTodo() - Eliminar todas

**Demuestra:**
- localStorage.getItem() y setItem()
- JSON.stringify() y JSON.parse()
- Manejo de errores con try/catch
- IDs únicos con Date.now()

### 2. app.js - Lógica Principal
Código simple que muestra el flujo completo:
- Cargar datos desde localStorage al iniciar
- Crear elementos con createElement (NO innerHTML)
- Agregar, eliminar, marcar como completada
- Persistir cada cambio inmediatamente
- Tema simple (claro/oscuro) con CSS variables

**Demuestra:**
- Construcción de DOM con createElement
- Event listeners directos
- Sincronización estado ↔ localStorage
- Persistencia de preferencias (tema)

## ¿Qué Aprende el Estudiante?

1. **localStorage API básico**
2. **Serialización JSON**
3. **Patrón de Servicio**
4. **createElement**
5. **CSS Variables dinámicas**

**Sin distracciones.** Sin complejidad innecesaria. Solo lo esencial.
