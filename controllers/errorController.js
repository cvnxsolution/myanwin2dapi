const globalErrorHandler = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  } else {
    return res.status(500).json({
      status: "fail",
      erorr: err,
    });
  }
};

module.exports = globalErrorHandler;
