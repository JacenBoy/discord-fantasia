// Add a random amount of currency to the user's account. This can be done
// once per hour.

// Load required libraries/utilities
const users = require("../models/user.js");
const moment = require("moment");
require("moment-duration-format");

exports.name = "hourly";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "User",
  "permissions": []
};

exports.run = async (client, message, args) => {
  await client.ensureAccount(message.author.id);

  const user = await users.findOne({"_id": message.author.id});
  const lastHourly = moment(user.lastHourly, "x");
  const nextHourly = moment(lastHourly, "x").add(1, "hours");

  if (moment() <= nextHourly) {
    message.channel.send(`You have already claimed your hourly reward. Try again in ${moment.duration(nextHourly.diff(moment())).format("H [hrs] m [mins] s [secs]")}`);
    return;
  }

  const rnd = client.randInt(1,10) * 50;
  const newMoney = user.money + rnd;
  const hourlyTime = moment(new Date(), "x");
  await users.updateOne({"_id": message.author.id}, {"money": newMoney, "lastHourly": hourlyTime});
  message.channel.send(`${rnd} credits have been added to your account. You may do this once per hour.`);
};