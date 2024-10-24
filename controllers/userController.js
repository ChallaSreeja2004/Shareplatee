const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to validate email and password
const validateInput = (email, password) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) errors.push('Email is required');
    else if (!emailRegex.test(email)) errors.push('Email is invalid');

    if (!password) errors.push('Password is required');
    else if (password.length < 6) errors.push('Password must be at least 6 characters long');

    return errors;
};

// Helper function for user login
const loginUser = async (req, res, next, role) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

// Login function for NGOs
const loginNGO = (req, res, next) => loginUser(req, res, next, 'ngo');

// Login function for Donors
const loginDonor = (req, res, next) => loginUser(req, res, next, 'donor');

// NGO Registration
const registerNGO = async (req, res) => {
    const { name, email, mobile, password } = req.body;

    // Validate input
    const inputErrors = validateInput(email, password);
    if (inputErrors.length > 0) {
        return res.status(400).json({ message: inputErrors });
    }

    try {
        const existingUser = await User.findOne({ email, role: 'ngo' });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newNGO = new User({ name, email, mobile, password: hashedPassword, role: 'ngo' });
        await newNGO.save();
        res.status(201).json({ message: 'NGO registered successfully' });
    } catch (error) {
        console.error('Error during NGO registration:', error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

// Donor Registration
const registerDonor = async (req, res) => {
    const { name, email, mobile, password } = req.body;

    // Validate input
    const inputErrors = validateInput(email, password);
    if (inputErrors.length > 0) {
        return res.status(400).json({ message: inputErrors });
    }

    try {
        const existingUser = await User.findOne({ email, role: 'donor' });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDonor = new User({ name, email, mobile, password: hashedPassword, role: 'donor' });
        await newDonor.save();
        res.status(201).json({ message: 'Donor registered successfully' });
    } catch (error) {
        console.error('Error during donor registration:', error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

// Get specific donor's data
const getDonorData = async (req, res) => {
    const donorId = req.params.id;

    try {
        const donor = await User.findById(donorId);
        if (!donor || donor.role !== 'donor') {
            return res.status(404).json({ message: 'Donor not found' });
        }

        res.status(200).json({ donor });
    } catch (error) {
        console.error('Error fetching donor data:', error);
        return res.status(500).json({ message: 'Server error while fetching donor data' });
    }
};

// Get specific NGO's data
const getNGOData = async (req, res) => {
    const ngoId = req.params.id;

    try {
        const ngo = await User.findById(ngoId);
        if (!ngo || ngo.role !== 'ngo') {
            return res.status(404).json({ message: 'NGO not found' });
        }

        res.status(200).json({ ngo });
    } catch (error) {
        console.error('Error fetching NGO data:', error);
        return res.status(500).json({ message: 'Server error while fetching NGO data' });
    }
};

module.exports = {
    loginNGO,
    loginDonor,
    registerNGO,
    registerDonor,
    getDonorData,
    getNGOData,
};
