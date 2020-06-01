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
};