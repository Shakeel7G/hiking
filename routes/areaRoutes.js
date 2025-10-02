import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all areas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM areas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET area by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM areas WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Area not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new area
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await db.query(
      'INSERT INTO areas (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE area
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await db.query(
      'UPDATE areas SET name=$1, description=$2 WHERE id=$3 RETURNING *',
      [name, description, id]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'Area not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE area
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM areas WHERE id=$1 RETURNING *', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Area not found' });
    res.json({ message: 'Area deleted', area: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
