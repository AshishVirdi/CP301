const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter email"],
    },
    OTP: {
      // Could be a number, but the first digit can be a 0
      type: String,
      required: [true, "Please enter OTP"],
    },
    tries: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "Please enter valid value"
      },
      required: [true, "Please enter valid number of tries"]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OTPModel", OTPSchema);
