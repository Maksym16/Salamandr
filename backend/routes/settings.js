const express     = require('express')
const { sql }     = require('../db')
const requireAuth = require('../middleware/auth')

const router = express.Router()

function toSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9Ѐ-ӿ-]/g, '')
    .slice(0, 50)
}

/* ══════════════ CATEGORIES ══════════════ */

// POST /api/settings/categories
router.post('/categories', requireAuth, async (req, res) => {
  const { label } = req.body
  if (!label?.trim()) return res.status(400).json({ error: 'label is required' })

  const id = toSlug(label)
  if (!id) return res.status(400).json({ error: 'Could not generate id from label' })

  try {
    const rows = await sql`
      INSERT INTO categories (id, label) VALUES (${id}, ${label.trim()})
      RETURNING *
    `
    res.status(201).json(rows[0])
  } catch (err) {
    if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
      return res.status(409).json({ error: 'Category with this id already exists' })
    }
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/settings/categories/:id
router.put('/categories/:id', requireAuth, async (req, res) => {
  const { label } = req.body
  if (!label?.trim()) return res.status(400).json({ error: 'label is required' })

  try {
    const rows = await sql`
      UPDATE categories SET label = ${label.trim()} WHERE id = ${req.params.id} RETURNING *
    `
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/settings/categories/:id
router.delete('/categories/:id', requireAuth, async (req, res) => {
  try {
    const used = await sql`SELECT COUNT(*)::int AS n FROM products WHERE category_id = ${req.params.id}`
    if (used[0].n > 0) {
      return res.status(422).json({ error: `Неможливо видалити: ${used[0].n} товар(ів) використовують цю категорію` })
    }
    const rows = await sql`DELETE FROM categories WHERE id = ${req.params.id} RETURNING id`
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ══════════════ MANUFACTURERS ══════════════ */

// POST /api/settings/manufacturers
router.post('/manufacturers', requireAuth, async (req, res) => {
  const { label, country } = req.body
  if (!label?.trim()) return res.status(400).json({ error: 'label is required' })

  const id = toSlug(label)
  if (!id) return res.status(400).json({ error: 'Could not generate id from label' })

  try {
    const rows = await sql`
      INSERT INTO manufacturers (id, label, country)
      VALUES (${id}, ${label.trim()}, ${country?.trim() || null})
      RETURNING *
    `
    res.status(201).json(rows[0])
  } catch (err) {
    if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
      return res.status(409).json({ error: 'Manufacturer with this id already exists' })
    }
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/settings/manufacturers/:id
router.put('/manufacturers/:id', requireAuth, async (req, res) => {
  const { label, country } = req.body
  if (!label?.trim()) return res.status(400).json({ error: 'label is required' })

  try {
    const rows = await sql`
      UPDATE manufacturers SET label = ${label.trim()}, country = ${country?.trim() || null}
      WHERE id = ${req.params.id} RETURNING *
    `
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/settings/manufacturers/:id
router.delete('/manufacturers/:id', requireAuth, async (req, res) => {
  try {
    const used = await sql`SELECT COUNT(*)::int AS n FROM products WHERE manufacturer_id = ${req.params.id}`
    if (used[0].n > 0) {
      return res.status(422).json({ error: `Неможливо видалити: ${used[0].n} товар(ів) використовують цього виробника` })
    }
    const rows = await sql`DELETE FROM manufacturers WHERE id = ${req.params.id} RETURNING id`
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
