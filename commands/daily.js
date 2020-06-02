// Add a random amount of currency to the user's account. This can be done
// once per day.

// Load required libraries/utilities
const users = require("../models/user.js");
const moment = require("moment");
require("moment-duration-format");

exports.name = "daily";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "User",
  "permissions": []
};

exports.run = async (client, message, args) => {
  await client.ensureAccount(message.author.id);

  const user = await users.findOne({"_id": message.author.id});
  const lastDaily = moment(user.lastDaily, "x");
  const nextDaily = moment(lastDaily, "x").add(1, "days");

  if (moment() <= nextDaily) {
    message.channel.send(`You have already claimed your daily reward. Try again in ${moment.duration(nextDaily.diff(moment())).format("H [hrs] m [mins] s [secs]")}`);
    return;
  }

  const rnd = client.randInt(1,10) * 100;
  const newMoney = user.money + rnd;
  const dailyTime = moment(new Date(), "x");
  await users.updateOne({"_id": message.author.id}, {"money": newMoney, "lastDaily": dailyTime});
  message.channel.send(`${rnd} credits have been added to your account. You may do this once per day.`);
};