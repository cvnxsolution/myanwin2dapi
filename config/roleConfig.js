const Admin = require("../models/adminModel");
const Agent = require("../models/agentModel");
const AuthAccount = require("../models/authAccountModel");
const User = require("../models/userModel");

module.exports = {
  agent: {
    modelInText: "Agent",
    model: Agent,
    requiredFields: ["name"],
    authContextBuilder: (authAccount, account) => ({
      auth_id: authAccount._id,
      account_id:
        authAccount.refID && authAccount.refID._id
          ? authAccount.refID._id
          : authAccount.refID,
      accountID: authAccount.accountID,
      role: authAccount.role,
      name: account.name,
    }),
  },
  admin: {
    modelInText: "Admin",
    model: Admin,
    requiredFields: ["name"],
    authContextBuilder: (authAccount, account) => ({
      auth_id: authAccount._id,
      account_id:
        authAccount.refID && authAccount.refID._id
          ? authAccount.refID._id
          : authAccount.refID,
      accountID: authAccount.accountID,
      email: authAccount.email,
      name: account.name,
      role: authAccount.role,
    }),
  },
  user: {
    modelInText: "User",
    model: User,
    requiredFields: ["name"],
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
