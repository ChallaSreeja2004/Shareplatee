//ngoModel.js
const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
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
});

// Create a geospatial index on the location field
ngoSchema.index({ location: '2dsphere' });

const NgoModel = mongoose.model('Ngo', ngoSchema);

module.exports = NgoModel;
