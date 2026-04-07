import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchProductBySlug } from '../api/products'

function SpecsRenderer({ specs, specColumns }) {
  const isTable = specColumns && specColumns.length > 0

  if (isTable) {
    const columns = specColumns
    const rows = specs
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-gray-500 font-medium w-1/2">Найменування параметра</th>
              {columns.map(col => (
                <th key={col} className="text-center px-4 py-3 text-gray-700 font-semibold">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const cells = row.split('|')
              const param = cells[0]
              const vals  = cells.slice(1)
              return (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}>
                  <td className="px-6 py-3.5 text-gray-600">{param}</td>
                  {vals.map((v, j) => (
                    <td key={j} className="px-4 py-3.5 text-center text-gray-900 font-medium">{v}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {specs.map((spec, i) => {
        const colonIdx = spec.indexOf(':')
        const hasLabel = colonIdx > 0 && colonIdx < 40
        const label = hasLabel ? spec.slice(0, colonIdx).trim() : null
        const value = hasLabel ? spec.slice(colonIdx + 1).trim() : spec
        return (
          <div key={i} className={`flex px-8 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}>
            {label ? (
              <>
                <span className="w-1/2 text-gray-500 text-sm font-medium pr-4">{label}</span>
                <span className="w-1/2 text-gray-900 text-sm">{value}</span>
              </>
            ) : (
              <span className="text-gray-700 text-sm flex items-start gap-3">
                <span className="text-brand-primary font-bold leading-none mt-0.5 flex-shrink-0">—</span>
                {spec}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ProductPage() {
  const { slug } = useParams()

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product-slug', slug],
    queryFn: () => fetchProductBySlug(slug),
    retry: false,
  })

  return (
    <div>
      <Helmet>
        <title>{product ? `${product.name} — Буржуйка` : 'Буржуйка'}</title>
        <meta name="description" content={product?.description?.slice(0, 155) ?? 'Деталі товару — Буржуйка'} />
        <meta property="og:title" content={product ? `${product.name} — Буржуйка` : 'Буржуйка'} />
        <meta property="og:description" content={product?.description?.slice(0, 155) ?? ''} />
        {product?.image && <meta property="og:image" content={product.image} />}
        <meta property="og:url" content={`https://burzhuyka.com.ua/catalog/${product?.slug ?? ''}`} />
        {product && (
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description ?? undefined,
            image: product.image ?? undefined,
            brand: { '@type': 'Brand', name: product.manufacturer_label ?? 'Новаслав' },
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              priceCurrency: 'UAH',
              seller: { '@type': 'Organization', name: 'Буржуйка' },
            },
          })}</script>
        )}
      </Helmet>

      <Navbar />

      {/* Dark header */}
      <section className="bg-forge-black pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-forge-muted text-sm">
            <Link to="/" className="hover:text-brand-primary transition-colors">Головна</Link>
            <span className="text-forge-border">/</span>
            <Link to="/catalog" className="hover:text-brand-primary transition-colors">Каталог</Link>
            {product && (
              <>
                <span className="text-forge-border">/</span>
                <span className="text-forge-cream">{product.name}</span>
              </>
            )}
          </nav>
        </div>
      </section>

      <section className="bg-gray-50 min-h-screen py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white h-96 animate-pulse" />
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 w-3/4 animate-pulse" />
                <div className="bg-gray-200 h-4 w-full animate-pulse" />
                <div className="bg-gray-200 h-4 w-5/6 animate-pulse" />
                <div className="bg-gray-200 h-4 w-4/6 animate-pulse" />
              </div>
            </div>
          )}

          {isError && (
            <div className="text-center py-24">
              <p className="text-gray-500 text-xl mb-6">Товар не знайдено</p>
              <Link
                to="/catalog"
                className="inline-block bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-3 uppercase tracking-widest text-sm transition-all"
              >
                ← Повернутись до каталогу
              </Link>
            </div>
          )}

          {product && (
            <>
              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Image */}
                <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover max-h-[500px]"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-80 bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-8 bg-brand-primary flex-shrink-0" />
                    <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                      {product.category_label}
                    </span>
                    {product.is_on_sale && (
                      <span className="bg-brand-primary text-white text-xs font-bold uppercase tracking-widest px-2.5 py-1">
                        SALE
                      </span>
                    )}
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase text-gray-900 leading-none mb-2">
                    {product.name}
                  </h1>

                  {product.manufacturer_label && (
                    <p className="text-gray-400 text-sm mb-6">
                      {product.manufacturer_label}
                      {product.country && ` · ${product.country}`}
                    </p>
                  )}

                  {product.description && (
                    <div className="text-gray-600 text-base leading-relaxed mb-8 flex-1 space-y-3">
                      {product.description.split('\n\n').map((para, i) => (
                        <p key={i} style={{ whiteSpace: 'pre-line' }}>{para}</p>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <Link
                      to="/contacts"
                      className="inline-block bg-brand-primary hover:bg-brand-dark text-white font-semibold px-10 py-4 uppercase tracking-widest text-sm transition-all hover:shadow-lg"
                    >
                      Замовити
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tech specs */}
              {(product.specs || []).length > 0 && (
                <div className="bg-white border border-gray-100 shadow-sm">
                  <div className="bg-forge-black px-8 py-5">
                    <h2 className="font-display text-xl font-bold uppercase text-forge-cream tracking-widest">
                      Технічні характеристики
                    </h2>
                  </div>
                  <SpecsRenderer specs={product.specs} specColumns={product.spec_columns} />
                </div>
              )}

              {/* Back link */}
              <div className="mt-10">
                <Link
                  to="/catalog"
                  className="text-sm text-gray-400 hover:text-brand-primary transition-colors"
                >
                  ← Повернутись до каталогу
                </Link>
              </div>
            </>
          )}

        </div>
      </section>

      <Footer />
    </div>
  )
}
