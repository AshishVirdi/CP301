const BadRequestError = require("./BadRequest");
const CustomError = require("./CustomError");
const UnauthenticatedError = require("./Unauthenticated");
const NotFoundError = require("./NotFound");
const ForbiddenError = require("./Forbidden");
const InternalServerError = require("./InternalServerError")

module.exports = {
  BadRequestError,
  CustomError,
  UnauthenticatedError,
  InternalServerError,
  NotFoundError,
  ForbiddenError,
};
