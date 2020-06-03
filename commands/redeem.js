// Redeem a gift code

// Load required libraries/utilities
const redeems = require("../models/redeem.js");
const users = require("../models/user.js");
const moment = require("moment");

exports.name = "redeem";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "User",
  "permissions": []
};

exports.run = async (client, message, args) => {
  if (!args[0]) return message.channel.send("Please specify the code that you would like to redeem.");
  if (!await redeems.exists({"_id": args[0]})) return message.channel.send("The code could not be found.");
  const redeem = await redeems.findOne({"_id": args[0]});
  if (redeem.redeemed == true || moment() > moment(redeem.created, "x").add(7, "days")) return message.channel.send("The code could not be found.");

  await client.ensureAccount(message.author.id);
  const user = await users.findOne({"_id": message.author.id});

  switch (redeem.type.toLowerCase()) {
    case "money":
      await user.updateOne({"money": user.money + redeem.amount});
      await redeem.updateOne({"redeemed": true});
      client.logger.log(`${message.author.username} (${message.author.id}) has redeemed ${redeem.amount} credits from redeem code ${redeem._id}`);
      message.channel.send(`${redeem.amount} credits have been added to your account.`);
      break;
    default:
      message.channel.send("An error occurred running this command. Please try again later.");
      break;
  }
};