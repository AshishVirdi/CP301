const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  subjectcode: {
    type: String,
    required: [true, "Please enter subject code"],
  },
  email: {
    type: String,
    required: [true, "Please enter student email"],
  },
  status: {
    type: String,
    required: [true, "Please enter status"],
    enum: [
      "Enrolled",
      "Dropped by Student",
      "Pending Instructor Approval",
      "Pending Advisor Approval",
      "Rejected by Faculty Advisor",
      "Rejected by Instructor",
      "Dropped"
    ],
  },
});

module.exports = mongoose.model("RecordSchema", RecordSchema);
