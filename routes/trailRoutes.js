import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all trails
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM trails ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single trail
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM trails WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Trail not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
