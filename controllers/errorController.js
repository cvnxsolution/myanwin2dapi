const CustomAppError = require("../utils/CustomAppError");

const handleJWTError = (err) => {
  return new CustomAppError(err.message, 400);
};

const sendErrorInDevelopment = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};

const sendErorrInProduction = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  }
  let error = {};
  switch (err.name) {
    case "JsonWebTokenError":
      error = handleJWTError(err);
      break;
  }
  error = { ...error, stack: err.stack, message: err.message };

  if (process.env.NODE_ENV === "development") {
    sendErrorInDevelopment(error, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErorrInProduction(error, res);
  }
};

module.exports = globalErrorHandler;
