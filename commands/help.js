module.exports = function (statusReport) {
	return {
		"triggers": ["help"],
		"meta": {
			"name": "Help",
			"usage": "&help <command>",
			"description": "Provides a list of commands, and alternatively provides the specifics of a command when an argument is supplied."
		},
		"callback": function (channelID, user, userID, message, msplit) {
			var bot = require.main.exports.bot;
			var commands = require.main.exports.commands;
			if (msplit[1]&& commands[msplit[1].toLowerCase()]) {
				var command = commands[msplit[1].toLowerCase()];
				if (!command.meta) {
					//No info found.
					bot.sendMessage({to: channelID, message: "Sorry, there is no information available for this command at this time."});
					return;
				}
				bot.sendMessage({to: channelID, message: "**" + command.meta.name + "**\n**Usage:** " + command.meta.usage + "\n" + command.meta.description});
				return;
			}
			var i;
			var list = [];
			for (i in commands) {
				if (i != commands[i].triggers[0]) {
					continue;
				}
				list.push(i);
			}
			list.sort();
			bot.sendMessage({to: userID, message: "**Commands**\n&" + list.join("\n&")});
		}
	};
};