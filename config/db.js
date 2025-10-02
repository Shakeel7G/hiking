// config/db.js
import pkg from 'pg';
const { Pool } = pkg;

// Supavisor transaction mode connection
const db = new Pool({
  host: process.env.DB_HOST,                // Supavisor host, e.g., aws-0-eu-central-1.pooler.supabase.com
  user: process.env.DB_USER,                // Supabase DB username
  password: process.env.DB_PASS,            // Supabase DB password
  database: process.env.DB_NAME,            // Database name (usually postgres)
  port: process.env.DB_PORT || 6543,        // Supavisor transaction port
  ssl: { rejectUnauthorized: false },       // Required for Render + Supabase
  max: 10,                                  // Max connections in pool
  idleTimeoutMillis: 30000,                 // Idle timeout
  connectionTimeoutMillis: 2000,            // Connection timeout
  application_name: 'into-the-land-backend',
  options: '-c pool_mode=transaction',      // Force Supavisor transaction mode
  family: 4                                 // Force IPv4 to avoid ENETUNREACH
});

// Test connection
db.connect(err => {
  if (err) {
    console.error('Supavisor/Postgres connection error:', err);
  } else {
    console.log('Connected to Supabase via Supavisor Transaction Pool!');
  }
});

export default db;
