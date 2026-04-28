import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchManufacturers, createManufacturer, updateManufacturer, deleteManufacturer,
} from '../../api/products'

/* ── shared input style matching the rest of the dashboard ── */
const inputClass =
  'bg-forge-card border border-forge-border text-forge-cream px-3 py-2 text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-forge-muted/40 w-full'

function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-6 0h6" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

/* ══════════════════════════════════════════════════
   CATEGORIES PANEL
══════════════════════════════════════════════════ */
function CategoriesPanel() {
  const qc = useQueryClient()
  const [editingId, setEditingId]   = useState(null)
  const [editLabel, setEditLabel]   = useState('')
  const [addLabel, setAddLabel]     = useState('')
  const [error, setError]           = useState('')

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); setAddLabel(''); setError('') },
    onError: (err) => setError(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, label }) => updateCategory(id, { label }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); setEditingId(null); setError('') },
    onError: (err) => setError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
    onError: (err) => setError(err.message),
  })

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditLabel(cat.label)
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditLabel('')
    setError('')
  }

  function submitEdit(id) {
    if (!editLabel.trim()) return
    updateMutation.mutate({ id, label: editLabel.trim() })
  }

  function handleAdd(e) {
    e.preventDefault()
    if (!addLabel.trim()) return
    createMutation.mutate({ label: addLabel.trim() })
  }

  function handleDelete(cat) {
    if (!window.confirm(`Видалити категорію "${cat.label}"?`)) return
    setError('')
    deleteMutation.mutate(cat.id)
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Panel header */}
      <div className="px-6 py-4 border-b border-forge-border">
        <h2 className="text-forge-cream font-bold uppercase tracking-wide text-sm">Категорії</h2>
        <p className="text-forge-muted text-xs mt-0.5">{categories.length} записів</p>
      </div>

      {/* Error */}
      {(error && (deleteMutation.isError || createMutation.isError || updateMutation.isError)) && (
        <div className="mx-6 mt-4 text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2">
          {error}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="px-6 py-8 space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-8 bg-forge-surface animate-pulse" />)}
          </div>
        )}
        {!isLoading && categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 px-6 py-3 border-b border-forge-border/50 group"
          >
            {editingId === cat.id ? (
              <>
                <input
                  autoFocus
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitEdit(cat.id); if (e.key === 'Escape') cancelEdit() }}
                  className={`${inputClass} flex-1`}
                />
                <button
                  onClick={() => submitEdit(cat.id)}
                  disabled={updateMutation.isPending}
                  className="w-7 h-7 flex items-center justify-center text-brand-primary hover:text-brand-light border border-brand-primary/40 hover:border-brand-primary transition-colors flex-shrink-0"
                >
                  <CheckIcon />
                </button>
                <button
                  onClick={cancelEdit}
                  className="w-7 h-7 flex items-center justify-center text-forge-muted hover:text-forge-cream border border-forge-border transition-colors flex-shrink-0"
                >
                  <XIcon />
                </button>
              </>
            ) : (
              <>
                <span className="font-mono text-xs text-forge-muted/60 w-24 flex-shrink-0 truncate">{cat.id}</span>
                <span className="text-forge-cream text-sm flex-1 truncate">{cat.label}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(cat)}
                    className="w-7 h-7 flex items-center justify-center text-forge-muted hover:text-forge-cream border border-forge-border hover:border-forge-dim transition-colors"
                    aria-label="Редагувати"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={deleteMutation.isPending}
                    className="w-7 h-7 flex items-center justify-center text-forge-muted hover:text-red-400 border border-forge-border hover:border-red-400/40 transition-colors disabled:opacity-40"
                    aria-label="Видалити"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add row */}
      <form onSubmit={handleAdd} className="px-6 py-4 border-t border-forge-border bg-forge-surface/50">
        <p className="text-forge-muted text-xs uppercase tracking-wider mb-2">Додати категорію</p>
        <div className="flex gap-2">
          <input
            value={addLabel}
            onChange={e => setAddLabel(e.target.value)}
            placeholder="Назва категорії"
            className={`${inputClass} flex-1`}
          />
          <button
            type="submit"
            disabled={createMutation.isPending || !addLabel.trim()}
            className="flex-shrink-0 bg-brand-primary hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 uppercase tracking-wide transition-colors"
          >
            {createMutation.isPending ? '...' : '+ Додати'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   MANUFACTURERS PANEL
══════════════════════════════════════════════════ */
function ManufacturersPanel() {
  const qc = useQueryClient()
  const [editingId, setEditingId]     = useState(null)
  const [editLabel, setEditLabel]     = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [addLabel, setAddLabel]       = useState('')
  const [addCountry, setAddCountry]   = useState('')
  const [error, setError]             = useState('')

  const { data: manufacturers = [], isLoading } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: fetchManufacturers,
  })

  const createMutation = useMutation({
    mutationFn: createManufacturer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['manufacturers'] })
      setAddLabel(''); setAddCountry(''); setError('')
    },
    onError: (err) => setError(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, label, country }) => updateManufacturer(id, { label, country }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['manufacturers'] }); setEditingId(null); setError('') },
    onError: (err) => setError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteManufacturer,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manufacturers'] }),
    onError: (err) => setError(err.message),
  })

  function startEdit(m) {
    setEditingId(m.id)
    setEditLabel(m.label)
    setEditCountry(m.country || '')
    setError('')
  }

  function cancelEdit() { setEditingId(null); setError('') }

  function submitEdit(id) {
    if (!editLabel.trim()) return
    updateMutation.mutate({ id, label: editLabel.trim(), country: editCountry.trim() })
  }

  function handleAdd(e) {
    e.preventDefault()
    if (!addLabel.trim()) return
    createMutation.mutate({ label: addLabel.trim(), country: addCountry.trim() })
  }

  function handleDelete(m) {
    if (!window.confirm(`Видалити виробника "${m.label}"?`)) return
    setError('')
    deleteMutation.mutate(m.id)
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Panel header */}
      <div className="px-6 py-4 border-b border-forge-border">
        <h2 className="text-forge-cream font-bold uppercase tracking-wide text-sm">Виробники</h2>
        <p className="text-forge-muted text-xs mt-0.5">{manufacturers.length} записів</p>
      </div>

      {/* Error */}
      {error && (deleteMutation.isError || createMutation.isError || updateMutation.isError) && (
        <div className="mx-6 mt-4 text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2">
          {error}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="px-6 py-8 space-y-2">
            {[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-forge-surface animate-pulse" />)}
          </div>
        )}
        {!isLoading && manufacturers.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 px-6 py-3 border-b border-forge-border/50 group"
          >
            {editingId === m.id ? (
              <>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <input
                    autoFocus
                    value={editLabel}
                    onChange={e => setEditLabel(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') submitEdit(m.id); if (e.key === 'Escape') cancelEdit() }}
                    placeholder="Назва"
                    className={inputClass}
                  />
                  <input
                    value={editCountry}
                    onChange={e => setEditCountry(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') submitEdit(m.id); if (e.key === 'Escape') cancelEdit() }}
                    placeholder="Країна"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => submitEdit(m.id)}
                    disabled={updateMutation.isPending}
                    className="w-7 h-7 flex items-center justify-center text-brand-primary hover:text-brand-light border border-brand-primary/40 hover:border-brand-primary transition-colors"
                  >
                    <CheckIcon />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="w-7 h-7 flex items-center justify-center text-forge-muted hover:text-forge-cream border border-forge-border transition-colors"
                  >
                    <XIcon />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="font-mono text-xs text-forge-muted/60 w-20 flex-shrink-0 truncate">{m.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-forge-cream text-sm truncate">{m.label}</p>
                  {m.country && <p className="text-forge-muted text-xs truncate">{m.country}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(m)}
                    className="w-7 h-7 flex items-center justify-center text-forge-muted hover:text-forge-cream border border-forge-border hover:border-forge-dim transition-colors"
                    aria-label="Редагувати"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(m)}
                    disabled={deleteMutation.isPending}
                    className="w-7 h-7 flex items-center justify-center text-forge-muted hover:text-red-400 border border-forge-border hover:border-red-400/40 transition-colors disabled:opacity-40"
                    aria-label="Видалити"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add row */}
      <form onSubmit={handleAdd} className="px-6 py-4 border-t border-forge-border bg-forge-surface/50">
        <p className="text-forge-muted text-xs uppercase tracking-wider mb-2">Додати виробника</p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            value={addLabel}
            onChange={e => setAddLabel(e.target.value)}
            placeholder="Назва"
            className={inputClass}
          />
          <input
            value={addCountry}
            onChange={e => setAddCountry(e.target.value)}
            placeholder="Країна"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={createMutation.isPending || !addLabel.trim()}
          className="w-full bg-brand-primary hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 uppercase tracking-wide transition-colors"
        >
          {createMutation.isPending ? 'Збереження...' : '+ Додати виробника'}
        </button>
      </form>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function Settings() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-forge-cream text-xl font-bold uppercase tracking-wide">Налаштування каталогу</h1>
        <p className="text-forge-muted text-sm mt-1">
          Керуйте категоріями та виробниками. Видалення заблоковано, якщо товари використовують запис.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-forge-border">
        <div className="bg-forge-dark flex flex-col">
          <CategoriesPanel />
        </div>
        <div className="bg-forge-dark flex flex-col">
          <ManufacturersPanel />
        </div>
      </div>
    </div>
  )
}
