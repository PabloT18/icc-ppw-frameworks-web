# Scripts de Utilidad - PRW-P67 Frameworks Web

Esta carpeta contiene scripts de utilidad para la gestión del proyecto de frameworks web.

##  Contenido

- `generar_estructura.py` - Script para generar automáticamente la estructura de carpetas de estudiantes
- `estudiantes.json` - Archivo de configuración con la lista de estudiantes

## 🚀 Uso del Script de Generación de Estructura

### Descripción

El script `generar_estructura.py` genera automáticamente carpetas para estudiantes en los diferentes frameworks (Angular, Vue, React, Astro) y crea un archivo `.gitignore` en cada carpeta.

### Prerequisitos

- Python 3.6 o superior

### Configuración

Edita el archivo `estudiantes.json` con la lista de estudiantes. El formato es:

```json
{
  "estudiantes": [
    ["apellido1", "apellido2", "framework"],
    ["apellido1", "apellido2", "framework"]
  ]
}
```

**Ejemplo:**

```json
{
  "estudiantes": [
    ["torres", "garcia", "vue"],
    ["torres", "garcia", "angular"],
    ["gonzalez", "marca", "astro"],
    ["gonzalez", "marca", "angular"],
    ["rodriguez", "lopez", "react"]
  ]
}
```

### Frameworks soportados

- `angular`
- `vue`
- `react`
- `astro`

### Ejecutar el Script

Desde la raíz del proyecto:

```bash
python .scripts/generar_estructura.py
```

O desde cualquier ubicación:

```bash
python /ruta/completa/.scripts/generar_estructura.py
```

### Resultado

El script creará:

```
angular/
├── torres_garcia/
│   └── .gitignore
└── gonzalez_marca/
    └── .gitignore

vue/
└── torres_garcia/
    └── .gitignore

astro/
└── gonzalez_marca/
    └── .gitignore

react/
└── rodriguez_lopez/
    └── .gitignore
```

### Características

- ✅ Crea carpetas con el formato `apellido1_apellido2`
- ✅ Genera automáticamente un `.gitignore` en cada carpeta
- ✅ Verifica si las carpetas ya existen (no las sobrescribe)
- ✅ Crea las carpetas de framework si no existen
- ✅ Mensajes informativos durante la ejecución

### Contenido del .gitignore

El script incluye automáticamente un `.gitignore` completo que ignora:

- `node_modules/` y dependencias
- Carpetas de build/dist
- Archivos de entorno (.env)
- Logs
- Archivos del sistema (.DS_Store)
- Configuraciones de IDEs
- Archivos de cache

### Notas

- Los nombres de las carpetas se crean siempre en **minúsculas**
- Si una carpeta ya existe, el script lo indica pero no la sobrescribe
- Si un framework no existe, se crea automáticamente

## 🔧 Personalización

Puedes modificar:

1. **Plantilla del .gitignore**: Edita la variable `GITIGNORE_TEMPLATE` en `generar_estructura.py`
2. **Formato del nombre de carpeta**: Modifica la función `crear_carpeta_estudiante()`
3. **Lista de estudiantes**: Edita `estudiantes.json`

## 📝 Ejemplo Completo

```bash
# 1. Editar estudiantes.json con tu lista
# 2. Ejecutar el script
python .scripts/generar_estructura.py

# Salida esperada:
# ============================================================
#   GENERADOR DE ESTRUCTURA DE CARPETAS PARA ESTUDIANTES
# ============================================================
#
# 📂 Cargando configuración desde: estudiantes.json
#
# 🚀 Iniciando generación de carpetas...
#
# ✅ Creada carpeta: vue/torres_garcia
#    📄 Creado .gitignore en vue/torres_garcia
# ✅ Creada carpeta: angular/torres_garcia
#    📄 Creado .gitignore en angular/torres_garcia
# ...
#
# ✨ Proceso completado!
#
# 📊 Resumen:
#    Total de carpetas procesadas: 6
```

## ⚠️ Importante

Este script está diseñado para ser ejecutado desde la raíz del proyecto. Asegúrate de estar en el directorio correcto antes de ejecutarlo.
