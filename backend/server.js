require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')
const fs      = require('fs')

console.log('[startup] Node version:', process.version)
console.log('[startup] NODE_ENV:', process.env.NODE_ENV)
console.log('[startup] PORT:', process.env.PORT)
console.log('[startup] DATABASE_URL set:', !!process.env.DATABASE_URL)
console.log('[startup] JWT_SECRET set:', !!process.env.JWT_SECRET)
console.log('[startup] CLOUDINARY_CLOUD_NAME set:', !!process.env.CLOUDINARY_CLOUD_NAME)

const distPath = path.join(__dirname, './dist')
console.log('[startup] dist path:', distPath)
console.log('[startup] dist exists:', fs.existsSync(distPath))

console.log('[startup] Loading routes...')
const authRoutes     = require('./routes/auth')
const productsRoutes = require('./routes/products')
const uploadRoute    = require('./routes/upload')
console.log('[startup] Routes loaded OK')

const app  = express()
const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }))
}
app.use(express.json())

app.use('/api/auth',     authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/upload',   uploadRoute)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Serve built frontend
app.use(express.static(distPath))

// SPA fallback — all non-API routes return index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`[startup] Server running on port ${PORT}`)
})
