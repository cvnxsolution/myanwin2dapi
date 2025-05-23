const CustomAppError = require("../utils/CustomAppError");

exports.restrictTo = (message, role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new CustomAppError(message, 401));
    }
    next();
  };
};
