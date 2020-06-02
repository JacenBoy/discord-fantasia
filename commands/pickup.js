// Add a random amount of currency to the user's account. This can be done
// up to five timers per hour.

// Load required libraries/utilities
const users = require("../models/user.js");
const moment = require("moment");
require("moment-duration-format");

exports.name = "pickup";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "User",
  "permissions": []
};

exports.run = async (client, message, args) => {
  await client.ensureAccount(message.author.id);

  const user = await users.findOne({"_id": message.author.id});
  const lastPickup = moment(user.lastPickup, "x");
  const nextPickup = moment(lastPickup, "x").add(1, "hours");
  var totalPickup = user.totalPickup;

  if (moment() <= nextPickup && totalPickup >= client.config.maxPickup) {
    message.channel.send(`You have picked up as much as you can find. Try again in ${moment.duration(nextPickup.diff(moment())).format("H [hrs] m [mins] s [secs]")}`);
    return;
  }

  const rnd = client.randInt(0,10);
  const newMoney = user.money + rnd;
  totalPickup++;
  const pickupTime = moment(new Date(), "x");
  await users.updateOne({"_id": message.author.id}, {"money": newMoney, "lastPickup": pickupTime, "totalPickup": totalPickup});
  if (rnd == 0) message.channel.send(`You weren't able to find anything the ground. You can try again ${client.config.maxPickup - totalPickup} ${client.config.maxPickup - totalPickup == 1 ? "time" : "times"} before the next reset.`);
  else message.channel.send(`You picked up ${rnd} ${rnd == 1 ? "credit" : "credits"} from the ground. You can do this ${client.config.maxPickup - totalPickup} ${client.config.maxPickup - totalPickup == 1 ? "time" : "times"} before the next reset.`);
};