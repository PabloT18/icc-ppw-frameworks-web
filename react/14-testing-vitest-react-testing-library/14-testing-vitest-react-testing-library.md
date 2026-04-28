# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Modulo 14: Testing con Vitest y React Testing Library

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del Modulo

Introducir el testing de componentes React usando Vitest como test runner y React Testing Library (RTL) como libreria de queries. Entender la filosofia de RTL: **testear comportamiento, no implementacion**. Escribir tests para componentes existentes del proyecto ReactStore.

---

## 2. La Piramide de Testing

```
         /\
        /E2E\        ← Cypress, Playwright — simula al usuario real
       /------\
      / Integ. \     ← varios componentes juntos, con mocking minimo
     /----------\
    /  Unitarios  \  ← componentes y hooks aislados (React Testing Library)
   /--------------\
```

En aplicaciones React, la mayoria de tests son **unitarios** y de **integracion ligera**: renderizar un componente con sus dependencias reales (o mocks minimos) y verificar que el usuario veria lo correcto.

---

## 3. Stack de Testing

| Herramienta | Proposito |
|---|---|
| `vitest` | Test runner compatible con Vite — ejecuta los tests, reporta resultados |
| `@testing-library/react` | Renderizar componentes en jsdom y hacer queries |
| `@testing-library/user-event` | Simular interacciones de usuario (tipear, hacer click) |
| `@testing-library/jest-dom` | Matchers adicionales: `toBeInTheDocument()`, `toHaveValue()`, etc. |
| `jsdom` | Simula el DOM del browser en Node.js |

---

## 4. Anatomia de un Test

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '@/components/Badge'

describe('Badge', () => {
  it('muestra el texto correctamente', () => {
    // Arrange — preparar
    render(<Badge texto="electronica" tipo="categoria" />)

    // Act — actuar (en este caso ya se hizo en el render)

    // Assert — verificar
    expect(screen.getByText('electronica')).toBeInTheDocument()
  })

  it('aplica color rojo cuando el tipo es "error"', () => {
    render(<Badge texto="agotado" tipo="error" />)
    const badge = screen.getByText('agotado')
    expect(badge).toHaveStyle({ backgroundColor: '#fee2e2' })
  })
})
```

---

## 5. Queries de React Testing Library

RTL prioriza queries que **el usuario tambien usaria**:

```tsx
// Mejor (accesible, como el usuario)
screen.getByRole('button', { name: 'Agregar al carrito' })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Buscar productos...')

// Texto visible
screen.getByText('ReactStore')
screen.getByText(/precio/i) // regex, case-insensitive

// Para elementos que pueden no existir
screen.queryByText('Error') // retorna null si no existe (en vez de lanzar)

// Para queries asincronas (aparece despues de un fetch)
await screen.findByText('iPhone 15')
await screen.findByRole('listitem') // espera hasta que aparezca
```

---

## 6. Simular Interacciones con userEvent

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '@/components/Counter'

it('incrementa el contador al hacer click', async () => {
  const user = userEvent.setup()
  render(<Counter inicial={0} paso={1} />)

  expect(screen.getByText('0')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /incrementar/i }))

  expect(screen.getByText('1')).toBeInTheDocument()
})
```

> `userEvent.setup()` crea una instancia de usuario — siempre usarlo antes de `render`. Los metodos de `user` son siempre async.

---

## 7. Mocking con `vi.mock`

Cuando un componente hace `fetch`, el test necesita mockearlo para no hacer peticiones reales:

```tsx
import { vi } from 'vitest'

// Mockear el modulo completo
vi.mock('@/services/product.service', () => ({
  getProducts: vi.fn(() => Promise.resolve({
    products: [
      { id: 1, title: 'iPhone 15', price: 999, rating: 4.5, category: 'smartphones', thumbnail: '', description: '' }
    ],
    total: 1,
    skip: 0,
    limit: 30,
  })),
}))

// Mockear fetch global
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({ products: [] }) })
))
```

---

## 8. Testear Hooks con `renderHook`

```tsx
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

it('guarda y recupera un valor de localStorage', () => {
  const { result } = renderHook(() => useLocalStorage<number[]>('test-key', []))

  expect(result.current[0]).toEqual([])

  act(() => {
    result.current[1]([1, 2, 3])
  })

  expect(result.current[0]).toEqual([1, 2, 3])
  expect(localStorage.getItem('test-key')).toBe('[1,2,3]')
})
```

---

## 9. Matchers de jest-dom

Despues de configurar `@testing-library/jest-dom`, estan disponibles:

```tsx
expect(element).toBeInTheDocument()         // existe en el DOM
expect(element).toBeVisible()               // no tiene display:none
expect(element).toBeDisabled()              // tiene el atributo disabled
expect(element).toHaveTextContent('Hola')   // tiene ese texto
expect(element).toHaveValue('emilys')       // input tiene ese valor
expect(element).toHaveStyle({ color: 'red' })
expect(element).toHaveClass('active')
```

---

## 10. Configuracion de Vitest

En `vite.config.ts` o `vitest.config.ts`:

```ts
test: {
  environment: 'jsdom',        // simular DOM del browser
  globals: true,               // describe, it, expect sin import
  setupFiles: ['./src/test/setup.ts'],  // codigo que corre antes de cada test
  css: true,                   // procesar CSS Modules en tests
}
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom'  // agregar matchers de jest-dom globalmente
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpiar el DOM despues de cada test
afterEach(() => {
  cleanup()
})
```

---

## 11. Organizacion de Archivos

```
src/
├── components/
│   ├── Badge.tsx
│   └── Badge.test.tsx           ← test junto al componente
├── hooks/
│   ├── useLocalStorage.ts
│   └── useLocalStorage.test.ts
└── test/
    └── setup.ts                 ← configuracion global de tests
```

---

## 12. Referencias

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library — Queries](https://testing-library.com/docs/queries/about)
- [jest-dom matchers](https://github.com/testing-library/jest-dom)
- [Principios de Testing Library](https://testing-library.com/docs/guiding-principles)
