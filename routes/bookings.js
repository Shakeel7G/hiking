// routes/bookings.js
import express from 'express';
import db from '../config/db.js';
import isAuthenticated from '../middlewares/auth.js';

const router = express.Router();

/**
 * Create a booking (auth required)
 */
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id; 
    const {
      trail_id,
      hike_date,
      hike_time,
      adults,
      kids = 0,
      hike_and_bite = 0,
      photography_option = '',
      total_price
    } = req.body;

    if (!trail_id || !hike_date || !hike_time || !adults || !total_price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await db.query(
      `INSERT INTO bookings 
       (user_id, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING id`,
      [userId, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price]
    );

    const booking_id = result.rows[0].id;
    return res.status(201).json({ message: 'Booking created successfully', booking_id });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update booking status (for payments)
 */
router.patch('/:id/status', isAuthenticated, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const rows = await db.query(
      'SELECT user_id FROM bookings WHERE id = $1',
      [bookingId]
    );

    if (!rows.rows.length) return res.status(404).json({ message: 'Booking not found' });

    const booking = rows.rows[0];
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      [status, bookingId]
    );

    res.json({ message: 'Booking status updated successfully' });
  } catch (err) {
    console.error('Update booking status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin: Get all bookings
 */
router.get('/', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const rows = await db.query(
      `SELECT b.id, u.name, u.surname, u.email, t.title AS trail, b.hike_date, b.hike_time,
              b.adults, b.kids, b.hike_and_bite, b.photography_option, b.total_price, b.status
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN trails t ON b.trail_id = t.id
       ORDER BY b.hike_date DESC`
    );

    res.json(rows.rows);
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Customer: Get own bookings
 */
router.get('/my', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;

    const rows = await db.query(
      `SELECT b.id, t.title AS trail, b.hike_date, b.hike_time, b.adults, b.kids,
              b.hike_and_bite, b.photography_option, b.total_price, b.status
       FROM bookings b
       JOIN trails t ON b.trail_id = t.id
       WHERE b.user_id = $1
       ORDER BY b.hike_date DESC`,
      [userId]
    );

    res.json(rows.rows);
  } catch (err) {
    console.error('Get my bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get a single booking by id
 */
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const rows = await db.query(
      `SELECT b.id, b.user_id, t.title AS trail, b.hike_date, b.hike_time, b.adults, b.kids,
              b.hike_and_bite, b.photography_option, b.total_price, b.status
       FROM bookings b
       JOIN trails t ON b.trail_id = t.id
       WHERE b.id = $1`,
      [bookingId]
    );

    if (!rows.rows.length) return res.status(404).json({ message: 'Not found' });

    const booking = rows.rows[0];
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Get booking by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
