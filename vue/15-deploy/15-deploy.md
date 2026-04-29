# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 15: Deploy

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

El deploy es el proceso de publicar la aplicación en un servidor para que sea accesible desde cualquier navegador. Para una SPA Vue + Vite, el proceso es:

1. **Build**: Vite compila TypeScript, empaqueta los módulos y optimiza los assets
2. **Output**: se genera la carpeta `dist/` con archivos estáticos (`index.html`, JS, CSS, assets)
3. **Serve**: los archivos de `dist/` se publican en un CDN o servidor estático

El reto principal de las SPAs en deploy es el **enrutamiento del lado del cliente**: el servidor recibe `/productos` pero solo tiene `index.html`, y debe devolver ese archivo para que Vue Router tome el control.

---

## 2. Conceptos Clave

### Vite build

```bash
pnpm build
```

Genera `dist/` con:
- `index.html` — el punto de entrada
- `assets/*.js` — bundles de JavaScript (con hash en el nombre para cache-busting)
- `assets/*.css` — estilos compilados
- Archivos copiados de `public/`

### Variables de entorno por modo

Vite soporta múltiples archivos `.env`:

| Archivo | Cuando aplica |
|---|---|
| `.env` | Siempre |
| `.env.local` | Siempre (ignorado por git) |
| `.env.development` | Solo en `pnpm dev` |
| `.env.production` | Solo en `pnpm build` |

```bash
# .env.production
VITE_API_BASE_URL=https://api.mi-tienda.com
```

### Opción `base` de Vite

Si el sitio no está en la raíz del dominio (ej: GitHub Pages en `usuario.github.io/repo/`):

```typescript
// vite.config.ts
export default defineConfig({
  base: '/nombre-del-repo/'  // Solo para GitHub Pages
})
```

Para Netlify/Vercel en dominio propio, `base: '/'` (valor por defecto).

---

## 3. Explicación

### SPA Routing en servidores estáticos

Una SPA siempre sirve `index.html` independientemente de la URL. Los distintos hosts se configuran así:

**Netlify** — crear `public/_redirects`:
```
/*  /index.html  200
```

**Vercel** — crear `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**GitHub Pages** — No soporta SPA routing nativamente. Opciones:
1. Usar `404.html` con un redirect script (workaround)
2. Usar GitHub Actions para subir a Netlify/Vercel automáticamente
3. Cambiar a `createWebHashHistory()` en el router (agrega `#` a las URLs)

**Nginx** (servidor propio):
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### CI/CD con GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Variables de entorno secretas en producción

Las variables `VITE_*` se incrustran en el bundle en tiempo de build. Para secretos de producción:
- **Netlify**: Site settings → Environment variables
- **Vercel**: Project settings → Environment variables
- **GitHub Actions**: Repository settings → Secrets

Nunca hagas commit de `.env.production` con secrets reales.

### Checklist pre-deploy

```typescript
// 1. Verificar que el build funciona localmente
pnpm build && pnpm preview

// 2. Revisar las variables de entorno de producción
// 3. Verificar que el _redirects o vercel.json están en public/
// 4. Confirmar que base está configurado correctamente
// 5. Revisar errores de consola en pnpm preview
```

---

## 4. Ejemplos de Código

### `vite.config.ts` para producción

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',  // Sourcemaps solo en dev
    rollupOptions: {
      output: {
        // Separar vendor de código propio para mejor caching
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
}))
```

### Script de deploy a Netlify (drag & drop manual)

```bash
# 1. Build
pnpm build

# 2. El contenido de dist/ se arrastra al panel de Netlify
# O usando la CLI:
npx netlify-cli deploy --prod --dir=dist
```

### Configurar dominio personalizado en Netlify

1. En Netlify: Site settings → Domain management → Add custom domain
2. En tu registrador de dominio: agregar un registro CNAME apuntando a `tu-sitio.netlify.app`
3. Netlify provisiona automáticamente el certificado HTTPS (Let's Encrypt)

---

## 5. Buenas Prácticas

- **Siempre probar con `pnpm preview` antes del deploy**: simula exactamente las condiciones de producción.
- **Nunca hardcodear URLs en el código**: usar variables `VITE_*`.
- **Configurar el archivo de redirects desde el inicio**: evita el "funciona en local, falla en producción".
- **Usar un dominio personalizado**: `mi-tienda.netlify.app` funciona, pero un dominio propio es más profesional.
- **Habilitar HTTPS**: todos los hosts modernos lo dan gratis; es obligatorio para APIs con cookies seguras.
- **Revisar el tamaño del bundle**: `pnpm build` muestra el tamaño de cada chunk. Si un chunk supera 500KB, investigar cómo reducirlo.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Página en blanco en producción | Ruta `base` incorrecta | Verificar la opción `base` en `vite.config.ts` |
| 404 al refrescar o compartir URL | Servidor no configurado para SPA | Agregar `_redirects` en Netlify o `vercel.json` |
| API da CORS error en producción | URL de la API diferente en prod | Verificar `.env.production` y CORS en el backend |
| Assets no cargan (imágenes rotas) | Rutas de assets hardcodeadas | Usar `import` o `new URL('./asset', import.meta.url)` |
| Variables `undefined` en producción | Olvidó configurar las env vars en el host | Revisar el panel de variables de entorno del host |

---

## 7. Relación con el Proyecto Incremental

Al finalizar este módulo, el proyecto `ppw-vue-app` está publicado y accesible en internet. El ciclo completo de desarrollo está cerrado:

```
Desarrollo local (módulos 01-14)
    ↓
pnpm build
    ↓
Subir dist/ a Netlify/Vercel
    ↓
Aplicación accesible en internet
```

---

## 8. Referencias

- [Vite - Deploy Guide](https://vitejs.dev/guide/static-deploy)
- [Netlify - Deploy a Vue App](https://docs.netlify.com/frameworks/vue/)
- [Vercel - Vue.js](https://vercel.com/docs/frameworks/vite)
- [GitHub Pages - SPA Workaround](https://github.com/rafgraph/spa-github-pages)
- [Vite - Env Variables](https://vitejs.dev/guide/env-and-mode)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
