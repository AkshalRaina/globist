const express = require('express');
const router = express.Router();
const Agency = require('../models/Agency');
const Trip = require('../models/Trip');
const { optionalAuth } = require('../middleware/auth');

// GET /api/agencies — List all agencies (with optional filters)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { region, category, sort, search, limit } = req.query;
    const filter = {};

    if (region) filter.region = region;
    if (category) filter.categories = { $in: [category] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { rating: -1 }; // Default: by rating
    if (sort === 'price_low') sortOption = { startingPrice: 1 };
    if (sort === 'price_high') sortOption = { startingPrice: -1 };
    if (sort === 'reviews') sortOption = { reviewCount: -1 };

    const agencies = await Agency.find(filter)
      .populate('region', 'name')
      .sort(sortOption)
      .limit(parseInt(limit) || 20);

    res.json(agencies);
  } catch (error) {
    next(error);
  }
});

// GET /api/agencies/featured — Get featured/top-rated agencies
router.get('/featured', async (req, res, next) => {
  try {
    const agencies = await Agency.find({ isVerified: true })
      .populate('region', 'name')
      .sort({ rating: -1 })
      .limit(6);
    res.json(agencies);
  } catch (error) {
    next(error);
  }
});

// GET /api/agencies/:id — Get agency detail with trips
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const agency = await Agency.findById(req.params.id).populate('region', 'name');
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    const trips = await Trip.find({ agency: agency._id }).populate('region', 'name');

    res.json({ agency, trips });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
