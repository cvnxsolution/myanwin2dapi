const CustomAppError = require("../utils/CustomAppError");

const handleJWTError = (err) => {
  return new CustomAppError(err.message, 400);
};

const handleDuplicateKeyError = (err) => {
  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  return new CustomAppError(`${value} exists in database`, 400);
};

const sendErrorInDevelopment = (err, res) => {
  err.statusCode = err.statusCode || 500;
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
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

  // mongoose error
  switch (err.code) {
    case 11000: {
      error = handleDuplicateKeyError(err);
    }
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorInDevelopment(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErorrInProduction(error, res);
  }
};

module.exports = globalErrorHandler;
