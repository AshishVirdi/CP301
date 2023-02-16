const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../errors");

const errorHandler = (err, req, res, next) => {
  console.log(err.stack)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "Something went wrong" });
};

module.exports = errorHandler;
