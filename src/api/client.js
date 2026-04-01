const BASE = import.meta.env.VITE_API_URL || '/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('admin_token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.error || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}
