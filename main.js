var DiscordClient = require('discord.io');
var bot = new DiscordClient({
    email: "REDACTED",
    password: "REDACTED, nice try dummy.",
    autorun: true
});

var random = require("random-js")(); // uses the nativeMath engine


var tempSettings = {quietmode:false}
var dono = ["+Jack","Justin","Kyle","Luke"]
var sama = ["UberActivist","Matt","Phantomazing"]

function toggleQuiet() {
	if (tempSettings.quietmode) {
		tempSettings.quietmode = false
		console.log("Settings - QuietMode -> Off")
	}
	else {
		tempSettings.quietmode = true
		console.log("Settings - QuietMode -> On")
	}
}
 
bot.on('ready', function() {
	console.log("UberBot is Active")
    console.log(bot.username + " - (" + bot.id + ")");
});
 
bot.on('message', function(user, userID, channelID, message, rawEvent) {
    console.log(channelID + " - " + user + ": " + message); //Log messages to disk.
	if (message.slice(0,1) == "!") {
		if (message.slice(1) == "ping") {
			bot.sendMessage({
				to: channelID,
				message: "@" + user + " : Pong!"
			});
		}
		else if (message.slice(1) == "help") {
			bot.sendMessage({to: userID, message: "Commands: \n help - Lists the commands. (Sends in a Direct Message) \n ping - Used to check your connection. \n Use the ! operator to use a command."});

		}
		else if (message.slice(1) == "rtd") {
			bot.sendMessage({to: channelID, message: "*rolls the dice*"});
			bot.simulateTyping(channelID, function() {
				var die1 = random.integer(1,6)
				var die2 = random.integer(1,6)
				var total = die1 + die2
				setTimeout(function() { 
				bot.sendMessage({to: channelID, message: "@" + user + " : I rolled two 6-sided dice. Die one is a " + die1 + " and die two is a " + die2 +". I rolled a total of " + total }); 
				}, 5000);
			});
		}
		else {
			bot.sendMessage({
			to: channelID,
			message: "@" + user + " : Unknown Command."
			});
		}
	}
});
