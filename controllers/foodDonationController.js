//foodDonationController.js
const FoodDonation = require('../models/foodDonationModel');
const Donor = require('../models/donorModel'); // Import the Donor model
const User = require('../models/userModel');
const mongoose = require('mongoose');

// Controller function to handle food donation submissions
const donateFood = async (req, res) => {
  const {
    name,
    email,
    mobile,
    quantity,
    description,
    latitude,
    longitude,
    userId,
  } = req.body;

  try {
    console.log(userId);
    const UserId = new mongoose.Types.ObjectId(userId);
    console.log(UserId);
    const { email: verifyEmail } = await User.findOne({
      _id: UserId,
      role: 'donor',
    });
    console.log(verifyEmail);

    console.log(verifyEmail);
    if (verifyEmail !== email) {
      return res
        .status(401)
        .json({ success: false, message: 'Email does not match' });
    }
    const newDonation = new FoodDonation({
      name,
      email,
      mobile,
      quantity,
      description,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // [longitude, latitude]
      },
    });

    await newDonation.save();
    res.status(201).json({ message: 'Food donation recorded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while saving donation.' });
  }
};

// Optional: Controller function to get all food donations (for admin or donor's review)
const getAllDonations = async (req, res) => {
  try {
    const donations = await FoodDonation.find();
    res.status(200).json(donations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Server error while retrieving donations.' });
  }
};

// Controller function to find nearby donors based on latitude and longitude
const findNearbyDonors = async (req, res) => {
  const { longitude, latitude } = req.query;

  // Validate input
  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: 'Latitude and longitude are required.' });
  }

  // Check if latitude and longitude are valid numbers
  if (isNaN(latitude) || isNaN(longitude)) {
    return res
      .status(400)
      .json({ message: 'Latitude and longitude must be valid numbers.' });
  }

  try {
    console.log(
      `Searching for donors near Latitude: ${latitude}, Longitude: ${longitude}`,
    );

    const donors = await FoodDonation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000, // Maximum distance in meters (5 km)
        },
      },
    });

    if (donors.length === 0) {
      return res.status(404).json({ message: 'No nearby donors found.' });
    }

    return res.json(donors);
  } catch (error) {
    console.error('Error fetching nearby donors:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  donateFood,
  getAllDonations,
  findNearbyDonors, // Export the findNearbyDonors function
};
