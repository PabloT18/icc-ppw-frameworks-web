# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 15: Deploy a Produccion con Netlify y Vercel

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Compilar ReactStore para produccion, resolver el problema de enrutamiento SPA, y desplegar en Netlify (drag & drop y conectado a GitHub). Verificar que todas las rutas funcionan despues del deploy.

---

## Paso 1: Verificar que el proyecto compila sin errores

**(verificar)**

```bash
pnpm build
```

Si TypeScript muestra errores, deben resolverse antes de continuar. Los errores mas comunes al preparar para produccion:

- Tipos `any` implicitos
- Variables declaradas pero no usadas
- Imports que no existen

Si el build es exitoso, verificar localmente:

```bash
pnpm preview
```

Abrir `http://localhost:4173`, navegar a `/products/1` y `/favorites`. Verificar que funcionan correctamente antes de desplegar.

> Captura pendiente: output de `pnpm build` mostrando el tamanio de cada chunk en verde. Captura del `pnpm preview` en el browser.

---

## Paso 2: Crear archivo `_redirects` para Netlify

**(copiar)**

Crear `public/_redirects` (sin extension de archivo):

```
/* /index.html 200
```

**¿Que hace este archivo?**
- Netlify lee este archivo al recibir cualquier peticion HTTP
- La regla `/* /index.html 200` indica: para cualquier ruta, servir `index.html` con codigo 200 (exito)
- Sin este archivo, navegar a `/products/42` directamente da 404 porque el servidor busca un archivo que no existe — React Router solo funciona en el cliente

---

## Paso 3: Crear `netlify.toml`

**(copiar)**

Crear `netlify.toml` en la raiz del proyecto:

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

**¿Que hace este archivo?**
- `command` — comando que Netlify ejecuta para compilar el proyecto
- `publish` — carpeta que Netlify despliega como sitio estatico
- `[[redirects]]` — equivalente al archivo `_redirects` pero en formato TOML
- `NODE_VERSION = "20"` — garantiza que Netlify use Node 20 (compatible con pnpm 9+)

---

## Paso 4: Crear `vercel.json`

**(copiar)**

Crear `vercel.json` en la raiz del proyecto:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**¿Que hace este archivo?**
- Equivalente al `_redirects` de Netlify pero para Vercel
- `source: "/(.*)"` captura cualquier ruta
- `destination: "/index.html"` sirve siempre el punto de entrada de la SPA

---

## Paso 5: Subir el proyecto a GitHub

**(verificar)**

Verificar que el repositorio esta actualizado y pusheado:

```bash
git status
git add .
git commit -m "feat: agregar configuracion de deploy (netlify.toml, _redirects, vercel.json)"
git push origin main
```

Confirmar que estos archivos esten en el repositorio:
- `netlify.toml`
- `public/_redirects`
- `vercel.json`
- `public/` debe estar commiteado (no en .gitignore)
- `dist/` debe estar en `.gitignore` (nunca commitear el build)

---

## Paso 6: Deploy en Netlify — Drag & Drop

**(verificar)**

1. Asegurarse de tener el build mas reciente: `pnpm build`
2. Ir a [app.netlify.com](https://app.netlify.com) e iniciar sesion (o crear cuenta)
3. En el dashboard principal, hacer clic en "Add new site" → "Deploy manually"
4. Arrastrar **la carpeta `dist/`** (no el proyecto completo) a la zona de upload
5. Esperar el deploy (10-30 segundos)
6. La URL generada (ej: `https://luminous-alpaca-42.netlify.app`) queda activa inmediatamente

> Captura pendiente: pantalla de Netlify mostrando el deploy exitoso con el URL del sitio.

---

## Paso 7: Deploy en Netlify — Conectado a GitHub (recomendado)

**(verificar)**

1. Ir a Netlify → "Add new site" → "Import an existing project"
2. Elegir "Deploy with GitHub" y autorizar el acceso
3. Seleccionar el repositorio `icc-ppw-frameworks-web` (o el repositorio del estudiante)
4. En "Build settings":
   - **Base directory**: `react/` si el proyecto react esta en una subcarpeta, o dejar vacio si es la raiz
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
5. Hacer clic en "Deploy site"
6. En cada push a `main`, Netlify hace deploy automaticamente

---

## Paso 8: Configurar Variables de Entorno en Netlify

**(verificar)**

1. En el dashboard del sitio: Site configuration → Environment variables
2. Hacer clic en "Add a variable"
3. Agregar:
   - Key: `VITE_API_URL`
   - Value: `https://dummyjson.com`
4. Hacer clic en "Save"
5. **Triggear un nuevo deploy** para que el build recoja las nuevas variables: Deploys → "Trigger deploy" → "Deploy site"

> Las variables `VITE_*` se embeben en el bundle en el momento del build. Si se cambian, se debe hacer un nuevo build para que tengan efecto.

---

## Paso 9: Verificacion del Deploy

**(verificar)**

Desde la URL del sitio desplegado, verificar:

- [ ] La pagina principal (`/`) carga con los productos
- [ ] Hacer clic en un producto y navegar a `/products/42`
- [ ] Recargar la pagina en `/products/42` — NO debe dar 404
- [ ] Navegar a `/login` directamente — NO debe dar 404
- [ ] Navegar a `/favorites` sin sesion — redirige a `/login`
- [ ] El login con `emilys`/`emilyspass` funciona en el sitio desplegado
- [ ] Los filtros y la busqueda de productos funcionan

> Captura pendiente: URL publica del sitio en el browser mostrando la pantalla de inicio de ReactStore desplegada. La URL debe ser de Netlify o Vercel (no localhost).

---

## Validaciones Finales del Proyecto

Este es el ultimo modulo del curriculo principal. El proyecto ReactStore desplegado debe tener:

- [ ] Lista de productos cargada desde DummyJSON
- [ ] Busqueda y filtros de productos funcionando
- [ ] Navegacion a detalle de producto
- [ ] Favoritos guardados en localStorage (persisten entre sesiones)
- [ ] Login y logout con DummyJSON
- [ ] Ruta de favoritos protegida (requiere login)
- [ ] Rutas SPA funcionando correctamente al recargar
- [ ] Cache con TanStack Query (productos ya vistos no generan nuevas peticiones)

---

## Entregables

- `public/_redirects`
- `netlify.toml`
- `vercel.json`
- URL del sitio desplegado en Netlify o Vercel

---

## Commits Sugeridos

```bash
git commit -m "chore: agregar public/_redirects para SPA routing en Netlify"
git commit -m "chore: agregar netlify.toml con configuracion de build"
git commit -m "chore: agregar vercel.json para SPA routing en Vercel"
git commit -m "feat: deploy a produccion en Netlify - [URL DEL SITIO]"
```
