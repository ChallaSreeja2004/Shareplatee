//userRoutes.js
const express = require('express');
const { loginNGO, loginDonor,registerNGO, registerDonor, getDonorData, getNGOData } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/login-ngo').post( loginNGO);
router.route('/login-donor').post( loginDonor);
router.route('/register-ngo').post( registerNGO);
router.route('/register-donor').post( registerDonor);


// Protected routes - accessible only after authentication
router.route('/donor/:id').get(protect, getDonorData);  // Get specific donor's data
router.route('/ngo/:id').get(protect, getNGOData);      // Get specific NGO's data

module.exports = router;
