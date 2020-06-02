// Reset a user's daily reward timer

// Load required libraries/utilities
const users = require("../models/user.js");

exports.name = "resetdaily";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "Support",
  "permissions": []
};

exports.run = async (client, message, args) => {
  if (!args[0]) return message.channel.send("Please specify users to reset.");
  args.forEach(async (u) => {
    const userID = u.match(/\d+/gi);
    await client.ensureAccount(userID);
    await users.updateOne({"_id": userID}, {"lastDaily": "0"});
  });
  client.logger.log(`${message.author.username} (${message.author.id}) has reset the reward timer for the following accounts: ${args.join(", ")}`);
  message.channel.send("Daily reward timer has been reset for the specified users.");
};