const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.signJWTToken = (id, role, tokenVersion = 0) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
