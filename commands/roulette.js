//roulette

var random = require("random-js")();

var rollNumber = {};
var inProgress = {};
var lastRoll = {};
var loaded = {};

module.exports = function(statusReport) {
	return {
		"triggers": ["roulette","spin"],
		"meta": {
			"name": "Russian Roulette",
			"usage": "&roulette or &spin",
			"description": "Play a game of Russian roulette with your friends!"
		},
		"callback": function (channelID, user, userID, message, msplit) {
			var bot = require.main.exports.bot;
			var rtd = random.integer(1,6);
			var i;
			var found = false;
			if (inProgress[channelID]) {
				return;
			}
			if (lastRoll[channelID] == userID) {
				bot.sendMessage({to: channelID, message: "Sorry, but you may not go twice in a row."});
				return;
			}
			if (!loaded[channelID]) {
				loaded[channelID] = random.integer(1,6);
			}
			if (!rollNumber[channelID]) {
				rollNumber[channelID] = 1;
			}
			inProgress[channelID] = true;
			lastRoll[channelID] = userID;
			bot.sendMessage({to: channelID, message: "*" + user + " pulls the trigger...*"})
			setTimeout(function () {
				if (rollNumber[channelID] == loaded[channelID]) {
					bot.sendMessage({to: channelID, message: "Chamber " + rollNumber[channelID].toString() + " of 6: **BANG**\nreloading..."});
					delete lastRoll[channelID];
					delete rollNumber[channelID];
					delete loaded[channelID];
					delete inProgress[channelID];
					return;
				}
				if (rollNumber[channelID] == 5) {
					bot.sendMessage({to: channelID, message: "Chamber 5 of 6: click\nMY TURN!\n*UberBot pulls the trigger...*"});
					setTimeout(function () {
						bot.sendMessage({to: channelID, message: "Chamber 6 of 6: **BANG**\nreloading..."});
						delete lastRoll[channelID];
						delete rollNumber[channelID];
						delete loaded[channelID];
						delete inProgress[channelID];
					},1000);
					return;
				}
				bot.sendMessage({to: channelID, message: "Chamber " + rollNumber[channelID].toString() + " of 6: click"});
				rollNumber[channelID]++;
				inProgress[channelID] = false;
			},1000);
		}
	};
};

