const CustomAppError = require("../utils/CustomAppError");
const { catchAsync } = require("../utils/catchAsync");
const roleConfig = require("../config/roleConfig");
const mongoose = require("mongoose");
const AuthAccount = require("../models/authAccountModel");
const { signJWTToken } = require("../utils/jwtUtil");

exports.login = catchAsync(async (req, res, next) => {
  // can login by email or id with password
  const {
    email = "",
    password = "",
    accountID = undefined,
    role = "",
  } = req.body;

  let userFound = await AuthAccount.findOne({
    $or: [{ email }, { refID: accountID }],
    role,
  }).select("+password");

  if (!userFound) return next(new CustomAppError("user not found"));

  const isCorrectPassword = await userFound.isCorrectPassword(
    password,
    userFound.password
  );

  if (!isCorrectPassword)
    return next(new CustomAppError("password or user id was wrong", 400));

  userFound = await userFound.populate({
    path: "refID",
    model: roleConfig[role].modelInText,
  });

  const token = signJWTToken(userFound._id);
  if (!token)
    return next(new CustomAppError("generating token gone wrong", 400));

  return res.status(200).json({
    status: "success",
    token,
    userFound,
  });
});

exports.signUp = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

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
    session.endSession();
    return next(err);
  }
});
