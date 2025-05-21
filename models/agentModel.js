const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
});

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
