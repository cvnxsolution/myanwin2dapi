const { catchAsync } = require("../utils/catchAsync");
const roleModelMapper = require("../config/roleConfig");
const CustomAppError = require("../utils/CustomAppError");

exports.loadDocument = (loadType) => {
  return catchAsync(async (req, res, next) => {
    let model = roleModelMapper[loadType].model;
    if (!model) return next(new CustomAppError("unknown model", 400));
    let id;
    if (loadType === "authAccount") {
      id = req.user.auth_id;
    } else {
      id = req.user.account_id;
    }
    if (!id) return next(new CustomAppError("id is undefined", 400));
    const doc = await model.findById(id);

    if (!doc) return next(new CustomAppError("document was not found", 404));
    req.user.doc = doc;
    next();
  });
};
