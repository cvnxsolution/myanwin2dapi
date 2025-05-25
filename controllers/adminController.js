const mongoose = require("mongoose");

const { catchAsync } = require("../utils/catchAsync");
const roleModelMapper = require("../config/roleConfig");
const roleConfig = require("../config/roleConfig");
const CustomAppError = require("../utils/CustomAppError");
const AuthAccount = require("../models/authAccountModel");

exports.createAdmin = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const adminRole = "admin";
    const adminMapper = roleConfig[adminRole];
    const adminRequiredFields = adminMapper.requiredFields;
    const adminFilterFields = {};

    req.body.role = "admin";

    for (const field of adminRequiredFields) {
      console.log(field);
      if (!req.body[field])
        throw new CustomAppError(`Missing required field, ${field}`);

      adminFilterFields[field] = req.body[field];
    }

    const [newAdmin] = await adminMapper.model.create([adminFilterFields], {
      session,
    });
    if (!newAdmin) throw new CustomAppError("admin creation failed", 400);

    const authRole = "authAccount";
    const authMapper = roleConfig[authRole];
    const authRequiredFields = authMapper.requiredFields;

    req.body.refID = newAdmin._id;
    const authFilterFields = {};

    for (const field of authRequiredFields) {
      if (!req.body[field])
        throw new CustomAppError(`missing required field ${field}`);
      authFilterFields[field] = req.body[field];
    }

    const [newAuth] = await AuthAccount.create([authFilterFields], { session });
    if (!newAuth) throw new CustomAppError("auth account creation failed", 400);

    await session.commitTransaction();

    return res.status(200).json({
      status: "success",
      message: "a new admin account created",
      user: {
        newAdmin,
        newAuth,
      },
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }
});

exports.getAllAdmin = catchAsync(async (req, res, next) => {
  const admins = await AuthAccount.find();
  return res.status(200).json({
    status: "success",
    message: "all admin fetched",
    admins,
  });
});

exports.getAdminByID = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "one admin is fetched",
  });
});

exports.updateAdminByID = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "one admin is updated",
  });
});

exports.deleteAdminByID = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "one admin is delected",
  });
});

exports.getMyInformation = (req, res, next) => {
  return res.status(200).json({
    status: "success",
    data: req.user,
  });
};
