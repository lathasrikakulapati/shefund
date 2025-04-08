const mongoose = require("mongoose");

const WomenUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("WomenUser", WomenUserSchema);
