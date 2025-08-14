const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24,
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
