// routes/bookings.js
import express from "express";
import db from "../config/db.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

// ✅ Create a booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { trail_id, hike_date, adults, kids = 0, hike_and_bite = 0, photography_option = null, total_price } = req.body;
    const user_id = req.user.id;

    if (!trail_id || !hike_date || !adults || total_price === undefined) {
      return res.status(400).json({ message: "Missing required booking info" });
    }

    const result = await db.query(
      `INSERT INTO bookings
      (user_id, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price, status)
      VALUES ($1, $2, $3, '09:00', $4, $5, $6, $7, $8, 'pending')
      RETURNING *`,
      [user_id, trail_id, hike_date, adults, kids, hike_and_bite, photography_option, total_price]
    );

    res.status(201).json({ message: "Booking created", booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
});

// ✅ Get user's bookings
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await db.query(
      `SELECT b.*, t.title AS trail
       FROM bookings b
       JOIN trails t ON b.trail_id = t.id
       WHERE b.user_id = $1
       ORDER BY b.hike_date DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
});

// ✅ Update booking status
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;

    const allowedStatuses = ["pending", "paid", "cancelled"];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const result = await db.query(
      `UPDATE bookings
       SET status = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, id, user_id]
    );

    if (!result.rows.length) return res.status(404).json({ message: "Booking not found or not yours" });
    res.json({ message: "Booking status updated", booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating booking", error: err.message });
  }
});

export default router;
