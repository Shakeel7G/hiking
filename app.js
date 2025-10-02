// app.js
import express from 'express'; 
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
// Routes
import trailRoutes from './routes/trailRoutes.js';
import hikesRoutes from './routes/hikes.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import bookingsRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payments.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://into-the-land.netlify.app' }))

// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Test route
app.get('/test', (req, res) => res.send('Server OK'));

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1+1 AS result');
    res.json({ result: rows[0].result });
  } catch (err) {
    res.status(500).json({ message: err.message, code: err.code });
  }
});
// API Routes (all prefixed with /api)
app.use('/api/trails', trailRoutes);      // e.g., /api/trails
app.use('/api/hikes', hikesRoutes);       // e.g., /api/hikes
app.use('/api/auth', authRoutes);         // e.g., /api/auth/login, /api/auth/register
app.use('/api/admin', adminRoutes);       // e.g., /api/admin/...
app.use('/api/bookings', bookingsRoutes); // e.g., /api/bookings/...
app.use('/api/payments', paymentRoutes);  // e.g., /api/payments/...

// 404 fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
