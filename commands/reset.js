// Reset reward timers for a user

// Load required libraries/utilities
const users = require("../models/user.js");

exports.name = "reset";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "Support",
  "permissions": []
};

exports.run = async (client, message, args) => {
  if (!args[0]) return message.channel.send("Please specify the timer to reset.");
  if (!args[1]) return message.channel.send("Please specify a user to reset.");
  switch (args[0].toLowerCase()) {
    case "daily":
      args.slice(1).forEach(async (u) => {
        const userID = u.match(/\d+/gi);
        await client.ensureAccount(userID);
        await users.updateOne({"_id": userID}, {"lastDaily": "0"});
      });
      client.logger.log(`${message.author.username} (${message.author.id}) has reset the daily reward timer for the following accounts: ${args.slice(1).join(", ")}`);
      message.channel.send("Daily reward timer has been reset for the specified users.");
      break;
    case "hourly":
      args.slice(1).forEach(async (u) => {
        const userID = u.match(/\d+/gi);
        await client.ensureAccount(userID);
        await users.updateOne({"_id": userID}, {"lastHourly": "0"});
      });
      client.logger.log(`${message.author.username} (${message.author.id}) has reset the hourly reward timer for the following accounts: ${args.slice(1).join(", ")}`);
      message.channel.send("Hourly reward timer has been reset for the specified users.");
      break;
    default:
      message.channel.send("That is not a timer that can be reset.");
      break;
  }
};