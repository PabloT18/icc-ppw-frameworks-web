import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Limpiar el DOM despues de cada test para evitar interferencias entre tests
afterEach(() => {
  cleanup()
})
