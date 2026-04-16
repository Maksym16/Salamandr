import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchGallery, addGalleryImage, deleteGalleryImage } from '../../api/gallery'
import { uploadImage } from '../../api/upload'

export default function GalleryAdmin() {
  const qc = useQueryClient()
  const inputRef = useRef(null)

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGallery,
  })

  const uploadMutation = useMutation({
    mutationFn: async (files) => {
      for (const file of files) {
        const { url, public_id } = await uploadImage(file)
        await addGalleryImage(url, public_id)
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  })

  function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    uploadMutation.mutate(files)
    e.target.value = ''
  }

  function handleDelete(img) {
    if (!window.confirm('Видалити зображення?')) return
    deleteMutation.mutate(img.id)
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-forge-cream text-xl font-bold uppercase tracking-wide">Галерея</h1>
          <p className="text-forge-muted text-sm mt-1">{images.length} фото</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 uppercase tracking-wide transition-colors disabled:opacity-60"
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
              Додати фото
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {/* Error */}
      {uploadMutation.isError && (
        <p className="mb-4 text-red-400 text-sm">{uploadMutation.error?.message}</p>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-forge-surface animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && images.length === 0 && (
        <div className="py-20 text-center text-forge-muted border border-dashed border-forge-border">
          <p className="mb-3">Галерея порожня</p>
          <button
            onClick={() => inputRef.current?.click()}
            className="text-brand-primary text-sm hover:underline"
          >
            Завантажити перше фото
          </button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && images.length > 0 && (
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden bg-forge-surface">
              <img
                src={img.url}
                alt={img.title || ''}
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
          ))}
        </div>
      )}
    </div>
  )
}
