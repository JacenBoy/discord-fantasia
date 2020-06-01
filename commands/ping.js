// A basic ping test. Less useful for benchmarking and more useful for
// confirming that the bot is listening.

exports.name = "ping";
exports.aliases = [];
exports.config = {
  "guildOnly": false,
  "permLevel": "User",
  "permissions": []
};

exports.run = async (client, message, args) => {
  const msg = await message.channel.send("Pinging Discord");
  const pmsg = await msg.edit(`Reply from Discord: time=${msg.createdTimestamp - message.createdTimestamp}ms api-latency=${Math.round(client.ws.ping)}ms`);
  client.logger.debug(pmsg.content);
};