import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchHeroCarousel, addHeroCarouselImage, deleteHeroCarouselImage } from '../../api/heroCarousel'
import { uploadImage } from '../../api/upload'

const MAX_IMAGES = 5

export default function HeroCarouselAdmin() {
  const qc = useQueryClient()
  const inputRef = useRef(null)
  const [altInputs, setAltInputs] = useState({})

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['hero-carousel'],
    queryFn: fetchHeroCarousel,
  })

  const uploadMutation = useMutation({
    mutationFn: async ({ file, alt }) => {
      const { url, public_id } = await uploadImage(file)
      await addHeroCarouselImage(url, public_id, alt)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hero-carousel'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteHeroCarouselImage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hero-carousel'] }),
  })

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (images.length >= MAX_IMAGES) return
    uploadMutation.mutate({ file, alt: '' })
    e.target.value = ''
  }

  function handleDelete(img) {
    if (!window.confirm('Видалити зображення з карусельки?')) return
    deleteMutation.mutate(img.id)
  }

  const isFull = images.length >= MAX_IMAGES

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-forge-cream text-xl font-bold uppercase tracking-wide">Карусель головної</h1>
          <p className="text-forge-muted text-sm mt-1">
            <span className={isFull ? 'text-brand-primary font-semibold' : ''}>{images.length}</span>
            <span className="text-forge-muted"> / {MAX_IMAGES} зображень</span>
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending || isFull}
          title={isFull ? `Максимум ${MAX_IMAGES} зображень` : ''}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadMutation.isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Завантаження...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {isFull ? 'Ліміт досягнуто' : 'Додати фото'}
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Capacity bar */}
      <div className="w-full h-1 bg-forge-border rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-brand-primary transition-all duration-500"
          style={{ width: `${(images.length / MAX_IMAGES) * 100}%` }}
        />
      </div>

      {/* Error */}
      {uploadMutation.isError && (
        <p className="mb-4 text-red-400 text-sm">{uploadMutation.error?.message}</p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-video bg-forge-surface animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && images.length === 0 && (
        <div className="py-20 text-center text-forge-muted border border-dashed border-forge-border">
          <p className="mb-3">Карусель порожня</p>
          <button onClick={() => inputRef.current?.click()} className="text-brand-primary text-sm hover:underline">
            Завантажити перше фото
          </button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={img.id} className="group relative flex flex-col gap-2">
              {/* Position badge */}
              <div className="relative aspect-video overflow-hidden bg-forge-surface">
                <span className="absolute top-2 left-2 z-10 bg-brand-primary text-white text-xs font-bold w-6 h-6 flex items-center justify-center">
                  {idx + 1}
                </span>
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img)}
                    disabled={deleteMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                    aria-label="Видалити"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-6 0h6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Alt text */}
              <input
                type="text"
                placeholder="Підпис (alt)"
                defaultValue={img.alt || ''}
                className="w-full bg-forge-surface border border-forge-border text-forge-dim text-xs px-2 py-1.5 focus:outline-none focus:border-brand-primary/60 placeholder-forge-muted"
                readOnly
              />
            </div>
          ))}
        </div>
      )}

      <p className="text-forge-muted text-xs mt-8">
        Зображення відображаються у карусельці на головній сторінці зліва направо (позиція 1→{MAX_IMAGES}).
      </p>
    </div>
  )
}
