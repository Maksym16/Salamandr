import { apiFetch } from './client'

export const fetchProducts      = ()         => apiFetch('/products')
export const fetchCategories    = ()         => apiFetch('/products/categories')
export const fetchManufacturers = ()         => apiFetch('/products/manufacturers')
export const fetchProduct       = (id)       => apiFetch(`/products/${id}`)
export const createProduct      = (data)     => apiFetch('/products', { method: 'POST', body: JSON.stringify(data) })
export const updateProduct      = (id, data) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProduct      = (id)       => apiFetch(`/products/${id}`, { method: 'DELETE' })
