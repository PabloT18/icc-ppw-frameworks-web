# Programacion y Plataformas Web

# JavaScript para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="80" alt="JavaScript Logo">
</div>

## Practica 9: Modulos ES6 y Estructura de Proyecto

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introduccion

**ES Modules** (ESM) es el sistema de modulos estandar de JavaScript que permite dividir el codigo en archivos independientes y reutilizables. A medida que una aplicacion crece, tener todo el codigo en un solo archivo se vuelve insostenible. Los modulos permiten organizar el codigo con responsabilidades claras, exportar funciones/clases y crear arquitecturas escalables.

Esta practica introduce la organizacion profesional de proyectos JavaScript con multiples archivos, patrones de arquitectura simples y ES Modules nativos del navegador.

### Por que usar modulos?

| Sin modulos | Con modulos |
|:-:|:-:|
| Todo en un solo archivo de 500+ lineas | Archivos de 50-100 lineas enfocados |
| Variables globales que colisionan | Cada modulo tiene su propio scope |
| Dificil encontrar funciones | Estructura de carpetas clara |
| Imposible reutilizar entre proyectos | import/export explicito |
| Orden de `<script>` importa | Dependencias declaradas |
| Sin separacion de responsabilidades | Cada modulo una responsabilidad |

---

## 2. Conceptos Clave

### Que es un modulo?

Un modulo es un archivo JavaScript que:
- Tiene su propio **scope** (no contamina el scope global)
- Puede **exportar** funciones, objetos o valores para otros modulos
- Puede **importar** exportaciones de otros modulos
- Se ejecuta **una sola vez** (aunque se importe multiples veces)
- Se ejecuta automaticamente en **modo estricto** (`'use strict'`)

### Script clasico vs ES Module

```html
<!-- Script clasico -->
<script src="app.js"></script>

<!-- ES Module (type="module") -->
<script type="module" src="js/app.js"></script>
```

| Caracteristica | Script clasico | ES Module (`type="module"`) |
|:-:|:-:|:-:|
| Scope | Global (window) | Propio (aislado) |
| Variables globales | Si (var crea en window) | No |
| `use strict` | Manual | Automatico |
| import/export | ❌ No | ✅ Si |
| CORS | No requerido | Requerido (HTTP/HTTPS) |
| Ejecucion | Inmediata (bloquea) | Diferida (como defer) |
| Se ejecuta multiples veces | ✅ Si | ❌ No (solo una vez) |

### Tipos de exportaciones

| Tipo | Sintaxis | Cantidad por archivo | Uso tipico |
|:-:|:-:|:-:|:-:|
| **Named export** | `export function fn(){}` | Multiples | Funciones de utilidad |
| **Default export** | `export default obj` | 1 | Objeto principal del modulo |
| **Re-export** | `export { a } from './otro.js'` | Multiples | Barrel files (index.js) |

### Requisito: Servidor local

**IMPORTANTE:** Los modulos requieren protocolo HTTP/HTTPS (no `file://`). Se necesita un servidor local:

```bash
# Opcion 1: Extension de VS Code "Live Server"
# Instalar extension y click en "Go Live"

# Opcion 2: Python
python3 -m http.server 8080

# Opcion 3: Node.js (npx)
npx serve
```

---

## 3. Explicacion Tecnica Detallada

### export - Exportar desde un modulo

**Named exports** (exportaciones con nombre) - Multiples por archivo:

```javascript
// --- utils/format.js ---

// Exportar directamente en la declaracion
export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-EC');
}

export function formatearPrecio(valor) {
  return `$${Number(valor).toFixed(2)}`;
}

export const IVA = 0.15;

// O exportar al final del archivo
function calcularIVA(subtotal) {
  return subtotal * IVA;
}

function calcularTotal(subtotal) {
  return subtotal + calcularIVA(subtotal);
}

export { calcularIVA, calcularTotal };
```

**Default export** (exportacion por defecto) - Solo UNO por archivo:

```javascript
// --- services/storage.js ---

const StorageService = {
  getAll(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  save(key, data) {
    const items = this.getAll(key);
    const newItem = { id: Date.now(), ...data };
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    return newItem;
  },

  delete(key, id) {
    const items = this.getAll(key).filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(items));
  }
};

export default StorageService;
```

### import - Importar desde otro modulo

**Importar named exports:**

```javascript
// --- app.js ---

// Named imports (deben coincidir con el nombre exportado)
import { formatearFecha, formatearPrecio, IVA } from './utils/format.js';

console.log(formatearPrecio(100)); // $100.00
console.log(IVA); // 0.15

// NOTA: La extension .js es OBLIGATORIA en el navegador
// import { formatearFecha } from './utils/format';  ❌ ERROR
// import { formatearFecha } from './utils/format.js';  ✅ CORRECTO
```

**Importar default export:**

```javascript
// Default import (puede tener cualquier nombre)
import StorageService from './services/storage.js';

// Tambien se puede renombrar
import Storage from './services/storage.js';

// Ambos funcionan porque es un default export
```

**Renombrar imports:**

```javascript
// Renombrar para evitar conflictos
import { formatearFecha as fmtFecha } from './utils/format.js';
import { formatearFecha as formatDate } from './utils/format-en.js';

console.log(fmtFecha(new Date())); // '25 de diciembre de 2024'
console.log(formatDate(new Date())); // 'December 25, 2024'
```

**Importar todo como namespace:**

```javascript
// Importar todas las exportaciones como un objeto
import * as Utils from './utils/format.js';

console.log(Utils.formatearPrecio(100)); // $100.00
console.log(Utils.IVA); // 0.15
console.log(Utils.calcularIVA(100)); // 15
```

**Combinar default y named:**

```javascript
// Importar default y named juntos
import StorageService, { STORAGE_KEY } from './services/storage.js';

// En storage.js tendriamos:
// export const STORAGE_KEY = 'app_data';
// export default StorageService;
```

### Re-exports (Barrel Files)

Un **barrel file** (archivo barril) es un `index.js` que re-exporta multiples modulos desde un solo lugar.

```javascript
// --- components/index.js ---
// Centralizar exports de la carpeta components

export { ProductCard } from './ProductCard.js';
export { StatCard } from './StatCard.js';
export { Modal } from './Modal.js';
export { MensajeVacio } from './MensajeVacio.js';
```

**Ventaja:** Importar desde un solo lugar:

```javascript
// SIN barrel file
import { ProductCard } from './components/ProductCard.js';
import { StatCard } from './components/StatCard.js';
import { Modal } from './components/Modal.js';
import { MensajeVacio } from './components/MensajeVacio.js';

// CON barrel file
import { ProductCard, StatCard, Modal, MensajeVacio } from './components/index.js';
```

### Rutas relativas en imports

```javascript
// Desde js/app.js importar js/utils/format.js
import { capitalize } from './utils/format.js';

// Desde js/components/ProductCard.js importar js/utils/format.js
import { capitalize } from '../utils/format.js';

// Desde js/components/ProductCard.js importar js/config.js
import { CONFIG } from '../config.js';
```

**Reglas de rutas:**
- `./` - Mismo directorio
- `../` - Directorio padre
- La extension `.js` es **OBLIGATORIA** en el navegador (a diferencia de Node.js)

---

## 4. Ejemplos de Codigo

### Estructura de proyecto recomendada

```
proyecto/
  index.html
  css/
    styles.css
  js/
    app.js              ← Punto de entrada principal
    config.js           ← Constantes y configuracion
    services/
      storage.js        ← localStorage CRUD
    components/
      ProductCard.js    ← Componente Card
      StatCard.js       ← Componente Stats
      Modal.js          ← Componente Modal
      MensajeVacio.js   ← Componente Mensaje Vacio
      index.js          ← Barrel file (re-exports)
    utils/
      format.js         ← Funciones de formato
      validate.js       ← Funciones de validacion
      dom.js            ← Helpers de DOM
      index.js          ← Barrel file (re-exports)
```

### Ejemplo: Modulo de utilidades

```javascript
// --- utils/format.js ---
'use strict';

export function formatearPrecio(valor) {
  return `$${Number(valor).toFixed(2)}`;
}

export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function capitalize(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

export function truncate(texto, max = 100) {
  if (!texto || texto.length <= max) return texto;
  return texto.slice(0, max) + '...';
}
```

### Ejemplo: Servicio de Storage

```javascript
// --- services/storage.js ---
'use strict';

const StorageService = {
  getAll(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return [];
    }
  },

  save(key, data) {
    const items = this.getAll(key);
    const newItem = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    this._setAll(key, items);
    return newItem;
  },

  delete(key, id) {
    const items = this.getAll(key).filter(item => item.id !== id);
    this._setAll(key, items);
    return true;
  },

  _setAll(key, items) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }
};

export default StorageService;
```

### Ejemplo: Componente reutilizable

```javascript
// --- components/ProductCard.js ---
'use strict';

import { formatearPrecio, formatearCategoria } from '../utils/index.js';
import { CONFIG } from '../config.js';

export function ProductCard(producto, onEdit, onDelete, onView) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const title = document.createElement('h3');
  title.textContent = producto.nombre;

  const category = document.createElement('span');
  category.className = 'product-card__category';
  category.textContent = formatearCategoria(producto.categoria);

  const price = document.createElement('div');
  price.className = 'product-card__price';
  price.textContent = formatearPrecio(producto.precio);

  // ... mas elementos ...

  card.appendChild(title);
  card.appendChild(category);
  card.appendChild(price);

  return card;
}
```

---

## 5. Comparaciones / Tablas

### Tipos de export

| Tipo | Sintaxis export | Sintaxis import | Cantidad |
|------|:-:|:-:|:-:|
| Named | `export function fn(){}` | `import { fn } from './m.js'` | Multiples |
| Named (final) | `export { a, b }` | `import { a, b } from './m.js'` | Multiples |
| Default | `export default obj` | `import obj from './m.js'` | 1 por archivo |
| Renombrado | `export { a as b }` | `import { b } from './m.js'` | Multiples |
| Namespace | - | `import * as M from './m.js'` | Todo |
| Re-export | `export { a } from './otro.js'` | - | Barrel pattern |

### Estructura plana vs organizada

| Estructura plana | Estructura organizada |
|:-:|:-:|
| `app.js` (500 lineas) | `app.js` (30 lineas, solo imports e init) |
| Variables globales | Modulos aislados |
| Buscar funciones con Ctrl+F | Cada archivo tiene un rol claro |
| Dificil de testear | Facil de testear por modulo |
| Un desarrollador a la vez | Multiples desarrolladores en paralelo |

### Organizacion por responsabilidad

| Carpeta | Responsabilidad | Ejemplo |
|---------|:-:|:-:|
| `components/` | UI: generar HTMLElement | ProductCard.js, Modal.js |
| `services/` | Datos: API, Storage | storage.js |
| `utils/` | Funciones puras reutilizables | format.js, validate.js |
| `config.js` | Constantes de configuracion | CONFIG, MENSAJES |

---

## 6. Funcionalidades Complementarias

### Archivo de configuracion

```javascript
// --- config.js ---
'use strict';

export const CONFIG = {
  STORAGE_KEY: 'productos',
  MIN_STOCK: 10,
  DEBOUNCE_MS: 300,
  CATEGORIAS: {
    electronica: 'Electrónica',
    ropa: 'Ropa',
    alimentos: 'Alimentos',
    hogar: 'Hogar'
  }
};

export const MENSAJES = {
  EXITO: 'Producto guardado correctamente',
  ERROR: 'Ocurrió un error al guardar',
  SIN_PRODUCTOS: 'No hay productos registrados',
  SIN_RESULTADOS: 'No se encontraron resultados'
};
```

### Dynamic imports (carga bajo demanda)

```javascript
// Cargar modulo solo cuando se necesita
document.querySelector('#btn-grafico').addEventListener('click', async () => {
  const { renderizarGrafico } = await import('./components/Grafico.js');
  renderizarGrafico(datos);
});
```

---

## 7. Parte Practica (Implementacion)

### Paso 1: Crear estructura de carpetas y archivos

Crear la siguiente estructura de proyecto:

```
practica-09-tu-apellido/
  index.html
  css/
    styles.css
  js/
    app.js
    config.js
    services/
      storage.js
    components/
      ProductCard.js
      StatCard.js
      Modal.js
      MensajeVacio.js
      index.js
    utils/
      format.js
      validate.js
      dom.js
      index.js
```

### Paso 2: Copiar HTML base

Copiar el siguiente codigo en `index.html`:

#### ¿Que hace este codigo?

Crea la estructura HTML con `<script type="module">` para habilitar ES Modules, formulario de productos, filtros, contenedores para estadisticas y cards.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestión de Productos - ES Modules</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>📦 Gestión de Productos</h1>
      <p>Practica de ES Modules y Arquitectura</p>
    </header>

    <section class="form-section">
      <h2>Agregar Producto</h2>
      <form id="form-producto" novalidate>
        <div class="form-group">
          <label for="nombre">Nombre del Producto:</label>
          <input type="text" id="nombre" required>
          <div class="error-mensaje"></div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="categoria">Categoría:</label>
            <select id="categoria" required>
              <option value="">Seleccionar...</option>
              <option value="electronica">Electrónica</option>
              <option value="ropa">Ropa</option>
              <option value="alimentos">Alimentos</option>
              <option value="hogar">Hogar</option>
              <option value="deportes">Deportes</option>
            </select>
            <div class="error-mensaje"></div>
          </div>

          <div class="form-group">
            <label for="precio">Precio ($):</label>
            <input type="number" id="precio" step="0.01" min="0" required>
            <div class="error-mensaje"></div>
          </div>

          <div class="form-group">
            <label for="stock">Stock:</label>
            <input type="number" id="stock" min="0" required>
            <div class="error-mensaje"></div>
          </div>
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción (opcional):</label>
          <textarea id="descripcion" rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Guardar Producto</button>
          <button type="button" id="btn-cancelar" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </section>

    <section class="filters-section">
      <div class="filter-bar">
        <div class="filter-group">
          <input type="search" id="search" placeholder="Buscar productos...">
        </div>

        <div class="filter-group">
          <select id="filter-categoria">
            <option value="">Todas las categorías</option>
            <option value="electronica">Electrónica</option>
            <option value="ropa">Ropa</option>
            <option value="alimentos">Alimentos</option>
            <option value="hogar">Hogar</option>
            <option value="deportes">Deportes</option>
          </select>
        </div>

        <div class="filter-group">
          <select id="filter-stock">
            <option value="">Todos los stocks</option>
            <option value="disponible">Disponible</option>
            <option value="bajo">Stock Bajo</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>

        <div class="filter-group">
          <select id="sort-by">
            <option value="nombre">Ordenar por Nombre</option>
            <option value="precio">Ordenar por Precio</option>
            <option value="stock">Ordenar por Stock</option>
            <option value="fecha">Ordenar por Fecha</option>
          </select>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div id="stats-container" class="stats-container">
        <!-- StatCards se renderizarán aquí -->
      </div>
    </section>

    <section class="products-section">
      <div id="products-container" class="products-container">
        <!-- ProductCards se renderizarán aquí -->
      </div>
    </section>
  </div>

  <div id="modal-detalle" class="modal-container">
    <!-- Modal se renderizará aquí -->
  </div>

  <script type="module" src="js/app.js"></script>
</body>
</html>
```

### Paso 3: Copiar CSS base

Copiar el archivo CSS completo en `css/styles.css`.

> **Nota:** Por brevedad, el CSS completo se encuentra en la carpeta `solver/09-modulos-estructura/css/styles.css`. Copiarlo completo.

### Paso 4: Crear config.js (copiar y completar)

Crear `js/config.js` con las constantes de configuracion:

#### ¿Que hace este codigo?

Define constantes centralizadas para la aplicacion: clave de localStorage, umbrales de stock, categorias y mensajes. Esto evita valores magicos en el codigo.

```javascript
'use strict';

// TODO 4.1: Exportar el objeto CONFIG
// Debe contener: STORAGE_KEY, MIN_STOCK, DEBOUNCE_MS, CATEGORIAS
export const CONFIG = {
  STORAGE_KEY: 'productos',
  MIN_STOCK: 10,
  DEBOUNCE_MS: 300,
  CATEGORIAS: {
    electronica: 'Electrónica',
    ropa: 'Ropa',
    alimentos: 'Alimentos',
    hogar: 'Hogar',
    deportes: 'Deportes'
  }
};

// TODO 4.2: Exportar el objeto MENSAJES
// Debe contener: EXITO, ERROR, SIN_PRODUCTOS, SIN_RESULTADOS
export const MENSAJES = {
  EXITO: 'Producto guardado correctamente',
  ERROR: 'Ocurrió un error al guardar',
  SIN_PRODUCTOS: 'No hay productos registrados',
  SIN_RESULTADOS: 'No se encontraron resultados'
};
```

### Paso 5: Crear services/storage.js (copiar y completar)

Crear `js/services/storage.js` con el servicio de localStorage:

#### ¿Que hace este codigo?

Servicio generico para operaciones CRUD en localStorage. Recibe una clave y ejecuta operaciones de getAll, getById, save, update, delete. Auto-genera IDs y timestamps.

```javascript
'use strict';

const StorageService = {
  // TODO 5.1: Implementar getAll(key)
  // Debe retornar array parseado desde localStorage o array vacio
  getAll(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return [];
    }
  },

  // TODO 5.2: Implementar getById(key, id)
  // Debe buscar y retornar el item con el id, o null si no existe
  getById(key, id) {
    const items = this.getAll(key);
    return items.find(item => item.id === id) || null;
  },

  // TODO 5.3: Implementar save(key, data)
  // Debe crear un nuevo item con id auto-generado y createdAt
  save(key, data) {
    const items = this.getAll(key);
    const newItem = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    this._setAll(key, items);
    return newItem;
  },

  // TODO 5.4: Implementar update(key, id, data)
  // Debe actualizar item existente y agregar updatedAt
  update(key, id, data) {
    const items = this.getAll(key);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this._setAll(key, items);
    return items[index];
  },

  // TODO 5.5: Implementar delete(key, id)
  // Debe eliminar el item con el id dado
  delete(key, id) {
    const items = this.getAll(key).filter(item => item.id !== id);
    this._setAll(key, items);
    return true;
  },

  _setAll(key, items) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }
};

// TODO 5.6: Exportar StorageService como default
export default StorageService;
```

### Paso 6: Crear utils/format.js (copiar y completar)

Crear `js/utils/format.js`:

#### ¿Que hace este codigo?

Funciones puras de formato para transformar valores en strings formateados: precios, fechas, capitalizacion, truncado. Son reutilizables en toda la aplicacion.

```javascript
'use strict';

// TODO 6.1: Exportar formatearPrecio(valor)
// Debe retornar string con formato $XX.XX
export function formatearPrecio(valor) {
  return `$${Number(valor).toFixed(2)}`;
}

// TODO 6.2: Exportar formatearFecha(fecha)
// Debe retornar fecha en formato largo en español
export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// TODO 6.3: Exportar capitalize(texto)
// Debe capitalizar primera letra y convertir resto a minusculas
export function capitalize(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// TODO 6.4: Exportar truncate(texto, max)
// Debe truncar texto si excede max caracteres y agregar '...'
export function truncate(texto, max = 100) {
  if (!texto || texto.length <= max) return texto;
  return texto.slice(0, max) + '...';
}

// TODO 6.5: Exportar formatearCategoria(categoria)
// Debe retornar nombre formateado de categoria desde CONFIG
export function formatearCategoria(categoria) {
  const categorias = {
    electronica: 'Electrónica',
    ropa: 'Ropa',
    alimentos: 'Alimentos',
    hogar: 'Hogar',
    deportes: 'Deportes'
  };
  return categorias[categoria] || capitalize(categoria);
}
```

### Paso 7: Crear utils/validate.js (copiar y completar)

Crear `js/utils/validate.js`:

#### ¿Que hace este codigo?

Funciones de validacion que retornan objetos `{valido, error}`. Validan campos individuales y productos completos. Separan la logica de validacion del DOM.

```javascript
'use strict';

// TODO 7.1: Exportar validarRequerido(valor)
export function validarRequerido(valor) {
  return valor !== null && valor !== undefined && String(valor).trim() !== '';
}

// TODO 7.2: Exportar validarNumeroPositivo(valor)
export function validarNumeroPositivo(valor) {
  const num = Number(valor);
  return !isNaN(num) && num >= 0;
}

// TODO 7.3: Exportar validarPrecio(precio)
// Debe retornar {valido, error}
export function validarPrecio(precio) {
  if (!validarRequerido(precio)) {
    return { valido: false, error: 'El precio es obligatorio' };
  }

  if (!validarNumeroPositivo(precio)) {
    return { valido: false, error: 'El precio debe ser un número positivo' };
  }

  const num = Number(precio);
  if (num === 0) {
    return { valido: false, error: 'El precio debe ser mayor a 0' };
  }

  return { valido: true, error: '' };
}

// TODO 7.4: Exportar validarStock(stock)
// Debe retornar {valido, error}
export function validarStock(stock) {
  if (!validarRequerido(stock)) {
    return { valido: false, error: 'El stock es obligatorio' };
  }

  if (!validarNumeroPositivo(stock)) {
    return { valido: false, error: 'El stock debe ser un número positivo o cero' };
  }

  return { valido: true, error: '' };
}

// TODO 7.5: Exportar validarProducto(producto)
// Debe validar todos los campos y retornar {valido, errores}
export function validarProducto(producto) {
  const errores = {};

  if (!validarRequerido(producto.nombre)) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (producto.nombre.length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!validarRequerido(producto.categoria)) {
    errores.categoria = 'La categoría es obligatoria';
  }

  const validacionPrecio = validarPrecio(producto.precio);
  if (!validacionPrecio.valido) {
    errores.precio = validacionPrecio.error;
  }

  const validacionStock = validarStock(producto.stock);
  if (!validacionStock.valido) {
    errores.stock = validacionStock.error;
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
}
```

### Paso 8: Crear barrel files (copiar)

Crear `js/utils/index.js`:

#### ¿Que hace este codigo?

Barrel file que re-exporta todas las utilidades desde un solo archivo. Permite importar multiples funciones con un solo import statement.

```javascript
'use strict';

// Re-exports de format.js
export {
  formatearPrecio,
  formatearFecha,
  capitalize,
  truncate,
  formatearCategoria
} from './format.js';

// Re-exports de validate.js
export {
  validarRequerido,
  validarNumeroPositivo,
  validarPrecio,
  validarStock,
  validarProducto
} from './validate.js';
```

Crear `js/components/index.js`:

```javascript
'use strict';

// TODO 8.1: Re-exportar ProductCard desde ./ProductCard.js
export { ProductCard } from './ProductCard.js';

// TODO 8.2: Re-exportar StatCard desde ./StatCard.js
export { StatCard } from './StatCard.js';

// TODO 8.3: Re-exportar Modal desde ./Modal.js
export { Modal } from './Modal.js';

// TODO 8.4: Re-exportar MensajeVacio desde ./MensajeVacio.js
export { MensajeVacio } from './MensajeVacio.js';
```

### Paso 9: Crear componentes (copiar y completar)

Crear `js/components/StatCard.js`:

#### ¿Que hace este codigo?

Componente que crea un HTMLElement de tarjeta de estadistica. Recibe label, valor y variant. Usa solo createElement (NO innerHTML).

```javascript
'use strict';

// TODO 9.1: Exportar la función StatCard(label, value, variant)
// Debe crear un div.stat-card usando createElement
// Debe tener dos hijos: .stat-value y .stat-label
// Debe agregar clase variant si se proporciona
export function StatCard(label, value, variant = 'primary') {
  const card = document.createElement('div');
  card.className = `stat-card ${variant !== 'primary' ? `stat-card--${variant}` : ''}`;

  const valueDiv = document.createElement('div');
  valueDiv.className = 'stat-value';
  valueDiv.textContent = String(value);

  const labelDiv = document.createElement('div');
  labelDiv.className = 'stat-label';
  labelDiv.textContent = label;

  card.appendChild(valueDiv);
  card.appendChild(labelDiv);

  return card;
}
```

Crear `js/components/MensajeVacio.js`:

```javascript
'use strict';

// TODO 9.2: Exportar la función MensajeVacio(mensaje)
// Debe crear un div.mensaje-vacio con icono y texto
export function MensajeVacio(mensaje) {
  const container = document.createElement('div');
  container.className = 'mensaje-vacio';

  const icon = document.createElement('div');
  icon.className = 'mensaje-vacio__icon';
  icon.textContent = '📦';

  const text = document.createElement('p');
  text.textContent = mensaje;

  container.appendChild(icon);
  container.appendChild(text);

  return container;
}
```

> **Nota:** Los componentes `ProductCard.js` y `Modal.js` son mas complejos. Ver implementacion completa en `solver/09-modulos-estructura/js/components/`.

### Paso 10: Crear app.js (copiar y completar)

Crear `js/app.js`:

#### ¿Que hace este codigo?

Punto de entrada principal. Importa todos los modulos necesarios, coordina la logica de la aplicacion, conecta eventos y renderiza la UI.

```javascript
'use strict';

// TODO 10.1: Importar CONFIG y MENSAJES desde ./config.js
import { CONFIG, MENSAJES } from './config.js';

// TODO 10.2: Importar StorageService desde ./services/storage.js
import StorageService from './services/storage.js';

// TODO 10.3: Importar componentes desde ./components/index.js
import { ProductCard, StatCard, Modal, MensajeVacio } from './components/index.js';

// TODO 10.4: Importar utilidades desde ./utils/index.js
import { validarProducto } from './utils/index.js';

// Estado de la aplicacion
let productos = [];
let productoEditando = null;

// Seleccion de elementos del DOM
const formProducto = document.getElementById('form-producto');
const inputNombre = document.getElementById('nombre');
const inputCategoria = document.getElementById('categoria');
const inputPrecio = document.getElementById('precio');
const inputStock = document.getElementById('stock');
const inputDescripcion = document.getElementById('descripcion');

const statsContainer = document.getElementById('stats-container');
const productsContainer = document.getElementById('products-container');

// TODO 10.5: Implementar cargarProductos()
function cargarProductos() {
  productos = StorageService.getAll(CONFIG.STORAGE_KEY);
  renderizarTodo();
}

// TODO 10.6: Implementar renderizarEstadisticas()
function renderizarEstadisticas() {
  statsContainer.innerHTML = '';

  const total = productos.length;
  const disponibles = productos.filter(p => p.stock > 0).length;
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock < CONFIG.MIN_STOCK).length;
  const agotados = productos.filter(p => p.stock === 0).length;

  const stats = [
    StatCard('Total Productos', total, 'primary'),
    StatCard('Disponibles', disponibles, 'success'),
    StatCard('Stock Bajo', stockBajo, 'warning'),
    StatCard('Agotados', agotados, 'danger')
  ];

  stats.forEach(stat => statsContainer.appendChild(stat));
}

// TODO 10.7: Implementar renderizarProductos()
function renderizarProductos() {
  productsContainer.innerHTML = '';

  if (productos.length === 0) {
    const mensajeVacio = MensajeVacio(MENSAJES.SIN_PRODUCTOS);
    productsContainer.appendChild(mensajeVacio);
    return;
  }

  productos.forEach(producto => {
    const card = ProductCard(
      producto,
      editarProducto,
      eliminarProducto,
      verDetalleProducto
    );
    productsContainer.appendChild(card);
  });
}

// TODO 10.8: Implementar renderizarTodo()
function renderizarTodo() {
  renderizarEstadisticas();
  renderizarProductos();
}

// TODO 10.9: Event listener para submit del formulario
formProducto.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    precio: parseFloat(inputPrecio.value),
    stock: parseInt(inputStock.value, 10),
    descripcion: inputDescripcion.value.trim()
  };

  const validacion = validarProducto(data);

  if (!validacion.valido) {
    // Mostrar errores
    console.error('Errores de validación:', validacion.errores);
    return;
  }

  // Guardar producto
  if (productoEditando) {
    StorageService.update(CONFIG.STORAGE_KEY, productoEditando.id, data);
    productoEditando = null;
  } else {
    StorageService.save(CONFIG.STORAGE_KEY, data);
  }

  cargarProductos();
  formProducto.reset();
});

// TODO 10.10: Inicialización en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  inputNombre.focus();
});
```

---

## 8. Resultados y Evidencias

### Capturas requeridas

1. **Estructura de archivos** - Screenshot del arbol de carpetas del proyecto mostrando todos los archivos .js organizados
2. **app.js con imports** - Screenshot del archivo app.js mostrando los import statements
3. **Componente exportado** - Screenshot de un componente (ej: ProductCard.js) con export
4. **Servicio exportado** - Screenshot de storage.js con export default
5. **Barrel file** - Screenshot de utils/index.js o components/index.js con re-exports
6. **Aplicacion funcionando** - Screenshot de la aplicacion con productos renderizados
7. **DevTools Network** - Screenshot de la pestaña Network mostrando los archivos .js cargados como modulos
8. **Consola sin errores** - Screenshot de la consola del navegador sin errores

### Formato del Archivo de Evidencias

Crear un archivo `EVIDENCIAS.md` con las capturas:

```markdown
# Evidencias - Practica 9: ES Modules

## 1. Estructura de archivos
![Estructura](assets/01-estructura.png)
**Descripcion:** Proyecto con 12 archivos .js organizados en carpetas services/, components/ y utils/

## 2. app.js con imports
![App](assets/02-app-imports.png)
**Descripcion:** app.js importa desde config.js, services/storage.js, components/index.js y utils/index.js

## 3. Componente ProductCard
![ProductCard](assets/03-component.png)
**Descripcion:** Componente exportado con export function, usa createElement y retorna HTMLElement

...
```

---

## 9. Entregables

### Archivos requeridos

- ✅ Repositorio GitHub con el codigo completo
- ✅ Minimo 8 archivos `.js` separados (config, storage, 4 components, 3 utils, app)
- ✅ Uso de `export` / `import` en todos los archivos
- ✅ `index.html` con `<script type="module">`
- ✅ Al menos un barrel file (`utils/index.js` y `components/index.js`)
- ✅ Uso de createElement (NO innerHTML con datos dinamicos)
- ✅ Carpeta `assets/` con capturas de pantalla
- ✅ Archivo `EVIDENCIAS.md` completado
- ✅ `README.md` con instrucciones de ejecucion

### Estructura final del entregable

```
practica-09-tu-apellido/
  README.md
  EVIDENCIAS.md
  index.html
  css/
    styles.css
  js/
    app.js
    config.js
    services/
      storage.js
    components/
      ProductCard.js
      StatCard.js
      Modal.js
      MensajeVacio.js
      index.js
    utils/
      format.js
      validate.js
      index.js
  assets/
    01-estructura.png
    02-app-imports.png
    03-component.png
    04-storage.png
    05-barrel.png
    06-funcionando.png
    07-network.png
    08-consola.png
```

---

## Reglas Importantes

- ❌ No usar frameworks ni bundlers (Webpack, Vite, etc.)
- ✅ Solo ES Modules nativos del navegador
- ✅ `<script type="module" src="js/app.js">` obligatorio en HTML
- ✅ Cada archivo debe tener una sola responsabilidad
- ✅ La extension `.js` es obligatoria en los imports
- ✅ No usar variables globales entre modulos (solo import/export)
- ✅ Ejecutar con Live Server o servidor local (no `file://`)
- ✅ Usar `createElement` en componentes (NO innerHTML con datos dinamicos)
- ✅ Cada componente debe retornar un HTMLElement

---

## Notas de Implementacion

### Conceptos importantes

- `type="module"` activa `strict mode` automaticamente
- Los modulos se ejecutan una sola vez, incluso si se importan en multiples archivos
- Las rutas de import deben ser relativas (`./`, `../`) en el navegador
- La extension `.js` es **obligatoria** en imports del navegador (diferente a Node.js)
- `import()` dinamico retorna una promesa (util para carga bajo demanda)
- Los modulos se cargan con CORS, necesitan servidor web (no `file://`)

### Patrones de diseño

- **Barrel files:** Centralizar exports en `index.js`
- **Component pattern:** Funciones que retornan HTMLElement
- **Service layer:** Separar logica de datos del DOM
- **Separation of concerns:** Cada modulo una responsabilidad clara

### Seguridad

**⚠️ createElement vs innerHTML:**

```javascript
// ❌ INSEGURO con datos dinamicos (XSS vulnerability)
container.innerHTML = `<div>${producto.nombre}</div>`;

// ✅ SEGURO - usar createElement
const div = document.createElement('div');
div.textContent = producto.nombre; // auto-escapa caracteres especiales
container.appendChild(div);
```

---

## Referencias

- [MDN - JavaScript Modules](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules)
- [MDN - import statement](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/import)
- [MDN - export statement](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/export)
- [JavaScript.info - Modules](https://javascript.info/modules)

---

## Preguntas Frecuentes

**Q:** ¿Por que no funciona `import { fn } from './utils'` sin `.js`?  
**A:** En el navegador la extension `.js` es obligatoria. Node.js permite omitirla pero el navegador no.

**Q:** ¿Por que necesito un servidor local?  
**A:** Los modulos requieren protocolo HTTP/HTTPS por politicas CORS. El navegador bloquea `file://`.

**Q:** ¿Puedo usar `innerHTML` con datos dinamicos?  
**A:** NO. Es una vulnerabilidad XSS. Siempre usar `createElement` + `textContent` para datos dinamicos.

**Q:** ¿Cual es la diferencia entre named export y default export?  
**A:** Named exports permiten multiples exportaciones por archivo con nombres especificos. Default export solo permite una exportacion por archivo y puede renombrarse al importar.

---
