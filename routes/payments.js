// routes/payments.js
import express from "express";
import db from "../config/db.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

/**
 * Create Payment
 */
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { booking_id, amount, payment_method } = req.body;
    const user_id = req.user.id;

    // ✅ Validate required fields
    if (!booking_id || !amount || !payment_method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Insert payment record
    const result = await db.query(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, 'success')
       RETURNING id`,
      [booking_id, user_id, amount, payment_method]
    );

    // ✅ Update booking status
    await db.query(`UPDATE bookings SET status = 'paid' WHERE id = $1`, [booking_id]);

    res.status(201).json({
      message: "Payment recorded successfully",
      payment_id: result.rows[0].id,
    });
  } catch (err) {
    console.error("💥 Payment Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * Get payment history for a user
 */
router.get("/user/:user_id", isAuthenticated, async (req, res) => {
  try {
    const { user_id } = req.params;

    // ✅ Verify authorization
    if (req.user.id !== parseInt(user_id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ Fetch payments with joined booking/trail info
    const result = await db.query(
      `SELECT p.*, b.trail_id, t.title AS trail_name
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       JOIN trails t ON b.trail_id = t.id
       WHERE p.user_id = $1
       ORDER BY p.id DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("💥 Get payments error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
