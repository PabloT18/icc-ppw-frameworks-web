# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 11. Deploy - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo práctico

Construir y publicar el proyecto `ppw-angular-21` usando GitHub Pages como destino principal de despliegue académico.

---

## 2. Contexto de la práctica

El proyecto incremental ya está completo. En esta fase se valida que también pueda compilarse y publicarse fuera del entorno local, lo cual servirá como evidencia final del trabajo del estudiante.

---

## 3. Archivos que se van a modificar

- `angular.json`
- `package.json`
- `README.md`

---

## 4. Archivos base desde `files`

La carpeta [angular/11-deploy/files](files/README.md) queda lista para almacenar ejemplos de configuración de producción y scripts de despliegue.

---

## 5. Código que el estudiante debe copiar inicialmente

### 5.1 Instalar herramienta de despliegue

```bash
pnpm ng add angular-cli-ghpages
```

### 5.2 Crear script de deploy

```json
{
  "scripts": {
    "deploy:gh": "pnpm ng build --configuration production && pnpm exec angular-cli-ghpages --dir=dist/ppw-angular-21/browser"
  }
}
```

---

## 6. Pasos incrementales

### Paso 1. Ajustar producción en `angular.json`

Configurar `baseHref` y `deployUrl` con el nombre real del repositorio.

Explicación técnica: esto permite que la app resuelva correctamente sus rutas y assets en GitHub Pages.

### Paso 2. Generar build de producción

```bash
pnpm ng build --configuration production
```

Explicación técnica: el build de producción es la validación previa obligatoria antes de publicar.

### Paso 3. Publicar con `angular-cli-ghpages`

```bash
pnpm exec angular-cli-ghpages --dir=dist/ppw-angular-21/browser
```

Explicación técnica: GitHub Pages publicará el contenido compilado, no el código fuente TypeScript.

### Paso 4. Verificar la URL pública

Abrir la URL publicada y recorrer rutas importantes de la aplicación.

Explicación técnica: el éxito del deploy no se mide solo por una consola sin errores, sino por el funcionamiento real del sitio publicado.

### Paso 5. Documentar la URL final en el README

Agregar el enlace público del proyecto.

Explicación técnica: así el repositorio y la evidencia del estudiante quedan alineados.

---

## 7. Validaciones esperadas

- El build de producción termina sin errores.
- El sitio publicado carga correctamente.
- La ruta base resuelve assets y estilos.
- El README contiene la URL pública final.

Placeholder sugerido de captura: `assets/11-deploy-ghpages.png`

---

## 8. Entregables

- Proyecto publicado en GitHub Pages.
- Script de deploy en `package.json`.
- README actualizado con URL pública.
- Evidencia visual del despliegue exitoso.

---

## 9. Commits sugeridos

```bash
git commit -m "chore: configurar build de producción para github pages"
git commit -m "chore: agregar script de despliegue"
git commit -m "docs: registrar url pública del proyecto"
```
