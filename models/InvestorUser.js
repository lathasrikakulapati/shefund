const mongoose = require("mongoose");

const investorUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },  // make email unique
  password: String,
});

module.exports = mongoose.model("InvestorUser", investorUserSchema);
