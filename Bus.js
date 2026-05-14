const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: { type: String, required: true, unique: true },
    driverName: { type: String, required: true },
    driverContact: { type: String },
    route: [{ type: String, required: true }], // Array of stops like ['Stop A', 'Stop B', 'College']
    capacity: { type: Number, required: true },
    seatsBooked: [{
        seatNumber: Number,
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    currentLocation: {
        lat: Number,
        lng: Number,
        lastUpdated: Date
    },
    status: { type: String, enum: ['active', 'maintenance'], default: 'active' }
});

module.exports = mongoose.model('Bus', busSchema);
