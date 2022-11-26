const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
