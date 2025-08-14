const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  verifyToken: String,
  verifyTokenExpires: {
    type: Date,
    index: { expires: 0 }, 
  },
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
