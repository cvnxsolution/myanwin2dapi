const mongoose = require("mongoose");
const AuthAccount = require("./authAccountModel");
const mongooseCurrency = require("mongoose-currency").loadType(mongoose);

const Currency = mongoose.Types.Currency;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    balance: {
      type: Currency,
      required: [true, "balance is required"],
      min: [0, "balance cannot be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await AuthAccount.findOneAndDelete({ refID: doc._id, role: "user" });
    console.log(`🧹 Deleted AuthAccount linked to User ${doc._id}`);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
