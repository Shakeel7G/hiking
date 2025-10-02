// config/db.js
import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false },  // fix for Render + Supabase
});

db.connect((err) => {
  if (err) {
    console.error('Supabase/Postgres connection error:', err);
    return;
  }
  console.log('Connected to Supabase PostgreSQL DB!');
});

export default db;
