const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

imageSchema.statics.createOrUpdate = async function(publicId, url) {
  return this.findOneAndUpdate(
    { publicId },
    { $set: { url, createdAt: new Date() } },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('Image', imageSchema, 'Images'); // Still using collection name 'Images'
