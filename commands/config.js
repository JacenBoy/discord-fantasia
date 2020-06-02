// Change server config settings (i.e. the prefix). Either bot staff or
// a user with MANAGE_MESSAGES permissions should be able to run this.

// Load required libraries/utilities
const servers = require("../models/server.js");

exports.name = "config";
exports.aliases = [];
exports.config = {
  "guildOnly": true,
  "permLevel": "Support",
  "permissions": ["MANAGE_MESSAGES"]
};

exports.run = async (client, message, args) => {
  if (!args[0]) return message.channel.send("Please choose a setting to configure.");
  switch (args[0].toLowerCase()) {
    case "prefix":
      const newPrefix = args[1] ? args[1] : client.config.defaultSettings.prefix;
      await servers.updateOne({"_id": message.guild.id}, {"prefix": newPrefix}, {"upsert": true});
      message.channel.send(`The prefix has been updated to \`${newPrefix}\`.`);
      break;
    default:
      message.channel.send("This is not a configurable setting.");
  }
};