const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.signJWTToken = (id, tokenVersion = 0) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
