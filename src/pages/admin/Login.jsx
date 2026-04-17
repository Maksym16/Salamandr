import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

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
          <img src="/logo/logo.png" alt="Буржуйка" className="h-8 w-auto object-contain" />
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

        <div className="mt-6 text-center">
          <Link to="/" className="text-forge-muted hover:text-brand-primary text-xs uppercase tracking-widest transition-colors">
            ← На сайт
          </Link>
        </div>
      </div>
    </div>
  )
}
