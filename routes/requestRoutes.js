//requestRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRequest,
  getNearbyDonors,
  updateRequestStatus,
  getNgoRequests,
  getDonorAcceptance,
  deleteRequest,
} = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming you have an auth middleware

// Create a new request for food from an NGO
router.post('/', protect, createRequest);

// Get nearby donors based on NGO's location (requires latitude, longitude, and radius)
router.get('/donors/nearby', protect, getNearbyDonors);

// Update the status of a specific request (accept/reject by donor)
router.patch('/:requestId', protect, updateRequestStatus);

// Get all requests made by a specific NGO
router.get('/donor/:id', getNgoRequests); // Ensure this matches the controller logic

router.get('/ngo/:ngoId', getDonorAcceptance);

router.delete('/:requestId', deleteRequest);

module.exports = router;
