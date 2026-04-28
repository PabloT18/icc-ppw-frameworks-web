import type { Product, ProductsResponse } from '@/types/product.types'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

export async function getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
  const respuesta = await fetch(
    `${API_URL}/products?limit=${limit}&skip=${skip}`
  )

  if (!respuesta.ok) {
    throw new Error(`Error al obtener productos: ${respuesta.status} ${respuesta.statusText}`)
  }

  return respuesta.json()
}

export async function getProductById(id: number): Promise<Product> {
  const respuesta = await fetch(`${API_URL}/products/${id}`)

  if (!respuesta.ok) {
    throw new Error(`Producto ${id} no encontrado: ${respuesta.status}`)
  }

  return respuesta.json()
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const respuesta = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}`
  )

  if (!respuesta.ok) {
    throw new Error(`Error al buscar "${query}": ${respuesta.status}`)
  }

  return respuesta.json()
}

export async function getCategories(): Promise<string[]> {
  const respuesta = await fetch(`${API_URL}/products/categories`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener categorias: ${respuesta.status}`)
  }

  const categorias: Array<{ slug: string; name: string; url: string }> = await respuesta.json()
  return categorias.map(c => c.slug)
}
