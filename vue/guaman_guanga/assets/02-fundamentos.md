# Programación y Plataformas Web · Práctica 2: Fundamentos (Vue.js)

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

# Autores 

**Alex Guaman**\
**Daniel Guanga**

# Objetivos de esta práctica

1.  Crear un proyecto Vue 3 (Vite) funcional.

2.  Configurar Vue Router en **hash mode** (compatible con GitHub
    Pages).

3.  Implementar un **HomePage** con:

    -   Estado reactivo con `ref`.

    -   **Contador manual** (+1, -1, Reset).

    -   **Contador "signal"** que se incrementa automáticamente cada
        segundo.

    -   Buenas prácticas con `onMounted`/`onUnmounted`.

4.  Dejar **Perfil** como tarea guiada.

# Qué hicimos y por qué?

-   Usamos `<script setup>` + Composition API (recomendado en Vue 3).

-   `ref` para estados numéricos simples (`counter`, `counterSignal`).

-   `setInterval` en `onMounted` y limpieza en `onUnmounted` (evita
    fugas).

-   `createWebHashHistory` en el router: evita 404 al refrescar rutas en
    GitHub Pages.

-   Alias `@` $\rightarrow$ `src` para imports más limpios (opcional).

# Estructura mínima (para HomePage) 
``` {.bash language="bash"}
src/
  app/
    router/
      index.ts
    features/
      homePage/
        HomePage.vue
  assets/
    main.css
  App.vue
  main.ts
vite.config.ts
```

*Si no usas alias `@`, cambia los imports a rutas relativas
(`./app/router`).*

# Pasos realizados 

## 1) Instalar dependencias y scripts básicos 
``` {.bash language="bash"}
pnpm install   # si acabas de clonar o crear el proyecto
pnpm dev       # entorno de desarrollo
pnpm build     # build de producción
pnpm preview   # (opcional) previsualizar build
```

## 2) Router (solo `/` $\rightarrow$ HomePage) 

**Archivo:** `src/app/router/index.ts`

``` {.TypeScript language="TypeScript"}
import { createRouter, createWebHashHistory } from 'vue-router'

// Solo HomePage. La ruta de Perfil se deja como práctica.
const HomePage = () => import('@/app/features/homePage/HomePage.vue')

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    // TODO(alumno): agregar aquí la ruta de Perfil: /perfil/:id?
  ]
})
```

## 3) Bootstrap de la app =
**Archivo:** `src/main.ts`

``` {.TypeScript language="TypeScript"}
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/app/router'
import './assets/main.css'

createApp(App).use(router).mount('#app')
```

**Archivo:** `src/App.vue` (enlace a Inicio; el de Perfil queda como
TODO)

``` {.html language="HTML"}
<template>
  <nav style="display:flex;gap:1rem;padding:1rem;border-bottom:1px solid #e5e7eb">
    <RouterLink to="/">Inicio</RouterLink>

    <!--
      TODO(alumno):
      Cuando implementes la página de Perfil y su ruta,
      descomenta o agrega un enlace como este:
      <RouterLink :to="{ name: 'perfil', params: { id: 1 } }">Perfil</RouterLink>
    -->
  </nav>

  <RouterView />
</template>
```

# HomePage (implementado)
![alt text](<capturas/fundamentos/HomePage.png>)
**Archivo:** `src/app/features/homePage/HomePage.vue`

    <script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'

    const counter = ref(0)         // contador controlado con botones
    const counterSignal = ref(0)   // contador que "avanza solo" cada segundo

    // Timer que incrementa counterSignal cada segundo
    let t: number | undefined
    onMounted(() => { t = window.setInterval(() => counterSignal.value++, 1000) })
    onUnmounted(() => { if (t) clearInterval(t) })

    // Sumar/restar ambos contadores desde los botones
    function changeValue(v: number) {
      counter.value += v
      counterSignal.value += v
    }

    // Resetear ambos contadores
    function resetValue(v = 0) {
      counter.value = v
      counterSignal.value = v
    }
    </script>

    <template>
      <main class="wrap">
        <h1>HomePage</h1>

        <section class="grid">
          <article class="card">
            <h2>Counter Manual</h2>
            <p><b>counter:</b> {{ counter }}</p>
            <div class="row">
              <button @click="changeValue(1)">+1</button>
              <button @click="changeValue(-1)">-1</button>
              <button @click="resetValue(0)">Reset</button>
            </div>
          </article>

          <article class="card">
            <h2>Counter Signal</h2>
            <p><b>counterSignal:</b> {{ counterSignal }}</p>
            <p class="muted">Se incrementa automáticamente cada segundo.</p>
          </article>
        </section>
      </main>
    </template>

    <style scoped>
    .wrap { padding: 1rem; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .card { padding: 1rem; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
    .row { display: flex; gap: .5rem; margin-top: .5rem; flex-wrap: wrap; }
    button { padding: .45rem .75rem; border-radius: 8px; border: 1px solid #e5e7eb; background: #f8fafc; cursor: pointer; }
    button:hover { background: #eef2f7; }
    .muted { color: #64748b; font-size: .9rem; }
    </style>



# (Opcional) Alias `@` en Vite 

**Archivo:** `vite.config.ts`

``` {.TypeScript language="TypeScript"}
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // Cambia por el nombre EXACTO de tu repo si despliegas en GitHub Pages:
  base: '/icc-ppw-u2-01_fundamentos-vue/',
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [vue()]
})
```

# Comprobaciones que hicimos 

-   La navegación a `/` carga el **HomePage**.

-   Los botones **+1 / -1 / Reset** modifican `counter`.

-   `counterSignal` sube automáticamente cada segundo (y también con los
    botones).

-   El `setInterval` se limpia correctamente al desmontar el componente.

# Tarea

1.  Crear `src/app/features/perfilPage/PerfilPage.vue` con:

    -   3 campos con `v-model`: nombre, apellido, edad.

    -   Un `computed` que muestre "Nombre Apellido con edad X años".

    -   Botones: *Cambiar datos*, *Edad=18*, *Reset*.

2.  Agregar la ruta en `src/app/router/index.ts`:

    ``` {.TypeScript language="TypeScript"}
    { path: '/perfil/:id?', name: 'perfil',
      component: () => import('@/app/features/perfilPage/PerfilPage.vue') }
    ```

3.  Agregar un enlace en `App.vue`:

    ``` {.html language="HTML"}
    <RouterLink :to="{ name: 'perfil', params: { id: 1 } }">Perfil</RouterLink>
    ```

4.  Entregar capturas: código + UI + navegación Home $\leftrightarrow$
    Perfil.

# Problemas típicos y soluciones 
-   **Pantalla en blanco / error de import**: si no configuraste alias
    `@`, usa rutas relativas (`./app/...`).

-   **404 en GitHub Pages al refrescar**: usa **hash mode**
    (`createWebHashHistory`) como en este proyecto.

-   **El contador no sube solo**: confirma `setInterval` en `onMounted`
    y limpieza en `onUnmounted`.

# Despliegue en GitHub Pages 

``` {.bash language="bash"}
pnpm run build
pnpm dlx gh-pages -d dist
```

Verifica que `base` en `vite.config.ts` coincida exactamente con el
nombre del repo.

# Criterios de evaluación (HomePage) 
-   Router en **hash mode** con solo la ruta `/`.

-   HomePage muestra **dos contadores** funcionando.

-   Limpieza correcta del `setInterval`.

-   Código ordenado (SFC, Composition API, estilos mínimos).

-   Documento explica **qué hicimos y por qué**.




