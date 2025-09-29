
import express from 'express';
import db from '../config/db.js';
const router = express.Router();

router.get('/api/areas', async (req, res) => {
  const [areas] = await db.query('SELECT * FROM areas');
  res.json(areas);
});


router.get('/areas', async (req, res) => {
  try {
    // Query to get all areas from the database
    const [areas] = await db.query('SELECT * FROM areas ORDER BY name');
    res.json(areas);
  } catch (err) {
    console.error('Error fetching areas:', err);
    res.status(500).json({ message: 'Server error' });
  }
}); 

export default router;



