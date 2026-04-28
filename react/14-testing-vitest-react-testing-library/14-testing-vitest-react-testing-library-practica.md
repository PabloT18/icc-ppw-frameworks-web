# Programacion y Plataformas Web

# React para Desarrollo Web

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="80" alt="React Logo">
</div>

## Practica 14: Testing con Vitest y React Testing Library

### Autores

**Pablo Torres**  
ptorersp@ups.edu.ec  
GitHub: [PabloT18](https://github.com/PabloT18)

---

## Objetivo Practico

Configurar Vitest + React Testing Library en el proyecto ReactStore. Escribir tests para el componente `Badge`, el componente `Counter`, y el hook `useLocalStorage`. Verificar que los tests pasan con `pnpm test`.

---

## Instalacion

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

---

## Paso 1: Configurar Vitest en `vite.config.ts`

**(copiar)**

Modificar `vite.config.ts` para agregar la configuracion de test. Primero agregar la referencia de tipos:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
```

**¿Que hace este codigo?**
- `environment: 'jsdom'` — los tests se ejecutan en un navegador simulado (no en Node.js puro), lo que permite usar `document`, `window` y renderizar componentes React
- `globals: true` — `describe`, `it`, `expect`, `vi` estan disponibles sin importar
- `setupFiles` — archivo que se ejecuta antes de cada suite de tests

---

## Paso 2: Agregar script de test en `package.json`

**(copiar)**

Agregar en la seccion `scripts`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Paso 3: Crear el archivo de setup

**(copiar — desde `files/`)**

Crear `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpiar el DOM despues de cada test para evitar interferencias
afterEach(() => {
  cleanup()
})
```

**¿Que hace este codigo?**
- `import '@testing-library/jest-dom'` — agrega matchers como `toBeInTheDocument()` al `expect` global
- `cleanup()` — desmonta todos los componentes renderizados en el test anterior, limpiando el DOM virtual

---

## Paso 4: Test del componente `Badge`

**(copiar — desde `files/`)**

Crear `src/components/Badge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from './Badge'

describe('Badge', () => {
  it('renderiza el texto correctamente', () => {
    render(<Badge texto="electronica" tipo="categoria" />)
    expect(screen.getByText('electronica')).toBeInTheDocument()
  })

  it('renderiza sin lanzar errores con diferentes tipos', () => {
    const { rerender } = render(<Badge texto="test" tipo="categoria" />)
    expect(screen.getByText('test')).toBeInTheDocument()

    rerender(<Badge texto="test" tipo="rating" />)
    expect(screen.getByText('test')).toBeInTheDocument()

    rerender(<Badge texto="test" tipo="descuento" />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('el elemento tiene el role correcto (span)', () => {
    render(<Badge texto="novedad" tipo="categoria" />)
    // Badge es un <span> — se puede buscar por tag
    const badge = screen.getByText('novedad')
    expect(badge.tagName.toLowerCase()).toBe('span')
  })
})
```

**¿Que hace este codigo?**
- `render()` monta el componente en el DOM virtual de jsdom
- `screen.getByText()` busca un elemento con ese texto exacto — lanza si no existe
- `rerender()` actualiza las props del mismo componente sin desmontarlo — util para probar multiples variantes
- `toBeInTheDocument()` verifica que el elemento esta en el DOM

---

## Paso 5: Test del componente `Counter`

**(completar)**

Crear `src/components/Counter.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Counter from './Counter'

describe('Counter', () => {
  it('muestra el valor inicial', () => {
    render(<Counter inicial={5} paso={1} />)
    // TODO 5.1: Verificar que se muestra el numero 5
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('incrementa el contador al hacer click en +', async () => {
    const user = userEvent.setup()
    render(<Counter inicial={0} paso={2} />)

    // TODO 5.2: Hacer click en el boton de incrementar
    // Pista: getByRole('button', { name: /\+/ }) — busca el boton con texto "+"
    await user.click(screen.getByRole('button', { name: /\+/ }))

    // TODO 5.3: Verificar que el contador muestra 2 (0 + paso:2)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('decrementa el contador al hacer click en -', async () => {
    const user = userEvent.setup()
    render(<Counter inicial={10} paso={3} />)

    await user.click(screen.getByRole('button', { name: /-/ }))

    // TODO 5.4: Verificar que el contador muestra 7 (10 - paso:3)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('reset vuelve al valor inicial', async () => {
    const user = userEvent.setup()
    render(<Counter inicial={0} paso={1} />)

    await user.click(screen.getByRole('button', { name: /\+/ }))
    await user.click(screen.getByRole('button', { name: /\+/ }))
    // El contador deberia estar en 2 ahora

    // TODO 5.5: Hacer click en reset y verificar que vuelve a 0
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
```

---

## Paso 6: Test del hook `useLocalStorage`

**(copiar — desde `files/`)**

Crear `src/hooks/useLocalStorage.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
  })

  it('retorna el valor inicial cuando no hay nada en localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>('test-key', []))
    expect(result.current[0]).toEqual([])
  })

  it('guarda el valor en localStorage al llamar el setter', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>('test-key', []))

    act(() => {
      result.current[1]([1, 2, 3])
    })

    expect(result.current[0]).toEqual([1, 2, 3])
    expect(localStorage.getItem('test-key')).toBe('[1,2,3]')
  })

  it('recupera el valor guardado de localStorage al montar', () => {
    localStorage.setItem('test-key', JSON.stringify([10, 20]))

    const { result } = renderHook(() => useLocalStorage<number[]>('test-key', []))

    expect(result.current[0]).toEqual([10, 20])
  })

  it('retorna un tuple con el valor y el setter', () => {
    const { result } = renderHook(() => useLocalStorage<string>('key', 'inicial'))
    const [valor, setValor] = result.current

    expect(valor).toBe('inicial')
    expect(typeof setValor).toBe('function')
  })
})
```

**¿Que hace este codigo?**
- `renderHook()` — ejecuta el hook en un componente contenedor invisible. Retorna `result.current` que apunta al valor de retorno del hook
- `act()` — envuelve actualizaciones de estado; necesario para que React procese los cambios antes del assert
- `beforeEach(() => localStorage.clear())` — garantiza que cada test empieza con localStorage limpio

---

## Paso 7: Ejecutar los tests

**(verificar)**

```bash
pnpm test
```

La salida esperada:

```
✓ src/components/Badge.test.tsx (3 tests) 15ms
✓ src/components/Counter.test.tsx (4 tests) 28ms
✓ src/hooks/useLocalStorage.test.ts (4 tests) 12ms

Test Files  3 passed (3)
Tests       11 passed (11)
```

Si algun test falla, Vitest muestra exactamente que se esperaba vs que se recibio.

> Captura pendiente: output de `pnpm test` en la terminal mostrando todos los tests en verde. Captura la pantalla del modo `--ui` (pnpm test:ui) que muestra los tests en una interfaz grafica en el browser.

---

## Paso 8: Test de integracion del LoginPage (completar)

**(completar)**

Crear `src/pages/LoginPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'

// TODO 8.1: Importar LoginPage

// TODO 8.2: Mockear useAuth para controlar el comportamiento en tests
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    estaAutenticado: false,
    login: vi.fn().mockResolvedValue(undefined), // login exitoso por defecto
  }),
}))

describe('LoginPage', () => {
  function renderConRouter() {
    return render(
      <MemoryRouter>
        {/* TODO 8.3: Renderizar LoginPage aqui */}
      </MemoryRouter>
    )
  }

  it('muestra el titulo "Iniciar Sesion"', () => {
    renderConRouter()
    expect(screen.getByText('Iniciar Sesion')).toBeInTheDocument()
  })

  it('tiene campos de usuario y contrasena', () => {
    renderConRouter()
    expect(screen.getByLabelText('Usuario')).toBeInTheDocument()
    expect(screen.getByLabelText('Contrasena')).toBeInTheDocument()
  })

  it('el boton de submit dice "Ingresar"', () => {
    renderConRouter()
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })
})
```

---

## Validaciones Esperadas

- [ ] `pnpm test` ejecuta sin errores de configuracion
- [ ] Tests de `Badge`: 3 tests pasando
- [ ] Tests de `Counter`: 4 tests pasando
- [ ] Tests de `useLocalStorage`: 4 tests pasando
- [ ] `pnpm test:ui` abre la UI de Vitest en el browser (si se instala `@vitest/ui`)

---

## Entregables

- `vite.config.ts` con bloque `test`
- `package.json` con scripts `test`, `test:ui`, `test:coverage`
- `src/test/setup.ts`
- `src/components/Badge.test.tsx`
- `src/components/Counter.test.tsx`
- `src/hooks/useLocalStorage.test.ts`
- `src/pages/LoginPage.test.tsx` (con los TODO completados)

---

## Commits Sugeridos

```bash
git commit -m "chore: instalar vitest, @testing-library/react y jest-dom"
git commit -m "test: configurar vitest en vite.config.ts y setup.ts"
git commit -m "test: tests para componente Badge"
git commit -m "test: tests para componente Counter con userEvent"
git commit -m "test: tests para hook useLocalStorage con renderHook"
```
