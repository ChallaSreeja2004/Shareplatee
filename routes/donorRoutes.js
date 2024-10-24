const express = require('express');
const router = express.Router();
const {
    createDonor,
    getDonorById,
    getAllDonors
} = require('../controllers/donorController');

// Create a new donor
router.post('/', createDonor);

// Get a donor by ID
router.get('/:donorId', getDonorById);

// Get all donors
router.get('/', getAllDonors);

module.exports = router;
