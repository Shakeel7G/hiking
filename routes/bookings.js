import express from 'express';
import db from '../config/db.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

// GET all bookings (admin)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bookings ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET booking by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM bookings WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET bookings by user ID
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query(
      'SELECT * FROM bookings WHERE user_id=$1 ORDER BY hike_date DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      userId, trail_id, hike_date, hike_time, adults, kids, hike_and_bite,
      photography_option, total_price
    } = req.body;

    const result = await db.query(
      `INSERT INTO bookings 
       (user_id, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')
       RETURNING *`,
      [userId, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE booking
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price, status } = req.body;

    const result = await db.query(
      `UPDATE bookings 
       SET trail_id=$1, hike_date=$2, hike_time=$3, adults=$4, kids=$5, hike_and_bite=$6, photography_option=$7, total_price=$8, status=$9
       WHERE id=$10 RETURNING *`,
      [trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price, status, id]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE booking
router.delete('/:id', verifyToken, async (req, res) => {
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
