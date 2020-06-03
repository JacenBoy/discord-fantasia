// A command to let staff give items/money to other players.

// Load required libraries/utilities
const users = require("../models/user.js");

exports.name = "give";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "Support",
  "permissions": []
};

exports.run = async (client, message, args) => {
  if (!args[0]) return message.channel.send("Please specify the type of asset to give.");
  switch (args[0].toLowerCase()) {
    case "money":
      if (!args[1] || isNaN(args[1])) return message.channel.send("Please specify the amount of money to give.");
      for (var i = 2; i < args.length; i++) {
        const userID = args[i] = args[i].match(/\d+/gi);
        await client.ensureAccount(userID);
        const user = await users.findOne({"_id": userID});
        const newMoney = user.money + parseInt(args[1]);
        await user.updateOne({"money": newMoney});
      }
      client.logger.log(`${message.author.username} (${message.author.id}) has added ${args[1]} credits to the following accounts: ${args.slice(2).join(", ")}`);
      message.channel.send(`${args[1]} credits have been added to the specified accounts.`);
      break;
    default:
      message.channel.send("You cannot give that asset with this command.");
      break;
  }
};