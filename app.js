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
import areaRoutes from './routes/areaRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://into-the-land.vercel.app' })); // remove trailing slash

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Root route
app.get("/", (req, res) => res.send("Backend is running ✅"));

// Test routes
app.get('/test', (req, res) => res.send('Server OK'));

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT 1+1 AS result');
    res.json({ result: result.rows[0].result });
  } catch (err) {
    res.status(500).json({ message: err.message, code: err.code });
  }
});

// API Routes
app.use('/api/trails', trailRoutes);
app.use('/api/hikes', hikesRoutes);
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/areas', areaRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
