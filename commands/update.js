// Pull the latest version of the bot from GitHub. Will not work if the
// bot repository was not pulled with git.

// Load required libraries/utilities
const {promisify} = require("util");
const exec = promisify(require("child_process").exec);

exports.name = "update";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "Admin",
  "permissions": []
};

exports.run = async (client, message, args) => {
  try {
    const updateResult = await exec("git pull origin");
    if (updateResult.error) throw updateResult.error.message;
    if (updateResult.stderr) throw updateResult.stderr;
    client.logger.log(`Console output: ${updateResult.stdout}`);
    message.channel.send("The bot has been updated.");
  } catch (ex) {
    message.channel.send("An error occurred while updating the bot.");
    client.logger.error(JSON.stringify(ex));
  }
};