// routes/payments.js
import express from 'express';

const router = express.Router();

// Test GET
router.get('/', (req, res) => {
  res.json({ message: "Payments route is live ✅" });
});

// Test POST
router.post('/', (req, res) => {
  res.json({ message: "Payment created (test) ✅", data: req.body });
});

export default router;
