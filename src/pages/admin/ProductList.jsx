import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts, deleteProduct } from '../../api/products'

const PAGE_SIZE = 24

function SortIcon({ dir }) {
  if (!dir) return <span className="ml-1 text-forge-border">↕</span>
  return <span className="ml-1 text-brand-primary">{dir === 'asc' ? '↑' : '↓'}</span>
}

export default function ProductList() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ col: null, dir: 'asc' })
  const [page, setPage] = useState(1)

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

  function toggleSort(col) {
    setSort(prev =>
      prev.col === col
        ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { col, dir: 'asc' }
    )
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q
      ? products.filter(p => p.name?.toLowerCase().includes(q))
      : [...products]

    if (sort.col) {
      list.sort((a, b) => {
        const av = (
          sort.col === 'name' ? a.name :
          sort.col === 'category' ? a.category_label :
          a.manufacturer_label
        ) ?? ''
        const bv = (
          sort.col === 'name' ? b.name :
          sort.col === 'category' ? b.category_label :
          b.manufacturer_label
        ) ?? ''
        return sort.dir === 'asc'
          ? av.localeCompare(bv, 'uk')
          : bv.localeCompare(av, 'uk')
      })
    }
    return list
  }, [products, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
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
            {isLoading ? '…' : `${filtered.length} / ${products.length} товарів`}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-brand-primary hover:bg-brand-dark text-white font-semibold text-sm px-5 py-2.5 uppercase tracking-wide transition-all flex-shrink-0"
        >
          + Додати
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Пошук за назвою…"
          className="w-full sm:w-80 bg-forge-card border border-forge-border text-forge-cream text-sm px-4 py-2.5 placeholder:text-forge-muted focus:outline-none focus:border-brand-primary transition-colors"
        />
      </div>

      {isLoading && <p className="text-forge-muted text-sm">Завантаження...</p>}
      {isError && <p className="text-red-400 text-sm">Помилка завантаження. Перевірте з'єднання з сервером.</p>}

      {!isLoading && !isError && (
        <>
          <div className="bg-forge-card border border-forge-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forge-border">
                  <th className="text-left px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium w-14">Фото</th>
                  <th
                    className="text-left px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium cursor-pointer select-none hover:text-forge-cream transition-colors"
                    onClick={() => toggleSort('name')}
                  >
                    Назва <SortIcon dir={sort.col === 'name' ? sort.dir : null} />
                  </th>
                  <th
                    className="text-left px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium hidden md:table-cell cursor-pointer select-none hover:text-forge-cream transition-colors"
                    onClick={() => toggleSort('category')}
                  >
                    Категорія <SortIcon dir={sort.col === 'category' ? sort.dir : null} />
                  </th>
                  <th
                    className="text-left px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium hidden lg:table-cell cursor-pointer select-none hover:text-forge-cream transition-colors"
                    onClick={() => toggleSort('maker')}
                  >
                    Виробник <SortIcon dir={sort.col === 'maker' ? sort.dir : null} />
                  </th>
                  <th className="text-right px-4 py-3 text-forge-muted text-xs uppercase tracking-wider font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-forge-muted text-sm">
                      {search ? `Нічого не знайдено для "${search}"` : (
                        <>Товарів ще немає. <Link to="/admin/products/new" className="text-brand-primary hover:underline">Додати перший</Link></>
                      )}
                    </td>
                  </tr>
                ) : pageItems.map(p => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-forge-muted text-xs">
                Сторінка {currentPage} з {totalPages} · показано {pageItems.length} з {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1.5 text-xs text-forge-muted hover:text-forge-cream disabled:opacity-30 transition-colors"
                >
                  «
                </button>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs text-forge-muted hover:text-forge-cream disabled:opacity-30 transition-colors"
                >
                  ‹ Назад
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…')
                    acc.push(n)
                    return acc
                  }, [])
                  .map((n, i) =>
                    n === '…' ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-xs text-forge-muted">…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`px-3 py-1.5 text-xs transition-colors ${
                          n === currentPage
                            ? 'bg-brand-primary text-white'
                            : 'text-forge-muted hover:text-forge-cream'
                        }`}
                      >
                        {n}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs text-forge-muted hover:text-forge-cream disabled:opacity-30 transition-colors"
                >
                  Далі ›
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1.5 text-xs text-forge-muted hover:text-forge-cream disabled:opacity-30 transition-colors"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
