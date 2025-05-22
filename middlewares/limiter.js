const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit.rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: "fail",
    message: "Too many login Attempts, try again in 15 mintutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
