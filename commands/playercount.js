module.exports = function (statusReport) {
	return {
		"triggers": ["numplayers","players"],
		"meta": {
			"name": "Player Count for Steam Games",
			"usage": "&numplayers <appid>",
			"description": "Check the player count for a specific steam game or app."
		},
		"callback": function (channelID, user, userID, message, msplit) {
			var bot = require.main.exports.bot;
			var api = require.main.exports.api;
			if (!msplit[1]) {
				bot.sendMessage({to: channelID, message: "You must specify a valid steam app ID!"});
				return;
			}
			api.get("ISteamUserStats","GetNumberOfCurrentPlayers","1",{"appid": msplit[1]}, function (err, response) {
				if (err) {
					bot.sendMessage({to: channelID, message: "There was a problem with the app ID you provided. Be sure it was a proper ID, and try again later."});
					return;
				}
				bot.sendMessage({to: channelID, message: "Number of players for " + msplit[1] + ": " + response.player_count});
			});
		}
	};
};