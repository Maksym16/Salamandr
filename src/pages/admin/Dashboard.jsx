import { Link, NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import ProductList from './ProductList'
import ProductForm from './ProductForm'
import GalleryAdmin from './GalleryAdmin'

function FlameIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#ffffff">
      <path d="M424-282q13 11 27.5 15.5T480-262q29 0 52.5-18.5T560-334q5-47-29-69.5T480-462q-5 14-5 26t3 26q3 17 7 32t1 32q-5 18-22 37t-40 27ZM80-80v-800h800v800H80Zm400-160q50 0 85-35t35-85q0-24-10-40t-28-30q-38-27-63.5-56.5T458-546q-44 35-71 79.5T360-362q0 35 36 78.5t84 43.5Zm-320 80h80v-80h90q-23-29-36.5-61T280-362q0-46 10-86.5t36.5-78.5q26.5-38 73.5-75.5T520-680q-11 44 9.5 93.5T606-496q33 24 53.5 56.5T680-360q0 35-11 64.5T640-240h80v80h80v-640H160v640Zm320-80Z" />
    </svg>
  )
}

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
          <Link to="/" className="flex items-center gap-2 group" target="_blank" rel="noopener noreferrer">
            <div className="w-7 h-7 bg-brand-primary flex items-center justify-center flex-shrink-0">
              <FlameIcon />
            </div>
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
        </Routes>
      </main>
    </div>
  )
}
