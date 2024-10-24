const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const foodDonationRoutes = require('./routes/foodDonationRoutes');
const requestRoutes = require('./routes/requestRoutes');
const ngoRoutes = require('./routes/ngoRoutes'); // New NGO routes
const donorRoutes=require('./routes/donorRoutes')
const { protect } = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const dbConfig = require('./config/db');

dotenv.config();
const app = express();

// Connect to the database
dbConfig();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static('public')); // Serve static files from the public directory
// Set Content Security Policy (CSP)
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://unpkg.com; img-src 'self' data: https://encrypted-tbn0.gstatic.com;");
    next();
});

// Routes
app.use('/', userRoutes);
app.use('/food-donations', foodDonationRoutes);
app.use(requestRoutes);
app.use(ngoRoutes);
app.use(donorRoutes)

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
