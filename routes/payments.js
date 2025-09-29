import express from "express";
import db from "../config/db.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

// Create Payment
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { booking_id, user_id, amount, payment_method } = req.body;

    if (!booking_id || !user_id || !amount || !payment_method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify the user is authorized to make this payment
    if (req.user.id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const [result] = await db.query(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status)
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, user_id, amount, payment_method, "success"]
    );

    // Update booking status to 'paid'
    await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['paid', booking_id]
    );

    res.status(201).json({
      message: "Payment recorded successfully",
      payment_id: result.insertId,
    });
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get payment history for a user
router.get("/user/:user_id", isAuthenticated, async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Verify the user is authorized to view these payments
    if (req.user.id !== parseInt(user_id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const [rows] = await db.query(
      `SELECT p.*, b.trail_id, t.title as trail_name
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       JOIN trails t ON b.trail_id = t.id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get payments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;