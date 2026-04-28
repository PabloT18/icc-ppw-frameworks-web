# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Módulo 13: Deploy

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

El deploy es la etapa final del ciclo de desarrollo: hacer que el sitio esté disponible para el mundo real. Astro soporta múltiples plataformas y tipos de despliegue. La elección depende del tipo de rendering del proyecto.

---

## 2. Conceptos Clave

### Tipos de deploy

| Tipo | Cuándo usar | Plataformas |
|------|-------------|-------------|
| **Estático** | `output: 'static'` | Netlify, Cloudflare Pages, Vercel, GitHub Pages |
| **SSR / Servidor** | `output: 'server'` o `'hybrid'` | Netlify Functions, Cloudflare Workers, Railway, Render |

### Build de producción

```bash
pnpm build        # Genera la carpeta dist/
pnpm preview      # Sirve dist/ localmente para validar
```

### Variables de entorno en producción

Las variables de `.env` **no se incluyen** en el repositorio. Deben configurarse manualmente en el dashboard de cada plataforma.

```
Netlify → Site Configuration → Environment variables
Cloudflare → Settings → Environment Variables
Vercel → Settings → Environment Variables
```

### `netlify.toml`

```toml
[build]
  command   = "pnpm build"
  publish   = "dist/"

[build.environment]
  NODE_VERSION = "20"
```

Para SSR con Netlify:

```bash
pnpm astro add netlify
```

---

## 3. Explicación Técnica

### Deploy estático en Netlify (drag & drop)

```bash
pnpm build
# Subir carpeta dist/ al dashboard de Netlify
```

### Deploy con Git (CI/CD automático)

1. Push al repositorio de GitHub.
2. Conectar el repo en Netlify/Cloudflare Pages.
3. Configurar: Build command = `pnpm build`, Publish directory = `dist/`.
4. Cada push a `main` desencadena un nuevo deploy automáticamente.

### Deploy SSR en Cloudflare Pages

```bash
pnpm astro add cloudflare
```

```javascript
// astro.config.mjs para Cloudflare
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
```

### Variables de entorno en Astro

```typescript
// Solo accesibles en código servidor (SSR):
import.meta.env.MI_VARIABLE_PRIVADA

// Accesibles también en cliente (solo si llevan prefijo PUBLIC_):
import.meta.env.PUBLIC_API_URL
```

---

## 4. Ejemplos de Código

### `netlify.toml` para sitio estático

```toml
[build]
  command   = "pnpm build"
  publish   = "dist/"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
  # Solo para SPA — no necesario en Astro estático
```

### `netlify.toml` para SSR

```toml
[build]
  command   = "pnpm build"
  publish   = "dist/"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"  # NO usar — ejemplo solo visual
  # Astro SSR en Netlify usa @astrojs/netlify
```

### Script de validación pre-deploy

```bash
#!/bin/bash
# scripts/pre-deploy.sh
set -e
echo "🔍 Verificando build..."
pnpm build
echo "✅ Build exitoso"
echo "🔍 Verificando preview..."
pnpm preview &
PREVIEW_PID=$!
sleep 3
curl -sf http://localhost:4321 > /dev/null && echo "✅ Preview responde" || echo "❌ Preview falló"
kill $PREVIEW_PID
```

---

## 5. Buenas Prácticas

- Siempre hacer `pnpm build && pnpm preview` localmente antes de hacer deploy.
- Nunca subir el `.env` real al repositorio — usar `.gitignore`.
- Configurar variables de entorno desde el dashboard de la plataforma.
- Usar `PUBLIC_` solo para variables que pueden estar expuestas al cliente.
- Verificar que el sitio funciona en una sesión privada (sin caché).
- Configurar dominios personalizados con HTTPS.

---

## 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Build falla en CI | Versión de Node diferente | Especificar `NODE_VERSION` en `netlify.toml` |
| Variables de entorno indefinidas en prod | No configuradas en el dashboard | Agregar manualmente en la plataforma |
| Rutas 404 en Netlify | Publicar directorio incorrecto | Verificar que `publish = "dist/"` |
| Imágenes rotas | URLs relativas | Usar URLs absolutas o paths desde `/` |
| SSR no funciona | Falta adapter | `pnpm astro add netlify` o `cloudflare` |

---

## 7. Relación con el Proyecto Incremental

Este es el módulo final de `astro-campus`. El sitio está listo para producción con:

- Build optimizado con `pnpm build`.
- `netlify.toml` configurado.
- `.env.example` documentando todas las variables.
- Deploy en Netlify o Cloudflare Pages.

---

## 8. Recursos

- [Deploy Guides de Astro](https://docs.astro.build/es/guides/deploy/)
- [Netlify Adapter](https://docs.astro.build/es/guides/integrations-guide/netlify/)
- [Cloudflare Pages Adapter](https://docs.astro.build/es/guides/integrations-guide/cloudflare/)
- [Variables de entorno en Astro](https://docs.astro.build/es/guides/environment-variables/)
- [Netlify Dashboard](https://app.netlify.com)
- [Cloudflare Pages Dashboard](https://dash.cloudflare.com)
