# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 1: Instalacion y Configuracion del Entorno

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Configurar el entorno de desarrollo necesario para trabajar con React, crear un proyecto con Vite usando TypeScript, entender la estructura inicial generada y dejar el proyecto listo para comenzar el desarrollo incremental que se construira a lo largo de todos los modulos.

---

## 2. Explicacion Conceptual

### Que es React?

React es una **biblioteca de JavaScript para construir interfaces de usuario**. Fue creada por Meta (Facebook) en 2013 y es actualmente una de las herramientas mas utilizadas en el desarrollo frontend.

React no es un framework completo como Angular. Es una biblioteca enfocada exclusivamente en la capa de **vista (UI)**. Esto significa que el desarrollador elige las herramientas complementarias para rutas, estado global, consumo de datos, etc.

### Por que usar React?

| Caracteristica | Descripcion |
|---|---|
| Componentes reutilizables | La UI se divide en piezas independientes que se componen entre si |
| Virtual DOM | React actualiza solo las partes del DOM que cambiaron, no toda la pagina |
| Ecosistema enorme | Miles de bibliotecas compatibles, amplia comunidad |
| Demanda laboral | Una de las habilidades frontend mas solicitadas en el mercado |
| Flexible | Se puede usar con distintas herramientas segun el proyecto |

### React vs Vanilla JS vs Frameworks completos

| Aspecto | Vanilla JS | React | Angular | Astro |
|---|---|---|---|---|
| Tipo | Lenguaje | Biblioteca de UI | Framework completo | Framework multi-renderizado |
| Curva de aprendizaje | Baja (base) | Media | Alta | Media |
| Estructura de proyecto | Manual | Flexible | Opinionated | Semi-opinionated |
| Manejo del DOM | Manual | Virtual DOM | Change Detection | Islas de interactividad |
| Estado | Manual | Hooks (useState) | Signals / RxJS | useState (islands) |
| Rutas | Manual | React Router | Angular Router | Sistema de archivos |
| Recomendado para | Aprender fundamentos | SPAs y apps dinamicas | Proyectos enterprise | Sitios con contenido estatico |

### Que es Vite?

**Vite** es una herramienta de construccion (build tool) moderna que reemplaza configuraciones mas antiguas como Create React App (CRA). Sus ventajas principales son:

- **Inicio instantaneo**: usa ES modules nativos del navegador durante desarrollo
- **HMR rapido**: Hot Module Replacement actualiza el modulo cambiado sin recargar la pagina
- **Build optimizado**: usa Rollup para produccion con tree-shaking y code splitting
- **Configuracion minima**: funciona bien con defaults razonables

### Por que pnpm?

**pnpm** es un gestor de paquetes alternativo a npm y yarn. Sus ventajas:

- Instala mas rapido que npm
- Usa un almacen global de paquetes (no duplica en `node_modules`)
- Ahorra espacio en disco cuando hay multiples proyectos
- Comandos compatibles con npm (`pnpm add`, `pnpm install`, `pnpm run dev`)

---

## 3. Fundamento Tecnico

### Herramientas necesarias

| Herramienta | Version recomendada | Verificar con |
|---|---|---|
| Node.js | >= 18.x LTS | `node --version` |
| pnpm | >= 9.x | `pnpm --version` |
| Git | Cualquier version reciente | `git --version` |
| VS Code | Ultima version estable | — |

### Crear proyecto con Vite

```bash
pnpm create vite react-store -- --template react-ts
```

El comando `pnpm create vite` invoca el creador de proyectos de Vite. Los argumentos significan:

- `react-store` → nombre del proyecto y carpeta creada
- `--` → separador de argumentos de pnpm y de vite
- `--template react-ts` → plantilla con React y TypeScript preconfigurados

### Estructura inicial del proyecto

```
react-store/
├── public/              # Archivos estaticos servidos directamente
│   └── vite.svg
├── src/                 # Codigo fuente
│   ├── assets/          # Imagenes y recursos del proyecto
│   │   └── react.svg
│   ├── App.css          # Estilos del componente App
│   ├── App.tsx          # Componente raiz de la aplicacion
│   ├── index.css        # Estilos globales
│   └── main.tsx         # Punto de entrada de la aplicacion
├── .gitignore
├── eslint.config.js     # Configuracion de linting
├── index.html           # HTML principal (unico HTML en una SPA)
├── package.json         # Dependencias y scripts
├── tsconfig.app.json    # Configuracion TypeScript para la app
├── tsconfig.json        # Configuracion TypeScript base
├── tsconfig.node.json   # Configuracion TypeScript para Vite
└── vite.config.ts       # Configuracion de Vite
```

### El archivo `index.html`

En una SPA (Single Page Application), existe un unico HTML. Vite lo usa como punto de entrada:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

El `<div id="root"></div>` es el contenedor donde React montara toda la aplicacion. El `<script type="module">` carga el punto de entrada de la app.

### El archivo `main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `createRoot`: crea el punto de montaje de React sobre el elemento `#root`
- `StrictMode`: modo estricto que activa advertencias adicionales durante el desarrollo
- `App`: componente raiz que contendra toda la aplicacion
- El `!` despues de `getElementById` le dice a TypeScript que el elemento no sera `null`

### El archivo `App.tsx`

```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>...</p>
      </div>
    </>
  )
}

export default App
```

Este es el componente base generado por Vite. Lo reemplazaremos completamente en el modulo 2.

### Scripts disponibles (`package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

| Script | Comando | Descripcion |
|---|---|---|
| Desarrollo | `pnpm dev` | Levanta el servidor con HMR en `http://localhost:5173` |
| Build | `pnpm build` | Compila TypeScript y genera `/dist` para produccion |
| Lint | `pnpm lint` | Analiza el codigo con ESLint |
| Preview | `pnpm preview` | Sirve el build de produccion localmente |

### Configuracion de Vite (`vite.config.ts`)

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

El plugin `@vitejs/plugin-react` habilita el soporte JSX/TSX con Babel (Babel Fast Refresh para HMR).

---

## 4. Buenas Practicas

- **No usar Create React App (CRA)**: fue deprecado oficialmente. Usar Vite o frameworks como Next.js.
- **Mantener `src/` organizado desde el inicio**: no poner todos los archivos en la raiz de `src/`.
- **Usar `.tsx` para archivos con JSX y `.ts` para logica pura**: aunque TypeScript permite lo contrario, es convencion.
- **Agregar alias de rutas desde el inicio**: configurar `@/` para apuntar a `src/` evita imports relativos largos.
- **Commitear el proyecto limpio antes de comenzar**: el primer commit debe ser el boilerplate de Vite sin modificaciones.

### Alias de rutas recomendado

Agregar en `vite.config.ts`:

```ts
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Y en `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 5. Errores Comunes

| Error | Causa | Solucion |
|---|---|---|
| `command not found: pnpm` | pnpm no instalado | `npm install -g pnpm` |
| Puerto 5173 ocupado | Otro proceso usa el puerto | Vite asignara automaticamente el siguiente puerto libre |
| `Cannot find module 'react'` | Dependencias no instaladas | Ejecutar `pnpm install` dentro de la carpeta del proyecto |
| TypeScript no reconoce `.tsx` | Archivo con extension incorrecta | Renombrar archivos que usan JSX a `.tsx` |
| `getElementById('root') is null` | Vite sirve `index.html` pero no hay `div#root` | Verificar que `index.html` tiene `<div id="root"></div>` |

---

## 6. Relacion con el Proyecto Incremental

Este modulo establece la base del proyecto **ReactStore** que se construira durante todos los modulos. Al finalizar este modulo, el proyecto tiene:

- Estructura de carpetas inicial
- Servidor de desarrollo funcionando
- TypeScript configurado
- Boilerplate limpio (sin el contenido de ejemplo de Vite)

Cada modulo posterior agrega funcionalidad a este mismo proyecto sin crear uno nuevo.

> Ver solucion de referencia en: `react/solver/react-store/`

---

## 7. Parte Práctica

> Ver guía de práctica en: `01-instalacion-configuracion-practica.md`

[Ir a la guia de práctica del modulo](./01-instalacion-configuracion-practica.md)


---


## 8. Referencias

- [Documentacion oficial de React](https://react.dev)
- [Documentacion de Vite](https://vite.dev)
- [Sitio oficial de pnpm](https://pnpm.io)
- [TypeScript para React](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [Vite — Getting Started](https://vite.dev/guide/)
