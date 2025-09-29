// controllers/trailController.js
import Trail from '../models/trailModel.js';
const port = process.env.PORT || 4000;


const getFullImageUrl = (imagePath) => {
  return `http://localhost:${port}${imagePath}`;
};


const getTrailsByArea = async (req, res) => {
  try {
    const results = await Trail.getAll();
    const trailsByArea = {};
    results.forEach(trail => {
      if (!trailsByArea[trail.area]) {
        trailsByArea[trail.area] = [];
      }
      trailsByArea[trail.area].push({
        id: trail.id,
        title: trail.title,
        image: getFullImageUrl(trail.image_url),
        description: trail.description,
         difficulty: trail.difficulty
      });
    });
    res.json(trailsByArea);
  } catch (error) {
    console.error('Error in getTrailsByArea:', error);
    res.status(500).send(error);
  }
};


const getAllAreas = async (req, res) => {
  try {
    const query = 'SELECT * FROM areas ORDER BY name';
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    res.status(500).send(error);
  }
};


const getTrailsByAreaId = async (req, res) => {
  try {
    const areaId = req.params.areaId;
    const query = `
      SELECT trails.id, trails.title, trails.image_url, trails.description,
             trails.difficulty, areas.name AS area
      FROM trails
      JOIN areas ON trails.area_id = areas.id
      WHERE trails.area_id = ?
      ORDER BY trails.title
    `;
    const [results] = await db.query(query, [areaId]);
    // Add full image URLs
    const trailsWithImages = results.map(trail => ({
      ...trail,
      image: getFullImageUrl(trail.image_url)
    }));
    res.json(trailsWithImages);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Controller function to get a trail by its ID
const getTrailById = async (req, res) => {
  try {
    const trailId = req.params.id;
    const results = await Trail.getById(trailId);
    if (results.length > 0) {
      const trail = results[0];
      trail.image = getFullImageUrl(trail.image_url);
      res.json(trail);
    } else {
      res.status(404).send('Trail not found');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export default {
  getTrailsByArea,
  getTrailById,
  getAllAreas,
  getTrailsByAreaId,
};
