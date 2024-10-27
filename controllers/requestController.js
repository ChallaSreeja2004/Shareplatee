const Request = require('../models/requestModel');
const FoodDonation = require('../models/foodDonationModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// Controller to create Request
const createRequest = async (req, res) => {
  try {
    const {
      ngoName,
      mobileNumber,
      email,
      foodDetails,
      donorId,
      ngoId,
      donorEmail,
      location,
    } = req.body;
    console.log(req.body);

    // Validate required fields
    if (
      !ngoName ||
      !mobileNumber ||
      !email ||
      !foodDetails ||
      !foodDetails.foodQuantity ||
      !foodDetails.description ||
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    // Extract and validate coordinates
    const [longitude, latitude] = location.coordinates;
    if (
      isNaN(longitude) ||
      isNaN(latitude) ||
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid coordinates.' });
    }
    console.log(donorId);
    console.log(typeof donorId);
    const objectId = new mongoose.Types.ObjectId(donorId);
    console.log(typeof objectId);
    console.log(objectId);

    // Fetch donor information from the database
    const donor = await FoodDonation.findById(objectId).select(
      'name mobileNumber email',
    );

    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: 'Donor not found' });
    }

    const newRequest = await Request.create({
      ngoName,
      mobileNumber,
      email,
      donorId,
      ngoId,
      foodDetails,
      donorName: donor.name, // Use fetched donor info
      donorMobile: donor.mobileNumber,
      donorEmail: donor.email,
      location: { type: 'Point', coordinates: [longitude, latitude] },
    });

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: newRequest,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message,
    });
  }
};

// Get all nearby donors (within a radius) for the NGO
const getNearbyDonors = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    // Validate query parameters
    if (!latitude || !longitude || !radius || isNaN(radius) || radius <= 0) {
      return res.status(400).json({
        success: false,
        message:
          'Latitude, longitude, and radius must be valid numbers and are required',
      });
    }

    const nearbyDonors = await FoodDonation.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            radius / 6378.1, // Convert radius to radians
          ],
        },
      },
    })
      .select('name mobile quantity description')
      .populate('donor', 'name mobileNumber');

    res.status(200).json({
      success: true,
      data: nearbyDonors,
    });
  } catch (error) {
    console.error('Error getting nearby donors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nearby donors',
      error: error.message,
    });
  }
};

// Update the status of a request (accept/reject by donor)
const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be "accepted" or "rejected".',
      });
    }

    // Validate requestId format
    if (!requestId || !/^[0-9a-fA-F]{24}$/.test(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Request ID format',
      });
    }

    // Update the status of the request
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true },
    ).populate('donorId', 'donorName donorMobile donorEmail'); // Populate donor details

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      data: updatedRequest,
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update request status',
      error: error.message,
    });
  }
};

// Get all requests for an NGO
const getNgoRequests = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.params);
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Donor ID is not found' });
    }

    const donorId = new mongoose.Types.ObjectId(id);
    console.log(donorId);
    const all=await Request.find();
    console.log(all);
    const Donors = await Request.find({ donorId}); // Corrected line
    console.log(Donors);

    res.status(200).json({ success: true, data: Donors });

  } catch (error) {
    console.error('Error getting NGO requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NGO requests',
      error: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getNearbyDonors,
  updateRequestStatus,
  getNgoRequests,
};
