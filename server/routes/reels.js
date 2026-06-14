const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

// GET /api/reels — Cursor-based feed (scalable infinite scroll)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { cursor, limit = 5, agency } = req.query;
    const filter = {};
    if (agency) filter.agency = agency;

    // Cursor is a createdAt timestamp — fetch reels older than cursor
    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    const reels = await Reel.find(filter)
      .populate('user', 'name explorerTier stats avatar')
      .populate('agency', 'name location startingPrice rating imageType')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) + 1); // Fetch one extra to determine if there's a next page

    const hasMore = reels.length > parseInt(limit);
    const results = hasMore ? reels.slice(0, -1) : reels;
    const nextCursor = results.length > 0 ? results[results.length - 1].createdAt.toISOString() : null;

    res.json({
      reels: results,
      nextCursor,
      hasMore
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/reels/trending — Get trending reels
router.get('/trending', async (req, res, next) => {
  try {
    const reels = await Reel.find()
      .populate('user', 'name explorerTier avatar')
      .populate('agency', 'name location startingPrice rating imageType')
      .sort({ likes: -1 })
      .limit(6);
    res.json(reels);
  } catch (error) {
    next(error);
  }
});

// POST /api/reels — Post a new reel
router.post('/', auth, async (req, res, next) => {
  try {
    const { caption, tags, location, isAffiliate, agencyId, bookingId, imageType, musicTitle } = req.body;

    const reel = new Reel({
      user: req.user._id,
      agency: agencyId || undefined,
      booking: bookingId || undefined,
      caption,
      tags: tags || [],
      location: location || '',
      isAffiliate: isAffiliate || false,
      imageType: imageType || 'mountain',
      musicTitle: musicTitle || '',
      creatorHandle: `@${req.user.name.toLowerCase().replace(/\s+/g, '_')}`,
      creatorTier: req.user.explorerTier,
      likes: 0,
      comments: 0,
      shares: 0
    });

    await reel.save();

    const populatedReel = await Reel.findById(reel._id)
      .populate('user', 'name explorerTier avatar')
      .populate('agency', 'name location');

    res.status(201).json(populatedReel);
  } catch (error) {
    next(error);
  }
});

// POST /api/reels/:id/like — Like/unlike a reel
router.post('/:id/like', auth, async (req, res, next) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    const userId = req.user._id;
    const idx = reel.likedBy.indexOf(userId);

    if (idx > -1) {
      reel.likedBy.splice(idx, 1);
      reel.likes = Math.max(0, reel.likes - 1);
      await reel.save();
      return res.json({ liked: false, likes: reel.likes });
    } else {
      reel.likedBy.push(userId);
      reel.likes += 1;
      await reel.save();
      return res.json({ liked: true, likes: reel.likes });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/reels/agency/:agencyId — Reels for a specific agency
router.get('/agency/:agencyId', async (req, res, next) => {
  try {
    const reels = await Reel.find({ agency: req.params.agencyId })
      .populate('user', 'name explorerTier avatar')
      .sort({ likes: -1 })
      .limit(10);
    res.json(reels);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
