import { apiFetch } from './client'

export const fetchHeroCarousel       = ()                          => apiFetch('/hero-carousel')
export const addHeroCarouselImage    = (url, public_id, alt = '') => apiFetch('/hero-carousel', { method: 'POST', body: JSON.stringify({ url, public_id, alt }) })
export const deleteHeroCarouselImage = (id)                        => apiFetch(`/hero-carousel/${id}`, { method: 'DELETE' })
