// This file includes a number of utility functions for convenience and
// readability. A number of these were borrowed from Guide Bot.
// https://github.com/AnIdiotsGuide/guidebot

module.exports = (client) => {
  // loadCommand - A function designed to load a command into our commands
  // collection. This is for readability in our index.js file and our
  // reload command.
  client.loadCommand = (commandName) => {
    // We'll wrap our loader in a try/catch to deal with and report any
    // errors during the loading process.
    try {
      client.logger.log(`Loading Command: ${commandName.split(".")[0]}`);
      const props = require(`../commands/${commandName}`);
      // Load our command into the collection, along with any aliases
      client.commands.set(props.name, props);
      props.aliases.forEach(alias => {
        client.aliases.set(alias, props.name);
      });
      // If everything loads correctly, return false. This might seem
      // backwards at first glance, but it makes the most sense to do it
      // this way.
      return false;
    } catch (ex) {
      // Return the error so we can log it.
      return `Unable to load command ${commandName}: ${ex}`;
    }
  };

  // checkPermissions - A very basic check to make sure users have the
  // correct permissions to run a command. Probably very inefficient.
  client.checkPermissions = (permLevel, userID) => {
    switch (permLevel) {
      case "User":
        // Always return true for the User check
        return true;
      case "Support":
        // Check if the user is listed as "Support" or higher in the
        // config file.
        if (client.config.support.includes(userID)) return true;
      case "Admin":
        // Check if the user is listed as "Admin" or higher
        if (client.config.admins.includes(userID)) return true;
      case "Owner":
        // Check if the user is the bot owner
        if (client.config.ownerID == userID) return true;
      default:
        // If we've fallen through this far, the user does not have the
        // correct permissions.
        return false;
    }
  };

  // client.clean - Useful to remove sensitive information (i.e. the bot
  // token) from message output. Only really used for the eval command,
  // but used for code readability.
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, {depth: 1});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  // client.colorInt - Turn a standard hex color code into a decinal for
  // embeds. Mostly for readability, but very convenient.
  client.colorInt = (hexin) => {
    if (hexin.startsWith("#")) return parseInt(hexin.split("#")[1], 16);
    else return parseInt(hexin, 16);
  };
};