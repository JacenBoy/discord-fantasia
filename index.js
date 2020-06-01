// Load the required libraries and utilities
const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const mongoose = require("mongoose");

// Now define our client and add the various additional properties to it
const client = new Discord.Client({disableEveryone: true});
client.config = require("./config.json");
client.logger = require("./modules/Logger.js");
client.mongoose = mongoose.connect(client.config.mongouri, {useNewUrlParser: true});

// We'll also add a number of utility functions that will make things
// easier for us later.
require("./modules/functions.js")(client);

// Define our commands list as a collection, courtesy of Discord.js. Check
// out one of the below links for an explanation about why collections
// are awesome.
// https://discordjs.guide/command-handling/
// https://discordjs.guide/additional-info/collections.html
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Top level async function so we can take advantage of async/await during
// our initialization process. Check out the link below for additional
// information about how promises and async/await work.
// https://discordjs.guide/additional-info/async-await.html
const init = async () => {
  // First we load our commands into memory in the collection we
  // defined earlier.
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach((c) => {
    if (!c.endsWith(".js")) return; // If it's not a .js file, don't process it
    const response = client.loadCommand(c);
    if (response) client.logger.error(response);
  });

  // Now we load the various events we want to listen to. The most
  // important of these is the message event, which includes our
  // command handler. Note that we aren't using collections for this, as
  // there is a better way to do this.
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach((e) => {
    const eventName = e.split(".")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${e}`);
    client.on(eventName, event.bind(null, client));
  });

  // Login our client
  client.login(client.config.token);
};

// Now run the init function
init();