require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { sql } = require('./index')

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS hero_carousel (
      id         SERIAL PRIMARY KEY,
      url        TEXT NOT NULL,
      public_id  VARCHAR(500) NOT NULL,
      alt        VARCHAR(255) DEFAULT '',
      position   INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Migration: hero_carousel table ready')

  await sql`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC(12, 0)
  `
  console.log('Migration: products.price column ready')

  process.exit(0)
}

migrate().catch(err => { console.error(err); process.exit(1) })
