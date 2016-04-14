var basicInfo = "**Bot Owner:** UberActivist\n**Bot Language:** Javascript\n**Bot Library:** Discord.io\n**Bot Version:** "


module.exports = function (statusReport) {
	return {
		"triggers": ["info","version"],
		"meta": {
			"name": "Info",
			"usage": "&info",
			"description": "Provides identifying information about this bot."
		},
		"callback": function(channelID, user, userID, message, msplit) {
			var bot = require.main.exports.bot;
			var meta = require.main.exports.meta;
			bot.sendMessage({to: channelID, message: basicInfo + meta.version});
		}
	};
};