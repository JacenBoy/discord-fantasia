const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String,
  money: Number,
  lastDaily: String,
  lastHourly: String,
  cards: [String]
});

module.exports = mongoose.model("User", userSchema);