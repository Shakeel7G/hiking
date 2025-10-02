import express from 'express';
import db from '../config/db.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

// GET all payments (admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM payments ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET payment by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM payments WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new payment
router.post('/', verifyToken, async (req, res) => {
  try {
    const { booking_id, amount, payment_method, status } = req.body;

    const result = await db.query(
      `INSERT INTO payments (booking_id, amount, payment_method, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [booking_id, amount, payment_method, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE payment
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { booking_id, amount, payment_method, status } = req.body;

    const result = await db.query(
      `UPDATE payments 
       SET booking_id=$1, amount=$2, payment_method=$3, status=$4
       WHERE id=$5 RETURNING *`,
      [booking_id, amount, payment_method, status, id]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE payment
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM payments WHERE id=$1 RETURNING *', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted', payment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
