const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authAccountSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      required: [true, "role must be user, agent or admin"],
    },
    refID: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "refID is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "confirm password is required"],
    },
  },
  { timestamps: true }
);

authAccountSchema.methods.isCorrectPassword = async function (
  userPassword,
  hashedPassword
) {
  return await bcrypt.compare(userPassword, hashedPassword);
};

authAccountSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const AuthAccount = mongoose.model("AuthAccount", authAccountSchema);

module.exports = AuthAccount;
