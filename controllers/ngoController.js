//ngoController.js
const NgoModel = require('../models/ngoModel');
const registerNgo = async (req, res) => {
    const { name, mobile, email, latitude, longitude } = req.body;

    console.log("Received NGO data:", { name, mobile, email, latitude, longitude });

    try {
        const newNgo = new NgoModel({
            name,
            mobile,
            email,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        });

        const savedNgo = await newNgo.save();
        console.log("NGO saved successfully:", savedNgo);

        res.status(201).json({ 
            message: 'NGO details saved successfully', 
            id: savedNgo._id 
        });
    } catch (error) {
        console.error("Error saving NGO details:", error); // Log the error
        res.status(500).json({ 
            message: 'Error saving NGO details', 
            error: error.message 
        });
    }
};

module.exports= { registerNgo };
