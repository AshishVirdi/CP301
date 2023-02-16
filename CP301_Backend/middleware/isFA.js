const { BadRequestError, ForbiddenError } = require('../errors');
const StudentSchema = require('../models/student')

const isFA = async (req, res, next) => {
  const { email } = req.user;
  const { studentemail } = req.body;
  const record = await StudentSchema.findOne({
    email: studentemail
  })
  if (!record) {
    throw new BadRequestError("No such student found");
  } else if (record.facultyAdvisor !== email) {
    throw new ForbiddenError("Advisor incorrect");
  }
  next();
}

module.exports = isFA