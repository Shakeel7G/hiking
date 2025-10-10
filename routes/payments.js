// routes/payments.js
import express from "express";
import db from "../config/db.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

// ✅ Make a mock payment
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { booking_id, payment_method, amount } = req.body;
    const user_id = req.user.id;

    if (!booking_id || !payment_method || amount === undefined) {
      return res.status(400).json({ message: "Missing payment info" });
    }

    // Check if booking exists
    const booking = await db.query(`SELECT * FROM bookings WHERE id = $1 AND user_id = $2`, [booking_id, user_id]);
    if (!booking.rows.length) return res.status(404).json({ message: "Booking not found" });

    // Insert mock payment
    const payment = await db.query(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, 'completed')
       RETURNING *`,
      [booking_id, user_id, amount, payment_method]
    );

    // Update booking to paid
    await db.query(`UPDATE bookings SET status = 'paid' WHERE id = $1`, [booking_id]);

    res.status(201).json({ message: "Payment successful", payment: payment.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing payment", error: err.message });
  }
});

// ✅ Get user's payments
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await db.query(
      `SELECT p.*, b.trail_id, t.title AS trail
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       JOIN trails t ON b.trail_id = t.id
       WHERE p.user_id = $1
       ORDER BY p.id DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

export default router;
