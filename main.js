var config = require("./config")

var DiscordClient = require('discord.io');
var bot = new DiscordClient({
    email: config.email,
    password: config.password,
    autorun: true
});

var random = require("random-js")(); // uses the nativeMath engine

function statusReport(report) {
	console.log(report)
	bot.sendMessage({ to: "129321709533790208", message: report})
}


var tempSettings = {quietmode:false}
var dono = ["+Jack","Justin","Kyle","Luke"]
var sama = ["UberActivist","Matt","Phantomazing"]

function toggleQuiet() {
	if (tempSettings.quietmode) {
		tempSettings.quietmode = false
		statusReport("CHANGE: Settings - QuietMode -> Off")
	}
	else {
		tempSettings.quietmode = true
		statusReport("CHANGE: Settings - QuietMode -> On")
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
	if (userID != bot.id) { //filter out bot's own messages
		if (message.slice(0,1) == "&") { //look for the command operator
			statusReport(bot.servers[server].name + " in #" + bot.servers[server].channels[channelID].name + " - " + user + ": " + message); //Log messages to disk.
			if (message.slice(1) == "ping") {
				bot.sendMessage({
					to: channelID,
					message: "@" + user + " : Pong!"
				});
				statusReport("INFO: Responded to Ping from " + user + ".");
			}
			else if (message.slice(1) == "help") {
				bot.sendMessage({to: userID, message: "Commands: \n help - Lists the commands. (Sends in a Direct Message) \n ping - Used to check your connection. \n Use the & operator to use a command."});
				statusReport("INFO: Responded to Help from " + user + ".");
			}
			else if (message.slice(1) == "rtd") {
				bot.sendMessage({to: channelID, message: "*rolls the dice*"});
				statusReport("INFO: Rolled the dice for " + user + ".")
				bot.simulateTyping(channelID, function() {
					var die1 = random.integer(1,6)
					var die2 = random.integer(1,6)
					var total = die1 + die2
					bot.setPresence({game: "Roll the Dice"});
					setTimeout(function() { 
					bot.sendMessage({to: channelID, message: "@" + user + " : I rolled two 6-sided dice. Die one is a " + die1 + " and die two is a " + die2 +". I rolled a total of " + total }); 
					statusReport("INFO: Reported dice roll to " + user + ".");
					bot.setPresence({game: null});
					}, 3000);
				});
			}
			else if (message.slice(1) == "version") {
				//NYI
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
});
