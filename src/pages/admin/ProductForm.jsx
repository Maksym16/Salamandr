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

  const [uploading, setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')

  const {
    register, control, handleSubmit, reset, watch, setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '', category_id: 'sauna', manufacturer_id: '',
      image: '', specs: [{ value: '' }], is_on_sale: false,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'specs' })
  const imageUrl  = watch('image')
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
        category_id:     product.category_id,
        manufacturer_id: product.manufacturer_id || '',
        image:           product.image || '',
        specs:           (product.specs || []).map(s => ({ value: s })),
        is_on_sale:      product.is_on_sale ?? false,
      })
    }
  }, [product, reset])

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const { url } = await uploadImage(file)
      setValue('image', url, { shouldDirty: true })
    } catch (err) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) => {
      const payload = {
        ...formData,
        specs: formData.specs.map(s => s.value).filter(Boolean),
        manufacturer_id: formData.manufacturer_id || null,
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
            className={inputClass}
            placeholder="Harvia Legend 150"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
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
          <label className={labelClass}>Зображення</label>

          {/* Preview */}
          {imageUrl && (
            <div className="mb-3 relative w-40 h-28">
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-full object-cover border border-forge-border"
              />
              <button
                type="button"
                onClick={() => { setValue('image', ''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-forge-card border border-forge-border text-forge-muted hover:text-red-400 flex items-center justify-center text-xs transition-colors"
                aria-label="Видалити зображення"
              >
                ×
              </button>
            </div>
          )}

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
                {imageUrl ? 'Замінити зображення' : 'Вибрати файл'}
              </>
            )}
          </label>

          {/* Hidden field to carry the URL */}
          <input type="hidden" {...register('image')} />

          {uploadError && (
            <p className="text-red-400 text-xs mt-2">{uploadError}</p>
          )}
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
