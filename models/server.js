const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  _id: String,
  prefix: String
});

module.exports = mongoose.model("Server", configSchema);