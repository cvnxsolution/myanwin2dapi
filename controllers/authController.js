const CustomAppError = require("../utils/CustomAppError");
const { catchAsync } = require("../utils/catchAsync");
const roleConfig = require("../config/roleConfig");
const mongoose = require("mongoose");
const AuthAccount = require("../models/authAccountModel");
const { signJWTToken } = require("../utils/jwtUtil");
const factory = require("./handlerFactory");
const { createUserWithAuth } = require("../services/user.service");

exports.login = catchAsync(async (req, res, next) => {
  // can login by email or id with password
  const {
    email = "",
    password = "",
    accountID = undefined,
    role = "",
  } = req.body;

  let userFound = await AuthAccount.findOne({
    $or: [{ email }, { accountID }],
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
  if (role !== actualRole)
    return next(
      new CustomAppError(`there is no ${role} with registed with ${email}`),
      400
    );

  userFound = await userFound.populate({
    path: "refID",
    model: roleConfig[actualRole].modelInText,
  });

  if (!userFound.refID || !userFound.refID._id) {
    console.warn(
      `Orphan AuthAccount found. Email: ${email}, Role: ${actualRole}`
    );
    return next(
      new CustomAppError(
        "Authentication failed: linked user data missing.",
        400
      )
    );
  }

  const token = signJWTToken(
    userFound._id,
    userFound.role,
    0,
    userFound.refID._id
  );
  if (!token)
    return next(new CustomAppError("generating token gone wrong", 400));

  return res.status(200).json({
    status: "success",
    token,
  });
});

exports.signUp = catchAsync(async (req, res, next) => {
  const { domainUser, authAccount } = await createUserWithAuth(req);

  return res.status(201).json({
    status: "success",
    domainUser,
    authAccount,
  });
});

const roleMapper = roleConfig["authAccount"];

exports.getAllAuthAccounts = factory.getAll(roleMapper);
