const crypto = require("crypto");

exports.generateRandomNumber = (digit) => {
  const buffer = crypto.randomBytes(digit);
  const number = (buffer.readUIntBE(0, digit) % 900000) + 100000;
  return String(number);
};
