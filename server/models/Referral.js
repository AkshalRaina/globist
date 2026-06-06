const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  reel: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel' },
  pointsEarned: { type: Number, required: true },
  percentage: { type: Number, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
