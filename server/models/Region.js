const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  spotCount: { type: Number, default: 0 },
  verifiedAgencies: { type: Number, default: 0 },
  imageType: { type: String, default: 'mountain' },
  subLocations: [{ type: String }],
  description: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Region', regionSchema);
