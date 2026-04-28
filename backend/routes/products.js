const express = require('express')
const { body, param, validationResult } = require('express-validator')
const { sql } = require('../db')
const requireAuth = require('../middleware/auth')
const { categories, manufacturers, getEnrichedProducts } = require('../db/seedData')

const router = express.Router()

// GET /api/products/categories (must be before /:id)
router.get('/categories', async (_req, res) => {
  try {
    const cats = await sql`SELECT * FROM categories ORDER BY id`
    res.json(cats)
  } catch (_err) {
    res.json(categories)
  }
})

// GET /api/products/manufacturers (must be before /:id)
router.get('/manufacturers', async (_req, res) => {
  try {
    const mfrs = await sql`SELECT * FROM manufacturers ORDER BY label`
    res.json(mfrs)
  } catch (_err) {
    res.json([...manufacturers].sort((a, b) => a.label.localeCompare(b.label)))
  }
})

// GET /api/products/slug/:slug (must be before /:id)
router.get('/slug/:slug', async (req, res) => {
  try {
    const rows = await sql`
      SELECT
        p.*,
        c.label AS category_label,
        m.label AS manufacturer_label,
        m.country
      FROM products p
      LEFT JOIN categories    c ON c.id = p.category_id
      LEFT JOIN manufacturers m ON m.id = p.manufacturer_id
      WHERE p.slug = ${req.params.slug}
    `
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (_err) {
    const product = getEnrichedProducts().find(p => p.slug === req.params.slug)
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
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
  } catch (_err) {
    res.json(getEnrichedProducts())
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

    const { name, category_id, manufacturer_id, image, images, specs, spec_columns, is_on_sale, description, slug, price } = req.body
    try {
      const rows = await sql`
        INSERT INTO products (name, category_id, manufacturer_id, image, images, specs, spec_columns, is_on_sale, description, slug, price)
        VALUES (
          ${name}, ${category_id}, ${manufacturer_id || null}, ${image || null},
          ${images || null}, ${specs || []}, ${spec_columns || null}, ${is_on_sale ?? false}, ${description || null}, ${slug || null},
          ${price != null && price !== '' ? Number(price) : null}
        )
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

    const { name, category_id, manufacturer_id, image, images, specs, spec_columns, is_on_sale, description, slug, price } = req.body
    try {
      const rows = await sql`
        UPDATE products SET
          name            = ${name},
          category_id     = ${category_id},
          manufacturer_id = ${manufacturer_id || null},
          image           = ${image || null},
          images          = ${images || null},
          specs           = ${specs || []},
          spec_columns    = ${spec_columns || null},
          is_on_sale      = ${is_on_sale ?? false},
          description     = ${description || null},
          slug            = ${slug || null},
          price           = ${price != null && price !== '' ? Number(price) : null},
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
