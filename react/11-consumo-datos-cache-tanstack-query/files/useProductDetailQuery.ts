import { getProductById } from '@/services/product.service'
import { useQuery } from '@tanstack/react-query'

export function useProductDetailQuery(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: id > 0, // no hacer fetch si el id no es valido
  })
}
