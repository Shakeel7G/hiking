import express from 'express';
import verifyAdmin from '../middlewares/auth.js';
import db from '../config/db.js';

const router = express.Router();

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

export default router;
