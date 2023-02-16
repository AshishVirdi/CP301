const { BadRequestError, ForbiddenError } = require("../errors");

const isInstructor = async (req, res, next) => {
  const { isFaculty } = req.user;
  if (!isFaculty) {
    throw new BadRequestError("No such instructor found");
  }
  next();
};

module.exports = isInstructor;
