# Programación y Plataformas Web
## Frameworks Web: Vue.js


<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" width="80" alt="Vue.js Logo">
</div>

# Práctica 1: Instalación y Configuración de Vue.js 
## Autores 

**Alex Guaman**\
**Daniel Guanga**

# Instalación de la herramienta de creación (Create Vue + Vite)

La forma recomendada hoy para iniciar proyectos Vue 3 es **Create Vue**
(sobre **Vite**). Usaremos **pnpm** como gestor de paquetes.

## Crear un nuevo proyecto Vue

``` {.bash language="bash" caption="Crear un proyecto con Create Vue"}
pnpm dlx create-vue@latest
```

Sigue el asistente y elige (recomendado para la práctica):

-   **TypeScript**: Sí (mejor DX y tipado).

-   **JSX**: No (opcional).

-   **Vue Router**: Sí.

-   **Pinia** (state management): Sí.

-   **Vitest**: Sí (tests unitarios) o No si no lo usarás.

-   **ESLint** y **Prettier**: Sí.

Luego entra al proyecto e instala dependencias (si el asistente no lo
hizo):

``` {.bash language="bash"}
cd mi-app-vue
pnpm install
```

## Correr en desarrollo 

``` {.bash language="bash"}
pnpm run dev -o
```

## Servir en la red local 

``` {.bash language="bash"}
pnpm run dev -- --host 0.0.0.0 --port 5173
```

## Build de producción y previsualización 

``` {.bash language="bash"}
pnpm run build
pnpm run preview
```

# Extensiones recomendadas para VS Code (Vue)

Estas extensiones potencian el desarrollo con Vue 3 + Vite:

-   [**Vue - Official
    (Volar)**](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
    -- Lenguaje, IntelliSense y diagnósticos para Vue 3.

-   [**Vue VSCode
    Snippets**](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)
    -- Fragmentos de código SFC, ciclos de vida, etc.

-   [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    -- Linter para código consistente.

-   [**Prettier - Code
    Formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    -- Formateo de código.

-   [**Tailwind CSS
    IntelliSense**](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
    -- Autocompletado para Tailwind (si lo usas).

-   [**Material Icon
    Theme**](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
    -- Iconos de archivos.

-   [**Auto Close
    Tag**](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)
    & [**Auto Rename
    Tag**](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
    -- HTML más ágil.

-   [**DotENV**](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
    -- Soporte para `.env`.

-   [**TypeScript Importer
    (opcional)**](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)
    -- Importación automática de módulos.

**Tip:** Activa el *Take Over Mode* de Volar para mejor rendimiento
(Volar reemplaza el servicio TS/JS integrado de VS Code).

# Hoja de atajos -- Create Vue / Vite

## Comandos básicos {#comandos-básicos .unnumbered}

``` {.bash language="bash"}
pnpm dlx create-vue@latest    # Crear un nuevo proyecto Vue 3
pnpm run dev -o               # Iniciar servidor y abrir navegador
pnpm run build                # Compilar para producción
pnpm run preview              # Servir el build localmente
```

## Parámetros útiles (asistente de create-vue) 

-   `–ts` / `–typescript` → Proyecto con TypeScript.

-   `–router` → Incluye Vue Router.

-   `–pinia` → Incluye Pinia para estado global.

-   `–vitest` → Configura pruebas unitarias con Vitest.

-   `–eslint` y `–prettier` → Linteo y formateo.

## Estructura creada automáticamente (Vite + Vue) 

-   `src/` → Código fuente.

-   `src/main.ts` → Punto de entrada.

-   `src/App.vue` → Componente raíz (SFC).

-   `index.html` → HTML base servido por Vite.

-   `public/` → Archivos estáticos públicos.

-   `vite.config.ts` → Configuración de Vite.

-   `tsconfig.json` / `jsconfig.json` → Configuración del compilador.

-   `package.json` → Scripts y dependencias.

-   `pnpm-lock.yaml` → Bloqueo de versiones.

# Sugerencias de scaffolding (componentes, vistas, store, rutas)

## Componente (SFC): `src/components/MiComponente.vue` 

``` {.TypeScript language="TypeScript" caption="MiComponente.vue (SFC, script setup)"}
<script setup lang="ts">
// Lógica del componente con Composition API
const props = defineProps<{ msg: string }>()
</script>

<template>
  <section class="card">
    <h2>{{ props.msg }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.card { padding: 1rem; border-radius: 12px; }
</style>
```

## Vista (con Router): `src/views/HomeView.vue` 

``` {.TypeScript language="TypeScript" caption="HomeView.vue"}
<script setup lang="ts">
// Lógica de la vista
</script>

<template>
  <main>
    <h1>Home</h1>
  </main>
</template>
```

## Store (Pinia): `src/stores/useCounter.ts` 

``` {.TypeScript language="TypeScript" caption="Pinia: store de contador"}
import { defineStore } from 'pinia'

export const useCounter = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++ }
  }
})
```

## Rutas: `src/router/index.ts` 

``` {.TypeScript language="TypeScript" caption="Router básico con createWebHistory"}
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView }
  ]
})
```

## Registro de Router y Pinia en `main.ts` 

``` {.TypeScript language="TypeScript" caption="main.ts con Pinia y Router"}
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import App from './App.vue'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
```

# Entornos

Vite usa variables de entorno prefijadas con `VITE_`.

## Archivos de entorno 

-   `.env` (común)

-   `.env.development`

-   `.env.production`

## Ejemplo 

``` {.bash language="bash" caption=".env.development"}
VITE_API_URL=http://localhost:3000
```

## Uso en el código
``` {.TypeScript language="TypeScript"}
const api = import.meta.env.VITE_API_URL
```

# Ayuda y documentación

``` {.bash language="bash"}
pnpm dlx create-vue@latest --help  # Opciones del generador
# Dentro del proyecto
pnpm run dev -- --help              # Ayuda del servidor (Vite)
```

# Resultados (evidencias)

Capturas de pantalla como evidencia del proceso de instalación y
configuración de Vue.js, además de explicaciones sobre componentes,
rutas, stores y formularios usados en la práctica.

## 1) Instalación de Create Vue y creación del proyecto

**Comando ejecutado:**

``` {.bash language="bash"}
pnpm dlx create-vue@latest
```
![alt text](<capturas/instalacion/Captura de pantalla 2025-11-05 171823.png>)
El asistente permite seleccionar TypeScript, Router, Pinia, Vitest,
ESLint y Prettier. Se crea la estructura base y los archivos de
configuración.

**Instalación de dependencias:**

``` {.bash language="bash"}
pnpm install
```

**Verificación de versiones:**

``` {.bash language="bash"}
node -v
pnpm -v
# opcional, si usas @vue/cli
vue --version
```

## 2) Revisión de configuración (versiones y entorno) 
![alt text](<capturas/instalacion/Captura de pantalla 2025-11-05 174237.png>)
Salida de comandos de verificación y confirmación de scripts (`dev`,
`build`, `preview`) en `package.json`.

## 3) Creación del proyecto y primer arranque
``` {.bash language="bash"}
pnpm dlx create-vue@latest 01-fundamentos-vue
cd 01-fundamentos-vue
pnpm install
pnpm run dev -o
```

## 4) Proyecto corriendo en el navegador 
![alt text](<capturas/instalacion/Captura de pantalla 2025-11-05 174649.png>)
## 5) Explicación de la estructura del proyecto 
![alt text](<capturas/instalacion/Captura de pantalla 2025-11-05 174345.png>)
### Carpetas y archivos principales 

-   `public`: Archivos estáticos públicos.

-   `src`: Código fuente de la aplicación.

-   `node_modules`: Dependencias.

-   `pnpm-lock.yaml`: Bloqueo de versiones.

-   `vite.config.js`: Configuración de Vite.

-   `package.json`: Scripts y dependencias.

-   `jsconfig.json` / `jsconfig.json`: Configuración del compilador.

### Carpeta `src` 

-   `main.js`: Punto de entrada.

-   `App.vue`: Componente raíz.

-   `components/`: Componentes reutilizables.

-   `views/`: Vistas para el Router.

-   `router/`: Configuración de rutas (si se habilitó).

-   `stores/`: Estado global con Pinia (si se habilitó).

-   `assets/`: Imágenes, fuentes y estilos globales.

-   `env.d.js`: Tipos para JS.


------------------------------------------------------------------------

