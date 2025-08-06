const pool = require('../config/db');

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Add a new school
exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Basic validation
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
    }

    let result;
    if (process.env.DATABASE_URL) {
      // PostgreSQL
      result = await pool.query(
        'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, address, latitude, longitude]
      );
    } else {
      // MySQL
      const [mysqlResult] = await pool.execute(
        'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, address, latitude, longitude]
      );
      result = { rows: [{ id: mysqlResult.insertId }] };
    }

    res.status(201).json({
      message: 'School added successfully',
      schoolId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List all schools with distance calculation
exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude query parameters are required' });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    let schools;
    if (process.env.DATABASE_URL) {
      // PostgreSQL
      const result = await pool.query('SELECT * FROM schools');
      schools = result.rows;
    } else {
      // MySQL
      const [mysqlSchools] = await pool.query('SELECT * FROM schools');
      schools = mysqlSchools;
    }

    // Calculate distance for each school and add it to the result
    const schoolsWithDistance = schools.map(school => ({
      ...school,
      distance: calculateDistance(
        userLat,
        userLng,
        parseFloat(school.latitude),
        parseFloat(school.longitude)
      )
    }));

    // Sort by distance (nearest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
