# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 1: Instalación y Configuración del Proyecto Vue

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Crear el proyecto Vue base que se usará durante todo el curso. Al finalizar esta práctica tendrás un proyecto Vue 3 con Vite y TypeScript corriendo en modo desarrollo, con la estructura limpia lista para comenzar a construir.

---

## Contexto

Esta práctica es la base de todo el recorrido. El proyecto que creas aquí será el mismo en el que trabajarás hasta el módulo 15. No lo elimines ni crees otro; cada módulo agrega funcionalidad sobre este.

**Nombre del proyecto:** `ppw-vue-app`  
**Herramientas:** Vue 3, Vite, TypeScript, pnpm

---

## Archivos que se van a crear

```
ppw-vue-app/
├── src/
│   ├── assets/
│   │   └── main.css
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

---

## Paso 1: Verificar que pnpm está instalado

Abre una terminal y ejecuta:

```bash
pnpm --version
```

Si el comando no existe, instala pnpm primero:

```bash
npm install -g pnpm
```

Verifica la instalación:

```bash
pnpm --version
# Debe mostrar algo como: 9.x.x
```

---

## Paso 2: Crear el proyecto

En la carpeta donde quieras guardar el proyecto ejecuta:

```bash
pnpm create vite@latest ppw-vue-app -- --template vue-ts
```

Esto genera el scaffold automáticamente con Vue 3 y TypeScript. El resultado en consola debe verse así:

```
Scaffolding project in ./ppw-vue-app...

Done. Now run:

  cd ppw-vue-app
  pnpm install
  pnpm dev
```

> Captura pendiente: salida de `pnpm create vite` con el proyecto creado.

---

## Paso 3: Instalar dependencias y levantar el servidor

```bash
cd ppw-vue-app
pnpm install
pnpm dev
```

Abre el navegador en `http://localhost:5173`. Deberías ver la pantalla de bienvenida de Vite + Vue.

> Captura pendiente: pantalla inicial de Vite + Vue en el navegador.

---

## Paso 4: Configurar el alias `@` en Vite

Abre `vite.config.ts` y reemplaza su contenido con:

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

**¿Por qué este cambio?** El alias `@` permite hacer imports como `import MyComp from '@/components/MyComp.vue'` en lugar de rutas relativas difíciles de leer. Lo usarás a partir del módulo 03.

---

## Paso 5: Agregar el alias en `tsconfig.app.json`

Para que TypeScript también reconozca el alias, abre `tsconfig.app.json` y agrega la sección `paths` dentro de `compilerOptions`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Asegúrate de respetar la estructura JSON existente del archivo: agrega la clave `"paths"` dentro del objeto `"compilerOptions"` que ya existe.

---

## Paso 6: Limpiar el proyecto base

El scaffold incluye contenido de demostración que ya no necesitas.

### 6.1 Eliminar el componente HelloWorld

Borra el archivo `src/components/HelloWorld.vue`.

### 6.2 Limpiar `src/App.vue`

Reemplaza el contenido completo de `src/App.vue` por:

```vue
<script setup lang="ts">
</script>

<template>
  <div class="app">
    <h1>PPW Vue App</h1>
    <p>Módulo 01 - Proyecto iniciado correctamente.</p>
  </div>
</template>

<style scoped>
.app {
  padding: 2rem;
  font-family: sans-serif;
}
</style>
```

**¿Qué contiene este archivo?**
- `<script setup lang="ts">`: bloque de lógica en TypeScript con Composition API (el estándar moderno de Vue 3)
- `<template>`: el HTML del componente
- `<style scoped>`: CSS que solo aplica a este componente

### 6.3 Limpiar `src/assets/main.css`

Reemplaza el contenido de `src/assets/main.css` por:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #222;
}
```

### 6.4 Eliminar el logo SVG de Vue en assets

Borra `src/assets/vue.svg`.

### 6.5 Actualizar `index.html`

Actualiza el `<title>` y el atributo `lang`:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PPW Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

---

## Paso 7: Verificar que el proyecto corre correctamente

Con el servidor de desarrollo activo (`pnpm dev`), el navegador debe mostrar el texto `PPW Vue App` y el mensaje del módulo 01, sin errores en la consola del navegador ni en la terminal.

> Captura pendiente: proyecto limpio corriendo en el navegador con el texto del módulo 01.

---

## Validaciones Esperadas

- [ ] `pnpm dev` arranca sin errores
- [ ] El navegador muestra el mensaje del módulo 01
- [ ] La consola del navegador no muestra errores
- [ ] `vite.config.ts` incluye el alias `@`
- [ ] `tsconfig.app.json` incluye `paths` con `@/*`
- [ ] No existe `src/components/HelloWorld.vue`
- [ ] `src/App.vue` está limpio con la estructura base
- [ ] `index.html` tiene `lang="es"` y el `<title>` actualizado

---

## Entregables

El proyecto `ppw-vue-app` con:

1. `vite.config.ts` con alias `@`
2. `tsconfig.app.json` con `paths`
3. `src/App.vue` limpio
4. `src/assets/main.css` con reset básico
5. `index.html` actualizado

---

## Commits Sugeridos

```bash
git init
git add .
git commit -m "init: proyecto Vue 3 + Vite + TypeScript con pnpm"
git commit -m "config: alias @ en vite.config.ts y tsconfig.app.json"
git commit -m "clean: limpieza del scaffold base de Vite"
```
