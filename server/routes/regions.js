const express = require('express');
const router = express.Router();
const Region = require('../models/Region');
const Agency = require('../models/Agency');

// GET /api/regions — List all regions
router.get('/', async (req, res, next) => {
  try {
    const regions = await Region.find().sort({ spotCount: -1 });
    res.json(regions);
  } catch (error) {
    next(error);
  }
});

// GET /api/regions/featured — Featured regions for home
router.get('/featured', async (req, res, next) => {
  try {
    const regions = await Region.find({ isFeatured: true }).sort({ spotCount: -1 });
    res.json(regions);
  } catch (error) {
    next(error);
  }
});

// GET /api/regions/:id — Region detail with agencies
router.get('/:id', async (req, res, next) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }

    const agencies = await Agency.find({ region: region._id })
      .sort({ rating: -1 });

    res.json({ region, agencies });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
