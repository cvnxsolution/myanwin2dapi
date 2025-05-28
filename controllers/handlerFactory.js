const { catchAsync } = require("../utils/catchAsync");

exports.deleteOne = ({ model, modelInText }) => {
  return catchAsync(async (req, res, next) => {
    return res.status(200).json({
      status: "success",
      message: `One ${modelInText} is deleted`,
    });
  });
};

exports.deleteAll = ({ model, modelInText }) => {
  return catchAsync(async (req, res, next) => {
    await model.deleteMany({});
    return res.status(200).json({
      status: "success",
      message: `all ${modelInText} are deleted`,
    });
  });
};

exports.getOne = ({ model, modelInText }) => {
  return catchAsync(async (req, res, next) => {
    return res.status(200).json({
      status: "success",
      message: `One ${modelInText} is fetched `,
    });
  });
};

exports.updateOne = ({ model, modelInText }) => {
  return catchAsync(async (req, res, next) => {
    return res.status(200).json({
      status: "success",
      message: `One ${modelInText} is updated`,
    });
  });
};

exports.getAll = ({ model, modelInText }) => {
  return catchAsync(async (req, res, next) => {
    const data = await model.find();
    return res.status(200).json({
      status: "success",
      message: `all ${modelInText} are fetched`,
      data,
    });
  });
};

exports.getMe = () => {
  return (req, res, next) => {
    return res.status(200).json({
      status: "success",
      data: req.user,
    });
  };
};
