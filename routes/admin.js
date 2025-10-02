import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM users WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all bookings
router.get('/bookings', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bookings ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM bookings WHERE id=$1 RETURNING *', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted', booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
