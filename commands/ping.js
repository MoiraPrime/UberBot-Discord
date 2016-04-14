module.exports = function (statusReport) {
	return {
		"triggers": ["ping"],
		"meta": {
			"name": "Ping",
			"usage": "&ping",
			"description": "Check either your or the bot's connection!"
		},
		"callback": function (channelID, user, userID, message, msplit) {
			var bot = require.main.exports.bot
			var args = {
				"justin": function() {
					statusReport("INFO: Responded to ping (type: justin) from " + user);
					bot.sendMessage({to: channelID, message: "Justinisanoob!"});
				}
			}
			if (msplit[1] in args){
				args[msplit[1]]();
			}
			else {
				statusReport("INFO: Responded to ping from " + user);
				bot.sendMessage({to:channelID, message: "Pong!"});
			}
		}
	};
};