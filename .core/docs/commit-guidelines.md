#  Guías para Comentarios de Commits - PRW-P67 Frameworks Web

##  Instrucciones para GitHub Copilot

Este archivo contiene las directrices para generar comentarios de commits consistentes y descriptivos en el proyecto de frameworks web PRW-P67.

##  Estructura General de Commits

### Formato Básico
```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[pie opcional]
```

### Tipos de Commit

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat(vue): agregar componente de navegación` |
| `fix` | Corrección de errores | `fix(angular): corregir error en servicio de datos` |
| `docs` | Documentación | `docs: actualizar README con instrucciones de instalación` |
| `style` | Cambios de formato/estilo | `style(react): aplicar formato ESLint` |
| `refactor` | Refactorización de código | `refactor(astro): optimizar componente de header` |
| `test` | Agregar o modificar tests | `test(vue): agregar tests unitarios para componente` |
| `chore` | Tareas de mantenimiento | `chore: actualizar dependencias` |
| `init` | Inicialización de proyecto | `init(angular): configurar proyecto base` |
| `config` | Configuración | `config(webpack): optimizar build production` |
| `scripts` | Scripts y herramientas | `scripts: agregar generador de estructura` |

### Alcances Comunes

| Alcance | Descripción |
|---------|-------------|
| `angular` | Cambios específicos del proyecto Angular |
| `vue` | Cambios específicos del proyecto Vue |
| `react` | Cambios específicos del proyecto React |
| `astro` | Cambios específicos del proyecto Astro |
| `scripts` | Scripts de utilidad del proyecto |
| `docs` | Documentación general |
| `config` | Archivos de configuración |
| `deps` | Dependencias |


## Reglas de nomenclaturales de archivos y carpetas

- Nombres de carpetas de estudiantes: `<apellido1>_<apellido2>` (todo en minúsculas, sin espacios).
- Nombres de archivos Markdown: `01_instalacion.md`, `02_navegacion_forms.md`, etc.
- Nombres de componentes y módulos: Usar PascalCase (ejemplo: `MyComponent`, `UserModule`).
- Nombres de servicios: Usar camelCase con sufijo `Service` (ejemplo: `userService`).
- Nombres de variables y funciones: Usar camelCase (ejemplo: `getUserData`, `isLoggedIn`).

### Assets estáticos (imágenes, estilos, etc.) deben ubicarse en carpetas específicas dentro de cada proyecto de estudiante en la carpeta `assets`.

* **imágenes** → `/assets/images/`
    * Los nombres de archivos de imagen deben ser descriptivos y en minúsculas, separados por guiones
    * Ejemplo: `logo_empresa.png`, `fondo_principal.jpg`
    * **Para prácticas específicas**: incluir el número de práctica al final del nombre con formato `p##`
        * Práctica 01: `01-instalacion_configuracion`
        * Imagen: `01-instalacion-angular-p01.png`

* estilos → `/assets/styles/` :  los nombres de archivos de estilo deben ser descriptivos y en minúsculas, separados por guiones (ejemplo: `estilos_principal.css`, `temas_varios.scss`).
* scripts → `/assets/scripts/` :  los nombres de archivos de script deben ser descriptivos y en minúsculas, separados por guiones (ejemplo: `funciones_utiles.js`, `validaciones_formulario.js`).

## Ejemplos de Commits por Contexto

###   Estructura de Estudiantes

```bash
# Al crear carpetas de estudiantes
feat(scripts): agregar generador automático de estructura de estudiantes

- Crear script Python para generar carpetas por framework
- Incluir .gitignore automático en cada carpeta
- Soporte para configuración JSON de estudiantes

# Al agregar estudiantes específicos
feat(vue): agregar proyecto base para torres_garcia

# Al modificar estructura
refactor(scripts): mejorar lógica de generación de carpetas
```

### 🎨 Desarrollo Frontend

```bash
# Componentes nuevos
feat(angular): implementar componente de header responsive

# Estilos y UI
style(vue): aplicar diseño responsive a componente principal

# Funcionalidad
feat(react): agregar sistema de routing con React Router

# APIs y servicios
feat(astro): integrar API de datos con fetch
```

### 🐛 Correcciones

```bash
# Errores de funcionalidad
fix(angular): corregir error de navegación en rutas anidadas

# Problemas de estilo
fix(vue): resolver conflicto de estilos en componente modal

# Configuración
fix(config): corregir configuración de build para producción
```

### 📚 Documentación

```bash
# README y documentación
docs: actualizar instrucciones de instalación por framework

docs(angular): agregar guía de componentes personalizados

docs(scripts): documentar uso del generador de estructura
```

### 🔧 Configuración y Herramientas

```bash
# Dependencias
chore(deps): actualizar Vue a versión 3.3.4

# Configuración de build
config(vite): optimizar configuración para desarrollo

# Scripts de utilidad
scripts: agregar comando para limpiar carpetas vacías
```

## 🎯 Mejores Prácticas para Commits

### ✅ Hacer (DO)

1. **Usar presente imperativo**: "agregar" no "agregado" o "agregando"
2. **Ser específico**: Mencionar qué archivo/componente se modificó
3. **Incluir el framework**: Usar el alcance apropiado
4. **Describir el "qué" y "por qué"**: No solo el "cómo"
5. **Commits atómicos**: Un commit = un cambio lógico

### ❌ Evitar (DON'T)

1. **Commits genéricos**: "fix stuff", "update files"
2. **Commits masivos**: Muchos cambios no relacionados
3. **Faltas de ortografía**: Revisar antes de commit
4. **Commits sin contexto**: Sin explicar el propósito

## 📐 Plantillas por Contexto

### Para Proyectos de Estudiantes

```bash
# Estructura inicial
init(<framework>): configurar proyecto base para <apellido1>_<apellido2>

# Ejemplo:
init(vue): configurar proyecto base para torres_garcia
```

### Para Funcionalidades

```bash
# Nueva característica
feat(<framework>): implementar <funcionalidad> en <componente>

# Ejemplo:
feat(react): implementar validación de formularios en ContactForm
```

### Para Correcciones

```bash
# Error específico
fix(<framework>): corregir <problema> en <ubicación>

# Ejemplo:
fix(angular): corregir error de rendering en ProductList
```

## 🤖 Instrucciones para GitHub Copilot

Al generar comentarios de commit, considera:

1. **Contexto del archivo**: Framework, tipo de archivo, propósito
2. **Cambios realizados**: Qué se modificó exactamente
3. **Impacto**: A qué afecta el cambio
4. **Convenciones**: Seguir el formato establecido

### Ejemplos de Prompts para Copilot

```
// Para generar commit de nueva funcionalidad en Vue
// feat(vue): implementar [descripción específica]

// Para corrección en Angular
// fix(angular): corregir [problema específico] en [componente/archivo]

// Para documentación
// docs: actualizar [qué documentación] con [qué información]
```

## 📊 Casos de Uso Frecuentes

### Proyectos de Estudiantes

```bash
# Inicialización
init(vue): configurar proyecto inicial para torres_garcia
init(angular): configurar proyecto inicial para gonzalez_marca

# Desarrollo
feat(vue/torres_garcia): implementar página de inicio
feat(angular/gonzalez_marca): agregar servicio de autenticación

# Correcciones
fix(react/martinez_lopez): corregir problema de compilación
```

### Scripts y Herramientas

```bash
# Nuevos scripts
scripts: agregar generador automático de estructura de estudiantes
scripts: implementar limpiador de carpetas vacías

# Mejoras
refactor(scripts): optimizar generador de carpetas
fix(scripts): corregir manejo de rutas en Windows
```

## 🔄 Workflow Recomendado

1. **Antes del commit**: Revisar cambios con `git diff`
2. **Escribir commit**: Seguir el formato establecido
3. **Revisar mensaje**: Verificar ortografía y claridad
4. **Commit atómico**: Un cambio lógico por commit

---

##  Nota para Desarrolladores

Este archivo debe mantenerse actualizado con nuevas convenciones y ejemplos específicos del proyecto. Si agregas nuevos frameworks o cambias la estructura, actualiza las plantillas correspondientes.

**Recuerda**: Un buen commit message es una inversión en el futuro del proyecto. Facilita la revisión de código, el debugging y la comprensión del historial.