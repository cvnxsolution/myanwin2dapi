const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    status: "success",
    message: "all user fetched",
    users,
  });
});

exports.getMyInformation = (req, res, next) => {
  return res.status(200).json({
    status: "success",
    data: req.user,
  });
};

exports.getUserByID = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "one user is fetched",
  });
});

exports.updateUserByID = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "one user is updated",
  });
});

exports.deleteUserByID = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "one user is delected",
  });
});
