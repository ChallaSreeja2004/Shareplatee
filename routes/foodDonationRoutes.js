const express = require('express');
const {
    donateFood,
    getAllDonations,
    findNearbyDonors
} = require('../controllers/foodDonationController');

const router = express.Router();

// Food donation submission route
router.route('/donate-food').post(donateFood);

// Get all food donations route
router.route('/food-donations').get(getAllDonations);

// Endpoint to get nearby donors based on latitude and longitude
router.route('/donors').get(findNearbyDonors); // Updated this line

module.exports = router;
