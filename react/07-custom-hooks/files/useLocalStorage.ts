import { useCallback, useState } from 'react'

function useLocalStorage<T>(key: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : valorInicial
    } catch {
      return valorInicial
    }
  })

  const guardar = useCallback(
    (nuevoValor: T) => {
      setValor(nuevoValor)
      localStorage.setItem(key, JSON.stringify(nuevoValor))
    },
    [key]
  )

  return [valor, guardar] as const
}

export default useLocalStorage
