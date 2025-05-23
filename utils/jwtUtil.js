const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.signJWTToken = (auth_id, role, tokenVersion = 0, user_id) => {
  return jwt.sign({ auth_id, role, user_id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
