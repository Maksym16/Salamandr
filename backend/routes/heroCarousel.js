require('dotenv').config()
const express    = require('express')
const cloudinary = require('cloudinary').v2
const { sql }    = require('../db')
const requireAuth = require('../middleware/auth')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_IMAGES = 5

const router = express.Router()

// GET /api/hero-carousel — public
router.get('/', async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM hero_carousel ORDER BY position ASC, created_at ASC`
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/hero-carousel — protected
router.post('/', requireAuth, async (req, res) => {
  const { url, public_id, alt } = req.body
  if (!url || !public_id) return res.status(400).json({ error: 'url and public_id are required' })
  try {
    const count = await sql`SELECT COUNT(*)::int AS n FROM hero_carousel`
    if (count[0].n >= MAX_IMAGES) {
      return res.status(422).json({ error: `Maximum ${MAX_IMAGES} images allowed` })
    }
    const position = count[0].n
    const rows = await sql`
      INSERT INTO hero_carousel (url, public_id, alt, position)
      VALUES (${url}, ${public_id}, ${alt || ''}, ${position})
      RETURNING *
    `
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/hero-carousel/:id — protected
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM hero_carousel WHERE id = ${req.params.id}`
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })

    await cloudinary.uploader.destroy(rows[0].public_id)
    await sql`DELETE FROM hero_carousel WHERE id = ${req.params.id}`

    // Re-normalise positions
    await sql`
      UPDATE hero_carousel c
      SET position = sub.rn - 1
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY position ASC, created_at ASC) AS rn
        FROM hero_carousel
      ) sub
      WHERE c.id = sub.id
    `

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
