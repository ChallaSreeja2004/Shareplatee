const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      maxlength: [10, 'Mobile number should be of 10 digits'],
      trim: true,
      required: [true, 'Mobile number is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['donor', 'ngo'],
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
