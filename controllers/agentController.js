const Agent = require("../models/agentModel");
const { catchAsync } = require("../utils/catchAsync");

exports.deposit = catchAsync(async (req, res, next) => {
  const { depoAccountID = "", amount = "" } = req.body;
  return res.status(200).json({
    status: "scucess",
    message: "deposited",
  });
});

exports.getAllAgents = catchAsync(async (req, res, next) => {
  const agents = await Agent.find();
  return res.status(200).json({
    status: "success",
    message: "all agents fetched",
    agents,
  });
});


exports.createAgent = catchAsync(async (req, res, next)=>{
  
})