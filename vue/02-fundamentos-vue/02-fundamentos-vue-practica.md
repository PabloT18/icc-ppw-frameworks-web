# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 2: Fundamentos de Vue — SFC, ref e Interpolación

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Aplicar los conceptos fundamentales de Vue 3 directamente en el proyecto. Al finalizar esta práctica, `App.vue` tendrá estado reactivo con `ref`, funciones básicas y el template mostrará datos dinámicos usando interpolación.

---

## Contexto

Esta práctica extiende el proyecto creado en el módulo 01. El servidor de desarrollo debe estar corriendo. Todos los cambios se hacen dentro de `src/App.vue`.

**Proyecto:** `ppw-vue-app`  
**Archivo principal:** `src/App.vue`

---

## Archivos que se van a modificar

```
ppw-vue-app/src/
└── App.vue    ← único archivo modificado en esta práctica
```

---

## Código base desde `files/`

Copia el siguiente contenido en `src/App.vue` como punto de partida:

```vue
<script setup lang="ts">
// PASO 1: importa ref aquí
</script>

<template>
  <div class="app">
    <header>
      <h1>PPW Vue App</h1>
      <p>Módulo 02 — Fundamentos</p>
    </header>
    <!-- PASO 2: agrega el contenido del módulo aquí -->
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

header {
  border-bottom: 2px solid #42B883;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

h1 {
  color: #35495E;
}
</style>
```

---

## Paso 1: Importar `ref` y declarar estado reactivo

Dentro del bloque `<script setup lang="ts">`, agrega:

```typescript
import { ref } from 'vue'

const saludo = ref<string>('Hola desde Vue 3')
const contador = ref<number>(0)
const nombreCurso = ref<string>('Programación y Plataformas Web')
```

**¿Qué hace este código?**
- `import { ref } from 'vue'`: importa la función `ref` del paquete de Vue
- `ref<string>(...)`: crea una referencia reactiva de tipo string; cuando cambie su `.value`, Vue actualiza el DOM
- `ref<number>(0)`: referencia reactiva de tipo number inicializada en 0

---

## Paso 2: Mostrar datos con interpolación

Dentro del `<template>`, después del `<header>`, agrega:

```html
<section class="seccion-info">
  <h2>Estado reactivo básico</h2>
  <p>Saludo: {{ saludo }}</p>
  <p>Contador: {{ contador }}</p>
  <p>Curso: {{ nombreCurso }}</p>
</section>
```

**¿Qué hace este código?**
- `{{ saludo }}`: Vue lee el valor actual del ref y lo muestra en el DOM
- Las llaves dobles (`{{ }}`) se llaman "interpolación de texto" en Vue
- Cuando el valor del ref cambie, el texto en pantalla se actualiza automáticamente

> Captura pendiente: `App.vue` mostrando los tres valores del estado reactivo en el navegador.

---

## Paso 3: Agregar funciones y un botón interactivo

En `<script setup lang="ts">` agrega estas funciones después de los refs:

```typescript
function incrementar(): void {
  contador.value++
}

function decrementar(): void {
  if (contador.value > 0) contador.value--
}

function reiniciar(): void {
  contador.value = 0
}
```

**¿Qué hace este código?**
- Las funciones modifican `contador.value`, no `contador` directamente
- `.value` es obligatorio dentro de `<script setup>` para leer o escribir refs
- La validación `if (contador.value > 0)` evita números negativos

Ahora agrega los botones en el template, dentro de `<section class="seccion-info">`:

```html
<div class="controles">
  <button @click="decrementar">−</button>
  <span class="valor">{{ contador }}</span>
  <button @click="incrementar">+</button>
  <button @click="reiniciar">Reiniciar</button>
</div>
```

**¿Qué hace `@click`?**
- `@click` es la abreviatura de `v-on:click` en Vue
- Ejecuta la función indicada cuando el usuario hace clic en el elemento
- No se usan paréntesis en la referencia a la función a menos que necesites pasar argumentos

Agrega los estilos al bloque `<style scoped>`:

```css
.seccion-info {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
}

.controles {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.controles button {
  padding: 0.4rem 1rem;
  border: 1px solid #42B883;
  background: #42B883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.controles button:hover {
  background: #35495E;
  border-color: #35495E;
}

.valor {
  font-size: 1.4rem;
  font-weight: bold;
  min-width: 2rem;
  text-align: center;
}
```

---

## Paso 4: Agregar expresiones en el template

Agrega una nueva sección debajo de la anterior en el `<template>`:

```html
<section class="seccion-expresiones">
  <h2>Expresiones en el template</h2>
  <p>Precio base: ${{ (29.99).toFixed(2) }}</p>
  <p>Con IVA (12%): ${{ (29.99 * 1.12).toFixed(2) }}</p>
  <p>El contador es {{ contador > 0 ? 'positivo' : 'cero' }}</p>
  <p>Curso en mayúsculas: {{ nombreCurso.toUpperCase() }}</p>
</section>
```

**¿Qué demuestra este código?**
- Puedes usar cualquier expresión JavaScript válida dentro de `{{ }}`
- Métodos de string/number están disponibles directamente
- Los operadores ternarios funcionan en el template

---

## Validaciones Esperadas

Al terminar esta práctica, en el navegador debes ver:

- [ ] El saludo y el nombre del curso mostrados desde los refs
- [ ] El contador iniciando en 0
- [ ] Los botones `+`, `−` y `Reiniciar` funcionando correctamente
- [ ] El contador no baja de 0 (validación en `decrementar`)
- [ ] Las expresiones en el template calculando valores en pantalla
- [ ] Sin errores en la consola del navegador
- [ ] Sin errores TypeScript en la terminal

---

## Entregables

`src/App.vue` con:

1. Tres refs declarados y tipados con TypeScript
2. Tres funciones (`incrementar`, `decrementar`, `reiniciar`)
3. Template con interpolación, controles funcionales y expresiones
4. Estilos scoped aplicados correctamente

---

## Commits Sugeridos

```bash
git add src/App.vue
git commit -m "feat: estado reactivo básico con ref e interpolación (módulo 02)"
```
