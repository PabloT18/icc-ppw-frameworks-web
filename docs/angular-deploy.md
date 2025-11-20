
# Despliegue de Proyecto Angular 20 en GitHub Pages (con pnpm)

Este documento explica cómo **configurar**, **desplegar** y **actualizar** una aplicación Angular (v20) en **GitHub Pages**, utilizando **pnpm** y el builder moderno `@angular/build:application`.

---

# ✅ 1. Requisitos previos

Asegúrate de tener instalado:

* Node.js
* pnpm
* Angular CLI 17+ o 20+
* Un repositorio en GitHub
* Un proyecto Angular ya funcionando

Instalar Angular CLI:

```bash
pnpm add -g @angular/cli
```

Ver versión:

```bash
ng version
```

---

# ✅ 2. Instalar angular-cli-ghpages

En el proyecto:

```bash
pnpm ng add angular-cli-ghpages
```

Esto agrega la capacidad de publicar en GitHub Pages.

---

# ✅ 3. Configurar `baseHref` y `deployUrl`

Con Angular 17–20, el `angular.json` ya no usa `outputPath`, y **estos valores deben ir solo en `production`**.

Edita:

`angular.json` →
`projects` → `<tu-proyecto>` →
`architect` → `build` → `configurations` → `production`

Agrega:

```json
"baseHref": "/NOMBRE-DEL-REPO/",
"deployUrl": "/NOMBRE-DEL-REPO/"
```

Ejemplo:

```json
"production": {
  "outputHashing": "all",
  "baseHref": "/01-fundamentos/",
  "deployUrl": "/01-fundamentos/"
}
```

> Reemplaza `01-fundamentos` por el nombre exacto del repositorio.

---

# ✅ 4. Construir el proyecto para producción

Angular 20 genera el build en:

```
dist/<proyecto>/browser
```

Ejecuta:

```bash
pnpm ng build --configuration production
```

---

# ✅ 5. Desplegar en GitHub Pages (comando correcto)

Como Angular 20 **no usa outputPath**, hay que indicar manualmente la carpeta correcta del build:

```bash
pnpm exec angular-cli-ghpages --dir=dist/<proyecto>/browser
```

Ejemplo:

```bash
pnpm exec angular-cli-ghpages --dir=dist/01-fundamentos/browser
```

Cuando termine, verás:

```
🌟 Successfully published via angular-cli-ghpages!
```

Tu sitio quedará disponible en:

```
https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/
```

---

# 🚀 6. Cómo subir nuevos cambios (actualizar la página)

Cada vez que edites tu proyecto, el flujo será:

### 1️⃣ Construir:

```bash
pnpm ng build --configuration production
```

### 2️⃣ Desplegar:

```bash
pnpm exec angular-cli-ghpages --dir=dist/<proyecto>/browser
```

Ejemplo:

```bash
pnpm exec angular-cli-ghpages --dir=dist/01-fundamentos/browser
```

Y GitHub Pages se actualizará con la nueva versión.

No necesitas borrar nada ni modificar ramas:
`angular-cli-ghpages` se encarga de sobreescribir la rama `gh-pages`.

---

# 🔧 7. (Opcional) Crear un script para simplificar el despliegue

En `package.json`:

```json
"scripts": {
  "deploy:gh": "pnpm ng build --configuration production && pnpm exec angular-cli-ghpages --dir=dist/01-fundamentos/browser"
}
```

Para desplegar más rápido:

```bash
pnpm deploy:gh
```

---

# 📝 8. Notas importantes

* GitHub Pages no soporta recargar rutas Angular directamente (si usas routing, considera usar `HashLocationStrategy` o agregar un `404.html` especial).
* Si usas dominio personalizado, crea un archivo `CNAME` dentro de la carpeta `browser`.
* Recuerda que **cada commit no publica automáticamente**; siempre debes ejecutar `deploy`.

---

