const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } } 
});

module.exports = mongoose.model('Otp', otpSchema);
