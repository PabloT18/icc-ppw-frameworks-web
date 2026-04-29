# Programacion y Plataformas Web
# Vue para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="80" alt="Vue Logo">
</div>

## Módulo 14: Testing con Vitest

### Autor

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Introducción

El testing es la práctica de escribir código que verifica que el código de producción funciona correctamente. En el ecosistema Vue + Vite, el stack de testing estándar es:

- **Vitest**: framework de test nativo de Vite (API compatible con Jest)
- **@vue/test-utils**: librería oficial para montar y probar componentes Vue
- **jsdom** o **happy-dom**: simula el DOM en Node.js

Los tests no solo detectan bugs, también documentan el comportamiento esperado de cada función y componente.

---

## 2. Conceptos Clave

### Tipos de tests

| Tipo | Qué prueba | Velocidad | Costo |
|---|---|---|---|
| **Unitario** | Una función o composable aislado | Muy rápido | Bajo |
| **Componente** | Un componente con props/emits/slots | Rápido | Medio |
| **Integración** | Múltiples unidades juntas | Medio | Medio |
| **E2E** | Flujo completo en el navegador | Lento | Alto |

Para este módulo nos enfocamos en tests **unitarios** y de **componente**.

### Anatomía de un test

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('formatPrecio', () => {        // Grupo de tests
  it('formatea correctamente un precio en USD', () => {  // Test individual
    // Arrange — preparar datos
    const precio = 109.95

    // Act — ejecutar la función
    const resultado = formatPrecio(precio)

    // Assert — verificar el resultado
    expect(resultado).toBe('$109.95')
  })
})
```

### Matchers comunes

```typescript
expect(valor).toBe(esperado)              // Igualdad estricta (===)
expect(valor).toEqual(esperado)           // Igualdad profunda (objetos/arrays)
expect(valor).toBeTruthy()               // Truthy
expect(valor).toBeFalsy()                // Falsy
expect(valor).toContain(elemento)        // Array/string contiene
expect(valor).toHaveLength(n)            // Longitud
expect(fn).toThrow('mensaje')            // Lanza un error
expect(spy).toHaveBeenCalledWith(args)   // Mock fue llamado con args
expect(spy).toHaveBeenCalledTimes(n)     // Mock llamado n veces
```

---

## 3. Explicación Técnica Detallada

### Configuración de Vitest

```typescript
// vite.config.ts — agregar la sección `test`
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  },
  test: {
    environment: 'happy-dom',   // DOM simulado
    globals: true,              // describe/it/expect sin import
    setupFiles: ['./src/test/setup.ts']
  }
})
```

```typescript
// src/test/setup.ts
import { config } from '@vue/test-utils'

// Configuración global de test-utils (ej: componentes globales)
config.global.stubs = {}
```

### Probar funciones puras

```typescript
// src/utils/formatters.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrecio, truncarTexto } from '@/utils/formatters'

describe('formatPrecio', () => {
  it('formatea precios en USD por defecto', () => {
    expect(formatPrecio(10)).toBe('$10.00')
    expect(formatPrecio(109.95)).toBe('$109.95')
  })

  it('maneja precios con muchos decimales redondeando a 2', () => {
    expect(formatPrecio(10.999)).toBe('$11.00')
  })
})

describe('truncarTexto', () => {
  it('no trunca si el texto es más corto que el max', () => {
    expect(truncarTexto('hola', 10)).toBe('hola')
  })

  it('trunca y agrega "..." si supera el max', () => {
    const texto = 'Este es un texto muy largo para probar'
    const resultado = truncarTexto(texto, 20)
    expect(resultado).toHaveLength(23)  // 20 + '...'
    expect(resultado.endsWith('...')).toBe(true)
  })
})
```

### Probar composables

```typescript
// src/composables/useLocalStorage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from '@/composables/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('devuelve el valor por defecto si no hay nada en localStorage', () => {
    const { valor } = useLocalStorage('test-key', 42)
    expect(valor.value).toBe(42)
  })

  it('persiste el valor al cambiarlo', async () => {
    const { valor } = useLocalStorage('test-key', 0)
    valor.value = 99
    // Esperar a que el watch ejecute
    await nextTick()
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe(99)
  })
})
```

### Probar componentes con `@vue/test-utils`

```typescript
// src/components/ProductCard.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/types/product'

const productoMock: Product = {
  id: 1,
  title: 'Producto de prueba',
  price: 29.99,
  description: 'Descripción de prueba para el producto',
  category: 'test',
  image: 'https://example.com/img.jpg',
  rating: { rate: 4.5, count: 100 }
}

describe('ProductCard', () => {
  it('muestra el título del producto', () => {
    const wrapper = mount(ProductCard, { props: { producto: productoMock } })
    expect(wrapper.text()).toContain('Producto de prueba')
  })

  it('muestra el precio formateado', () => {
    const wrapper = mount(ProductCard, { props: { producto: productoMock } })
    expect(wrapper.text()).toContain('$29.99')
  })

  it('emite "agregar" al hacer click en el botón', async () => {
    const wrapper = mount(ProductCard, { props: { producto: productoMock } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('agregar')).toBeTruthy()
    expect(wrapper.emitted('agregar')![0]).toEqual([productoMock])
  })
})
```

### Probar stores de Pinia

```typescript
// src/stores/useCarritoStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCarritoStore } from '@/stores/useCarritoStore'
import type { Product } from '@/types/product'

const productoMock: Product = {
  id: 1, title: 'Test', price: 10, description: '', category: '',
  image: '', rating: { rate: 4, count: 10 }
}

describe('useCarritoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())  // Crear Pinia fresca para cada test
  })

  it('inicia con el carrito vacío', () => {
    const store = useCarritoStore()
    expect(store.items).toHaveLength(0)
    expect(store.cantidadItems).toBe(0)
  })

  it('agrega un producto al carrito', () => {
    const store = useCarritoStore()
    store.agregar(productoMock)
    expect(store.items).toHaveLength(1)
    expect(store.cantidadItems).toBe(1)
  })

  it('incrementa la cantidad si el producto ya está en el carrito', () => {
    const store = useCarritoStore()
    store.agregar(productoMock)
    store.agregar(productoMock)
    expect(store.items).toHaveLength(1)
    expect(store.items[0].cantidad).toBe(2)
    expect(store.cantidadItems).toBe(2)
  })

  it('calcula el total correctamente', () => {
    const store = useCarritoStore()
    store.agregar(productoMock)
    store.agregar(productoMock)
    expect(store.totalPrecio).toBe(20)
  })
})
```

### Mocks con `vi`

```typescript
// Mockear módulo completo
vi.mock('@/services/productos.service', () => ({
  getProductos: vi.fn().mockResolvedValue([productoMock])
}))

// Mockear función de un módulo
import * as service from '@/services/productos.service'
vi.spyOn(service, 'getProductos').mockResolvedValue([productoMock])

// Restaurar mocks después de cada test
afterEach(() => { vi.restoreAllMocks() })
```

---

## 4. Buenas Prácticas

- **Nombra los tests como documentación**: `it('muestra error cuando el email es inválido')` es mejor que `it('test 1')`.
- **Un assert por test**: hace que sea obvio qué falló.
- **`beforeEach` para limpiar estado**: especialmente localStorage y Pinia.
- **No testees detalles de implementación**: testa el comportamiento desde el punto de vista del usuario/consumidor.
- **80% de cobertura como objetivo razonable**: no busques 100% a toda costa.
- **Tests de componentes: buscar por texto, roles ARIA, no por clases CSS**: las clases cambian; el comportamiento, no.

---

## 5. Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| `Cannot find module '@/...'` en tests | Alias `@` no configurado en `vite.config.ts` test | Agregar `resolve.alias` en la sección `test` |
| Test falla por estado compartido entre tests | Store de Pinia no reiniciada | Usar `setActivePinia(createPinia())` en `beforeEach` |
| `document is not defined` | Test de componente sin entorno DOM | Configurar `environment: 'happy-dom'` en `vite.config.ts` |
| `nextTick` no disponible | No importado | `import { nextTick } from 'vue'` |

---

## 6. Relación con el Proyecto Incremental

Se agregan tests para los elementos más importantes del proyecto: utilidades de formato, el store del carrito y el componente `ProductCard`. Los tests sirven como documentación ejecutable del comportamiento esperado.

---

## 7. Referencias

- [Vitest - Documentación](https://vitest.dev)
- [Vue Test Utils - Guía](https://test-utils.vuejs.org/guide)
- [Pinia - Testing](https://pinia.vuejs.org/cookbook/testing)
- [Guía de testing de Vue 3](https://vuejs.org/guide/scaling-up/testing)
