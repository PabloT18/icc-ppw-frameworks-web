import { getProducts } from '@/services/product.service'
import type { Product } from '@/types/product.types'
import { useEffect, useState } from 'react'

interface UseProductsReturn {
  productos: Product[]
  total: number
  cargando: boolean
  error: string | null
}

function useProducts(limit = 30): UseProductsReturn {
  const [productos, setProductos] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const cargar = async () => {
      try {
        setCargando(true)
        setError(null)
        const datos = await getProducts(limit)
        setProductos(datos.products)
        setTotal(datos.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos')
      } finally {
        setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [limit])

  return { productos, total, cargando, error }
}

export default useProducts
