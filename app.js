// app.js
import express from 'express'; 

import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import dotenv from 'dotenv';
import trailRoutes from './routes/trailRoutes.js'; // Import trailRoutes // Shakeel
import hikesRoutes from './routes/hikes.js';
import authRoutes from './routes/auth.js';

import adminRoutes from './routes/admin.js';

import bookingsRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payments.js';

// import paymentsRouter from './routes/payments.js'; // added on: 2025-08-19


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(cors()); // allow frontend to call backend

// serve static images in backend/public/images at URL /images/*
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Simple test route to verify server is working
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Routes
app.use('/api', trailRoutes); // Shakeel
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentRoutes);
// app.use("/api/payments", paymentsRouter); // added on: 2025-08-19
app.use('/api', authRoutes); // for /register and /login
app.use('/api', adminRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


