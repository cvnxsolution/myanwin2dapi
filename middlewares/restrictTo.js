const CustomAppError = require("../utils/CustomAppError");

exports.restrictTo = (message, ...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return next(new CustomAppError(message, 403));
    }
    next();
  };
};
