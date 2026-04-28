import { getCategories } from '@/services/product.service'
import { useEffect, useState } from 'react'

function useCategories() {
  const [categorias, setCategorias] = useState<string[]>(['todas'])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getCategories()
      .then(cats => setCategorias(['todas', ...cats]))
      .catch(() => setCategorias(['todas']))
      .finally(() => setCargando(false))
  }, [])

  return { categorias, cargando }
}

export default useCategories
