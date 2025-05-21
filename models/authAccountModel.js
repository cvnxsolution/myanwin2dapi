const mongoose = require("mongoose");

const authAccountSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "agent", "admin"],
    required: [true, "role must be user, agent or admin"],
  },
  refID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "refID is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  confirmPassword: {
    type: String,
    required: [true, "confirm password is required"],
  },
});

const AuthAccount = mongoose.model("AuthAccount", authAccountSchema);

module.exports = AuthAccount;
