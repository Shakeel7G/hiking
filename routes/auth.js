import express from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const router = express.Router();

// ✅ REGISTER USER
router.post("/register", async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into Supabase
    const result = await db.query(
      `INSERT INTO users (name, surname, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, surname, email, role`,
      [name, surname, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ LOGIN USER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
