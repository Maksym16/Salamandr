import { Link, NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import ProductList from './ProductList'
import ProductForm from './ProductForm'
import GalleryAdmin from './GalleryAdmin'
import HeroCarouselAdmin from './HeroCarouselAdmin'
import Settings from './Settings'


export default function Dashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-forge-black flex">
      {/* Sidebar */}
      <aside className="w-56 bg-forge-dark border-r border-forge-border flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-forge-border">
          <Link to="/" className="flex items-center gap-2.5 group" target="_blank" rel="noopener noreferrer">
            <img src="/logo/logo.png" alt="Буржуйка" className="h-7 w-auto object-contain flex-shrink-0" />
            <span className="font-display text-sm font-bold tracking-wider text-forge-cream uppercase">
              Буржуйка
            </span>
          </Link>
          <p className="text-forge-muted text-xs mt-1.5 pl-9">Адмін-панель</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `block px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${
                isActive
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-forge-dim hover:text-forge-cream hover:bg-forge-surface'
              }`
            }
          >
            Каталог товарів
          </NavLink>
          <NavLink
            to="/admin/gallery"
            className={({ isActive }) =>
              `block px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${
                isActive
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-forge-dim hover:text-forge-cream hover:bg-forge-surface'
              }`
            }
          >
            Галерея
          </NavLink>
          <NavLink
            to="/admin/hero-carousel"
            className={({ isActive }) =>
              `block px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${
                isActive
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-forge-dim hover:text-forge-cream hover:bg-forge-surface'
              }`
            }
          >
            Карусель головної
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `block px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${
                isActive
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-forge-dim hover:text-forge-cream hover:bg-forge-surface'
              }`
            }
          >
            Налаштування
          </NavLink>
        </nav>

        <div className="p-4 border-t border-forge-border">
          <p className="text-forge-muted text-xs truncate mb-3">{admin?.email}</p>
          <button
            onClick={handleLogout}
            className="text-xs text-forge-muted hover:text-brand-primary transition-colors"
          >
            Вийти →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products"          element={<ProductList />} />
          <Route path="products/new"      element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="gallery"           element={<GalleryAdmin />} />
          <Route path="hero-carousel"     element={<HeroCarouselAdmin />} />
          <Route path="settings"          element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}
