#!/usr/bin/env python3
"""
Script para generar estructura de carpetas de estudiantes por framework.
Autor: Pablo Torres
"""

import os
import json
from pathlib import Path
from typing import List, Tuple

# Directorio base del proyecto (asumiendo que el script está en .core/scripts/)
BASE_DIR = Path(__file__).parent.parent.parent

# Plantilla de .gitignore
GITIGNORE_TEMPLATE = """# Dependencias
node_modules/
bower_components/

# Archivos de compilación
dist/
build/
.next/
.nuxt/
.output/
.astro/

# Archivos de entorno
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Sistema operativo
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Cache
.cache/
.parcel-cache/
.temp/
"""


def crear_carpeta_estudiante(framework: str, apellido1: str, apellido2: str) -> None:
    """
    Crea una carpeta para un estudiante en el framework especificado.
    
    Args:
        framework: Nombre del framework (angular, vue, react, astro)
        apellido1: Primer apellido del estudiante
        apellido2: Segundo apellido del estudiante
    """
    # Convertir a minúsculas y crear nombre de carpeta
    nombre_carpeta = f"{apellido1.lower()}_{apellido2.lower()}"
    
    # Ruta completa de la carpeta
    ruta_framework = BASE_DIR / framework
    ruta_carpeta = ruta_framework / nombre_carpeta
    
    # Verificar que el framework existe
    if not ruta_framework.exists():
        print(f"⚠️  Advertencia: La carpeta '{framework}' no existe. Creándola...")
        ruta_framework.mkdir(parents=True, exist_ok=True)
    
    # Crear la carpeta del estudiante
    if ruta_carpeta.exists():
        print(f"ℹ️  La carpeta '{nombre_carpeta}' ya existe en '{framework}'")
    else:
        ruta_carpeta.mkdir(parents=True, exist_ok=True)
        print(f"✅ Creada carpeta: {framework}/{nombre_carpeta}")
    
    # Crear carpeta assets
    ruta_assets = ruta_carpeta / "assets"
    if not ruta_assets.exists():
        ruta_assets.mkdir(parents=True, exist_ok=True)
        print(f"   📁 Creada carpeta assets en {framework}/{nombre_carpeta}")
        
        # Crear README.md en la carpeta assets
        assets_readme = ruta_assets / "README.md"
        assets_readme_content = f"""# Assets - {apellido1.title()} {apellido2.title()}

Esta carpeta contiene todos los recursos para la documentación del framework **{framework.title()}**.

## 📁 Organización Sugerida

```
assets/
├── capturas/          # Capturas de pantalla
│   ├── instalacion/   # Capturas del proceso de instalación
│   ├── componentes/   # Capturas de componentes
│   └── formularios/   # Capturas de formularios
├── codigo/            # Archivos de código de ejemplo
└── diagramas/         # Diagramas y esquemas
```

##  Nomenclatura de Imágenes

- Usar nombres descriptivos: `instalacion-npm-install.png`
- Incluir el tema: `componentes-header-resultado.png`
- Formato preferido: PNG para capturas, JPG para fotos

## 💡 Consejos

- Mantener las imágenes organizadas por tema
- Usar tamaños razonables (máximo 2MB por imagen)
- Referenciar las imágenes en los archivos .md usando rutas relativas

##  Cómo Referenciar en Markdown

```markdown
![Descripción](assets/capturas/instalacion/npm-install.png)
```
"""
        with open(assets_readme, 'w', encoding='utf-8') as f:
            f.write(assets_readme_content)
        print(f"    Creado README.md en assets")
    else:
        print(f"   ℹ️  Carpeta assets ya existe en {framework}/{nombre_carpeta}")
    
    # Crear .gitignore dentro de la carpeta
    ruta_gitignore = ruta_carpeta / ".gitignore"
    if not ruta_gitignore.exists():
        with open(ruta_gitignore, 'w', encoding='utf-8') as f:
            f.write(GITIGNORE_TEMPLATE)
        print(f"   📄 Creado .gitignore en {framework}/{nombre_carpeta}")
    else:
        print(f"   ℹ️  .gitignore ya existe en {framework}/{nombre_carpeta}")


def procesar_lista_estudiantes(estudiantes: List[List[str]]) -> None:
    """
    Procesa una lista de estudiantes y crea sus carpetas correspondientes.
    Cada estudiante tendrá una carpeta en su framework específico Y también en Angular.
    
    Args:
        estudiantes: Lista de listas [apellido1, apellido2, framework]
    """
    print("\n🚀 Iniciando generación de estructura de carpetas...\n")
    
    for estudiante in estudiantes:
        if len(estudiante) != 3:
            print(f"⚠️  Entrada inválida (se esperan 3 elementos): {estudiante}")
            continue
        
        apellido1, apellido2, framework = estudiante
        
        # Crear carpeta en el framework específico del estudiante
        crear_carpeta_estudiante(framework, apellido1, apellido2)
        
        # Crear carpeta en Angular para todos los estudiantes (si no es ya Angular)
        if framework.lower() != "angular":
            crear_carpeta_estudiante("angular", apellido1, apellido2)
    
    print("\n✨ Proceso completado!\n")


def cargar_desde_json(ruta_json: str) -> List[List[str]]:
    """
    Carga la lista de estudiantes desde un archivo JSON.
    
    Args:
        ruta_json: Ruta al archivo JSON
        
    Returns:
        Lista de estudiantes
    """
    with open(ruta_json, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('estudiantes', [])


def generar_tabla_estudiantes(estudiantes: List[List[str]]) -> str:
    """
    Genera una tabla en Markdown con enlaces a las carpetas de estudiantes
    
    Args:
        estudiantes: Lista de estudiantes [apellido1, apellido2, framework]
        
    Returns:
        String con la tabla en formato Markdown
    """
    # Organizar estudiantes por nombre (para evitar duplicados)
    estudiantes_dict = {}
    
    for apellido1, apellido2, framework in estudiantes:
        nombre_completo = f"{apellido1.title()} - {apellido2.title()}"
        nombre_carpeta = f"{apellido1.lower()}_{apellido2.lower()}"
        
        if nombre_completo not in estudiantes_dict:
            estudiantes_dict[nombre_completo] = {
                'nombre_carpeta': nombre_carpeta,
                'framework_principal': framework,
                'frameworks': set()
            }
        
        estudiantes_dict[nombre_completo]['frameworks'].add(framework)
        # Todos tienen Angular también
        estudiantes_dict[nombre_completo]['frameworks'].add('angular')
    
    # Generar tabla
    tabla = "## 👥 Estudiantes y Proyectos\n\n"
    tabla += "| Estudiante | Framework Principal | Angular | Estado |\n"
    tabla += "|------------|-------------------|---------|--------|\n"
    
    for nombre_completo, info in sorted(estudiantes_dict.items()):
        nombre_carpeta = info['nombre_carpeta']
        framework_principal = info['framework_principal']
        
        # Enlaces a carpetas
        enlace_framework = f"[{framework_principal.title()}]({framework_principal}/{nombre_carpeta}/)"
        enlace_angular = f"[Angular](angular/{nombre_carpeta}/)"
        
        # Verificar si las carpetas existen para mostrar estado
        ruta_framework = BASE_DIR / framework_principal / nombre_carpeta
        ruta_angular = BASE_DIR / "angular" / nombre_carpeta
        
        if ruta_framework.exists() and ruta_angular.exists():
            estado = "✅ Completo"
        elif ruta_framework.exists() or ruta_angular.exists():
            estado = "⚠️ Parcial"
        else:
            estado = "❌ Pendiente"
        
        tabla += f"| {nombre_completo} | {enlace_framework} | {enlace_angular} | {estado} |\n"
    
    # Agregar información adicional
    tabla += f"\n### 📊 Estadísticas\n\n"
    tabla += f"- **Total de estudiantes:** {len(estudiantes_dict)}\n"
    
    # Contar por framework
    frameworks_count = {}
    for info in estudiantes_dict.values():
        fw = info['framework_principal']
        frameworks_count[fw] = frameworks_count.get(fw, 0) + 1
    
    tabla += f"- **Distribución por framework:**\n"
    for fw, count in sorted(frameworks_count.items()):
        tabla += f"  - {fw.title()}: {count} estudiante(s)\n"
    
    tabla += f"\n---\n"
    tabla += f"*Tabla generada automáticamente el {os.popen('date').read().strip()}*\n"
    
    return tabla


def guardar_tabla_readme(tabla_md: str) -> None:
    """
    Guarda la tabla en un archivo README o la agrega al existente
    
    Args:
        tabla_md: Contenido de la tabla en Markdown
    """
    readme_path = BASE_DIR / "ESTUDIANTES.md"
    
    # Crear contenido completo del archivo
    contenido_completo = f"""# 📚 Índice de Estudiantes - PRW-P67 Frameworks Web

Este archivo contiene el índice de todos los estudiantes y enlaces directos a sus carpetas de trabajo.

{tabla_md}

## 📋 Instrucciones para Estudiantes

1. **Haz clic en tu framework principal** para acceder a tu carpeta específica
2. **Haz clic en "Angular"** para acceder a tu carpeta de Angular (común para todos)
3. **Verifica que tu estado sea "✅ Completo"** - si no, ejecuta el script de generación

## 🔧 Para Generar/Actualizar esta Tabla

```bash
python3 .core/scripts/generar_estructura.py
```

## 📁 Estructura Esperada por Estudiante

Cada estudiante debe tener:

```
framework_asignado/apellido1_apellido2/
├── assets/
│   ├── capturas/
│   ├── codigo/
│   └── diagramas/
├── 01_instalacion.md
├── 02_navegacion_forms.md
└── .gitignore

angular/apellido1_apellido2/
├── assets/
│   ├── capturas/
│   ├── codigo/
│   └── diagramas/
├── 01_instalacion.md
├── 02_navegacion_forms.md
└── .gitignore
```

## 🎯 Temas de Documentación

| Archivo | Descripción |
|---------|-------------|
| `01_instalacion.md` | Proceso de instalación y configuración inicial |
| `02_navegacion_forms.md` | Implementación de navegación y formularios básicos |

---

*Este archivo es generado automáticamente. No editarlo manualmente.*
"""
    
    # Escribir el archivo
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(contenido_completo)
    
    print(f"📋 Tabla de estudiantes guardada en: ESTUDIANTES.md")
    print(f" Contiene enlaces a {len([line for line in tabla_md.split('\n') if '|' in line and '---' not in line]) - 1} estudiantes")


def main():
    """Función principal del script."""
    print("=" * 60)
    print("  GENERADOR DE ESTRUCTURA DE CARPETAS PARA ESTUDIANTES")
    print("=" * 60)
    
    # Buscar archivo de configuración
    config_file = BASE_DIR / '.core' / 'scripts' / 'estudiantes.json'
    
    if config_file.exists():
        print(f"\n📂 Cargando configuración desde: {config_file.name}\n")
        estudiantes = cargar_desde_json(config_file)
    else:
        print("\n⚠️  No se encontró archivo 'estudiantes.json'")
        print("   Usando datos de ejemplo...\n")
        # Datos de ejemplo
        estudiantes = [
            ["torres", "pena", "vue"],
            ["pena", "torres", "astro"],
            
        ]
    
    # Procesar estudiantes
    procesar_lista_estudiantes(estudiantes)
    
    # Generar y guardar tabla de estudiantes
    print("\n📋 Generando tabla de estudiantes...")
    tabla_md = generar_tabla_estudiantes(estudiantes)
    guardar_tabla_readme(tabla_md)
    
    # Resumen
    print("\n📊 Resumen:")
    print(f"   Total de carpetas procesadas: {len(estudiantes)}")
    print(f"   Ubicación: {BASE_DIR}")
    print(f"   Tabla guardada en: ESTUDIANTES.md")
    print()


if __name__ == "__main__":
    main()
