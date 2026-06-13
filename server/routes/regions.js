const express = require('express');
const router = express.Router();
const Region = require('../models/Region');
const Agency = require('../models/Agency');
const Trip = require('../models/Trip');

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

// GET /api/regions/:id — Region detail with agencies and trips
router.get('/:id', async (req, res, next) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }

    const { category } = req.query;
    const agencyFilter = { region: region._id };

    // Map frontend category names to DB category values
    if (category && category !== 'All') {
      const categoryMap = {
        'Treks': 'Treks',
        'Luxury Stays': 'Luxury',
        'City Tours': 'City Tours',
        'Adventure': 'Adventure',
      };
      const dbCategory = categoryMap[category] || category;
      agencyFilter.categories = { $in: [dbCategory] };
    }

    const agencies = await Agency.find(agencyFilter)
      .sort({ rating: -1 });

    const trips = await Trip.find({ region: region._id })
      .populate('agency', 'name location rating reviewCount isVerified categories imageType')
      .sort({ isFeatured: -1, activeUsers: -1 });

    res.json({ region, agencies, trips });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
