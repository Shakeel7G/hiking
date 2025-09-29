//routes/trailRoutes.js:
import express from 'express';
import Trail from '../models/trailModel.js';
import trailController from '../controllers/trailController.js';


const router = express.Router();

// Route to get all trails, grouped by area
router.get('/trails', trailController.getTrailsByArea);


// Route to get a single trail by ID
// router.get('/trails/:id', trailController.getTrailById);


router.get('/trails/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const trail = await Trail.getById(id);
    if (!trail) return res.status(404).json({ message: 'Trail not found' });
    res.json(trail);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get trails by area ID
router.get('/areas/:areaId/trails', async (req, res) => {
  const areaId = req.params.areaId;
  const [trails] = await db.query('SELECT * FROM trails WHERE area_id = ?', [areaId]);
  res.json(trails);
});

// routes/trailRoutes.js - Add this route
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


