# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 6: Computed Properties y Watchers

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Reemplazar las funciones de cálculo del catálogo y el carrito por `computed` properties. Agregar búsqueda en tiempo real con `watch` y mostrar un resumen de precios reactivo en el carrito.

---

## Contexto

El proyecto tiene un carrito funcional y un catálogo con filtros. En esta práctica:
- `productosFiltrados()` (función) → `productosFiltrados` (computed)
- `totalCarrito()` (función) → `total`, `subtotal`, `iva` (computeds)
- Se agrega búsqueda por texto con `watch`

---

## Archivos que se van a modificar

```
ppw-vue-app/src/
└── App.vue    ← Reemplazar funciones por computed + agregar búsqueda
```

---

## Paso 1: Convertir el filtro a `computed`

En `src/App.vue`, importa `computed` y convierte el filtro de productos:

```typescript
import { ref, reactive, computed, onMounted } from 'vue'
```

Cambia la función `productosFiltrados()` por una computed:

```typescript
// ANTES (función, se ejecuta en cada re-render)
const productosFiltrados = (): Product[] =>
  mostrarSoloDisponibles.value
    ? productos.value.filter(p => p.disponible)
    : productos.value

// DESPUÉS (computed, cacheado hasta que cambien sus deps)
const productosFiltrados = computed<Product[]>(() =>
  mostrarSoloDisponibles.value
    ? productos.value.filter(p => p.disponible)
    : productos.value
)
```

**¿Qué cambia en el template?**  
Solo se quitan los paréntesis en el uso de la computed (no es una función):

```html
<!-- ANTES -->
<ProductCard v-for="producto in productosFiltrados()" :key="producto.id" .../>

<!-- DESPUÉS -->
<ProductCard v-for="producto in productosFiltrados" :key="producto.id" .../>
```

También actualiza el contador:

```html
<!-- ANTES -->
<span>{{ productosFiltrados().length }} resultado(s)</span>

<!-- DESPUÉS -->
<span>{{ productosFiltrados.length }} resultado(s)</span>
```

---

## Paso 2: Agregar búsqueda por texto con `computed`

Agrega la variable de búsqueda y actualiza el computed para combinar filtros:

```typescript
const busqueda = ref<string>('')

const productosFiltrados = computed<Product[]>(() => {
  let resultado = mostrarSoloDisponibles.value
    ? productos.value.filter(p => p.disponible)
    : productos.value

  const termino = busqueda.value.toLowerCase().trim()
  if (termino) {
    resultado = resultado.filter(p =>
      p.titulo.toLowerCase().includes(termino) ||
      p.descripcion.toLowerCase().includes(termino)
    )
  }

  return resultado
})
```

Agrega el campo de búsqueda en el template, dentro de la sección de filtros:

```html
<div class="filtros">
  <input
    v-model="busqueda"
    type="search"
    placeholder="Buscar producto..."
    class="input-busqueda"
  />
  <label class="filtro-label">
    <input type="checkbox" v-model="mostrarSoloDisponibles" />
    Solo disponibles
  </label>
  <span class="filtro-contador">
    {{ productosFiltrados.length }} resultado(s)
  </span>
</div>
```

Agrega el estilo:

```css
.input-busqueda {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 220px;
}

.input-busqueda:focus {
  outline: none;
  border-color: #42B883;
}
```

> Captura pendiente: campo de búsqueda activo filtrando el catálogo en tiempo real.

---

## Paso 3: Agregar `watch` para registrar búsquedas

Agrega un watcher que simula el registro de búsquedas (en el módulo 11 esto haría una llamada a la API):

```typescript
import { ref, reactive, computed, watch, onMounted } from 'vue'

// Historial de búsquedas
const historialBusquedas = ref<string[]>([])

watch(busqueda, (termino) => {
  const terminoLimpio = termino.trim()
  if (terminoLimpio && !historialBusquedas.value.includes(terminoLimpio)) {
    historialBusquedas.value.unshift(terminoLimpio)
    if (historialBusquedas.value.length > 5) {
      historialBusquedas.value.pop()
    }
  }
})
```

Muestra el historial en el template (solo si hay búsquedas):

```html
<div class="historial" v-if="historialBusquedas.length > 0">
  <p>Búsquedas recientes:</p>
  <span
    v-for="termino in historialBusquedas"
    :key="termino"
    class="tag-busqueda"
    @click="busqueda = termino"
  >
    {{ termino }}
  </span>
</div>
```

Estilos:

```css
.historial {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.tag-busqueda {
  background: #e8f5ee;
  color: #2d7a57;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  cursor: pointer;
}

.tag-busqueda:hover {
  background: #42B883;
  color: white;
}
```

---

## Paso 4: Resumen del carrito con `computed`

Reemplaza la función `totalCarrito()` por computed properties:

```typescript
// ANTES
const totalCarrito = (): number =>
  carrito.items.reduce((acc, p) => acc + p.precio, 0)

// DESPUÉS: varios computeds separados
const cantidadItems = computed(() => carrito.items.length)

const subtotal = computed(() =>
  carrito.items.reduce((acc, p) => acc + p.precio, 0)
)

const iva = computed(() => subtotal.value * 0.12)

const total = computed(() => subtotal.value + iva.value)
```

Actualiza el template del carrito:

```html
<BaseCard titulo="Carrito de compras">
  <EmptyState
    v-if="cantidadItems === 0"
    mensaje="Agrega productos al carrito."
    icono="🛒"
  />

  <template v-else>
    <ul class="lista-carrito">
      <li v-for="item in carrito.items" :key="item.id" class="item-carrito">
        <span class="item-nombre">{{ item.titulo }}</span>
        <span class="item-precio">${{ item.precio.toFixed(2) }}</span>
        <button class="btn-quitar" @click="quitarDelCarrito(item.id)">✕</button>
      </li>
    </ul>

    <div class="resumen-precios">
      <div class="linea-precio">
        <span>Subtotal ({{ cantidadItems }} items)</span>
        <span>${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="linea-precio">
        <span>IVA (12%)</span>
        <span>${{ iva.toFixed(2) }}</span>
      </div>
      <div class="linea-precio total-final">
        <strong>Total</strong>
        <strong>${{ total.toFixed(2) }}</strong>
      </div>
    </div>
  </template>
</BaseCard>
```

Estilos del resumen:

```css
.resumen-precios {
  border-top: 1px solid #eee;
  margin-top: 1rem;
  padding-top: 0.75rem;
}

.linea-precio {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.9rem;
  color: #555;
}

.total-final {
  border-top: 1px solid #ddd;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  font-size: 1rem;
  color: #35495E;
}
```

> Captura pendiente: panel de carrito mostrando subtotal, IVA y total calculados automáticamente.

---

## Validaciones Esperadas

- [ ] El campo de búsqueda filtra productos en tiempo real sin paréntesis en el template
- [ ] El filtro de disponibles y la búsqueda funcionan combinados
- [ ] El historial de búsquedas aparece y permite reutilizar términos
- [ ] El carrito muestra subtotal, IVA (12%) y total calculados con `computed`
- [ ] Al agregar/quitar items, los cálculos del carrito se actualizan automáticamente
- [ ] Sin errores TypeScript

---

## Entregables

`src/App.vue` con:
1. `productosFiltrados` como `computed` (no función)
2. `busqueda` con `watch` para historial
3. `cantidadItems`, `subtotal`, `iva`, `total` como `computed`

---

## Commits Sugeridos

```bash
git add src/App.vue
git commit -m "feat: computed para filtros y totales, watch para historial (módulo 06)"
```
