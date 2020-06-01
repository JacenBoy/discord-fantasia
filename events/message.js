// The message event runs every time a message is received. This means
// that this is the file where our event handler is defined. This command
// handler is heavily inspired by Guide Bot.
// https://github.com/AnIdiotsGuide/guidebot

module.exports = async (client, message) => {
  // It's always best practice to have your bot ignore other bots. This
  // also prevents the bot from replying to itself.
  if (message.author.bot) return;

  // We're storing our server-level configurations in MongoDB, so pull the
  // bot prefix from there.
  // MongoDB configs are not implemented yet, so just pull from the config
  // file for now.
  const settings = client.config.defaultSettings;

  // If the user pings the bot, send them the prefix.
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.channel.send(`My prefix is \`${settings.prefix}\``);
  }

  // To avoid unecessary processing, ignore messages that don't start with
  // the prefix.
  if (message.content.indexOf(settings.prefix) !== 0) return;

  // Now we separate the message into "command" and "arguments".
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  // Now we check if the command or alias is defined in our collections.
  // If it is not, we'll just ignore the message.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;

  // If the command cannot be run in DMs and the user tries to use it in a
  // DM, send them a helpful error message.
  if (cmd && !message.guild && cmd.config.guildOnly) return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  // Check to make sure the user has the correct permissions to run the
  // command and give a helpful error message if they don't.
  if (message.guild && !message.member.hasPermission(cmd.config.permissions)) {
    if (!client.checkPermissions(cmd.config.permLevel, message.author.id)) return message.channel.send("You do not have permission to run this command.");
  }
  if (!message.guild && !client.checkPermissions(cmd.config.permLevel, message.author.id)) return message.channel.send("You do not have permission to run this command.");

  // If we've made it this far, it should be fine to run the command. Log
  // the attempt and run the command.
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`[CMD] ${message.author.username} (${message.author.id}) ran command ${cmd.name}`);
  cmd.run(client, message, args);
};