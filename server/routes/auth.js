const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, generateAccessToken, generateRefreshToken, JWT_SECRET } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, phone, role, interests, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Create user
    const user = new User({
      name,
      phone,
      role: role || 'traveler',
      interests: interests || [],
      password: password || '123456', // Default password for prototype
      otpCode: '123456', // Simulated OTP
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await user.save();

    res.status(201).json({
      message: 'OTP sent successfully',
      userId: user._id,
      // In production, OTP would be sent via SMS
      _devOtp: '123456' // Exposed only for prototype
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { userId, phone, otp } = req.body;

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For prototype, accept any 6-digit OTP or the default '123456'
    if (otp && otp.length === 6) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      await user.save();

      const userObj = user.toObject();
      delete userObj.password;
      delete userObj.refreshToken;

      return res.json({
        accessToken,
        refreshToken,
        user: userObj
      });
    }

    res.status(400).json({ message: 'Invalid OTP' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password || '123456');
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate OTP for verification
    user.otpCode = '123456';
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    res.json({
      message: 'OTP sent successfully',
      userId: user._id,
      _devOtp: '123456'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET + '-refresh');
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', auth, async (req, res, next) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
