const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for better query performance
uploadSchema.index({ public_id: 1 });
uploadSchema.index({ createdAt: -1 });

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload; 