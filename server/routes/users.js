const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const { auth } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -refreshToken -otpCode -otpExpiry')
      .populate('wishlist');
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/profile
router.put('/profile', auth, async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'bio', 'location', 'interests', 'avatar'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
      .select('-password -refreshToken -otpCode -otpExpiry');
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/wallet
router.get('/wallet', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('referralPoints explorerTier stats');
    
    const tierThresholds = {
      bronze: { next: 'silver', needed: 10 },
      silver: { next: 'gold', needed: 25 },
      gold: { next: 'elite', needed: 50 },
      elite: { next: null, needed: null }
    };

    const currentTier = tierThresholds[user.explorerTier];
    const progress = currentTier.needed 
      ? Math.min((user.stats.bookingsInspired / currentTier.needed) * 100, 100)
      : 100;

    res.json({
      referralPoints: user.referralPoints,
      explorerTier: user.explorerTier,
      bookingsInspired: user.stats.bookingsInspired,
      nextTier: currentTier.next,
      nextTierNeeded: currentTier.needed,
      progress: Math.round(progress),
      pointsValue: user.referralPoints // 1 point = ₹1
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/wishlist/:tripId
router.post('/wishlist/:tripId', auth, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const user = await User.findById(req.user._id);
    const idx = user.wishlist.indexOf(req.params.tripId);
    
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      await user.save();
      return res.json({ message: 'Removed from wishlist', wishlisted: false });
    } else {
      user.wishlist.push(req.params.tripId);
      await user.save();
      return res.json({ message: 'Added to wishlist', wishlisted: true });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/users/wishlist
router.get('/wishlist', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'wishlist',
        populate: { path: 'agency', select: 'name location rating reviewCount' }
      });
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
