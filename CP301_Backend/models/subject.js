const { default: mongoose } = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subjectcode: {
    type: String,
    required: [true, "Please enter subject code"],
  },
  subjectname: {
    type: String,
    required: [true, "Please enter subject name"],
  },
  instructor: {
    type: String,
    required: [true, "Please enter instructor"],
  },
});

module.exports = mongoose.model("SubjectSchema", SubjectSchema);
