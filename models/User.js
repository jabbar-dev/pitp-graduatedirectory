const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);