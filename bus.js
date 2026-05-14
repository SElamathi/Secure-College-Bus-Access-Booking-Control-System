const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const User = require('../models/User'); // Ensure User model is accessible

// Middleware to protect routes (simplified)
const auth = (req, res, next) => {
    // Check header for token (implementation omitted for brevity in this step)
    // For now, we assume frontend sends user ID if needed or implement full JWT verify
    next();
};

// Get all buses
router.get('/', async (req, res) => {
    try {
        const buses = await Bus.find().populate('seatsBooked.student', 'name email');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Bus (Admin)
router.post('/', async (req, res) => {
    try {
        const bus = new Bus(req.body);
        await bus.save();
        res.status(201).json(bus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Book Seat
router.post('/book', async (req, res) => {
    // Expected body: { userId, busId, seatNumber }
    const { userId, busId, seatNumber } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check Day Scholar
        if (!user.isDayScholar) {
            return res.status(403).json({ message: 'Only Day Scholars can book bus seats.' });
        }

        if (user.bookedBus) {
            return res.status(400).json({ message: 'You have already booked a seat.' });
        }

        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });

        // Check capacity
        if (bus.seatsBooked.length >= bus.capacity) {
            return res.status(400).json({ message: 'Bus is full.' });
        }

        // Check if seat is taken
        const seatTaken = bus.seatsBooked.find(s => s.seatNumber === seatNumber);
        if (seatTaken) {
            return res.status(400).json({ message: 'Seat already taken.' });
        }

        // Book
        bus.seatsBooked.push({ seatNumber, student: user._id });
        await bus.save();

        user.bookedBus = bus._id;
        user.seatNumber = seatNumber;
        await user.save();

        res.json({ message: 'Seat booked successfully!', bus: bus });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Check Status (For monitoring)
router.get('/status/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('bookedBus');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            name: user.name,
            isDayScholar: user.isDayScholar,
            busStop: user.busStop,
            bookedBus: user.bookedBus ? user.bookedBus.busNumber : 'None',
            seatNumber: user.seatNumber
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
