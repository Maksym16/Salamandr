import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function FlameIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff">
      <path d="M424-282q13 11 27.5 15.5T480-262q29 0 52.5-18.5T560-334q5-47-29-69.5T480-462q-5 14-5 26t3 26q3 17 7 32t1 32q-5 18-22 37t-40 27ZM80-80v-800h800v800H80Zm400-160q50 0 85-35t35-85q0-24-10-40t-28-30q-38-27-63.5-56.5T458-546q-44 35-71 79.5T360-362q0 35 36 78.5t84 43.5Zm-320 80h80v-80h90q-23-29-36.5-61T280-362q0-46 10-86.5t36.5-78.5q26.5-38 73.5-75.5T520-680q-11 44 9.5 93.5T606-496q33 24 53.5 56.5T680-360q0 35-11 64.5T640-240h80v80h80v-640H160v640Zm320-80Z" />
    </svg>
  )
}

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Невірний email або пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forge-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 bg-brand-primary flex items-center justify-center">
            <FlameIcon />
          </div>
          <span className="font-display text-lg font-bold tracking-[0.12em] text-forge-cream uppercase">
            Буржуйка
          </span>
        </div>
        <p className="text-forge-muted text-xs uppercase tracking-widest text-center mb-8">
          Адміністрування
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full bg-forge-card border border-forge-border text-forge-cream px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-forge-muted/50"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              required
              autoComplete="current-password"
              className="w-full bg-forge-card border border-forge-border text-forge-cream px-4 py-3 pr-11 text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-forge-muted/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-forge-muted hover:text-forge-cream transition-colors"
              aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7a5 5 0 0 1 5 5c0 .67-.13 1.31-.37 1.9L19.9 16.17A11.82 11.82 0 0 0 23 12c-1.73-4.39-6-7.5-11-7.5a11.6 11.6 0 0 0-3.9.68L10.1 7.1C10.72 7.04 11.36 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55A3 3 0 0 0 9 12a3 3 0 0 0 3 3c.22 0 .44-.03.65-.07l1.55 1.55A5 5 0 0 1 7 12c0-.68.14-1.33.37-1.94l.16-.26zm4.31-.78 3.15 3.15.02-.16A3 3 0 0 0 12 9l-.16.02z"/>
                </svg>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3 uppercase tracking-widest text-sm transition-all"
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  )
}
