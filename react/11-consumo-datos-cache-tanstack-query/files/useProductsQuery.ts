import { getProducts } from '@/services/product.service'
import { useQuery } from '@tanstack/react-query'

export function useProductsQuery(limit = 30) {
  return useQuery({
    queryKey: ['products', limit],
    queryFn: () => getProducts(limit),
  })
}
