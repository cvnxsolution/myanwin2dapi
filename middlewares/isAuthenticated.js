const jwt = require("jsonwebtoken");
const CustomAppError = require("../utils/CustomAppError");
const { catchAsync } = require("../utils/catchAsync");
const { promisify } = require("util");
const AuthAccount = require("../models/authAccountModel");
const User = require("../models/userModel");
const roleModelMapper = require("../config/roleConfig");

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  const header = req.header.authorization;
  if (!header) return next(new CustomAppError("no token in header"), 401);

  const token = req.headers.authorization.split(" ")[1];
  if (!token) return next(new CustomAppError("no token found", 401));

  const jwtKey = process.env.JWT_SECRET_KEY;
  const decoded = await promisify(jwt.verify)(token, jwtKey);
  const { auth_id, role, user_id } = decoded;

  const authAccount = await AuthAccount.findOne({ _id: auth_id, role });
  if (!authAccount)
    return next(new CustomAppError("Invalid auth account", 401));

  const actualRole = authAccount.role;
  const Model = roleModelMapper[actualRole].model;
  const account = await Model.findById(user_id);

  if (!account) return next(new CustomAppError("account is missing", 401));

  req.user = roleModelMapper[actualRole].authContextBuilder(
    authAccount,
    account
  );
  next();
});
