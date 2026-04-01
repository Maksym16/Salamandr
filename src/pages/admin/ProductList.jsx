import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts, deleteProduct } from '../../api/products'

export default function ProductList() {
  const queryClient = useQueryClient()

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  function handleDelete(id, name) {
    if (!window.confirm(`Видалити "${name}"?`)) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-forge-cream">
            Каталог товарів
          </h1>
          <p className="text-forge-muted text-sm mt-1">
            {isLoading ? '…' : `${products.length} товарів`}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-brand-primary hover:bg-brand-dark text-white font-semibold text-sm px-5 py-2.5 uppercase tracking-wide transition-all flex-shrink-0"
        >
          + Додати
        </Link>
      </div>

      {isLoading && (
        <p className="text-forge-muted text-sm">Завантаження...</p>
      )}

      {isError && (
        <p className="text-red-400 text-sm">Помилка завантаження. Перевірте з'єднання з сервером.</p>
      )}

      {!isLoading && !isError && (
        <div className="bg-forge-card border border-forge-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forge-border">
                <th className="text-left px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium w-14">Фото</th>
                <th className="text-left px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium">Назва</th>
                <th className="text-left px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium hidden md:table-cell">Категорія</th>
                <th className="text-left px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium hidden lg:table-cell">Виробник</th>
                <th className="text-right px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium">Дії</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-forge-muted text-sm">
                    Товарів ще немає. <Link to="/admin/products/new" className="text-brand-primary hover:underline">Додати перший</Link>
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p.id} className="border-b border-forge-border/50 hover:bg-forge-surface transition-colors">
                  <td className="px-4 py-3">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="w-12 h-9 object-cover" />
                      : <div className="w-12 h-9 bg-forge-surface" />
                    }
                  </td>
                  <td className="px-4 py-3 text-forge-cream font-medium">
                    <span>{p.name}</span>
                    {p.is_on_sale && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-brand-primary/20 text-brand-primary px-1.5 py-0.5">SALE</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-forge-muted hidden md:table-cell">{p.category_label}</td>
                  <td className="px-4 py-3 text-forge-muted hidden lg:table-cell">{p.manufacturer_label || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="text-xs text-forge-muted hover:text-brand-primary transition-colors"
                      >
                        Редагувати
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleteMutation.isPending}
                        className="text-xs text-forge-muted hover:text-red-400 transition-colors disabled:opacity-40"
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
