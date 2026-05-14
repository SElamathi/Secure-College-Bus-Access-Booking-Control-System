require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/bus');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/hardware', require('./routes/hardware'));

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/collegebus')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

