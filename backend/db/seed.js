require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

const products = [
  // Sauna
  {
    name: 'Harvia Legend 150', category_id: 'sauna', manufacturer_id: 'harvia',
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 15 кВт', "Об'єм: 8–15 м³", 'Камені: 40 кг', 'Нержавіюча сталь'],
  },
  {
    name: 'Harvia Cilindro', category_id: 'sauna', manufacturer_id: 'harvia',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 8 кВт', "Об'єм: 5–8 м³", 'Вертикальний дизайн', 'Матеріал: сталь'],
  },
  {
    name: 'Helo Rocher 60', category_id: 'sauna', manufacturer_id: 'helo',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 6 кВт', "Об'єм: 4–7 м³", 'Камені: 30 кг', 'Фінське виробництво'],
  },
  {
    name: 'Tulikivi Sumu', category_id: 'sauna', manufacturer_id: 'tulikivi',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 10.5 кВт', "Об'єм: 6–10 м³", 'Мильний камінь', 'Тривале тепло 12+ год'],
  },
  // Heating
  {
    name: 'Bulerjan Type 00', category_id: 'heating', manufacturer_id: 'bulerjan',
    image: 'https://images.unsplash.com/photo-1574018832944-d1d13c1e5e4b?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 6 кВт', 'Опалення: до 100 м²', 'Паливо: дрова', 'Конвекційна система'],
  },
  {
    name: 'Jøtul F 100', category_id: 'heating', manufacturer_id: 'jotul',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 8 кВт', 'Опалення: до 140 м²', 'Чавун', 'ККД: 79%'],
  },
  {
    name: 'Keddy K 360', category_id: 'heating', manufacturer_id: 'keddy',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 7 кВт', 'Опалення: до 120 м²', 'Сталь + кераміка', 'Сучасний дизайн'],
  },
  {
    name: 'Virestar 100', category_id: 'heating', manufacturer_id: 'virestar',
    image: 'https://images.unsplash.com/photo-1601084881623-cdf9a8ea480c?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 10 кВт', 'Опалення: до 200 м²', 'Паливо: вугілля/дрова', 'Довготривале горіння'],
  },
  // Fireplace
  {
    name: 'Kratki Nico 50', category_id: 'fireplace', manufacturer_id: 'kratki',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 9 кВт', 'Скло: 500 × 390 мм', 'Паливо: дрова', 'Скло без рамки'],
  },
  {
    name: 'Schmid Lina 67/45', category_id: 'fireplace', manufacturer_id: 'schmid',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 10 кВт', 'ККД: 82%', 'Вермикуліт', 'Швейцарська якість'],
  },
  {
    name: 'Spartherm Varia', category_id: 'fireplace', manufacturer_id: 'spartherm',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 8 кВт', 'Модульна система', 'Різні варіанти скла', 'Сучасний стиль'],
  },
  {
    name: 'Romotop Nadia', category_id: 'fireplace', manufacturer_id: 'romotop',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop&q=80',
    specs: ['Потужність: 11 кВт', 'ККД: 80%', 'Акумуляційна маса', 'Довготривале тепло'],
  },
]

async function seed() {
  console.log('Seeding products...')
  for (const p of products) {
    await sql`
      INSERT INTO products (name, category_id, manufacturer_id, image, specs)
      VALUES (${p.name}, ${p.category_id}, ${p.manufacturer_id}, ${p.image}, ${p.specs})
    `
  }
  console.log(`Seeded ${products.length} products successfully.`)
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
