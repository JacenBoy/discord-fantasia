// Get your current credits balance

// Load required libraries/utilities
const users = require("../models/user.js");

exports.name = "balance";
exports.aliases = ["bal", "money", "wallet"];
exports.config = {
  "guildOnly": false,
  "permLevel": "User",
  "permissions": []
};

exports.run = async (client, message, args) => {
  await client.ensureAccount(message.author.id);

  const user = await users.findOne({"_id": message.author.id});
  message.channel.send(`You currently have ${user.money} credits in your account.`);
};