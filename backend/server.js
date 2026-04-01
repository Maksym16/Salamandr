require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoutes     = require('./routes/auth')
const productsRoutes = require('./routes/products')
const uploadRoute    = require('./routes/upload')

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth',     authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/upload',   uploadRoute)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
