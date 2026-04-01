const express = require('express')
const { body, param, validationResult } = require('express-validator')
const { sql } = require('../db')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// GET /api/products/categories (must be before /:id)
router.get('/categories', async (_req, res) => {
  try {
    const cats = await sql`SELECT * FROM categories ORDER BY id`
    res.json(cats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/products/manufacturers (must be before /:id)
router.get('/manufacturers', async (_req, res) => {
  try {
    const mfrs = await sql`SELECT * FROM manufacturers ORDER BY label`
    res.json(mfrs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/products
router.get('/', async (_req, res) => {
  try {
    const products = await sql`
      SELECT
        p.*,
        c.label AS category_label,
        m.label AS manufacturer_label,
        m.country
      FROM products p
      LEFT JOIN categories    c ON c.id = p.category_id
      LEFT JOIN manufacturers m ON m.id = p.manufacturer_id
      ORDER BY p.id
    `
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', param('id').isInt(), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid id' })

  try {
    const rows = await sql`SELECT * FROM products WHERE id = ${req.params.id}`
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/products (protected)
router.post('/',
  requireAuth,
  body('name').notEmpty().trim(),
  body('category_id').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, category_id, manufacturer_id, image, specs, is_on_sale } = req.body
    try {
      const rows = await sql`
        INSERT INTO products (name, category_id, manufacturer_id, image, specs, is_on_sale)
        VALUES (${name}, ${category_id}, ${manufacturer_id || null}, ${image || null}, ${specs || []}, ${is_on_sale ?? false})
        RETURNING *
      `
      res.status(201).json(rows[0])
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// PUT /api/products/:id (protected)
router.put('/:id',
  requireAuth,
  param('id').isInt(),
  body('name').notEmpty().trim(),
  body('category_id').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, category_id, manufacturer_id, image, specs, is_on_sale } = req.body
    try {
      const rows = await sql`
        UPDATE products SET
          name            = ${name},
          category_id     = ${category_id},
          manufacturer_id = ${manufacturer_id || null},
          image           = ${image || null},
          specs           = ${specs || []},
          is_on_sale      = ${is_on_sale ?? false},
          updated_at      = NOW()
        WHERE id = ${req.params.id}
        RETURNING *
      `
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      res.json(rows[0])
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// DELETE /api/products/:id (protected)
router.delete('/:id', requireAuth, param('id').isInt(), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid id' })

  try {
    const rows = await sql`DELETE FROM products WHERE id = ${req.params.id} RETURNING id`
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json({ deleted: rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
