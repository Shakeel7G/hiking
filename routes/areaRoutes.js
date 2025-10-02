import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all areas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM areas ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching areas:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET area by ID (optional, if needed)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM areas WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Area not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching area:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
