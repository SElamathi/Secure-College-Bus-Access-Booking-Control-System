const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isDayScholar: { type: Boolean, default: false }, // Only Day Scholars allowed
  busStop: { type: String }, // User's registered stop
  bookedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  seatNumber: { type: Number },
  fingerprintId: { type: String }, // For hardware integration later
});

module.exports = mongoose.model('User', userSchema);
