const Donor = require('../models/donorModel');
const bcrypt = require('bcrypt');

// Create Donor
const createDonor = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Validate required fields
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if the email already exists
        const existingDonor = await Donor.findOne({ email });
        if (existingDonor) {
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        const newDonor = new Donor({
            name,
            email,
            mobile,
            password: hashedPassword, // Store the hashed password
        });

        await newDonor.save();

        // Omit sensitive information from the response
        const { password: _, ...donorData } = newDonor._doc;

        res.status(201).json({ success: true, message: 'Donor created successfully', data: donorData });
    } catch (error) {
        console.error('Error creating donor:', error);
        res.status(500).json({ success: false, message: 'Failed to create donor', error: error.message });
    }
};

// Get a donor by ID
const getDonorById = async (req, res) => {
    try {
        const { donorId } = req.params;

        const donor = await Donor.findById(donorId);
        if (!donor) {
            return res.status(404).json({ success: false, message: 'Donor not found' });
        }

        // Omit sensitive information from the response
        const { password: _, ...donorData } = donor._doc;

        res.status(200).json({ success: true, data: donorData });
    } catch (error) {
        console.error('Error getting donor:', error);
        res.status(500).json({ success: false, message: 'Failed to get donor', error: error.message });
    }
};

// Get all donors
const getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.find();
        
        // Omit sensitive information from the response
        const donorsData = donors.map(({ password: _, ...donorData }) => donorData);

        res.status(200).json({ success: true, data: donorsData });
    } catch (error) {
        console.error('Error getting all donors:', error);
        res.status(500).json({ success: false, message: 'Failed to get donors', error: error.message });
    }
};

module.exports = {
    createDonor,
    getDonorById,
    getAllDonors,
};
