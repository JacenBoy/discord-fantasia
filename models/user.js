const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String,
  money: Number,
  totalPickup: Number,
  lastDaily: String,
  lastHourly: String,
  lastPickup: String,
  cards: [String]
});

module.exports = mongoose.model("User", userSchema);