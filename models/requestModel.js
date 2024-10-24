// requestModel.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    ngoName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Validates for a 10-digit number
            },
            message: props => `${props.value} is not a valid mobile number!`
        },
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v); // Simple email validation
            },
            message: props => `${props.value} is not a valid email address!`
        },
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON type
            required: true,
        },
        coordinates: {
            type: [Number],//longitude,latitude
            required: true,
            validate: {
                validator: function (coords) {
                    return coords.length === 2 &&
                        coords[0] >= -180 && coords[0] <= 180 &&  // Longitude range
                        coords[1] >= -90 && coords[1] <= 90;     // Latitude range
                },
                message: props => `Invalid coordinates [${props.value}]`
            },
        }
        
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor', // Reference to the User model (donor)
        required: true,
    },
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Ngo', // Reference to your NGO model
    },
    donorName: {
        type: String,
        required: true,
    },
    donorMobile: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Validates for a 10-digit number
            },
            message: props => `${props.value} is not a valid mobile number!`
        },
    },
    donorEmail: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v); // Simple email validation
            },
            message: props => `${props.value} is not a valid email address!`
        },
    },
    foodDetails: {
        foodQuantity: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
            maxlength: 500, // Optional: Limit length of description
        }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Optionally, create a method to fetch the donor's email when needed
requestSchema.methods.getDonorEmail = async function() {
    const donor = await this.model('Donor').findById(this.donorId).select('email'); // Fetch donor email
    return donor ? donor.email : null;
};

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
