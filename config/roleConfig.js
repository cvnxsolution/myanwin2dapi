const Admin = require("../models/adminModel");
const Agent = require("../models/agentModel");
const AuthAccount = require("../models/authAccountModel");
const User = require("../models/userModel");

module.exports = {
  agent: {
    modelInText: "Agent",
    model: Agent,
    requiredFields: ["name", "email", "password", "confirmPassword", "role"],
  },
  admin: {
    modelInText: "Admin",
    model: Admin,
    requiredFields: ["name", "email", "password", "confirmPassword", "role"],
  },
  user: {
    modelInText: "User",
    model: User,
    requiredFields: ["name", "email", "password", "confirmPassword"],
  },
  authAccount: {
    model: AuthAccount,
    requiredFields: ["role", "password", "confirmPassword", "email", "refID"],
  },
};
