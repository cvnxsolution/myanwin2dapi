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
    authContextBuilder: (authAccount, account) => ({
      auth_id: authAccount._id,
      account_id:
        authAccount.refID && authAccount.refID._id
          ? authAccount.refID._id
          : authAccount.refID,
      accountID: authAccount.accountID,
      email: authAccount.email,
      name: account.name,
      balance: account.balance,
    }),
  },
  authAccount: {
    model: AuthAccount,
    requiredFields: ["role", "password", "confirmPassword", "email", "refID"],
  },
};
