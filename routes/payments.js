
import express from "express";
import db from "../config/db.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

/**
 * ✅ Create payment for a booking
 * This route should be called from Pay.vue after a booking is made.
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { booking_id, amount, payment_method, payment_status } = req.body;
    const user_id = req.user.id;

    if (!booking_id || !amount || !payment_method) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Check that the booking exists and belongs to this user
    const bookingCheck = await db.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [booking_id, user_id]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found or not yours" });
    }

    // Insert payment record
    const paymentResult = await db.query(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [booking_id, user_id, amount, payment_method, payment_status || "completed"]
    );

    // Update the booking status to "paid"
    await db.query(
      `UPDATE bookings
       SET status = 'paid'
       WHERE id = $1`,
      [booking_id]
    );

    res.status(201).json({
      message: "Payment processed successfully",
      payment: paymentResult.rows[0],
    });
  } catch (err) {
    console.error("Payment processing error:", err);
    res.status(500).json({ message: "Error processing payment", error: err.message });
  }
});

/**
 * ✅ Get all payments for a logged-in user
 */
router.get("/my-payments", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(
      `SELECT p.*, b.hike_date, b.total_price, t.title AS trail_title
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       JOIN trails t ON b.trail_id = t.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

export default router;
