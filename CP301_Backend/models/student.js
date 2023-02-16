const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter email"],
  },
  facultyAdvisor: {
    type: String,
    required: [true, "Please enter faculty advisor"]
  }
});

module.exports = mongoose.model("StudentSchema", StudentSchema);
