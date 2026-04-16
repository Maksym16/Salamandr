require('dotenv').config()
const express     = require('express')
const cloudinary  = require('cloudinary').v2
const { sql }     = require('../db')
const requireAuth = require('../middleware/auth')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const router = express.Router()

// GET /api/gallery — public
router.get('/', async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM gallery_images ORDER BY created_at DESC`
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/gallery — protected
router.post('/', requireAuth, async (req, res) => {
  const { url, public_id, title } = req.body
  if (!url) return res.status(400).json({ error: 'url is required' })
  try {
    const rows = await sql`
      INSERT INTO gallery_images (url, public_id, title)
      VALUES (${url}, ${public_id || null}, ${title || null})
      RETURNING *
    `
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/gallery/:id — protected
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT public_id FROM gallery_images WHERE id = ${req.params.id}`
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })

    const { public_id } = rows[0]

    // Delete from Cloudinary if we have the public_id
    if (public_id) {
      await cloudinary.uploader.destroy(public_id)
    }

    await sql`DELETE FROM gallery_images WHERE id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
