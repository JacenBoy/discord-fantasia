// The eval command will let you run any arbitrary JavaScript from the
// bot. Note that the eval command is VERY dangerous and should always be
// inaccessible to anyone other than the bot owner.

// Load required libraries/utilities
const fetch = require("node-fetch");

exports.name = "eval";
exports.aliases = ["exec"];
exports.config = {
  "guildOnly": false,
  "permLevel": "Owner",
  "permissions": []
};

exports.run = async (client, message, args) => {
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    if (clean.length > 1090) { 
      try {
        const {key} = await fetch("https://hasteb.in/documents", {
          method: "POST",
          body: clean,
          headers: {"Content-Type": "application/json"}
        }).then(res => res.json());
        message.channel.send({"embed":{"description": `Response too long. Uploaded output to https://hasteb.in/${key}.js.`}});
      } catch (ex) {
        client.logger.debug(clean);
        message.channel.send({"embed":{"description": "Response too long. Check the console for full output."}});
      }
      
    } else {
      message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
    }
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};