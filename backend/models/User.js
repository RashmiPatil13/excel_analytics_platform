const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, name: this.name }, process.env.JWT_SECRET);
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
