const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bus = require('../models/Bus');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to check Day Scholar status explicitly
const isDayScholar = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user || !user.isDayScholar) {
            return res.status(403).json({ message: 'Only day scholars allowed.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ... (Existing routes)

// Get Bus Stops for a user
router.get('/stops/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Ideally, return stops relevant to user's registered stop or show all
        const buses = await Bus.find({ "route": user.busStop });
        res.json(buses); // Only buses going to their stop
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
