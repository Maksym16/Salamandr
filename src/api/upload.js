export async function uploadImage(file) {
  const token = localStorage.getItem('admin_token')
  const body  = new FormData()
  body.append('image', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })

  if (!res.ok) {
    const d = await res.json().catch(() => ({}))
    throw new Error(d.error || 'Upload failed')
  }
  return res.json() // { url }
}
