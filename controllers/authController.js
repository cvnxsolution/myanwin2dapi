const CustomAppError = require("../utils/CustomAppError");
const { catchAsync } = require("../utils/catchAsync");
const roleConfig = require("../config/roleConfig");
const mongoose = require("mongoose");

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
