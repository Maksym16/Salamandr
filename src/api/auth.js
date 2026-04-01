import { apiFetch } from './client'

export const login = (email, password) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const getMe = () => apiFetch('/auth/me')
