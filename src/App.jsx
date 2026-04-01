import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Contacts from './pages/Contacts'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.status === 401) {
        localStorage.removeItem('admin_token')
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login'
        }
      }
    },
  }),
})

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-forge-black" />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/catalog"  element={<Catalog />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
