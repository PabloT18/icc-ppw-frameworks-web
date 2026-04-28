# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 15: Deploy a Produccion

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Compilar el proyecto ReactStore para produccion, entender la estructura del bundle generado, y desplegarlo en Netlify y/o Vercel. Configurar variables de entorno en la plataforma y resolver el problema de enrutamiento SPA en servidor estatico.

---

## 2. El Proceso de Build

```bash
pnpm build
```

Vite ejecuta dos pasos:
1. **`tsc -b`** — TypeScript verifica tipos. Si hay errores de tipos, el build falla
2. **`vite build`** — Rollup agrupa, minifica y genera los archivos optimizados en `dist/`

Resultado:
```
dist/
├── index.html               ← punto de entrada (minificado)
├── assets/
│   ├── index-[hash].js      ← codigo de la app (minificado + tree-shaken)
│   ├── index-[hash].css     ← estilos compilados
│   └── vendor-[hash].js     ← librerias externas (react, react-dom, etc.)
└── (imagenes y fuentes copiadas de public/)
```

El **hash** en el nombre del archivo cambia cada vez que el contenido cambia — esto garantiza que el browser no sirva archivos cacheados de una version anterior.

---

## 3. Preview Local Antes de Desplegar

```bash
pnpm preview
```

Levanta un servidor estatico en `http://localhost:4173` sirviendo el contenido de `dist/`. Permite verificar que el build funciona correctamente antes de hacer deploy.

---

## 4. El Problema de Enrutamiento SPA

El problema principal al desplegar una SPA con React Router en un servidor estatico:

```
Usuario en /products/42
↓ Recarga la pagina (F5)
↓ El servidor estatico busca el archivo products/42/index.html
↓ No existe — el servidor retorna 404
```

Solucion: configurar el servidor para que **todas las rutas sirvan `index.html`**, y dejar que React Router maneje la navegacion en el cliente.

---

## 5. Deploy en Netlify

### Opcion A — Drag & Drop (sin CLI)

1. Ejecutar `pnpm build`
2. Ir a [app.netlify.com](https://app.netlify.com) → "Add new site" → "Deploy manually"
3. Arrastrar la carpeta `dist/` a la zona de upload
4. El sitio queda disponible en una URL como `https://random-name.netlify.app`

### Opcion B — Conectar con GitHub (recomendado)

1. Hacer push del proyecto a GitHub
2. Ir a Netlify → "Add new site" → "Import an existing project" → GitHub
3. Seleccionar el repositorio
4. Configurar:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
5. Netlify hace deploy automatico en cada push a `main`

### Resolver el problema de rutas: `_redirects`

Crear `public/_redirects` (sin extension):

```
/* /index.html 200
```

Esta regla le indica a Netlify: "para cualquier URL, servir `index.html` con codigo 200". La carpeta `public/` es copiada al `dist/` por Vite automaticamente.

### Variables de entorno en Netlify

Ir a: Site → Site configuration → Environment variables → "Add a variable"

```
Key: VITE_API_URL
Value: https://dummyjson.com
```

> Las variables `VITE_` son embebidas en el bundle en el momento del build — no son secretas. No usar para API keys privadas.

---

## 6. Deploy en Vercel

### Con Vercel CLI

```bash
pnpm add -g vercel
vercel login
vercel         # en el directorio del proyecto
vercel --prod  # deploy a produccion
```

### Conectar con GitHub (recomendado)

1. Ir a [vercel.com](https://vercel.com) → "Add New" → "Project"
2. Importar el repositorio de GitHub
3. Vercel detecta Vite automaticamente — las configuraciones son correctas por defecto
4. Variables de entorno: Settings → Environment Variables

### Resolver el problema de rutas en Vercel: `vercel.json`

Crear `vercel.json` en la raiz del proyecto:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 7. `netlify.toml` — Configuracion por Archivo

Alternativa al panel de Netlify — configurar el deploy por archivo (versionado con el codigo):

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

---

## 8. Buenas Practicas para Produccion

| Practica | Detalle |
|---|---|
| Variables de entorno | Usar VITE_ prefix para el cliente. Nunca poner tokens privados en variables VITE_ |
| Error boundaries | Agregar `<ErrorBoundary>` alrededor de la app para capturar errores en produccion |
| HTTPS | Netlify y Vercel sirven HTTPS por defecto — no configurar |
| Cache headers | Las plataformas configuran automaticamente headers de cache para archivos con hash |
| Preview deploys | Netlify/Vercel crean una URL unica para cada Pull Request — permite revisar antes de fusionar |

---

## 9. Verificar el Deploy

Despues de desplegar, verificar:

- [ ] La URL publica carga la aplicacion
- [ ] Navegar a `/products/1` y recargar — no debe dar 404
- [ ] Ir a `/login` directamente en la URL — no debe dar 404
- [ ] DevTools → Network → verificar que los archivos `.js` se sirven con `Cache-Control: max-age=31536000` (1 año para archivos con hash)
- [ ] La aplicacion consume la API de DummyJSON correctamente (VITE_API_URL configurada)

---

## 10. Referencias

- [Netlify Deploy Docs](https://docs.netlify.com/get-started/)
- [Vercel Deploy Docs](https://vercel.com/docs)
- [Vite — Building for Production](https://vitejs.dev/guide/build.html)
- [React Router — Deploying](https://reactrouter.com/en/main/start/deploying)
