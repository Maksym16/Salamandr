require('dotenv').config()
const express    = require('express')
const multer     = require('multer')
const cloudinary = require('cloudinary').v2
const requireAuth = require('../middleware/auth')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

const router = express.Router()

// POST /api/upload (protected)
router.post('/', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' })

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'burzhuyka', resource_type: 'image' },
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ url: result.secure_url })
    }
  )
  stream.end(req.file.buffer)
})

module.exports = router
