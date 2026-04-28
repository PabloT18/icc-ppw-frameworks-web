import { getCategories } from '@/services/product.service'
import { useQuery } from '@tanstack/react-query'

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // categorias cambian poco — cachear 10 min
  })
}
