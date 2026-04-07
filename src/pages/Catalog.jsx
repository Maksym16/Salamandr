import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchProducts, fetchCategories, fetchManufacturers } from '../api/products'

gsap.registerPlugin(ScrollTrigger)

/* ─── Product card ─── */
function ProductCard({ product }) {
  return (
    <Link to={`/catalog/${product.slug}`} className="product-card group bg-white flex flex-col overflow-hidden border-l-4 border-transparent hover:border-brand-primary transition-all duration-300 shadow-sm hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {product.is_on_sale && (
          <div className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest px-2.5 py-1">
            SALE
          </div>
        )}
      </div>

      {/* Content — flex-1 so all cards grow to the same row height */}
      <div className="flex flex-col flex-1 p-5 border border-gray-100 border-t-0">
        <h3 className="font-display text-xl font-bold uppercase text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
          {product.name}
        </h3>

        <ul className="space-y-1.5 mb-4 flex-1">
          {(product.specs || []).map(spec => (
            <li key={spec} className="text-gray-600 text-xs flex items-start gap-2">
              <span className="text-brand-primary font-bold leading-none mt-0.5">—</span>
              <span>{spec.includes('|') ? spec.split('|')[0] : spec}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-end justify-end pt-4 border-t border-gray-100 mt-auto">
          <span className="bg-brand-primary group-hover:bg-brand-dark text-white font-semibold text-xs px-5 py-2.5 uppercase tracking-wider transition-all group-hover:shadow-md">
            Детальніше
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Page ─── */
export default function Catalog() {
  const [activeTab, setActiveTab] = useState('sauna')
  const [activeMfr, setActiveMfr] = useState('all')
  const rootRef = useRef(null)
  const isFirst = useRef(true)

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { data: manufacturers = [] } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: fetchManufacturers,
  })

  /* Initial page animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cat-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  /* Animate cards when visible products change */
  const categoryProducts = allProducts.filter(p => p.category_id === activeTab)
  const visibleProducts  = activeMfr === 'all'
    ? categoryProducts
    : categoryProducts.filter(p => p.manufacturer_id === activeMfr)

  useEffect(() => {
    if (visibleProducts.length === 0) return
    if (isFirst.current) {
      isFirst.current = false
      gsap.fromTo('.product-card',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.25, ease: 'power2.out', delay: 0.1 }
      )
    }
  }, [visibleProducts.length])

  const animateCards = () => {
    gsap.fromTo('.product-card',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.2, ease: 'power2.out' }
    )
  }

  const handleTab = id => {
    setActiveTab(id)
    setActiveMfr('all')
    animateCards()
  }

  const handleMfr = id => {
    setActiveMfr(id)
    animateCards()
  }

  // Only show manufacturers that have products in the active tab
  const availableMfrs = manufacturers.filter(m =>
    categoryProducts.some(p => p.manufacturer_id === m.id)
  )

  return (
    <div ref={rootRef}>
      <Helmet>
        <title>Каталог печей та камінів — Буржуйка</title>
        <meta name="description" content="Каталог печей для сауни, опалювальних печей та камінів. Новаслав та інші виробники. Київ та область." />
        <meta property="og:title" content="Каталог печей та камінів — Буржуйка" />
        <meta property="og:description" content="Каталог печей для сауни, опалювальних печей та камінів. Новаслав та інші виробники. Київ та область." />
        <meta property="og:url" content="https://burzhuyka.com.ua/catalog" />
      </Helmet>

      <Navbar />

      {/* ── Dark header ── */}
      <section className="bg-forge-black pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="cat-header">
            <nav className="flex items-center gap-2 text-forge-muted text-sm mb-6">
              <Link to="/" className="hover:text-brand-primary transition-colors">Головна</Link>
              <span className="text-forge-border">/</span>
              <span className="text-forge-cream">Каталог</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
              <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Асортимент</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase text-forge-cream leading-none mb-4">
              Каталог товарів
            </h1>
            <p className="text-forge-muted text-lg max-w-lg">
             Обладнання від вітчизняних та закордонних виробникі
            </p>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="bg-gray-50 min-h-screen py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tabs */}
          <div className="flex flex-wrap gap-0 mb-12 border-b-2 border-gray-200 -mx-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleTab(cat.id)}
                className={`mx-1 font-display text-base sm:text-lg font-bold uppercase px-5 py-4 -mb-0.5 border-b-2 tracking-wide transition-all ${
                  activeTab === cat.id
                    ? 'text-brand-primary border-brand-primary'
                    : 'text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Manufacturer filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => handleMfr('all')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-all ${
                activeMfr === 'all'
                  ? 'bg-brand-primary border-brand-primary text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-brand-primary hover:text-brand-primary'
              }`}
            >
              Всі виробники
            </button>
            {availableMfrs.map(m => (
              <button
                key={m.id}
                onClick={() => handleMfr(m.id)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-all ${
                  activeMfr === m.id
                    ? 'bg-brand-primary border-brand-primary text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-brand-primary hover:text-brand-primary'
                }`}
              >
                {m.label}
                <span className="ml-1.5 opacity-60 normal-case font-normal">{m.country}</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {visibleProducts.length > 0 ? visibleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              )) : (
                <p className="col-span-4 text-center text-gray-400 py-16 text-lg">
                  Немає товарів цього виробника в даній категорії
                </p>
              )}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-20 bg-forge-black relative overflow-hidden py-16 px-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-primary/5 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-primary/30" />
            <div className="relative">
              <h3 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream mb-3">
                Не знайшли потрібне?
              </h3>
              <p className="text-forge-muted mb-8">
                Підберемо обладнання під ваші потреби та бюджет
              </p>
              <Link
                to="/contacts"
                className="inline-block bg-brand-primary hover:bg-brand-dark text-white font-semibold px-10 py-4 uppercase tracking-widest text-sm transition-all hover:orange-glow"
              >
                Отримати консультацію
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
