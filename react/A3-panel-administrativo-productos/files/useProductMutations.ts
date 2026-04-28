import { createProduct, deleteProduct, updateProduct } from '@/services/product.service'
import type { Product } from '@/types/product.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useProductMutations() {
  const queryClient = useQueryClient()

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: invalidateProducts,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: invalidateProducts,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidateProducts,
  })

  return { createMutation, updateMutation, deleteMutation }
}
