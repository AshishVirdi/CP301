const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Faculty = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter email"],
  }
});

module.exports = mongoose.model("Faculty", Faculty);
