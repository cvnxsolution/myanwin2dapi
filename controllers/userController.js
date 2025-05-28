const factory = require("./handlerFactory");
const roleModelMapper = require("../config/roleConfig");

const roleMapper = roleModelMapper["user"];

exports.getAllUsers = factory.getAll(roleMapper);
exports.getMyInformation = factory.getMe();
exports.getUserByID = factory.getOne(roleMapper);
exports.updateUserByID = factory.updateOne(roleMapper);
exports.deleteUserByID = factory.deleteOne(roleMapper);
