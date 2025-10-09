import express from "express";
import db from "../config/db.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// ✅ MAKE PAYMENT
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { booking_id, amount, payment_method } = req.body;

    if (!booking_id || !amount || !payment_method) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Get user from token
    const user_id = req.user.id;

    // Check if booking exists for that user
    const bookingCheck = await db.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [booking_id, user_id]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found for this user" });
    }

    // Insert payment record
    const result = await db.query(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, 'paid')
       RETURNING *`,
      [booking_id, user_id, amount, payment_method]
    );

    // Update booking status
    await db.query(
      "UPDATE bookings SET status = 'paid' WHERE id = $1",
      [booking_id]
    );

    res.status(201).json({
      message: "Payment successful",
      payment: result.rows[0],
    });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
