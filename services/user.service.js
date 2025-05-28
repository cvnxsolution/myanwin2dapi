const roleConfig = require("../config/roleConfig");
const CustomAppError = require("../utils/CustomAppError");

exports.createUserWithAuth = async (req) => {
  const role = "user";
  const session = await mongoose.startSession();
  session.startTransaction();

  if (req.body.role && req.body.role !== "user") {
    console.warn("Suspicious role override attempt:", req.body.role);
  }

  try {
    const config = roleConfig[role];
    if (!config) throw new CustomAppError("Invalid role specified", 400);

    const domainUserFields = {};
    for (const field of config.requiredFields) {
      if (!req.body[field])
        throw new CustomAppError(`Missing required field: ${field}`, 400);
      domainUserFields[field] = req.body[field];
    }

    // Security: Prevent user-defined initial balance via request payload.
    // Although roleConfig.js enforces field whitelisting, this is explicitly set
    // as a defense-in-depth measure to guarantee zero starting balance.
    domainUserFields.balance = 0;

    const [domainUser] = await config.model.create([domainUserFields], {
      session,
    });

    req.body.refID = domainUser._id;

    const authAccountFields = {};
    req.body.role = role;

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

    return { domainUser, authAccount };
    
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }
};
