const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit.rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    status: "fail",
    message: "Too many login Attempts, try again in 15 mintutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.signUpLimiter = rateLimit.rateLimit({
  windowMs: 10 * 1000 * 60,
  max: 5,
  message: {
    status: "fail",
    message: "Too many sign up attempts, try again in 5 minutes",
  },
});
