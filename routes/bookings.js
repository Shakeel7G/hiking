import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bookings ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET booking by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM bookings WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new booking
router.post('/', async (req, res) => {
  try {
    const { userId, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price } = req.body;

    const result = await db.query(
      `INSERT INTO bookings 
       (user_id, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending') RETURNING *`,
      [userId, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE booking
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(
      'UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
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
