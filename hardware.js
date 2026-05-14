const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bus = require('../models/Bus');

// Endpoint for Raspberry Pi to verify entry
// POST /api/hardware/verify
router.post('/verify', async (req, res) => {
    const { fingerprintId, busId } = req.body;

    console.log(`[Hardware] verification request for Fingerprint: ${fingerprintId} on Bus: ${busId}`);

    try {
        // 1. Find User by Fingerprint
        const user = await User.findOne({ fingerprintId });

        if (!user) {
            console.log(`[Hardware] User not found`);
            return res.status(404).json({ status: 'denied', message: 'Fingerprint not registered' });
        }

        // 2. Check Day Scholar Status
        if (!user.isDayScholar) {
            console.log(`[Hardware] ${user.name} is not a Day Scholar`);
            return res.status(403).json({ status: 'denied', message: 'Not a Day Scholar' });
        }

        // 3. Check Booking
        if (!user.bookedBus) {
            console.log(`[Hardware] ${user.name} has no booking`);
            return res.status(403).json({ status: 'denied', message: 'No active booking found' });
        }

        // 4. Validate Bus
        if (user.bookedBus.toString() !== busId) {
            console.log(`[Hardware] ${user.name} booked a different bus`);
            return res.status(403).json({ status: 'denied', message: 'Wrong Bus! You booked a different route.' });
        }

        // Access Granted
        console.log(`[Hardware] ACCESS GRANTED for ${user.name}`);
        res.json({
            status: 'allowed',
            message: `Welcome ${user.name}`,
            seat: user.seatNumber,
            studentName: user.name
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Endpoint to Link Fingerprint (For Enrollment Phase)
// POST /api/hardware/enroll
router.post('/enroll', async (req, res) => {
    const { email, fingerprintId } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email }, { fingerprintId }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Fingerprint linked successfully', user: user.name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
