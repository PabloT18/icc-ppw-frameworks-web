# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 15: Deploy

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Publicar el proyecto `ppw-vue-app` en Netlify o Vercel de forma que sea accesible desde cualquier navegador, con SPA routing configurado correctamente y variables de entorno de producción.

---

## Contexto

El proyecto está completo desde el módulo 01 al 14. En esta práctica se prepara para producción: se optimiza la configuración de build, se agrega el archivo de redirects para SPA routing, y se publica en un servicio de hosting gratuito.

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/
├── public/
│   └── _redirects              ← Crear (para Netlify)
│   └── vercel.json             ← Alternativa (para Vercel)
├── .env.production             ← Crear
└── vite.config.ts              ← Modificar: build optimizations
```

---

## Paso 1: Crear `.env.production`

Crea `.env.production` en la raíz del proyecto:

```bash
VITE_API_BASE_URL=https://fakestoreapi.com
```

> Para este proyecto, la URL es la misma en dev y producción. En un proyecto real, aquí irían las URLs de la API de producción.

---

## Paso 2: Configurar el archivo de redirects

### Opción A — Netlify

Crea `public/_redirects` (sin extensión de archivo):

```
/*  /index.html  200
```

Este archivo le dice a Netlify que para cualquier URL, devuelva `index.html` con código 200. Así Vue Router puede tomar el control.

### Opción B — Vercel

Crea `public/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Paso 3: Optimizar `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          axios: ['axios']
        }
      }
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  }
})
```

---

## Paso 4: Build local

```bash
pnpm build
```

Observa el output. Deberías ver algo similar a:

```
dist/index.html                      1.23 kB
dist/assets/vendor-[hash].js        89.45 kB  ← Vue + Router + Pinia
dist/assets/axios-[hash].js         15.23 kB
dist/assets/ProductosView-[hash].js  8.12 kB  ← Lazy chunk
dist/assets/CarritoView-[hash].js    4.56 kB  ← Lazy chunk
dist/assets/index-[hash].css         4.12 kB
```

Si algún chunk supera los 500 KB, hay un problema de optimización.

---

## Paso 5: Preview local

```bash
pnpm preview
```

Abre `http://localhost:4173` y verifica:
- [ ] La aplicación carga correctamente
- [ ] La navegación entre rutas funciona
- [ ] Al refrescar en `/productos`, la página sigue mostrando el catálogo (no un 404)
- [ ] El login funciona
- [ ] Los productos se cargan desde la API

---

## Paso 6A: Deploy en Netlify (opción recomendada)

### Método 1: Drag & Drop (más rápido)

1. Ve a [netlify.com](https://app.netlify.com) e inicia sesión con tu cuenta de GitHub
2. En el dashboard, busca la zona de "Sites" y arrastra la carpeta `dist/` directamente
3. Netlify genera una URL automática como `https://random-name-123.netlify.app`
4. Verifica que el `_redirects` funciona: navega a `/productos` y recarga

### Método 2: Deploy desde Git (recomendado para proyectos reales)

1. Sube el proyecto a GitHub: `git push origin main`
2. En Netlify: "Add new site" → "Import an existing project" → GitHub
3. Selecciona el repositorio
4. Configuración:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
5. Agregar variables de entorno: Site settings → Environment variables → Add variable
   - `VITE_API_BASE_URL` = `https://fakestoreapi.com`
6. Click "Deploy site"

---

## Paso 6B: Deploy en Vercel (alternativa)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. "New Project" → Importa el repositorio
3. Vercel detecta automáticamente que es Vite
4. Agrega la variable de entorno `VITE_API_BASE_URL`
5. Click "Deploy"

---

## Paso 7: Verificación post-deploy

Una vez publicado, verifica el siguiente checklist:

```
URL del sitio: https://______________________.netlify.app
```

- [ ] La página principal carga
- [ ] Los productos se muestran (API real)
- [ ] La navegación funciona sin recargar
- [ ] Al pegar la URL `/carrito` directamente en el navegador, redirige a `/login` (guard activo)
- [ ] Al hacer login y navegar, el carrito mantiene los datos (persistencia)
- [ ] Refrescar en `/productos` muestra el catálogo (SPA routing correcto)
- [ ] HTTPS está activo (candado en la barra del navegador)
- [ ] En DevTools → Network → no hay errores de CORS

---

## Validaciones Esperadas

- [ ] `pnpm build` completa sin errores ni warnings de TypeScript
- [ ] `pnpm preview` funciona en `localhost:4173`
- [ ] El sitio está publicado y accesible en internet
- [ ] Refrescar cualquier ruta no da 404

---

## Entregables

- URL pública de la aplicación desplegada
- `public/_redirects` o `public/vercel.json`
- `.env.production`
- `vite.config.ts` con `manualChunks`

---

## Commits Sugeridos

```bash
git add public/_redirects .env.production vite.config.ts
git commit -m "chore: preparar proyecto para deploy en producción (módulo 15)"
```

> Agrega `.env.production` a `.gitignore` si contiene secretos reales. En este proyecto no tiene secretos (la URL de la API es pública), pero es una buena práctica.
