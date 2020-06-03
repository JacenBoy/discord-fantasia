const mongoose = require("mongoose");

const redeemSchema = mongoose.Schema({
  _id: String,
  type: String,
  redeemed: Boolean,
  created: String,
  amount: Number,
  slug: String
});

module.exports = mongoose.model("Redeem", redeemSchema);