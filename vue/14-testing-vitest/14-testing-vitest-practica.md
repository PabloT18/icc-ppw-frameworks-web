# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Práctica 14: Testing con Vitest

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo

Configurar Vitest en el proyecto `ppw-vue-app` y escribir tests unitarios para utilidades, composables, stores y un componente. Al finalizar, el proyecto tendrá una suite de tests básica que se puede ejecutar con `pnpm test`.

---

## Contexto

El testing se agrega como una capa transversal al proyecto existente. No se modifica la funcionalidad; se escriben tests que verifican que lo que ya existe funciona correctamente.

---

## Archivos que se van a crear y modificar

```
ppw-vue-app/
├── vite.config.ts              ← Modificar: agregar sección test
├── package.json                ← Modificar: agregar script test
└── src/
    ├── test/
    │   └── setup.ts            ← Crear
    ├── utils/
    │   └── formatters.test.ts  ← Crear
    ├── stores/
    │   └── useCarritoStore.test.ts  ← Crear
    └── components/
        └── ProductCard.test.ts ← Crear
```

---

## Paso 1: Instalar dependencias de testing

```bash
pnpm add -D vitest @vue/test-utils happy-dom
```

---

## Paso 2: Configurar Vitest en `vite.config.ts`

Agrega la sección `test` a `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  }
})
```

---

## Paso 3: Crear el archivo de setup

Crea `src/test/setup.ts`:

```typescript
import { config } from '@vue/test-utils'

// Registrar componentes globales si los hubiera
// config.global.components = { ... }

// Limpiar localStorage antes de cada test
beforeEach(() => {
  localStorage.clear()
})
```

---

## Paso 4: Agregar el script de test a `package.json`

Abre `package.json` y agrega en `scripts`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "coverage": "vitest run --coverage"
  }
}
```

---

## Paso 5: Tests de utilidades

Crea `src/utils/formatters.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { formatPrecio, truncarTexto } from '@/utils/formatters'

describe('formatPrecio', () => {
  it('formatea precio entero con dos decimales', () => {
    expect(formatPrecio(10)).toBe('$10.00')
  })

  it('formatea precio con decimales', () => {
    expect(formatPrecio(109.95)).toBe('$109.95')
  })

  it('redondea a dos decimales', () => {
    expect(formatPrecio(10.999)).toBe('$11.00')
  })

  it('formatea precio en cero', () => {
    expect(formatPrecio(0)).toBe('$0.00')
  })
})

describe('truncarTexto', () => {
  it('no modifica texto más corto que el máximo', () => {
    expect(truncarTexto('texto corto', 50)).toBe('texto corto')
  })

  it('no modifica texto con la misma longitud que el máximo', () => {
    expect(truncarTexto('1234567890', 10)).toBe('1234567890')
  })

  it('trunca texto más largo que el máximo y agrega "..."', () => {
    const resultado = truncarTexto('abcdefghij', 5)
    expect(resultado).toBe('abcde...')
  })
})
```

---

## Paso 6: Tests del store del carrito

Crea `src/stores/useCarritoStore.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCarritoStore } from '@/stores/useCarritoStore'
import type { Product } from '@/types/product'

// Producto de prueba
const producto1: Product = {
  id: 1, title: 'Producto A', price: 15.00,
  description: 'desc', category: 'cat',
  image: 'img.jpg', rating: { rate: 4, count: 50 }
}

const producto2: Product = {
  id: 2, title: 'Producto B', price: 25.50,
  description: 'desc', category: 'cat',
  image: 'img2.jpg', rating: { rate: 3.5, count: 30 }
}

describe('useCarritoStore', () => {
  beforeEach(() => {
    // Crear una Pinia fresca para cada test (sin persistencia)
    setActivePinia(createPinia())
  })

  describe('Estado inicial', () => {
    it('inicia con items vacíos', () => {
      const store = useCarritoStore()
      expect(store.items).toHaveLength(0)
    })

    it('inicia con cantidadItems en 0', () => {
      const store = useCarritoStore()
      expect(store.cantidadItems).toBe(0)
    })

    it('inicia con totalPrecio en 0', () => {
      const store = useCarritoStore()
      expect(store.totalPrecio).toBe(0)
    })
  })

  describe('agregar()', () => {
    it('agrega un producto nuevo al carrito', () => {
      const store = useCarritoStore()
      store.agregar(producto1)
      expect(store.items).toHaveLength(1)
      expect(store.items[0].producto.id).toBe(1)
    })

    it('incrementa la cantidad si el producto ya existe', () => {
      const store = useCarritoStore()
      store.agregar(producto1)
      store.agregar(producto1)
      expect(store.items).toHaveLength(1)
      expect(store.items[0].cantidad).toBe(2)
    })

    it('actualiza cantidadItems correctamente', () => {
      const store = useCarritoStore()
      store.agregar(producto1)
      store.agregar(producto1)
      store.agregar(producto2)
      expect(store.cantidadItems).toBe(3)
    })
  })

  describe('totalPrecio', () => {
    it('calcula el total de un solo producto', () => {
      const store = useCarritoStore()
      store.agregar(producto1)
      expect(store.totalPrecio).toBe(15.00)
    })

    it('calcula el total de múltiples unidades', () => {
      const store = useCarritoStore()
      store.agregar(producto1)
      store.agregar(producto1)
      expect(store.totalPrecio).toBe(30.00)
    })

    it('calcula el total de múltiples productos distintos', () => {
      const store = useCarritoStore()
      store.agregar(producto1)  // 15.00
      store.agregar(producto2)  // 25.50
      expect(store.totalPrecio).toBeCloseTo(40.50)
    })
  })

  describe('limpiar()', () => {
    it('vacía el carrito', () => {
      const store = useCarritoStore()
      store.agregar(producto1)
      store.agregar(producto2)
      store.limpiar()
      expect(store.items).toHaveLength(0)
      expect(store.cantidadItems).toBe(0)
    })
  })
})
```

---

## Paso 7: Tests del componente `ProductCard`

Crea `src/components/ProductCard.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/types/product'

const productoMock: Product = {
  id: 1,
  title: 'Mochila de Prueba',
  price: 49.99,
  description: 'Una mochila muy resistente para pruebas unitarias',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/test.jpg',
  rating: { rate: 4.2, count: 150 }
}

describe('ProductCard', () => {
  it('muestra el título del producto', () => {
    const wrapper = mount(ProductCard, {
      props: { producto: productoMock }
    })
    expect(wrapper.text()).toContain('Mochila de Prueba')
  })

  it('muestra el precio formateado', () => {
    const wrapper = mount(ProductCard, {
      props: { producto: productoMock }
    })
    expect(wrapper.text()).toContain('$49.99')
  })

  it('muestra la calificación del producto', () => {
    const wrapper = mount(ProductCard, {
      props: { producto: productoMock }
    })
    expect(wrapper.text()).toContain('4.2')
  })

  it('la imagen tiene el src correcto', () => {
    const wrapper = mount(ProductCard, {
      props: { producto: productoMock }
    })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(productoMock.image)
  })

  it('la imagen tiene alt descriptivo', () => {
    const wrapper = mount(ProductCard, {
      props: { producto: productoMock }
    })
    const img = wrapper.find('img')
    expect(img.attributes('alt')).toContain(productoMock.title)
  })

  it('emite el evento "agregar" con el producto al hacer click', async () => {
    const wrapper = mount(ProductCard, {
      props: { producto: productoMock }
    })
    await wrapper.find('button').trigger('click')

    const emitido = wrapper.emitted('agregar')
    expect(emitido).toBeTruthy()
    expect(emitido![0]).toEqual([productoMock])
  })
})
```

---

## Paso 8: Ejecutar los tests

```bash
# Modo watch (se re-ejecutan al guardar)
pnpm test

# Ejecutar una sola vez
pnpm test:run
```

---

## Validaciones Esperadas

- [ ] `pnpm test:run` ejecuta sin errores
- [ ] Aparecen 3 suites de tests (formatters, carritoStore, ProductCard)
- [ ] Todos los tests pasan (indicador verde ✓)
- [ ] Si introduces un bug (ej: `formatPrecio(10)` retorna `'€10.00'`), el test falla

---

## Experimento adicional

Introduce intencionalmente un bug en `truncarTexto` para ver cómo Vitest reporta el fallo:

```typescript
// Cambiar temporalmente para ver el fallo
export function truncarTexto(texto: string, max: number): string {
  return texto.slice(0, max)  // Sin '...'
}
```

Observa el mensaje de error de Vitest. Luego vuelve a la implementación correcta.

---

## Entregables

- `vite.config.ts` con configuración de Vitest
- `src/test/setup.ts`
- `src/utils/formatters.test.ts`
- `src/stores/useCarritoStore.test.ts`
- `src/components/ProductCard.test.ts`

---

## Commits Sugeridos

```bash
git add vite.config.ts package.json src/test/
git commit -m "chore: configurar Vitest con happy-dom (módulo 14)"
git add src/utils/formatters.test.ts src/stores/useCarritoStore.test.ts src/components/ProductCard.test.ts
git commit -m "test: tests unitarios para formatters, carritoStore y ProductCard"
```
