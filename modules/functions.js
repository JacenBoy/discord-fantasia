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

  // client.unloadCommand - The opposite of loadCommand. Removes the
  // command from memory so it can be loaded again. Useful for the reload
  // and reboot commands.
  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) {
      await command.shutdown(client);
    }
    const mod = require.cache[require.resolve(`../commands/${commandName}`)];
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
  };

  // client.getSettings - Retrieve customizable bot settings from the
  // MongoDB database. This allows server owners to adjust things like the
  // bot prefix.
  client.getSettings = async (serverID) => {
    const mongoose = require("mongoose");
    const servers = require("../models/server.js");
    const serverExists = await servers.exists({"_id": serverID});
    if (!serverExists) {
      await servers.updateOne({"_id": serverID}, {"prefix": client.config.defaultSettings.prefix}, {"upsert": true});
    }
    const serverConfig = await servers.findOne({_id: serverID});
    return serverConfig;
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

  // client.awaitReply - Wait for a response from a user. Useful when you
  // need to be able to ask for additional information.
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  // client.ensureAccount - Check if the user has a profile in the
  // database. If not, create one. Also ensure required fields are
  // created if they don't exist already (i.e. after an update).
  client.ensureAccount = async (userID) => {
    const users = require("../models/user.js");
    const userExists = await users.exists({"_id": userID});
    if (!userExists) {
      await users.updateOne({"_id": userID}, {
        "money": client.config.defaultProfile.money,
        "totalPickup": "0",
        "cards": []
      }, {"upsert": true});
    }

    const user = await users.findOne({"_id": userID});
    if (!user.totalPickup) {
      await user.updateOne({"totalPickup": 0});
    }
  };

  // client.generateRedeem - Generate a code to allow users to send gifts
  // to other users, and add this code to the database.
  client.generateRedeem = async (redeemType, redeemAmount, redeemSlug) => {
    const moment = require("moment");
    const luhnify = require("luhnify");
    const redeems = require("../models/redeem.js");
    switch (redeemType.toLowerCase()) {
      case "money":
        var foundSlot = false;
        while (!foundSlot) {
          var serial = luhnify("########");
          if (await redeems.exists({"_id": serial})) {
            const redeem = await redeems.findOne({"_id": serial});
            if (redeem.redeemed == true || moment() > moment(redeem.created, "x").add(7, "days")) foundSlot = true;
          } else foundSlot = true;
        }
        await redeems.updateOne({"_id": serial}, {"type": "money", "amount": redeemAmount, "created": moment(new Date(), "x"), "redeemed": false}, {"upsert": true});
        return serial;
      default:
        // There was an error calling the function, so return false
        return false;
    }
  };

  // client.colorInt - Turn a standard hex color code into a decinal for
  // embeds. Mostly for readability, but very convenient.
  client.colorInt = (hexin) => {
    if (hexin.startsWith("#")) return parseInt(hexin.split("#")[1], 16);
    else return parseInt(hexin, 16);
  };

  // client.randInt - Generate a random integer.
  client.randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  };

  // These handle uncaught exceptions/unhandled rejections and give a
  // little extra information about the errors.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    // It's best practice to let your code crash on unhandled exceptions.
    // Not doing so could leave your bot in an inconsistent or buggy
    // state. For the sake of convenience, though, I'm not doing this.
    //process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });
};