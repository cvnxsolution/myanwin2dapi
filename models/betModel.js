const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  refID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "reference ID is required"],
    ref: "User",
  },
  amount: {
    type: Number,
    required: [true, "amount is required"],
  },
  number: {
    type: String,
    required: [true, "number is required"],
    match: [/^\d{2}$/, "Number must be a 2-digit string like '01', '23'"],
  },
  status: {
    type: String,
    enum: ["pending", "win", "lose"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

betSchema.index({ date: 1, number: 1 });
betSchema.index({ refID: 1, date: 1 });

const Bet = mongoose.model("Bet", betSchema);

module.exports = Bet;