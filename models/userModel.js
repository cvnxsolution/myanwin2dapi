const mongoose = require("mongoose");
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

const User = mongoose.model("User", userSchema);

module.exports = User;
