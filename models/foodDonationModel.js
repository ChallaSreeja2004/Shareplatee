//foodDonationModel.js
const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
    // donorId: {
    //     type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    //     required: true,
    //     ref: 'Donor', // Make sure to reference the correct model name
    // },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Validates for exactly 10 digits
            },
            message: props => `${props.value} is not a valid mobile number! Must be exactly 10 digits.`,
        },
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 500, // Limit length of description
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location' is a GeoJSON point
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'completed'],
        default: 'available',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a geospatial index for location
foodDonationSchema.index({ location: '2dsphere' });

const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);

module.exports = FoodDonation;
