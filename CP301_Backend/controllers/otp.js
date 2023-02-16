const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const OTPModel = require("../models/otp");
const StudentSchema = require("../models/student");
const Faculty = require("../models/faculty");
const {
  UnauthenticatedError,
  BadRequestError,
  ForbiddenError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const OTP_WINDOW = 5;
const OTP_LENGTH = 6;
const OTP_CONFIG = {
  digits: true,
  lowerCaseAlphabets: false,
  upperCaseAlphabets: false,
  specialChars: false,
};

const createJWT = function (email, isFaculty) {
  return jwt.sign(
    {
      email,
      isFaculty,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// Function to generate OTP
const generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};

// Function to verify OTP
const authorize = async (req, res) => {
  const { email, OTP, role } = req.body;
  const databaseValue = await OTPModel.findOne({ email });
  if (!databaseValue) {
    throw new BadRequestError("Invalid Email");
  }
  const timeDifference = (new Date() - databaseValue.updatedAt) / 1000 / 60;
  if (databaseValue.OTP !== OTP) {
    throw new UnauthenticatedError("Invalid OTP");
  } else if (timeDifference - OTP_WINDOW > 0.001) {
    throw new UnauthenticatedError("OTP Expired");
  }

  let jwt;

  const isStudent = await StudentSchema.exists({ email });
  const isFaculty = await Faculty.exists({ email });

  if (role === "student") {
    if (!(isStudent || isFaculty))
      await StudentSchema.create({
        email,
        facultyAdvisor: req.body.facultyadvisor || process.env.DEFAULT_FA,
      });
    else if (isFaculty) throw new ForbiddenError("The user exists as faculty");
    jwt = createJWT(email, false);
  } else if (role === "faculty") {
    if (!(isStudent || isFaculty))
      await Faculty.create({
        email,
      });
    else if (isStudent) throw new ForbiddenError("The user exists as student");
    jwt = createJWT(email, true);
  } else {
    throw new BadRequestError("Invalid role");
  }
  await OTPModel.deleteOne({ email });
  res
    .status(StatusCodes.OK)
    .send({ email, role, token: jwt, message: "OTP verified" });
};

module.exports = {
  generateOTP,
  authorize,
};
