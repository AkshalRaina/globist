const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Agency = require('../models/Agency');

// GET /api/trips — List trips with optional filters
router.get('/', async (req, res, next) => {
  try {
    const { region, category, sort, limit } = req.query;
    const filter = {};

    if (region) filter.region = region;

    // If category is provided, find agencies in that category first
    if (category) {
      const categoryMap = {
        'Treks': 'Treks',
        'Luxury Stays': 'Luxury',
        'City Tours': 'City Tours',
        'Adventure': 'Adventure',
      };
      const dbCategory = categoryMap[category] || category;
      const agencyIds = await Agency.find({ categories: { $in: [dbCategory] } }).select('_id');
      filter.agency = { $in: agencyIds.map(a => a._id) };
    }

    let sortOption = { isFeatured: -1, activeUsers: -1 };
    if (sort === 'price_low') sortOption = { pricePerPerson: 1 };
    if (sort === 'price_high') sortOption = { pricePerPerson: -1 };
    if (sort === 'duration') sortOption = { duration: 1 };

    const trips = await Trip.find(filter)
      .populate('agency', 'name location rating reviewCount isVerified categories imageType startingPrice')
      .populate('region', 'name')
      .sort(sortOption)
      .limit(parseInt(limit) || 20);

    res.json(trips);
  } catch (error) {
    next(error);
  }
});

// GET /api/trips/:id — Get single trip detail
router.get('/:id', async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('agency', 'name description location rating reviewCount isVerified categories imageType startingPrice owner')
      .populate('region', 'name');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Also get other trips from the same agency
    const relatedTrips = await Trip.find({ agency: trip.agency._id, _id: { $ne: trip._id } })
      .populate('region', 'name')
      .limit(5);

    res.json({ trip, relatedTrips });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
