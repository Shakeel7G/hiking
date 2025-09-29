// models/trailModel.js

import db from '../config/db.js'; 

const Trail = {
  getAll: async() => {
    const query = `
      SELECT trails.id, trails.title, trails.image_url, trails.description, trails.difficulty, areas.name AS area
      FROM trails
      JOIN areas ON trails.area_id = areas.id
    `;
    const [results] = await db.query(query);
    return results;
  },

  getById: async(id) => {
    const query = `
      SELECT trails.*, areas.name AS area
      FROM trails
      JOIN areas ON trails.area_id = areas.id
      WHERE trails.id = ?
    `;
    const [results] = await db.query(query, [id]);
    return results[0]; 
  }
};

export default Trail;