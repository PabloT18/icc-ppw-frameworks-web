# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 1: Instalación y Configuración

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

Vue es un framework progresivo para construir interfaces de usuario. A diferencia de frameworks monolíticos, Vue está diseñado para ser adoptable de forma incremental: su núcleo se enfoca en la capa de vista y es fácil de integrar con otras bibliotecas o proyectos existentes.

En este módulo vas a crear el proyecto Vue que usarás durante todo el curso. Cada módulo siguiente va a extender este mismo proyecto, de forma incremental, hasta que tengas una SPA completa con autenticación, consumo de API, estado global, testing y deploy.

### ¿Por qué Vite?

Vite es la herramienta de build recomendada para Vue 3. Ofrece:

| Característica | Vite | Webpack |
|---|---|---|
| Arranque del servidor | Instantáneo (ESM nativo) | Lento (bundle completo) |
| Hot Module Replacement | Extremadamente rápido | Más lento |
| Configuración | Mínima por defecto | Requiere configuración |
| Build de producción | Rollup optimizado | Webpack bundle |
| Soporte TypeScript | Nativo | Requiere babel/ts-loader |

### ¿Por qué pnpm?

`pnpm` es el gestor de paquetes oficial de este curso para Vue. Sus ventajas:

- Instala paquetes una sola vez en un almacén global y crea enlaces en `node_modules`
- Significativamente más rápido que `npm` o `yarn`
- Uso de disco reducido
- Estricto respecto a paquetes no declarados (evita dependencias fantasma)

---

## 2. Conceptos Clave

### Herramientas del ecosistema Vue moderno

| Herramienta | Propósito | Versión usada |
|---|---|---|
| **Vue** | Framework de UI | 3.x |
| **Vite** | Build tool y servidor de desarrollo | 5.x |
| **TypeScript** | Tipado estático | 5.x |
| **pnpm** | Gestor de paquetes | 9.x |
| **Vue Router** | Enrutamiento SPA | 4.x (se agrega en módulo 09) |
| **Pinia** | Estado global | 2.x (se agrega en módulo 10) |
| **Vitest** | Testing | 1.x (se agrega en módulo 14) |

### Estructura del proyecto Vite + Vue + TypeScript

```
mi-proyecto/
├── public/               ← Archivos estáticos (no procesados por Vite)
│   └── favicon.ico
├── src/                  ← Código fuente del proyecto
│   ├── assets/           ← Imágenes, fonts, CSS global
│   ├── components/       ← Componentes Vue reutilizables
│   ├── App.vue           ← Componente raíz
│   └── main.ts           ← Punto de entrada
├── index.html            ← Plantilla HTML (Vite lo usa como entry point)
├── package.json          ← Dependencias y scripts
├── tsconfig.json         ← Configuración TypeScript
├── tsconfig.app.json     ← Config TS para el código de app
├── tsconfig.node.json    ← Config TS para Vite config
└── vite.config.ts        ← Configuración de Vite
```

### Archivos clave

#### `index.html`

El punto de entrada de Vite. Contiene el `<div id="app">` donde Vue monta la aplicación.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi App Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

#### `src/main.ts`

Crea la instancia de la aplicación Vue y la monta en el DOM.

```typescript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

#### `src/App.vue`

El componente raíz. Todo lo que el usuario ve parte desde aquí.

---

## 3. Explicación

### Crear un proyecto con `pnpm create vite`

El comando oficial para crear un proyecto Vue con Vite es:

```bash
pnpm create vite@latest nombre-del-proyecto -- --template vue-ts
```

La opción `--template vue-ts` genera el scaffold con Vue 3 y TypeScript preconfigurado.

También puedes usar el modo interactivo:

```bash
pnpm create vite@latest
```

Vite te preguntará:
1. **Project name**: el nombre del directorio que se creará
2. **Select a framework**: seleccionar `Vue`
3. **Select a variant**: seleccionar `TypeScript`

### Scripts de pnpm

Después de crear el proyecto, estos son los comandos disponibles:

```bash
pnpm install          # Instalar dependencias (primera vez o al clonar)
pnpm dev              # Levantar servidor de desarrollo (http://localhost:5173)
pnpm build            # Generar build de producción en /dist
pnpm preview          # Preview local del build de producción
pnpm type-check       # Verificar tipos TypeScript sin compilar
```

### `vite.config.ts`

Configuración base generada por Vite:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

Con alias de rutas (buena práctica desde el inicio):

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

El alias `@` apunta a `src/`, permitiendo imports como `import MyComponent from '@/components/MyComponent.vue'` en lugar de rutas relativas.

### `tsconfig.json` y `tsconfig.app.json`

El scaffold de Vite genera dos archivos de configuración TypeScript separados:

- `tsconfig.json`: referencia a los demás archivos de config
- `tsconfig.app.json`: configuración para el código de la aplicación (`src/`)
- `tsconfig.node.json`: configuración para archivos de configuración de Node (vite.config.ts)

Esto es importante porque el compilador aplica configuraciones distintas al código de app y al código de tooling.

### Limpieza del proyecto base

El scaffold de Vite incluye contenido de demostración que se debe eliminar antes de empezar:

1. Borrar `src/components/HelloWorld.vue`
2. Limpiar `src/App.vue` para dejar solo la estructura base
3. Borrar `src/assets/vue.svg`
4. Actualizar `src/assets/main.css` o reemplazar por CSS propio

`src/App.vue` limpio:

```vue
<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Mi App Vue</h1>
  </div>
</template>

<style scoped>
</style>
```

---

## 4. Ejemplos de Código

### Verificar instalación

Después de crear el proyecto y ejecutar `pnpm dev`, deberías ver en consola:

```
  VITE v5.x.x  ready in XXXms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### `package.json` generado

```json
{
  "name": "ppw-vue-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --build --force"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0",
    "vue-tsc": "^2.0.0"
  }
}
```

---

## 5. Buenas Prácticas

- **Usa siempre `pnpm`**: garantiza consistencia entre ambientes y evita mezclas con `npm` o `yarn`.
- **Configura el alias `@`** desde el inicio: evita paths relativos complejos como `../../../components/MyComp.vue`.
- **No modifiques `tsconfig.json` manualmente** a menos que entiendas el impacto: la separación app/node es intencional.
- **Versiona el `pnpm-lock.yaml`** en git: garantiza reproducibilidad del entorno de dependencias.
- **No subas `node_modules`**: está en `.gitignore` por defecto.
- **Revisa el `index.html`**: actualiza el `lang` a `"es"` y personaliza el `<title>` desde el inicio.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| `command not found: pnpm` | pnpm no está instalado | `npm install -g pnpm` |
| Puerto 5173 ocupado | Otro proceso usa el puerto | Agregar `--port 5174` o cerrar el proceso |
| `Cannot find module '@/...'` | Alias `@` no configurado en `tsconfig` | Agregar `"paths": { "@/*": ["./src/*"] }` en `tsconfig.app.json` |
| `vue-tsc` falla en build | Errores de tipos ignorados en dev | Resolver errores TS antes del build |
| `node_modules` subido a git | `.gitignore` faltante o incorrecto | Verificar que `.gitignore` incluye `node_modules/` |

---

## 7. Relación con el Proyecto Incremental

Este módulo establece el proyecto que vas a usar durante todo el curso. A partir de aquí, cada módulo agrega funcionalidad sobre el mismo proyecto sin reiniciarlo.

**Estado del proyecto al final de este módulo:**

```
ppw-vue-app/
├── src/
│   ├── assets/
│   │   └── main.css       ← CSS base limpio
│   ├── App.vue            ← Componente raíz limpio
│   └── main.ts            ← Punto de entrada
├── index.html             ← Template HTML actualizado
├── vite.config.ts         ← Configuración con alias @
├── package.json
└── tsconfig.app.json
```

**Lo que se va a agregar en módulos posteriores:**

- Módulo 02: primera lógica reactiva en `App.vue`
- Módulo 03: carpeta `src/components/` con componentes reutilizables
- Módulo 09: carpeta `src/router/` y `src/views/`
- Módulo 10: carpeta `src/stores/` con Pinia
- Módulo 11: carpeta `src/services/` para consumo de API

---

## 8. Referencias

- [Documentación oficial de Vue 3](https://vuejs.org/guide/quick-start)
- [Documentación oficial de Vite](https://vitejs.dev/guide/)
- [Documentación oficial de pnpm](https://pnpm.io/installation)
- [Repositorio oficial de Vite](https://github.com/vitejs/vite)
- [TypeScript con Vue](https://vuejs.org/guide/typescript/overview)
