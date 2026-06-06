const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
  categories: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  startingPrice: { type: Number, default: 0 },
  imageType: { type: String, default: 'mountain' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Agency', agencySchema);
