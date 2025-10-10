import express from "express";
import db from "../config/db.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

// Create booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { trail_id, hike_date, hike_time, adults, kids = 0, hike_and_bite = 0, photography_option = null, total_price } = req.body;

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

    res.status(201).json({ message: "Booking created successfully", booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
});

// Get user bookings
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

// Get single booking
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await db.query(
      `SELECT b.*, t.title AS trail
       FROM bookings b
       JOIN trails t ON b.trail_id = t.id
       WHERE b.id=$1 AND b.user_id=$2`,
      [id, user_id]
    );

    if (!result.rows.length) return res.status(404).json({ message: "Booking not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching booking", error: err.message });
  }
});

// Mock payment
router.put("/:id/pay", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await db.query(
      `UPDATE bookings SET status='paid'
       WHERE id=$1 AND user_id=$2
       RETURNING *`,
      [id, user_id]
    );

    if (!result.rows.length) return res.status(404).json({ message: "Booking not found or not yours" });
    res.json({ message: "Payment successful", booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating payment", error: err.message });
  }
});

export default router;
