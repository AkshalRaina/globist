const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  caption: { type: String, default: '' },
  tags: [{ type: String }],
  location: { type: String, default: '' },
  isAffiliate: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  imageType: { type: String, default: 'mountain' },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  musicTitle: { type: String, default: '' },
  creatorHandle: { type: String, default: '' },
  creatorTier: { type: String, enum: ['bronze', 'silver', 'gold', 'elite'], default: 'bronze' }
}, { timestamps: true });

module.exports = mongoose.model('Reel', reelSchema);
