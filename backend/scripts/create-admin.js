/**
 * One-time script to create an admin account.
 * Usage: node scripts/create-admin.js <email> <password>
 * Example: node scripts/create-admin.js admin@example.com mysecretpassword
 */
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { sql } = require('../db')

async function createAdmin(email, password) {
  if (!email || !password) {
    console.error('Usage: node scripts/create-admin.js <email> <password>')
    process.exit(1)
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters')
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 12)
  await sql`
    INSERT INTO admins (email, password_hash)
    VALUES (${email}, ${hash})
  `
  console.log(`Admin created: ${email}`)
  process.exit(0)
}

const [,, email, password] = process.argv
createAdmin(email, password).catch(err => {
  console.error('Failed:', err.message)
  process.exit(1)
})
