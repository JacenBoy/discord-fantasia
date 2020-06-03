// Generate a code that a user can share to gift assets to other players

// Load required libraries/utilities
const users = require("../models/user.js");

exports.name = "gift";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "User",
  "permissions": []
};

exports.run = async (client, message, args) => {
  switch (args[0].toLowerCase()) {
    case "money":
    case "credits":
      if (!args[1] || isNaN(args[1])) return message.channel.send("Please specify the amount of money to gift.");
      args[1] = Math.abs(args[1]);
      
      await client.ensureAccount(message.author.id);

      const user = await users.findOne({"_id": message.author.id});
      if (args[1] > user.money) return message.channel.send("You do not have enough credits to complete this command.");

      const serial = await client.generateRedeem("money", args[1]);
      message.author.send(`Your gift ID is \`${serial}\`. Send this code to the person you would like to gift to. This code expires in 7 days.`);
      message.channel.send("A code has been sent to you via DM. Share this code with your gift recipient.");
      await user.updateOne({"money": user.money - args[1]});
      break;
    default:
      message.channel.send("That is not an item that you can gift to another player.");
      break;
  }
};