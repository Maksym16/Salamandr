import { apiFetch } from './client'

export const fetchGallery       = ()            => apiFetch('/gallery')
export const addGalleryImage    = (url, public_id, title) => apiFetch('/gallery', { method: 'POST', body: JSON.stringify({ url, public_id, title }) })
export const deleteGalleryImage = (id)          => apiFetch(`/gallery/${id}`, { method: 'DELETE' })
