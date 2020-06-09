// Get your current credits balance

// Load required libraries/utilities
const users = require("../models/user.js");

exports.name = "balance";
exports.aliases = ["bal", "money", "wallet", "credits"];
exports.config = {
  "guildOnly": false,
  "permLevel": "User",
  "permissions": []
};

exports.run = async (client, message, args) => {
  const userID = message.author.id;

  await client.ensureAccount(userID);

  const user = await users.findOne({"_id": userID});
  message.channel.send(`You currently have ${user.money} credits in your account.`);
};