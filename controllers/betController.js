const Bet = require("../models/betModel");
const { catchAsync } = require("../utils/catchAsync");
const roleModelMapper = require("../config/roleConfig");
const CustomAppError = require("../utils/CustomAppError");
const { getCutoffTime } = require("../utils/getCutoffTime");
const factory = require("./handlerFactory");

exports.createBet = catchAsync(async (req, res, next) => {
  const filteredFields = {};
  const role = "bet";
  const Model = roleModelMapper[role].model;

  const refID = req.user.account_id;

  req.body.refID = refID;

  for (const field of roleModelMapper[role].requiredFields) {
    if (!req.body[field])
      return next(new CustomAppError(`Missing required Fields: ${field}`, 400));
    filteredFields[field] = req.body[field];
  }
  const clientRequestTime = filteredFields.requestSentTime;
  const cutoff = getCutoffTime(next);

  console.log(cutoff);
  const clientSentAt = new Date(clientRequestTime).getTime();

  const now = new Date().now;

  const maxDelay = 5000; //network delay tollerance

  if (now - clientSentAt > maxDelay)
    return next(new CustomAppError("Please check your network", 400));

  const newBet = await Model.create(filteredFields);

  if (!newBet)
    return next(new CustomAppError("error creating a bet record", 400));

  return res.status(201).json({
    status: "success",
    message: "one bet record has been created",
  });
});

const roleMapper = roleModelMapper["bet"];

exports.getAllBet = factory.getAll(roleMapper);
exports.deleteAllBet = factory.deleteAll(roleMapper);
exports.getBetByID = factory.getOne(roleMapper);
exports.deleteBetByID = factory.deleteOne(roleMapper);
