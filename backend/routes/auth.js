const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const { sql } = require('../db')
const requireAuth = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/login
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Невірний email або пароль' })
    }

    try {
      const { email, password } = req.body
      const rows = await sql`SELECT * FROM admins WHERE email = ${email} LIMIT 1`
      const admin = rows[0]

      if (!admin) {
        return res.status(401).json({ error: 'Невірний email або пароль' })
      }

      const valid = await bcrypt.compare(password, admin.password_hash)
      if (!valid) {
        return res.status(401).json({ error: 'Невірний email або пароль' })
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      res.json({ token, email: admin.email })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// GET /api/auth/me — verify token and return admin info
router.get('/me', requireAuth, (req, res) => {
  res.json({ email: req.admin.email })
})

module.exports = router
