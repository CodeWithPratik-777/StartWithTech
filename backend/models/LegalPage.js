const mongoose = require('mongoose');

const legalPageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['terms', 'privacy'],
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LegalPage', legalPageSchema);
