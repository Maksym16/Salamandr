import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchProduct, fetchCategories, fetchManufacturers,
  createProduct, updateProduct,
} from '../../api/products'
import { uploadImage } from '../../api/upload'

const inputClass =
  'w-full bg-forge-card border border-forge-border text-forge-cream px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-forge-muted/40'
const labelClass =
  'block text-forge-muted text-xs uppercase tracking-wider mb-2'

export default function ProductForm() {
  const { id } = useParams()
  const isEdit  = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)

  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [images, setImages]           = useState([])

  const {
    register, control, handleSubmit, reset, watch, setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '', slug: '', description: '', category_id: 'sauna', manufacturer_id: '',
      specs: [{ value: '' }], spec_columns: [], is_on_sale: false, price: '',
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'specs' })
  const { fields: colFields, append: appendCol, remove: removeCol } = useFieldArray({ control, name: 'spec_columns' })
  const isOnSale  = watch('is_on_sale')

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { data: manufacturers = [] } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: fetchManufacturers,
  })

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: isEdit,
  })

  useEffect(() => {
    if (product) {
      reset({
        name:            product.name,
        slug:            product.slug || '',
        description:     product.description || '',
        category_id:     product.category_id,
        manufacturer_id: product.manufacturer_id || '',
        specs:           (product.specs || []).map(s => ({ value: s })),
        spec_columns:    (product.spec_columns || []).map(c => ({ value: c })),
        is_on_sale:      product.is_on_sale ?? false,
        price:           product.price != null ? String(product.price) : '',
      })
      // populate images from product
      const existing = [
        ...(product.image ? [product.image] : []),
        ...(product.images || []).filter(img => img !== product.image),
      ]
      setImages(existing)
    }
  }, [product, reset])

  function handleNameBlur(e) {
    const currentSlug = watch('slug')
    if (currentSlug) return
    const generated = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0400-\u04FF-]/g, '')
      .slice(0, 80)
    if (generated) setValue('slug', generated)
  }

  async function handleFileChange(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadError('')
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f).then(r => r.url)))
      setImages(prev => [...prev, ...urls])
    } catch (err) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(idx) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  function moveImage(from, to) {
    setImages(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const mutation = useMutation({
    mutationFn: (formData) => {
      const payload = {
        ...formData,
        image: images[0] || null,
        images: images.length > 1 ? images.slice(1) : null,
        specs: formData.specs.map(s => s.value).filter(Boolean),
        spec_columns: formData.spec_columns.map(c => c.value).filter(Boolean),
        manufacturer_id: formData.manufacturer_id || null,
        price: formData.price !== '' ? Number(formData.price) : null,
      }
      return isEdit ? updateProduct(id, payload) : createProduct(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate('/admin/products')
    },
  })

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-forge-muted hover:text-forge-cream text-sm transition-colors"
        >
          ← Назад
        </button>
        <h1 className="font-display text-2xl font-bold uppercase text-forge-cream">
          {isEdit ? 'Редагувати товар' : 'Новий товар'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-5">
        {/* Name */}
        <div>
          <label className={labelClass}>Назва *</label>
          <input
            {...register('name', { required: "Обов'язкове поле" })}
            onBlur={handleNameBlur}
            className={inputClass}
            placeholder="Harvia Legend 150"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className={labelClass}>Slug (URL)</label>
          <input
            {...register('slug')}
            className={inputClass}
            placeholder="harvia-legend-150"
          />
          <p className="text-forge-muted/50 text-xs mt-1">Генерується автоматично з назви. Можна змінити вручну.</p>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Опис</label>
          <textarea
            {...register('description')}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Короткий опис товару..."
          />
        </div>

        {/* Category + Manufacturer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Категорія *</label>
            <select
              {...register('category_id', { required: true })}
              className={inputClass}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Виробник</label>
            <select {...register('manufacturer_id')} className={inputClass}>
              <option value="">— Оберіть —</option>
              {manufacturers.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className={labelClass}>Зображення <span className="normal-case text-forge-muted/50 font-normal">(перше — головне; можна перетягнути для сортування)</span></label>

          {/* Thumbnails grid */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((url, i) => (
                <div key={url} className="relative group w-24 h-24 flex-shrink-0">
                  <img src={url} alt="" className={`w-full h-full object-cover border-2 ${i === 0 ? 'border-brand-primary' : 'border-forge-border'}`} />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-brand-primary/80 text-white text-[10px] text-center py-0.5">Головне</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-forge-card border border-forge-border text-forge-muted hover:text-red-400 flex items-center justify-center text-xs transition-colors opacity-0 group-hover:opacity-100"
                  >×</button>
                  <div className="absolute bottom-6 right-0 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100">
                    {i > 0 && (
                      <button type="button" onClick={() => moveImage(i, i - 1)} className="bg-forge-card border border-forge-border text-forge-muted hover:text-forge-cream text-[10px] px-1">◀</button>
                    )}
                    {i < images.length - 1 && (
                      <button type="button" onClick={() => moveImage(i, i + 1)} className="bg-forge-card border border-forge-border text-forge-muted hover:text-forge-cream text-[10px] px-1">▶</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`inline-flex items-center gap-2 px-4 py-2.5 border text-sm cursor-pointer transition-colors ${
              uploading
                ? 'border-forge-border text-forge-muted/50 cursor-not-allowed'
                : 'border-forge-border text-forge-muted hover:border-brand-primary hover:text-brand-primary'
            }`}
          >
            {uploading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Завантаження...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
                {images.length > 0 ? 'Додати ще фото' : 'Вибрати фото'}
              </>
            )}
          </label>

          {uploadError && (
            <p className="text-red-400 text-xs mt-2">{uploadError}</p>
          )}
        </div>

        {/* Spec columns — for multi-model table */}
        <div>
          <label className={labelClass}>Колонки таблиці характеристик</label>
          <p className="text-forge-muted/50 text-xs mb-2">Додайте назви моделей, якщо характеристики представлені таблицею (напр. ПКС-01, ПКС-02). Залиште порожнім для звичайного списку.</p>
          <div className="space-y-2">
            {colFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`spec_columns.${i}.value`)}
                  className={`${inputClass} flex-1`}
                  placeholder="ПКС-01 Ч"
                />
                <button
                  type="button"
                  onClick={() => removeCol(i)}
                  className="text-forge-muted hover:text-red-400 px-3 transition-colors text-xl leading-none flex-shrink-0"
                  aria-label="Видалити"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendCol({ value: '' })}
            className="mt-2 text-xs text-brand-primary hover:text-brand-light transition-colors"
          >
            + Додати колонку
          </button>
        </div>

        {/* Specs — dynamic list */}
        <div>
          <label className={labelClass}>Характеристики</label>
          <div className="space-y-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`specs.${i}.value`)}
                  className={`${inputClass} flex-1`}
                  placeholder="Потужність: 15 кВт"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-forge-muted hover:text-red-400 px-3 transition-colors text-xl leading-none flex-shrink-0"
                  aria-label="Видалити"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ value: '' })}
            className="mt-2 text-xs text-brand-primary hover:text-brand-light transition-colors"
          >
            + Додати характеристику
          </button>
        </div>

        {/* On Sale toggle */}
        <div className="flex items-center justify-between py-3 px-4 bg-forge-card border border-forge-border">
          <div>
            <p className="text-forge-cream text-sm font-medium">Акційний товар</p>
            <p className="text-forge-muted text-xs mt-0.5">Відображає позначку "SALE" на картці товару</p>
          </div>
          <button
            type="button"
            onClick={() => setValue('is_on_sale', !isOnSale)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
              isOnSale ? 'bg-brand-primary' : 'bg-forge-border'
            }`}
            aria-pressed={isOnSale}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isOnSale ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <input type="hidden" {...register('is_on_sale')} />
        </div>

        {/* Price */}
        <div>
          <label className={labelClass}>Орієнтовна ціна (грн) <span className="normal-case font-normal text-forge-muted/50">— необов'язково</span></label>
          <div className="relative">
            <input
              {...register('price', {
                validate: v => v === '' || (!isNaN(Number(v)) && Number(v) >= 0) || 'Введіть коректну суму',
              })}
              type="number"
              min="0"
              step="1"
              className={inputClass}
              placeholder="наприклад 12500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-forge-muted text-sm pointer-events-none">₴</span>
          </div>
          {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
          <p className="text-forge-muted/50 text-xs mt-1">Відображається як «від X грн» на картці та сторінці товару</p>
        </div>

        {/* Mutation error */}
        {mutation.isError && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2">
            {mutation.error?.message}
          </p>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={mutation.isPending || uploading}
            className="bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-semibold px-8 py-3 uppercase tracking-widest text-sm transition-all"
          >
            {mutation.isPending
              ? 'Збереження...'
              : isEdit ? 'Зберегти зміни' : 'Додати товар'
            }
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-forge-muted hover:text-forge-cream transition-colors"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  )
}
