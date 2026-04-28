import { apiFetch } from './client'

export const fetchProducts      = ()         => apiFetch('/products')
export const fetchCategories    = ()         => apiFetch('/products/categories')
export const fetchManufacturers = ()         => apiFetch('/products/manufacturers')
export const fetchProduct       = (id)       => apiFetch(`/products/${id}`)
export const fetchProductBySlug = (slug)     => apiFetch(`/products/slug/${slug}`)
export const createProduct      = (data)     => apiFetch('/products', { method: 'POST', body: JSON.stringify(data) })
export const updateProduct      = (id, data) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProduct      = (id)       => apiFetch(`/products/${id}`, { method: 'DELETE' })

// Categories CRUD
export const createCategory = (data)     => apiFetch('/settings/categories', { method: 'POST', body: JSON.stringify(data) })
export const updateCategory = (id, data) => apiFetch(`/settings/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteCategory = (id)       => apiFetch(`/settings/categories/${id}`, { method: 'DELETE' })

// Manufacturers CRUD
export const createManufacturer = (data)     => apiFetch('/settings/manufacturers', { method: 'POST', body: JSON.stringify(data) })
export const updateManufacturer = (id, data) => apiFetch(`/settings/manufacturers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteManufacturer = (id)       => apiFetch(`/settings/manufacturers/${id}`, { method: 'DELETE' })
