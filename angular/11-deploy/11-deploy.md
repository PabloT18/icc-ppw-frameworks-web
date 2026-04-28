# Programación y Plataformas Web

# Frameworks Web: Angular 21

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
</div>

## 11. Deploy

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Preparar y publicar el proyecto incremental Angular 21 para que quede accesible desde un entorno real, usando un flujo de build y despliegue repetible.

---

## 2. Explicación conceptual

Desplegar no es solo “subir archivos”. También implica confirmar que la configuración del build, el router y la ruta base de la aplicación sean coherentes con el hosting elegido.

| Proyecto local | Proyecto desplegado |
|---|---|
| funciona solo en desarrollo | puede compartirse y evaluarse fuera del entorno local |
| no necesita `baseHref` especial | puede requerir configuración según el hosting |
| errores de rutas pasan desapercibidos | el deploy obliga a revisar el comportamiento real |

---

## 3. Fundamento técnico

### 3.1 Build de producción

```bash
pnpm ng build --configuration production
```

### 3.2 GitHub Pages

El documento de apoyo [angular/docs/angular-deploy.md](../docs/angular-deploy.md) explica el flujo base con `angular-cli-ghpages`.

### 3.3 Consideraciones importantes

- revisar `baseHref` y `deployUrl`
- considerar rutas Angular al refrescar la página
- verificar carpeta final del build

### 3.4 Estrategia pedagógica

En este curso el deploy cierra el recorrido técnico: no se introduce como apéndice sino como evidencia funcional del proyecto incremental completo.

---

## 4. Ejemplos de código

### Ejemplo 1: script de despliegue

```json
{
  "scripts": {
    "deploy:gh": "pnpm ng build --configuration production && pnpm exec angular-cli-ghpages --dir=dist/ppw-angular-21/browser"
  }
}
```

### Ejemplo 2: configuración de producción

```json
"production": {
  "outputHashing": "all",
  "baseHref": "/ppw-angular-21/",
  "deployUrl": "/ppw-angular-21/"
}
```

---

## 5. Buenas prácticas

- Automatiza el deploy con scripts.
- Verifica el build local antes de publicar.
- Comprueba rutas después del despliegue.
- Mantén consistente el nombre del repositorio y la configuración base.
- Documenta la URL final publicada.

---

## 6. Errores comunes

- Olvidar ajustar `baseHref`.
- Suponer que el router funcionará igual sin revisar refresh de rutas.
- Desplegar sin probar build de producción.
- Mezclar varios nombres de proyecto o repositorio.
- Tratar deploy como un paso manual improvisado.

---

## 7. Relación con el proyecto incremental

Este es el cierre natural del recorrido principal. El proyecto ya pasó por base, features, formularios, estilos, servicios, UX, autenticación y guards; ahora debe poder compartirse como resultado final.

---

## 8. Referencias recomendadas

- [angular/docs/angular-deploy.md](../docs/angular-deploy.md)
- Documentación oficial de Angular deployment: https://angular.dev/tools/cli/deployment
