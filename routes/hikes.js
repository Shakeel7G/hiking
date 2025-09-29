// routes/hikes.js
import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [hikes] = await db.query('SELECT * FROM hikes');
    res.json(hikes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load hikes' });
  }
});

export default router;
