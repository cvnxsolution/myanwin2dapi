const Admin = require("../models/adminModel");
const Agent = require("../models/agentModel");
const AuthAccount = require("../models/authAccountModel");
const User = require("../models/userModel");

module.exports = {
  agent: {
    model: Agent,
    requiredFields: ["name", "email", "password", "confirmPassword", "role"],
  },
  admin: {
    model: Admin,
    requiredFields: ["name", "email", "password", "confirmPassword", "role"],
  },
  user: {
    model: User,
    requiredFields: ["name", "email", "password", "confirmPassword", "role"],
  },
  authAccount: {
    model: AuthAccount,
    requiredFields: ["role", "password", "confirmPassword", "email", "refID"],
  },
};
