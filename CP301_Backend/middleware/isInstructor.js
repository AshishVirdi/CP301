const { BadRequestError, ForbiddenError } = require("../errors");
const SubjectSchema = require("../models/subject");

const isInstructor = async (req, res, next) => {
  const { email } = req.user;
  const { subjectcode } = req.body;
  const record = await SubjectSchema.findOne({
    subjectcode,
  });
  if (!record) {
    throw new BadRequestError("No such student found");
  } else if (record.instructor !== email) {
    throw new ForbiddenError("Instructor incorrect");
  }
  next();
};

module.exports = isInstructor;
