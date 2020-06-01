// Reload a command. This allows you to update commands without needing to
// reboot the bot.

exports.name = "reload";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "Admin",
  "permissions": []
};

exports.run = async (client, message, args) => {
  args.forEach(async (cmd) => {
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    let response = await client.unloadCommand(command.name);
    if (response) return message.channel.send(`Error Unloading: ${response}`);

    response = client.loadCommand(command.name);
    if (response) return message.channel.send(`Error Loading: ${response}`);

    await message.channel.send(`The command \`${command.name}\` has been reloaded`);
  });
};