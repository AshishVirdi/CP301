const OTPemailBody = require("../static/emailbody");
const StudentSchema = require("../models/student");
const FacultySchema = require("../models/faculty");
const { generateOTP } = require("./otp");
const nodemailer = require("nodemailer");
const OTPModel = require("../models/otp");
const { InternalServerError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const OTP_SUBJECT = "OTP";

const MAIL_SETTINGS = {
  service: "outlook",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS,
  },
};

const storeOTP = async (params) => {
  const prevValue = await OTPModel.findOneAndUpdate(
    { email: params.destinationEmail },
    { OTP: params.OTP }
  );
  if (prevValue) {
    return true;
  }
  const databaseValue = await OTPModel.create({
    email: params.destinationEmail,
    OTP: params.OTP,
    tries: 0,
  });
  if (!databaseValue) {
    return false;
  }
  return true;
};

const sendMail = async (params) => {
  const transporter = nodemailer.createTransport(MAIL_SETTINGS);
  try {
    await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.destinationEmail,
      subject: OTP_SUBJECT,
      html: OTPemailBody(params),
    });
  } catch (error) {
    console.log(error);
    throw new InternalServerError("server error. please try again later");
  }
};

const verifyRoleIfExists = async (email, role) => {
  const facultyExists = await FacultySchema.findOne({ email });
  const studentExists = await StudentSchema.findOne({ email });
  if (facultyExists && role === "student") return false;
  else if (studentExists && role == "faculty") return false;
  return true;
};

const loginSignupMailGenerator = async (req, res) => {
  const { email, role } = req.body;
  const isTheRoleCorrect = await verifyRoleIfExists(email, role);
  if (!isTheRoleCorrect) {
    throw new BadRequestError(
      `Email ID registered as ${role === "faculty" ? "student" : "faculty"}`
    );
  }
  const otp = generateOTP();
  const params = {
    OTP: otp,
    destinationEmail: email,
  };
  if (process.env.NODE_ENV !== "dev") {
    sendMail(params);
  }
  const created = await storeOTP(params);
  if (created == false) {
    throw new InternalServerError("server error. please try again");
  }
  res.status(StatusCodes.OK).send({
    message: "OTP Generated",
  });
};

module.exports = loginSignupMailGenerator;
