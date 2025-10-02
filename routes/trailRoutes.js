// routes/trailRoutes.js
import express from 'express';
import db from '../config/db.js'; // make sure this path matches your project

const router = express.Router();

// GET /api/trails  -> returns up to 100 trails (adjust LIMIT as needed)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM trails ORDER BY id DESC LIMIT 100');
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching trails:', err);
    return res.status(500).json({ error: 'Failed to fetch trails' });
  }
});

// GET /api/trails/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM trails WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Trail not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching trail by id:', err);
    return res.status(500).json({ error: 'Failed to fetch trail' });
  }
});

// POST /api/trails
router.post('/', async (req, res) => {
  const { name, location, difficulty, distance, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO trails (name, location, difficulty, distance, description)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, location, difficulty, distance, description]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating trail:', err);
    return res.status(500).json({ error: 'Failed to create trail' });
  }
});

// PUT /api/trails/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, difficulty, distance, description } = req.body;
  try {
    const result = await db.query(
      `UPDATE trails SET name=$1, location=$2, difficulty=$3, distance=$4, description=$5
       WHERE id=$6 RETURNING *`,
      [name, location, difficulty, distance, description, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Trail not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating trail:', err);
    return res.status(500).json({ error: 'Failed to update trail' });
  }
});

// DELETE /api/trails/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM trails WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Trail not found' });
    return res.json({ message: 'Deleted', trail: result.rows[0] });
  } catch (err) {
    console.error('Error deleting trail:', err);
    return res.status(500).json({ error: 'Failed to delete trail' });
  }
});

export default router;
