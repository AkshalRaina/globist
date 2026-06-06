const app = require('../server/index');
const { connectDB } = require('../server/config/db');
const seedDatabase = require('../server/seed/seed');
const mongoose = require('mongoose');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      // Only seed if empty
      const User = require('../server/models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        await seedDatabase();
      }
      isConnected = true;
    } catch (e) {
      console.error('API initialization error:', e);
    }
  }
  return app(req, res);
};
