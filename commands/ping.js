exports.name = "ping";
exports.aliases = ["p"];
exports.config = {
  "guildOnly": false,
  "permLevel": "User"
};

exports.run = async (client, message, args) => {
  const msg = await message.channel.send("Pinging Discord");
  const pmsg = await msg.edit(`Reply from Discord: time=${msg.createdTimestamp - message.createdTimestamp}ms api-latency=${Math.round(client.ws.ping)}ms`);
  client.logger.debug(pmsg.content);
};