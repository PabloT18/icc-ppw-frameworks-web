# 🌐 Programación y Plataformas Web  
## Frameworks Web: Vue 3 + Vite  

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" width="100" alt="Vue Logo">
</div>  

---

### Práctica: Fundamentos del Framework Vue

**Autores:**  
- **John Serrano**  
- **Cinthya Ramón**  

**Proyecto:** `ramon_serrano_vue`  

---

## Descripción general

Este proyecto forma parte del módulo **Frameworks Web**, donde se aplican los conceptos fundamentales de **Vue 3** utilizando **Vite** como entorno de desarrollo moderno.

El objetivo principal es crear una aplicación web con:
- Un **contador interactivo**,  
- **Páginas de perfil** para cada integrante,  
- Y **navegación entre vistas** mediante Vue Router.

---

## Instalación del proyecto

### Crear el proyecto
```bash
pnpm create vue@latest ramon_serrano_vue
```

Durante la configuración se seleccionaron las siguientes opciones:

```bash
Add TypeScript? → Yes
Add JSX Support? → Yes
Add Router for Single Page Application development? → Yes
Add Pinia for state management? → No
Add Vitest for unit testing? → No
Add ESLint for code quality? → Yes
Add Prettier for code formatting? → Yes
```

---

### Instalar dependencias
```bash
pnpm install
```

---

### Ejecutar el servidor de desarrollo
```bash
pnpm run dev
```

Luego abre en el navegador:  
👉 [http://localhost:5173](http://localhost:5173)

---

### Compilar para producción
```bash
pnpm run build
```

Esto genera la carpeta `/dist`, lista para desplegarse en **GitHub Pages**.

---

## Fundamentos aplicados

### Componentes
Cada sección del proyecto se separa en componentes Vue (`.vue`) para mantener la modularidad y reutilización del código.  
- **HomePage.vue** → Contiene el contador.  
- **PerfilPage.vue** → Muestra la información de cada integrante.  

---

### Reactividad (Composition API)
Vue permite crear variables reactivas utilizando `ref()`.  
Ejemplo del **contador** implementado en `HomePage.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const contador = ref(0)

const incrementar = () => {
  contador.value++
}

const decrementar = () => {
  if (contador.value > 0) contador.value--
}
</script>

<template>
  <div class="home">
    <h1>Contador Vue 3</h1>
    <p>Valor actual: {{ contador }}</p>
    <button @click="incrementar">➕ Incrementar</button>
    <button @click="decrementar">➖ Decrementar</button>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  margin-top: 2rem;
}
button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
</style>
```

---

### Ruteo (Vue Router)

En `src/router/index.ts` se definen las rutas del proyecto:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PerfilJohn from '../views/PerfilJohn.vue'
import PerfilCinthya from '../views/PerfilCinthya.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/john', name: 'john', component: PerfilJohn },
  { path: '/cinthya', name: 'cinthya', component: PerfilCinthya },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

---

### Páginas de perfil

Ejemplo: `PerfilJohn.vue`

```vue
<template>
  <div class="perfil">
    <h1>Perfil de John Serrano</h1>
    <p>Estudiante de Ingeniería de Software, apasionado por el desarrollo web.</p>
  </div>
</template>

<style scoped>
.perfil {
  text-align: center;
  margin-top: 2rem;
}
</style>
```

Ejemplo: `PerfilCinthya.vue`

```vue
<template>
  <div class="perfil">
    <h1>Perfil de Cinthya Ramón</h1>
    <p>Estudiante de Ingeniería de Software, interesada en el diseño de interfaces modernas.</p>
  </div>
</template>

<style scoped>
.perfil {
  text-align: center;
  margin-top: 2rem;
}
</style>
```

---

## Estructura del proyecto

```
ramon_serrano_vue/
│
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── views/
│   │   ├── HomePage.vue
│   │   ├── PerfiPage.vue
│   │   └── Perfil2Page.vue
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Despliegue en GitHub Pages

### Crear el build
```bash
pnpm run build
```

### Instalar plugin para desplegar
```bash
pnpm add gh-pages -D
```

### Editar `package.json` y agregar:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

### Ejecutar:
```bash
pnpm run deploy
```

Tu sitio quedará publicado en:  
`https://<tu-usuario>.github.io/ramon_serrano_vue/`

---

## Resultados y evidencias

1️. Captura de la instalación de Vue y configuración inicial  
![Vista de la aplicación](../assets/capturas/instalacion.png)

2️. Captura del proyecto corriendo (`pnpm run dev`)  
![Vista de la aplicación](../assets/capturas/ProyectoCorriendo.png)

3️. Captura del **contador funcionando**  
![Vista de la aplicación](../assets/capturas/Contador.png)

4️. Capturas de las **páginas de perfil**  
![Vista de la aplicación](../assets/capturas/Perfil1.png)
![Vista de la aplicación](../assets/capturas/Perfil2.png)

5️. Captura de las señales 
![Vista de la aplicación](../assets/capturas/Señaleseventovue.png)

---

## Conclusiones

- Vue 3 es un framework flexible y ligero, bastante facil de usar e intuitivo que facilita la creación de interfaces reactivas.  
- La modularidad con componentes simplifica el mantenimiento y escalabilidad.  
- El uso de Vite acelera el entorno de desarrollo y optimiza el rendimiento.  
- La práctica permitió aplicar fundamentos de **ruteo, reactividad y componentes** en un entorno moderno.  

---

## Enlaces

- **Repositorio GitHub:** [https://github.com/tu_usuario/ramon_serrano_vue](https://github.com/tu_usuario/ramon_serrano_vue)  
- **GitHub Pages:** [https://tu_usuario.github.io/ramon_serrano_vue/](https://tu_usuario.github.io/ramon_serrano_vue/)

---
