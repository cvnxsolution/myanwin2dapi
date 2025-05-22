const CustomAppError = require("../utils/CustomAppError");
const { catchAsync } = require("../utils/catchAsync");
const roleConfig = require("../config/roleConfig");
const mongoose = require("mongoose");
const AuthAccount = require("../models/authAccountModel");
const { signJWTToken } = require("../utils/jwtUtil");

exports.login = catchAsync(async (req, res, next) => {
  // can login by email or id with password
  const { email = "", password = "", accountID = undefined } = req.body;

  let userFound = await AuthAccount.findOne({
    $or: [{ email }, { refID: accountID }],
  }).select("+password");

  let isCorrectPassword = undefined;
  if (userFound) {
    isCorrectPassword = await userFound.isCorrectPassword(
      password,
      userFound.password
    );
  }

  if (!userFound || !isCorrectPassword)
    return next(new CustomAppError("Invalid credentials", 400));

  userFound.password = undefined;

  const actualRole = userFound.role;

  userFound = await userFound.populate({
    path: "refID",
    model: roleConfig[actualRole].modelInText,
  });

  const token = signJWTToken(userFound._id, userFound.role);
  if (!token)
    return next(new CustomAppError("generating token gone wrong", 400));

  return res.status(200).json({
    status: "success",
    token,
    userFound,
  });
});

exports.signUp = catchAsync(async (req, res, next) => {
  const role = "user";
  const session = await mongoose.startSession();
  session.startTransaction();

  if (req.body.role && req.body.role !== "user") {
    console.warn("Suspicious role override attempt:", req.body.role);
  }

  try {
    const config = roleConfig[role];
    if (!config) throw new CustomAppError("Invalid role specified", 400);

    const domainUserFields = {};
    for (const field of config.requiredFields) {
      if (!req.body[field])
        throw new CustomAppError(`Missing required field: ${field}`, 400);
      domainUserFields[field] = req.body[field];
    }

    const [domainUser] = await config.model.create([domainUserFields], {
      session,
    });

    req.body.refID = domainUser._id;

    const authAccountFields = {};
    req.body.role = role;

    for (const field of roleConfig.authAccount.requiredFields) {
      if (!req.body[field])
        throw new CustomAppError(`Missing auth field: ${field}`, 400);
      authAccountFields[field] = req.body[field];
    }

    const [authAccount] = await roleConfig.authAccount.model.create(
      [authAccountFields],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: "success",
      user: domainUser,
      centralUser: authAccount,
    });
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }
});
