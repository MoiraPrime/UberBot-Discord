const discord = require("discord.js"),
  client = new discord.Client(),
  config = require("./config.json");

client.loginWithToken(config.token);
