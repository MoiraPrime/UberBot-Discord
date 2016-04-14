module.exports = (statusReport) => {
	return {
		"triggers": ["tf2comp","comp"],
		"meta": {
			"name": "TF2 Competitive Stress Test Status Checker",
			"usage": "&tf2comp",
			"description": "Tells you if the TF2 Competitive Stress Test is currently active."
		},
		"callback": function (channelID, user, userID, message, msplit) {
			const bot = require.main.exports.bot,
				api = require.main.exports.api,
				stressTest = require("../plugins/stresstest.js")().stressTest;
			if (stressTest) {
				bot.sendMessage({to: channelID, message: "The stress test is currently active."});
				return;
			}
			bot.sendMessage({to: channelID, message: "The stress test is not currently active."});
		}
	};
}