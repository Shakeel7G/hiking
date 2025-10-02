// config/db.js
import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
  host: process.env.DB_HOST,                  // e.g., db.izgzacmosardfrftumdu.supabase.co
  user: process.env.DB_USER,                  // Supabase DB username
  password: process.env.DB_PASS,              // Supabase DB password
  database: process.env.DB_NAME,              // Supabase database name
  port: process.env.DB_PORT || 5432,          // Postgres default port
  ssl: { rejectUnauthorized: false },         // required for Render + Supabase
});

db.connect(err => {
  if (err) {
    console.error('Supabase/Postgres connection error:', err);
  } else {
    console.log('Connected to Supabase PostgreSQL DB!');
  }
});

export default db;
