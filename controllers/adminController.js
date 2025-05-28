const mongoose = require("mongoose");

const { catchAsync } = require("../utils/catchAsync");
const roleConfig = require("../config/roleConfig");
const CustomAppError = require("../utils/CustomAppError");
const AuthAccount = require("../models/authAccountModel");
const factory = require("./handlerFactory");
const Admin = require("../models/adminModel");
const roleModelMapper = require("../config/roleConfig");

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
const roleMapper = roleModelMapper["admin"];

exports.getAllAdmin = factory.getAll(roleMapper);

exports.getAdminByID = factory.getOne(roleMapper);
exports.updateAdminByID = factory.updateOne(roleMapper);
exports.deleteAdminByID = factory.deleteOne(roleMapper);

exports.getMyInformation = factory.getMe();
