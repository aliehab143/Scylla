const mongoose = require('mongoose');

// Create the Mongoose schema for the user
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// UserSchema.index({ id: 1, uid: 1 });  // Create an ascending index on both fields

module.exports = mongoose.model('User', UserSchema);