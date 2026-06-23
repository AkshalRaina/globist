const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const seedDatabase = require('./seed/seed');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const agencyRoutes = require('./routes/agencies');
const regionRoutes = require('./routes/regions');
const bookingRoutes = require('./routes/bookings');
const reelRoutes = require('./routes/reels');
const exploreRoutes = require('./routes/explore');
const tripRoutes = require('./routes/trips');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/trips', tripRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 Globist API running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`\n📱 Demo Login:`);
      console.log(`   Phone: +91 98765 43210`);
      console.log(`   Password: 123456`);
      console.log(`   OTP: 123456 (any 6 digits work)\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
