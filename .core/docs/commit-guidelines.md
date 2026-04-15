#  Guías para Comentarios de Commits - PRW-P67 Frameworks Web

##  Instrucciones para GitHub Copilot

Este archivo contiene las directrices para generar comentarios de commits consistentes y descriptivos en el proyecto de frameworks web PRW-P67.

##  Estructura General de Commits

### Formato Básico
```
<tipo>: <descripción>

[cuerpo opcional]

[pie opcional]
```

### Tipos de Commit

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `init` | Inicialización de proyecto | `init: configurar proyecto base` |
| `feat` | Nueva funcionalidad o inicio de práctica | `feat: Práctica 02 - Fundamentos completada` |
| `add` | Agregar módulos, componentes o características | `add: Práctica 02 - users model` |
| `upd` | Actualizar código existente | `upd: Práctica 02 - se actualizó el home page` |
| `END` | Finalizar práctica completamente | `END: Práctica 02 - Fundamentos completada` |
| `fix` | Corrección de errores | `fix: corregir error en servicio de datos` |
| `docs` | Documentación | `docs: actualizar README con instrucciones de instalación` |
| `style` | Cambios de formato/estilo | `style: aplicar formato ESLint` |
| `refactor` | Refactorización de código | `refactor: optimizar componente de header` |
| `test` | Agregar o modificar tests | `test: agregar tests unitarios para componente` |
| `chore` | Tareas de mantenimiento | `chore: actualizar dependencias` |
| `config` | Configuración | `config(webpack): optimar build production` |
| `scripts` | Scripts y herramientas | `scripts: agregar generador de estructura` |




## Ejemplos de Commits por Contexto

### Desarrollo Frontend

```bash
# Componentes nuevos
feat: implementar componente de header responsive

# Estilos y UI
style: aplicar diseño responsive a componente principal

# Funcionalidad
feat: agregar sistema de routing con React Router

# APIs y servicios
feat: integrar API de datos con fetch
```

### Correcciones

```bash
# Errores de funcionalidad
fix: corregir error de navegación en rutas anidadas

# Problemas de estilo
fix: resolver conflicto de estilos en componente modal

# Configuración
fix: corregir configuración de build para producción
```

### Documentación

```bash
# README y documentación
docs: actualizar instrucciones de instalación por framework

docs: agregar guía de componentes personalizados

docs: documentar uso del generador de estructura
```

### Configuración y Herramientas

```bash
# Dependencias
chore: actualizar Vue a versión 3.3.4

# Configuración de build
config: optimizar configuración para desarrollo

# Scripts de utilidad
scripts: agregar comando para limpiar carpetas vacías
```

##  Mejores Prácticas para Commits

###  Hacer (DO)

1. **Usar presente imperativo**: "agregar" no "agregado" o "agregando"
2. **Ser específico**: Mencionar qué archivo/componente se modificó
3. **Incluir el framework**: Usar el alcance apropiado
4. **Describir el "qué" y "por qué"**: No solo el "cómo"
5. **Commits atómicos**: Un commit = un cambio lógico

###  Evitar (DON'T)

1. **Commits genéricos**: "fix stuff", "update files"
2. **Commits masivos**: Muchos cambios no relacionados
3. **Faltas de ortografía**: Revisar antes de commit
4. **Commits sin contexto**: Sin explicar el propósito

## Plantillas por Contexto

### Para Prácticas del Curso

```bash
# Plantilla general para inicio de práctica
feat: Práctica <##> - <observación/descripción>

# Ejemplos:
feat: Práctica 01 - Instalación y configuración
feat: Práctica 02 - Fundamentos de componentes

# Plantilla para agregar funcionalidades
add: Práctica <##> - <elemento agregado>

# Ejemplos:
add: Práctica 02 - users model
add: Práctica 03 - header component
add: Práctica 04 - authentication service

# Plantilla para actualizaciones
upd: Práctica <##> - <descripción de actualización>

# Ejemplos:
upd: Práctica 02 - se actualizó el home page
upd: Práctica 03 - mejora en las rutas
upd: Práctica 04 - corrección de estilos

# Plantilla para finalizar práctica
END: Práctica <##> - <título de la práctica> completada

# Ejemplos:
END: Práctica 01 - Instalación y configuración completada
END: Práctica 02 - Fundamentos completada
```




## Instrucciones para GitHub Copilot

Al generar comentarios de commit, considera:

1. **Contexto del archivo**: Framework, tipo de archivo, propósito
2. **Cambios realizados**: Qué se modificó exactamente
3. **Impacto**: A qué afecta el cambio
4. **Convenciones**: Seguir el formato establecido

### Ejemplos de Prompts para Copilot

```
// Para generar commit de nueva funcionalidad en Vue
// feat: implementar [descripción específica]

// Para corrección en Angular
// fix: corregir [problema específico] en [componente/archivo]

// Para documentación
// docs: actualizar [qué documentación] con [qué información]
```

##  Nota para Desarrolladores

Este archivo debe mantenerse actualizado con nuevas convenciones y ejemplos específicos del proyecto. Si agregas nuevos frameworks o cambias la estructura, actualiza las plantillas correspondientes.

**Recuerda**: Un buen commit message es una inversión en el futuro del proyecto. Facilita la revisión de código, el debugging y la comprensión del historial.