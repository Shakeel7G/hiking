// routes/admin.js
import express from 'express';

const router = express.Router();

// Test GET
router.get('/', (req, res) => {
  res.json({ message: "Admin route is live ✅" });
});

export default router;
