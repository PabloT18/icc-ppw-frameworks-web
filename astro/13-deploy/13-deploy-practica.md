# Programación y Plataformas Web

# Astro: Desarrollo Web Moderno

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original-wordmark.svg" width="80" alt="Astro Logo">
</div>

## Práctica 13: Deploy

### Autor

**Pablo Torres**  
ptorresp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Construir `astro-campus` para producción, verificar localmente y hacer deploy en Netlify o Cloudflare Pages.

---

## Archivos que se crean / modifican

```
astro-campus/
├── netlify.toml              ← NUEVO
├── .env.example              ← VERIFICAR que está completo
└── .gitignore                ← VERIFICAR que incluye .env
```

---

## Paso 1: Verificar `.gitignore`

**¿Qué hace este paso?** Asegura que los archivos sensibles y de build no se suban al repositorio.

El `.gitignore` generado por Astro ya incluye lo necesario. Verificar que contiene:

```
# dependencies
node_modules/

# build
dist/
.output/
.vercel/
.netlify/

# environment
.env
.env.local
.env.*.local
```

---

## Paso 2: Crear `netlify.toml`

**¿Qué hace este paso?** Le dice a Netlify cómo construir el proyecto y dónde está el output.

```toml
[build]
  command   = "pnpm build"
  publish   = "dist/"

[build.environment]
  NODE_VERSION = "20"
```

Si el proyecto usa SSR (módulo 10 en adelante), también instalar el adapter:

```bash
pnpm astro add netlify
```

---

## Paso 3: Build local y preview

**¿Qué hace este paso?** Valida que el build de producción funciona antes de subir.

```bash
pnpm build
pnpm preview
```

Verificar en `http://localhost:4321`:
- [ ] La página de inicio carga correctamente
- [ ] Las rutas dinámicas (`/recursos/intro-astro`) funcionan
- [ ] El blog lista los posts
- [ ] Las imágenes se muestran

---

## Paso 4: Deploy en Netlify

**¿Qué hace este paso?** Publica el sitio en internet.

### Opción A — Drag & Drop (sin CI/CD)

1. Ejecutar `pnpm build`
2. Ir a [netlify.com/drop](https://app.netlify.com/drop)
3. Arrastrar la carpeta `dist/` al área de drop
4. El sitio queda publicado con URL aleatoria

### Opción B — Git (CI/CD automático)

1. Subir el proyecto a GitHub (sin `.env`):
   ```bash
   git add .
   git commit -m "feat: finalize astro-campus for production"
   git push origin main
   ```
2. En Netlify: "Add new site" → "Import an existing project" → Seleccionar el repo
3. Configurar:
   - Build command: `pnpm build`
   - Publish directory: `dist/`
4. En "Environment variables": agregar las variables de `.env.example`
5. Deploy site

---

## Paso 5: Verificación post-deploy

**¿Qué hace este paso?** Confirma que todo funciona en producción.

```
✅ Checklist post-deploy:

□ La URL pública carga sin errores
□ Las rutas /recursos/1, /blog, /contacto responden
□ El formulario de contacto envía correctamente
□ /dashboard redirige a /login (si no hay sesión)
□ Las imágenes se cargan
□ El sitio tiene HTTPS
□ El meta title es correcto en cada página (abrir pestaña)
```

---

## Paso 6: TODO — Completar por el estudiante

```bash
# TODO: Configurar dominio personalizado
# En Netlify: Site settings → Domain management → Add custom domain
# Seguir instrucciones para configurar DNS

# TODO: Agregar deploy badge al README
# [![Netlify Status](https://api.netlify.com/api/v1/badges/{ID}/deploy-status)](URL)
```

---

## Validaciones esperadas

- [ ] `pnpm build` termina sin errores
- [ ] `pnpm preview` sirve el sitio correctamente en local
- [ ] El sitio está publicado en una URL pública
- [ ] Las variables de entorno están configuradas en la plataforma
- [ ] El score de Lighthouse en producción supera 90 en Performance

---

## Entregables

- `netlify.toml` en el repositorio
- URL del sitio publicado
- Captura del dashboard de Netlify con el deploy exitoso
- Captura del reporte de Lighthouse en la URL de producción

---

## Commits sugeridos

```
feat: add netlify.toml for deployment configuration
feat: verify build and deploy astro-campus to production
```
