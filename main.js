var config = require("./config")
var version = "1.0.0 using Discord.io version 1.6.0."

var DiscordClient = require('discord.io');
var bot = new DiscordClient({
    email: config.email,
    password: config.password,
    autorun: true
});

var random = require("random-js")(); // uses the nativeMath engine

var botState = {shutdownPhase:false}

function statusReport(report) {
	console.log(report)
	bot.sendMessage({ to: "129321709533790208", message: report})
}

var commands = {
    "ping": function(channelID, user, userID, message, msplit) {
		var args = {
			"justin": function() {
				statusReport("INFO: Responded to ping (type: justin) from " + user);
				bot.sendMessage({to: channelID, message: "Justinisanoob!"});
			}
		}
		if (msplit[1] in args){
			args[msplit[1]]();
		}
		else if (msplit[1] != undefined){
			statusReport("WARN: " + user + " gave invalid argument " + msplit[1] + " for command ping.");
			bot.sendMessage({to:channelID, message: "Invalid Arguments."});
		}
		else {
			statusReport("INFO: Responded to ping from " + user);
			bot.sendMessage({to:channelID, message: "Pong!"});
		}
    },
	"help": function(channelID, user, userID, message, msplit) {
		var args = {
			"help": function() {
				statusReport("INFO: Responded to help with argument help from " + user);
				bot.sendMessage({to: userID, message: "&help <command> - Gives a list of commands, and alternatively the specifics of a single command if an argument is given."});
			},
			"rtd": function() {
				statusReport("INFO: Responded to help with argument rtd from " + user);
				bot.sendMessage({to: userID, message: "&rtd - Rolls the dice."})
			},
			"version": function() {
				statusReport("INFO: Responded to help with argument version from " + user);
				bot.sendMessage({to: userID, message: "&version - Lists the current version of the bot."});
			},
			"ping": function() {
				statusReport("INFO: Responded to help with argument ping from " + user);
				bot.sendMessage({to: userID, message: "&ping <argument> - Checks whether the bot is online."})
			}
		}
		if (msplit[1] in args) {
			args[msplit[1]]();
		}
		else if (msplit[1] != undefined) {
			statusReport("WARN: " + user + " gave invalid argument " + msplit[1] + " for command help.");
			bot.sendMessage({to: userID, message: "Invalid argument. Correct use: &help <command>"})
		}
		else {
			bot.sendMessage({to: userID, message: "Commands: \n &help <command> - Lists the commands. (Sends in a Direct Message) \n &ping <argument> - Used to check your connection. \n &rtd - Roll the Dice! \n &version - Lists the version of the bot."});
			statusReport("INFO: Responded to Help from " + user + ".");
		}
	},
	"rtd": function (channelID, user, userID, message, msplit) {
		bot.sendMessage({to: channelID, message: "*rolls the dice*"});
		statusReport("INFO: Rolled the dice for " + user + ".")
		bot.simulateTyping(channelID, function() {
			var die1 = random.integer(1,6)
			var die2 = random.integer(1,6)
			var total = die1 + die2
			bot.setPresence({game: "Roll the Dice"});
			statusReport("INFO: Dice Roll, waiting 3 seconds.")
			setTimeout(function() { 
				bot.sendMessage({to: channelID, message: "I rolled two 6-sided dice. Die one is a " + die1 + " and die two is a " + die2 +". I rolled a total of " + total }); 
				statusReport("INFO: Reported dice roll to " + user + ".");
				bot.setPresence({game: null});
				statusReport("INFO: Dice Roll complete.")
			}, 3000);
		});
	},
	"version": function (channelID, user, userID, message, msplit) {
		statusReport("INFO: Responding to version request from " + user);
		bot.sendMessage({to: userID, message:"I UberBot, am version " + version});
	}
}

var adminCommands = {
	"quit": function (user, message, msplit) {
		if (parseInt(msplit[1])) {
			if (msplit[1] < 121 && msplit[1] > 0) {
				statusReport("ALERT: Bot will shut down in " + msplit[1] + " seconds. Shutdown triggered by " + user);
				setTimeout(function () {
					statusReport("ALERT: Bot is shutting down.");
					setTimeout(function(){
						bot.disconnect();
						process.exit();
					},500);
				},parseInt(msplit[1]*1000));
			}
			else {
				statusReport("WARN: Invalid argument. Argument must be a valid integer between 1 and 120.");
			}
		}
		else if (msplit[1] != undefined) {
			statusReport("WARN: Invalid argument. Argument must be a valid integer between 1 and 120.");
		}
		else {
			statusReport("ALERT: Bot will shut down in 60 seconds. Shutdown triggered by " + user);
			setTimeout(function () {
				statusReport("ALERT: Bot is shutting down.");
				setTimeout(function(){
					bot.disconnect();
					process.exit();
				},500);
			},60000);
		}
	}
}

 
bot.on('ready', function() {
	var d = new Date();
	statusReport("ALERT: UberBot is Online as of " + d.toDateString() + " " + d.toTimeString());
    statusReport("INFO: " + bot.username + " - (" + bot.id + ")");
	//bot.setPresence({game: "Your Mom's House"});
});
 
bot.on('message', function(user, userID, channelID, message, rawEvent) {
	var server = bot.serverFromChannel(channelID);
	var msplit = message.slice(1).toLowerCase().split(" ");
	if (userID != bot.id) { //filter out bot's own messages
		if (message.slice(0,1) == "&") { //look for the command operator
			statusReport("INTERACTION: " + user + ": " + message); //Log messages to disk.
			if (channelID == "129321709533790208") {
				if (msplit[0] in adminCommands) {
					adminCommands[msplit[0]](user, message, msplit);
				}
				else {
					statusReport("WARNING: Unknown Admin command used by " + user);
				}
			}
			else {
				if (msplit[0] in commands) {
					commands[msplit[0]](channelID, user, userID, message, msplit);
				}
				else {
					/*bot.sendMessage({
					to: channelID,
					message: "@" + user + " : Unknown Command."
					}); */
					statusReport("WARNING: " + user + " used unknown command " + message)
				}
			}
		}
	}
});
