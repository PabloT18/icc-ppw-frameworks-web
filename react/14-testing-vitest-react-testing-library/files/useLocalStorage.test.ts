import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
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
