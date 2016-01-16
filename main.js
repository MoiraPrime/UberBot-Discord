var config = require("./config")
var http = require('http');
var version = "1.0.0 using Discord.io version 1.6.0."

var DiscordClient = require('discord.io');
var bot = new DiscordClient({
    email: config.email,
    password: config.password,
    autorun: true
});

var random = require("random-js")(); // uses the nativeMath engine
var fs = require("fs")

function handleRequest(request, response){
    response.end('UberBot '+version+' is Online.');
	console.log("HTTP RESPONSE")
}

var server = http.createServer(handleRequest);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

server.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});

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
			},
			"info": function() {
				statusReport("INFO: Responded to help with argument info from " + user);
				bot.sendMessage({to: userID, message: "&info - Provides basic information about the bot."})
			},
			"boobs": function() {
				statusReport("INFO: Responded to help with argument boobs from " + user);
				bot.sendMessage({to: userID, message: "&info <argument> - Provides you with a picture of boobs. Alternatively, use the jack argument for a picture of jack."})
			},
			"lenny": function() {
				statusReport("INFO: Responded to help with argument lenny from " + user)
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
			bot.sendMessage({to: userID, message: "Commands: \n &help <command> - Lists the commands. (Sends in a Direct Message) \n &ping <argument> - Used to check your connection. \n &rtd - Roll the Dice! \n &version - Lists the version of the bot. \n &info - Provides basic information about the bot. \n &boobs <argument> - Provides the requestee with a picture of boobs. \n &lenny - Sends a lenny face to the current channel."});
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
	},
	"info": function (channelID, user, userID, message, msplit) {
		statusReport("INFO: Responding to info request from " + user);
		bot.sendMessage({to: channelID, message:"Name: UberBot (1.0.0) \n Author: UberActivist (@UberActivist on twitter) \n Library: Discord.io (1.6.0) by izy521"});
	},
	"boobs": function (channelID, user, userID, message, msplit) {
		var args = {
			"jack": function () {
				statusReport("INFO: Responding to boob (type:jack) request from " + user);
				bot.sendMessage({to:channelID, message:"Here's a picture of a boob! https://images.discordapp.net/eyJ1cmwiOiJodHRwczovL2Rpc2NvcmQuczMuYW1hem9uYXdzLmNvbS9hdHRhY2htZW50cy8xMzAyMTczMjM1NDA5MDU5ODQvMTMxMzM2MjYwMTMxMzU2NjcyL2Jvb2IuanBnIn0.ZRh31bSxEs9KbxziLO-8-97T1ZE.jpg"});
			}
		}
		if (msplit[1] && msplit[1] in args) {
			args[msplit[1]]();
		}
		else{
		statusReport("INFO: Responding to boob request from " + user);
		bot.sendMessage({to:channelID, message:"Here's a picture of boobs! https://images.discordapp.net/.eJwNyFEOgyAMANC7cAAKFBh6m4rbNBFrbJclGu-un--d5rcvpjeT6iY9wDhL5X20gpYaHbzSX2zlBqRKdWrvVQU8uuBfGDBF17nUlfiUx4c5p1hcLpgCDMyD2O_8MdcNskcfHQ.dVYeqF7C2_odrix_jOdnXqFiAEE.gif"});
		}
	},
	"lenny": function (channelID, user, userID, message, msplit) {
		statusReport("INFO: Responding to lenny request from " + user);
		bot.sendMessage({to:channelID, message:"( ͡° ͜ʖ ͡°)"});
	},
	"google": function (channelID, user, userID, message, msplit) {
		statusReport("INFO: Responding to google request from " + user)
		var google = require('google')
		google.resultsPerPage = 5
		google(message.slice(7), function (err, next, links) {
			 if (err) {console.error(err)}
			 for (i = 0; i < 5; i++) {
				 if (links[i].link) {
					 bot.sendMessage({to:channelID, message: links[i].title + "\n" + links[i].link});
					break;
				 }
				 else if (i===5) {
					 bot.sendMessage({to:channelID, message: "Sorry! None of the first 5 results returned any links."});
				 }
			 }
		});
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
	},
	"servers": function (user, message, msplit) {
		statusReport("__**Server Name, Server ID**__");
		setTimeout(function(){
			for (x in bot.servers) {
				statusReport(bot.servers[x].name + ", " + bot.servers[x].id);
			}
		},100)
	},
	"channels": function (user, message, msplit) {
		if (msplit[1] && bot.servers[msplit[1]]) {
			statusReport("__**Channel Name, Channel ID**__")
			setTimeout(function(){
				for (x in bot.servers[msplit[1]].channels) {
					statusReport(bot.servers[msplit[1]].channels[x].name + ", " + bot.servers[msplit[1]].channels[x].id)
				}
			},100);
		}
		else {
			statusReport("Please supply a server ID first.")
		}
	},
	"say": function (user, message, msplit) {
		if (msplit[1] && msplit[2]) {
			bot.sendMessage({to: msplit[1], message: message.slice(msplit[1].length+6)})
			statusReport("INFO: " + user + " sent message to " + msplit[1])
		}
		else {
			statusReport("Invalid Arguments for command.")
		}
	},
	"joinbyurl": function (user, message, msplit) {
		if (msplit[1] && msplit[1].slice(0,19) === "https://discord.gg/") {
			bot.acceptInvite(message.slice(30),function(response) {
				statusReport("INFO: Attempted to accept invite with response: " + response);
			});
		}
		else {
			statusReport("Invalid Arguments for command.");
		}
	},
	"leaveserver": function (user, message, msplit) {
		if (msplit[1]) {
			bot.deleteServer(msplit[1]);
		}
		else{
			statusReport("Please supply a server ID first.");
		}
	}
}

 
bot.on('ready', function() {
	var d = new Date();
	statusReport("New Session of UberBot Initialized. Session ID: " + random.integer(100000,199999));
	statusReport("ALERT: UberBot is Online as of " + d.toDateString() + " " + d.toTimeString());
    statusReport("INFO: Logged in as " + bot.username + " with UID " + bot.id);
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
					message: "<@" + userID + " : Unknown Command."
					}); */
					statusReport("WARNING: " + user + " used unknown command " + message);
				}
			}
		}
		else if (message.indexOf("ayy") >= 0) {
			bot.sendMessage({to:channelID, message: "lmao"});
		}
	}
});
