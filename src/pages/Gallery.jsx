import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchGallery } from '../api/gallery'

function Lightbox({ images, index, onChange, onClose }) {
  const image = images[index]
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft'  && hasPrev) onChange(index - 1)
      if (e.key === 'ArrowRight' && hasNext) onChange(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onChange, index, hasPrev, hasNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl leading-none transition-colors"
        onClick={onClose}
        aria-label="Закрити"
      >
        ✕
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          className="absolute left-3 sm:left-6 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onChange(index - 1) }}
          aria-label="Попереднє"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <img
        src={image.url}
        alt={image.title || ''}
        className="max-w-[80vw] max-h-[90vh] object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      {hasNext && (
        <button
          className="absolute right-3 sm:right-6 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onChange(index + 1) }}
          aria-label="Наступне"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Counter */}
      <p className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-xs tracking-widest">
        {index + 1} / {images.length}
        {image.title && <span className="ml-3 text-white/60">{image.title}</span>}
      </p>
    </div>
  )
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const { data: images = [], isLoading } = useQuery({ queryKey: ['gallery'], queryFn: fetchGallery })
  const close = useCallback(() => setSelectedIndex(null), [])

  return (
    <>
      <Helmet>
        <title>Галерея — Буржуйка</title>
        <meta name="description" content="Фотогалерея наших робіт: монтаж печей, камінів та обладнання для саун у Києві та області." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-forge-black pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="mb-10">
            <p className="text-brand-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Портфоліо
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-forge-cream uppercase tracking-wide">
              Наші роботи
            </h1>
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-forge-surface animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && images.length === 0 && (
            <div className="py-24 text-center text-forge-muted">
              Галерея поки порожня
            </div>
          )}

          {/* Grid */}
          {!isLoading && images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedIndex(i)}
                  className="group relative aspect-square overflow-hidden bg-forge-surface focus:outline-none"
                >
                  <img
                    src={img.url}
                    alt={img.title || ''}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedIndex !== null && (
        <Lightbox
          images={images}
          index={selectedIndex}
          onChange={setSelectedIndex}
          onClose={close}
        />
      )}

      <Footer />
    </>
  )
}
