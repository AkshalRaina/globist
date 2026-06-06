const express = require('express');
const router = express.Router();
const Region = require('../models/Region');
const Agency = require('../models/Agency');
const Trip = require('../models/Trip');
const Reel = require('../models/Reel');

// GET /api/explore/home-feed — Aggregated home feed data
router.get('/home-feed', async (req, res, next) => {
  try {
    const [featuredRegions, trendingReels, popularAgencies, trendingTopics] = await Promise.all([
      Region.find({ isFeatured: true }).sort({ spotCount: -1 }).limit(4),
      Reel.find()
        .populate('user', 'name explorerTier avatar')
        .populate('agency', 'name location startingPrice rating imageType')
        .sort({ likes: -1 })
        .limit(6),
      Agency.find({ isVerified: true })
        .populate('region', 'name')
        .sort({ rating: -1 })
        .limit(6),
      // Static trending topics (could be a collection in production)
      Promise.resolve([
        { name: 'Local Hidden Gems', icon: '📍', count: '2.1M active explorers', bgColor: '#E6F1FB' },
        { name: 'Historic Expeditions', icon: '🏛️', count: '1.5M active explorers', bgColor: '#FEF0F0' },
        { name: 'Luxury Stays', icon: '⭐', count: '750K active explorers', bgColor: '#FFF3DC' },
        { name: 'Treks', icon: '🥾', count: '750K active explorers', bgColor: '#EEEDFE' }
      ])
    ]);

    res.json({
      featuredRegions,
      trendingReels,
      popularAgencies,
      trendingTopics
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/explore/search — Search agencies, regions, trips
router.get('/search', async (req, res, next) => {
  try {
    const { q, category } = req.query;
    if (!q) {
      return res.json({ regions: [], agencies: [], trips: [] });
    }

    const searchRegex = { $regex: q, $options: 'i' };
    const filter = category ? { categories: { $in: [category] } } : {};

    const [regions, agencies, trips] = await Promise.all([
      Region.find({ name: searchRegex }).limit(5),
      Agency.find({ ...filter, $or: [{ name: searchRegex }, { description: searchRegex }, { location: searchRegex }] })
        .populate('region', 'name')
        .limit(10),
      Trip.find({ $or: [{ name: searchRegex }, { description: searchRegex }] })
        .populate('agency', 'name location')
        .populate('region', 'name')
        .limit(10)
    ]);

    res.json({ regions, agencies, trips });
  } catch (error) {
    next(error);
  }
});

// GET /api/explore/trending-topics
router.get('/trending-topics', async (req, res, next) => {
  try {
    res.json([
      { name: 'Local Hidden Gems', icon: '📍', count: '2.1M active explorers', bgColor: '#E6F1FB' },
      { name: 'Historic Expeditions', icon: '🏛️', count: '1.5M active explorers', bgColor: '#FEF0F0' },
      { name: 'Luxury Stays', icon: '⭐', count: '750K active explorers', bgColor: '#FFF3DC' },
      { name: 'Treks', icon: '🥾', count: '750K active explorers', bgColor: '#EEEDFE' }
    ]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
