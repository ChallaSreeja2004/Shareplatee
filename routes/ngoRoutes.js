// routes/ngoRoutes.js

const express = require('express');
const { registerNgo } = require('../controllers/ngoController'); // Import the NGO controller
const router = express.Router();

router.post('/ngos', registerNgo); // Define the POST route for registering NGOs

module.exports = router;
