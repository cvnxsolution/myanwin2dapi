const Agent = require("../models/agentModel");
const { catchAsync } = require("../utils/catchAsync");
const AuthAccount = require("../models/authAccountModel");
const CustomAppError = require("../utils/CustomAppError");
const User = require("../models/userModel");
const roleModelMapper = require("../config/roleConfig");
const mongoose = require("mongoose");
const factory = require("./handlerFactory");

exports.deposit = catchAsync(async (req, res, next) => {
  const { depoAccountID = "", amount = "" } = req.body;
  const authAccount = await AuthAccount.findOne({
    accountID: depoAccountID,
    role: "user",
  });
  const accountID = authAccount.refID;

  if (!authAccount) return next(new CustomAppError("depo account id is wrong"));

  const account = await User.findById(accountID);
  if (!account) return next(new CustomAppError("account no longer exists"));

  account.$inc("balance", amount);
  account.save();

  return res.status(200).json({
    status: "scucess",
    message: "deposited",
    account,
  });
});

exports.createAgent = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const accountRole = "agent";
    const accountRoleMapper = roleModelMapper[accountRole];

    const accountFilteredFields = {};
    for (const field of accountRoleMapper.requiredFields) {
      if (!req.body[field])
        throw new CustomAppError(`Missing required Fields: ${field}`, 400);
      accountFilteredFields[field] = req.body[field];
    }

    const accountModel = accountRoleMapper.model;
    if (!accountModel) throw new CustomAppError("Unknown model specified", 400);

    const [account] = await accountModel.create([accountFilteredFields], {
      session,
    });
    if (!account)
      throw new CustomAppError("Failed to create agent account", 500);

    //needed for referential integrity
    req.body.refID = account._id;

    const authAccountFilteredFields = {};
    const authRoleMapper = roleModelMapper["authAccount"];

    for (const field of authRoleMapper.requiredFields) {
      if (!req.body[field])
        throw new CustomAppError(`Missing required Fields ${field}`, 400);

      authAccountFilteredFields[field] = req.body[field];
    }

    const [authAccount] = await authRoleMapper.model.create(
      [authAccountFilteredFields],
      { session }
    );

    const responseContext = accountRoleMapper.authContextBuilder(
      authAccount,
      account
    );

    await session.commitTransaction();

    return res.status(201).json({
      status: "success",
      message: "an agent account is created",
      user: responseContext,
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

const roleMapper = roleModelMapper["agent"];

exports.getAllAgents = factory.getAll(roleMapper);
exports.getAgentByID = factory.getOne(roleMapper);
exports.updateAgentByID = factory.updateOne(roleMapper);
exports.deleteAgentByID = factory.deleteOne(roleMapper);
exports.getMyInformation = factory.getMe();
