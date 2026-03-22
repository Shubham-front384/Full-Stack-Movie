const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: [true, "Username is already in used."]
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email is already in used."]
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    select: false
  }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
