CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id    VARCHAR(50) PRIMARY KEY,
  label VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS manufacturers (
  id      VARCHAR(50) PRIMARY KEY,
  label   VARCHAR(255) NOT NULL,
  country VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  category_id     VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
  manufacturer_id VARCHAR(50) REFERENCES manufacturers(id) ON DELETE SET NULL,
  image           VARCHAR(500),
  specs           TEXT[],
  is_on_sale      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Seed categories
INSERT INTO categories (id, label) VALUES
  ('sauna',     'Печі для саун'),
  ('heating',   'Опалювальні печі'),
  ('fireplace', 'Каміни')
ON CONFLICT (id) DO NOTHING;

-- Seed manufacturers
INSERT INTO manufacturers (id, label, country) VALUES
  ('harvia',    'Harvia',    'Фінляндія'),
  ('helo',      'Helo',      'Фінляндія'),
  ('tulikivi',  'Tulikivi',  'Фінляндія'),
  ('bulerjan',  'Bulerjan',  'Чехія'),
  ('jotul',     'Jøtul',     'Норвегія'),
  ('keddy',     'Keddy',     'Швеція'),
  ('virestar',  'Virestar',  'Польща'),
  ('kratki',    'Kratki',    'Польща'),
  ('schmid',    'Schmid',    'Швейцарія'),
  ('spartherm', 'Spartherm', 'Німеччина'),
  ('romotop',   'Romotop',   'Чехія')
ON CONFLICT (id) DO NOTHING;
