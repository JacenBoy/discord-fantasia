// Turns the bot off. If you have the bot properly configured as a service
// or running under PM2, it will automatically start up again.

exports.name = "reboot";
exports.aliases = ["stop", "shutdown", "restart"];
exports.config = {
  "guildOnly": false,
  "permLevel": "Admin",
  "permissions": []
};

exports.run = async (client, message, args) => {
  await message.channel.send("The bot is shutting down.");
  await Promise.all(client.commands.map(cmd =>
    client.unloadCommand(cmd)
  ));
  process.exit(0);
};