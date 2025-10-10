import express from "express";
import db from "../config/db.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

// ✅ Create a mock payment
router.post("/", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { booking_id, amount, payment_method } = req.body;

    if (!booking_id || !amount || !payment_method) {
      return res.status(400).json({ message: "Missing payment info" });
    }

    // Insert into payments table
    const payment = await db.query(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status)
       VALUES ($1,$2,$3,$4,'paid') RETURNING *`,
      [booking_id, user_id, amount, payment_method]
    );

    // Update booking status to paid
    await db.query(`UPDATE bookings SET status='paid' WHERE id=$1 AND user_id=$2`, [booking_id, user_id]);

    res.json({ message: "Payment successful", payment: payment.rows[0] });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
