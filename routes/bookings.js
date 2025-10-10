import express from "express";
import db from "../config/db.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

// ✅ Create a booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      trail_id,
      hike_date,
      hike_time,
      adults,
      kids = 0,
      hike_and_bite = 0,
      photography_option = null,
      total_price
    } = req.body;

    if (!trail_id || !hike_date || !hike_time || !adults || !total_price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await db.query(
      `INSERT INTO bookings 
       (user_id, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')
       RETURNING *`,
      [user_id, trail_id, hike_date, hike_time, adults, kids, hike_and_bite, photography_option, total_price]
    );

    res.status(201).json({ message: "Booking created", booking_id: result.rows[0].id });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get user's bookings
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(
      `SELECT b.*, t.title AS trail_title, t.image_url
       FROM bookings b
       JOIN trails t ON b.trail_id = t.id
       WHERE b.user_id = $1
       ORDER BY b.hike_date DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get single booking
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      `SELECT b.*, t.title AS trail_title, t.image_url
       FROM bookings b
       JOIN trails t ON b.trail_id = t.id
       WHERE b.id=$1 AND b.user_id=$2`,
      [id, user_id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Booking not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Update booking status (after payment)
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *`,
      [status, id, user_id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Booking not found or not yours" });

    res.json({ message: "Booking status updated", booking: result.rows[0] });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
